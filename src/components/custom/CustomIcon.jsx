
import PropTypes from 'prop-types';

const CustomIcon = ({
  children, // Icon name e.g., 'add', 'menu'
  className = '',
  size, // 'tiny', 'small', 'medium', 'large'
  left = false, // For alignment within buttons/text
  right = false, // For alignment
  ...props
}) => {
  let iconClassName = 'material-icons';

  if (size) {
    iconClassName += ` ${size}`;
  }
  if (left) {
    iconClassName += ' left';
  }
  if (right) {
    iconClassName += ' right';
  }
  if (className) {
    iconClassName += ` ${className}`;
  }

  return (
    <i className={iconClassName} {...props}>
      {children}
    </i>
  );
};

CustomIcon.propTypes = {
  children: PropTypes.string.isRequired, // Icon name
  className: PropTypes.string,
  size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large']),
  left: PropTypes.bool,
  right: PropTypes.bool,
};

export default CustomIcon;
