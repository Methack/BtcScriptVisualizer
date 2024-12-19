// Michal Jireš <xjires02> 2022
// Funkce pro získávání informací

/*
 *  ------  Globální proměnné  ------ 
 */
//Obsahuje informace o jednotlivých vin (formát vin : {"scriptSig": "","ops": "","type": ""} nebo {"scriptSig": "","ops": "","type": "","witness": []})
var scripts = [];
//Obsahuje jednotlivé kroky vykonaného scriptu (formát kroku : {"stack":[], "ops":"", altStack:[]})
var steps = [];
//Obsahuje txid posledně hledané transakce
var curTXID = "";
//Obsahuje index právě zobrazeného vin
var curVin;
//Obsahuje index práve zobrazeného stepu
var curStep = 0;
//Odkaz na interval, který se používá při načítání vout
var requestInterval;

//Načtě všechny potřebné informace a uloží je do globální proměnné scripts
async function getScriptInfo(txid){
    if(!(vinJson = await sendRequest(txid))){
        console.log("error - žádné API nebylo schopné načíst transakci");
        return false;
    }
    console.log(vinJson);
    
    let voutsToRequest = [];

    //Informace z původní txid a její vin
    for (let i = 0; i < vinJson.vin.length; i++) {
        voutsToRequest.push({txid:vinJson.vin[i].txid,vout:vinJson.vin[i].vout});
        let obj = {scriptSig:vinJson.vin[i].scriptSig.asm, ops:"", type:""};
        if("txinwitness" in vinJson.vin[i])
            obj.witness = vinJson.vin[i].txinwitness;
        scripts.push(obj);
        if(vinJson.vin[i].scriptSig.hex.substring(0,6) == "160014" && vinJson.vin[i].scriptSig.hex.length == 46){
            scripts[i].type = "P2SH-P2WPKH";
        }else if(vinJson.vin[i].scriptSig.hex.substring(0,6) == "220020" && vinJson.vin[i].scriptSig.hex.length == 70){
            scripts[i].type = "P2SH-P2WSH";

        }
    }

    //Postupné získávání informací jednotlivých vout
    requestInterval = setInterval(async function(){
        if(voutsToRequest.length == 0){
            clearInterval(requestInterval);
            return;
        }
        let index = scripts.length - voutsToRequest.length;
        console.log("Jsem v intervalu "+index);
        let singleVout = voutsToRequest.shift();
        voutJson = await sendRequest(singleVout.txid, index+1);
        let curVout = voutJson.vout[singleVout.vout];
        scripts[index].ops = curVout.scriptPubKey.asm;

        //Rozlišení přidaných operací jednotlivých druhů scriptů
        if(scripts[index].type == ""){
            if(curVout.scriptPubKey.hex.substring(0,4) == "0020" && curVout.scriptPubKey.hex.length == 68){
                scripts[index].type = "P2WSH";
                scripts[index].ops = "OP_DUP OP_SHA256 "+scripts[index].ops+" OP_SWAP OP_DROP OP_EQUALVERIFY ";
                let scriptCode = scripts[index].witness[scripts[index].witness.length-1];
                let deserCode = decodeOps(scriptCode);
                scripts[index].ops += deserCode;
            }else if(curVout.scriptPubKey.hex.substring(0,4) == "0014" && curVout.scriptPubKey.hex.length == 44){
                scripts[index].type = "P2WPKH";
                scripts[index].ops = "OP_DUP OP_HASH160 "+scripts[index].ops+" OP_SWAP OP_DROP OP_EQUALVERIFY OP_CHECKSIG";
            }else if(curVout.scriptPubKey.hex.substring(0,4) == "a914" && curVout.scriptPubKey.hex.length == 46 && curVout.scriptPubKey.hex.substring(44,46) == "87"){
                scripts[index].type = "P2SH";
                scripts[index].ops = "OP_DUP "+scripts[index].ops+" OP_VERIFY ";
                let start = scripts[index].scriptSig.lastIndexOf(" ")+1;
                let scriptCode = scripts[index].scriptSig.substring(start);
                let deserCode = decodeOps(scriptCode);
                scripts[index].ops += deserCode;
            }else if(curVout.scriptPubKey.hex.substring(0,6) == "76a914" && curVout.scriptPubKey.hex.length == 50 && curVout.scriptPubKey.hex.substring(46,50) == "88ac"){
                scripts[index].type = "P2PKH";
            }else if(curVout.scriptPubKey.hex.substring(0,2) == "21" && curVout.scriptPubKey.hex.length == 70 && curVout.scriptPubKey.hex.substring(68,70) == "ac"){
                scripts[index].type = "P2PK";
            }else{
                scripts[index].type = curVout.scriptPubKey.type;
            }
        }else if(scripts[index].type == "P2SH-P2WPKH"){
            scripts[index].ops = "OP_DUP OP_HASH160 "+scripts[index].scriptSig+" OP_DUP "+scripts[index].ops+" OP_VERIFY ";
            let scriptCode = scripts[index].scriptSig;
            let deserCode = decodeOps(scriptCode);
            scripts[index].ops += deserCode;
            scripts[index].ops += " OP_SWAP OP_DROP OP_EQUALVERIFY OP_CHECKSIG";      
        }else if(scripts[index].type == "P2SH-P2WSH"){
            scripts[index].ops = "OP_DUP OP_SHA256 "+scripts[index].scriptSig+" OP_DUP "+scripts[index].ops+" OP_VERIFY ";
            let scriptCode = scripts[index].scriptSig;
            let deserCode = decodeOps(scriptCode);
            scripts[index].ops += deserCode;
            scripts[index].ops += " OP_SWAP OP_DROP OP_EQUALVERIFY ";
            scriptCode = scripts[index].witness[scripts[index].witness.length-1];
            deserCode = decodeOps(scriptCode);
            scripts[index].ops += deserCode;
        }

        runScript(index);
        makeVinButton(index);
        if(index == 0){   
            repaintVin(0);
            document.getElementById("main").style.visibility = "visible";
            document.getElementById("vis").style.visibility = "visible";
            document.getElementById('stop').style.visibility = 'visible';
        }
        if(voutsToRequest.length == 0){
            clearInterval(requestInterval);
            document.getElementById('stop').style.visibility = 'hidden';
            console.log("All needed information was successfully gathered");
            console.log(scripts);
        }
    }, 250);
}

