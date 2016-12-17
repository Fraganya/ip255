import React from "react";

import {VERSIONS} from '../../lib/globals.js';

let IPVersionsTab=React.createClass({
    getInitialState(){
        return{versions:VERSIONS}
    },   
    render(){
        return(
        <div className="row">
              <div className="col-sm-12">
                {
                    this.state.versions.map((ipVersion,index)=>{
                        return(
                            <div className="col-sm-5" key={index}>
                             <table className="table table-bordered" > 
                                <caption><b>IPv{ipVersion.version}</b></caption> 
                                <thead> 
                                <tr>      
                                    <th>Param</th>          
                                    <th>Value</th> 
                                </tr> 
                            </thead>  
                            <tbody>   
                                <tr>          
                                    <td>Bits</td>  
                                    <td>{ipVersion.bits}</td>               
                                </tr> 
                                <tr>          
                                    <td>Total Addresses</td>  
                                    <td>{ipVersion.total_space}</td>               
                                </tr>  
                                <tr>          
                                    <td>Notation</td>  
                                    <td>{ipVersion.notation}</td>               
                                </tr> 
                                <tr>          
                                    <td>Implemented</td>  
                                    <td>{ipVersion.implemented}</td>               
                                </tr> 
                                <tr>          
                                    <td>RFC</td>  
                                    <td>{ipVersion.rfc}</td>               
                                </tr> 
                                 <tr>          
                                    <td>Security</td>  
                                    <td>{ipVersion.security}</td>               
                                </tr> 
                                 <tr>          
                                    <td colSpan='2'>{ipVersion.description}</td>               
                                </tr> 
                                </tbody> 
                            </table>  
                            </div>
                        )
                    })
                }
                </div>{/**end of table view */}
                <div className="col-sm-12">
                 <hr/>
                 <div style={{marginTop:4+'px'}}>
                 <button className="btn btn-default" type="button" onClick={this.props.return}>
                            <span className="fa fa-undo"/> Go back
                 </button>
                 </div>
                 </div>
            </div>
         )
     },
});


export default IPVersionsTab;