import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {GoogleTagManager, GTMRouteTracker} from './components/google/GoogleTagManager';
import AppRoutes from "./routes/AppRoutes";
import { HashRouter as Router } from "react-router-dom";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Router>
    <GoogleTagManager gtmId="G-XH57C3M6CB" />
    <GTMRouteTracker />
    <AppRoutes />
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
