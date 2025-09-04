import { create } from 'zustand';
import type { ReactNode } from 'react';

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
}

interface DialogStore {
  isOpen: boolean;
  options: DialogOptions;
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
  setDialogLoading: (loading: boolean) => void;
  setDialogDisabled: (disabled: boolean) => void;
  updateDialogOptions: (options: Partial<DialogOptions>) => void;
}

const DEFAULT_OPTIONS: DialogOptions = {
  showCancel: false,
  showConfirm: true,
  disableConfirm: false,
  loading: false,
  showCloseButton: true,
  size: 'md',
};

export const useDialogStore = create<DialogStore>(set => ({
  isOpen: false,
  options: DEFAULT_OPTIONS,

  openDialog: options =>
    set({
      isOpen: true,
      options: { ...DEFAULT_OPTIONS, ...options },
    }),

  closeDialog: () => set({ isOpen: false }),

  setDialogLoading: loading =>
    set(state => ({
      options: { ...state.options, loading },
    })),

  setDialogDisabled: disableConfirm =>
    set(state => ({
      options: { ...state.options, disableConfirm },
    })),

  updateDialogOptions: options =>
    set(state => ({
      options: { ...state.options, ...options },
    })),
}));
