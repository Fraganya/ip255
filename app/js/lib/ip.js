/*----------------------------------------------------------------------------------------------
| ip.js                                                                                         |
| Library for manipulating IP addresses                                                         |
| @author : Francis Ganya                                                                       |
| @email  : Ganyaf@gmail.com                                                                    |
-----------------------------------------------------------------------------------------------*/

/* import dependecies */
import {OCTET_MAX,MAX_V4_BITS,MAX_V6_BITS} from "./globals.js";
import {isIPv4} from "./ipv4.js";
import {translateMask} from "./ipv4.js";
import {translatePrefix} from "./ipv4.js";
import {getClass} from "./ipv4.js";
import {binInt} from "./ipv4.js";
import {binOctet} from "./ipv4.js";
import {targetOctet} from './ipv4.js';


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
        availBits=MAX_V4_BITS-((subPrefix.charAt(0)=='/') ? parseInt(subPrefix.substring(1,subPrefix.length)) : translateMask(subPrefix));  
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
/**
 * returns num of usable host addresses for a subnet
 * @param {int} hostBits - number of off bits (host bits)
 * @return {int} - host count;
 */
export function hostCount(hostBits){
    return (Math.pow(2,hostBits)-2);
}

/**
 * returns number of subnets
 * @param {int} subBits - number of on bits (borrowed bits)
 * @return {int} - subneting count (number of subnets);
 */
export function subnetCount(subBits){
    return Math.pow(2,subBits);
}

export function subnet(address,subPrefix,toLend){
    subPrefix=(subPrefix.charAt(0)=='/') ? subPrefix.substring(1,subPrefix.length): translateMask(subPrefix);

    let newPrefix=parseInt(subPrefix)+parseInt(toLend);
    let newSubMask=translatePrefix(newPrefix);
    let subCount=parseInt(subnetCount(toLend));
    let hostSubCount=parseInt(hostCount(MAX_V4_BITS-newPrefix));
    let newIP=(binInt(address)&binInt(newSubMask));

    let sub={NA:0,FA:0,LA:0,BA:0}; //current subnet
    let subs=[]; 
    for(var i=0;i<subCount;i++)
    {
        sub.NA=newIP;
        sub.FA=(newIP+1);
        sub.LA=(sub.NA+hostSubCount);
        sub.BA=(sub.FA+hostSubCount);
        subs.push({NA:binOctet(sub.NA>>>0),FA:binOctet(sub.FA>>>0),LA:binOctet(sub.LA>>>0),BA:binOctet(sub.BA>>>0)});
        newIP=(newIP+(hostSubCount+2))>>>0;
    }

    return {subnets:subs,subnetCount:subCount,usable:hostSubCount,newSubMask,newPrefix,origBits:subPrefix};
}

/**
 * returns the original network
 * @param {string} ip -address 
 * @param {string} subPrefix - subnet mask or prefix
 * @return {string} - original network
 */
export function currentNetwork(ip,subPrefix)
{
    //sanitize and get the proper subnet mask - from prefix or subnet mask
    let subMask=(subPrefix.charAt(0)=='/') ? (translatePrefix(subPrefix.substring(1,subPrefix.length))): subPrefix;
    
    return binOctet(binInt(subMask)&binInt(ip));
   
}

function displayOctetal(msg,binInt)
{
    console.log(msg+[binInt >>> 24, binInt >> 16 & OCTET_MAX, binInt >> 8 & OCTET_MAX, binInt & OCTET_MAX].join('.'));
}