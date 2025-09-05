'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  toast,
  Skeleton,
} from '@solvprotocol/ui-v2';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { InputComplex } from '@/components/InputComplex';
// Removed token selector for withdraw; right side is fixed to SolvBTC
import { TokenIcon } from '@/components/TokenIcon';
import { useSolvBTCVaultClient, useWalletStore } from '@/states';
import { useContractStore } from '@/states/contract-store';
import { TxResult } from '@/components';
import {
  sanitizeAmountInput,
  getFractionalLength,
  computeReceiveFromDeposit,
  computeDepositFromReceive,
  scaleAmountToBigInt,
  TOKEN_DECIMALS_FALLBACK,
} from '@/app/solvbtc/utils';
import {
  TOKEN_FEE_RATE_DECIMAL,
  SolvBTCTokenClient,
} from '@/contracts/solvBTCTokenContract/src';
import {
  formatTokenBalance,
  type TokenBalanceResult,
} from '@/lib/token-balance';
import { updateAllClientsSignTransaction } from '@/states/contract-store';
import { Client as ContractClient } from '@stellar/stellar-sdk/contract';
import { getCurrentStellarNetwork } from '@/config/stellar';
import { Buffer } from 'buffer';
import { useLoadingDialog } from '@/hooks/useLoadingDialog';
import { useSuccessfulDialog } from '@/hooks/useSuccessfulDialog';
import { buildExplorerTxUrl, getTxHashFromSent } from '@/lib/stellar-tx';
import { LoaderIcon } from '@/assets/svg/svg';

const createFormSchema = (params: {
  depositDecimals: number;
  receiveDecimals: number;
  maxWithdrawable: string;
}) =>
  z.object({
    deposit: z
      .string()
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          const num = parseFloat(val);
          return !isNaN(num) && isFinite(num);
        },
        { message: 'Withdraw amount must be a valid number' }
      )
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          return parseFloat(val) > 0;
        },
        { message: 'Withdraw amount must be greater than 0' }
      )
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          return getFractionalLength(val) <= params.depositDecimals;
        },
        {
          message: `Exceeds maximum decimals (${params.depositDecimals}) for SolvBTC`,
        }
      )
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          const amount = parseFloat(val);
          const max = parseFloat(params.maxWithdrawable || '0');
          return amount <= max;
        },
        {
          message: `Withdraw amount cannot exceed your balance of ${params.maxWithdrawable} SolvBTC`,
        }
      ),
    receive: z
      .string()
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          const num = parseFloat(val);
          return !isNaN(num) && isFinite(num);
        },
        { message: 'Receive amount must be a valid number' }
      )
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          return parseFloat(val) > 0;
        },
        { message: 'Receive amount must be greater than 0' }
      )
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          return getFractionalLength(val) <= params.receiveDecimals;
        },
        { message: `Exceeds maximum decimals (${params.receiveDecimals})` }
      ),
  });

