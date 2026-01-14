import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Forms, CharacterCounter } from '@materializecss/materialize';

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
  s, m, l, xl, // Grid size props
  ...props
}) => {
  const textareaRef = useRef(null);
  const counterInstance = useRef(null);

  useEffect(() => {
    // Initialize/Update textarea auto-resize on value or disabled change
    if (textareaRef.current && Forms.textareaAutoResize && !disabled) {
      Forms.textareaAutoResize(textareaRef.current);
    }
  }, [value, disabled]);

  useEffect(() => {
    // Initialize Character Counter if maxLength is present
    if (textareaRef.current && CharacterCounter && (props.maxLength || props['data-length'])) {
      if (counterInstance.current) {
        counterInstance.current.destroy();
      }
      counterInstance.current = CharacterCounter.init(textareaRef.current);
    }
    return () => {
      if (counterInstance.current) {
        counterInstance.current.destroy();
        counterInstance.current = null;
      }
    };
  }, [props.maxLength, props['data-length']]);

  useEffect(() => {
    if (Forms && Forms.updateTextFields) {
      Forms.updateTextFields();
    }
  }, [value]);

  let wrapperClasses = 'input-field';
  if (className) {
    wrapperClasses += ` ${className}`;
  }
  // Apply grid classes if provided
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
        placeholder=" "
        {...props} // Other props like 'maxLength', 'placeholder'
      />
      {label && <label htmlFor={id}>{label}</label>}
    </div>
  );
};

CustomTextarea.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  textareaClassName: PropTypes.string,
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  s: PropTypes.number,
  m: PropTypes.number,
  l: PropTypes.number,
  xl: PropTypes.number,
};

export default CustomTextarea;
