import React from "react";

let ProtocolsTab=React.createClass({
    render(){
        return(
        <div className="row">
              <div className="col-sm-8">
                 <form className="form-inline">
                    <input style={{borderRadius:0+'px'}}className="form-control" placeholder="search for a protocol"/ >
                 </form>
               <table className="table table-bordered">
               <caption>Protocols and Ports as retrieveed from <a>IANA.org</a></caption>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Protocol</th>
                    <th>Port #</th>
                    <th>Description</th>
                </tr>
                </thead>
               </table>
                <hr/>
                 <div style={{marginTop:4+'px'}}>
                 <button className="btn btn-default" type="button" onClick={this.props.return}>
                            <span className="fa fa-undo"/> Go back
                 </button>
                 </div>
                </div>{/**end of table view */}
                <div className="col-sm-4">
                    <h5>Notes</h5>
                    <hr/>
                    <p className="well well-sm">
                      
                    
                     </p> 
                </div>
            </div>
         )
     },
});


export default ProtocolsTab;