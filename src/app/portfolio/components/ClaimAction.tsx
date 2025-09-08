'use client';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Button, toast } from '@solvprotocol/ui-v2';
import { ClaimIcon } from '@/assets/svg/svg';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { RedemptionState } from './RedemptionTable';
import { getApolloClient } from '@/graphql/clientsFactory';
import {
  QUERY_NON_EVM_REDEMPTION_SIG,
  type NonEvmRedemptionSigResponse,
} from '@/graphql/queries/solvbtc';
import { useLoadingDialog } from '@/hooks/useLoadingDialog';
import { useSuccessfulDialog } from '@/hooks/useSuccessfulDialog';
import { useSolvBTCVaultClient, useWalletStore } from '@/states';
import { Client as ContractClient } from '@stellar/stellar-sdk/contract';
import {
  updateAllClientsSignTransaction,
  useContractStore,
} from '@/states/contract-store';
import { buildExplorerTxUrl, getTxHashFromSent } from '@/lib/stellar-tx';
import TxResult from '@/components/TxResult';
import { Buffer } from 'buffer';
import {
  SignatureType,
  SolvBTCVaultClient,
} from '@/contracts/solvBTCVaultContract/src';
dayjs.extend(duration);

interface ClaimActionProps {
  availableTime?: string;
  redemptionState?: string;
  // Required for claim transaction
  redemptionId?: string;
  withdrawRequestHash?: string; // hex string from backend list
  share?: string; // shares amount (string)
  navNumber?: number;
}

function formatCountdown(remainingMs: number): string {
  if (remainingMs <= 0) return '';
  const d = dayjs.duration(remainingMs);
  const days = Math.floor(d.asDays());
  const hours = d.hours();
  const minutes = d.minutes();
  const seconds = d.seconds();
  const dd = days > 0 ? `${days}d ` : '';
  return `${dd}${hours}h ${minutes}m ${seconds}s`;
}

export default function ClaimAction({
  availableTime,
  redemptionState,
  redemptionId,
  withdrawRequestHash,
  share,
  navNumber,
}: ClaimActionProps) {
  const target = useMemo(
    () => (availableTime ? dayjs(availableTime) : null),
    [availableTime]
  );
  const [remaining, setRemaining] = useState<number>(0);
  const { openLoadingDialog, closeLoadingDialog } = useLoadingDialog();
  const { openSuccessfulDialog } = useSuccessfulDialog();
  const { isConnected, connectedWallet, walletAdapter } = useWalletStore();
  const solvBTCClient = useSolvBTCVaultClient();

  useEffect(() => {
    if (!target) {
      setRemaining(0);
      return;
    }
    const update = () => {
      const diff = target.diff(dayjs());
      setRemaining(Math.max(0, diff));
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const disabled = remaining > 0 || redemptionState !== RedemptionState.Signed;
  const countdownText = formatCountdown(remaining);

  const handleClaim = useCallback(async () => {
    try {
      if (!isConnected || !connectedWallet) {
        toast(
          <TxResult
            type='error'
            title='Wallet Not Connected'
            message='Please connect your wallet to claim.'
          />
        );
        return;
      }
      if (!redemptionId || !withdrawRequestHash || !share) {
        toast(
          <TxResult
            type='error'
            title='Missing Data'
            message='Claim data incomplete. Please refresh and try again.'
          />
        );
        return;
      }

      // 1) Fetch signature
      openLoadingDialog({
        title: 'Claim',
        description: 'Fetching claim signature and submitting transaction...',
        showCloseButton: false,
      });

      const client = getApolloClient();
      const { data } = await client.query<NonEvmRedemptionSigResponse>({
        query: QUERY_NON_EVM_REDEMPTION_SIG,
        variables: { redemptionId },
        fetchPolicy: 'network-only',
      });
      const sig = data?.nonEvmRedemptionSig?.signature || '';
      const recoveryId = data?.nonEvmRedemptionSig?.recoveryId || 0;
      if (!sig) {
        closeLoadingDialog();
        toast(
          <TxResult
            type='error'
            title='No Signature Returned'
            message='Signature fetch failed. Please try again later.'
          />
        );
        return;
      }

      // 2) Send claim transaction using contract client
      const currentClient =
        solvBTCClient ||
        useContractStore.getState().getClient('SolvBTCVaultClient');
      if (!currentClient) {
        throw new Error('SolvBTC client not available');
      }

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
      if (!clientOptions?.signTransaction && walletAdapter && connectedWallet) {
        await updateAllClientsSignTransaction(walletAdapter, connectedWallet);
      }

      // Prepare args for withdraw
      const sharesBigInt = BigInt(share);
      const request_hash = Buffer.from(withdrawRequestHash, 'hex');
      const signatureBuf = Buffer.from(sig, 'hex');

      // For now, use nav=0 since not provided by API; backend verification covers signature correctness against current nav
      const nav = BigInt(navNumber || 0);

      const tx = await (currentClient as SolvBTCVaultClient).withdraw({
        from: connectedWallet.publicKey,
        shares: sharesBigInt,
        signature: signatureBuf,
        request_hash,
        nav,
        signature_type: SignatureType.Secp256k1,
        recovery_id: recoveryId,
      });

      console.log('sharesBigInt', sharesBigInt);
      console.log('request_hash', request_hash.toString('hex'));
      console.log('signatureBuf', signatureBuf.toString('hex'));
      console.log('nav', nav);
      console.log('signature_type', SignatureType.Secp256k1);
      console.log('recovery_id', recoveryId);

      const sent = await tx.signAndSend();
      const txHash = getTxHashFromSent(sent);
      closeLoadingDialog();

      const scanUrl = buildExplorerTxUrl(txHash);
      openSuccessfulDialog({
        title: 'Claim',
        description: 'Your claim has been submitted successfully.',
        showConfirm: true,
        showCancel: false,
        scanUrl,
      });
    } catch (error: any) {
      closeLoadingDialog();
      toast(
        <TxResult
          type='error'
          title='Claim Failed'
          message={error?.message || 'Transaction failed. Please try again.'}
        />
      );
    }
  }, [
    isConnected,
    connectedWallet,
    walletAdapter,
    redemptionId,
    withdrawRequestHash,
    share,
    solvBTCClient,
    openLoadingDialog,
    closeLoadingDialog,
    openSuccessfulDialog,
  ]);

  return (
    <div className='flex flex-col items-end'>
      <Button
        variant='default'
        size='sm'
        className='w-full rounded-full bg-brand text-white hover:bg-brand-600 disabled:opacity-60 md:w-[6.4375rem]'
        onClick={handleClaim}
        disabled={disabled}
      >
        <ClaimIcon className='h-4 w-4' /> Claim
      </Button>
      {disabled && countdownText && (
        <div className='text-xs text-brand-500'>{countdownText}</div>
      )}
    </div>
  );
}
