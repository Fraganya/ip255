import React from 'react' ;

import {convertBase} from '../../lib/ip.js';

let ConvertTab=React.createClass({
    getInitialState(){ return{errors:[],init:true}},
    fromBin(){
        let binNum=this.refs.binary.value;
        let errors=[];
        if(binNum.trim()){
             for(let char=0;char<binNum.length;char++)
             {
                if(binNum.charAt(char)!=0 && binNum.charAt(char)!=1){
                    errors.push(`${binNum.charAt(char)} is not a valid binary number .{only 0's and 1's allowed}`);
                    break;
                }
             }
              this.setState({errors});
              if(errors.length!=0){
                return false;
              }
             this.refs.decimal.value=convertBase(binNum,2,10);
             this.refs.hex.value=convertBase(binNum,2,16);
        }
        else{
              this.setState({errors});
             this.refs.decimal.value="";
             this.refs.hex.value="";
        }
       
    },
    fromDec(){
        let dec=this.refs.decimal.value;
        let errors=[];
        if(dec.trim()){
             for(let char=0;char<dec.length;char++)
             {
                if(!(Number(dec.charAt(char))>=0 && Number(dec.charAt(char))<=9)){
                    errors.push(`${dec.charAt(char)} is not a valid decimal number .{only 0-9 is allowed}`);
                    break;
                }
             }
              this.setState({errors});
              if(errors.length!=0){
                return false;
              }
             this.refs.binary.value=convertBase(dec,10,2);
             this.refs.hex.value=convertBase(dec,10,16);
        }
        else{
             this.setState({errors});
             this.refs.binary.value="";
             this.refs.hex.value="";
        }
    },
    fromHex(){
        let hex=this.refs.hex.value;
        let errors=[];
        if(hex.trim()){
             let hexPatt=/[a-f]/i;
             for(let char=0;char<hex.length;char++)
             {
                if(Number(hex.charAt(char)) || hex.charAt(char)=='0'){
                     if(!(Number(hex.charAt(char))>=0 && Number(hex.charAt(char))<=9)){
                        errors.push(`${hex.charAt(char)} is not a valid Hecadecmial number .{only 0-9 and A-F are allowed}`);
                        break;
                    }
                }
                else if(!hexPatt.test(hex.charAt(char))){
                     console.log("i have a 0")
                     errors.push(`${hex.charAt(char)} is not a valid Hecadecmial number .{only 0-9 and A-F are allowed}`);
                     break;
                }
               
             }
              this.setState({errors});
              if(errors.length!=0){
                return false;
              }
             this.refs.binary.value=convertBase(hex,16,2);
             this.refs.decimal.value=convertBase(hex,16,10);
        }
        else{
             this.setState({errors});
             this.refs.decimal.value="";
             this.refs.binary.value="";
        }
    },
    normalRender(){
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
               <form className="form col-sm-5">
                 <p className="well well-info">Convert intergers from one base to another</p>
                 <label htmlFor="binary">Binary</label>
                 <input className="form-control" ref="binary" placeholder="Enter binary number" onChange={this.fromBin}/>
                  <label htmlFor="decimal">Decimal</label>
                  <input className="form-control" ref="decimal" placeholder="Enter decimal number" onChange={this.fromDec}/>
                  <label htmlFor="hex">Hexadecimal</label>
                 <input className="form-control" ref="hex" placeholder="Enter hex number" onChange={this.fromHex}/>
                 <hr/>
                 <div style={{marginTop:4+'px'}}>
                 <button className="btn btn-default" type="button" onClick={this.props.return}>
                            <span className="fa fa-undo"/> Go back
                 </button>
                 </div>
               </form>
               <div className="col-sm-4">
                {aproFeedback()}
               </div>
          </div>
         )
        
    },
    render(){
            return(
               <div>
                 { this.normalRender() }
               </div>
            )
    }
});

export default ConvertTab;