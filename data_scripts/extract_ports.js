var http=require("http");
var fs=require("fs");

var data=(fs.readFileSync("../processed.xml")).toString();

/*
var fs=require("fs");
    var data=(fs.readFileSync("./refs/port-numbers.xml")).toString();
    var parser=new DOMParser();
    data=parser.parseFromString(data,"text/xml");

    var processed='<?xml version="1.0" encoding="UTF-8"?>'
    processed+="<data>";
    for(var counter=0;counter<3;counter++)
    {
        var protocols=data.getElementsByTagName("table")[counter].children;
        for(var index=1;index<protocols.length;index++)
        {
                processed+="<protocol>";
                processed+=("<port>"+protocols[index].children[0].innerHTML+"</port>");
                processed+=("<tcp>"+protocols[index].children[1].innerHTML+"</tcp>");
                processed+=("<udp>"+protocols[index].children[2].innerHTML+"</udp>");
                processed+=("<description>"+protocols[index].children[3].innerHTML+"</description>");
                processed+=("<status>"+protocols[index].children[4].innerHTML+"</status>");
                processed+="</protocol>";
        }
    }
   
    processed+="</data>";

    fs.writeFile("processed.xml",processed,function(err){
        if(err)
         return console.log(err.toString());

    })

*/
http.createServer(function(request,response){
        response.writeHead(200,{'Content-type':'text/xml'});
        response.end(data)
}).listen(8080);

console.log("server running at http://localhost:8080");

