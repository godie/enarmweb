import { useState, useEffect, useMemo } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  DEFAULT_NAV_ORDER, 
  getNavFrequency, 
  incrementNavFrequency, 
  getSortedNavItems, 
  FIXED_ITEMS 
} from '../utils/navFrequency';
import V2NavDrawer from './V2NavDrawer';
import '../styles/v2-theme.css';

const V2Navi = () => {
  const location = useLocation();
  const [theme, setTheme] = useState(document.documentElement.getAttribute('theme') || 'light');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get navigation state based on frequency
  const navState = useMemo(() => {
    const frequency = getNavFrequency();
    return getSortedNavItems(DEFAULT_NAV_ORDER, frequency, 4);
  }, [location.pathname]); // Recalculate on navigation
  
  const { visible, drawer } = navState;

  // Track navigation frequency
  useEffect(() => {
    if (location.pathname) {
      incrementNavFrequency(location.pathname);
    }
  }, [location.pathname]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  // Check if we have items in the drawer (for "Ver más" button)
  const hasDrawerItems = drawer.length > 0;

  return (
    <>
      <nav className="v2-nav-rail" aria-label="Navegación principal">
        <Link
          to="/dashboard"
          className="v2-nav-logo"
          aria-label="Ir al inicio"
          title="Ir al inicio"
        >
          <i className="material-icons" style={{ fontSize: '32px' }} aria-hidden="true">stethoscope</i>
        </Link>

        <div className="v2-nav-items-container">
          {visible.map((item) => {
            const isFixed = FIXED_ITEMS.includes(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`v2-nav-item ${isFixed ? 'v2-nav-item-fixed' : ''}`}
                activeClassName="active"
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                <div className="v2-nav-item-content">
                  <i className="material-icons" aria-hidden="true">{item.icon}</i>
                  <span className="v2-label-large v2-nav-label">{item.label}</span>
                </div>
              </NavLink>
            );
          })}
          
          {/* Ver más button - only show if there are drawer items */}
          {hasDrawerItems && (
            <button
              className="v2-nav-more-btn"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Ver todas las opciones"
              title="Ver todas las opciones"
            >
              <i className="material-icons" aria-hidden="true">more_horiz</i>
              <span className="v2-label-large v2-nav-label">Ver más</span>
            </button>
          )}
        </div>

        <div className="v2-nav-footer">
          <button
            className="v2-nav-item v2-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
            title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
          >
            <i className="material-icons" aria-hidden="true">
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </i>
          </button>
        </div>
      </nav>
      
      {/* Drawer/Sheet - single component, variant based on screen size */}
      <V2NavDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        items={isMobile ? DEFAULT_NAV_ORDER : drawer}
        variant={isMobile ? 'mobile' : 'desktop'}
      />
    </>
  );
};

export default V2Navi;
