import React from "react";
import { createRoot } from "react-dom/client";
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";
import "./index.css";
import {GoogleTagManager, GTMRouteTracker} from './components/google/GoogleTagManager';
import AppRoutes from "./routes/AppRoutes.jsx";
import { HashRouter as Router } from "react-router-dom";

import * as serviceWorker from "./serviceWorker";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Router>
      <GoogleTagManager gtmId="G-XH57C3M6CB" />
      <GTMRouteTracker />
      <AppRoutes />
    </Router>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
