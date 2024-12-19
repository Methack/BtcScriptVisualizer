// Michal Jireš <xjires02> 2022
// Implementace operací bitcoin scriptu
// (viz. https://en.bitcoin.it/wiki/Script#Script_examples)

/*
 *  ------  CONSTANTS  ------ 
 */
//všechny push constanty
function sPUSH(stack, data){
    stack.push(data);
}

/*
 *  ------  FLOW CONTROL  ------ 
 */

function sTOPtrue(stack){
    let top = stack.pop();
    return top == 0 ? false : true;
}

function sTOPfalse(stack){
    let top = stack.pop();
    return top == 0 ? true : false;
}

function sITERtill(ops, stop){
    let indicator = 0;
    while(ops.length > 0){
        let op = ops.shift();
        if (op == stop && indicator == 0)
            break; 
        if(op == "OP_IF" || op == "OP_NOTIF")
            indicator++;
        if(op == "OP_ENDIF")
            indicator--;
    }
}

/*
 *  ------  STACK  ------ 
 */

function sTOALTSTACK(stack, alt){
    alt.push(stack.pop());
}

function sFROMALTSTACK(stack, alt){
    stack.push(alt.pop());
}


function sIFDUP(stack){
    let top = stack.pop();
    stack.push(top);
    if(top != 0)
        stack.push(top);
}

function sDEPTH(stack){
    stack.push(stack.length);
}

function sDROP(stack, n){
    for (let i = 0; i < n; i++) {
        stack.pop();
    }
}

function sDUP(stack){
    let top = stack.pop();
    stack.push(top);
    stack.push(top);
}

function sNIP(stack){
    let top = stack.pop();
    stack.pop();
    stack.push(top);
}

//nDUP = sPICK(stack, n)*n, 2OVER = sPICK(stack, )
function sPICK(stack, n){
    stack.push(stack[stack.length-n]);
}

//SWAP = sROLL(stack, 2), ROT = sROLL(stack, 3), SWAP2 = sROLL(stack, 4);sROLL(stack, 4), 2ROT...
function sROLL(stack, n){
    let altStack = [];
    for (let i = 0; i < n-1; i++) {
        altStack.push(stack.pop());
    }
    let desired = stack.pop();
    for (let i = 0; i < n-1; i++) {
        stack.push(altStack.pop());
    }
    stack.push(desired);
}

/*
 *  ------  SPLICE  ------ 
 */

function sSIZE(stack){
    let top = stack.pop();
    stack.push(top);
    stack.push(top.toString().length);
}

/*
 *  ------  BITWISE  ------ 
 */

function sEQUAL(stack){
    let top1 = stack.pop();
    let top2 = stack.pop();
    let val = top1 == top2 ? 1 : 0;
    stack.push(val);
}

/*
 *  ------  ARITHMETIC  ------ 
 */

function sADDnum(stack, num){
    let top = parseInt(stack.pop());
    stack.push(top + num);
}

function sNEGATE(stack){
    let top = parseInt(stack.pop());
    stack.push(top * (-1));
}

function sABS(stack){
    let top = parseInt(stack.pop());
    if(top >= 0)
        stack.push(top);
    else
        stack.push(top * (-1));
}

function sNOT(stack){
    let top = parseInt(stack.pop());
    if(top == 0)
        stack.push(1);
    else
        stack.push(0);
}

function sNOTEQUAL(stack){
    let top = stack.pop();
    if(top == 0)
        stack.push(0);
    else
        stack.push(1);
}

function sADD(stack){
    let a = parseInt(stack.pop());
    let b = parseInt(stack.pop());
    stack.push(a + b);
}

function sSUB(stack){
    let a = parseInt(stack.pop());
    let b = parseInt(stack.pop());
    stack.push(a - b);
}

function sBOOLAND(stack){
    let a = parseInt(stack.pop());
    let b = parseInt(stack.pop());
    if(a != 0 && b != 0)
        stack.push(1);
    else
        stack.push(0);   
}

