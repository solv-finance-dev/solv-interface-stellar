import { CopyHelper } from '@/components/CopyHelper';
import { TokenIcon } from '@/components/TokenIcon';
import { otherAddressFormat } from '@/lib/utils';
import { useWalletStore } from '@/states';
import { Card } from '@solvprotocol/ui-v2';
import React from 'react';
import { Redemption, RedemptionTable } from './RedemptionTable';
import { useEffect, useState } from 'react';
import { getApolloClient } from '@/graphql/clientsFactory';
import {
  NonEvmRedemptionsResponse,
  NonEvmRedemptionRecord,
  QUERY_NON_EVM_REDEMPTIONS,
} from '@/graphql/queries/solvbtc';

export default function MyRedemption() {
  const { isConnected, isConnecting, isLoadingAccount, connectedWallet } =
    useWalletStore();
  const walletAddress = connectedWallet?.publicKey;

  const [rows, setRows] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress) {
        setRows([]);
        return;
      }
      setLoading(true);
      try {
        const client = getApolloClient();
        const { data } = await client.query<NonEvmRedemptionsResponse>({
          query: QUERY_NON_EVM_REDEMPTIONS,
          variables: {
            // todo: add walletAddress
            filter: { chain: 'stellar' },
            pagination: {
              offset: pagination.pageIndex * pagination.pageSize,
              limit: pagination.pageSize,
            },
            sort: { field: 'availableTime', direction: 'DESC' },
          },
          fetchPolicy: 'network-only',
        });
        const list = data?.nonEvmRedemptions;
        const mapped = (list?.records || []).map(
          (r: NonEvmRedemptionRecord) => ({
            id: r.id,
            pool: r.vaultName || 'SolvBTC Yield Pool',
            network: r.chain,
            withdrawAmount: Number(r.withdrawAmount) / 1e8,
            valueUsd: Number(r.valueUsd) || 0,
            availableTime: r.availableTime,
            state: r.state,
          })
        );
        setRows(mapped);
        setTotalCount(list?.totalCount || 0);
      } catch (e) {
        console.error('Failed to load redemptions', e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [walletAddress, pagination]);
  return (
    <div className='pt-0 md:pt-6'>
      <div className='flex w-full items-end justify-between'>
        <h3 className='text-textColor-heading text-[3rem] leading-[4rem] md:text-[4rem]'>
          My Redemption
        </h3>

        <div className='hidden lg:block'>
          {!isConnected ||
          !connectedWallet ||
          isLoadingAccount ||
          isConnecting ? (
            <></>
          ) : (
            <div className='border-border border-base-neutral-400 flex h-[3rem] w-[12.8125rem] items-center justify-between rounded-[1.875rem] border-[1px] border-solid py-1 pl-2 pr-3'>
              <div className='border-borderColor box-border flex items-center justify-center rounded-full border-[1px] border-solid p-2'>
                <TokenIcon
                  src='https://avatar.sft-api.com/avatar/28.png'
                  className='h-6 w-6'
                />
              </div>

              <CopyHelper size='18' data={connectedWallet.publicKey}>
                <div className='text-textColor-secondary w-[7.0625rem] truncate text-right text-[.875rem] leading-5'>
                  {otherAddressFormat(connectedWallet.publicKey)}
                </div>
              </CopyHelper>
            </div>
          )}
        </div>
      </div>

      <Card className='mt-8 border-none p-8'>
        <RedemptionTable
          loading={loading}
          data={rows.length ? rows : []}
          pagination={pagination}
          onPaginationChange={setPagination}
          pageCount={Math.max(1, Math.ceil(totalCount / pagination.pageSize))}
        />
      </Card>
    </div>
  );
}
