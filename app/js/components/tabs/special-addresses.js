import React from "react";
const fs =window.require('electron').remote.require('fs');

//console.log(specialIPs.toString());
let SpecialAddTab=React.createClass({
    getInitialState(){
            return{err:'',specialAddresses:[],tempContainer:[]};
    },
    filter(){
        let allAddresses=this.state.allAddresses;
        let specialAddresses=this.state.specialAddresses;

        let keyWords=this.refs.searchBox.value;

        //console.log(keyWords,tempContainer,specialAddresses)
        if(!(keyWords.trim())){
             specialAddresses=allAddresses.slice(0);
        }
        else{ 
            specialAddresses=[];
            for(let record of allAddresses)
            {
                if((record.name.toLowerCase().search(keyWords.toLowerCase()))!=-1){
                    specialAddresses.push(record);
                }
            }

            if(specialAddresses.length==0){
                specialAddresses=allAddresses.slice(0);
            }
        }

        this.setState({specialAddresses});
    },
    componentDidMount() {
        fs.readFile('./refs/iana-ipv4-special-registry.xml',(err,data)=>{
            if(err){
                this.setState({error:err.toString()})
                return false;
            }
            let parser=new DOMParser();
            let addressDOM=parser.parseFromString(data.toString(),'text/xml');
            let notes=addressDOM.getElementsByTagName('note')[0].innerHTML;
            let records=addressDOM.getElementsByTagName("record");
            let specialAddresses=[];
            for(let record of records)
            {
                specialAddresses.push({
                    address:record.children[0].innerHTML,
                    name:record.children[1].innerHTML,
                    rfc:record.children[2].innerHTML,
                    source:record.children[3].innerHTML,
                    destination:record.children[4].innerHTML,
                    forwadable:record.children[5].innerHTML,
                })
            }
            fs.readFile('./refs/iana-ipv6-special-registry.xml',(err,data)=>{
            if(err){
                this.setState({error:err.toString()})
                return false;
            }
            let addressDOM=parser.parseFromString(data.toString(),'text/xml');
            let records=addressDOM.getElementsByTagName("record");
            for(let record of records)
            {
                specialAddresses.push({
                    address:record.children[0].innerHTML,
                    name:record.children[1].innerHTML,
                    rfc:record.children[2].innerHTML,
                    source:record.children[3].innerHTML,
                    destination:record.children[4].innerHTML,
                    forwadable:record.children[5].innerHTML,
                })
            }
            this.setState({specialAddresses,allAddresses:specialAddresses.slice(0),notes});
        })
        })
    },    
    render(){
        return(
        <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-xs-12">
              {
                  (this.state.err) ? <p>`Error -{this.state.err} "`</p> :''
              }
              <form className="form-inline">
                    <input style={{borderRadius:0+'px'}}className="form-control" ref="searchBox" placeholder="Find address" onChange={this.filter}/ >
                 </form>
               <table className="table table-bordered">
               <caption>Special Addresses as retrieveed from IANA.org</caption>
                <thead>
                <tr>
                    <th>Block</th>
                    <th>Name</th>
                    <th>RFC</th>
                    <th>Source</th>
                    <th>Destination</th>
                    <th>Forwardable</th>
                </tr>
                </thead>
                <tbody>
                    {
                            this.state.specialAddresses.map((addRecord,index)=>{
                                return(
                                    <tr key={index}>
                                        <td>{addRecord.address}</td>
                                        <td>{addRecord.name}</td>
                                        <td>{addRecord.rfc}</td>
                                        <td>{addRecord.source}</td>
                                        <td>{addRecord.destination}</td>
                                        <td>{addRecord.forwadable}</td>
                                    </tr>
                                )
                            })
                     }
                </tbody>
               </table>
                <hr/>
                 <div style={{marginTop:4+'px'}}>
                 <button className="btn btn-default" type="button" onClick={this.props.return}>
                            <span className="fa fa-undo"/> Go back
                 </button>
                 </div>
                </div>{/**end of table view */}
                <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                    <h5>Notes</h5>
                    <hr/>
                      <pre style={{height:'auto',width:'100%'}}>
                      {this.state.notes}   
                      </pre>                 
                </div>
            </div>
         )
     },
});


export default SpecialAddTab;