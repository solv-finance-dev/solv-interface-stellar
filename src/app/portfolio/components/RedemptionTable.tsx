'use client';

import { ClaimIcon } from '@/assets/svg/svg';
import { DataTableComplex } from '@/components/DataTableComplex';
import { TokenIcon } from '@/components/TokenIcon';
import { Button } from '@solvprotocol/ui-v2';
import { ColumnDef } from '@tanstack/react-table';

export interface Redemption {
  id: string;
  pool: string;
  network: string;
  withdrawAmount: number | string;
  value: number | string;
  action?: string;
}

export const columns: ColumnDef<Redemption>[] = [
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
          <div className='max-w-[calc(90%-1rem)] truncate font-MatterSQ-Medium text-[1rem] leading-[1.125rem]'>
            {row.getValue('pool')}
          </div>

          <div className='mt-1 font-MatterSQ-Regular text-[.875rem] leading-4'>
            {/* <span className='text-yellow-500'>Pending</span> */}
            <span className='text-green-500'>Ready to claim</span>
          </div>
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

      return <div className='text-[.875rem] leading-4'>{formatted}</div>;
    },
  },
  {
    accessorKey: 'value',
    header: 'Value',
    enableSorting: true,
    meta: {
      align: 'right',
    },
    cell: ({ row }) => {
      const value = parseFloat(row.getValue('value'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);

      return (
        <div className='flex flex-col items-end text-[.875rem] leading-4'>
          <span>{formatted}</span>
          <span className='mt-1 text-gray-400'>{`$1007.27`}</span>
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
        <Button
          variant='default'
          size='sm'
          className='w-[6.4375rem] rounded-full bg-brand hover:bg-brand-600'
        >
          <ClaimIcon className='h-4 w-4' /> Claim
        </Button>
      );
    },
  },
];

interface RedemptionTableProps {
  data: Redemption[];
}

export function RedemptionTable({ data }: RedemptionTableProps) {
  return <DataTableComplex columns={columns} data={data} />;
}
