import React from 'react';
import PropTypes from 'prop-types';

const CustomPreloader = ({
  size = '', // 'big', 'small', or default (medium)
  active = true,
  color, // e.g., 'red', 'blue', 'green', 'yellow'. If undefined, uses multi-color.
  flashing = false, // Only applicable if color is NOT set (for multi-color preloader)
  className = '',
  ...props
}) => {
  let wrapperClassName = 'preloader-wrapper';
  if (size) {
    wrapperClassName += ` ${size}`;
  }
  if (active) {
    wrapperClassName += ' active';
  }
  if (className) {
    wrapperClassName += ` ${className}`;
  }

  let spinnerLayerClassName = 'spinner-layer';
  if (color) {
    spinnerLayerClassName += ` spinner-${color}-only`;
  } else if (flashing) {
    // Materialize's "flashing" prop on react-materialize implies multi-color and flashing behavior.
    // The actual CSS for flashing with specific colors is more complex if not using default.
    // For simplicity, we'll assume 'flashing' is for the default multi-color spinner.
    // If a color is set, 'flashing' prop is ignored by this custom component.
    // Note: MaterializeCSS itself doesn't have a simple 'flashing' class for the preloader wrapper.
    // react-materialize might have implemented this differently or it's a legacy prop.
    // For a standard preloader, 'flashing' isn't a direct class.
    // We'll stick to standard Materialize classes.
    // If specific flashing behavior is needed, it often comes from having multiple spinner-layers
    // like spinner-blue, spinner-red, spinner-yellow, spinner-green for the default one.
    // If no color, it defaults to this multi-color behavior.
    spinnerLayerClassName += ' spinner-blue'; // Default to one color if no specific color is given for single-color mode
                                          // OR rely on multiple layers for multi-color effect.
                                          // The standard multi-color has 4 spinner layers.
  }


  if (color) { // Single color preloader
    return (
      <div className={wrapperClassName} {...props}>
        <div className={spinnerLayerClassName}>
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div>
          <div className="gap-patch">
            <div className="circle"></div>
          </div>
          <div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
      </div>
    );
  }

  // Default multi-color preloader (Materialize standard structure)
  return (
    <div className={wrapperClassName} {...props}>
      <div className="spinner-layer spinner-blue">
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div>
        <div className="gap-patch">
          <div className="circle"></div>
        </div>
        <div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>

      <div className="spinner-layer spinner-red">
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div>
        <div className="gap-patch">
          <div className="circle"></div>
        </div>
        <div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>

      <div className="spinner-layer spinner-yellow">
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div>
        <div className="gap-patch">
          <div className="circle"></div>
        </div>
        <div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>

      <div className="spinner-layer spinner-green">
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div>
        <div className="gap-patch">
          <div className="circle"></div>
        </div>
        <div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>
    </div>
  );
};

CustomPreloader.propTypes = {
  size: PropTypes.oneOf(['big', 'small', 'medium', '']),
  active: PropTypes.bool,
  color: PropTypes.string, // e.g. 'red', 'blue'. If provided, makes it single color.
  flashing: PropTypes.bool, // For multi-color preloader, react-materialize had this. Standard CSS doesn't use 'flashing' class.
  className: PropTypes.string,
};

export default CustomPreloader;
