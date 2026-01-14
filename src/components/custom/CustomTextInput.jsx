import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Forms, CharacterCounter } from '@materializecss/materialize';

const CustomTextInput = ({
  id,
  label,
  value,
  onChange,
  disabled = false,
  className = '',
  inputClassName = '',
  icon,
  iconClassName = '',
  type = 'text',
  validate = false,
  autocomplete = 'off',
  placeholder = ' ',
  ...props
}) => {
  const inputRef = useRef(null);
  const counterInstance = useRef(null);

  useEffect(() => {
    // Initialize Character Counter if maxLength is present
    if (inputRef.current && CharacterCounter && (props.maxLength || props['data-length'])) {
      if (counterInstance.current) {
        counterInstance.current.destroy();
      }
      counterInstance.current = CharacterCounter.init(inputRef.current);
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
  }, [value, props.defaultValue]);

  let wrapperClasses = 'input-field';
  if (className) {
    wrapperClasses += ` ${className}`;
  }

  let finalInputClassName = inputClassName;
  if (validate) {
    finalInputClassName += ' validate';
  }

  // Determine if it's controlled or uncontrolled
  const isControlled = value !== undefined && onChange !== undefined;

  return (
    <div className={wrapperClasses.trim()}>
      {icon && <i className={`material-icons prefix ${iconClassName}`.trim()}>{icon}</i>}
      <input
        ref={inputRef}
        id={id}
        type={type}
        className={finalInputClassName.trim()}
        disabled={disabled}
        autoComplete={autocomplete}
        placeholder={placeholder}
        // Conditionally apply value/onChange for controlled, or pass all props for uncontrolled
        {...(isControlled ? { value, onChange } : {})}
        {...props}
      />
      {label && <label htmlFor={id}>{label}</label>}
    </div>
  );
};

CustomTextInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  type: PropTypes.string,
  validate: PropTypes.bool,
  autocomplete: PropTypes.string,
};

export default CustomTextInput;