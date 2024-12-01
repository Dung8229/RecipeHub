const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map((n) => n + 1);

  return (
    <div className="pagination">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage}
          style={{ margin: '0 5px', padding: '5px 10px' }}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
