import React from "react";
import { Link } from "react-router-dom";
import Auth from "../modules/Auth";
// import { Navbar } from "react-materialize"; // Removed
import {CustomNavbar} from "./custom"; // Added

const Navi = () => {
  let logoutLink = null;
  var fbUserName = { name: "" }; // Kept var for direct translation

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
    logoutLink = <Link to="/logout" role="link">Salir</Link>;
  }

  // For CustomNavbar, links should be wrapped in <li>
  const navLinks = (
    <>
      <li><Link role="link" to="/">Home</Link></li>
      <li><Link role="link" to="/caso/1">Caso Clinico</Link></li>
      <li><Link role="link" to="/dashboard">Admin</Link></li>
      {logoutLink && <li>{logoutLink}</li>}
    </>
  );

  return (
    <CustomNavbar
      className="green darken-1"
      brand={<span>Enarm Simulator</span>}
      brandClassName='center'
      centerLogo // This prop is available in CustomNavbar
      alignLinks="left"
      sidenavTriggerId="mobile-nav-main" // Example ID, though SideNav isn't used in this specific file
      userName={fbUserName?.name}
    >
      {navLinks}
    </CustomNavbar>
  );
};

export default Navi;

// WEBPACK FOOTER // Removed as it's not part of the source code
// ./src/components/Navi.js