export default function Withdraw() {
  const supportedTokens: any[] = [];
  const solvBTCClient = useSolvBTCVaultClient();
  const { isConnected, connectedWallet } = useWalletStore();
  const { openLoadingDialog, closeLoadingDialog } = useLoadingDialog();
  const { openSuccessfulDialog } = useSuccessfulDialog();

  // SolvBTC balance (withdrawable shares)
  const [shareBalance, setShareBalance] = useState<TokenBalanceResult>({
    balance: '0',
    decimals: 0,
  });
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Fee rate
  const [withdrawFeeRate, setWithdrawFeeRate] = useState<string>('0');
  const [isLoadingFeeRate, setIsLoadingFeeRate] = useState(false);
  const [feeRateError, setFeeRateError] = useState<string | null>(null);

  // Share token decimals (SolvBTC) for right input
  const vaultEntry = useContractStore(state =>
    state.vaults.get('solvBTCVault')
  );
  const [shareTokenDecimals, setShareTokenDecimals] = useState<number>(
    TOKEN_DECIMALS_FALLBACK
  );

  // Form
  const form = useForm<z.infer<ReturnType<typeof createFormSchema>>>({
    resolver: zodResolver(
      createFormSchema({
        depositDecimals: shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK,
        receiveDecimals: shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK,
        maxWithdrawable: formatTokenBalance(
          shareBalance.balance,
          shareBalance.decimals
        ),
      })
    ),
    defaultValues: { deposit: '', receive: '' },
    mode: 'onChange',
  });

  // Load share balance from vault shareTokenClient
  const fetchShareBalance = async () => {
    if (!connectedWallet?.publicKey) {
      setShareBalance({
        balance: '0',
        decimals: 0,
        error: 'Wallet not connected',
      });
      return;
    }
    const wt = vaultEntry?.shareTokenClient;
    if (!wt) {
      setShareBalance({
        balance: '0',
        decimals: 0,
        error: 'Share token not available',
      });
      return;
    }
    setIsLoadingBalance(true);
    try {
      const decimals = wt.decimal ?? TOKEN_DECIMALS_FALLBACK;
      const tx = await wt.client.balance({
        account: connectedWallet.publicKey,
      });
      const raw = Number(tx.result || 0);
      const val = raw / Math.pow(10, decimals);
      const formatted = val.toFixed(decimals).replace(/\.?0+$/, '');
      setShareBalance({ balance: formatted, decimals });
    } catch (err) {
      setShareBalance({
        balance: '0',
        decimals: 0,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Load withdraw fee rate
  const fetchWithdrawFeeRate = async () => {
    if (!solvBTCClient) {
      setFeeRateError('Contract client not available');
      return;
    }
    setIsLoadingFeeRate(true);
    setFeeRateError(null);
    try {
      const ret = await solvBTCClient.get_withdraw_fee_ratio();
      const percentage = (Number(ret.result) / TOKEN_FEE_RATE_DECIMAL).toFixed(
        4
      );
      setWithdrawFeeRate(percentage);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to fetch fee rate';
      setFeeRateError(msg);
    } finally {
      setIsLoadingFeeRate(false);
    }
  };

  // Load share token decimals and name (vault shares token)
  useEffect(() => {
    const loadShareDecimals = async () => {
      if (!solvBTCClient) return;
      try {
        const shareIdTx = await solvBTCClient.get_shares_token();
        const shareId = shareIdTx.result;
        if (!shareId) return;
        const client = new SolvBTCTokenClient({
          contractId: shareId,
          networkPassphrase: getCurrentStellarNetwork(),
          rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL!,
          allowHttp: true,
        } as any);
        const [dec, nameTx] = await Promise.all([
          client.decimals(),
          client.symbol(),
        ]);
        setShareTokenDecimals(Number(dec.result) || TOKEN_DECIMALS_FALLBACK);
        // nameTx might be the symbol (e.g., SolvBTC), if not available default to 'Share'
        const sym = (nameTx as any)?.result;
        if (typeof sym === 'string' && sym.length > 0) {
          // Save to a local variable used in UI label
          // We keep it in closure via state
        }
      } catch {}
    };
    loadShareDecimals();
  }, [solvBTCClient]);

  // No token selection for withdraw page; the right input is fixed to SolvBTC

  useEffect(() => {
    if (isConnected && connectedWallet?.publicKey) {
      fetchShareBalance();
    } else {
      setShareBalance({ balance: '0', decimals: 0 });
    }
  }, [isConnected, connectedWallet?.publicKey]);

  useEffect(() => {
    if (solvBTCClient) {
      fetchWithdrawFeeRate();
    }
  }, [solvBTCClient]);

  // No selectable token for withdraw; balance shown is shares (loaded separately)

  // Update resolver when balance or currency decimals loaded
  useEffect(() => {
    form.setValue('deposit', form.getValues('deposit'), {
      shouldValidate: true,
    });
    form.setValue('receive', form.getValues('receive'), {
      shouldValidate: true,
    });
  }, [shareBalance.balance, shareTokenDecimals]);

  const handleSetMax = () => {
    if (shareBalance.balance && parseFloat(shareBalance.balance) > 0) {
      const formatted = formatTokenBalance(
        shareBalance.balance,
        shareBalance.decimals
      );
      const sanitized = sanitizeAmountInput(
        formatted,
        shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK
      );
      form.setValue('deposit', sanitized);
      calculateReceiveAmount(sanitized);
    }
  };

  const calculateReceiveAmount = (depositAmount: string) => {
    if (
      !depositAmount ||
      isNaN(parseFloat(depositAmount)) ||
      parseFloat(depositAmount) <= 0
    ) {
      form.setValue('receive', '');
      form.trigger('receive');
      return;
    }
    const receiveDecimals = shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK;
    const formatted = computeReceiveFromDeposit(
      depositAmount,
      withdrawFeeRate,
      receiveDecimals
    );
    form.setValue('receive', formatted || '');
    form.trigger('receive');
  };

  const calculateDepositAmount = (receiveAmount: string) => {
    if (
      !receiveAmount ||
      isNaN(parseFloat(receiveAmount)) ||
      parseFloat(receiveAmount) <= 0
    ) {
      form.setValue('deposit', '');
      form.trigger('deposit');
      return;
    }
    const depositDecimals = shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK;
    const formatted = computeDepositFromReceive(
      receiveAmount,
      withdrawFeeRate,
      depositDecimals
    );
    form.setValue('deposit', formatted || '');
    form.trigger('deposit');
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = () => {
    const depositValue = form.getValues('deposit');
    const receiveValue = form.getValues('receive');
    const hasValues =
      (depositValue && depositValue.trim() !== '') ||
      (receiveValue && receiveValue.trim() !== '');
    const isWalletConnected = isConnected && connectedWallet?.publicKey;
    const formErrors = form.formState.errors;
    const hasNoErrors = !formErrors.deposit && !formErrors.receive;
    const notSubmitting = !isSubmitting;
    const positiveAmount = parseFloat(depositValue || receiveValue || '0') > 0;
    return (
      hasValues &&
      isWalletConnected &&
      hasNoErrors &&
      notSubmitting &&
      positiveAmount
    );
  };

  async function onSubmit(data: z.infer<ReturnType<typeof createFormSchema>>) {
    if (!solvBTCClient) {
      try {
        await useContractStore.getState().initializeContracts();
      } catch (initError) {
        toast(
          <TxResult
            type='error'
            title='Error'
            message='Contract client not available and initialization failed'
          />
        );
        return;
      }
    }

    if (!connectedWallet?.publicKey) {
      toast(
        <TxResult
          type='error'
          title='Error'
          message='Please connect your wallet first'
        />
      );
      return;
    }

    const withdrawAmount = data.deposit;
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast(
        <TxResult
          type='error'
          title='Error'
          message='Please enter a valid withdraw amount'
        />
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const currentClient =
        solvBTCClient ||
        useContractStore.getState().getClient('SolvBTCVaultClient');
      if (!currentClient)
        throw new Error(
          'SolvBTC client still not available after initialization attempts'
        );

      const clientOptions = (
        currentClient as ContractClient & {
          options?: {
            signTransaction?: (
              txXdr: string
            ) => Promise<{ signedTxXdr: string; signerAddress?: string }>;
            publicKey?: string;
          };
        }
      )?.options;
      if (!clientOptions?.signTransaction) {
        const { walletAdapter } = useWalletStore.getState();
        if (walletAdapter && connectedWallet) {
          await updateAllClientsSignTransaction(walletAdapter, connectedWallet);
        } else {
          throw new Error(
            'Wallet not properly connected - no signTransaction available'
          );
        }
      }

      // shares amount
      const sharesBigInt = scaleAmountToBigInt(
        withdrawAmount,
        supportedTokens[0]?.decimals ?? TOKEN_DECIMALS_FALLBACK
      );

      // random request hash
      const u8 = new Uint8Array(32);
      crypto.getRandomValues(u8);
      const request_hash = Buffer.from(u8);

      const tx = await currentClient.withdraw_request({
        from: connectedWallet.publicKey,
        shares: sharesBigInt,
        request_hash,
      });

      // 打开 Loading 弹窗
      openLoadingDialog({
        title: 'Withdraw',
        description: `Submitting withdraw request: ${withdrawAmount} SolvBTC...`,
        showCloseButton: false,
      });

      const signedTx = await tx.signAndSend();

      const txHash = getTxHashFromSent(signedTx);
      closeLoadingDialog();

      const scanUrl = buildExplorerTxUrl(txHash);
      openSuccessfulDialog({
        title: 'Withdraw',
        description: `Withdraw request submitted: ${withdrawAmount} SolvBTC`,
        confirmText: 'Confirm',
        showConfirm: true,
        showCancel: false,
        scanUrl,
      });

      form.reset();
      if (isConnected && connectedWallet?.publicKey) {
        fetchShareBalance();
      }
    } catch (error) {
      closeLoadingDialog();
      toast(
        <TxResult
          type='error'
          title='Transaction Failed'
          message={
            error instanceof Error
              ? error.message
              : 'Transaction failed. Please try again.'
          }
        />
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      {/* Top-right exchange rate pill */}
      <div className='absolute right-4 top-6 mb-3 flex w-full justify-end'>
        <div className='flex items-center gap-2 rounded-md px-3 py-1 text-[.875rem]'>
          <span className='text-textColor-tertiary'>Exchange Rate</span>
          <span className='text-textColor'>
            {isLoadingFeeRate ? (
              <Skeleton className='h-4 w-[200px]' />
            ) : feeRateError ? (
              '—'
            ) : (
              (() => {
                const receive = computeReceiveFromDeposit(
                  '1',
                  withdrawFeeRate,
                  shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK
                );
                return `1.00 ${vaultEntry?.shareTokenClient?.name || 'Share'} = ${receive ? parseFloat(receive).toFixed(4) : '—'} SolvBTC`;
              })()
            )}
          </span>
        </div>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full flex-col space-y-6'
      >
        <div className='flex flex-col justify-between md:flex-row'>
          <FormField
            control={form.control}
            name='deposit'
            render={({ field }) => (
              <FormItem className='w-full gap-[10px] md:w-[45.4%]'>
                <FormLabel className='flex items-end justify-between text-[.75rem] leading-[1rem]'>
                  <span className='text-textColor'>You Will Withdraw</span>
                  <div className='flex items-center gap-2 text-[.875rem]'>
                    <span className='text-textColor-tertiary'>Balance:</span>
                    <div className='text-textColor'>
                      {isLoadingBalance ? (
                        <span className='animate-pulse'>Loading...</span>
                      ) : (
                        <span
                          className={shareBalance.error ? 'text-red-500' : ''}
                        >
                          {formatTokenBalance(
                            shareBalance.balance,
                            shareBalance.decimals
                          )}
                        </span>
                      )}
                    </div>
                    <button
                      type='button'
                      onClick={fetchShareBalance}
                      disabled={isLoadingBalance || !isConnected}
                      className='rounded p-1 hover:bg-gray-100 disabled:opacity-50'
                      title='Refresh balance'
                    >
                      <RotateCcw
                        className={`h-3 w-3 text-textColor-tertiary ${isLoadingBalance ? 'animate-spin' : ''}`}
                      />
                    </button>
                  </div>
                </FormLabel>

                <div className='flex items-center'>
                  <FormControl>
                    <InputComplex
                      className='h-[2.75rem]'
                      error={
                        !!isConnected &&
                        !!field.value &&
                        parseFloat(field.value || '0') >
                          parseFloat(shareBalance.balance || '0')
                      }
                      inputValue={field.value}
                      onInputChange={value => {
                        const sanitized = sanitizeAmountInput(
                          value,
                          supportedTokens[0]?.decimals ??
                            TOKEN_DECIMALS_FALLBACK
                        );
                        field.onChange(sanitized);
                        calculateReceiveAmount(sanitized);
                      }}
                      inputProps={{
                        placeholder: '0.00',
                        className:
                          'h-[2.75rem] outline-none !border-none !ring-transparent',
                      }}
                      iSuffix={
                        <div className='flex h-full items-center justify-end'>
                          <button
                            type='button'
                            onClick={handleSetMax}
                            disabled={
                              !isConnected ||
                              parseFloat(shareBalance.balance) <= 0
                            }
                            className='flex h-[1.5rem] w-[2.875rem] cursor-pointer items-center justify-center rounded-[4px] bg-brand-50 px-2 text-[.75rem] text-brand-500 hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50'
                          >
                            MAX
                          </button>

                          <div className='ml-2 flex items-center justify-between text-[1rem]'>
                            <TokenIcon
                              src='https://res1.sft-api.com/token/SolvBTC.png'
                              alt={vaultEntry?.shareTokenClient?.name}
                              fallback={vaultEntry?.shareTokenClient?.name}
                            />
                            {vaultEntry?.shareTokenClient?.name}
                          </div>
                        </div>
                      }
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <div className='box-border flex h-[2.75rem] items-center justify-center px-[2.5rem] md:mt-[1.625rem]'>
            <ArrowRight className='h-4 w-4 rotate-90 md:h-6 md:w-6 md:rotate-0' />
          </div>

          <FormField
            control={form.control}
            name='receive'
            render={({ field }) => (
              <FormItem className='w-full gap-[10px] md:w-[45.4%]'>
                <FormLabel className='flex items-center justify-between text-[.75rem] leading-[1rem]'>
                  <div className='flex items-center !gap-1'>
                    <span className='text-textColor'>You Will Receive</span>
                  </div>
                  <div className='flex items-center gap-2 text-[.875rem]'>
                    <span className='text-textColor-tertiary'>Fee Rate:</span>
                    <div className='text-textColor'>
                      {isLoadingFeeRate ? (
                        <span className='animate-pulse'>Loading...</span>
                      ) : feeRateError ? (
                        <span className='text-red-500' title={feeRateError}>
                          Error
                        </span>
                      ) : (
                        <span className='font-medium text-brand-500'>
                          {withdrawFeeRate}%
                        </span>
                      )}
                    </div>
                  </div>
                </FormLabel>
                <FormControl>
                  <InputComplex
                    className='h-[2.75rem]'
                    error={
                      !!isConnected &&
                      !!form.getValues('deposit') &&
                      parseFloat(form.getValues('deposit') || '0') >
                        parseFloat(shareBalance.balance || '0')
                    }
                    inputValue={field.value}
                    onInputChange={value => {
                      const sanitized = sanitizeAmountInput(
                        value,
                        shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK
                      );
                      field.onChange(sanitized);
                      calculateDepositAmount(sanitized);
                    }}
                    inputProps={{
                      placeholder: '0.00',
                      className:
                        'h-[2.75rem] outline-none !border-none !ring-transparent',
                    }}
                    iSuffix={
                      <div className='flex h-full items-center justify-end'>
                        <div className='flex items-center justify-between text-[1rem]'>
                          <TokenIcon
                            src='https://res1.sft-api.com/token/SolvBTC.png'
                            alt='SolvBTC'
                            fallback='SolvBTC'
                          />
                          {`SolvBTC`}
                        </div>
                      </div>
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className='flex items-end justify-center'>
          <Button
            type='submit'
            disabled={!isFormValid()}
            className='w-full rounded-full bg-brand-500 text-white hover:bg-brand-500/90 disabled:cursor-not-allowed disabled:bg-gray-300 md:w-[25.625rem]'
          >
            {isSubmitting ? (
              <>
                <LoaderIcon className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : !!isConnected &&
              !!form.getValues('deposit') &&
              parseFloat(form.getValues('deposit') || '0') >
                parseFloat(shareBalance.balance || '0') ? (
              'Insufficient balance'
            ) : (
              'Withdraw'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
