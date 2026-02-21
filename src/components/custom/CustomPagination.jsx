
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

  const paginationClassName = `pagination ${className}`.trim();

  return (
    <ul className={paginationClassName} role="navigation" aria-label="Paginación" {...props}>
      <li className={activePage === 1 ? 'disabled' : 'waves-effect'} aria-disabled={activePage === 1}>
        <button
          type="button"
          onClick={() => handlePageSelect(activePage - 1)}
          aria-label="Anterior"
          className="btn-flat"
          style={{ padding: '0 10px' }}
          disabled={activePage === 1}
        >
          {leftBtn}
        </button>
      </li>
      <PageNumbers
        items={items}
        activePage={activePage}
        maxButtons={maxButtons}
        onSelect={handlePageSelect}
      />
      <li className={activePage === items ? 'disabled' : 'waves-effect'} aria-disabled={activePage === items}>
        <button
          type="button"
          onClick={() => handlePageSelect(activePage + 1)}
          aria-label="Siguiente"
          className="btn-flat"
          style={{ padding: '0 10px' }}
          disabled={activePage === items}
        >
          {rightBtn}
        </button>
      </li>
    </ul>
  );
};

const PageNumbers = ({ items, activePage, maxButtons, onSelect }) => {
  const pageNumbers = [];
  if (items <= 0) return null;

  let startPage = Math.max(1, activePage - Math.floor(maxButtons / 2));
  let endPage = Math.min(items, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons && startPage > 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  // Add first page if not in range
  if (startPage > 1) {
    const isActive = 1 === activePage;
    pageNumbers.push(
      <li key="page-1" className={isActive ? 'active' : 'waves-effect'}>
        <button
          type="button"
          className="btn-flat"
          onClick={() => onSelect(1)}
          aria-current={isActive ? 'page' : undefined}
        >
          1
        </button>
      </li>
    );
    if (startPage > 2) {
      pageNumbers.push(<li key="ellipsis-start" className="disabled"><span aria-hidden="true">...</span></li>);
    }
  }

  for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
    const isActive = pageNum === activePage;
    pageNumbers.push(
      <li key={`page-${pageNum}`} className={isActive ? 'active' : 'waves-effect'}>
        <button
          type="button"
          className="btn-flat"
          onClick={() => onSelect(pageNum)}
          aria-current={isActive ? 'page' : undefined}
        >
          {pageNum}
        </button>
      </li>
    );
  }

  // Add last page if not in range
  if (endPage < items) {
    if (endPage < items - 1) {
      pageNumbers.push(<li key="ellipsis-end" className="disabled"><span aria-hidden="true">...</span></li>);
    }
    const isActive = items === activePage;
    pageNumbers.push(
      <li key={`page-${items}`} className={isActive ? 'active' : 'waves-effect'}>
        <button
          type="button"
          className="btn-flat"
          onClick={() => onSelect(items)}
          aria-current={isActive ? 'page' : undefined}
        >
          {items}
        </button>
      </li>
    );
  }
  return pageNumbers;
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
