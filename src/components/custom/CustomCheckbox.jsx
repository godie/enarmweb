import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const CustomCheckbox = ({
  id,
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '', // Applied to the input element
  labelClassName = '', // Applied to the label element
  indeterminate = false,
  value, // HTML value attribute, not for checked state
  s,
  m,
  l,
  xl,
  offset,
  required,
  helperText,
  wrapperClassName = '',
  ...props // Contains style and other custom props
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  let inputClasses = className;
  if (indeterminate) {
    inputClasses += ' indeterminate-checkbox';
  }

  // Construct grid and wrapper classes
  const hasGrid = s || m || l || xl || offset || wrapperClassName;
  let finalWrapperClasses = wrapperClassName;
  if (s) finalWrapperClasses += ` col s${s}`;
  if (m) finalWrapperClasses += ` col m${m}`;
  if (l) finalWrapperClasses += ` col l${l}`;
  if (xl) finalWrapperClasses += ` col xl${xl}`;
  if (offset) {
    offset.split(' ').forEach(off => {
      if (off) finalWrapperClasses += ` offset-${off}`;
    });
  }

  const helperTextId = helperText ? `${id}-helper` : undefined;

  const checkboxContent = (
    <>
      <label
        htmlFor={id}
        className={labelClassName.trim()}
        {...(!hasGrid ? props : {})} // Apply style/custom props to label if NOT wrapped in div
      >
        <input
          ref={inputRef}
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={inputClasses.trim()}
          value={value}
          aria-required={required ? 'true' : undefined}
          aria-describedby={helperTextId}
        />
        <span>
          {label}
          {required && (
            <span
              className="red-text"
              style={{ marginLeft: '4px', fontWeight: 'bold' }}
              aria-hidden="true"
              title="Obligatorio"
            >
              *
            </span>
          )}
        </span>
      </label>
      {helperText && <span id={helperTextId} className="helper-text">{helperText}</span>}
    </>
  );

  if (hasGrid) {
    return (
      <div
        className={finalWrapperClasses.trim()}
        {...props} // Apply style/custom props to wrapper div if present
      >
        {checkboxContent}
      </div>
    );
  }

  return checkboxContent;
};

CustomCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string, // For the input element
  labelClassName: PropTypes.string, // For the label element
  indeterminate: PropTypes.bool,
  value: PropTypes.string, // HTML value attribute for the checkbox
  s: PropTypes.number,
  m: PropTypes.number,
  l: PropTypes.number,
  xl: PropTypes.number,
  offset: PropTypes.string,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  wrapperClassName: PropTypes.string,
};

export default CustomCheckbox;
