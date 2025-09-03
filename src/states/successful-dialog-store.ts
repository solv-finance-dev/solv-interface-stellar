import { create } from 'zustand';
import { ReactNode } from 'react';

type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

interface DialogOptions {
  title?: string;
  description?: string;
  size?: DialogSize;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  showCancel?: boolean;
  showConfirm?: boolean;
  disableConfirm?: boolean;
  loading?: boolean;
  showCloseButton?: boolean;
  chainId?: string;
  scanUrl?: string;
}

interface SuccessfulDialogStore {
  isOpen: boolean;
  options: DialogOptions;
  openSuccessfulDialog: (options: DialogOptions) => void;
  closeSuccessfulDialog: () => void;
  setSuccessfulDialogLoading: (loading: boolean) => void;
  setSuccessfulDialogDisabled: (disabled: boolean) => void;
}

const DEFAULT_OPTIONS: DialogOptions = {
  showCancel: false,
  showConfirm: true,
  disableConfirm: false,
  loading: false,
  showCloseButton: true,
};

export const useSuccessfulDialogStore = create<SuccessfulDialogStore>(set => ({
  isOpen: false,
  options: DEFAULT_OPTIONS,

  openSuccessfulDialog: options =>
    set({
      isOpen: true,
      options: { ...DEFAULT_OPTIONS, ...options },
    }),

  closeSuccessfulDialog: () => set({ isOpen: false }),

  setSuccessfulDialogLoading: loading =>
    set(state => ({
      options: { ...state.options, loading },
    })),

  setSuccessfulDialogDisabled: disableConfirm =>
    set(state => ({
      options: { ...state.options, disableConfirm },
    })),
}));
