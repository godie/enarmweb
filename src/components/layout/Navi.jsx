import { Link, useLocation } from "react-router-dom";
import Auth from "../../modules/Auth";
import { CustomNavbar, CustomSideNav } from "../custom";
import ThemeToggle from "./ThemeToggle";

const Navi = ({
  sidenavTriggerId = "mobile-nav-main",
  showSidenavTrigger = true
}) => {
  const location = useLocation();
  let logoutLink = null;
  let fbUserName = { name: "" };

  const isActive = (path, exact = true) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  if (Auth.isUserAuthenticated() || Auth.isPlayerAuthenticated()) {
    logoutLink = <Link to="/logout">Salir</Link>;
  }


  if (Auth.isPlayerAuthenticated()) {
    fbUserName = Auth.getPlayerInfo() || { name: "" };
  }
  const showStudentMenus = Auth.isPlayerAuthenticated() && !Auth.isAdmin();

  const navLinks = (
    <>
      <li className={isActive("/") ? "active" : ""}>
        <Link to="/" aria-current={isActive("/") ? "page" : undefined}>
          Inicio
        </Link>
      </li>
      <li className={isActive("/caso/", false) ? "active" : ""}>
        <Link to="/caso/1" aria-current={isActive("/caso/", false) ? "page" : undefined}>
          Caso Clínico
        </Link>
      </li>
      {showStudentMenus && (
        <li className={isActive("/contribuir") ? "active" : ""}>
          <Link to="/contribuir" aria-current={isActive("/contribuir") ? "page" : undefined}>
            Contribuir
          </Link>
        </li>
      )}
      {showStudentMenus && (
        <li className={isActive("/flashcards") ? "active" : ""}>
          <Link to="/flashcards" aria-current={isActive("/flashcards") ? "page" : undefined}>
            Flashcards
          </Link>
        </li>
      )}
      {showStudentMenus && (
        <li className={isActive("/flashcards/nueva") ? "active" : ""}>
          <Link to="/flashcards/nueva" aria-current={isActive("/flashcards/nueva") ? "page" : undefined}>
            Alta Flashcards
          </Link>
        </li>
      )}
      {Auth.isUserAuthenticated() && !Auth.isAdmin() && (
        <li className={isActive("/perfil") ? "active" : ""}>
          <Link to="/perfil" aria-current={isActive("/perfil") ? "page" : undefined}>
            Perfil
          </Link>
        </li>
      )}
      {Auth.isUserAuthenticated() && Auth.isAdmin() && (
        <li className={isActive("/dashboard", false) ? "active" : ""}>
          <Link to="/dashboard" aria-current={isActive("/dashboard", false) ? "page" : undefined}>
            Admin
          </Link>
        </li>
      )}
    </>
  );

  return (
    <>
      <CustomNavbar
        className="green darken-1 white-text"
        brand={<Link to="/" className="white-text">Enarm</Link>}
        alignLinks="center"
        leftLinks={<ThemeToggle />}
        rightLinks={logoutLink ? <li>{logoutLink}</li> : null}
        sidenavTriggerId={sidenavTriggerId}
        showSidenavTrigger={showSidenavTrigger}
        userName={fbUserName?.name}
      >
        {navLinks}
      </CustomNavbar>

      {sidenavTriggerId === "mobile-nav-main" && (
        <CustomSideNav id="mobile-nav-main">
          {navLinks}
          <div className="divider"></div>
          <ThemeToggle />
          {logoutLink && <li>{logoutLink}</li>}
        </CustomSideNav>
      )}
    </>
  );
};

export default Navi;
