
import { Link, useLocation } from "react-router-dom";
import Auth from "../modules/Auth";
// import { Navbar } from "react-materialize"; // Removed
import { CustomNavbar, CustomSideNav } from "./custom";
import ThemeToggle from "./ThemeToggle";

const Navi = ({ sidenavTriggerId = "mobile-nav-main" }) => {
  const location = useLocation();
  let logoutLink = null;
  var fbUserName = { name: "" };

  const isActive = (path, exact = true) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

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
      <li className={isActive("/") ? "active" : ""}>
        <Link to="/" aria-current={isActive("/") ? "page" : undefined}>Inicio</Link>
      </li>
      <li className={isActive("/caso/", false) ? "active" : ""}>
        <Link to="/caso/1" aria-current={isActive("/caso/", false) ? "page" : undefined}>Caso Clínico</Link>
      </li>
      {Auth.isPlayerAuthenticated() && (
        <>
          <li className={isActive("/contribuir") ? "active" : ""}>
            <Link to="/contribuir" aria-current={isActive("/contribuir") ? "page" : undefined}>Contribuir</Link>
          </li>
          <li className={isActive("/mis-contribuciones") ? "active" : ""}>
            <Link to="/mis-contribuciones" aria-current={isActive("/mis-contribuciones") ? "page" : undefined}>Mis Contribuciones</Link>
          </li>
        </>
      )}
      {Auth.isUserAuthenticated() && Auth.isAdmin() && (
        <li className={isActive("/dashboard", false) ? "active" : ""}>
          <Link to="/dashboard" aria-current={isActive("/dashboard", false) ? "page" : undefined}>Admin</Link>
        </li>
      )}
      {Auth.isUserAuthenticated() && !Auth.isAdmin() && (
        <li className={isActive("/perfil") ? "active" : ""}>
          <Link to="/perfil" aria-current={isActive("/perfil") ? "page" : undefined}>Perfil</Link>
        </li>
      )}
      <ThemeToggle />
      {logoutLink && <li>{logoutLink}</li>}
    </>
  );

  return (
    <>
      <CustomNavbar
        className="green darken-1 white-text"
        brand={<Link to="/" className="white-text">Enarm</Link>}
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