function sBOOLOR(stack){
    let a = parseInt(stack.pop());
    let b = parseInt(stack.pop());
    if(a != 0 || b != 0)
        stack.push(1);
    else
        stack.push(0);   
}

function sNUMEQUAL(stack){
    let a = stack.pop();
    let b = stack.pop();
    if(a == b)
        stack.push(1);
    else
        stack.push(0); 
}

function sNUMNOTEQUAL(stack){
    let a = stack.pop();
    let b = stack.pop();
    if(a == b)
        stack.push(0);
    else
        stack.push(1); 
}

function sLESSTHAN(stack){
    let a = parseInt(stack.pop());
    let b = parseInt(stack.pop());
    if(a < b)
        stack.push(1);
    else
        stack.push(0); 
}

function sGREATERTHAN(stack){
    let a = parseInt(stack.pop());
    let b = parseInt(stack.pop());
    if(a > b)
        stack.push(1);
    else
        stack.push(0); 
}

function sLESSTHANOREQUAL(stack){
    let a = parseInt(stack.pop());
    let b = parseInt(stack.pop());
    if(a <= b)
        stack.push(1);
    else
        stack.push(0); 
}

function sGREATERTHANOREQUAL(stack){
    let a = parseInt(stack.pop());
    let b = parseInt(stack.pop());
    if(a >= b)
        stack.push(1);
    else
        stack.push(0); 
}

function sMIN(stack){
    let a = parseInt(stack.pop());
    let b = parseInt(stack.pop());
    if(a < b)
        stack.push(a);
    else
        stack.push(b); 
}

function sMAX(stack){
    let a = parseInt(stack.pop());
    let b = parseInt(stack.pop());
    if(a < b)
        stack.push(b);
    else
        stack.push(a); 
}

function sWITHIN(stack){
    let a = parseInt(stack.pop());
    let b = parseInt(stack.pop());
    let x = stack.pop();
    if(x >= min && x < max)
        stack.push(1);
    else
        stack.push(0); 
}

/*
 *  ------  CRYPTO  ------ 
 */

function sRIPEMD160(stack){
    let top = stack.pop();
    stack.push(CryptoJS.RIPEMD160(CryptoJS.enc.Hex.parse(top)).toString());
}

function sSHA1(stack){
    let top = stack.pop();
    stack.push(CryptoJS.SHA1(CryptoJS.enc.Hex.parse(top)).toString());
}

function sSHA256(stack){
    let top = stack.pop();
    stack.push(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(top)).toString());
}

function sHASH160(stack){
    let top = stack.pop();
    stack.push(CryptoJS.RIPEMD160(CryptoJS.enc.Hex.parse(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(top)).toString())).toString());
}

function sHASH256(stack){
    let top = stack.pop();
    stack.push(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(top)).toString())).toString());
}


//TODO -- nutné implementovat ???
function sCHECKSIG(stack){
    sDROP(stack, 2);
    sPUSH(stack, 1);
}

function sCHECKMULTISIG(stack){
    for (let a = stack.pop(); a > 0; a--) {
        stack.pop();
    }
    for (let a = stack.pop()+1; a > 0; a--) {
        stack.pop();
    }
    sPUSH(stack, 1);
}


