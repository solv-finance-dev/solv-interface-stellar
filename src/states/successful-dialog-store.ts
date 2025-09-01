import { create } from 'zustand';

type DialogOptions = {
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  content?: React.ReactNode;
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
};

type SuccessfulDialogStore = {
  isOpen: boolean;
  options: DialogOptions;
  openSuccessfulDialog: (options: DialogOptions) => void;
  closeSuccessfulDialog: () => void;
  setSuccessfulDialogLoading: (loading: boolean) => void;
  setSuccessfulDialogDisabled: (disabled: boolean) => void;
};

export const useSuccessfulDialogStore = create<SuccessfulDialogStore>(set => ({
  isOpen: false,
  options: {},
  openSuccessfulDialog: options => set({ isOpen: true, options }),
  closeSuccessfulDialog: () => set({ isOpen: false }),
  setSuccessfulDialogLoading: loading =>
    set(state => ({ options: { ...state.options, loading } })),
  setSuccessfulDialogDisabled: disableConfirm =>
    set(state => ({ options: { ...state.options, disableConfirm } })),
}));
