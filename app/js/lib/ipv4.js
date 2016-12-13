/*------------------------------------------------------------------------------------------------
 | ipv4.js                                                                                       |
 | Library for manipulating IPv4 addresses                                                       |
 | @author : Francis Ganya                                                                       |
 | @email  : Ganyaf@gmail.com                                                                    |
 -----------------------------------------------------------------------------------------------*/

/*dependencies */
import {subMasks,OCTET_MAX,MAX_V4_BITS,MAX_V6_BITS} from "./globals.js";
 /**
 * Validates ipv4 address 
 * @param {string} address - ipv4 address
 * @return {bool}  - true if its valid ,false otherwise
 */
export  function isIPv4(address){
    let ipv4Pattern=/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/
    if(ipv4Pattern.test(address)) return true;
    return false;
}

/**
 * Translates subnet mask to a prefix
 * @param {string} subMask -subnet mask
 * @return {integer} prefix number
 */
export  function translateMask(subMask){
    let prefix=undefined;
    for(let index=0;index<subMasks.length;index++){
        if(subMasks[index]==subMask){
            prefix=index;
            break;
        }
    }
    return parseInt(prefix);
}

/**
 * Translates a prefix to subnet mask
 * @param {integer} prefix -prefix length
 * @return {string} subnet mask
 */
export   function translatePrefix(prefix){
  return subMasks[parseInt(prefix)];
}


/**
 * returns a single interger representaition of an ipv4 address
 * @param address - ipv4 address to shift 
 * @return ipInt - binary interger representation of the ip address
 */
export function binInt(address)
{
    let blocks=address.split('.');
    let ipInt=0;

    for(let i=0;i<4;i++){
        ipInt <<=8
        ipInt+= +blocks[i];
    }
    return ipInt >>>0;
}
/**
 * returns an octetal represantion of a binary interger
 * reverse of binInt(address)
 * @param {binary int} binVal - binary represation of an IPv4 address
 * @return {string} - 4 decimal array of 
 */
export function binOctet(binVal)
{
    return [binVal >>> 24, binVal >> 16 & OCTET_MAX, binVal >> 8 & OCTET_MAX, binVal & OCTET_MAX].join('.');
}
/**
 * gets a network class 
 * @param {string} address
 * @return {char} network class
 */
export  function getClass(address){
    let octet_1=parseInt(address.split('.')[0]);
    if((octet_1>=0) && (octet_1<=126))
         return 'A';
    else if((octet_1>=128) && (octet_1<=191))
        return 'B'
    else if ((octet_1>=192) && (octet_1<=223))
        return 'C'
    else if ((octet_1>=224) && (octet_1<=239))
        return 'D';
    else if((octet_1>=240) && (octet_1<=255))
        return 'E'; //reserved
    else{
        return undefined;
    }
}

/**
 * calculates the target octets to manipulate bits in
 * display only for showing working - 
 * @param {int} prefix - current prefix length
 * @param {string} subMask - current subnet mask
 * @param {int} toBorrow - number of bits to turn on (lend)
 * @return {object} bitSpan - octets subnetting will take place in and bit dispersal
 */
export function targetOctet(prefix,subMask,toBorrow){
    let octet=undefined,bitSpan=[];
    if(prefix<30){
        switch(parseInt(prefix))
        {
            case 8: octet=2; break;
            case 16: octet=3; break;
            case 24: octet=4; break;
            default:octet=Math.ceil(prefix/8);
        }   
     let blocks=subMask.split('.');
     if(toBorrow>getBits(blocks[octet-1]))
     {
         bitSpan.push({num:octet,bits:getBits(blocks[octet-1])});
         if((toBorrow-getBits(blocks[octet-1]))>getBits(blocks[octet+1])){
             bitSpan.push({num:octect+1,bits:toBorrow-getBits(blocks[octet+1])});
             bitSpan.push({num:octet+1,bits:toBorrow-getBits(blocks[octet-1])-getBits(blocks[octet+1])});
            // console.log("Not enough bits to borrow in octet",octet+1,",Lending spanning to",octet+2);
             //console.log("Using octet [",octet," ,",octet+1,',',octet+2,']');
         }
         else{
             bitSpan.push({num:octet+1,bits:toBorrow-getBits(blocks[octet-1])});
            // console.log("Using octet [",octet," ,",octet+1,']');
         }  
     }
     else{
         bitSpan.push({num:octet,bits:toBorrow});
     }    
     return bitSpan;
    }
}

/**
 * returns number of host bits available in an octet
 * @param {int} octVal - octet Value
 * @return {int} - number of host bits available (off bits)
 */
export function getBits(octVal){
    switch(parseInt(octVal))
    {
        case 255: return 0;
        case 254: return 1;
        case 252: return 2;
        case 248: return 3;
        case 240: return 4;
        case 224: return 5;
        case 192: return 6;
        case 128:return 7
        case 0: return 8;
        default:
            return undefined;
    }

}