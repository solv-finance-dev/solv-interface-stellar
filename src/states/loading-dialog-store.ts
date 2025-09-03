import { ReactNode } from 'react';
import { create } from 'zustand';

type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface LoadingDialogOptions {
  title?: string;
  description?: string | ReactNode;
  size?: DialogSize;
  showCloseButton?: boolean;
  className?: string;
  chainId?: string;
  scanUrl?: string;
}

interface LoadingDialogState extends LoadingDialogOptions {
  isOpen: boolean;
  openLoadingDialog: (options?: LoadingDialogOptions) => void;
  closeLoadingDialog: () => void;
}

const DEFAULT_OPTIONS: Required<Omit<LoadingDialogOptions, 'description'>> = {
  title: 'Loading',
  size: 'md',
  showCloseButton: false,
  className: '',
  chainId: '',
  scanUrl: '',
};

const DEFAULT_DESCRIPTION = 'Please wait, in progress...';

export const useLoadingDialogStore = create<LoadingDialogState>(set => ({
  isOpen: false,
  ...DEFAULT_OPTIONS,
  description: DEFAULT_DESCRIPTION,

  openLoadingDialog: options =>
    set({
      isOpen: true,
      title: options?.title ?? DEFAULT_OPTIONS.title,
      description: options?.description ?? DEFAULT_DESCRIPTION,
      size: options?.size ?? DEFAULT_OPTIONS.size,
      showCloseButton:
        options?.showCloseButton ?? DEFAULT_OPTIONS.showCloseButton,
      className: options?.className ?? DEFAULT_OPTIONS.className,
      chainId: options?.chainId ?? DEFAULT_OPTIONS.chainId,
      scanUrl: options?.scanUrl ?? DEFAULT_OPTIONS.scanUrl,
    }),

  closeLoadingDialog: () => set({ isOpen: false }),
}));
