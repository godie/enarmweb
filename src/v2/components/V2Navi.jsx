import { Link, useLocation } from "react-router-dom";

const V2Navi = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Inicio", icon: "home", path: "/v2/dashboard" },
    { label: "Práctica", icon: "medical_services", path: "/v2/practica" },
    { label: "Contribuir", icon: "add_circle", path: "/v2/contribuir" },
    { label: "Mis Casos", icon: "history", path: "/v2/mis-contribuciones" },
    { label: "Perfil", icon: "person", path: "/v2/perfil" },
    { label: "Salir", icon: "logout", path: "/logout" }
  ];

  return (
    <nav className="v2-nav-rail" aria-label="Navegación principal">
      <div className="v2-nav-brand" style={{ marginBottom: '40px' }}>
        <i className="material-icons v2-text-primary" style={{ fontSize: '32px' }} aria-hidden="true">
          local_hospital
        </i>
      </div>
      {navItems.map((item) => {
        const isLinkActive = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`v2-nav-item ${isLinkActive ? 'active' : ''}`}
            aria-current={isLinkActive ? 'page' : undefined}
          >
            <i className="material-icons" aria-hidden="true">
              {item.icon}
            </i>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default V2Navi;
