import React from "react";

let SpecialAddTab=React.createClass({
    render(){
        return(
        <div className="row">
              <div className="col-sm-8">
                 <form className="form-inline">
                    <input style={{borderRadius:0+'px'}}className="form-control" placeholder="Find address"/ >
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
                    <th>Global</th>
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


export default SpecialAddTab;