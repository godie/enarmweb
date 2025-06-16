import React from "react";
import { Link } from "react-router-dom";
import Auth from "../modules/Auth";
import { Navbar } from "react-materialize";

class Navi extends React.Component {
  render() {
    let logout = "";
    var fbUserName = { name: "" };
    if (Auth.isUserAuthenticated()) {
      logout = <Link to="/logout">Salir</Link>;
    }
    if (Auth.isFacebookUser()) {
      fbUserName = JSON.parse(Auth.getFacebookUser());
      if (fbUserName.email === undefined) {
        Auth.removeFacebookUser();
        window.location.reload();
      }
    }

    return (
      <Navbar
        className="green darken-1"
        brand={<span>Enarm Simulator</span>}
        centerLogo
        alignLinks="left"
      >
        <Link to="/">Home</Link>
        <Link to="/caso/1">Caso Clinico</Link>
        <Link to="/dashboard">Admin</Link>
        {logout}
      </Navbar>
    );
  }
}

export default Navi;

// WEBPACK FOOTER //
// ./src/components/Navi.js
