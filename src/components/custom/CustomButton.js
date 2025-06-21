import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const CustomButton = ({
  children,
  className = '',
  disabled = false,
  node = 'button',
  href,
  tooltip,
  waves = 'light', // Default Materialize wave effect
  type = 'button', // Default type for button elements
  icon, // Optional: if you want to pass icon name directly
  iconPosition = 'left', // 'left' or 'right'
  ...props // To pass any other attributes like 'large', 'small', 'floating' as classes or directly
}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    let tooltipInstance = null;
    if (tooltip && elementRef.current && window.M && window.M.Tooltip) {
      tooltipInstance = window.M.Tooltip.init(elementRef.current, { html: tooltip });
    }
    return () => {
      if (tooltipInstance) {
        tooltipInstance.destroy();
      }
    };
  }, [tooltip]);

  let combinedClassName = `btn waves-effect waves-${waves} ${className}`;
  if (disabled) {
    combinedClassName = `btn disabled ${className}`;
  }
  if (props.floating) combinedClassName += ' btn-floating';
  if (props.large) combinedClassName += ' btn-large';
  if (props.small) combinedClassName += ' btn-small';
  if (props.flat) combinedClassName = `btn-flat waves-effect waves-${waves} ${className}`; // Overrides btn

  if (tooltip) {
    combinedClassName += ' tooltipped';
  }

  const iconElement = icon ? (
    <i className={`material-icons ${iconPosition}`}>{icon}</i>
  ) : null;

  const content = (
    <>
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </>
  );

  if (node === 'a') {
    return (
      <a
        ref={elementRef}
        href={href || '#!'} // Default href for link-buttons
        className={combinedClassName}
        disabled={disabled} // Note: disabled attribute doesn't strictly apply to <a>, relies on class
        onClick={props.onClick} // Ensure onClick is passed
        {...props} // Spread other props
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={elementRef}
      type={type}
      className={combinedClassName}
      disabled={disabled}
      onClick={props.onClick} // Ensure onClick is passed
      {...props} // Spread other props
    >
      {content}
    </button>
  );
};

CustomButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  node: PropTypes.oneOf(['button', 'a']),
  href: PropTypes.string,
  tooltip: PropTypes.string,
  waves: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.string,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  onClick: PropTypes.func,
  floating: PropTypes.bool,
  large: PropTypes.bool,
  small: PropTypes.bool,
  flat: PropTypes.bool,
};

export default CustomButton;
