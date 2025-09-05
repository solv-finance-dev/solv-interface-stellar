import { Button } from '@solvprotocol/ui-v2';

import { ChevronLeft } from 'lucide-react';
import React from 'react';

export default function TablePagination({
  table,
  data,
}: {
  table: any;
  data: any[];
}) {
  // Generate page number button array
  const getPageNumbers = () => {
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();
    const pageNumbers = [];

    // Always display the first page
    pageNumbers.push(1);

    // Page number before and after the current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Make sure enough page numbers are displayed
    if (currentPage <= 3) {
      endPage = Math.min(totalPages - 1, 4);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
    }

    // Page number before adding ellipsis
    if (startPage > 2) {
      pageNumbers.push('...');
    }

    // Add intermediate page number
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis page number
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }

    // Always show the last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };
  return (
    <div className='flex items-center justify-between py-4'>
      <div className='text-muted-foreground hidden text-sm'>
        Showing
        {table.getState().pagination.pageIndex *
          table.getState().pagination.pageSize +
          1}{' '}
        to{' '}
        {Math.min(
          (table.getState().pagination.pageIndex + 1) *
            table.getState().pagination.pageSize,
          data.length
        )}{' '}
        of {data.length} entries
      </div>

      <div className='flex items-center space-x-2'>
        {/* Previous */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className='hidden h-8 w-8 rounded-full p-0'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>

        {/* number button */}
        {getPageNumbers().map((pageNumber, index) => (
          <Button
            key={index}
            variant={
              pageNumber === table.getState().pagination.pageIndex + 1
                ? 'outline'
                : 'default'
            }
            size='sm'
            onClick={() => {
              if (typeof pageNumber === 'number') {
                table.setPageIndex(pageNumber - 1);
              }
            }}
            disabled={pageNumber === '...'}
            className='text-textColor-tertiary h-8 w-8 rounded-full bg-transparent p-0 hover:bg-gray-100'
          >
            {pageNumber}
          </Button>
        ))}

        {/* Next */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className='text-textColor-secondary h-8 w-8 rounded-full border-0 p-0 text-[.875rem]'
        >
          {/* <ChevronRight className='h-4 w-4' /> */}
          Next
        </Button>
      </div>
    </div>
  );
}
