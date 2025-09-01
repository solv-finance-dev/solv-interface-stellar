import { useSuccessfulDialogStore } from '@/states/successful-dialog-store';

export const useSuccessfulDialog = () => {
  const {
    openSuccessfulDialog,
    closeSuccessfulDialog,
    setSuccessfulDialogLoading,
    setSuccessfulDialogDisabled,
  } = useSuccessfulDialogStore();

  return {
    openSuccessfulDialog,
    closeSuccessfulDialog,
    setSuccessfulDialogLoading,
    setSuccessfulDialogDisabled,
  };
};
