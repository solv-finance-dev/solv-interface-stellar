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
  disableConfirm?: boolean;
  loading?: boolean;
};

type DialogStore = {
  isOpen: boolean;
  options: DialogOptions;
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
  setDialogLoading: (loading: boolean) => void;
  setDialogDisabled: (disabled: boolean) => void;
};

export const useDialogStore = create<DialogStore>(set => ({
  isOpen: false,
  options: {},
  openDialog: options => set({ isOpen: true, options }),
  closeDialog: () => set({ isOpen: false }),
  setDialogLoading: loading =>
    set(state => ({ options: { ...state.options, loading } })),
  setDialogDisabled: disableConfirm =>
    set(state => ({ options: { ...state.options, disableConfirm } })),
}));
