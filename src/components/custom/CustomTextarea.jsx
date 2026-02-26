import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Forms, CharacterCounter } from '@materializecss/materialize';

const TEXTAREA_STYLE = {
  minHeight: '120px',
  padding: '12px',
  border: '1px solid var(--enarm-border, #e0e0e0)',
  borderRadius: '8px',
  resize: 'vertical',
  lineHeight: '1.6',
  boxSizing: 'border-box',
  width: '100%',
  transition: 'border-color 0.2s ease',
};

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
  offset,
  helperText,
  rows,
  maxLength,
  'data-length': dataLength,
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
    const hasLengthLimit = maxLength || dataLength;
    // Initialize Character Counter if maxLength is present
    if (textareaRef.current && CharacterCounter && hasLengthLimit) {
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
  }, [maxLength, dataLength]);

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
  if (offset) {
    offset.split(' ').forEach(off => {
      if (off) wrapperClasses += ` offset-${off}`;
    });
  }

  const computedStyle = rows
    ? { ...TEXTAREA_STYLE, minHeight: `${rows * 1.6 + 1.5}em` }
    : TEXTAREA_STYLE;

  return (
    <div className={wrapperClasses.trim()}>
      {icon && <i className={`material-icons prefix ${iconClassName}`.trim()} aria-hidden="true">{icon}</i>}
      {label && (
        <label htmlFor={id} className="active">
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
      <textarea
        ref={textareaRef}
        id={id}
        className={`materialize-textarea  ${textareaClassName}`.trim()}
        style={computedStyle}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        data-length={dataLength ?? maxLength}
        {...props}
        aria-required={props.required ? 'true' : undefined}
      />
      {helperText && <span className="helper-text">{helperText}</span>}
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
  offset: PropTypes.string,
  helperText: PropTypes.string,
};

export default CustomTextarea;
