import '../../styles/components/Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the beginning
      if (currentPage <= 3) {
        endPage = Math.min(maxVisible - 1, totalPages - 1);
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - maxVisible + 2);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <nav className='pagination' aria-label='Pagination'>
      <button
        className='pagination-btn pagination-prev'
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label='Previous page'
      >
        &lt;
      </button>

      <ul className='pagination-list'>
        {getPageNumbers().map((page, index) => (
          <li key={index}>
            {typeof page === 'number' ? (
              <button
                className={`pagination-number ${
                  currentPage === page ? 'active' : ''
                }`}
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ) : (
              <span className='pagination-ellipsis' aria-hidden='true'>
                {page}
              </span>
            )}
          </li>
        ))}
      </ul>

      <button
        className='pagination-btn pagination-next'
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label='Next page'
      >
        &gt;
      </button>
    </nav>
  );
};

export default Pagination;
