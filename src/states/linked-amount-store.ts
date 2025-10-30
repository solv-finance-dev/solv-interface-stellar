import React from 'react';
import { create } from 'zustand';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  computeDepositFromReceive,
  computeReceiveFromDeposit,
  sanitizeAmountInput,
  TOKEN_DECIMALS_FALLBACK,
  getFractionalLength,
} from '@/lib/amount-schema';
import { toast } from '@solvprotocol/ui-v2';
import { useLoadingDialogStore } from '@/states/loading-dialog-store';
import { useSuccessfulDialogStore } from '@/states/successful-dialog-store';
import BigNumber from 'bignumber.js';

type EditSide = 'deposit' | 'receive' | null;

type LinkedAmountParams = {
  depositDecimals: number;
  receiveDecimals: number;
  feeRatio: string; // string ratio from store, e.g., '0.003'
  nav?: number; // raw NAV with 8 decimals (unscaled)
};

type LinkedAmountState = {
  deposit: string;
  receive: string;
  lastEdited: EditSide;
  params: LinkedAmountParams;
  form: UseFormReturn<LinkedFormData> | null;
  setParams: (next: Partial<LinkedAmountParams>) => void;
  reset: () => void;
  setDeposit: (value: string) => void;
  setReceive: (value: string) => void;
  setForm: (form: UseFormReturn<LinkedFormData> | null) => void;
};

const defaultParams: LinkedAmountParams = {
  depositDecimals: TOKEN_DECIMALS_FALLBACK,
  receiveDecimals: TOKEN_DECIMALS_FALLBACK,
  feeRatio: '0',
  nav: undefined,
};

function createLinkedAmountStore(type: 'withdraw' | 'deposit') {
  return create<LinkedAmountState>((set, get) => ({
    deposit: '',
    receive: '',
    lastEdited: null,
    params: defaultParams,
    form: null,
    setParams: next => {
      const current = get();
      const merged: LinkedAmountParams = {
        ...current.params,
        ...next,
      } as LinkedAmountParams;
      // Re-sanitize and recompute according to lastEdited side
      const depositSanitized = sanitizeAmountInput(
        current.deposit,
        merged.depositDecimals
      );
      const receiveSanitized = sanitizeAmountInput(
        current.receive,
        merged.receiveDecimals
      );
      let newDeposit = depositSanitized;
      let newReceive = receiveSanitized;
      if (current.lastEdited === 'deposit') {
        newReceive = depositSanitized
          ? computeReceiveFromDeposit(
            depositSanitized,
            merged.feeRatio,
            merged.receiveDecimals,
            merged.nav ?? 0,
            type
          ) || ''
          : '';
      } else if (current.lastEdited === 'receive') {
        newDeposit = receiveSanitized
          ? computeDepositFromReceive(
            receiveSanitized,
            merged.feeRatio,
            merged.depositDecimals,
            merged.nav ?? 0,
            type
          ) || ''
          : '';
      }
      set({ params: merged, deposit: newDeposit, receive: newReceive });
    },
    reset: () => set({ deposit: '', receive: '', lastEdited: null }),
    setDeposit: value => {
      const { params } = get();
      console.log('deposit params', params);
      const sanitized = sanitizeAmountInput(value, params.depositDecimals);
      const receive = sanitized
        ? computeReceiveFromDeposit(
          sanitized,
          params.feeRatio,
          params.receiveDecimals,
          params.nav ?? 0,
          type
        ) || ''
        : '';
      set({ deposit: sanitized, receive, lastEdited: 'deposit' });
    },
    setReceive: value => {
      const { params } = get();
      const sanitized = sanitizeAmountInput(value, params.receiveDecimals);
      const deposit = sanitized
        ? computeDepositFromReceive(
          sanitized,
          params.feeRatio,
          params.depositDecimals,
          params.nav ?? 0,
          type
        ) || ''
        : '';
      set({ receive: sanitized, deposit, lastEdited: 'receive' });
    },
    setForm: form => set({ form }),
  }));
}

// Two independent stores for deposit/withdraw pages
export const useDepositLinkedAmountStore = createLinkedAmountStore('deposit');
export const useWithdrawLinkedAmountStore = createLinkedAmountStore('withdraw');

export type LinkedFormData = { deposit: string; receive: string };

