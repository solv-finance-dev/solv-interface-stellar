import { useLoadingDialogStore } from '@/states/loading-dialog-store';

export const useLoadingDialog = () => {
  const { openLoadingDialog, closeLoadingDialog } = useLoadingDialogStore();

  return {
    openLoadingDialog,
    closeLoadingDialog,
  };
};
