import { ReactNode } from 'react';
import { create } from 'zustand';

type LoadingDialogState = {
  isOpen: boolean;
  title?: string;
  description?: string | ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
  className?: string;
  chainId?: string;
  scanUrl?: string;
  openLoadingDialog: (options?: {
    title?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    showCloseButton?: boolean;
    className?: string;
    chainId?: string;
    scanUrl?: string;
  }) => void;
  closeLoadingDialog: () => void;
};

export const useLoadingDialogStore = create<LoadingDialogState>(set => ({
  isOpen: false,
  title: 'Loading',
  description: 'Please wait, in progress...',
  size: 'md',
  showCloseButton: false,
  className: '',
  chainId: '',
  scanUrl: '',
  openLoadingDialog: options =>
    set({
      isOpen: true,
      title: options?.title || 'Loading',
      description: options?.description || 'Please wait, in progress...',
      size: options?.size,
      showCloseButton: options?.showCloseButton,
      className: options?.className || '',
      chainId: options?.chainId || '',
      scanUrl: options?.scanUrl || '',
    }),
  closeLoadingDialog: () => set({ isOpen: false }),
}));
