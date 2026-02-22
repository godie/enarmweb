import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from "react-router-dom";

const CustomNavbar = ({
  brand,
  brandClassName = '', // Additional classes for the brand
  alignLinks = 'right', // 'left', 'right', or 'center'
  children, // Should be <li> elements or components that render to <li>
  leftLinks, // Elements to show on the left (e.g., ThemeToggle)
  rightLinks, // Elements to show on the right
  className = '',
  fixed = false,
  userName = '',
  sidenavTriggerId = 'mobile-nav', // Default ID for the sidenav this navbar might trigger
  centerLogo = false, // For centering logo, especially on mobile
  ...props
}) => {
  const navWrapperClasses = `nav-wrapper ${className}`.trim();
  const brandLogoClasses = `brand-logo ${brandClassName} ${centerLogo && alignLinks !== 'left' ? 'center' : ''}`.trim();

  const navClasses = fixed ? 'navbar-fixed' : '';
  const navbarClasses = `nav navbar ${className}`.trim();

  const mainNav = (
    <nav {...props} className={navbarClasses}>
      <div className={navWrapperClasses} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <div className="left-section" style={{ display: 'flex', alignItems: 'center' }}>
          <Brand brand={brand} brandLogoClasses={`${brandLogoClasses} static-brand`} />
          <ul className="hide-on-med-and-down" style={{ display: 'flex', margin: 0, paddingLeft: '20px' }}>
            {leftLinks}
          </ul>
        </div>

        <div className="center-section hide-on-med-and-down" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          {alignLinks === 'center' && (
            <ul style={{ display: 'flex', margin: 0 }}>
              {children}
            </ul>
          )}
        </div>

        <div className="right-section" style={{ display: 'flex', alignItems: 'center' }}>
          <ul id="nav-mobile" className="hide-on-med-and-down" style={{ display: 'flex', margin: 0 }}>
            {alignLinks !== 'center' && children}
            {rightLinks}
            {userName !== '' && (
              <ProfileLink userName={userName} />
            )}
          </ul>
          <button
            type="button"
            data-target={sidenavTriggerId}
            className="sidenav-trigger btn-flat"
            aria-label="Abrir menú de navegación"
            style={{ padding: 0, margin: 0, height: 'auto', lineHeight: 'inherit', display: 'block' }}
          >
            <i className="material-icons">menu</i>
          </button>
        </div>
      </div>
      <style>{`
        .nav-wrapper .static-brand {
          position: static !important;
          transform: none !important;
        }
        .center-section ul li a {
          padding: 0 15px;
        }
        @media only screen and (max-width: 992px) {
          .sidenav-trigger { margin-left: auto !important; }
        }
      `}</style>
    </nav>
  );

  if (fixed) {
    return <div className={navClasses}>{mainNav}</div>;
  }

  return mainNav;
};

CustomNavbar.propTypes = {
  brand: PropTypes.node,
  brandClassName: PropTypes.string,
  alignLinks: PropTypes.oneOf(['left', 'right']),
  children: PropTypes.node, // Expect <li> elements
  className: PropTypes.string, // For the <nav> element itself (e.g., color)
  fixed: PropTypes.bool,
  sidenavTriggerId: PropTypes.string,
  centerLogo: PropTypes.bool,
};

const Brand = ({ brand, brandLogoClasses }) => {
  if (React.isValidElement(brand)) {
    // If brand is a React element, clone it to add classes
    return React.cloneElement(brand, {
      className: `${brandLogoClasses} ${brand.props.className || ''}`.trim()
    });
  }
  // Default to rendering as a span if it's just text and doesn't need to be a link
  return <span className={brandLogoClasses}>{brand}</span>;
};

const ProfileLink = ({ userName }) => {
  const location = useLocation();
  const isActive = location.pathname === '/perfil';

  return (
    <li className={isActive ? 'active' : ''}>
      <Link to="/perfil" aria-current={isActive ? 'page' : undefined}>
        {userName}
      </Link>
    </li>
  );
};

export default CustomNavbar;
