/** Libraries */
import React from "react";
import ReactDOM from "react-dom";

/** Components */
import SubnettingTab from "./components/subnetting.js";
import SupernetTab from "./components/supernet.js";
import AggregationTab from "./components/aggregation.js";
import SchemaTab from "./components/schema.js";
import MiscTab from "./components/misc.js";

/** Render components int target tabs */
ReactDOM.render(<SubnettingTab />,document.getElementById("subnetting"));
ReactDOM.render(<SupernetTab />,document.getElementById("supernet"));
ReactDOM.render(<AggregationTab />,document.getElementById("aggregation"));
ReactDOM.render(<SchemaTab />,document.getElementById("schema"));
ReactDOM.render(<MiscTab />,document.getElementById("misc"));