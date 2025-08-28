import { CopyHelper } from '@/components/CopyHelper';
import { TokenIcon } from '@/components/TokenIcon';
import { addressFormat } from '@/lib/utils';
import { useWalletStore } from '@/states';
import { Card } from '@solvprotocol/ui-v2';
import React from 'react';

export default function MyRedemption() {
  const { isConnected, isConnecting, isLoadingAccount, connectedWallet } =
    useWalletStore();
  return (
    <div className='pt-0 md:pt-6'>
      <div className='flex w-full items-end justify-between'>
        <h3 className='text-[3rem] leading-[4rem] md:text-[4rem]'>
          My Redemption
        </h3>

        <div className='hidden lg:block'>
          {!isConnected ||
          !connectedWallet ||
          isLoadingAccount ||
          isConnecting ? (
            <></>
          ) : (
            <div className='flex h-[3rem] w-[12.8125rem] items-center justify-between rounded-[1.875rem] border-[1px] border-solid border-border py-1 pl-2 pr-3'>
              <div className='box-border flex h-10 w-10 items-center justify-center rounded-full border-[1px] border-solid border-gray-300 p-2'>
                <TokenIcon
                  src='https://avatar.sft-api.com/avatar/28.png'
                  className='h-6 w-6'
                />
              </div>

              <CopyHelper size='18' data={connectedWallet.publicKey}>
                <div className='w-[7.0625rem] truncate text-right text-[.875rem] leading-5 text-textColor'>
                  {addressFormat(connectedWallet.publicKey)}
                </div>
              </CopyHelper>
            </div>
          )}
        </div>
      </div>

      <Card className='mt-8 rounded-3xl border-none p-8'>
        <div className='p-0'></div>
      </Card>
    </div>
  );
}
