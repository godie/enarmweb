import React from "react";
import { Link } from "react-router-dom";
import Auth from "../modules/Auth";
import { Navbar } from "react-materialize";

const Navi = () => { // Removed props as it's not used
  let logoutLink = null; // Changed variable name for clarity, initialized to null
  var fbUserName = { name: "" }; // Kept var for direct translation, though let/const is preferred in new JS

  if (Auth.isUserAuthenticated()) {
    logoutLink = <Link to="/logout" role="link">Salir</Link>;
  }

  if (Auth.isFacebookUser()) {
    // This block seems to attempt to get user info, but fbUserName is not used in JSX.
    // The side effect of reloading page is preserved.
    fbUserName = JSON.parse(Auth.getFacebookUser());
    if (fbUserName && fbUserName.email === undefined) {
      Auth.removeFacebookUser();
      window.location.reload(); // This is generally an anti-pattern in React.
    }
  }

  return (
    <Navbar
      className="green darken-1"
      brand={<span>Enarm Simulator</span>}
      centerLogo
      alignLinks="left"
      // Standard Navbar options/props for react-materialize
      // Fixed children structure if needed, or pass as children if Navbar expects that.
      // The original structure implies these Link components are direct children.
    >
      <Link role="link" to="/">Home</Link>
      <Link role="link" to="/caso/1">Caso Clinico</Link>
      <Link role="link" to="/dashboard">Admin</Link>
      {logoutLink}
    </Navbar>
  );
};

export default Navi;

// WEBPACK FOOTER // Removed as it's not part of the source code
// ./src/components/Navi.js
