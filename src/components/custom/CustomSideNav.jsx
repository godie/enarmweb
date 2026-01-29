import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Sidenav } from "@materializecss/materialize";

const CustomSideNav = ({
  id,
  children, // Expect <li> elements, typically CustomSideNavItem
  className = '',
  options = {}, // To pass to M.Sidenav.init
  ...props
}) => {
  const sidenavRef = useRef(null);

  useEffect(() => {
    let instance = null;
    if (sidenavRef.current && Sidenav && Sidenav.init) {
      instance = Sidenav.init(sidenavRef.current, options);
    }
    return () => {
      if (instance && instance.destroy) {
        instance.destroy();
      }
    };
  }, [id, options]); // Re-initialize if ID or options change

  const sideNavClasses = `sidenav ${className}`.trim();

  return (
    <ul ref={sidenavRef} id={id} className={sideNavClasses} {...props}>
      {children}
    </ul>
  );
};

CustomSideNav.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  options: PropTypes.object,
};

export default CustomSideNav;
