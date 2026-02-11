import { useEffect, useRef, useState } from 'react';
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
  maxLength,
  'data-length': dataLength,
  passwordToggle = false,
  ...props
}) => {
  const inputRef = useRef(null);
  const counterInstance = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordWithToggle = type === 'password' && passwordToggle;
  const inputType = isPasswordWithToggle ? (showPassword ? 'text' : 'password') : type;

  useEffect(() => {
    // Initialize Character Counter if maxLength is present
    const hasLengthLimit = maxLength || dataLength;
    if (inputRef.current && CharacterCounter && hasLengthLimit) {
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
  }, [maxLength, dataLength]);

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
        type={inputType}
        className={finalInputClassName.trim()}
        disabled={disabled}
        autoComplete={autocomplete}
        placeholder={placeholder}
        style={isPasswordWithToggle ? { paddingRight: '2.5rem' } : undefined}
        // Conditionally apply value/onChange for controlled, or pass all props for uncontrolled
        {...(isControlled ? { value, onChange } : {})}
        {...props}
      />
      {isPasswordWithToggle && (
        <button
          type="button"
          className="input-password-toggle grey-text text-darken-2"
          onClick={() => setShowPassword((v) => !v)}
          tabIndex={-1}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <i className="material-icons">{showPassword ? 'visibility_off' : 'visibility'}</i>
        </button>
      )}
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
  passwordToggle: PropTypes.bool,
};

export default CustomTextInput;