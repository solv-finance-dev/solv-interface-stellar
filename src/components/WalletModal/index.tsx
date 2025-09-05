import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Checkbox,
  Label,
} from '@solvprotocol/ui-v2';

import React, { useState } from 'react';

import { WalletType } from '@/wallet-connector';
import { useWalletStore } from '@/states';

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletModal({ open, onOpenChange }: WalletModalProps) {
  const {
    availableWallets,
    isConnecting,
    isLoadingAccount,
    connectWallet,
    clearError,
  } = useWalletStore();
  const [connectingWalletId, setConnectingWalletId] =
    useState<WalletType | null>(null);

  // 完整的loading状态：连接中或加载账户信息中
  const isFullyLoading = isConnecting || isLoadingAccount;

  const handleWalletClick = async (wallet: any) => {
    if (wallet.isInstalled) {
      // 已安装的钱包：连接钱包
      try {
        clearError();
        setConnectingWalletId(wallet.id as WalletType);
        await connectWallet(wallet.id as WalletType);
        onOpenChange(false);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      } finally {
        setConnectingWalletId(null);
      }
    } else {
      // 未安装的钱包：打开安装页面
      window.open(wallet.url, '_blank', 'noopener,noreferrer');
    }
  };

  const [isCheckedTerms, setIsCheckedTerms] = useState(false);

  // 重置状态当modal关闭时
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConnectingWalletId(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-left text-lg font-bold'>
            Connect your wallet
          </DialogTitle>
          <DialogDescription className='mt-3'>
            <Label className='flex items-start space-x-1 text-left text-xs text-textColor'>
              <Checkbox
                className='mt-[2px]'
                id='terms'
                checked={isCheckedTerms}
                onCheckedChange={checked => {
                  setIsCheckedTerms(
                    checked === 'indeterminate' ? false : checked
                  );
                }}
              />
              <span className='text-xs'>
                By connecting my wallet and using Solv's services, I confirm
                that I have read, understood, and agree to be bound by Solv's{' '}
                <a
                  href='https://storage-1.solv.finance/solv-term-of-use-reps-and-warranties.pdf'
                  target='_blank'
                  className='text-brand'
                >
                  Terms of Use and Privacy Policy
                </a>
                <span> and </span>
                <a
                  href='https://docs.solv.finance/legal/disclaimer'
                  target='_blank'
                  className='text-brand'
                >
                  Disclaimer
                </a>
              </span>
            </Label>
          </DialogDescription>
        </DialogHeader>

        <div className=''>
          {/* Wallet List */}
          <div className='h-[19.5rem] space-y-2 overflow-y-auto'>
            {availableWallets.map(wallet => {
              const isCurrentlyConnecting = connectingWalletId === wallet.id;
              const isDisabled = isFullyLoading && !isCurrentlyConnecting;
              const canClick =
                isCheckedTerms && !isDisabled && !isCurrentlyConnecting;

              return (
                <div
                  key={wallet.id}
                  className={`flex items-center space-x-2 rounded-lg bg-background-elevation2 px-3 py-2 transition-all duration-200 ${
                    canClick
                      ? 'cursor-pointer hover:bg-brand'
                      : 'cursor-not-allowed opacity-50'
                  }`}
                  onClick={() =>
                    canClick ? handleWalletClick(wallet) : undefined
                  }
                >
                  <div className='flex h-6 w-6 items-center justify-center overflow-hidden rounded-full'>
                    {isCurrentlyConnecting ? (
                      <div className='border-primary-foreground h-6 w-6 animate-spin rounded-full border-2 border-t-transparent' />
                    ) : (
                      <img
                        src={wallet.supportedWallet?.icon}
                        alt={wallet.name}
                        className='h-6 w-6 rounded-full'
                      />
                    )}
                  </div>

                  <div className='flex w-full items-center justify-between'>
                    <div className='text-sm font-medium text-textColor'>
                      {wallet.name}
                    </div>
                    <div className='rounded-lg bg-brand-50 px-2 py-[2px] text-xs text-textColor-secondary dark:bg-brand-700'>
                      {isCurrentlyConnecting
                        ? isConnecting
                          ? 'Connecting...'
                          : 'Loading account...'
                        : wallet.isInstalled
                          ? 'Available'
                          : 'Not installed'}
                    </div>
                  </div>
                </div>
              );
            })}

            {availableWallets.length === 0 && (
              <div className='py-8 text-center text-textColor-secondary'>
                <p className='text-sm'>No wallets available</p>
                <p className='text-xs'>
                  Please install a Stellar wallet extension
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
