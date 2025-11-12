import React from 'react';
import PropTypes from 'prop-types';

const CustomCol = ({
  children,
  className = '',
  s, // Small screens (e.g., 1 to 12)
  m, // Medium screens
  l, // Large screens
  xl, // Extra-large screens
  offset, // e.g., "s2 m3 l4 xl1" or "m2"
  push, // e.g., "s2 m3"
  pull, // e.g., "s2 m3"
  ...props
}) => {
  let colClassName = 'col';

  if (s) colClassName += ` s${s}`;
  if (m) colClassName += ` m${m}`;
  if (l) colClassName += ` l${l}`;
  if (xl) colClassName += ` xl${xl}`;

  if (offset) {
    // Offset can be a string like "s2 m3" or just "m2"
    // Or it can be an object like {s:2, m:3} from react-materialize.
    // For simplicity, this component expects string format like "s2 m3"
    // or specific props like offsetS, offsetM if more granular control is needed.
    // The `react-materialize` <Col offset="s2"> translates to class `offset-s2`.
    // If `offset` prop is a string like "s2", it becomes "offset-s2".
    // If it's "s2 m3", it becomes "offset-s2 offset-m3".
    const offsets = offset.split(' ');
    offsets.forEach(off => {
      if (off) colClassName += ` offset-${off}`;
    });
  }

  if (push) {
    const pushes = push.split(' ');
    pushes.forEach(p => {
      if (p) colClassName += ` push-${p}`;
    });
  }

  if (pull) {
    const pulls = pull.split(' ');
    pulls.forEach(p => {
      if (p) colClassName += ` pull-${p}`;
    });
  }

  if (className) {
    colClassName += ` ${className}`;
  }

  return (
    <div className={colClassName.trim()} {...props}>
      {children}
    </div>
  );
};

CustomCol.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  s: PropTypes.number,
  m: PropTypes.number,
  l: PropTypes.number,
  xl: PropTypes.number,
  offset: PropTypes.string, // e.g., "s2", "s2 m3"
  push: PropTypes.string,
  pull: PropTypes.string,
};

export default CustomCol;