// Deposit page schema builder (shared in store)
export const createDepositZodSchema = (params: {
  depositDecimals: number;
  receiveDecimals: number;
  maxDeposit: string;
  depositTokenName?: string;
  receiveTokenName?: string;
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
        { message: 'Deposit amount must be a valid number' }
      )
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          return parseFloat(val) > 0;
        },
        { message: 'Deposit amount must be greater than 0' }
      )
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          return (
            getFractionalLength(val) <=
            (params.depositDecimals ?? TOKEN_DECIMALS_FALLBACK)
          );
        },
        {
          message: `Exceeds maximum decimals (${params.depositDecimals ?? TOKEN_DECIMALS_FALLBACK})${params.depositTokenName ? ` for ${params.depositTokenName}` : ''}`,
        }
      )
      .refine(
        val => {
          if (!val || val.trim() === '' || params.maxDeposit == null)
            return true;
          const amount = parseFloat(val);
          const max = parseFloat(params.maxDeposit || '0');
          return amount <= max;
        },
        {
          message: `Deposit amount cannot exceed your balance of ${params.maxDeposit ?? '0'}${params.depositTokenName ? ` ${params.depositTokenName}` : ''}`,
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
          return (
            getFractionalLength(val) <=
            (params.receiveDecimals ?? TOKEN_DECIMALS_FALLBACK)
          );
        },
        {
          message: `Exceeds maximum decimals (${params.receiveDecimals ?? TOKEN_DECIMALS_FALLBACK})${params.receiveTokenName ? ` for ${params.receiveTokenName}` : ''}`,
        }
      ),
  });

// Withdraw page schema builder (copied logic)
export const createWithdrawZodSchema = (params: {
  withdrawDecimals: number;
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
          return (
            getFractionalLength(val) <=
            (params.withdrawDecimals ?? TOKEN_DECIMALS_FALLBACK)
          );
        },
        {
          message: `Exceeds maximum decimals (${params.withdrawDecimals ?? TOKEN_DECIMALS_FALLBACK}) for SolvBTC`,
        }
      )
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          return parseFloat(val) <= parseFloat(params.maxWithdrawable || '0');
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
          return (
            getFractionalLength(val) <=
            (params.receiveDecimals ?? TOKEN_DECIMALS_FALLBACK)
          );
        },
        {
          message: `Exceeds maximum decimals (${params.receiveDecimals ?? TOKEN_DECIMALS_FALLBACK})`,
        }
      ),
  });

// Initializer hooks: instantiate RHF and wire to store
export function useInitDepositForm(params: {
  depositDecimals: number;
  receiveDecimals: number;
  maxDeposit: string;
  depositTokenName?: string;
  receiveTokenName?: string;
  feeRatio: string;
  nav: number;
}) {
  const store = useDepositLinkedAmountStore();
  const schema = React.useMemo(
    () =>
      createDepositZodSchema({
        depositDecimals: params.depositDecimals,
        receiveDecimals: params.receiveDecimals,
        maxDeposit: params.maxDeposit,
        depositTokenName: params.depositTokenName,
        receiveTokenName: params.receiveTokenName,
      }),
    [
      params.depositDecimals,
      params.receiveDecimals,
      params.maxDeposit,
      params.depositTokenName,
      params.receiveTokenName,
    ]
  );
  const form = useForm<LinkedFormData>({
    resolver: zodResolver(schema),
    defaultValues: { deposit: store.deposit, receive: store.receive },
    mode: 'onChange',
  });
  React.useEffect(() => {
    // reset once on mount to avoid stale values when re-entering page
    store.reset();
  }, []);
  React.useEffect(() => {
    store.setForm(form);
    store.setParams({
      depositDecimals: params.depositDecimals,
      receiveDecimals: params.receiveDecimals,
      feeRatio: params.feeRatio,
      nav: params.nav,
    });
    return () => store.setForm(null);
  }, [
    form,
    params.depositDecimals,
    params.receiveDecimals,
    params.feeRatio,
    params.nav,
  ]);
  React.useEffect(() => {
    if (form.getValues('deposit') !== store.deposit) {
      form.setValue('deposit', store.deposit, { shouldValidate: true });
    }
    if (form.getValues('receive') !== store.receive) {
      form.setValue('receive', store.receive, { shouldValidate: true });
    }
  }, [store.deposit, store.receive]);
  React.useEffect(() => () => store.reset(), []);
  const setDeposit = React.useCallback(
    (v: string) => store.setDeposit(v),
    [store]
  );
  const setReceive = React.useCallback(
    (v: string) => store.setReceive(v),
    [store]
  );
  return {
    form,
    deposit: store.deposit,
    receive: store.receive,
    setDeposit,
    setReceive,
  };
}

