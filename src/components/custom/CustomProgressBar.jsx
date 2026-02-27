import PropTypes from 'prop-types';

/**
 * CustomProgressBar component
 *
 * @param {number} progress - The progress value (0 to 100). If null/undefined, it renders an indeterminate progress bar.
 * @param {string} color - The Materialize color class for the progress bar (e.g., 'green', 'blue', 'red').
 * @param {string} wrapperColor - The Materialize color class for the progress bar background (e.g., 'grey lighten-3').
 * @param {string} className - Additional classes for the progress wrapper.
 * @param {object} style - Additional styles for the progress wrapper.
 * @param {string} height - Height of the progress bar (e.g., '8px').
 */
const EMPTY_STYLE = {};

const CustomProgressBar = ({
  progress,
  color = 'green',
  wrapperColor = 'grey lighten-3',
  className = '',
  style = EMPTY_STYLE,
  height
}) => {
  const isIndeterminate = progress === undefined || progress === null;
  const finalStyle = height ? { ...style, height } : style;

  return (
    <div className={`progress ${wrapperColor} ${className}`} style={finalStyle}>
      <div
        className={`${isIndeterminate ? 'indeterminate' : 'determinate'} ${color}`}
        style={!isIndeterminate ? { width: `${progress}%` } : {}}
      ></div>
    </div>
  );
};

CustomProgressBar.propTypes = {
  progress: PropTypes.number,
  color: PropTypes.string,
  wrapperColor: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  height: PropTypes.string,
};

export default CustomProgressBar;
