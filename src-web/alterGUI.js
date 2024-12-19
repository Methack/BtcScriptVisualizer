// Michal Jireš <xjires02> 2022
// Funkce pro změny gui

//Kontrolá správné délky vstupu a obarvení tlačítka submit
function validateInput(lower){
    let txid = lower ? document.getElementById('txid1').value : document.getElementById('txid2').value;
    let submitColor = txid.length == 64 ? "#f7931a" : "#a6a6a6";
    let submitId = lower ? "lowerSubmit" : "upperSubmit";
    document.getElementById(submitId).style.backgroundColor = submitColor;
}

//Pokud je TXID korektní volá funkci pro získávání jsonů obsahující potřebné informace o transakci
function requestTransaction(lower){
    let txid = lower ? document.getElementById('txid1').value : document.getElementById('txid2').value;
    if(txid.length == 64 && txid != curTXID){
        if(!lower){
            document.getElementById("vis").style.visibility = "hidden";
            prepareForNewTXID();
        }else{
            document.getElementById("lowerForm").style.visibility = "hidden";
            document.getElementById("txid2").value = txid;
            document.getElementById("upperForm").style.visibility = "visible";
        }
        document.getElementById("main").style.visibility = "hidden";
        validateInput(0);
        curTXID = txid;
        getScriptInfo(txid);
    }
}


//Volá se při hledání více nových transakcí za sebou
function prepareForNewTXID(){
    let parent = document.getElementById("vins");
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
    scripts = [];
    steps = [];
    curVin = undefined;
    curStep = 0;
    clearInterval(requestInterval);
}

 //Volá se při získání dostatečných informací o daném vin, slouží k vytvoření tlačítka pro onen konkrétní vin
 function makeVinButton(vinID){
    let child = document.createElement("button");
    child.onclick = function (){
        let vin = this.innerHTML.slice(3).split(" ")[0];
        if(curVin != vin)
            repaintVin(vin);
    }
    let type = scripts[vinID].type;
    child.textContent = "vin"+vinID+" | "+type;
    child.setAttribute("id", "vin"+vinID);
    document.getElementById("vins").appendChild(child);
}

//Vytvoří tlačítka kroků při změně vin
function makeStepButtons(vinID){
    parent = document.getElementById("steps");
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
    for(let i = 0; i < steps[vinID].length; i++){
        let child = document.createElement("button");
        child.onclick = function (){
            let step = this.innerHTML.slice(4);
            if(curStep != step)
                repaintStep(step);
        }
        child.textContent = "step"+i;
        child.setAttribute("id", "step"+i);
        parent.appendChild(child);
    }
}

//Volá se při překliknutí na jiné vin
function repaintVin(index){
    if(curVin != undefined)
        document.getElementById("vin"+curVin).className = "";
    curVin = parseInt(index);
    document.getElementById("vin"+curVin).className = "selectedButton";
    document.getElementById("vin"+curVin).scrollIntoView({behavior:"smooth", block:"center", inline:"center"});
    makeStepButtons(index);
    curStep = 0;
    repaintStep(0);
}

//Volá se při změně stepu, přepíše informace ze stacku a ops na aktuální podle čísla stepu
function repaintStep(step){
    document.getElementById("step"+curStep).className = "";
    curStep = parseInt(step);
    document.getElementById("step"+curStep).className = "selectedButton";
    document.getElementById("step"+curStep).scrollIntoView({behavior:"smooth", block:"center", inline:"center"});
    if(step == 0)
        document.getElementById("prevButton").style.visibility = "hidden";
    else
        document.getElementById("prevButton").style.visibility = "inherit";

    if(step == steps[curVin].length-1)
        document.getElementById("nextButton").style.visibility = "hidden";
    else
        document.getElementById("nextButton").style.visibility = "inherit";

    let ops = [...steps[curVin][0].ops];
    let stack = [...steps[curVin][step].stack];
    repaint("opsArea", ops, false);
    let finishedOPS = document.getElementsByClassName("finishedOP");
    if(finishedOPS.length > 0)
        finishedOPS[finishedOPS.length-1].scrollIntoView({behavior:"smooth", block:"center", inline:"center"});
    else
        document.getElementById("opsArea").firstChild.scrollIntoView({behavior:"smooth", block:"center", inline:"center"});
    repaint("stackArea", stack, true);
}


//Přepíše elementy v poly na aktuální
function repaint(id, elements, isStack){
    let parent = document.getElementById(id);
    let stopper;
    let paintGenerated = false;
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
    if(!isStack){
        stopper = steps[curVin][curStep].ops.length;
    }
    while(elements.length > 0){ 
        let child = document.createElement("p");
        if(isStack){
            child.textContent = elements.pop();
        }else{
            if(elements.length > stopper)
                child.className += " finishedOP ";
            let element = elements.shift();
            if(element == "|#END#|" || element == "|#START#|"){
                paintGenerated = !paintGenerated;
                continue;
            }
            child.textContent = element;
            if(paintGenerated)
                child.className += " generatedOP ";
        }
        parent.appendChild(child);
    }
}