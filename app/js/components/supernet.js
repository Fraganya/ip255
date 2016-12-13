import React from 'react';

let SupernetTab=React.createClass({
    getInitialState:function(){
        return {init:true,errors:[]}
    },
    supernet:function(){
        this.setState({init:false});
    },
    reset:function(){
        this.setState({init:true});
    },
    normalRender:function()
    {
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
                 <select className="form-control" ref="ipType">   
                    <option value="4">IPv4</option>
                    <option value="6">IPv6</option>
                 </select> 
                 <label htmlFor="address">Address</label>
                 <input className="form-control" ref="address"/>

                 <label htmlFor="subnet">Subnet/Prefix</label>
                 <input className="form-control" ref="subPrefix"/>    
                  <label htmlFor="subnet">Hosts required</label>
                 <input className="form-control" ref="hostReq"/>              
                 <hr />
                 <div style={{marginTop:4+'px'}}>
                 <button className="btn btn-default pull-right" type="button" onClick={this.supernet} >Supernet</button>
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
                <p className="well well-sm col-sm-12">Successfully supernetted the xx.xx.xx.xx network by turning off xx network bits</p>
                
                 <table className="table table-bordered col-sm-6"> 
                 <caption>New  Network Info</caption> 
                    <thead> 
                    <tr>      
                        <th>Param</th> 
                        <th>Value</th>       
                    </tr> 
                   </thead>  
                   <tbody>     
                     <tr>   
                         <td>Network</td>         
                         <td>xx.xx.xx.xx:</td>               
                    </tr>  
                    <tr>        
                         <td>Prefix</td>    
                         <td>xx:</td>               
                    </tr>  
                     <tr>   
                         <td>Mask</td>         
                         <td>xx.xx.xx.xx:</td>               
                    </tr>  
                     <tr>   
                         <td>Hosts</td>         
                         <td>xx.xx.xx.xx:</td>               
                    </tr> 
                    </tbody> 
                </table>
                 <table className="table table-bordered col-sm-6"> 
                 <caption>Old  Network Info</caption> 
                    <thead> 
                    <tr>      
                        <th>Param</th> 
                        <th>Value</th>       
                    </tr> 
                   </thead>  
                   <tbody>     
                     <tr>   
                         <td>Network</td>         
                         <td>xx.xx.xx.xx:</td>               
                    </tr>  
                    <tr>        
                         <td>Prefix</td>    
                         <td>xx:</td>               
                    </tr>  
                     <tr>   
                         <td>Mask</td>         
                         <td>xx.xx.xx.xx:</td>               
                    </tr>  
                     <tr>   
                         <td>Hosts</td>         
                         <td>xx.xx.xx.xx:</td>               
                    </tr> 
                    </tbody> 
                </table>  
                 <button style={{marginLeft:1+'px',marginTop:2+'px',borderRadius:0+'px'}} type="button" onClick={this.reset} className="btn btn-default">Reset</button>
              </div>
            </div>
        )
    },
    render:function(){
        return(
             <div className="col-lg-12">
                        <div className="Header">
                             <h3 className="head">Supernet</h3>
                        </div>
                        <hr/> 
              { (this.state.init) ? this.normalRender() : this.finalRender() }
              </div>
        )
    }
});

export default SupernetTab;