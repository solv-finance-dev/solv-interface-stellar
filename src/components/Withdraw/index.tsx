'use client';

import React, { useEffect, useState } from 'react';
//
import { toast } from '@solvprotocol/ui-v2';
// Removed token selector for withdraw; right side is fixed to SolvBTC
//
import { useSolvBTCVaultClient, useWalletStore } from '@/states';
import { useContractStore } from '@/states/contract-store';
import { TxResult } from '@/components';
import {
    scaleAmountToBigInt,
    TOKEN_DECIMALS_FALLBACK,
} from '@/lib/utils';
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
import WithdrawFormUI from '@/components/WithdrawFormUI';
import {
    useInitWithdrawForm,
    computeFormValid,
    setMax as setMaxHelper,
    computeDepositError as computeDepositErrorHelper,
} from '@/states/linked-amount-store';

// removed legacy zod schema after migrating to linked-amount-store

export default function Withdraw() {
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
    const { form, setDeposit, setReceive } = useInitWithdrawForm({
        withdrawDecimals: shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK,
        receiveDecimals: shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK,
        maxWithdrawable: formatTokenBalance(
            shareBalance.balance,
            shareBalance.decimals
        ),
        feeRatio: withdrawFeeRate,
        nav: 100000000,
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
            } catch { }
        };
        loadShareDecimals();
    }, [solvBTCClient]);

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

    useEffect(() => {
        form.setValue('deposit', form.getValues('deposit'), {
            shouldValidate: true,
        });
        form.setValue('receive', form.getValues('receive'), {
            shouldValidate: true,
        });
    }, [shareBalance.balance, shareTokenDecimals]);

    const handleSetMax = () =>
        setMaxHelper({
            balance: formatTokenBalance(shareBalance.balance, shareBalance.decimals),
            decimals: shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK,
            onSetMax: setDeposit,
        });

    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(data: { deposit: string; receive: string }) {
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
                shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK
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

    function ExchangeRateValue() {
        return null;
    }

    return (
        <WithdrawFormUI
            form={form as any}
            isConnected={!!isConnected}
            isSubmitting={isSubmitting}
            balanceDisplay={formatTokenBalance(shareBalance.balance, shareBalance.decimals)}
            isLoadingBalance={isLoadingBalance}
            onRefreshBalance={fetchShareBalance}
            onSetMax={handleSetMax}
            leftDecimals={shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK}
            rightDecimals={shareTokenDecimals ?? TOKEN_DECIMALS_FALLBACK}
            shareTokenName={vaultEntry?.shareTokenClient?.name || 'SolvBTC'}
            exchangeRateDisplay={''}
            isWithdrawError={computeDepositErrorHelper({
                connected: !!isConnected,
                form: form as any,
                balance: formatTokenBalance(shareBalance.balance, shareBalance.decimals),
            })}
            onChangeDeposit={setDeposit}
            onChangeReceive={setReceive}
            submitDisabled={!computeFormValid({
                form: form as any,
                connected: !!isConnected,
                publicKey: connectedWallet?.publicKey || '',
                isSubmitting,
            })}
            submitLabel={
                computeDepositErrorHelper({
                    connected: !!isConnected,
                    form: form as any,
                    balance: formatTokenBalance(shareBalance.balance, shareBalance.decimals),
                })
                    ? 'Insufficient balance'
                    : 'Withdraw'
            }
            onSubmit={onSubmit as any}
        />
    );
}
