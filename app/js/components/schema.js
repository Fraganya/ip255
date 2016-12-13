 import React from "react";

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
                <td ref="hostNum">x</td>
                <td ref="Address">xx.xx.xx.xx</td>
                <td ref="assigned" className="text-center">
                    <input type='checkbox' checked={(this.state.assigned) ? true : false} onChange={this.assign} />
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
         this.setState({init:true})
     },
     loadSchema:function (){
          this.setState({init:false})
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
                    <p className="well well-sm col-sm-6">xx.xx.xx.xx Network Schema</p>
                    <div className="btn-group col-sm-4" >
                        <button className="btn btn-default fa fa-save" title="Save Schema"/>
                        <button className="btn btn-default fa fa-trash" title="Delete Schema"/>
                         <button className="btn btn-default fa fa-close" type="button" title="Close Schema" onClick={this.reset}/>
                    </div>
                </div>
                <div className="col=sm-12">
                            <p className="col-sm-3">Network x of xx</p>
                            <div className="col-sm-2">
                                <button className="btn btn-sm btn-default fa fa-chevron-left"/>
                                &nbsp;
                                <button className="btn btn-sm btn-default fa fa-chevron-right"/>
                            </div>
                           
                </div>
                <div className="col-sm-12">
                        <div className="col-sm-9">
                           
                            <div className="row">
                                <table className="table table-bordered"> 
                            <caption>Hosts</caption> 
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
                                <HostEntry />
                                <HostEntry />
                                <HostEntry />
                                <HostEntry />
                            </tbody> 
                            </table>  
                            <div className="row">
                             <form className="form-inline col-sm-5">
                                    <div className="form-group">
                                        <label className="sr-only" htmlFor="subnet number">Go to</label>
                                        <input className="form-control" ref="subBox" placeholder="go to host page"/>
                                    </div>
                                    <button style={{marginLeft:1+'px',marginTop:2+'px',borderRadius:0+'px'}} type="button" onClick={this.setSub} className="btn btn-default">Go</button>
                                </form>
                                <div className="5">
                                <p className="col-sm-3">Host Page x of xx</p>
                                <div className="col-sm-2">
                                    <button className="btn btn-sm btn-default fa fa-chevron-left"/>
                                    &nbsp;
                                    <button className="btn btn-sm btn-default fa fa-chevron-right"/>
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
                                    <td>xx:</td>               
                                </tr>  
                                <tr>          
                                    <td>Prefix</td>   
                                    <td>/xx</td>               
                                </tr>  
                                <tr>      
                                    <td>Submask:</td>       
                                    <td>xx.xx.xx.xx:</td>               
                                </tr>  
                                <tr>      
                                    <td>Class:</td>       
                                    <td>AA</td>               
                                </tr>
                                 <tr>      
                                    <td><b className="fa fa-hashtag"/> of subnets</td>       
                                    <td>xx</td>               
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
