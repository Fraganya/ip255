import React from "react";

import {isValidAddress} from "../lib/ip.js";
import {isValidBits} from "../lib/ip.js";
import {isValidPrefix} from "../lib/ip.js"
import {currentNetwork} from '../lib/ip.js';
import {subnet} from '../lib/ip.js';

var SubnetField=React.createClass({
     handleChange:function(){
         var hosts=this.refs.hostCount.value;
         this.props.updater(hosts,(this.props.num-1));
     },
     render:function(){
         return(
             <div>
            <label htmlFor="Subnet-Host">Subnet {this.props.num} required hosts</label>
            <input className="form-control" ref="hostCount" onChange={this.handleChange} value={this.props.hosts} />
            </div>
         )
         
     }
 });
 var SubnettedView=React.createClass({
     render:function(){
         let master=this.props.master;
         return(
                <div>
                <p className="well well-sm">Successfully subnetted {master.state.curIP} /{master.state.origBits} by lending {master.state.bits} bits</p>
                 <p className="well well-sm col-sm-3">{master.state.subnetCount} Networks<br /> {master.state.usable} Hosts/Subnet</p>
                 <p className="well well-sm col-sm-5" style={{marginLeft:2+'px'}}>Prefix == /{master.state.prefix}<br />Subnet ==  {master.state.subMask}</p>
                 {/* summary infor */}
                 <table className="table table-bordered"> 
                    <caption>Network Information</caption> 
                    <thead> 
                    <tr>      
                        <th>Param</th>          
                        <th>Value</th> 
                    </tr> 
                   </thead>  
                   <tbody>     
                     <tr>          
                         <td>Address</td>  
                         <td>{master.state.subnets[master.state.curSub].NA}</td>               
                    </tr>  
                    <tr>          
                         <td>Hosts</td>  
                         <td>{master.state.usable}</td>               
                    </tr> 
                    <tr>          
                         <td>First Address</td>  
                         <td>{master.state.subnets[master.state.curSub].FA}</td>               
                    </tr>
                    <tr>          
                         <td>Last Address</td>  
                         <td>{master.state.subnets[master.state.curSub].LA}</td>               
                    </tr>
                    <tr>          
                         <td>Broadcast</td>  
                         <td>{master.state.subnets[master.state.curSub].BA}</td>               
                    </tr>
                    {
                        /* to review if neccessary
                    
                    <tr>          
                         <td>Range</td>  
                         <td>1-14</td>               
                    </tr>
                    */}
                    </tbody> 
                </table>  
             </div>
         )
     }
 })
 var SubnettingTab=React.createClass({
     getInitialState:function(){
         return {init:true,basic:true,reqSubnets:[{hosts:0,num:1}],subnetCount:1,useVLSM:false,errors:[]}
     },
     subnetBasic:function(){
         var ipType=this.refs.ipType.value
         var address=this.refs.address.value;
         var subPrefix=this.refs.subPrefix.value;
         var bitsToLend=this.refs.bitsToLend.value;
         var errors=0;
         var errorLog=[]
         isValidAddress(address,ipType,errorLog) ? '' : errors++;
         isValidPrefix(subPrefix,ipType,errorLog) ? '' : errors++;
         isValidBits(bitsToLend,subPrefix,ipType,errorLog,) ?'' : errors++;
         console.log(errorLog);
         this.setState({errors:errorLog})
         if(errors!=0){
             return false;
         }

         let curIP=currentNetwork(address,subPrefix);
         let {subnets,subnetCount,usable,newSubMask,newPrefix,origBits}=subnet(address,subPrefix,bitsToLend);
         this.setState({init:false,subnets,subnetCount,subMask:newSubMask,prefix:newPrefix,usable,curIP,bits:bitsToLend,curSub:0,origBits});
     },
     subnetAdvanced:function(){
        var ipType=this.refs.ipType.value
        var address=this.refs.address.value;
        var subPrefix=this.refs.subPrefix.value;
        var hostReqs=this.refs.hostReqs.value;
        var subReqs=this.refs.subReqs.value;
        validate_address(address,errorLog) ? errors++ : '';
        validate_prefix(subPrefix,errorLog,ipType) ? erros++ :'';
        validate_subReq(hostReqs,'Invalid Host requirenments',errorLog) ? erros++ :'';
        validate_subReq(subReqs,'Invalid Host Requirenments',errorLog) ? erros++ :'';
     },
     subnetWithVLSM:function(){
        var ipType=this.refs.ipType.value
        var address=this.refs.address.value;
        var subPrefix=this.refs.subPrefix.value;
        validate_address(address,errorLog) ? errors++ : '';
        validate_prefix(subPrefix,errorLog,ipType) ? erros++ :'';
        var subnetHostReqs=[]
        this.state.reqSubnets.map(function(subnet,index){
            subnetHostReqs.push({subnet:subnet.num,hosts:subnet.hosts});
        });
        for(var index=0;index<subnetHostReqs.length;index++){
            validate_subReq(subnetHostReqs[index].hosts,"Invalid requirenments for subnet :"+subnetHostReqs[index].num,errorLog)
        }
     },
     modeChange:function(){
         var mode=this.refs.mode.value;
         if(mode==="basic"){
             this.setState({basic:true})
         }
         else if(mode==="advanced"){
             this.setState({basic:false})
         }
     },
     setSub:function()
     {
         let subNum=this.refs.subBox.value;
         if(subNum>this.state.subnetCount || subNum==0 || subNum<0)
         {
             alert("Oout of bound ");
             return;
         }

         this.setState({curSub:(subNum-1)});
     },
     subDown:function()
     {
         let curSub=this.state.curSub-1;
         this.setState({curSub});
     },
     subUp:function()
     {
         let curSub=this.state.curSub+1;
         this.setState({curSub});
     },
     reset:function()
     {
          this.setState({init:true,subnets:[],subnetCount:0,subMask:0,prefix:0,usable:0,curIP:0,bits:0,curSub:0});
     },
     useVLSM:function(){
         if(this.state.useVLSM){
              var initState=[{hosts:0,num:1}]
              this.setState({useVLSM:!this.state.useVLSM,reqSubnets:initState,subnetCount:1});
         }
         else{
             this.setState({useVLSM:!this.state.useVLSM})
         }
        
     },
     addSubnet:function(){
         var subCount=this.state.subnetCount;
         var reqSubnets=this.state.reqSubnets;
         reqSubnets.push({hosts:0,num:subCount+1});
         this.setState({reqSubnets:reqSubnets,subnetCount:subCount+1});
     },
     updateSubnet:function(val,key){
         var reqSubnets=this.state.reqSubnets;
         reqSubnets[key].hosts=val;
         this.setState({reqSubnets:reqSubnets});
     },
     normalRender:function(){
         var aproParams=undefined;
         var aproFeedback=function(){};
         var aproSubnet=undefined;
         if(this.state.basic){
             aproParams=function(){
                return(
                     <div>
                     <label htmlFor="bits-to-borrow">Bits to borrow</label>
                     <input className="form-control" ref="bitsToLend"/>
                     </div>
                 )
             }
             aproSubnet=this.subnetBasic;
         }
         else if(!this.state.basic && !this.state.useVLSM){
             aproParams=function(){
                 return(
                     <div>
                     <label htmlFor="Host-requirenments">Host Requirenments</label>
                     <input className="form-control"  ref="hostReqs"/>
                      <label htmlFor="subnet-requirenments">Subnet Requirenments</label>
                     <input className="form-control" ref="subReqs"/>
                     <div className="checkbox"> <label><input type="checkbox" onChange={this.useVLSM} checked={this.state.useVLSM}/>use VLSM</label></div> 
                     </div>
                 )
             }.bind(this);
              aproSubnet=this.subnetAdvanced;
         }
         else{
             aproParams=function(){
                 return(
                     <div>
                     {this.state.reqSubnets.map(function(subnet,index){
                         return(
                             <SubnetField ref={'vlsmSub_'+subnet.num}key={index} updater={this.updateSubnet} num={subnet.num} hosts={subnet.hosts} />
                         )}.bind(this))
                     }
                    <div className="row">
                       <div className="checkbox col-sm-6"> <label><input type="checkbox" onChange={this.useVLSM} checked={this.state.useVLSM} />use VLSM</label></div> 
                        <div style={{marginTop:4+'px'}} className="col-sm-6">
                        <button className="btn btn-default pull-right" type="button" onClick={this.addSubnet}>
                            <span className="glyphicon glyphicon-plus-sign"/> Subnet
                        </button>
                        </div>
                    </div>
                    </div>
                 )
             }.bind(this);
              aproSubnet=this.subnetWithVLSM;
         }

         //prep error log
         if(this.state.errors.length!=0){
             aproFeedback=function(){
                 return(
                    <div>
                    <p>Please Resolve the following issues</p>
                    {
                        this.state.errors.map(function(error,index){
                           return <div className="alert alert-danger" key={index}>{error}</div>
                         })
                    }
                    </div>
                 )
             }.bind(this);
         }
         return(
             <div className="row">
               <div className="col-sm-2 ">
                <form>
                <label htmlFor="mode">Mode</label>
                <select className="form-control" ref="mode" onChange={this.modeChange}>
                    <option value="basic">Basic</option>
                    <option value="advanced">Advanced</option>
                </select>
                </form>
               </div>
               <form className="form col-sm-4">
                 <label className="">Type</label>
                 <select className="form-control" ref="ipType">   
                    <option value="4">IPv4</option>
                    <option value="6">IPv6</option>
                 </select> 
                 <label htmlFor="address">Address</label>
                 <input className="form-control" ref="address"/>

                 <label htmlFor="subnet">Subnet/Prefix</label>
                 <input className="form-control" ref="subPrefix"/>

                 { aproParams()}
                 
                 <hr />
                 <div style={{marginTop:4+'px'}}>
                 <button className="btn btn-default pull-right" type="button" onClick={aproSubnet}>Subnet</button>
                 </div>
               </form>
               <div className="col-sm-4">
                {aproFeedback()}
               </div>
             </div>
         )
     },
     finalRender:function(){
         return(
            <div className="row">
             <div className="col-sm-7">
             <SubnettedView master={this}/>
               <p>Network {this.state.curSub+1} of {this.state.subnetCount}</p>
                    <div className="row">
                     <form className="form-inline col-sm-5">
                        <div className="form-group">
                            <label className="sr-only" htmlFor="subnet number">Go to</label>
                            <input className="form-control" ref="subBox" placeholder="go to subnet"/>
                        </div>
                        <button style={{marginLeft:1+'px',marginTop:2+'px',borderRadius:0+'px'}} type="button" onClick={this.setSub} className="btn btn-default">Go</button>
                        <button style={{marginLeft:1+'px',marginTop:2+'px',borderRadius:0+'px'}} type="button" onClick={this.reset} className="btn btn-default">Reset</button>
                    </form>
                    <div className="btn-group col-sm-3">
                        <button className="btn btn-default glyphicon glyphicon-chevron-left" type="button" onClick={this.subDown}
                        disabled={(this.state.curSub==0) ? true : false}/>
                        <button className="btn btn-default glyphicon glyphicon-chevron-right" type="button" onClick={this.subUp}
                        disabled={(this.state.curSub==(this.state.subnetCount-1)) ? true : false} />
                    </div> 
                    </div>
                </div>{/**end of table view */}
                <div className="col-sm-5">
                    <pre>  
                      <h5>Working console</h5>
                      <hr/>
                     </pre> 
                </div>
            </div>
         )
     },
     render:function(){
            return(
             <div className="col-lg-12">
                        <div className="Header">
                             <h3 className="head">Subnetting</h3>
                        </div>
                        <hr/> 
                        {(this.state.init) ? this.normalRender() : this.finalRender()}
             </div>
         )     
     }
 });

export default SubnettingTab;