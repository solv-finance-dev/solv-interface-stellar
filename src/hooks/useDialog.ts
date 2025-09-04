import { useDialogStore } from '@/states/dialog-store';

export const useDialog = () => {
  const { openDialog, closeDialog, setDialogLoading, setDialogDisabled } =
    useDialogStore();

  return {
    openDialog,
    closeDialog,
    setDialogLoading,
    setDialogDisabled,
  };
};
