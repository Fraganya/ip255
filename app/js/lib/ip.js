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
import {getBits} from "./ipv4.js";
import {binInt} from "./ipv4.js";
import {binOctet} from "./ipv4.js";
import {targetOctet} from './ipv4.js';


// STAND_ALONE FUNCTIONS
/**
 * returns num of usable host addresses for a subnet
 * @param {int} hostBits - number of off bits (host bits)
 * @return {int} - host count;
 */
function hostCount(hostBits){
    return (Math.pow(2,hostBits)-2);
}

/**
 * returns number of subnets
 * @param {int} subBits - number of on bits (borrowed bits)
 * @return {int} - subneting count (number of subnets);
 */
function subnetCount(subBits){
    return Math.pow(2,subBits);
}

/**
 * returns number of bits required to create the number of required subnets
 * @param {int} reqSubs - number of required subnets
 * @return {int} - number of bits required;
 */
function subnetBits(reqSubs){
    var subBits=Math.log(parseInt(reqSubs))/Math.log(2);
    subBits=(subBits==parseInt(subBits)) ? subBits : parseInt(subBits)+1;
    return subBits;
}

/**
 * returns number of bits required to have the number of required hosts .subnet
 * @param {int} reqHosts - number of required hosts/subnet
 * @return {int} - number of bits required;
 */
function hostBits(reqHosts){
    var hBits=Math.log(parseInt(reqHosts)+2)/Math.log(2);
    hBits=(hBits==parseInt(hBits)) ? hBits : parseInt(hBits)+1;
    return hBits;
}

/**
 * converts a long integer into a standard 8 bit number 
 * @param {int} binInt - binary integer to convert
 * @return {object} binVal - array of binary value 
 */
function getBinary(binInt){
    let binVal=[binInt >>> 24,(binInt >>16) & OCTET_MAX,(binInt >>8) & OCTET_MAX,(binInt & OCTET_MAX)];
    for(let octet of [0,1,2,3])
    {
        binVal[octet]=binVal[octet].toString(2);
        while(binVal[octet].length<8){ 
            binVal[octet]='0'+binVal[octet]; //pad with trailing 0's'
        }

    }
    return binVal.slice(0);
}

// EXPORTS
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

export function getBitsByReqs(subPrefix,reqs,workFile){
    //get availBits
      let availBits=0;
      let subMask=(subPrefix.charAt(0)=='/') ? (translatePrefix(subPrefix.substring(1,subPrefix.length))): subPrefix;
      subMask.split('.').map((val) =>{
          availBits+=getBits(val);
      });

      //compute bits to lend - based on requirenments
      let bits=0;
      let subBits=subnetBits(reqs.subReqs);
      let hBits=hostBits(reqs.hostReqs);
      
    

      if((subBits+hBits)<=availBits){
          workFile.push(...[
                'Both requirenments can be met.',
                `${reqs.hostReqs} hosts will neeed ${hBits} bits.`,
                `${reqs.subReqs} subnets will neeed ${subBits} bits.`,
                'Subnet requirenments will be priotised since host requirenment will not be affected.',
                `${reqs.subReqs} subnets will use ${subBits} bits.`,
                `${availBits-subBits} bit(s) will be used to create subnets of ${hostCount(availBits-subBits)} host(s).`
                ]);
           bits=subBits;
      }
      else{
          let subCount=subnetCount(availBits-hBits);
          workFile.push(...[
                'Both requirenments can not be met.',
                `Available bits are ${availBits}`,
                `${reqs.hostReqs} host(s) require(s) at least ${hBits} bit(s).`,
                `${reqs.subReqs} subnet(s) require(s) at least ${subBits} bit(s).`,
                'Host requirenments will be priotised.',
                `${reqs.subReqs} subnet(s) cannot use ${subBits} bit(s),`,
                `instead ${availBits-hBits} bit(s) will be used to create ${subCount} subnet(s) with ${hostCount(hBits)} host(s) each.`,
                `a ${hostCount(hBits)}-hosts subnet can accomodate ${reqs.hostReqs} hosts.`
                ]);
            bits=parseInt(availBits)-parseInt(hBits);
      }
      return bits;
}

/**
 * Checks if a number is a valid host requirenment digit
 * @param {mixed} num -the number
 * @param {string} field - field being checked for logging
 * @param {object} logFile - array to log errors
 */
export function isDigit(num,field,logFile){
    //check if number is valid
    let status=false;
    if(parseInt(Number(num))){
        let sub=parseInt(num);
        status=(sub==num) ? true : false;
    }
    if(status) return true;
    (logFile) ? logFile.push(`invalid number for ${field}`): console.log('No log  container');
    return status;
}

