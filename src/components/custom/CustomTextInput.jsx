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

  // Determinar tipo de input
  const isPasswordWithToggle = type === 'password';
  const inputType = isPasswordWithToggle ? (showPassword ? 'text' : 'password') : type;

  // Determinar si es controlado o no
  const isControlled = value !== undefined && onChange !== undefined;

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

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Construir clases
  const wrapperClasses = `input-field${className ? ` ${className}` : ''}`;
  const finalInputClassName = `${inputClassName}${validate ? ' validate' : ''}`.trim();

  return (
    <div className={wrapperClasses}>
      {icon && <i className={`material-icons prefix ${iconClassName}`.trim()}>{icon}</i>}
      
      <input
        ref={inputRef}
        id={id}
        type={inputType}
        className={finalInputClassName}
        disabled={disabled}
        autoComplete={autocomplete}
        placeholder={placeholder}
        maxLength={maxLength}
        data-length={dataLength}
        style={isPasswordWithToggle ? { paddingRight: '2.5rem' } : undefined}
        {...(isControlled ? { value, onChange } : {})}
        {...props}
      />

      {isPasswordWithToggle && (
        <button
          type="button"
          className="btn-flat input-password-toggle"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            padding: 0,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            zIndex: 2,
            minWidth: 'auto',
            height: 'auto'
          }}
        >
          <i className="material-icons grey-text text-darken-2">
            {showPassword ? 'visibility_off' : 'visibility'}
          </i>
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
  maxLength: PropTypes.number,
  'data-length': PropTypes.number,
  placeholder: PropTypes.string,
  passwordToggle: PropTypes.bool,
};

export default CustomTextInput;