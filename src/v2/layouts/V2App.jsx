import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/v2-theme.css";

const V2Navi = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  const navItems = [
    { label: "Home", icon: "home", path: "/v2/dashboard" },
    { label: "Práctica", icon: "medical_services", path: "/v2/caso" },
    { label: "Perfil", icon: "person", path: "/v2/perfil" },
    { label: "Salir", icon: "logout", path: "/logout" }
  ];

  return (
    <nav className="v2-nav-rail">
      <div className="v2-nav-brand" style={{ marginBottom: '40px' }}>
         <i className="material-icons v2-text-primary" style={{ fontSize: '32px' }}>local_hospital</i>
      </div>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`v2-nav-item ${isActive(item.path) ? 'active' : ''}`}
        >
          <i className="material-icons">{item.icon}</i>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

const V2App = ({ children }) => {
  useEffect(() => {
    // Sync theme with existing logic if needed
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('theme', savedTheme);
  }, []);

  return (
    <div className="v2-app-container">
      <V2Navi />
      <main className="v2-content-wrapper">
        {children}
      </main>
    </div>
  );
};

export default V2App;