//Provede jeden krok
function makeOneStep(stack, ops, altStack, tags){
    let op = ops.shift();
    switch(op.substring(0,4)){
        case "OP_0" : {
            switch(op){
                case "OP_0NOTEQUAL" : {
                    sNOTEQUAL(stack);
                    return true;
                }
                case "OP_0" : {
                    sPUSH(stack, 0);
                    return true;
                }
            }
            break;
        }
        case "OP_1" : {
            switch(op){
                case "OP_1SUB" : {
                    sADDnum(stack, -1);
                    return true;
                }
                case "OP_1ADD" : {
                    sADDnum(stack, 1);
                    return true;
                }
                case "OP_1" : {
                    sPUSH(stack, 1);
                    return true;
                }
                case "OP_1NEGATE" : {
                    sPUSH(stack, -1);
                    return true;
                }
            }
            break;
        }
        case "OP_2" : {
            switch(op){
                case "OP_2DROP" : {
                    sDROP(stack, 2);
                    return true;
                }
                case "OP_2DUP" : {
                    sPICK(stack, 2);
                    sPICK(stack, 2);
                    return true;
                }
                case "OP_2OVER" : {
                    sPICK(stack, 4);
                    sPICK(stack, 4);
                    return true;
                }
                case "OP_2ROT" : {
                    sROLL(stack, 6);
                    sROLL(stack, 6);
                    return true;
                }
                case "OP_2SWAP" : {
                    sROLL(stack, 4);
                    sROLL(stack, 4);
                    return true;
                }
                case "OP_2" : {
                    sPUSH(stack, 2);
                    return true;
                }
            }
            break;
        }
        case "OP_3" : {
            switch(op){
                case "OP_3DUP" : {
                    sPICK(stack, 3);
                    sPICK(stack, 3);
                    sPICK(stack, 3);
                    return true;
                }
                case "OP_3" : {
                    sPUSH(stack, 3);
                    return true;
                }
            }
            break;
        }
        case "OP_A" : {
            switch(op){
                case "OP_ADD" : {
                    sADD(stack);
                    return true;
                }
                case "OP_ABS" : {
                    sABS(stack);
                    return true;
                }
            }
            break;
        }
        case "OP_B" : {
            switch(op){
                case "OP_BOOLOR" : {
                    sBOOLAND(stack);
                    return true;
                }
                case "OP_BOOLAND" : {
                    sBOOLOR(stack);
                    return true;
                }
            }
            break;
        }
        case "OP_C" : {
            switch(op){
                case "OP_CHECKSIG" : {
                    sCHECKSIG(stack);
                    return true;
                }
                case "OP_CHECKSIGVERIFY" : {
                    sCHECKMULTISIG(stack);
                    return stack.pop();
                }
                case "OP_CHECKMULTISIG" : {
                    sCHECKMULTISIG(stack);
                    return true;
                }
                case "OP_CHECKMULTISIGVERIFY" : {
                    sCHECKMULTISIG(stack);
                    return stack.pop();
                }
                case "OP_CHECKLOCKTIMEVERIFY" : {
                    return true;
                }
                case "OP_CHECKSEQUENCEVERIFY" : {
                    return true;
                }
            }
            break;
        }
        case "OP_D" : {
            switch(op){
                case "OP_DUP" : {
                    sDUP(stack);
                    return true;
                }
                case "OP_DROP" : {
                    sDROP(stack, 1);
                    return true;
                }
                case "OP_DEPTH" : {
                    sDEPTH(stack);
                    return true;
                }
            }
            break;
        }
        case "OP_E" : {
            switch(op){
                case "OP_EQUAL" : {
                    sEQUAL(stack);
                    return true;
                }
                case "OP_EQUALVERIFY" : {
                    sEQUAL(stack);
                    return stack.pop();
                }
                case "OP_ENDIF" : {
                    return true;
                }
                case "OP_ELSE" : {
                    if("else" in tags){
                        if(tags.else){
                            sITERtill(ops, "OP_ENDIF");
                        }
                        tags.else = false;
                    }
                    return true;
                }
            }
            break;
        }
        case "OP_F" : {
            switch(op){
                case "OP_FALSE" : {
                    sPUSH(stack, 0);
                    return true;
                }
                case "OP_FROMALTSTACK" : {
                    sFROMALTSTACK(stack, altStack);
                    return true;
                }
            }
            break;
        }
        case "OP_G" : {
            switch(op){
                case "OP_GREATERTHAN" : {
                    sGREATERTHAN(stack);
                    return true;
                }
                case "OP_GREATERTHANOREQUAL" : {
                    sGREATERTHANOREQUAL(stack);
                    return true;
                }
            }
            break;
        }
        case "OP_H" : {
            switch(op){
                case "OP_HASH160" : {
                    sHASH160(stack);
                    return true;
                }
                case "OP_HASH256" : {
                    sHASH256(stack);
                    return true;
                }
            }
            break;
        }
        case "OP_I" : {
            switch(op){
                case "OP_IF" : {
                    let top = stack.pop();
                    if(top){
                        tags.else = true;
                    }else{
                        sITERtill(ops, "OP_ELSE");
                    }
                    return true;
                }
                case "OP_IFDUP" : {
                    sIFDUP(stack);
                    return true;
                }
            }
            break;
        }
        case "OP_L" : {
            switch(op){
                case "OP_LESSTHAN" : {
                    sLESSTHAN(stack);
                    return true;
                }
                case "OP_LESSTHANOREQUAL" : {
                    sLESSTHANOREQUAL(stack);
                    return true;
                }
            }
            break;
        }
        case "OP_M" : {
            switch(op){
                case "OP_MIN" : {
                    sMIN(stack);
                    return true;
                }
                case "OP_MAX" : {
                    sMAX(stack);
                    return true;
                }
            }
            break;
        }
        case "OP_N" : {
            switch(op){
                case "OP_NUMEQUAL" : {
                    sNUMEQUAL(stack);
                    return true;
                }
                case "OP_NUMEQUALVERIFY" : {
                    sNUMEQUAL(stack);
                    return stack.pop();
                }
                case "OP_NUMNOTEQUAL" : {
                    sNUMNOTEQUAL(stack);
                    return true;
                }
                case "OP_NOT" : {
                    sNOT(stack);
                    return true;
                }
                case "OP_NEGATE" : {
                    sNEGATE(stack);
                    return true;
                }
                case "OP_NIP" : {
                    sNIP(stack);
                    return true;
                }
                case "OP_NOP" : {
                    return true;
                }
                case "OP_NOTIF" : {
                    let top = stack.pop();
                    if(!top){
                        tags.else = true;
                    }else{
                        sITERtill(ops, "OP_ELSE");
                    }
                    return true;
                }
            }
            break;
            
        }
        case "OP_O" : {
            if(op == "OP_OVER"){
                sPICK(stack, 2);
                return true;
            }
            break;
        }
        case "OP_P" : {
            switch(op){
                case "OP_PUSHDATA1" : {
                    return true;
                }
                case "OP_PUSHDATA2" : {
                    return true;
                }
                case "OP_PUSHDATA4" : {
                    return true;
                }
                case "OP_PICK" : {
                    let top = stack.pop();
                    sPICK(stack, top);
                    return true;
                }
            }
            break;
        }
        case "OP_R" : {
            switch(op){
                case "OP_RIPEMD160" : {
                    sRIPEMD160(stack);
                    return true;
                }
                case "OP_ROT" : {
                    sROLL(stack, 3);
                    return true;
                }
                case "OP_ROLL" : {
                    let top = stack.pop();
                    sROLL(stack, top);
                    return true;
                }
                case "OP_RETURN" : {
                    return false;
                }
            }
            break;
        }
        case "OP_S" : {
            switch(op){
                case "OP_SWAP" : {
                    sROLL(stack, 2);
                    return true;
                }
                case "OP_SHA1" : {
                    sSHA1(stack);
                    return true;
                }
                case "OP_SHA256" : {
                    sSHA256(stack);
                    return true;
                }
                case "OP_SUB" : {
                    sSUB(stack);
                    return true;
                }
                case "OP_SIZE" : {
                    sSIZE(stack);
                    return true;
                }
            }
            break;
        }
        case "OP_T" : {
            switch(op){
                case "OP_TUCK" : {
                    sDUP(stack);
                    sROLL(stack, 3);
                    sROLL(stack, 2);
                    return true;
                }
                case "OP_TOALTSTACK" : {
                    sTOALTSTACK(stack, altStack);
                    return true;
                }
                case "OP_TRUE" : {
                    sPUSH(stack, 1);
                    return true;
                }
            }
            break;
        }
        case "OP_V" : {
            if(op == "OP_VERIFY"){
                return stack.pop();
            }
            break;
        }
        case "OP_W" : {
            if(op == "OP_WITHIN"){
                sWITHIN(stack);
                return true;
            }
            break;
        }
        default : {
            if(op.startsWith("OP_")){
                let num = parseInt(op.slice(3));
                //OP_2 - OP_16
                if((num < 10 && op.length == 4) || (num <= 16 && num >= 10 && op.length == 5))
                    sPUSH(stack, num);
            }else{
                sPUSH(stack, op);
            }
        }
    }
    return false;
}


