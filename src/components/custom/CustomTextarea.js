import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const CustomTextarea = ({
  id,
  label,
  value = '', // Controlled component should have a default value
  onChange,
  disabled = false,
  className = '', // Class for the wrapping div.input-field
  textareaClassName = '', // Class for the textarea element itself
  icon,
  iconClassName = '',
  s, m, l, xl, // Grid size props, to be applied if needed, or handled by CustomCol
  ...props
}) => {
  const textareaRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    // Initialize textarea auto-resize
    if (textareaRef.current && window.M && window.M.textareaAutoResize && !disabled) {
      window.M.textareaAutoResize(textareaRef.current);
    }
  }, [disabled]); // Re-run if disabled state changes

  useEffect(() => {
    // Update text fields for label positioning
    // This is important for initial render and when value changes programmatically
    if (window.M && window.M.updateTextFields) {
      window.M.updateTextFields();
    }
    // Ensure label is active if there's a value, even on first render
    if (value && labelRef.current) {
        labelRef.current.classList.add('active');
    }

  }, [value]); // Re-run when value changes to keep labels correct

  let wrapperClasses = 'input-field';
  if (className) {
    wrapperClasses += ` ${className}`;
  }
  // Apply grid classes if provided (though typically CustomCol would handle this)
  if (s) wrapperClasses += ` col s${s}`;
  if (m) wrapperClasses += ` col m${m}`;
  if (l) wrapperClasses += ` col l${l}`;
  if (xl) wrapperClasses += ` col xl${xl}`;


  return (
    <div className={wrapperClasses.trim()}>
      {icon && <i className={`material-icons prefix ${iconClassName}`.trim()}>{icon}</i>}
      <textarea
        ref={textareaRef}
        id={id}
        className={`materialize-textarea ${textareaClassName}`.trim()}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props} // Other props like 'name', 'placeholder'
      />
      {label && <label ref={labelRef} htmlFor={id}>{label}</label>}
    </div>
  );
};

CustomTextarea.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string, // For the wrapper div.input-field
  textareaClassName: PropTypes.string, // For the <textarea> element
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  s: PropTypes.number,
  m: PropTypes.number,
  l: PropTypes.number,
  xl: PropTypes.number,
};

export default CustomTextarea;
