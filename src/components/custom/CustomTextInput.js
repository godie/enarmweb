import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const CustomTextInput = ({
  id,
  label,
  value = '', // Controlled component should have a default value
  onChange,
  disabled = false,
  className = '', // Class for the wrapping div.input-field
  inputClassName = '', // Class for the input element itself
  icon,
  iconClassName = '',
  type = 'text',
  validate = false, // For materialize validation class
  ...props
}) => {
  const inputRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    // Update text fields for label positioning
    // This is important for initial render and when value changes programmatically
    if (window.M && window.M.updateTextFields) {
      window.M.updateTextFields();
    }
     // Ensure label is active if there's a value or placeholder, even on first render
    if ((value || (inputRef.current && inputRef.current.placeholder)) && labelRef.current) {
        labelRef.current.classList.add('active');
    }
  }, [value]); // Re-run when value changes to keep labels correct

  let wrapperClasses = 'input-field';
  if (className) {
    wrapperClasses += ` ${className}`;
  }

  let finalInputClassName = inputClassName;
  if (validate) {
    finalInputClassName += ' validate';
  }

  return (
    <div className={wrapperClasses.trim()}>
      {icon && <i className={`material-icons prefix ${iconClassName}`.trim()}>{icon}</i>}
      <input
        ref={inputRef}
        id={id}
        type={type}
        className={finalInputClassName.trim()}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props} // Other props like 'name', 'placeholder'
      />
      {label && <label ref={labelRef} htmlFor={id}>{label}</label>}
    </div>
  );
};

CustomTextInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string, // For the wrapper div.input-field
  inputClassName: PropTypes.string, // For the <input> element
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  type: PropTypes.string,
  validate: PropTypes.bool,
};

export default CustomTextInput;
