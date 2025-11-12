import React from 'react';
import PropTypes from 'prop-types';

const CustomTable = ({
  children,
  className = '',
  hoverable = false,
  striped = false,
  centered = false,
  responsive = false,
  ...props
}) => {
  let tableClassName = 'table'; // Base class for Materialize, though often omitted if other styles applied

  if (hoverable) {
    tableClassName += ' highlight'; // Materialize uses 'highlight' for hoverable
  }
  if (striped) {
    tableClassName += ' striped';
  }
  if (centered) {
    tableClassName += ' centered';
  }
  if (responsive) {
    tableClassName += ' responsive-table';
  }
  if (className) {
    tableClassName += ` ${className}`;
  }

  // If no specific materialize style is chosen, and no other class, 'table' might be redundant
  // but Materialize docs sometimes show <table class="striped"> directly.
  // Let's ensure 'table' is only there if other classes are, or if it's explicitly added.
  // However, many examples just use <table class="striped highlight">.
  // For safety, we can remove the base 'table' class if other Materialize classes are present,
  // as they imply it's a Materialize table. Or, keep it simple.
  // Let's assume Materialize components don't strictly need the 'table' class if others are present.
  // So, if tableClassName is just 'table' after this, make it empty.
  if (tableClassName === 'table' && !className) { // Only if no other classes were added
      // tableClassName = ''; // Optional: decide if base 'table' class is needed if no other style
  }


  // If responsive, Materialize expects the table to be wrapped in a div.
  // However, react-materialize applies 'responsive-table' class directly to the <table>.
  // We will follow react-materialize's approach for now.
  // The alternative for truly responsive tables that scroll horizontally is:
  // <div style={{overflowX: 'auto'}}><table ... /></div>

  return (
    <table className={tableClassName.trim()} {...props}>
      {children}
    </table>
  );
};

CustomTable.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  hoverable: PropTypes.bool,
  striped: PropTypes.bool,
  centered: PropTypes.bool,
  responsive: PropTypes.bool,
};

export default CustomTable;
