
import { NavLink } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2Navi = () => {


  const navItems = [
    { label: "Home", icon: "home", path: "/v2/dashboard" },
    { label: "Práctica", icon: "medical_services", path: "/v2/practica" },
    { label: "Simulacro", icon: "quiz", path: "/v2/simulacro/setup" },
    { label: "Contribuir", icon: "add_circle", path: "/v2/contribuir" },
    { label: "Mis Casos", icon: "history", path: "/v2/mis-contribuciones" },
    { label: "Perfil", icon: "person", path: "/v2/perfil" },
  ];

  return (
    <nav className="v2-nav-rail">
      <div style={{
        marginBottom: '40px',
        width: '48px', height: '48px', borderRadius: '12px',
        backgroundColor: 'var(--md-sys-color-primary-container)',
        color: 'var(--md-sys-color-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <i className="material-icons" style={{ fontSize: '32px' }}>stethoscope</i>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="v2-nav-item"
            activeClassName="active"
          >
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
            }}>
                <i className="material-icons">{item.icon}</i>
                <span className="v2-label-large" style={{ fontSize: '11px', fontWeight: 'bold' }}>{item.label}</span>
            </div>
          </NavLink>
        ))}
      </div>

      <div style={{ marginTop: 'auto', marginBottom: '24px' }}>
        <button
          className="v2-nav-item"
          style={{ border: 'none', background: 'none', cursor: 'pointer' }}
          onClick={() => {
            const currentTheme = document.documentElement.getAttribute('theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('theme', newTheme);
            localStorage.setItem('theme', newTheme);
          }}
        >
          <i className="material-icons">dark_mode</i>
        </button>
      </div>
    </nav>
  );
};

export default V2Navi;
