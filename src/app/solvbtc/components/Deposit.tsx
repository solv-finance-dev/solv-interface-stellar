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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  toast,
  Skeleton,
} from '@solvprotocol/ui-v2';
import { ArrowRight, RotateCcw, Loader2 } from 'lucide-react';
import { InputComplex } from '@/components/InputComplex';
import { TooltipComplex } from '@/components/TooltipComplex';
import { TokenIcon } from '@/components/TokenIcon';
import { TxResult } from '@/components';
import {
  TOKEN_DECIMALS_FALLBACK,
  sanitizeAmountInput,
  computeReceiveFromDeposit,
  computeDepositFromReceive,
  scaleAmountToBigInt,
  createLinkedAmountSchema,
} from '@/app/solvbtc/utils';
import { useSolvBTCVaultClient, useWalletStore } from '@/states';
import {
  useContractStore,
  updateAllClientsSignTransaction,
} from '@/states/contract-store';
import { Client as ContractClient } from '@stellar/stellar-sdk/contract';
import {
  formatTokenBalance,
  type TokenBalanceResult,
} from '@/lib/token-balance';
import { TOKEN_FEE_RATE_DECIMAL } from '@/contracts/solvBTCTokenContract/src';
import { buildExplorerTxUrl, getTxHashFromSent } from '@/lib/stellar-tx';
import { useLoadingDialog } from '@/hooks/useLoadingDialog';
import { useSuccessfulDialog } from '@/hooks/useSuccessfulDialog';
import { getCurrentStellarNetwork } from '@/config/stellar';
import { SolvBTCTokenClient } from '@/contracts/solvBTCTokenContract/src';
import { getStellarAPI } from '@/stellar';

// Using shared utils for sanitization/formatting and calculations

type SupportedToken = {
  name: string;
  address: string;
  decimals: number;
  icon?: string;
};

