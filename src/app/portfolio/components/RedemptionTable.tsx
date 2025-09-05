'use client';

import { ClaimIcon } from '@/assets/svg/svg';
import ClaimAction from './ClaimAction';
import { DataTableComplex } from '@/components/DataTableComplex';

import H5AssetsCard, {
  AssetsDataItem,
  AssetsSkeletonCard,
  NoDataDom,
} from '@/components/DataTableComplex/H5AssetsCard';
import TablePagination from '@/components/DataTableComplex/TablePagination';
import { TokenIcon } from '@/components/TokenIcon';
import { TooltipComplex } from '@/components/TooltipComplex';
import { useDialog } from '@/hooks/useDialog';
import { useLoadingDialog } from '@/hooks/useLoadingDialog';
import { useSuccessfulDialog } from '@/hooks/useSuccessfulDialog';
import { getCurItem, upperCaseFirst } from '@/lib/utils';
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
  const { openLoadingDialog, closeLoadingDialog } = useLoadingDialog();
  const { openSuccessfulDialog } = useSuccessfulDialog();

  const showClaimDialog = () => {
    openDialog({
      size: 'md',
      title: 'Claim',
      description: 'Sorry. You have no claimable amount at the moment.',
      content: (
        <section className=''>
          <div className='text-textColor-secondary text-[.875rem] leading-5'>
            Claimable
          </div>
          <div className='text-textColor mb-4 mt-2 text-2xl'>0.00 WBTC</div>

          <div className='bg-background-elevation3 box-border flex h-[2.25rem] w-full items-center justify-between rounded-md p-2'>
            <div className='flex items-center justify-start text-[.875rem] leading-[1.25rem]'>
              <span className='text-textColor-secondary mr-1'>
                Pending repayment
              </span>{' '}
              <TooltipComplex content={'tips'} />
            </div>

            <div className='text-textColor flex items-center justify-end text-[.875rem] leading-[1.25rem]'>
              0.00 WBTC
            </div>
          </div>
        </section>
      ),
      loading: false,
      onConfirm: async () => {
        console.log('Confirm Claim');

        openLoadingDialog({
          description: '当前操作的描述',
          chainId: 'xxx',
          scanUrl: 'xxx',
        });

        setTimeout(() => {
          closeLoadingDialog();

          openSuccessfulDialog({
            size: 'md',
            title: 'Deposit',
            description: 'You successfully deposited 100.00 WBTC.',
            chainId: 'xxx',
            scanUrl: 'xxx',
            onConfirm: async () => {
              console.log('close successful dialog');
            },
          });
        }, 2000);
      },
    });
  };

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
            <div className='text-textColor w-full truncate font-MatterSQ-Medium text-[1rem] leading-[1.125rem] md:max-w-[calc(90%-1rem)]'>
              {row.getValue('pool')}
            </div>

            <div className='mt-1 hidden font-MatterSQ-Regular text-[.875rem] leading-4 md:flex'>
              <span
                className={cn(
                  row.original.state == RedemptionState.Pending
                    ? 'text-yellow-500'
                    : 'text-green-500'
                )}
              >
                {row.original.state === RedemptionState.Signed
                  ? 'Ready to claim'
                  : upperCaseFirst(row.original.state || '')}
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
          <div className='mt-1 font-MatterSQ-Regular text-[.875rem] leading-4'>
            <span
              className={cn(
                row.original.state == RedemptionState.Pending
                  ? 'text-yellow-500'
                  : 'text-green-500'
              )}
            >
              {row.original.state === RedemptionState.Signed
                ? 'Ready to claim'
                : upperCaseFirst(row.original.state || '')}
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
          <div className='text-textColor text-[.875rem] leading-4'>
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
            <span className='text-textColor-secondary ml-1 mt-0 text-[10px] md:ml-0 md:mt-1 md:text-[.875rem]'>
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
            onClaim={showClaimDialog}
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
                  <div
                    key={`H5AssetsCard-${row.id}-${index}`}
                    onClick={() => {}}
                  >
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
