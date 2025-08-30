'use client';

import React, { useState, useEffect } from 'react';
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
  FormMessage,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  toast,
} from '@solvprotocol/ui-v2';
import { ArrowRight, RotateCcw, Loader2 } from 'lucide-react';
import { InputComplex } from '@/components/InputComplex';
import { TooltipComplex } from '@/components/TooltipComplex';
import { TokenIcon } from '@/components/TokenIcon';
import { TxResult } from '@/components';
import {
  useSolvBtcStore,
  useSolvBTCVaultClient,
  useWalletStore,
  Token,
} from '@/states';
import {
  useContractStore,
  updateAllClientsSignTransaction,
} from '@/states/contract-store';
import { Client as ContractClient } from '@stellar/stellar-sdk/contract';
import {
  getSolvBTCTokenBalance,
  formatTokenBalance,
  type TokenBalanceResult,
} from '@/lib/token-balance';

// Constants
const BASIS_POINTS_DIVISOR = 10000; // Convert basis points to percentage (e.g., 100 basis points = 1%)
const PERCENTAGE_DIVISOR = 100; // Convert percentage to decimal (e.g., 1% = 0.01)
const DECIMAL_PRECISION = 6; // Number of decimal places for amount formatting

export default function Deposit() {
  const solvBTCClient = useSolvBTCVaultClient();
  const { isConnected, connectedWallet } = useWalletStore();
  const { supportedTokens } = useSolvBtcStore();

  // Token balance state
  const [tokenBalance, setTokenBalance] = useState<TokenBalanceResult>({
    balance: '0',
    decimals: 0,
  });
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Deposit fee rate state
  const [depositFeeRate, setDepositFeeRate] = useState<string>('0');
  const [isLoadingFeeRate, setIsLoadingFeeRate] = useState(false);
  const [feeRateError, setFeeRateError] = useState<string | null>(null);

  // Selected token state
  const [selected, setSelected] = useState<Token>(supportedTokens[0]);

  // Create form validation schema as a function to access current state
  const createFormSchema = () =>
    z.object({
      deposit: z
        .string()
        .refine(
          val => {
            // Allow empty values
            if (!val || val.trim() === '') return true;
            const num = parseFloat(val);
            return !isNaN(num) && isFinite(num);
          },
          { message: 'Deposit amount must be a valid number' }
        )
        .refine(
          val => {
            // Allow empty values
            if (!val || val.trim() === '') return true;
            return parseFloat(val) > 0;
          },
          { message: 'Deposit amount must be greater than 0' }
        )
        .refine(
          val => {
            // Allow empty values
            if (!val || val.trim() === '') return true;
            const depositAmount = parseFloat(val);
            const maxBalance = parseFloat(tokenBalance.balance || '0');
            return depositAmount <= maxBalance;
          },
          {
            message: `Deposit amount cannot exceed your balance of ${formatTokenBalance(tokenBalance.balance, tokenBalance.decimals)} ${selected.name}`,
          }
        ),
      receive: z
        .string()
        .refine(
          val => {
            // Allow empty values
            if (!val || val.trim() === '') return true;
            const num = parseFloat(val);
            return !isNaN(num) && isFinite(num);
          },
          { message: 'Receive amount must be a valid number' }
        )
        .refine(
          val => {
            // Allow empty values
            if (!val || val.trim() === '') return true;
            return parseFloat(val) > 0;
          },
          { message: 'Receive amount must be greater than 0' }
        ),
    });

  const form = useForm<z.infer<ReturnType<typeof createFormSchema>>>({
    resolver: zodResolver(createFormSchema()),
    defaultValues: {
      deposit: '',
      receive: '',
    },
    mode: 'onChange', // Enable real-time validation
  });

  const onTokenSelected = (value: string) => {
    const token = supportedTokens.find(token => token.name === value);
    if (token) {
      setSelected(token);
    }
  };
  // Function to fetch token balance
  const fetchTokenBalance = async () => {
    if (!connectedWallet?.publicKey) {
      setTokenBalance({
        balance: '0',
        decimals: 0,
        error: 'Wallet not connected',
      });
      return;
    }

    setIsLoadingBalance(true);
    try {
      const result = await getSolvBTCTokenBalance(connectedWallet.publicKey);
      setTokenBalance(result);
    } catch (error) {
      setTokenBalance({
        balance: '0',
        decimals: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Function to fetch deposit fee rate
  const fetchDepositFeeRate = async () => {
    if (!solvBTCClient) {
      setFeeRateError('Contract client not available');
      return;
    }

    setIsLoadingFeeRate(true);
    setFeeRateError(null);
    try {
      const feeRateResult = await solvBTCClient.get_deposit_fee_ratio();
      const feeRateValue = feeRateResult.result;

      // Convert fee rate from i128 to percentage (assuming fee rate is in basis points)
      // If fee rate is 100, it means 1% (100 basis points)
      const feeRatePercentage = (
        Number(feeRateValue) / BASIS_POINTS_DIVISOR
      ).toFixed(4);
      setDepositFeeRate(feeRatePercentage);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch fee rate';
      setFeeRateError(errorMessage);
      console.error('Error fetching deposit fee rate:', errorMessage);
    } finally {
      setIsLoadingFeeRate(false);
    }
  };

  // Fetch balance when wallet connection status changes
  useEffect(() => {
    if (isConnected && connectedWallet?.publicKey) {
      fetchTokenBalance();

      // 验证钱包连接状态，修复页面刷新后的状态不一致问题
      const validateConnection = async () => {
        try {
          const { validateAndFixWalletConnection } = useWalletStore.getState();
          await validateAndFixWalletConnection();
        } catch (error) {
          console.error('❌ Failed to validate wallet connection:', error);
        }
      };

      validateConnection();
    } else {
      setTokenBalance({ balance: '0', decimals: 0 });
    }
  }, [isConnected, connectedWallet?.publicKey]);

  // Fetch deposit fee rate when component mounts or when solvBTCClient is available
  useEffect(() => {
    if (solvBTCClient) {
      fetchDepositFeeRate();
    }
  }, [solvBTCClient]);

  // Update form resolver when balance or selected token changes
  useEffect(() => {
    // Update the form resolver with new schema
    form.setValue('deposit', form.getValues('deposit'), {
      shouldValidate: true,
    });
    form.setValue('receive', form.getValues('receive'), {
      shouldValidate: true,
    });
  }, [tokenBalance.balance, selected.name, form]);

  // Set maximum amount
  const handleSetMax = () => {
    if (tokenBalance.balance && parseFloat(tokenBalance.balance) > 0) {
      form.setValue('deposit', tokenBalance.balance);
      // Calculate and set the receive amount when max is set
      calculateReceiveAmount(tokenBalance.balance);
    }
  };

  // Calculate receive amount based on deposit amount and fee rate
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

    const depositValue = parseFloat(depositAmount);
    const feeRateValue = parseFloat(depositFeeRate);

    // Calculate the amount after fee deduction
    // receive = deposit * (1 - fee_rate_percentage)
    const receiveAmount =
      depositValue * (1 - feeRateValue / PERCENTAGE_DIVISOR);

    // Format to specified decimal places and remove trailing zeros
    const formattedReceiveAmount = parseFloat(
      receiveAmount.toFixed(DECIMAL_PRECISION)
    ).toString();
    form.setValue('receive', formattedReceiveAmount);
    form.trigger('receive');
  };

  // Calculate deposit amount based on receive amount and fee rate
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

    const receiveValue = parseFloat(receiveAmount);
    const feeRateValue = parseFloat(depositFeeRate);

    // Calculate the required deposit amount
    // deposit = receive / (1 - fee_rate_percentage)
    const depositAmount =
      receiveValue / (1 - feeRateValue / PERCENTAGE_DIVISOR);

    // Format to specified decimal places and remove trailing zeros
    const formattedDepositAmount = parseFloat(
      depositAmount.toFixed(DECIMAL_PRECISION)
    ).toString();
    form.setValue('deposit', formattedDepositAmount);
    form.trigger('deposit');
  };

  // Add transaction loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if form is valid for submission
  const isFormValid = () => {
    const depositValue = form.getValues('deposit');
    const receiveValue = form.getValues('receive');

    // Must have at least one value filled
    const hasValues =
      (depositValue && depositValue.trim() !== '') ||
      (receiveValue && receiveValue.trim() !== '');

    // Must be connected to wallet
    const isWalletConnected = isConnected && connectedWallet?.publicKey;

    // Form must be valid (no errors)
    const formErrors = form.formState.errors;
    const hasNoErrors = !formErrors.deposit && !formErrors.receive;

    // Must not be currently submitting
    const notSubmitting = !isSubmitting;

    return hasValues && isWalletConnected && hasNoErrors && notSubmitting;
  };

  async function onSubmit(data: z.infer<ReturnType<typeof createFormSchema>>) {
    if (!solvBTCClient) {
      console.error(
        '❌ SolvBTC client not available, attempting to initialize...'
      );
      try {
        await useContractStore.getState().initializeContracts();
        const newClient = useContractStore
          .getState()
          .getClient('SolvBTCVaultClient');
        if (!newClient) {
          throw new Error('Failed to initialize SolvBTC client');
        }
      } catch (initError) {
        console.error('❌ Failed to initialize contracts:', initError);
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

    const depositAmount = data.deposit;
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast(
        <TxResult
          type='error'
          title='Error'
          message='Please enter a valid deposit amount'
        />
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 🎯 简洁方案：直接使用已经配置好签名器的 client

      // 重新获取 client（可能在上面已经重新初始化了）
      const currentClient =
        solvBTCClient ||
        useContractStore.getState().getClient('SolvBTCVaultClient');

      if (!currentClient) {
        throw new Error(
          'SolvBTC client still not available after initialization attempts'
        );
      }

      // 检查 signTransaction 的存在
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

      // 如果没有 signTransaction，尝试手动更新
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

      // 获取输入金额（以最小单位）
      const depositAmountBigInt = BigInt(
        Math.floor(Number(depositAmount) * Math.pow(10, DECIMAL_PRECISION))
      );

      // 直接使用已经配置好签名器的 client
      const depositTx = await currentClient.deposit({
        currency: supportedTokens[0]?.address,
        from: connectedWallet.publicKey,
        amount: depositAmountBigInt,
      });

      // 直接调用 signAndSend，签名器已经在钱包连接时配置好了
      const signedTx = await depositTx.signAndSend();

      // Extract transaction hash if available (safely handle different response structures)
      let txHash: string | undefined;
      try {
        // Try to extract transaction hash from the response
        if (typeof signedTx === 'object' && signedTx && 'hash' in signedTx) {
          txHash = (signedTx as { hash: string }).hash;
        } else if (
          typeof signedTx === 'object' &&
          signedTx &&
          'id' in signedTx
        ) {
          txHash = (signedTx as { id: string }).id;
        }
      } catch (e) {
        console.warn('Could not extract transaction hash:', e);
      }

      toast(
        <TxResult
          type='success'
          title='Transaction Successful!'
          message={`Successfully deposited ${depositAmount} ${selected.name}`}
          txHash={txHash}
        />
      );

      // Reset form after successful submission
      form.reset();

      // Refresh balance after successful deposit
      if (isConnected && connectedWallet?.publicKey) {
        fetchTokenBalance();
      }
    } catch (error) {
      console.error('Deposit transaction failed:', error);

      let errorTitle = 'Transaction Failed';
      let errorMessage = 'Transaction failed. Please try again.';

      if (error instanceof Error) {
        // Basic error handling
        if (error.message.includes('Transaction requires signatures from')) {
          errorTitle = 'Authorization Required';
          errorMessage =
            'This transaction requires additional authorization. Please contact the contract administrator.';
        } else if (
          error.message.includes('Currency') &&
          error.message.includes('not supported')
        ) {
          errorTitle = 'Unsupported Currency';
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      }

      toast(
        <TxResult type='error' title={errorTitle} message={errorMessage} />
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
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
                  <span>Deposit</span>
                  <div className='flex items-center gap-2 text-[.875rem]'>
                    <span className='text-grayColor'>Balance:</span>
                    <div className='text-textColor'>
                      {isLoadingBalance ? (
                        <span className='animate-pulse'>Loading...</span>
                      ) : (
                        <span
                          className={tokenBalance.error ? 'text-red-500' : ''}
                        >
                          {formatTokenBalance(
                            tokenBalance.balance,
                            tokenBalance.decimals
                          )}{' '}
                          {selected.name}
                        </span>
                      )}
                    </div>
                    <button
                      type='button'
                      onClick={fetchTokenBalance}
                      disabled={isLoadingBalance || !isConnected}
                      className='rounded p-1 hover:bg-gray-100 disabled:opacity-50'
                      title='Refresh balance'
                    >
                      <RotateCcw
                        className={`h-3 w-3 ${isLoadingBalance ? 'animate-spin' : ''}`}
                      />
                    </button>
                  </div>
                </FormLabel>

                <div className='flex items-center'>
                  <FormControl>
                    <InputComplex
                      className='h-[2.75rem]'
                      inputValue={field.value}
                      onInputChange={value => {
                        field.onChange(value);
                        // Calculate receive amount when deposit amount changes
                        calculateReceiveAmount(value);
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
                              parseFloat(tokenBalance.balance) <= 0
                            }
                            className='flex h-[1.5rem] w-[2.875rem] cursor-pointer items-center justify-center rounded-[4px] bg-brand-50 px-2 text-[.75rem] text-brand-500 hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50'
                          >
                            MAX
                          </button>

                          <Select
                            value={selected.name}
                            onValueChange={onTokenSelected}
                          >
                            <SelectTrigger className='border-0 !bg-transparent !pl-2 !pr-0 outline-none focus-visible:ring-0'>
                              <div className='flex items-center justify-between text-[1rem]'>
                                <TokenIcon
                                  src={selected.icon}
                                  alt={selected.name}
                                  fallback={selected.name}
                                />

                                {selected.name}
                              </div>
                            </SelectTrigger>

                            <SelectContent>
                              <SelectGroup>
                                {/* <SelectLabel>Token List</SelectLabel> */}

                                {supportedTokens.map((opt: any) => (
                                  <SelectItem key={opt.name} value={opt.name}>
                                    <div className='flex items-center justify-between text-[1rem]'>
                                      <TokenIcon
                                        src={opt.icon}
                                        alt={opt.name}
                                        fallback={opt.name}
                                      />
                                      {opt.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      }
                    />
                  </FormControl>
                </div>

                <FormMessage />
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
                    You Will Receive
                    <TooltipComplex content={'tips'}></TooltipComplex>
                  </div>
                  <div className='flex items-center gap-2 text-[.875rem]'>
                    <span className='text-grayColor'>Fee Rate:</span>
                    <div className='text-textColor'>
                      {isLoadingFeeRate ? (
                        <span className='animate-pulse'>Loading...</span>
                      ) : feeRateError ? (
                        <span className='text-red-500' title={feeRateError}>
                          Error
                        </span>
                      ) : (
                        <span className='font-medium text-brand-500'>
                          {depositFeeRate}%
                        </span>
                      )}
                    </div>
                  </div>
                </FormLabel>
                <FormControl>
                  <InputComplex
                    className='h-[2.75rem]'
                    inputValue={field.value}
                    onInputChange={value => {
                      field.onChange(value);
                      // Calculate deposit amount when receive amount changes
                      calculateDepositAmount(value);
                    }}
                    inputProps={{
                      placeholder: '0.00',
                      className:
                        'h-[2.75rem] outline-none !border-none !ring-transparent',
                    }}
                    iSuffix={
                      <div className='flex h-full items-center justify-end'>
                        {' '}
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

                <FormMessage />
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
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              'Deposit'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