export default function Deposit() {
  const solvBTCClient = useSolvBTCVaultClient();
  const { isConnected, connectedWallet } = useWalletStore();
  const vaultEntry = useContractStore(state =>
    state.vaults.get('solvBTCVault')
  );
  const { openLoadingDialog, closeLoadingDialog } = useLoadingDialog();
  const { openSuccessfulDialog } = useSuccessfulDialog();

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
  const [supportedTokens, setSupportedTokens] = useState<SupportedToken[]>([]);
  const [selected, setSelected] = useState<SupportedToken | null>(null);
  const [shareTokenDecimals, setShareTokenDecimals] = useState<number>(
    TOKEN_DECIMALS_FALLBACK
  );
  const [shareTokenName, setShareTokenName] = useState<string>('SolvBTC');

  // Allowance state
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));
  const [isLoadingAllowance, setIsLoadingAllowance] = useState(false);
  const [allowanceError, setAllowanceError] = useState<string | null>(null);
  // Create form validation schema as a function to access current state
  const createFormSchema = () =>
    createLinkedAmountSchema({
      depositDecimals: selected?.decimals ?? TOKEN_DECIMALS_FALLBACK,
      receiveDecimals: shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK,
      maxDeposit: formatTokenBalance(
        tokenBalance.balance,
        tokenBalance.decimals
      ),
      depositTokenName: selected?.name || 'Token',
      receiveTokenName: 'SolvBTC',
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
      // Sanitize existing values according to new decimals and re-calc
      const currentDeposit = form.getValues('deposit');
      const newDeposit = sanitizeAmountInput(
        currentDeposit,
        token?.decimals ?? TOKEN_DECIMALS_FALLBACK
      );
      form.setValue('deposit', newDeposit, { shouldValidate: true });
      calculateReceiveAmount(newDeposit);

      const currentReceive = form.getValues('receive');
      const receiveDecimals = shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK;
      const newReceive = sanitizeAmountInput(currentReceive, receiveDecimals);
      form.setValue('receive', newReceive, { shouldValidate: true });
      calculateDepositAmount(newReceive);
      // Balance will be refreshed by the selected-address effect
    }
  };
  // Load supported tokens from vault contract store
  useEffect(() => {
    const load = async () => {
      const rpcUrl = process.env.NEXT_PUBLIC_STELLAR_RPC_URL!;
      if (!vaultEntry || !rpcUrl) return;
      const entries = Array.from(vaultEntry.supportedTokenClients.values());
      const list: SupportedToken[] = entries.map(e => ({
        name: e.name || e.id,
        address: e.id,
        decimals: e.decimal ?? TOKEN_DECIMALS_FALLBACK,
        icon: undefined,
      }));
      setSupportedTokens(list);
      if (!selected && list.length > 0) setSelected(list[0]);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultEntry]);

  // Load shares token metadata for receive side from vault store (no extra RPC)
  useEffect(() => {
    const st = vaultEntry?.shareTokenClient;
    if (st) {
      setShareTokenDecimals(st.decimal ?? TOKEN_DECIMALS_FALLBACK);
      setShareTokenName(st.name || 'SolvBTC');
    }
  }, [
    vaultEntry?.shareTokenClient?.id,
    vaultEntry?.shareTokenClient?.decimal,
    vaultEntry?.shareTokenClient?.name,
  ]);
  // Function to fetch token balance for currently selected token using its client
  const fetchTokenBalance = async (tokenAddress?: string) => {
    if (!connectedWallet?.publicKey) {
      setTokenBalance({
        balance: '0',
        decimals: 0,
        error: 'Wallet not connected',
      });
      return;
    }
    const currentAddress = tokenAddress || selected?.address;
    if (!currentAddress || !vaultEntry) {
      setTokenBalance({ balance: '0', decimals: 0 });
      return;
    }

    setIsLoadingBalance(true);
    try {
      const tokenEntry = vaultEntry.supportedTokenClients.get(currentAddress);
      if (!tokenEntry) {
        setTokenBalance({
          balance: '0',
          decimals: 0,
          error: 'Token client not found',
        });
        return;
      }
      const decimals = tokenEntry.decimal ?? TOKEN_DECIMALS_FALLBACK;
      const balanceTx = await tokenEntry.client.balance({
        account: connectedWallet.publicKey,
      });
      const raw = Number(balanceTx.result || 0);
      const value = raw / Math.pow(10, decimals);
      const formatted = value.toFixed(decimals).replace(/\.?0+$/, '');
      // Only update if selection hasn't changed during async fetch
      if (selected?.address === currentAddress) {
        setTokenBalance({ balance: formatted, decimals });
      }
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

  // Parse i128-like value into bigint safely
  const parseI128ToBigInt = (v: any): bigint => {
    try {
      if (typeof v === 'bigint') return v;
      if (typeof v === 'number') return BigInt(Math.trunc(v));
      if (typeof v === 'string') return BigInt(v);
      if (v && typeof v.toString === 'function') return BigInt(v.toString());
    } catch (_) {
      // ignore
    }
    return BigInt(0);
  };

  // Fetch allowance for the selected token against the vault
  const fetchAllowance = async (tokenAddress?: string) => {
    if (!connectedWallet?.publicKey) return;
    const currentToken = tokenAddress || selected?.address;
    if (!currentToken || !vaultEntry) return;

    setIsLoadingAllowance(true);
    setAllowanceError(null);
    try {
      const tokenEntry = vaultEntry.supportedTokenClients.get(currentToken);
      if (!tokenEntry) throw new Error('Token client not found');

      const allowanceTx = await tokenEntry.client.allowance({
        owner: connectedWallet.publicKey,
        spender: vaultEntry.id,
      });
      const result = parseI128ToBigInt(allowanceTx.result);
      if (selected?.address === currentToken) {
        setAllowance(result);
      }
    } catch (error) {
      setAllowance(BigInt(0));
      setAllowanceError(
        error instanceof Error ? error.message : 'Unknown error'
      );
    } finally {
      setIsLoadingAllowance(false);
    }
  };

  // Determine if current allowance covers the input deposit amount
  const requiresApproval = (): boolean => {
    const depositStr = form.getValues('deposit');
    if (!isConnected || !selected || !depositStr) return false;
    const amt = parseFloat(depositStr);
    if (isNaN(amt) || amt <= 0) return false;
    try {
      const needed = scaleAmountToBigInt(
        depositStr,
        selected?.decimals ?? TOKEN_DECIMALS_FALLBACK
      );
      return allowance < needed;
    } catch {
      return true;
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
        Number(feeRateValue) / TOKEN_FEE_RATE_DECIMAL
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
      fetchAllowance();

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

  // Re-fetch balance when selected token changes
  useEffect(() => {
    if (isConnected && connectedWallet?.publicKey && selected?.address) {
      fetchTokenBalance(selected.address);
      fetchAllowance(selected.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.address]);

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
  }, [tokenBalance.balance, selected?.name, form]);

  // Set maximum amount
  const handleSetMax = () => {
    if (tokenBalance.balance && parseFloat(tokenBalance.balance) > 0) {
      const formatted = formatTokenBalance(
        tokenBalance.balance,
        tokenBalance.decimals
      );
      const sanitized = sanitizeAmountInput(
        formatted,
        selected?.decimals ?? TOKEN_DECIMALS_FALLBACK
      );
      form.setValue('deposit', sanitized);
      calculateReceiveAmount(sanitized);
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

    const receiveDecimals = shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK;
    const formattedReceiveAmount = computeReceiveFromDeposit(
      depositAmount,
      depositFeeRate,
      receiveDecimals
    );
    form.setValue('receive', formattedReceiveAmount || '');
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

    const depositDecimals = selected?.decimals ?? TOKEN_DECIMALS_FALLBACK;
    const formattedDepositAmount = computeDepositFromReceive(
      receiveAmount,
      depositFeeRate,
      depositDecimals
    );
    form.setValue('deposit', formattedDepositAmount || '');
    form.trigger('deposit');
  };

  // Add transaction loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure a contract client has a signer attached (for token approve)
  const ensureClientSigner = async (client: SolvBTCTokenClient) => {
    const anyClient = client as unknown as {
      options?: { signTransaction?: any; publicKey?: string };
    };
    if (anyClient?.options?.signTransaction) return;
    const { walletAdapter } = useWalletStore.getState();
    if (!walletAdapter || !connectedWallet) {
      throw new Error(
        'Wallet not properly connected - no signTransaction available'
      );
    }
    anyClient.options = anyClient.options || {};
    anyClient.options.signTransaction = async (txXdr: string) => {
      const sdk = await import('@stellar/stellar-sdk');
      const parsed = sdk.TransactionBuilder.fromXDR(
        txXdr,
        getCurrentStellarNetwork()
      );
      const inner =
        parsed instanceof sdk.FeeBumpTransaction
          ? parsed.innerTransaction
          : parsed;
      const signedTxXdr = await walletAdapter.signTransaction(inner, {
        networkPassphrase: getCurrentStellarNetwork(),
        accountToSign: connectedWallet.publicKey,
      });
      return { signedTxXdr, signerAddress: connectedWallet.publicKey };
    };
    anyClient.options.publicKey = connectedWallet.publicKey;
  };

  // Approve flow
  const handleApprove = async () => {
    if (!selected || !vaultEntry || !connectedWallet?.publicKey) return;
    try {
      const tokenEntry = vaultEntry.supportedTokenClients.get(selected.address);
      if (!tokenEntry) throw new Error('Token client not found');

      const tokenClient = tokenEntry.client;

      await ensureClientSigner(tokenClient);

      const I128_MAX = (BigInt(1) << BigInt(127)) - BigInt(1);

      // compute live_until_ledger based on current network ledger
      const stellarAPI = getStellarAPI();
      const currentLedger = await stellarAPI.getLatestLedgerSequence();
      const liveUntil = currentLedger + 100000;

      const approveTx = await tokenClient.approve({
        owner: connectedWallet.publicKey,
        spender: vaultEntry.id,
        amount: I128_MAX,
        live_until_ledger: liveUntil,
      });

      openLoadingDialog({
        title: 'Approve',
        description: `Approving ${selected.name} for Vault...`,
        showCloseButton: false,
      });

      const signed = await approveTx.signAndSend();
      const txHash = getTxHashFromSent(signed);
      closeLoadingDialog();

      const scanUrl = buildExplorerTxUrl(txHash);
      openSuccessfulDialog({
        title: 'Approve',
        description: `Approve successful for ${selected.name}.`,
        confirmText: 'Confirm',
        showConfirm: true,
        showCancel: false,
        scanUrl,
      });

      // Refresh allowance after approval
      await fetchAllowance(selected.address);
    } catch (error) {
      closeLoadingDialog();
      console.error('Approve transaction failed:', error);
      toast(
        <TxResult
          type='error'
          title='Approve Failed'
          message={error instanceof Error ? error.message : 'Please try again.'}
        />
      );
    }
  };

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

    // Must have a selected token
    const hasSelected = !!selected;

    // Amount must be greater than 0
    const positiveAmount = parseFloat(depositValue || receiveValue || '0') > 0;

    return (
      hasValues &&
      isWalletConnected &&
      hasNoErrors &&
      notSubmitting &&
      positiveAmount &&
      hasSelected
    );
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

    if (!selected) {
      toast(
        <TxResult
          type='error'
          title='Error'
          message='No supported token available'
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

    // If allowance is not enough, do Approve instead of Deposit
    if (requiresApproval()) {
      setIsSubmitting(true);
      try {
        await handleApprove();
      } finally {
        setIsSubmitting(false);
      }
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
      const depositDecimals = selected?.decimals ?? TOKEN_DECIMALS_FALLBACK;
      const depositAmountBigInt = scaleAmountToBigInt(
        depositAmount,
        depositDecimals
      );

      // 直接使用已经配置好签名器的 client
      const depositTx = await currentClient.deposit({
        currency: selected?.address || '',
        from: connectedWallet.publicKey,
        amount: depositAmountBigInt,
      });

      // 打开 Loading 弹窗
      openLoadingDialog({
        title: 'Deposit',
        description: `Depositing ${depositAmount} ${selected?.name}...`,
        showCloseButton: false,
      });

      // 直接调用 signAndSend，签名器已经在钱包连接时配置好了
      const signedTx = await depositTx.signAndSend();

      // Extract transaction hash from SentTransaction
      const txHash = getTxHashFromSent(signedTx);
      closeLoadingDialog();

      // 成功弹窗
      const scanUrl = buildExplorerTxUrl(txHash);
      openSuccessfulDialog({
        title: 'Deposit',
        description: `Successfully deposited ${depositAmount} ${selected.name}.`,
        confirmText: 'OK',
        showConfirm: true,
        showCancel: false,
        scanUrl,
      });

      // Reset form after successful submission
      form.reset();

      // Refresh balance and allowance after successful deposit
      if (isConnected && connectedWallet?.publicKey) {
        fetchTokenBalance();
        fetchAllowance();
      }
    } catch (error) {
      // 关闭 Loading 弹窗
      closeLoadingDialog();
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
      {/* Top-right exchange rate pill */}
      <div className='absolute right-4 top-6 mb-3 flex w-full justify-end'>
        <div className='flex items-center gap-2 rounded-md px-3 py-1 text-[.875rem]'>
          <span className='text-grayColor'>Exchange Rate</span>
          <span className='text-textColor'>
            {isLoadingFeeRate ? (
              <Skeleton className='h-4 w-[200px]' />
            ) : !selected || feeRateError ? (
              '—'
            ) : (
              (() => {
                const receive = computeReceiveFromDeposit(
                  '1',
                  depositFeeRate,
                  shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK
                );
                return `1.00 ${selected?.name} = ${receive ? parseFloat(receive).toFixed(4) : '—'} ${shareTokenName}`;
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
                  <span className='text-textColor'>You Will Deposit</span>
                  <div className='flex items-center gap-2 text-[.875rem]'>
                    <span className='text-textColor-tertiary'>Balance:</span>
                    <div className='text-textColor'>
                      {isLoadingBalance ? (
                        <span className='animate-pulse'>Loading...</span>
                      ) : (
                        <span>
                          {formatTokenBalance(
                            tokenBalance.balance,
                            tokenBalance.decimals
                          )}
                        </span>
                      )}
                    </div>
                    <button
                      type='button'
                      onClick={() => fetchTokenBalance()}
                      disabled={isLoadingBalance || !isConnected}
                      className='rounded p-1 hover:bg-gray-100 disabled:opacity-50'
                      title='Refresh balance'
                    >
                      <RotateCcw
                        className={`text-textColor-tertiary h-3 w-3 ${isLoadingBalance ? 'animate-spin' : ''}`}
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
                          parseFloat(tokenBalance.balance || '0')
                      }
                      inputValue={field.value}
                      onInputChange={value => {
                        const sanitized = sanitizeAmountInput(
                          value,
                          selected?.decimals ?? TOKEN_DECIMALS_FALLBACK
                        );
                        field.onChange(sanitized);
                        // Calculate receive amount when deposit amount changes
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
                              parseFloat(tokenBalance.balance) <= 0
                            }
                            className='flex h-[1.5rem] w-[2.875rem] cursor-pointer items-center justify-center rounded-[4px] bg-brand-50 px-2 text-[.75rem] text-brand-500 hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50'
                          >
                            MAX
                          </button>

                          <Select
                            value={selected?.name}
                            onValueChange={onTokenSelected}
                          >
                            <SelectTrigger className='border-0 !bg-transparent !pl-2 !pr-0 outline-none focus-visible:ring-0'>
                              <div className='flex items-center justify-between text-[1rem]'>
                                <TokenIcon
                                  src={selected?.icon}
                                  alt={selected?.name}
                                  fallback={selected?.name}
                                />

                                {selected?.name}
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
                    <TooltipComplex content={'tips'}></TooltipComplex>
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
                          {depositFeeRate}%
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
                        parseFloat(tokenBalance.balance || '0')
                    }
                    inputValue={field.value}
                    onInputChange={value => {
                      const receiveDecimals =
                        supportedTokens.find(t => t.name === 'SolvBTC')
                          ?.decimals ??
                        selected?.decimals ??
                        TOKEN_DECIMALS_FALLBACK;
                      const sanitized = sanitizeAmountInput(
                        value,
                        receiveDecimals
                      );
                      field.onChange(sanitized);
                      // Calculate deposit amount when receive amount changes
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
                            alt={shareTokenName}
                            fallback={shareTokenName}
                          />
                          {shareTokenName}
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
            className='w-full rounded-full bg-brand-500 text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-gray-300 md:w-[25.625rem]'
          >
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : !!isConnected &&
              !!form.getValues('deposit') &&
              parseFloat(form.getValues('deposit') || '0') >
                parseFloat(tokenBalance.balance || '0') ? (
              'Insufficient balance'
            ) : requiresApproval() ? (
              'Approve'
            ) : (
              'Deposit'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
