/*------------------------------------------------------------------------------------------------
 | ipv4.js                                                                                       |
 | Library for manipulating IPv4 addresses                                                       |
 | @author : Francis Ganya                                                                       |
 | @email  : Ganyaf@gmail.com                                                                    |
 -----------------------------------------------------------------------------------------------*/

/*dependencies */
import {subMasks} from "./globals.js";
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