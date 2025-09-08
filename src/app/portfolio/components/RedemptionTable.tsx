'use client';

import ClaimAction from './ClaimAction';
import { DataTableComplex } from '@/components/DataTableComplex';

import H5AssetsCard, {
  AssetsDataItem,
  AssetsSkeletonCard,
  NoDataDom,
} from '@/components/DataTableComplex/H5AssetsCard';
import TablePagination from '@/components/DataTableComplex/TablePagination';
import { TokenIcon } from '@/components/TokenIcon';
import { useDialog } from '@/hooks/useDialog';
import { getCurItem } from '@/lib/utils';
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import cn from 'classnames';

export enum RedemptionState {
  Pending = 'pending',
  Signed = 'signed',
  Claimed = 'claimed',
}

export interface Redemption {
  id: string;
  pool: string;
  network: string;
  withdrawAmount: number | string;
  valueUsd: number;
  availableTime?: string;
  state?: RedemptionState;
  // raw fields for claim
  withdrawRequestHash?: string;
  share?: string;
}

interface RedemptionTableProps {
  data: Redemption[];
  loading?: boolean;
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: (updater: any) => void;
  pageCount: number;
}

export function RedemptionTable({
  data,
  loading = false,
  pagination,
  onPaginationChange,
  pageCount,
}: RedemptionTableProps) {
  const { openDialog } = useDialog();

  const columns: ColumnDef<Redemption>[] = [
    {
      accessorKey: 'pool',
      header: 'Pool',
      enableSorting: false,
      meta: {
        align: 'left',
      },
      cell: ({ row }) => {
        return (
          <div className=''>
            <div className='w-full truncate font-MatterSQ-Medium text-[1rem] leading-[1.125rem] text-textColor md:max-w-[calc(90%-1rem)]'>
              {row.getValue('pool')}
            </div>

            <div className='mt-1 hidden capitalize font-MatterSQ-Regular text-[.875rem] leading-4 md:flex'>
              <span
                className={cn(
                  row.original.state == RedemptionState.Pending
                    ? 'text-yellow-500'
                    : 'text-green-500'
                )}
              >
                {row.original.state === RedemptionState.Signed
                  ? 'Ready to claim'
                  : row.original.state}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'state',
      header: 'Status',
      enableSorting: false,
      meta: {
        align: 'left',
      },
      cell: ({ row }) => {
        return (
          <div className='mt-1 capitalize font-MatterSQ-Regular text-[.875rem] leading-4'>
            <span
              className={cn(
                row.original.state == RedemptionState.Pending
                  ? 'text-yellow-500'
                  : 'text-green-500'
              )}
            >
              {row.original.state === RedemptionState.Signed
                ? 'Ready to claim'
                : row.original.state}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: 'network',
      header: 'Network',
      enableSorting: false,
      meta: {
        align: 'left',
      },
      cell: ({ row }) => {
        return (
          <div className='flex items-center justify-start gap-2'>
            <TokenIcon
              src='https://avatar.sft-api.com/avatar/28.png'
              className='mr-1 h-[1.125rem] w-[1.125rem]'
            />
            <div className='text-textColor'>{row.getValue('network')}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'withdrawAmount',
      header: 'Withdraw Amount',
      enableSorting: false,
      meta: {
        align: 'right',
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('withdrawAmount'));
        const formatted = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        }).format(amount);

        return (
          <div className='text-[.875rem] leading-4 text-textColor'>
            {formatted}
          </div>
        );
      },
    },
    {
      accessorKey: 'valueUsd',
      header: 'Value',
      enableSorting: true,
      meta: {
        align: 'right',
      },
      cell: ({ row }) => {
        const value = Number(row.getValue('valueUsd')) || 0;
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);

        return (
          <div className='flex flex-row items-end text-[.875rem] leading-4 md:flex-col'>
            <span className='text-textColor'>{formatted} SolvBTC</span>
            <span className='ml-1 mt-0 text-[10px] text-textColor-secondary md:ml-0 md:mt-1 md:text-[.875rem]'>
              {formatted}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      enableSorting: false,
      meta: {
        align: 'right',
      },
      cell: ({ row }) => {
        return (
          <ClaimAction
            availableTime={row.original.availableTime}
            redemptionState={row.original.state}
            redemptionId={row.original.id}
            withdrawRequestHash={row.original.withdrawRequestHash}
            share={row.original.share}
          />
        );
      },
    },
  ];

  const tableH5 = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount,
    onPaginationChange,
    state: {
      pagination,
    },
  });

  const filterColumns = [...columns].filter(
    item => 'accessorKey' in item && item.accessorKey !== 'state'
  );

  return (
    <>
      <div className='hidden md:block'>
        <DataTableComplex
          showSkeleton={loading}
          columns={filterColumns}
          data={data}
          gridTemplateColumns='2fr 1fr 1fr 1.5fr 1fr'
          manualPagination
          pageCount={pageCount}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
        />
      </div>

      <div className='block w-full md:hidden'>
        {/* loadFinished */}
        {loading ? (
          <AssetsSkeletonCard></AssetsSkeletonCard>
        ) : (
          <>
            {tableH5.getRowModel().rows?.length > 0 ? (
              <div>
                {tableH5.getRowModel().rows.map((row, index) => (
                  <div key={`H5AssetsCard-${row.id}-${index}`}>
                    <H5AssetsCard
                      cardTitle={<>{getCurItem(columns, 'pool', row)}</>}
                      operateBtn={<>{getCurItem(columns, 'action', row)}</>}
                    >
                      <AssetsDataItem
                        keyTitle='Network'
                        value={<>{getCurItem(columns, 'network', row)}</>}
                      ></AssetsDataItem>

                      <AssetsDataItem
                        keyTitle='Status'
                        value={<>{getCurItem(columns, 'state', row)}</>}
                      ></AssetsDataItem>

                      <AssetsDataItem
                        keyTitle='WithdrawAmount'
                        value={
                          <>{getCurItem(columns, 'withdrawAmount', row)}</>
                        }
                      ></AssetsDataItem>

                      <AssetsDataItem
                        keyTitle='Value'
                        value={<>{getCurItem(columns, 'valueUsd', row)}</>}
                      ></AssetsDataItem>
                    </H5AssetsCard>
                  </div>
                ))}

                {/* Pagination */}
                <div className='flex items-center justify-center'>
                  <TablePagination table={tableH5} data={data} />
                </div>
              </div>
            ) : (
              <NoDataDom></NoDataDom>
            )}
          </>
        )}
      </div>
    </>
  );
}
