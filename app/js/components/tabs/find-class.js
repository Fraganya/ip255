import React from 'react' ;

 import {isValidAddress} from '../../lib/ip.js';
 import {getClass} from '../../lib/ipv4.js';
 import {getClassInfo} from '../../lib/ip.js';



let FindClassTab=React.createClass({
    getInitialState(){ return{init:true,errors:[]}},
    findClass(){
        let address=this.refs.address.value;

        let errorLog=[];
        isValidAddress(address,'4',errorLog);

        this.setState({errors:errorLog});
        if(errorLog.length!=0){
            return;
        }

        let netClass=getClass(address);
        let {range,prefix,subMask,blockSize,subnets}=getClassInfo(netClass);
        
        
        this.setState({netClass,netAddress:address,range,prefix,subMask,blockSize,subnets,init:false});

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
                 <p className="well well-info">Classes are only applicable to IPv4 addresses</p>
                 <label htmlFor="address">IPv4 Address</label>
                 <input className="form-control" ref="address"/>
                 <hr/>
                 <div style={{marginTop:4+'px'}}>
                 <button className="btn btn-default" type="button" onClick={this.props.return}>
                            <span className="fa fa-undo"/> Go back
                 </button>
                 <button className="btn btn-default pull-right" type="button" onClick={this.findClass}>Find Class</button>
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
                    <p className="well well-sm">
                        The network address {this.state.address} is in class <b>{this.state.netClass}</b>
                    </p>
                      <table className="table table-bordered"> 
                    <caption>Class Information</caption> 
                    <thead> 
                    <tr>      
                        <th>Param</th>          
                        <th>Value</th> 
                    </tr> 
                   </thead>  
                   <tbody>  
                     <tr>          
                         <td>Class</td>  
                         <td>{this.state.netClass}</td>               
                    </tr>   
                     <tr>          
                         <td>Subnets</td>  
                         <td>{this.state.subnets}</td>               
                    </tr> 
                     <tr>          
                         <td>Range</td>  
                         <td>{this.state.range}</td>               
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
                         <td>Subnet block-size</td>  
                         <td>{this.state.blockSize}</td>               
                    </tr> 
                    </tbody> 
                </table>  
                 <button className="btn btn-default" type="button" 
                 onClick={()=>{this.setState({init:true,netClass:'',netAddress:'',range:'',prefix:'',subMask:'',blockSize:'',subnet:''})}}>
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

export default FindClassTab;