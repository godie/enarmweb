
import { Link } from "react-router-dom";
import Auth from "../modules/Auth";
// import { Navbar } from "react-materialize"; // Removed
import { CustomNavbar, CustomSideNav } from "./custom";
import ThemeToggle from "./ThemeToggle";

const Navi = ({ sidenavTriggerId = "mobile-nav-main" }) => {
  let logoutLink = null;
  var fbUserName = { name: "" };

  if (Auth.isUserAuthenticated() || Auth.isPlayerAuthenticated()) {
    logoutLink = (
      <Link to="/logout">
        Salir
      </Link>
    );
  }

  if (Auth.isPlayerAuthenticated()) {
    fbUserName = Auth.getPlayerInfo() || { name: "" };
  }

  const navLinks = (
    <>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/caso/1">Caso Clinico</Link></li>
      {Auth.isPlayerAuthenticated() && <li><Link to="/contribuir">Contribuir</Link></li>}
      {Auth.isUserAuthenticated() && Auth.isAdmin() && <li><Link to="/dashboard">Admin</Link></li>}
      {Auth.isUserAuthenticated() && !Auth.isAdmin() && <li><Link to="/perfil">Perfil</Link></li>}
      <ThemeToggle />
      {logoutLink && <li>{logoutLink}</li>}
    </>
  );

  return (
    <>
      <CustomNavbar
        className="green darken-1 white-text"
        brand={<Link to="/" className="white-text">Enarm</Link>}
        brandClassName='center'
        centerLogo
        alignLinks="right"
        sidenavTriggerId={sidenavTriggerId}
        userName={fbUserName?.name}
      >
        {navLinks}
      </CustomNavbar>

      {/* Mobile SideNav for main site (non-admin) */}
      {sidenavTriggerId === "mobile-nav-main" && (
        <CustomSideNav id="mobile-nav-main">
          {navLinks}
        </CustomSideNav>
      )}
    </>
  );
};

export default Navi;

// WEBPACK FOOTER // Removed as it's not part of the source code
// ./src/components/Navi.js
