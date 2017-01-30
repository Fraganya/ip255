 import React from "react";
 import ReactDOM from "react-dom"

 import {currentNetwork} from "../lib/ip.js";
 import {subnetBits} from "../lib/ip.js";
 import {translatePrefix} from "../lib/ipv4.js";

/**Electron imports */
const {remote}=window.require("electron");
const dialog=remote.dialog;
const fs=window.require("fs");
const path=window.require("path");
const sqlite3=window.require('sqlite3').verbose();

let EditForm=React.createClass({
    update(){
        let descVal=this.refs.description.value;
        let devName=this.refs.device.value;
        let ipState=this.refs.assigned.value;
        this.props.refBack(descVal,devName,ipState);
        this.unMount();
    },
    unMount(){
      $("#edit-diag").modal('hide');
     ReactDOM.unmountComponentAtNode(document.getElementById("edit-form"));   
    },
    render(){
        let getOps=()=>{
            if(this.props.ipState=="TRUE"){
                return(
                    <select className="form-control" ref="assigned">
                    <option value="TRUE">Yes</option>
                    <option value="FALSE">No</option>
                    </select>
                )
            }
            else{
               return(
                    <select className="form-control" ref="assigned">
                    <option value="FALSE">No</option>
                    <option value="TRUE">Yes</option>
                    </select>
                )
            }
        }
        return(
             <div className="modal fade" id="edit-diag">
            <div className="modal-dialog modal-sm">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">IP Allocation -{this.props.address}</h4>
                    </div>
                    <div className="modal-body">
                                <form role="form">
                                    <div className="form-group">
                                        <label >Assigned</label>
                                        {getOps()}
                                    </div> 
                                    <div className="form-group">
                                        <label>Device</label>
                                        <input type="text" className="form-control" ref="device" defaultValue={this.props.device}/>
                                    </div>
                                    <div className="form-group">
                                        <label >Extra</label>
                                        <input type="text" className="form-control" ref="description" defaultValue={this.props.description}/>
                                    </div> 
                                </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" onClick={this.update}>Update</button>
                        <button type="button" className="btn btn-primary" onClick={this.unMount}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
        )
    }
});
let HostEntry=React.createClass({
    getInitialState:function(){
        return {assigned:(this.props.subnet.assigned=="TRUE") ? true : false};
    },
    assign:function(description,device,assigned){
        assigned=(assigned=="TRUE") ? true :false;
        description=(description.trim().length!=0) ? description : '--';
        device=(device.trim().length!=0) ? device : '--';
        this.props.refBack(device,description,this.props.subKey,assigned,this.props.page);
        this.setState({assigned:!this.state.assigned});
       
    },
    change(){
        let subnet=this.props.subnet;
        ReactDOM.render(<EditForm refBack={this.assign} address={subnet.address} device={subnet.device} description={subnet.description} ipState={subnet.assigned}/>,document.getElementById("edit-form"));
        $("#edit-diag").modal('show');
    },
    render:function(){
        return(
            <tr style={{cursor:"pointer"}} onClick={this.change}>
                <td ref="hostNum">{this.props.subnet.num}</td>
                <td ref="Address">{this.props.subnet.address}</td>
                <td ref="assigned" className="text-center">
                   { (this.props.subnet.assigned=="TRUE") ? "YES" : "NO"}
                </td>
                <td ref="device">
                   {this.props.subnet.device}
                </td>
                <td ref="extra" style={{padding:0+'px'}} >
                   {this.props.subnet.description}
                </td>
            </tr>
        )
    }
});
 let SchemaTab=React.createClass({
     getInitialState:function(){
         return {init:true,changes:[],changed:false};
     },
     deleteSchema(){
        let proceed=dialog.showMessageBox({title:"Proceed",type:"warning",buttons:["yes","Cancel"],message:"Are you sure you want to delete this schema?.All data will be lost.",});
        if(proceed==0){
            try{
                 this.state.schemaDB.close();
                 let filepath=this.state.schemaFile.toString();
                 fs.unlink(filepath,()=>{
                      this.setState({init:true,curIP:'',pages:'',curPage:'',curSub:'',schemaDB:'',prefix:'',subMask:'',subs:'',hosts:'',changed:false});
                      dialog.showMessageBox({type:"info",message:"The schema has been deleted!",buttons:['Ok']});
                 })
            }
            catch(e){
                 dialog.showErrorBox("Delete Error",`${e.toString()}`);
            } 
        }
     },
     reset:function(){
         let changed=this.state.changed;
         if(changed){
              let proceed=dialog.showMessageBox({title:"Proceed",type:"warning",buttons:["yes","Cancel"],message:"You have modified your schema but have not saved changes.Do you wish to discard changes?",});
              if(proceed==1){
                  return ;
              }
         }
        this.state.schemaDB.close();
        this.setState({init:true,curIP:'',pages:'',curPage:'',curSub:'',schemaDB:'',prefix:'',subMask:'',subs:'',hosts:'',changed:false});
     },
     saveSchema:function(){
        let filename=this.state.schemaFile;
        let schemaDB=this.state.schemaDB;
        let changes=this.state.changes;
        let pages=this.state.pages;
        schemaDB.serialize(()=>{
            try{
                for(let change of changes)
                {
                    schemaDB.run(`UPDATE subnet_${this.state.curSub} SET description="${change.description}",device="${change.device}",assigned="${change.ipState}" where address="${change.address}";`);
                    //update state
                }
                dialog.showMessageBox({type:"info",message:"The schema has been saved successfully!",buttons:['Ok']});
                this.setSub(this.state.curSub,this.state.curPage);
                this.setState({changes:[],changed:false});
            }
            catch(err){
                dialog.showErrorBox("Save Error",`${err.toString()}`);
                return;
            }   
        });
     },
     setChange(device,description,key,ipState,pageNum){
         //the change is from unassigned to assigned
         let pages=this.state.pages;
         let curPage=this.state.curPage;
         let changes=this.state.changes;
         let curChange=0;
         let isNew=true;
         //check if this ip address was changed
         for(let change of changes)
         {
            if(change.page==curPage && change.subnet==key){
                isNew=false;
                break;
            }
            curChange++;
          }
          //set the change if its new
          if(isNew){
                if(ipState){
                    changes.push({page:curPage,subnet:key,device,description,ipState:'TRUE',address:pages[curPage].subnets[key].address,pageNum})
                }
                else{
                    changes.push({page:curPage,subnet:key,device:'--',description:'--',ipState:'FALSE',address:pages[curPage].subnets[key].address,pageNum})
                }
          }
          else{
                if(ipState){
                    changes[curChange]=({page:curPage,subnet:key,device,description,ipState:'TRUE',address:pages[curPage].subnets[key].address,pageNum})
                }
                else{
                    changes[curChange]=({page:curPage,subnet:key,device:'--',description:'--',ipState:'FALSE',address:pages[curPage].subnets[key].address,pageNum})
                }
               //this has returned to the original state
                if((changes[curChange].ipState==pages[curPage].subnets[key].assigned) && (pages[curPage].subnets[key].description==description)
                && (pages[curPage].subnets[key].device==device)){
                    changes.splice(curChange,1); 
                    console.log("reset");
                }
          }    
         this.setState({changes,changed:(changes.length!=0)?true:false});
     },
     loadSchema:function (){
          dialog.showOpenDialog({defaultPath:path.resolve("./schemas/"),filters:[{name:"Schemas",extensions:['db','DB']}]},(filename)=>{
              if(!filename){
                  dialog.showErrorBox("File Error",err.toString());
                  return ;
              }
              //load db
              try{
                let schemaDB=new sqlite3.Database(`${filename}`);
                //prep data for presentation
                schemaDB.serialize(()=>{
                    schemaDB.all("SELECT * FROM net_info",(err,ipInfo)=>{
                    if(!ipInfo)  dialog.showErrorBox("Error loading db",err.toString());
                    let {parent_net:origNet,init_prefix:initBits,subnet_count:subs,sub_host:hosts}=ipInfo[0];
                    let prefix=parseInt(initBits)+subnetBits(subs);
                    this.setState({schemaDB,prefix,subs,hosts,subMask:translatePrefix(prefix),schemaFile:filename});
                    this.setSub(0)
                    })
                })   
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
     setSub(subNum,page){
        let schemaDB=this.state.schemaDB;
        let prefix=this.state.prefix;
        schemaDB.serialize(()=>{
            schemaDB.all(`SELECT * FROM subnet_${subNum}`,(err,ipInfo)=>{   
                if(!ipInfo) return  dialog.showErrorBox("Seek Error","Cant move up query=="+`SELECT * FROM subnet_${subNum}`);
                let curIP=ipInfo[0].address;
                //pack[]
                let pages=[],count=0,sub=0,nextPager=10;
                for(let page=0;page<Math.ceil(ipInfo.length/10);page++)
                {
                    let netPage=[];
                    while(sub<(nextPager))
                    {
                        if(ipInfo[sub]){
                            let {address,assigned,device,description}=ipInfo[sub];
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
                let curPage=(page) ? page :0;
                this.setState({schemaDB,init:false,curIP:currentNetwork(curIP,'/'+prefix.toString()),pages,curPage,curSub:subNum})
            });
        });
     },
     change(){
         console.log("Clicked");
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
                        <button className="btn btn-default fa fa-save" title="Save Schema" onClick={this.saveSchema}/>
                        <button className="btn btn-default fa fa-trash" title="Delete Schema" onClick={this.deleteSchema}/>
                         <button className="btn btn-default fa fa-close" type="button" title="Close Schema" onClick={this.reset}/>
                    </div>
                </div>
                <div className="col=sm-12">
                            <p className="col-sm-3">Network {this.state.curSub+1} of {this.state.subs} </p>
                            <div className="col-sm-2">
                                <button className="btn btn-sm btn-default fa fa-chevron-left" onClick={this.netDown} 
                                disabled={(this.state.curSub==0) ? true :false}/>
                                &nbsp;
                                <button className="btn btn-sm btn-default fa fa-chevron-right" onClick={this.netUp}
                                disabled={((this.state.curSub+1)>=this.state.subs) ? true :false}/>
                            </div>
                           
                </div>
                <div className="col-sm-12">
                        <div className="col-sm-9">
                           
                            <div className="row">
                                <table className="table table-bordered table-hover"> 
                            <caption>{this.state.curIP}/{this.state.prefix} Hosts  {(this.state.changed) ? '* changes' :''}</caption> 
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
                                              <HostEntry subnet={subnet} page={this.state.curPage} subKey={index} refBack={this.setChange} key={index}/>
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
