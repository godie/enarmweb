import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const CustomCheckbox = ({
  id,
  label,
  checked = false, // Renamed from 'value' for clarity with checkbox 'checked' attribute
  onChange,
  disabled = false,
  className = '', // Applied to the input element
  labelClassName = '', // Applied to the label element
  indeterminate = false,
  value, // HTML value attribute, not for checked state
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

  // The main wrapper is the label for Materialize checkboxes
  return (
    <label htmlFor={id} className={labelClassName} {...props}>
      <input
        ref={inputRef}
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={inputClasses.trim()}
        value={value} // HTML value attribute
      />
      <span>{label}</span>
    </label>
  );
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
};

export default CustomCheckbox;
