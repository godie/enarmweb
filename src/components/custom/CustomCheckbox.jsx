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
  required = false,
  wrapperClassName = '',
  ...props
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

  // Construct wrapper classes for grid support
  let wrapperClasses = wrapperClassName.trim();
  const hasGrid = !!(s || m || l || xl || offset);
  if (hasGrid) {
    if (!wrapperClasses.includes('col')) {
      wrapperClasses += ' col';
    }
    if (s) wrapperClasses += ` s${s}`;
    if (m) wrapperClasses += ` m${m}`;
    if (l) wrapperClasses += ` l${l}`;
    if (xl) wrapperClasses += ` xl${xl}`;
    if (offset) {
      offset.split(' ').forEach(off => {
        if (off) wrapperClasses += ` offset-${off}`;
      });
    }
  }

  const checkboxContent = (
    <label htmlFor={id} className={labelClassName}>
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
        {...props}
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
  );

  if (hasGrid || wrapperClassName) {
    return <div className={wrapperClasses.trim()}>{checkboxContent}</div>;
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
  wrapperClassName: PropTypes.string,
};

export default CustomCheckbox;
