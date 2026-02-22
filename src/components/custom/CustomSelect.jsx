import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormSelect } from "@materializecss/materialize";

const DEFAULT_OPTIONS = {};

const CustomSelect = ({
  id,
  label,
  value, // Can be string for single select, or array for multiple
  onChange, // Should be called with the new value (string or array)
  children, // <option> and <optgroup> elements
  disabled = false,
  multiple = false,
  className = '', // For the wrapping div.input-field
  selectClassName = '', // For the <select> element itself
  icon,
  iconClassName = '',
  options = DEFAULT_OPTIONS, // Materialize FormSelect options
  placeholder, // Placeholder text for the first disabled option
  ...props
}) => {
  const selectRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (selectRef.current) {
      // Destroy previous instance if it exists
      if (instanceRef.current && instanceRef.current.destroy) {
        instanceRef.current.destroy();
      }
      // Initialize new instance
      instanceRef.current = FormSelect.init(selectRef.current, {
        ...options,
        // dropdownOptions: options.dropdownOptions || {} // Default if not provided
      });
    }

    return () => {
      if (instanceRef.current && instanceRef.current.destroy) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
    // Re-initialize if disabled, multiple, or children change (options structure might change)
  }, [disabled, multiple, children, options]);


  // This effect tries to handle programmatic value changes after initialization
  useEffect(() => {
    if (selectRef.current && instanceRef.current) {
      // If the props.value changes, update the internal state and select's value
      // Then, re-initialize Materialize select to make it pick up the new value visually.
      // This is a common workaround for Materialize select not being fully reactive.
      selectRef.current.value = value; // Set the raw select value

      // Destroy previous instance before re-initializing
      if (instanceRef.current && instanceRef.current.destroy) {
        instanceRef.current.destroy();
      }
      instanceRef.current = FormSelect.init(selectRef.current, options);
    }
  }, [value, options]); // Dependency on `value` is crucial here


  const handleChange = (event) => {
    if (onChange) {
      onChange(event); // Pass the event to the parent for Consistency
    }
  };

  const wrapperClasses = `input-field ${className}`.trim();
  const finalSelectClassName = `${selectClassName}`.trim();

  // Add a placeholder option if a placeholder is provided and it's not a multiple select
  const placeholderOption = placeholder && !multiple ? (
    <option value="" disabled={value !== ""}>{placeholder}</option>
  ) : null;


  return (
    <div className={wrapperClasses}>
      {icon && <i className={`material-icons prefix ${iconClassName}`.trim()}>{icon}</i>}
      <select
        ref={selectRef}
        id={id}
        value={value} // Use value directly from props
        onChange={handleChange}
        disabled={disabled}
        multiple={multiple}
        className={finalSelectClassName}
        {...props} // Other props like 'name'
        aria-required={props.required ? 'true' : undefined}
      >
        {placeholderOption}
        {children}
      </select>
      {label && (
        <label htmlFor={id} className={value || placeholder ? 'active' : ''}>
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
    </div>
  );
};

CustomSelect.propTypes = {
  id: PropTypes.string, // Not strictly required if label is not used, but good for forms
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  onChange: PropTypes.func,
  children: PropTypes.node, // <option> elements
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  className: PropTypes.string, // For the wrapper div
  selectClassName: PropTypes.string, // For the <select> element
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  options: PropTypes.object, // Materialize FormSelect options
  placeholder: PropTypes.string,
};

export default CustomSelect;
