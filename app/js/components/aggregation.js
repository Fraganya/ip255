 import React from "react";
 

 /** Library imports */
 import {isValidAddress} from '../lib/ip.js';
 import {currentNetwork} from '../lib/ip.js';
 import {isValidPrefix} from "../lib/ip.js";
 import {aggregate} from "../lib/ip.js";
 import {translateMask} from "../lib/ipv4.js";

 let NetworkField=React.createClass({
    handleChange:function(){
         let address=this.refs.address.value;
         this.props.updater(address,(this.props.num-1));
     },
     remove:function(){
         this.props.remove(this.props.num-1);
     },
     render:function(){
         return(
             <div>
            <label htmlFor="address">Network {this.props.num}</label>
            <div className="input-group input-group-sm">
                <input className="form-control" ref="address" onChange={this.handleChange} value={this.props.address} />
                <span className="input-group-btn">
                    <button className="btn btn-default" type="button" onClick={this.remove}><span className="fa fa-close"/></button>
                </span>
            </div>
            </div>
         )
         
     }
 });
 
  let AggregationTab=React.createClass({
     getInitialState:function(){
         return{init:true,errors:[],networks:[{num:1,address:''},{num:2,address:''}]};
     },
     aggregate:function(){
         let ipType=this.refs.ipType.value;
         let subPrefix=this.refs.subPrefix.value;

         let networks=this.state.networks;

         let errorLog=[];
         isValidPrefix(subPrefix,ipType,errorLog); //check if prefix is valid
         //check if the addresses are valid ip address
         for(let subnet=0;subnet<networks.length;subnet++)
         {
             //check if the network is a valid address
             if(!isValidAddress(networks[subnet].address,ipType)){
                 errorLog.push(`Network ${subnet+1} has an invalid ipv${ipType} address`);
             }
             else{
                 //check if the address given is really a network address using the give subnet mask /prefix
                 if(!(currentNetwork(networks[subnet].address,subPrefix)==networks[subnet].address)){
                      errorLog.push(`Network ${subnet+1} is not a network address using the current Subnet Mask /prefix`);
                 }
                 else{
                     //check if there is no other match
                     let matchCount=0;
                     for(let network of networks)
                     {
                         if((networks[subnet].address==network.address) && networks[subnet].num!=network.num) {
                              errorLog.push(`Network ${subnet+1} has a similar address as Network ${network.num}`);
                         }
                     }
                 }
             }
         }
         
         this.setState({errors:errorLog});
         if(errorLog.length!=0){
             return false;
         }

         //passed --continue to aggregate
         let workFile=[];
         let {aggregatedNet}=aggregate(networks,workFile);
         let origPref=(subPrefix.charAt(0)=='/') ? subPrefix: translateMask(subPrefix);
         this.setState({aggregatedNet,workFile,origPref,init:false});

     },
     reset:function(){
         this.setState({init:true,errors:[],networks:[{num:1,address:''},{num:2,address:''}],workFile:[]});
     },
     updateNetwork:function(address,key){
         let networks=this.state.networks;
         networks[key].address=address;
         this.setState({networks});
     },
     addNetwork:function(){
         let networks=this.state.networks;
         networks.push({num:networks.length+1,address:''});
         this.setState({networks,errors:[]});
     },
     remove:function(key){
         let networks=this.state.networks;
         let errorLog=[];
         if(networks.length==2){
             errorLog.push("There must be at least 2 networks to perfom aggregation");
             this.setState({errors:errorLog});
             return;
         }
         else if(key!=networks.length-1){
             errorLog.push(`You cannot remove network ${key+1} whilst network ${networks.length} is in existence.Remove higher networks first!`);
             this.setState({errors:errorLog});
             return;
         }
         console.log(networks,key);
         networks.splice(key,1);
         this.setState({networks,errors:[]});
     },
     normalRender:function(){
            //prep error log
         let aproFeedback=()=>{};
         if(this.state.errors.length!=0){
             aproFeedback=()=>{
                 return(
                    <div>
                    <p>Please Resolve the following issues</p>
                    {
                        this.state.errors.map((error,index)=>{
                           return <div className="alert alert-danger" key={index}>{error}</div>
                         })
                    }
                    </div>
                 )
             }
         }
         return(
             <div className="row">
               <form className="form col-sm-4">
                 <label className="">Type</label>
                 <select className="form-control" ref="ipType" defaultValue="4" disabled={true}>   
                    <option value="4">IPv4</option>
                    <option value="6">IPv6</option>
                 </select> 
                 <label htmlFor="mask">Mask/Prefix</label>
                 <input className="form-control" ref="subPrefix"/>


                 <label htmlFor="networks">Networks</label>
                 <hr style={{margin:1+'px'}}/>
                 {
                        this.state.networks.map((network,index)=>{
                            return(
                                <NetworkField ref={'network_'+index} key={index} remove={this.remove} updater={this.updateNetwork} address={network.address} num={network.num} />
                            )})
                 }

                 <hr/>
                 <div style={{marginTop:4+'px'}}>
                 <button className="btn btn-default" type="button" onClick={this.addNetwork}>
                            <span className="glyphicon glyphicon-plus-sign"/> Network
                   </button>
                 <button className="btn btn-default pull-right" type="button" onClick={this.aggregate}>Aggregate</button>
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
                    <p className="well well-sm">Successfully aggregated the networks</p>
                     <table className="table table-bordered"> 
                    <caption>Aggregated Network Information</caption> 
                    <thead> 
                    <tr>      
                        <th>Param</th>          
                        <th>Value</th> 
                    </tr> 
                   </thead>  
                   <tbody>     
                     <tr>          
                         <td>Final Address</td>  
                         <td>{this.state.aggregatedNet.address}</td>               
                    </tr>  
                    <tr>          
                         <td>Prefix</td>  
                         <td>/{this.state.aggregatedNet.prefix}</td>               
                    </tr> 
                     <tr>          
                         <td>Subnet mask</td>  
                         <td>{this.state.aggregatedNet.subMask}</td>               
                    </tr> 
                    </tbody> 
                </table>  
                 <table className="table table-bordered"> 
                 <caption>Input Networks</caption> 
                    <thead> 
                    <tr>      
                        <th>Networks</th>          
                    </tr> 
                   </thead>  
                   <tbody>     
                   {
                       this.state.networks.map((network,index)=>{
                           return(
                               <tr key={index}>           
                                    <td>{network.address}{this.state.origPref}</td>               
                              </tr> 
                           )
                       })
                   }
                    </tbody> 
                </table>  
                      <button style={{marginLeft:1+'px',marginTop:2+'px',borderRadius:0+'px'}} type="button" onClick={this.reset} className="btn btn-default">Reset</button>
                </div>
                <div className="col-sm-5">
                     <pre>  
                      <h5>Working console</h5>
                      <hr/>
                      {
                          this.state.workFile.map(function(val,index){
                              return(
                                  <p key={index}>{val}</p>
                              )
                          })
                      }
                     </pre>
                </div>
             </div>
         )

     },
     render:function(){
         return(
              <div className="col-lg-12">
                        <div className="Header">
                             <h3 className="head">Aggregation/Route Summarization</h3>
                        </div>
                        <hr/> 
                        {(this.state.init) ? this.normalRender() : this.finalRender()}
             </div>
         )
     }
 });

export default AggregationTab;
 