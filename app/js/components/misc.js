import React from 'react';

let MiscTab=React.createClass({
    render:function(){
        return(
             <div className="col-lg-12">
                        <div className="Header">
                             <h3 className="head">Misc</h3>
                        </div>
                        <hr/> 
                        <div className="col-sm-3">
                            <h3>Tools</h3>
                            <hr />
                            <button className="btn btn-default btn-block">Find Network</button>
                            <button className="btn btn-default btn-block">Find Class</button>
                            <button className="btn btn-default btn-block">Convert</button>
                            <button className="btn btn-default btn-block">Translate</button>
                            <button className="btn btn-default btn-block">EUI-64</button>
                        </div>
                         <div className="col-sm-3">
                            <h3>Information</h3>
                            <hr />
                            <button className="btn btn-default btn-block">Classes</button>
                            <button className="btn btn-default btn-block">Protocols</button>
                            <button className="btn btn-default btn-block">Ports</button>
                            <button className="btn btn-default btn-block">Standard Organisations</button>
                            <button className="btn btn-default btn-block">IP Versions</button>
                            <button className="btn btn-default btn-block">Special addresses</button>
                            <button className="btn btn-default btn-block">Guidelines</button>
                        </div>
             </div>
        )
    }
});

export default MiscTab;