 var SchemaTab=React.createClass({
     render:function(){
         return(
             <div className="col-lg-12">
                        <h3>Schema</h3>
                        <p>This template has a responsive menu toggling system. The menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens. When toggled using the button below, the menu will appear/disappear. On small screens, the page content will be pushed off canvas.</p>
                        <p>Make sure to keep all page content within the <code>#page-content-wrapper</code>.</p>
                        <a href="#menu-toggle" className="btn btn-default" id="menu-toggle">Toggle Menu</a>
             </div>
         )
     }
 });

 ReactDOM.render(<SchemaTab />,document.getElementById("schema"));