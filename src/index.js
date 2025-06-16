import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AnalyticsTracker from "./components/AnalyticsTracker";
import AppRoutes from "./routes/AppRoutes";
import { HashRouter as Router } from "react-router-dom";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Router>
    <AnalyticsTracker />
    <AppRoutes />
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
