import React from 'react';
import PropTypes from 'prop-types';

const CustomRow = ({ children, className = '', ...props }) => {
  const combinedClassName = `row ${className}`.trim();

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

CustomRow.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default CustomRow;
