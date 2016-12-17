import React from "react";

let guideLines=[
    "Find the largest segment in the area - the area with the largest number of devices ",
    "Find the appropriate subnet mask for the largest segment",
    "Write down your subnet numbers to fit your subnet mask",
    "For your smaller segments,take one of the newly created subnets and apply a different more appropriate subnet mask to it",
    "Write down your newly subnetted subnets",
    "For even smaller segments go back to step 4"
];

let GuidelinesTab=React.createClass({
    getInitialState(){
        return{guidelines:guideLines}
    },   
    render(){
        return(
        <div className="row">
              <div className="col-sm-5">
                <p className="well well-sm">An overview of the guidelines this app uses to perfom Variable length subnet Masking (VLSM)</p>

               {
                    this.state.guidelines.map((step,index)=>{
                        return(
                            <div key={index}>[ Step {index+1}] :<br/> {step}
                            <br/><br/>
                            </div>
                        )
                    })
                }
                 <hr/>
                 <div style={{marginTop:4+'px'}}>
                 <button className="btn btn-default" type="button" onClick={this.props.return}>
                            <span className="fa fa-undo"/> Go back
                 </button>
                 </div>
              </div>{/**end of table view */}
            </div>
         )
     },
});


export default GuidelinesTab;