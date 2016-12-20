 import React from "react";

 import {currentNetwork} from "../lib/ip.js";
 import {subnetBits} from "../lib/ip.js";
 import {translatePrefix} from "../lib/ipv4.js";

/**Electron imports */
const {remote}=window.require("electron");
const dialog=remote.dialog;

let HostEntry=React.createClass({
    getInitialState:function(){
        return {assigned:false};
    },
    assign:function(){
        this.setState({assigned:!this.state.assigned});
    },
    render:function(){
        return(
            <tr>
                <td ref="hostNum">{this.props.subnet.num}</td>
                <td ref="Address">{this.props.subnet.address}</td>
                <td ref="assigned" className="text-center">
                    <input type='checkbox' checked={(this.props.subnet.assigned!="FALSE") ? true : false} onChange={this.assign} />
                </td>
                <td ref="device" style={{padding:0+'px'}}>
                    <input type='text' placeholder="enter device name" className="form-control" style={{borderRadius:0+'px',border:'none',marginBottom:0+'px'}}
                     disabled={(this.state.assigned) ? true : false}/>
                </td>
                <td ref="extra" style={{padding:0+'px'}} >
                     <input type='text' placeholder="enter description" className="form-control" style={{borderRadius:0+'px',border:'none',marginBottom:0+'px'}}  
                     disabled={(this.state.assigned) ? true : false}/>
                </td>
            </tr>
        )
    }
});
 let SchemaTab=React.createClass({
     getInitialState:function(){
         return {init:true};
     },
     reset:function(){
         this.setState({init:true,curIP:'',pages:'',curPage:'',curSub:'',schemaDB:'',prefix:'',subMask:'',subs:'',hosts:''});
     },
     loadSchema:function (){
          const sql=window.require("sql.js");
          const path=window.require("path");
          dialog.showOpenDialog({defaultPath:path.resolve("./schemas/"),filters:[{name:"Schemas",extensions:['db','DB']}]},(filename)=>{
              if(!filename){
                  dialog.showErrorBox("File Error",err.toString());
                  return ;
              }
              let DB_Buffer=window.require("fs").readFileSync(filename.toString());

              //load db
              try{
                let schemaDB=new sql.Database(DB_Buffer);
                //prep data for presentation
                let query="SELECT * FROM net_info";
                let [origNet,initBits,subs,hosts]=schemaDB.exec(query)[0].values[0];

               
                let prefix=parseInt(initBits)+subnetBits(subs);
                this.setState({schemaDB,prefix,subs,hosts,subMask:translatePrefix(prefix)});
                this.setSub(0);
              }
              catch(err){
                  dialog.showErrorBox("Error loading db",err.toString());
              }
              

          })
         
     },
     netDown:function(){
         let curSub=this.state.curSub;
         if((curSub-1)<0){
             dialog.showErrorBox("Seek Error","Out of bound");
             return;
         }
        this.setSub(curSub-1);
     },
     netUp:function(){
         let curSub=this.state.curSub;
         if((curSub+1)>=this.state.subs){
             dialog.showErrorBox("Seek Error","Out of Bound");
             return;
         }
        this.setSub(curSub+1);
     },
     setSub(subNum){
        let schemaDB=this.state.schemaDB;
        let prefix=this.state.prefix;
        let query=`SELECT * FROM subnet_${subNum}`;
        let subnets_raw=schemaDB.exec(query);      
        let [curIP]=subnets_raw[0].values[0];

        //pack
        let pages=[],count=0,sub=0,nextPager=10;
        console.log("Pages",Math.ceil(subnets_raw[0].values.length/10));
        for(let page=0;page<Math.ceil(subnets_raw[0].values.length/10);page++)
        {
            let netPage=[];
            while(sub<(nextPager))
            {
                if(subnets_raw[0].values[sub]){
                    let [address,assigned,device,description]=subnets_raw[0].values[sub];
                    netPage.push({num:count+1,address,assigned,device,description});
                    sub++;
                    count++;
                }
                else{
                    break;
                } 
                
            }
            if(netPage.length==0) break;
            nextPager+=10;
            pages.push({num:page,subnets:netPage.slice(0)});

        }
        this.setState({init:false,curIP:currentNetwork(curIP,'/'+prefix.toString()),pages,curPage:0,curSub:subNum})

     },
     pageDown:function(){
         let curPage=this.state.curPage;
         if((curPage-1<0)){
             dialog.showErrorBox("Seek Error","The specified host page does not exist");
             return;
         }
         this.setState({curPage:curPage-1});
     },
     pageUp:function(){
         let curPage=this.state.curPage;
         if((curPage+1)>=(this.state.pages.length)){
             dialog.showErrorBox("Seek Error","The specified host page does not exist");
             return;
         }
         this.setState({curPage:curPage+1});
     },
     gotoPage:function(){
         let pageNum=this.refs.pageBox.value;
         try{
             pageNum-=1; // remove one from the user's input ...0 based indices
             if(!this.state.pages[parseInt(pageNum)]) throw new Error("Page number out of bound");
             this.setState({curPage:pageNum});
         }
         catch(err){
             dialog.showErrorBox("Seek Error",err.toString());
         }
     },
     normalRender:function(){
         return(
              <div className="row">
                <div className="col-sm-3">
                    <p className="well well-sm">
                        Analyse and manage a network with the schema tools!
                    </p>  
                    <button className="btn btn-default" type="button" onClick={this.loadSchema}><span className="fa fa-file"  />&nbsp;Load Schema File </button>
                </div>
                </div>
         )
     },
     finalRender:function(){
         return(
             <div className="row">
                <div className="col-sm-12">
                    <p className="well well-sm col-sm-6">{this.state.curIP}/{this.state.prefix} Network Schema</p>
                    <div className="btn-group col-sm-4" >
                        <button className="btn btn-default fa fa-save" title="Save Schema"/>
                        <button className="btn btn-default fa fa-trash" title="Delete Schema"/>
                         <button className="btn btn-default fa fa-close" type="button" title="Close Schema" onClick={this.reset}/>
                    </div>
                </div>
                <div className="col=sm-12">
                            <p className="col-sm-3">Network {this.state.curSub+1} of {this.state.subs}</p>
                            <div className="col-sm-2">
                                <button className="btn btn-sm btn-default fa fa-chevron-left" onClick={this.netDown} 
                                disabled={(!(this.state.curSub-1)<0) ? true :false}/>
                                &nbsp;
                                <button className="btn btn-sm btn-default fa fa-chevron-right" onClick={this.netUp}
                                disabled={((this.state.curSub+1)>=this.state.subs) ? true :false}/>
                            </div>
                           
                </div>
                <div className="col-sm-12">
                        <div className="col-sm-9">
                           
                            <div className="row">
                                <table className="table table-bordered"> 
                            <caption>{this.state.curIP}/{this.state.prefix} Hosts</caption> 
                                <thead> 
                                <tr>      
                                    <th><b className="fa fa-hashtag"/></th>    
                                    <th>Address</th> 
                                    <th>Assigned</th> 
                                    <th>Device</th> 
                                    <th>Extra</th>           
                                </tr> 
                            </thead>  
                            <tbody>
                                 {
                                     
                                     this.state.pages[this.state.curPage].subnets.map((subnet,index)=>{
                                         return(
                                              <HostEntry subnet={subnet} key={index} />
                                         )
                                     })
                                     

                                 }
                            </tbody> 
                            </table>  
                            <div className="row">
                             <form className="form-inline col-sm-5">
                                    <div className="form-group">
                                        <label className="sr-only" htmlFor="subnet number">Go to</label>
                                        <input className="form-control" ref="pageBox" placeholder="go to host page"/>
                                    </div>
                                    <button style={{marginLeft:1+'px',marginTop:2+'px',borderRadius:0+'px'}} type="button" onClick={this.gotoPage} className="btn btn-default">Go</button>
                                </form>
                                <div className="5">
                                <p className="col-sm-3">Host Page  {this.state.curPage+1} of {this.state.pages.length}</p>
                                <div className="col-sm-2">
                                    <button className="btn btn-sm btn-default fa fa-chevron-left" onClick={this.pageDown}
                                    disabled={(!(this.state.curPage)>0) ? true :false}/>
                                    &nbsp;
                                    <button className="btn btn-sm btn-default fa fa-chevron-right" onClick={this.pageUp}
                                    disabled={((this.state.curPage+1)>=this.state.pages.length) ? true :false} />
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <table className="table table-bordered"> 
                            <caption>Block Info</caption> 
                                <thead> 
                                <tr>      
                                    <th>Param</th>    
                                    <th>Value</th>        
                                </tr> 
                            </thead>  
                            <tbody>     
                                <tr>   
                                    <td>Size</td>   
                                    <td>{this.state.hosts}</td>               
                                </tr>  
                                <tr>          
                                    <td>Prefix</td>   
                                    <td>/{this.state.prefix}</td>               
                                </tr>  
                                <tr>      
                                    <td>Submask:</td>       
                                    <td>{this.state.subMask}</td>               
                                </tr>  
                                 <tr>      
                                    <td><b className="fa fa-hashtag"/> of subnets</td>       
                                    <td>{this.state.subs}</td>               
                                </tr>
                                </tbody> 
                            </table>  
                        </div>
                 </div>
             </div>
         )
     },
     render:function(){
         return(
              <div className="col-lg-12">
                        <div className="Header">
                             <h3 className="head">Schema</h3>
                        </div>
                        <hr/> 
                       
                        {(this.state.init) ? this.normalRender() : this.finalRender()}
             </div>
         )
     }
 });

 export default SchemaTab;
