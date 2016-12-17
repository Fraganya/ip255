/*------------------------------------------------------------------------------------------------
 | globals.js                                                                                       |
 | IP facts                                                       |
 | @author : Francis Ganya                                                                       |
 | @email  : Ganyaf@gmail.com                                                                    |
 -----------------------------------------------------------------------------------------------*/

/**
* Valid ipv4 subnet masks
* ref www.freesoft.org/CIE/course/subnet/6.htm
*/
export const subMasks=[
                '0.0.0.0','128.0.0.0','192.0.0.0','224.0.0.0','240.0.0.0','248.0.0.0','252.0.0.0','254.0.0.0','255.0.0.0',
                '255.128.0.0','255.192.0.0','255.224.0.0','255.240.0.0','255.248.0.0','255.252.0.0','255.254.0.0','255.255.0.0',
                '255.255.128.0','255.255.192.0','255.255.224.0','255.255.240.0','255.255.248.0','255.255.252.0','255.255.254.0','255.255.255.0',
                '255.255.255.128','255.255.255.192','255.255.255.224','255.255.255.240','255.255.255.248','255.255.255.252','255.255.255.254'
                ,'255.255.255.255'
                 ];
/**
 * Maximum decimal value for an octet
 */
export const OCTET_MAX=255;

/**
 * Maximum number of bits for ipv4 address
 */
export const MAX_V4_BITS=32;

/**
 * Maximum number of bits for an ipv6 address
 */
export const MAX_V6_BITS=128;

export const VERSIONS=[
    {
        version:4,
        bits:32,
        total_space:'4.3 Billion (Theoritical)',
        notation:'Dotted Decimal',
        implemented:"---",
        rfc:'791',
        description:"32 bit binary number represented as 4 octets used by the internet protocol layer (OSI layer 3) for delivering packets to end devices",
        security:"N/A"
    },
     {
        version:6,
        bits:128,
        total_space:'340 Undecillion',
        notation:'Hexadecimal ',
        implemented:"---",
        rfc:'2460',
        description:"128 bit binary number represented in hexadecimal used by the internet protocol layer (OSI layer 3) for delivering packets to end devices",
        security:"MD5"
    }
];

 