export function useInitWithdrawForm(params: {
  withdrawDecimals: number;
  receiveDecimals: number;
  maxWithdrawable: string;
  feeRatio: string;
  nav: number;
}) {
  const store = useWithdrawLinkedAmountStore();
  const schema = React.useMemo(
    () =>
      createWithdrawZodSchema({
        withdrawDecimals: params.withdrawDecimals,
        receiveDecimals: params.receiveDecimals,
        maxWithdrawable: params.maxWithdrawable,
      }),
    [
      params.withdrawDecimals,
      params.receiveDecimals,
      params.maxWithdrawable,
      params.nav,
    ]
  );
  const form = useForm<LinkedFormData>({
    resolver: zodResolver(schema),
    defaultValues: { deposit: store.deposit, receive: store.receive },
    mode: 'onChange',
  });
  React.useEffect(() => {
    // reset once on mount to avoid stale values when re-entering page
    store.reset();
  }, []);
  React.useEffect(() => {
    store.setForm(form);
    store.setParams({
      depositDecimals: params.withdrawDecimals,
      receiveDecimals: params.receiveDecimals,
      feeRatio: params.feeRatio,
      nav: params.nav,
    });
    return () => store.setForm(null);
  }, [
    form,
    params.withdrawDecimals,
    params.receiveDecimals,
    params.feeRatio,
    params.nav,
  ]);
  React.useEffect(() => {
    if (form.getValues('deposit') !== store.deposit) {
      form.setValue('deposit', store.deposit, { shouldValidate: true });
    }
    if (form.getValues('receive') !== store.receive) {
      form.setValue('receive', store.receive, { shouldValidate: true });
    }
  }, [store.deposit, store.receive]);
  React.useEffect(() => () => store.reset(), []);
  const setDeposit = React.useCallback(
    (v: string) => store.setDeposit(v),
    [store]
  );
  const setReceive = React.useCallback(
    (v: string) => store.setReceive(v),
    [store]
  );
  return {
    form,
    deposit: store.deposit,
    receive: store.receive,
    setDeposit,
    setReceive,
  };
}

export const computeFormValid = ({
  form,
  connected,
  publicKey,
  isSubmitting,
}: {
  form: UseFormReturn<LinkedFormData>;
  connected: boolean;
  publicKey: string;
  isSubmitting: boolean;
}) => {
  const depositValue = form.getValues('deposit');
  const receiveValue = form.getValues('receive');
  const hasValues =
    (depositValue && depositValue.trim() !== '') ||
    (receiveValue && receiveValue.trim() !== '');
  const isWalletConnected = connected && publicKey;
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

export const setMax = ({
  balance,
  decimals,
  onSetMax,
}: {
  balance: string;
  decimals: number;
  onSetMax: (value: string) => void;
}) => {
  if (balance && parseFloat(balance) > 0) {
    const formatted = balance;
    const sanitized = sanitizeAmountInput(formatted, decimals);
    onSetMax(sanitized);
  }
};

export const computeDepositError = ({
  connected,
  form,
  balance,
}: {
  connected: boolean;
  form: UseFormReturn<LinkedFormData>;
  balance: string;
}) =>
  !!connected &&
  !!form.getValues('deposit') &&
  parseFloat(form.getValues('deposit') || '0') > parseFloat(balance || '0');

export const handleSubmit = async ({
  loadingDialogTitle,
  loadingDialogDescription,
  successfulDialogTitle,
  successfulDialogDescription,
  beforeSubmitting,
  afterSubmitting,
  sendTx,
  toastNode,
}: {
  loadingDialogTitle: string;
  loadingDialogDescription: string;
  successfulDialogTitle: string;
  successfulDialogDescription: string;
  toastNode: (error: Error) => React.ReactNode;
  beforeSubmitting: () => void;
  afterSubmitting: () => void;
  sendTx: () => Promise<string>;
}) => {
  beforeSubmitting();
  useLoadingDialogStore.getState().openLoadingDialog({
    title: loadingDialogTitle,
    description: loadingDialogDescription,
    showCloseButton: false,
  });
  try {
    const signature = await sendTx();
    useSuccessfulDialogStore.getState().openSuccessfulDialog({
      title: successfulDialogTitle,
      description: successfulDialogDescription,
      confirmText: 'Confirm',
      showConfirm: true,
      showCancel: false,
      scanUrl: `${process.env.NEXT_PUBLIC_EXPLORER_TX_URL}${signature}?cluster=${process.env.NEXT_PUBLIC_SOLANA_CLUSTER}`,
    });
  } catch (error) {
    toast(toastNode(error as Error));
    console.error('Transaction failed:', error);
    throw error;
  } finally {
    useLoadingDialogStore.getState().closeLoadingDialog();
    afterSubmitting();
  }
};

export const flooredReceive = (number: string, decimals: number) => {
  const scaled = new BigNumber(number || '0')
    .multipliedBy(new BigNumber(10).pow(decimals))
    .integerValue(BigNumber.ROUND_DOWN);
  const flooredToHundreds = scaled.dividedToIntegerBy(100).multipliedBy(100);
  return new BigNumber(flooredToHundreds.toFixed(0));
};
