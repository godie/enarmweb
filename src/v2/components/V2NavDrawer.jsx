import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { incrementNavFrequency } from '../utils/navFrequency';
import '../styles/v2-theme.css';

/**
 * V2NavDrawer - Side drawer component for navigation items
 * @param {boolean} isOpen - Whether drawer is open
 * @param {function} onClose - Callback to close drawer
 * @param {Array} items - Items to display in drawer
 * @param {string} variant - 'desktop' (side drawer) or 'mobile' (bottom sheet)
 */
const V2NavDrawer = ({ isOpen, onClose, items = [], variant = 'desktop' }) => {
  const location = useLocation();
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap and body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus close button
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle item click
  const handleItemClick = (path) => {
    incrementNavFrequency(path);
    onClose();
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isMobile = variant === 'mobile';

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`v2-nav-drawer-backdrop ${isOpen ? 'visible' : ''}`}
        onClick={handleBackdropClick}
        aria-hidden='true'
      />
      
      {/* Drawer/Sheet */}
      <div
        ref={drawerRef}
        role='dialog'
        aria-modal='true'
        aria-label='Todas las opciones de navegación'
        className={`v2-nav-drawer ${isOpen ? 'open' : ''} ${isMobile ? 'v2-nav-bottom-sheet' : ''} ${isOpen && isMobile ? 'open' : ''}`}
      >
        {isMobile && <div className='v2-nav-bottom-sheet-handle' />}
        
        {/* Header */}
        <div className='v2-nav-drawer-header'>
          <h2 className='v2-title-large'>Todas las opciones</h2>
          <button
            ref={closeButtonRef}
            className='v2-btn-icon'
            onClick={onClose}
            aria-label='Cerrar menú'
          >
            <i className='material-icons'>close</i>
          </button>
        </div>
        
        {/* Items Grid */}
        <div className='v2-nav-drawer-grid'>
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`v2-nav-drawer-item ${isActive ? 'active' : ''}`}
                onClick={() => handleItemClick(item.path)}
                aria-current={isActive ? 'page' : undefined}
              >
                <i className='material-icons' aria-hidden='true'>{item.icon}</i>
                <span className='v2-label-large'>{item.label}</span>
              </Link>
            );
          })}
        </div>
        
        {/* Footer info */}
        <div className='v2-nav-drawer-footer'>
          <span className='v2-label-medium v2-opacity-60'>
            Los items se ordenan según tu uso
          </span>
        </div>
      </div>
    </>
  );
};

export default V2NavDrawer;