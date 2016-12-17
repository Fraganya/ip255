import React from "react";


import {getClassInfo} from "../../lib/ip.js";
let ClassesTab=React.createClass({
    getInitialState(){
        return{classInfo:[
            {netClass:'A'},
            {netClass:'B'},
            {netClass:'C'},
            {netClass:'D'},
            {netClass:'E'}
        ]}
    },
    componentDidMount() {
        let classInfo=this.state.classInfo;
        for(let ipClass of classInfo)
        {
            console.log(ipClass);            
           let {range,prefix,subMask,blockSize,subnets}=getClassInfo(ipClass.netClass);
           ipClass.range=range;
           ipClass.prefix=prefix;
           ipClass.subMask=subMask;
           ipClass.blockSize=blockSize;
           ipClass.subnets=subnets;
        }
        console.log(classInfo);
        this.setState({classInfo})
    },    
    render(){
        return(
        <div className="row">
              <div className="col-sm-12">
                {
                    this.state.classInfo.map((classInfo,index)=>{
                        return(
                            <div className="col-sm-4" key={index}>
                             <table className="table table-bordered" > 
                                <caption>Class {classInfo.netClass} Information</caption> 
                                <thead> 
                                <tr>      
                                    <th>Param</th>          
                                    <th>Value</th> 
                                </tr> 
                            </thead>  
                            <tbody>   
                                <tr>          
                                    <td>Subnets</td>  
                                    <td>{classInfo.subnets}</td>               
                                </tr> 
                                <tr>          
                                    <td>Range</td>  
                                    <td>{classInfo.range}</td>               
                                </tr>  
                                <tr>          
                                    <td>Prefix</td>  
                                    <td>{classInfo.prefix}</td>               
                                </tr> 
                                <tr>          
                                    <td>Subnet mask</td>  
                                    <td>{classInfo.subMask}</td>               
                                </tr> 
                                <tr>          
                                    <td>Subnet block-size</td>  
                                    <td>{classInfo.blockSize}</td>               
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


export default ClassesTab;