import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 py-4">
      <button
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md text-sm disabled:opacity-50 bg-gray-100 hover:bg-gray-200"
      >
        Prev
      </button>
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => changePage(page)}
          className={`px-3 py-1 rounded-md text-sm ${
            page === currentPage ? 'bg-[#2B5C4B] text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md text-sm disabled:opacity-50 bg-gray-100 hover:bg-gray-200"
      >
        Next
      </button>
    </div>
  );
} 