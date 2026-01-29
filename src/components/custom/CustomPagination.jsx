
import PropTypes from 'prop-types';

const CustomPagination = ({
  items, // Total number of pages
  activePage = 1,
  onSelect,
  maxButtons = 8, // Max page numbers to display (excluding prev/next)
  className = '',
  leftBtn = <i className="material-icons">chevron_left</i>,
  rightBtn = <i className="material-icons">chevron_right</i>,
  ...props
}) => {
  const handlePageSelect = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= items && pageNumber !== activePage) {
      if (onSelect) {
        onSelect(pageNumber);
      }
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (items <= 0) return pageNumbers;

    // Simplified logic for displaying page numbers
    // Always show first and last page, and pages around activePage.
    // A more complex logic would involve actual ellipses '...'

    let startPage = Math.max(1, activePage - Math.floor(maxButtons / 2));
    let endPage = Math.min(items, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons && startPage > 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // Add first page if not in range
    if (startPage > 1) {
      const isActive = 1 === activePage;
      pageNumbers.push(
        <li key={1} className={isActive ? 'active' : 'waves-effect'}>
          <a
            href="#!"
            onClick={(e) => { e.preventDefault(); handlePageSelect(1); }}
            aria-current={isActive ? 'page' : undefined}
          >
            1
          </a>
        </li>
      );
      if (startPage > 2) { // Add ellipsis if there's a gap
        pageNumbers.push(<li key="ellipsis-start" className="disabled"><span aria-hidden="true">...</span></li>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === activePage;
      pageNumbers.push(
        <li key={i} className={isActive ? 'active' : 'waves-effect'}>
          <a
            href="#!"
            onClick={(e) => { e.preventDefault(); handlePageSelect(i); }}
            aria-current={isActive ? 'page' : undefined}
          >
            {i}
          </a>
        </li>
      );
    }

    // Add last page if not in range
    if (endPage < items) {
      if (endPage < items - 1) { // Add ellipsis if there's a gap
        pageNumbers.push(<li key="ellipsis-end" className="disabled"><span aria-hidden="true">...</span></li>);
      }
      const isActive = items === activePage;
      pageNumbers.push(
        <li key={items} className={isActive ? 'active' : 'waves-effect'}>
          <a
            href="#!"
            onClick={(e) => { e.preventDefault(); handlePageSelect(items); }}
            aria-current={isActive ? 'page' : undefined}
          >
            {items}
          </a>
        </li>
      );
    }
    return pageNumbers;
  };

  const paginationClassName = `pagination ${className}`.trim();

  return (
    <ul className={paginationClassName} role="navigation" aria-label="Paginación" {...props}>
      <li className={activePage === 1 ? 'disabled' : 'waves-effect'} aria-disabled={activePage === 1}>
        <a
          href="#!"
          onClick={(e) => { e.preventDefault(); handlePageSelect(activePage - 1); }}
          aria-label="Anterior"
        >
          {leftBtn}
        </a>
      </li>
      {renderPageNumbers()}
      <li className={activePage === items ? 'disabled' : 'waves-effect'} aria-disabled={activePage === items}>
        <a
          href="#!"
          onClick={(e) => { e.preventDefault(); handlePageSelect(activePage + 1); }}
          aria-label="Siguiente"
        >
          {rightBtn}
        </a>
      </li>
    </ul>
  );
};

CustomPagination.propTypes = {
  items: PropTypes.number.isRequired, // Total number of pages
  activePage: PropTypes.number,
  onSelect: PropTypes.func,
  maxButtons: PropTypes.number,
  className: PropTypes.string,
  leftBtn: PropTypes.node,
  rightBtn: PropTypes.node,
};

export default CustomPagination;
