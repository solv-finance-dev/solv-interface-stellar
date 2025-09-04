'use client';
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
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@solvprotocol/ui-v2';
import cn from 'classnames';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import NoData from '../NoData';
import TablePagination from './TablePagination';

export type AlignType = 'left' | 'center' | 'right';

interface DataTableComplexProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  gridTemplateColumns?: string;
  showSkeleton?: boolean;
  skeletonCount?: number;
  manualPagination?: boolean;
  pageCount?: number;
  pagination?: { pageIndex: number; pageSize: number };
  onPaginationChange?: (updater: any) => void;
}

export function DataTableComplex<TData, TValue>({
  columns,
  data,
  onRowClick,
  gridTemplateColumns = 'repeat(auto-fit, minmax(120px, 1fr))',
  showSkeleton = false,
  skeletonCount = 6,
  manualPagination = false,
  pageCount,
  pagination,
  onPaginationChange,
}: DataTableComplexProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    manualPagination,
    pageCount,
    onPaginationChange,
    state: {
      sorting,
      pagination,
    },
  });

  const handleRowClick = (row: Row<TData>) => {
    if (onRowClick) {
      onRowClick(row.original);
    }
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
                  const align =
                    (header.column.columnDef.meta as any)?.align || 'left';

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
              table.getRowModel().rows.map((row, index) => (
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
                    const align =
                      (cell.column.columnDef.meta as any)?.align || 'left';

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
      <TablePagination table={table} data={data} />
    </>
  );
}