//Dekóduje operace zapsané v hexadecimálním tvaru na string jednotlivých operací oddělených mezerou
function decodeOps(ops){
    let decoded = "|#START#| ";
    while(ops.length > 0){
        let op = ops.substring(0,2);
        ops = ops.slice(2);
        switch(op){
            case "00" : {
                decoded += "OP_0 ";
                continue;
            }
            case "4c" : {
                data = ops.substring(0, 2);
                ops = ops.slice(2);
                decoded += data+" ";
            }
            case "4d" : {
                data1 = ops.substring(0, 2);
                data2 = ops.substring(2, 4);
                ops = ops.slice(4);
                decoded += data2+data1+" ";

            }
            case "4e" : {
                data1 = ops.substring(0, 2);
                data2 = ops.substring(2, 4);
                data2 = ops.substring(4, 6);
                ops = ops.slice(6);
                decoded += data3+data2+data1+" ";
            }
            case "4f" : {
                decoded += "OP_1NEGATE ";
                continue;
            }
            case "51" : {
                decoded += "OP_1 ";
                continue;
            }
            case "52" : {
                decoded += "OP_2 ";
                continue;
            }
            case "53" : {
                decoded += "OP_3 ";
                continue;
            }
            case "54" : {
                decoded += "OP_4 ";
                continue;
            }
            case "55" : {
                decoded += "OP_5 ";
                continue;
            }
            case "56" : {
                decoded += "OP_6 ";
                continue;
            }
            case "57" : {
                decoded += "OP_7 ";
                continue;
            }
            case "58" : {
                decoded += "OP_8 ";
                continue;
            }
            case "59" : {
                decoded += "OP_9 ";
                continue;
            }
            case "5a" : {
                decoded += "OP_10 ";
                continue;
            }
            case "5b" : {
                decoded += "OP_11 ";
                continue;
            }
            case "5c" : {
                decoded += "OP_12 ";
                continue;
            }
            case "5d" : {
                decoded += "OP_13 ";
                continue;
            }
            case "5e" : {
                decoded += "OP_14 ";
                continue;
            }
            case "5f" : {
                decoded += "OP_15 ";
                continue;
            }
            case "60" : {
                decoded += "OP_16 ";
                continue;
            }
            case "61" : {
                decoded += "OP_NOP ";
                continue;
            }
            case "63" : {
                decoded += "OP_IF ";
                continue;
            }
            case "64" : {
                decoded += "OP_NOTIF ";
                continue;
            }
            case "67" : {
                decoded += "OP_ELSE ";
                continue;
            }
            case "68" : {
                decoded += "OP_ENDIF ";
                continue;
            }
            case "69" : {
                decoded += "OP_VERIFY ";
                continue;
            }
            case "6a" : {
                decoded += "OP_RETURN ";
                continue;
            }
            case "6b" : {
                decoded += "OP_TOALTSTACK ";
                continue;
            }
            case "6c" : {
                decoded += "OP_FROMALTSTACK ";
                continue;
            }
            case "73" : {
                decoded += "OP_IFDUP ";
                continue;
            }
            case "74" : {
                decoded += "OP_DEPTH ";
                continue;
            }
            case "75" : {
                decoded += "OP_DROP ";
                continue;
            }
            case "76" : {
                decoded += "OP_DUP ";
                continue;
            }
            case "77" : {
                decoded += "OP_NIP ";
                continue;
            }
            case "78" : {
                decoded += "OP_OVER ";
                continue;
            }
            case "79" : {
                decoded += "OP_PICK ";
                continue;
            }
            case "7a" : {
                decoded += "OP_ROLL ";
                continue;
            }
            case "7b" : {
                decoded += "OP_ROT ";
                continue;
            }
            case "7c" : {
                decoded += "OP_SWAP ";
                continue;
            }
            case "7d" : {
                decoded += "OP_TUCK ";
                continue;
            }
            case "6d" : {
                decoded += "OP_2DROP ";
                continue;
            }
            case "6e" : {
                decoded += "OP_2DUP ";
                continue;
            }
            case "6f" : {
                decoded += "OP_3DUP ";
                continue;
            }
            case "70" : {
                decoded += "OP_2OVER ";
                continue;
            }
            case "71" : {
                decoded += "OP_2ROT ";
                continue;
            }
            case "72" : {
                decoded += "OP_2SWAP ";
                continue;
            }
            case "82" : {
                decoded += "OP_SIZE ";
                continue;
            }
            case "87" : {
                decoded += "OP_EQUAL ";
                continue;
            }
            case "88" : {
                decoded += "OP_EQUALVERIFY ";
                continue;
            }
            case "8b" : {
                decoded += "OP_1ADD ";
                continue;
            }
            case "8c" : {
                decoded += "OP_1SUB ";
                continue;
            }
            case "8f" : {
                decoded += "OP_NEGATE ";
                continue;
            }
            case "90" : {
                decoded += "OP_ABS ";
                continue;
            }
            case "91" : {
                decoded += "OP_NOT ";
                continue;
            }
            case "92" : {
                decoded += "OP_0NOTEQUAL ";
                continue;
            }
            case "93" : {
                decoded += "OP_ADD ";
                continue;
            }
            case "94" : {
                decoded += "OP_SUB ";
                continue;
            }
            case "9a" : {
                decoded += "OP_BOOLAND ";
                continue;
            }
            case "9b" : {
                decoded += "OP_BOOLOR ";
                continue;
            }
            case "9c" : {
                decoded += "OP_NUMEQUAL ";
                continue;
            }
            case "9d" : {
                decoded += "OP_NUMEQUALVERIFY ";
                continue;
            }
            case "9e" : {
                decoded += "OP_NUMNOTEQUAL ";
                continue;
            }
            case "9f" : {
                decoded += "OP_LESSTHAN ";
                continue;
            }
            case "a0" : {
                decoded += "OP_GREATERTHAN ";
                continue;
            }
            case "a1" : {
                decoded += "OP_LESSTHANOREQUAL ";
                continue;
            }
            case "a2" : {
                decoded += "OP_GREATERTHANOREQUAL ";
                continue;
            }
            case "a3" : {
                decoded += "OP_MIN ";
                continue;
            }
            case "a4" : {
                decoded += "OP_MAX ";
                continue;
            }
            case "a5" : {
                decoded += "OP_WITHIN ";
                continue;
            }
            case "a6" : {
                decoded += "OP_RIPEMD160 ";
                continue;
            }
            case "a7" : {
                decoded += "OP_SHA1 ";
                continue;
            }
            case "a8" : {
                decoded += "OP_SHA256 ";
                continue;
            }
            case "a9" : {
                decoded += "OP_HASH160 ";
                continue;
            }
            case "aa" : {
                decoded += "OP_HASH256 ";
                continue;
            }
            case "ab" : {
                decoded += "OP_CODESEPARATOR ";
                continue;
            }
            case "ac" : {
                decoded += "OP_CHECKSIG ";
                continue;
            }
            case "ad" : {
                decoded += "OP_CHECKSIGVERIFY ";
                continue;
            }
            case "ae" : {
                decoded += "OP_CHECKMULTISIG ";
                continue;
            }
            case "af" : {
                decoded += "OP_CHECKMULTISIGVERIFY ";
                continue;
            }
            case "b1" : {
                decoded += "OP_CHECKLOCKTIMEVERIFY ";
                continue;
            }
            case "b2" : {
                decoded += "OP_CHECKSEQUENCEVERIFY ";
                continue;
            }
            default : {
                let num = parseInt("0x"+op);
                if(num >= 1 && num <= 75){
                    let data = ops.substring(0, num*2);
                    ops = ops.slice(num*2);
                    decoded += data+" ";
                }
            }
        }
    }
    return decoded+"|#END#|";
}