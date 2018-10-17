import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import GameInterface from "./GameInterface";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<GameInterface />, document.getElementById("root"));

serviceWorker.unregister();
