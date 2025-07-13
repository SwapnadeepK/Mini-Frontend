import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ padding: '6px 12px', marginRight: '10px' }}
      >
        Previous
      </button>
      <span style={{ alignSelf: 'center' }}>Page {currentPage} of {totalPages}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ padding: '6px 12px', marginLeft: '10px' }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
