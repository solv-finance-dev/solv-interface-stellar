'use client';
import { useState } from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getPaginationRowModel,
  Row,
} from '@tanstack/react-table';

import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import cn from 'classnames';
import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@solvprotocol/ui-v2';
import NoData from '../NoData';

interface DataTableComplexProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  gridTemplateColumns?: string;
  showSkeleton?: boolean;
  skeletonCount?: number;
}

export function DataTableComplex<TData, TValue>({
  columns,
  data,
  onRowClick,
  gridTemplateColumns = 'repeat(auto-fit, minmax(120px, 1fr))',
  showSkeleton = false,
  skeletonCount = 6,
}: DataTableComplexProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  const handleRowClick = (row: Row<TData>) => {
    if (onRowClick) {
      onRowClick(row.original);
    }
  };

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

  const renderSkeletonRows = () => {
    return Array.from({ length: skeletonCount }).map((_, index) => (
      <TableRow
        key={`skeleton-${index}`}
        className='col-span-full grid grid-cols-subgrid hover:bg-transparent'
        style={{ gridTemplateColumns }}
      >
        {columns.map((_, colIndex) => (
          <TableCell key={`skeleton-cell-${colIndex}`}>
            <Skeleton className='h-6 w-full' />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow
                key={headerGroup.id}
                className='col-span-full grid grid-cols-subgrid hover:bg-transparent'
                style={{ gridTemplateColumns }}
              >
                {headerGroup.headers.map(header => {
                  const canSort = header.column.getCanSort();
                  const align = header.column.columnDef.meta?.align || 'left';

                  return (
                    <TableHead
                      key={header.id}
                      className={` ${align === 'center' ? 'text-center' : ''} ${align === 'right' ? 'text-right' : ''} font-medium text-[#929292]`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: canSort
                              ? 'cursor-pointer select-none flex items-center gap-1'
                              : 'flex items-center',
                            onClick: canSort
                              ? header.column.getToggleSortingHandler()
                              : undefined,
                          }}
                        >
                          {align === 'right' && <div className='flex-1' />}

                          <div
                            className={` ${align === 'center' ? 'mx-auto' : ''} ${align === 'right' ? 'ml-auto' : ''} flex items-center gap-1`}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {canSort && (
                              <>
                                {{
                                  asc: <ChevronUp className='h-4 w-4' />,
                                  desc: <ChevronDown className='h-4 w-4' />,
                                }[header.column.getIsSorted() as string] ?? (
                                  <ChevronsUpDown className='h-4 w-4 opacity-50' />
                                )}
                              </>
                            )}
                          </div>

                          {align === 'left' && <div className='flex-1' />}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {showSkeleton ? (
              renderSkeletonRows()
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => handleRowClick(row)}
                  className={cn(
                    onRowClick && 'cursor-pointer transition-colors',
                    'hover:bg-transparent',
                    'col-span-full grid grid-cols-subgrid'
                  )}
                  style={{ gridTemplateColumns }}
                >
                  {row.getVisibleCells().map(cell => {
                    const align = cell.column.columnDef.meta?.align || 'left';

                    return (
                      <TableCell
                        key={cell.id}
                        className={` ${align === 'center' ? 'text-center' : ''} ${align === 'right' ? 'text-right' : ''} `}
                        onClick={e => {
                          e.stopPropagation();
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow className='bg-transparent hover:bg-transparent'>
                <TableCell
                  colSpan={columns.length}
                  className='h-[12.5rem] md:h-[18.75rem]'
                >
                  <NoData />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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
        <div></div>

        <div className='flex items-center space-x-2'>
          {/* Previous */}
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className='h-8 w-8 rounded-full p-0'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>

          {/* number button */}
          {getPageNumbers().map((pageNumber, index) => (
            <Button
              key={index}
              variant={
                pageNumber === table.getState().pagination.pageIndex + 1
                  ? 'default'
                  : 'outline'
              }
              size='sm'
              onClick={() => {
                if (typeof pageNumber === 'number') {
                  table.setPageIndex(pageNumber - 1);
                }
              }}
              disabled={pageNumber === '...'}
              className='h-8 w-8 rounded-full p-0'
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
            className='h-8 w-8 rounded-full p-0'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </>
  );
}
