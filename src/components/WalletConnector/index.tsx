import cn from 'classnames';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

import { useWalletStore } from '@/states';
import { WalletModal } from '@/components/WalletModal';
import { copyToClipboard, otherAddressFormat } from '@/lib/utils';

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@solvprotocol/ui-v2';
import { TokenIcon } from '../TokenIcon';
import { CopyHelper } from '../CopyHelper';
import { DisconnectIcon, MyPortfolioIcon } from '@/assets/svg/svg';

interface WalletConnectorProps {
  className?: string;
  showChainIcon?: boolean;
}

const ImageAvatar = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  return (
    <TokenIcon
      src={src}
      alt={alt}
      className={cn('h-5 w-5 lg:h-6 lg:w-6', className)}
      fallback=' '
    />
  );
};

const ChainIcon = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'h-8 w-8 lg:h-[2.75rem] lg:w-[2.75rem]',
        'flex items-center justify-center rounded-full border-[1px] border-solid border-border bg-gray-400/10 backdrop-blur-[5px]',
        className
      )}
    >
      <ImageAvatar
        src='https://s2.coinmarketcap.com/static/img/coins/200x200/512.png'
        alt='Stellar'
      />
    </div>
  );
};

export function WalletConnector({
  className,
  showChainIcon = true,
}: WalletConnectorProps) {
  const {
    isConnected,
    isConnecting,
    isLoadingAccount,
    connectedWallet,
    disconnectWallet,
  } = useWalletStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 断开钱包连接
  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  // 如果没有连接钱包，显示连接按钮
  if (!isConnected || !connectedWallet || isLoadingAccount || isConnecting) {
    return (
      <div className='relative flex items-center space-x-2 lg:space-x-4'>
        {showChainIcon && <ChainIcon />}
        <Button
          onClick={() => setIsModalOpen(true)}
          variant='outline'
          size='lg'
          disabled={isConnecting || isLoadingAccount}
          className={cn(
            'h-8 space-x-1 rounded-full border border-solid border-border bg-gray-400/10 px-3 text-sm font-medium text-textColor backdrop-blur-[5px] transition-all hover:opacity-90 lg:h-[2.75rem] lg:px-4',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
        >
          {isConnecting || isLoadingAccount
            ? 'Connecting...'
            : 'Connect Wallet'}
        </Button>
        <WalletModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    );
  }

  // 已连接钱包，显示钱包信息下拉菜单
  return (
    <div
      className={cn(
        'relative flex items-center space-x-2 lg:space-x-4',
        className
      )}
    >
      {showChainIcon && <ChainIcon />}
      <Popover>
        <PopoverTrigger asChild>
          <div className='flex h-8 cursor-pointer items-center space-x-1 rounded-full border border-border bg-gray-400/10 px-1 backdrop-blur-[5px] transition-colors lg:h-[2.75rem] lg:px-4'>
            <ImageAvatar
              src='https://avatar.sft-api.com/avatar/28.png'
              alt='User Avatar'
            />
            <span className='text-[.75rem] font-medium text-textColor lg:text-sm'>
              {otherAddressFormat(connectedWallet.publicKey)}
            </span>
            <ChevronDown className='h-4 w-4 text-textColor transition-transform' />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className='overflow-hidden rounded-xl border-0 p-0 shadow-xl outline-none'
          align='end'
          sideOffset={8}
        >
          {/* user info */}
          <div className='p-6'>
            <div className='bg- flex items-center space-x-3'>
              <ImageAvatar
                src='https://avatar.sft-api.com/avatar/28.png '
                alt='User Avatar'
                className='!h-12 !w-12'
              />
              <div className='min-w-0 flex-1'>
                <h3 className='text-xl font-medium'>{connectedWallet.name}</h3>

                <div className='flex items-center space-x-2'>
                  <CopyHelper size='14' data={connectedWallet.publicKey}>
                    <p className='truncate text-[.875rem] leading-5 text-textColor'>
                      {otherAddressFormat(connectedWallet.publicKey)}
                    </p>
                  </CopyHelper>
                </div>
              </div>
            </div>

            {/* network */}
            <div className='mt-4 py-4'>
              <div className='flex items-center space-x-2 rounded-lg bg-gray-300/20 px-3 py-[.625rem]'>
                <ChainIcon className='!h-6 !w-6 !border-0 !bg-none !p-0' />
                <span className='text-[.875rem] leading-4'>Stellar</span>
              </div>
            </div>

            <div className='space-y-1'>
              <div className='border-input leader-5 flex w-full cursor-pointer items-center space-x-2 border-b-[1px] border-solid py-3 text-left text-[.875rem] transition-colors'>
                <MyPortfolioIcon className='h-4 w-4' />
                <span>My Portfolio</span>
              </div>

              {/* Disconnect */}
              <div
                onClick={handleDisconnect}
                className='leader-5 flex w-full cursor-pointer items-center space-x-2 py-3 text-left text-[.875rem] transition-colors'
              >
                <DisconnectIcon className='h-4 w-4' />
                <span>Disconnect</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
