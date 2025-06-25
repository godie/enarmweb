import React from 'react';
import PropTypes from 'prop-types';

const CustomCollectionItem = ({
  children,
  className = '',
  active = false,
  href,
  onClick, // For items that are not links but are clickable
  // For more complex items, you might pass specific props for title, secondaryContent, etc.
  // For now, children can be structured as needed.
  ...props
}) => {
  const itemClassName = `collection-item ${active ? 'active' : ''} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={itemClassName} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  // If onClick is provided but no href, it's a clickable li (though usually href='#!' is used for this)
  // Or it could be a non-clickable li if neither href nor onClick is present.
  const Tag = onClick ? 'a' : 'li'; // Render as 'a' if onClick is present for consistent styling/behavior
  const finalHref = onClick && !href ? '#!' : href;


  if (Tag === 'a') {
       return (
        <a href={finalHref} className={itemClassName} onClick={onClick} {...props}>
            {children}
        </a>
    );
  }

  // Default to <li> if not an explicit link via href and no onClick
  return (
    <li className={itemClassName} {...props}>
      {children}
    </li>
  );
};

CustomCollectionItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  active: PropTypes.bool,
  href: PropTypes.string,
  onClick: PropTypes.func,
};

export default CustomCollectionItem;
