/*----------------------------------------------------------------------------------------------
| ip.js                                                                                         |
| Library for manipulating IP addresses                                                         |
| @author : Francis Ganya                                                                       |
| @email  : Ganyaf@gmail.com                                                                    |
-----------------------------------------------------------------------------------------------*/

/* import dependecies */
import {isIPv4} from "./ipv4.js";
import {translateMask} from "./ipv4.js";
import {translatePrefix} from "./ipv4.js";
import {getClass} from "./ipv4.js";

/**
 * Validates IP address
 * @param {string} address - ip address
 * @param {string} ipType  - type of ip address (4 or 6)
 * @param {object} logFile - container for logging errors
 * @return bool status -true if valid ,false otherwise
 */
export  function isValidAddress(value,ipType,logFile){
    let status=false;
    if(ipType==4){
        status=(isIPv4(value)) ? (true) : (false);
    }
    else if(ipType==="6"){
        status=(ipv6.isIPv6(value)) ? (true) : (false);
    }
    if(status) return true;
    (logFile) ? logFile.push(`Invalid IPv${ipType}`): console.log('No log  container');
    return false;
}


/**
 * Validates bits to borrow
 * @param {string} bits - bits to borrow from
 * @param {string} subPrefix  - subnet mask or prefix
 * @param {string} ipType  - Type of address (4 or 6)
 * @param {object} logFile - container for logging errors
 * @return bool status -true if valid ,false otherwise
 */
export  function isValidBits(bits,subPrefix,ipType,logFile){
    //get available host bits
    let availBits=0;
    if(ipType==4){
        availBits=32-((subPrefix.charAt(0)=='/') ? parseInt(subPrefix.substring(1,subPrefix.length)) : translateMask(subPrefix));  
    }else if(ipType==6){

    }
    if((bits<availBits) && (bits.length!=0)) return true;
    (logFile) ? logFile.push('Invalid Bits to borrow/Insufficient Bits to borrow from.'): console.log('No log  container');
    return false;
}


/**
 * Validates subnet Mask or prefix
 * @param {string} subPrefix  - subnet mask or prefix
 * @param {string} ipType  - Type of address (4 or 6)
 * @param {object} logFile - container for logging errors
 * @return bool status -true if valid ,false otherwise
 */
export function isValidPrefix(subPrefix,ipType,logFile){
    let status=false;
    if(ipType==4){
      //test the subPrefix by getting a corresponding prefix or subnet mask
      status=(subPrefix.charAt(0)=='/') ? (translatePrefix(subPrefix.substring(1,subPrefix.length))): translateMask(subPrefix);
    }else if(ipType==6){

    }
    if(status) return true;
    (logFile) ? logFile.push('Invalid Prefix/Subnet Mask.'): console.log('No log  container');
    return status;
}
