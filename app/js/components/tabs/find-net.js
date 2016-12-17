import React from 'react' ;

 import {isValidAddress} from '../../lib/ip.js';
 import {max_hosts} from '../../lib/ip.js';
 import {currentNetwork} from '../../lib/ip.js';
 import {isValidPrefix} from "../../lib/ip.js";
 import {translateMask} from "../../lib/ipv4.js";
 import {translatePrefix} from "../../lib/ipv4.js";


let FindNetTab=React.createClass({
    getInitialState(){ return{init:true,errors:[]}},
    AND(){
        let ipType=this.refs.ipType.value;
        let address=this.refs.address.value;
        let subPrefix=this.refs.subPrefix.value;

        let errorLog=[];
        isValidPrefix(subPrefix,ipType,errorLog);
        isValidAddress(address,ipType,errorLog);

        this.setState({errors:errorLog});
        if(errorLog.length!=0){
            return;
        }

        let netAddress,prefix,subMask,blockSize;
        if(ipType==4){
             netAddress=currentNetwork(address,subPrefix);
             prefix=(subPrefix.charAt(0)=='/') ? subPrefix: translateMask(subPrefix);
             subMask=(subPrefix.charAt(0)=='/') ? translatePrefix(subPrefix.substring(1,subPrefix.length)):(subPrefix);
             blockSize=parseInt(max_hosts(subPrefix))+2;
        }
        else{
            console.log("Unssupported")
            return;
        }
        
        
        this.setState({netAddress,prefix,subMask,blockSize,init:false});

    },
    normalRender(){
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
                 <select className="form-control" ref="ipType">   
                    <option value="4">IPv4</option>
                    <option value="6">IPv6</option>
                 </select> 
                 <label htmlFor="address">Address</label>
                 <input className="form-control" ref="address"/>
                 <label htmlFor="mask">Mask/Prefix</label>
                 <input className="form-control" ref="subPrefix"/>
                 <hr/>
                 <div style={{marginTop:4+'px'}}>
                 <button className="btn btn-default" type="button" onClick={this.props.return}>
                            <span className="fa fa-undo"/> Go back
                 </button>
                 <button className="btn btn-default pull-right" type="button" onClick={this.AND}>AND</button>
                 </div>
               </form>
               <div className="col-sm-4">
                {aproFeedback()}
               </div>
          </div>
         )
        
    },
    finalRender(){
        return(
             <div className="row">
                <div className="col-sm-7">
                    <p className="well well-sm">Successfully ANDED the Address</p>
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
                         <td>Network Address</td>  
                         <td>{this.state.netAddress}</td>               
                    </tr>  
                    <tr>          
                         <td>Prefix</td>  
                         <td>{this.state.prefix}</td>               
                    </tr> 
                     <tr>          
                         <td>Subnet mask</td>  
                         <td>{this.state.subMask}</td>               
                    </tr> 
                    <tr>          
                         <td>Block Size</td>  
                         <td>{this.state.blockSize}</td>               
                    </tr> 
                    </tbody> 
                </table>  
                 <button className="btn btn-default" type="button" onClick={()=>{this.setState({init:true})}}>
                            <span className="fa fa-undo"/> reset
                 </button>
                </div>
                
             </div>
        )
    },
    render(){
            return(
               <div>
                    { (this.state.init) ? this.normalRender() : this.finalRender()}
               </div>
            )
    }
});

export default FindNetTab;