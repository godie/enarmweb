import React from 'react';
import PropTypes from 'prop-types';

const CustomCollection = ({
  children,
  className = '',
  header, // string or React node
  headerTag: HeaderTag = 'h4', // Allow customizing header tag, e.g., 'h1', 'h2', etc.
  ...props
}) => {
  const collectionClassName = `collection ${className}`.trim();

  let headerContent = null;
  if (header) {
    if (React.isValidElement(header)) {
      headerContent = <li className="collection-header">{header}</li>;
    } else {
      headerContent = (
        <li className="collection-header">
          <HeaderTag>{header}</HeaderTag>
        </li>
      );
    }
  }

  return (
    <ul className={collectionClassName} {...props}>
      {headerContent}
      {children}
    </ul>
  );
};

CustomCollection.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  headerTag: PropTypes.string, // e.g., 'h1', 'h2', 'h4'
};

export default CustomCollection;
