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
  s,
  m,
  l,
  xl,
  icon,
  iconClassName = '',
  type = 'text',
  validate = false,
  autocomplete = 'off',
  placeholder = ' ',
  maxLength,
  'data-length': dataLength,
  passwordToggle = false,
  passwordToggleClassName = 'grey-text text-darken-2',
  helperText,
  ...props
}) => {
  const inputRef = useRef(null);
  const counterInstance = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  // Determinar tipo de input
  const isPasswordWithToggle = type === 'password' && passwordToggle;
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

  // Construir clases del wrapper
  let wrapperClasses = `input-field col${className ? ` ${className}` : ''}`;
  if (s) wrapperClasses += ` s${s}`;
  if (m) wrapperClasses += ` m${m}`;
  if (l) wrapperClasses += ` l${l}`;
  if (xl) wrapperClasses += ` xl${xl}`;

  const finalInputClassName = `${inputClassName}${validate ? ' validate' : ''}`.trim();

  // label active if value exists or placeholder is present (other than space)
  const isLabelActive = (value !== undefined && value !== '') || (props.defaultValue !== undefined && props.defaultValue !== '') || (placeholder && placeholder !== ' ');

  return (
    <div className={wrapperClasses.trim()}>
      {icon && <i className={`material-icons prefix ${iconClassName}`.trim()} aria-hidden="true">{icon}</i>}
      
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
        aria-required={props.required ? 'true' : undefined}
      />

      {isPasswordWithToggle && (
        <button
          type="button"
          className="btn-flat input-password-toggle"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            padding: '4px',
            border: 'none',
            cursor: 'pointer',
            zIndex: 2,
            minWidth: 'auto',
            height: 'auto',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <i className={`material-icons ${passwordToggleClassName}`} aria-hidden="true">
            {showPassword ? 'visibility_off' : 'visibility'}
          </i>
        </button>
      )}

      {label && (
        <label htmlFor={id} className={isLabelActive ? 'active' : ''}>
          {label}
          {props.required && (
            <span
              className="red-text"
              style={{ marginLeft: '4px', fontWeight: 'bold' }}
              aria-hidden="true"
              title="Obligatorio"
            >
              *
            </span>
          )}
        </label>
      )}
      {helperText && (
        <span className="helper-text" data-error="error" data-success="success">
          {helperText}
        </span>
      )}
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
  s: PropTypes.number,
  m: PropTypes.number,
  l: PropTypes.number,
  xl: PropTypes.number,
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  type: PropTypes.string,
  validate: PropTypes.bool,
  autocomplete: PropTypes.string,
  maxLength: PropTypes.number,
  'data-length': PropTypes.number,
  placeholder: PropTypes.string,
  passwordToggle: PropTypes.bool,
  passwordToggleClassName: PropTypes.string,
  helperText: PropTypes.string,
};

export default CustomTextInput;
