import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from "react-router-dom";

const CustomNavbar = ({
  brand,
  brandClassName = '', // Additional classes for the brand
  alignLinks = 'right', // 'left' or 'right'
  children, // Should be <li> elements or components that render to <li>
  className = '',
  fixed = false,
  userName = '',
  sidenavTriggerId = 'mobile-nav', // Default ID for the sidenav this navbar might trigger
  centerLogo = false, // For centering logo, especially on mobile
  ...props
}) => {
  const navWrapperClasses = `nav-wrapper ${className}`.trim();
  const brandLogoClasses = `brand-logo ${brandClassName} ${centerLogo && alignLinks !== 'left' ? 'center' : ''}`.trim();
  // Note: Materialize's default behavior is to center logo on mobile if it's between sidenav trigger and links.
  // The 'center' class on brand-logo is more for desktop when links are also centered or not left-aligned.
  // If alignLinks="left", react-materialize might not apply 'center' to brand even if centerLogo is true.
  // We'll keep it simple: if centerLogo is true AND links are not explicitly left, try to center.

  const navClasses = fixed ? 'navbar-fixed' : '';

  const navbarClasses = `nav navbar ${className}`.trim();

  const mainNav = (
    <nav {...props} className={navbarClasses}> {/* Main nav classes like color go here */}
      <div className={navWrapperClasses}>
        <Brand brand={brand} brandLogoClasses={brandLogoClasses} />
        <button
          type="button"
          data-target={sidenavTriggerId}
          className="sidenav-trigger btn-flat"
          aria-label="Abrir menú de navegación"
          style={{ padding: 0, margin: 0, height: 'auto', lineHeight: 'inherit' }}
        >
          <i className="material-icons">menu</i>
        </button>
        <ul id="nav-mobile" className={`${alignLinks === 'left' ? 'left' : 'right'} hide-on-med-and-down`}>
          {children}
        </ul>
        <ul id="nav-mobile-r" className='right hide-on-med-and-down'>
          {userName !== '' && (
            <ProfileLink userName={userName} />
          )}
        </ul>
      </div>
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
  const isActive = location.pathname === '/profile';

  return (
    <li className={isActive ? 'active' : ''}>
      <Link to="/profile" aria-current={isActive ? 'page' : undefined}>
        {userName}
      </Link>
    </li>
  );
};

export default CustomNavbar;
