import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const CustomSideNavItem = ({
  children,
  href,
  to, // React Router path: use for in-app navigation (no full reload, no hash)
  className = '', // Added to the <a> tag if it's a link, or <li> if not a link/divider/subheader
  divider = false,
  subheader = false,
  icon,
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

  const linkClassName = `waves-effect ${className}`.trim();
  const iconElement = icon ? (
    <i className="material-icons">{icon}</i>
  ) : null;

  const linkContent = (
    <>
      {iconElement}
      {children}
    </>
  );

  return (
    <li {...props}>
      {to != null ? (
        <Link to={to} className={linkClassName} onClick={onClick}>
          {linkContent}
        </Link>
      ) : (
        <a href={href || '#!'} className={linkClassName} onClick={onClick}>
          {linkContent}
        </a>
      )}
    </li>
  );
};

CustomSideNavItem.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  to: PropTypes.string,
  className: PropTypes.string,
  divider: PropTypes.bool,
  subheader: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.string
};

export default CustomSideNavItem;
