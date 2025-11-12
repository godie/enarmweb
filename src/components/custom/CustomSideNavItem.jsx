import React from 'react';
import PropTypes from 'prop-types';

const CustomSideNavItem = ({
  children,
  href,
  className = '', // Added to the <a> tag if it's a link, or <li> if not a link/divider/subheader
  divider = false,
  subheader = false,
  onClick, // For items that are not links but perform actions
  // waves prop can be added if desired for link items
  ...props
}) => {
  if (divider) {
    return <li className={`divider ${className}`.trim()} {...props}></li>;
  }

  if (subheader) {
    return <li className={`subheader ${className}`.trim()} {...props}>{children}</li>;
  }

  // Default to a link item
  // If href is not provided, it can be a non-link item with an onClick
  const linkClassName = `waves-effect ${className}`.trim(); // Add waves-effect by default for clickable items

  return (
    <li {...props}>
      <a href={href || '#!'} className={linkClassName} onClick={onClick}>
        {children}
      </a>
    </li>
  );
};

CustomSideNavItem.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  className: PropTypes.string,
  divider: PropTypes.bool,
  subheader: PropTypes.bool,
  onClick: PropTypes.func,
};

export default CustomSideNavItem;
