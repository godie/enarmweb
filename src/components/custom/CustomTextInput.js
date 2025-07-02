// CustomTextInput.js
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const CustomTextInput = ({
  id,
  label,
  value, // Remove default value here
  onChange, // Make onChange optional
  disabled = false,
  className = '',
  inputClassName = '',
  icon,
  iconClassName = '',
  type = 'text',
  validate = false,
  ...props // This will capture 'name', 'defaultValue' etc.
}) => {
  const inputRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (window.M && window.M.updateTextFields) {
      window.M.updateTextFields();
    }
    // Activate label if there's a value, defaultValue, or placeholder
    const hasContent = value !== undefined ? value : (inputRef.current && (inputRef.current.value || inputRef.current.placeholder));
    if (hasContent && labelRef.current) {
        labelRef.current.classList.add('active');
    }
  }, [value, props.defaultValue]); // React to changes in value or defaultValue

  let wrapperClasses = 'input-field';
  if (className) {
    wrapperClasses += ` ${className}`;
  }

  let finalInputClassName = inputClassName;
  if (validate) {
    finalInputClassName += ' validate';
  }

  // Determine if it's controlled or uncontrolled
  const isControlled = value !== undefined && onChange !== undefined; // Check if both are provided

  return (
    <div className={wrapperClasses.trim()}>
      {icon && <i className={`material-icons prefix ${iconClassName}`.trim()}>{icon}</i>}
      <input
        ref={inputRef}
        id={id}
        type={type}
        className={finalInputClassName.trim()}
        disabled={disabled}
        // Conditionally apply value/onChange for controlled, or pass all props for uncontrolled
        {...(isControlled ? { value, onChange } : {})} // Apply value/onChange only if controlled
        {...props} // Other props like 'name', 'placeholder', 'defaultValue'
      />
      {label && <label ref={labelRef} htmlFor={id}>{label}</label>}
    </div>
  );
};

CustomTextInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string, // No longer required, can be undefined
  onChange: PropTypes.func, // No longer required, can be undefined
  disabled: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  type: PropTypes.string,
  validate: PropTypes.bool,
};

export default CustomTextInput;