/**
 * Returns the number of hosts available in the network
 * @param {string} subPrefix - subnet mask of prefix
 * @return {int} block size of the network
 */
export function max_hosts(subPrefix){
     let availBits=0;
     let subMask=(subPrefix.charAt(0)=='/') ? (translatePrefix(subPrefix.substring(1,subPrefix.length))): subPrefix;
     subMask.split('.').map((val) =>{
          availBits+=getBits(val);
      });
    return hostCount(availBits);
}
/**
 * summarizes a number of routes 
 * @param {object} subnets - array of subnets to summarize
 * @return {object} aggregatedNet summarized route info 
 */
export function aggregate(subnets,workFile){
    // arrays to hold subnet ip integer representation and octets bit order
    let aggregatedNet={};
    let longInts=[],bitOrder=[];
    const MAX_SUM_BITS=32;
    //fill up longInts
    for(let subnet of subnets){
        longInts.push(binInt(subnet.address));
    }

    //generate bit order of subnets
    workFile.push("Converting networks to binary");
    let num=0;
    let bits=0;
    for(let longInt of longInts){
        bits=getBinary(longInt);
        workFile.push(`[${num+1}] ${subnets[num].address} \n-- ${bits.join('.')}`);
        bitOrder.push(bits.join(''));
        num++
    } 

    let prefix=0;
    let EOM=false; // end of match
    let bit_; // current bit matching

    for(let bit=0;bit<MAX_SUM_BITS;bit++)
    {
        bit_=bitOrder[0][bit]; // get current bit of the first subnet
        for(let matchIndex=1;matchIndex<subnets.length;matchIndex++)
        {
            if(bitOrder[matchIndex][bit]!=bit_) EOM=true;
        }

        if(EOM) break;
        prefix++;
    }

    workFile.push(`The number of matching highest order bits is/are ${prefix}`);

    //get network address
    let netInt=longInts[0];
    for(let subNum=1;subNum<subnets.length;subNum++)
    {
        netInt&=longInts[subNum];
    }
    aggregatedNet={address:binOctet(netInt),prefix,subMask:translatePrefix(prefix)}; 
    workFile.push(`ANDing bits to find summarized network`);
    workFile.push(`Summarized network is ${aggregatedNet.address}/${prefix}`);
    return ({aggregatedNet})
}
/**
 * returns information about an ip class 
 * @param {char}netClass - character representing the class 
 * @return {object} - classinfo
 */
export function getClassInfo(netClass){
    let subnets,prefix,range,subMask,blockSize,rfc;

    if(netClass=='A'){
        subnets=subnetCount(7);
        prefix='/8';
        subMask="255.0.0.0";
        range='0.0.0.0-127.0.0.0';
        blockSize=hostCount(24)+2;
        rfc:"---"
    }
    else if(netClass=='B'){
        subnets=subnetCount(14);
        prefix='/16';
        subMask="255.255.0.0";
        range='128.0.0.0-191.0.0.0';
        blockSize=hostCount(16)+2;
        rfc:"---"
    }
    else if(netClass=='C'){
        subnets=subnetCount(21);
        prefix='/24';
        subMask="255.255.255.0";
        range='192.0.0.0-223.0.0.0';
        blockSize=hostCount(8)+2;
        rfc:"---"
    }
    else if(netClass=='D'){
        subnets='---'
        prefix='/4';
        subMask="255.255.255.0";
        range='224.0.0.0-239.0.0.0';
        blockSize="---";
        rfc:"5771"
    }
    else if(netClass=='E'){
        subnets='---';
        prefix='/4';
        range='240.0.0.0-255.0.0.0';
        subMask="255.255.255.0";
        blockSize="---";
        rfc:"1700"
    }

    return {range,prefix,subMask,blockSize,subnets}
}
/**
 * converts an integer from one base to another
 * @param {int} num-  interger to convert
 * @param {int} curBase -current base
 * @param {int} toBase -base to convert number to
 * @return{int} converted integer
 */
export function convertBase(num,curBase,toBase)
{
    return (parseInt(num,curBase).toString(toBase));
}




/** Schema functions */
export function toSchema(networks){
    
}

/**
 * for debugging 
 */
function displayOctetal(msg,binInt)
{
    console.log(msg+[binInt >>> 24, binInt >> 16 & OCTET_MAX, binInt >> 8 & OCTET_MAX, binInt & OCTET_MAX].join('.'));
}