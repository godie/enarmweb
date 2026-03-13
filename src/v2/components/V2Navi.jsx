import { NavLink } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2Navi = () => {
  const navItems = [
    { label: "Inicio", icon: "home", path: "/v2/dashboard" },
    { label: "Práctica", icon: "medical_services", path: "/v2/practica" },
    { label: "Simulacro", icon: "quiz", path: "/v2/simulacro/setup" },
    { label: "Ranking", icon: "leaderboard", path: "/v2/leaderboard" },
    { label: "Imágenes", icon: "image", path: "/v2/imagenes" },
    { label: "Repaso", icon: "style", path: "/v2/flashcards/repaso" },
    { label: "Biblioteca", icon: "menu_book", path: "/v2/biblioteca" },
    { label: "Errores", icon: "error_outline", path: "/v2/errores" },
    { label: "Contribuir", icon: "add_circle", path: "/v2/contribuir" },
    { label: "Mis Casos", icon: "history", path: "/v2/mis-contribuciones" },
    { label: "Mensajes", icon: "forum", path: "/v2/mensajes" },
    { label: "Suscripción", icon: "card_membership", path: "/v2/suscripcion" },
    { label: "Cupones", icon: "confirmation_number", path: "/v2/cupones" },
    { label: "Admin", icon: "admin_panel_settings", path: "/v2/admin" },
    { label: "Perfil", icon: "person", path: "/v2/perfil" },
  ];

  return (
    <nav className="v2-nav-rail" aria-label="Navegación principal">
      <div style={{
        marginBottom: '20px',
        width: '48px', height: '48px', borderRadius: '12px',
        backgroundColor: 'var(--md-sys-color-primary-container)',
        color: 'var(--md-sys-color-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <i className="material-icons" style={{ fontSize: '32px' }} aria-hidden="true">stethoscope</i>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '4px', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="v2-nav-item"
            activeClassName="active"
            aria-current="page"
          >
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'
            }}>
                <i className="material-icons" aria-hidden="true">{item.icon}</i>
                <span className="v2-label-large" style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>{item.label}</span>
            </div>
          </NavLink>
        ))}
      </div>

      <div style={{ marginTop: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <button
          className="v2-nav-item"
          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '8px' }}
          onClick={() => {
            const currentTheme = document.documentElement.getAttribute('theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('theme', newTheme);
            localStorage.setItem('theme', newTheme);
          }}
          aria-label="Cambiar tema"
        >
          <i className="material-icons" aria-hidden="true">dark_mode</i>
        </button>
      </div>
    </nav>
  );
};

export default V2Navi;
