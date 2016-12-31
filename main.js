// get Essential Objects
const {app,BrowserWindow}=require("electron");

app.on('ready',()=>{
    let win=new BrowserWindow({width:1000,height:800,icon:`${__dirname}/favicon.png`});
    win.loadURL(`file://${__dirname}/app.html`);
})

/*
exports.openWindow=()=>{
    let win=new BrowserWindow({width:400,height:300});
    win.loadURL(`file://${__dirname}/app/screens/win.html`);
}
*/