//Krokuje získaný bitcoin script a jednotlivé kroky ukládá do globální proměnné steps[vin][step]
function runScript(index){
    steps[index] = [];
    let curScript = scripts[index];
    let ops = curScript.ops.split(" ");
    let stack = [];
    let altStack = [];
    let tags = {};

    if("witness" in curScript){
        let stackS = curScript.witness;
        for (let i = curScript.witness.length-1; i >= 0; i--) {
            ops.unshift(curScript.witness[i]);   
        }
    }

    if(!(curScript.type == "P2SH-P2WPKH" || curScript.type == "P2SH-P2WSH")){
        let stackS = curScript.scriptSig.replace(/[^a-z0-9 ]/g, '').split(" ");
        while(stackS.length > 0){
            let item = stackS.pop();
            if(item != ""){
                ops.unshift(item);
            }
        }
    }
    
    steps[index].push({stack:[...stack], ops:[...ops], altStack:[...altStack]});
    while(ops.length != 0){
        makeOneStep(stack, ops, altStack, tags);
        steps[index].push({stack:[...stack], ops:[...ops], altStack:[...altStack]});
        if(ops[0] == "|#END#|"){
            ops.shift();
        }
        if(ops[0] == "|#START#|"){
            ops.shift();
            stack.pop();
        }
    }
}


//Pomocí funkce fetch získává potřebné informace ze tří možných serverů
//Je snaha o jednoduchý load balancing mezi servery btc1.trezor.io a btc2.trezor.io, server fitu je k dispozici jako záložní
async function sendRequest(txid, a = 0){
    let url = "https://www.stud.fit.vutbr.cz/~xjires02/BDA/proxy.php?txid="+txid;
    let url2 = "https://www.stud.fit.vutbr.cz/~xjires02/BDA/proxy.php?txid="+txid+"&server=2";
    let urlfit = "https://www.stud.fit.vutbr.cz/~xjires02/BDA/proxy.php?txid="+txid+"&fit=1";

    let urls = [];
    if(a % 2 == 0)
        urls = [url, url2, urlfit];
    else
        urls = [url2, url, urlfit];

    for (let i = 0; i < urls.length; i++) {
        console.log("Sending request to url "+ urls[i]);
        const response = await fetch(urls[i]);
        if(response.status != 200)
            continue;
        const responseJson = await response.json();
        if("vin" in responseJson){
            console.log("Response from url "+ urls[i]);
            return responseJson;
        }    
    }
    return false;
}