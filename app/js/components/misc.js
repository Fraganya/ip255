import React from 'react';

import FindNetTab from './tabs/find-net.js';
import FindClassTab from './tabs/find-class.js';
import SpecialAddTab from './tabs/special-addresses.js'; 
import ProtocolsTab from './tabs/protocols.js'; 
import ClassesTab from './tabs/classes.js'; 
import IPVersionsTab from './tabs/ip-versions.js'; 
import GuidelinesTab from './tabs/guidelines.js'; 
let MiscTab=React.createClass({
   getInitialState(){
            return {view:'init',currentView:'Tasks'}
     },
    reset(){ this.setState({view:'init',currentView:'Tasks'})},
     //view alteering functions
    findNet(){ this.setState({view:'find-net',currentView:'Find Network'})  },
    findClass(){ this.setState({view:'find-class',currentView:'Find Class'})},
    convert(){ this.setState({view:'convert',currentView:'Convert'})},
    translate(){ this.setState({view:'translate',currentView:'Translate'})},
    eui64(){ this.setState({view:'eui-64',currentView:'EUI-64'})},
    classView(){ this.setState({view:'classes',currentView:'IP Classes'})},
    protoView(){ this.setState({view:'protocols-ports',currentView:'Protocols'})},
    specAdds(){ this.setState({view:'spec-adds',currentView:'Special Addresses'})},
    ipVerView(){ this.setState({view:'ip-versions',currentView:'IP Versions'})},
    guideView(){ this.setState({view:'guidelines',currentView:'Guidelines'})},
    taskView(){
        return(
            <div>
                    <div className="col-sm-3">
                        <h3>Tools</h3>
                        <hr />
                        <button className="btn btn-default btn-block" onClick={this.findNet}>Find Network</button>
                        <button className="btn btn-default btn-block" onClick={this.findClass}>Find Class</button>
                        <button className="btn btn-default btn-block" onClick={this.convert}>Convert</button>
                        <button className="btn btn-default btn-block" onClick={this.translate}>Translate</button>
                        <button className="btn btn-default btn-block" onClick={this.eui64}>EUI-64</button>
                    </div>
                        <div className="col-sm-3">
                        <h3>Information</h3>
                        <hr />
                        <button className="btn btn-default btn-block" onClick={this.classView}>Classes </button>
                        <button className="btn btn-default btn-block" onClick={this.protoView}>Protocols & Ports</button>
                        <button className="btn btn-default btn-block" onClick={this.specAdds}>Special Addresses</button>
                        <button className="btn btn-default btn-block" onClick={this.ipVerView}>IP Versions</button>
                        <button className="btn btn-default btn-block" onClick={this.guideView}>Guidelines</button>
                    </div>
             </div>
        )
    },
    render:function(){
        let view=()=>{};
        if(this.state.view=='find-net') view=()=>{ return(<FindNetTab  return={this.reset}/>)}
        else if(this.state.view=='find-class') view=()=>{ return(<FindClassTab return={this.reset}/>)}
        else if(this.state.view=='convert') view=()=>{ return(<ConvertTab return={this.reset}/>)}
        else if(this.state.view=='translate') view=()=>{ return(<TranslateTab return={this.reset}/>)}
        else if(this.state.view=='eui64') view=()=>{ return(<EUI64Tab return={this.reset}/>)}
        else if(this.state.view=='classes') view=()=>{ return(<ClassesTab return={this.reset}/>)}
        else if(this.state.view=='protocols-ports') view=()=>{ return(<ProtocolsTab return={this.reset}/>)}
        else if(this.state.view=='spec-adds') view=()=>{ return(<SpecialAddTab return={this.reset}/>)}
        else if(this.state.view=='ip-versions') view=()=>{ return(<IPVersionsTab return={this.reset}/>)}
        else if(this.state.view=='guidelines') view=()=>{ return(<GuidelinesTab return={this.reset}/>)}
        else{ view=()=>{return this.taskView()}}
        return(
             <div className="col-lg-12">
                        <div className="Header">
                             <h3 className="head">Misc/{this.state.currentView}</h3>
                        </div>
                        <hr/> 
                        {view()}  
             </div>
        )
    }
});

export default MiscTab;