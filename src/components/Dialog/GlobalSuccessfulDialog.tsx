'use client';

import * as React from 'react';

import { Loader2 } from 'lucide-react';

import cn from 'classnames';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@solvprotocol/ui-v2';
import { useSuccessfulDialogStore } from '@/states/successful-dialog-store';

export function GlobalSuccessfulDialog() {
  const {
    isOpen,
    options,
    closeSuccessfulDialog,
    setSuccessfulDialogLoading,
    setSuccessfulDialogDisabled,
  } = useSuccessfulDialogStore();

  const {
    title = 'operate',
    description = '',
    content,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    showCancel = false,
    showConfirm = true,
    disableConfirm = false,
    loading = false,
    size = 'md',
    showCloseButton = true,
    chainId,
    scanUrl,
  } = options;

  const handleConfirm = async () => {
    if (onConfirm) {
      try {
        setSuccessfulDialogLoading(true);
        await onConfirm();
      } finally {
        setSuccessfulDialogLoading(false);
      }
    }
    closeSuccessfulDialog();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    closeSuccessfulDialog();
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    full: 'max-w-full',
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => !open && closeSuccessfulDialog()}
    >
      <DialogContent
        className={`${sizeClasses[size]} max-h-[90vh] overflow-y-auto border-none outline-none`}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className='mt-[2.75rem]'>
          <DialogTitle className='flex w-full justify-center'>
            <div className='flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-gray-50'>
              <svg
                width='41'
                height='40'
                viewBox='0 0 41 40'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M20.5 3.10156C29.8301 3.10184 37.3936 10.6659 37.3936 19.9961C37.3932 29.3259 29.8299 36.8894 20.5 36.8896C11.1698 36.8896 3.60585 29.3261 3.60547 19.9961C3.60547 10.6657 11.1696 3.10156 20.5 3.10156ZM20.5 4.10156C11.7219 4.10156 4.60547 11.218 4.60547 19.9961C4.60585 28.7738 11.7221 35.8896 20.5 35.8896C29.2776 35.8894 36.3932 28.7737 36.3936 19.9961C36.3936 11.2181 29.2778 4.10184 20.5 4.10156ZM26.0879 13.7061C26.2468 13.4808 26.5586 13.4266 26.7842 13.585C27.0099 13.7438 27.064 14.0564 26.9053 14.2822L18.4609 26.2822C18.3755 26.4034 18.2405 26.4801 18.0928 26.4922C17.945 26.5042 17.7992 26.4505 17.6953 26.3447L13.4736 22.0439C13.2804 21.8469 13.2826 21.5303 13.4795 21.3369C13.6765 21.1437 13.9931 21.147 14.1865 21.3438L17.9883 25.2148L26.0879 13.7061Z'
                  fill='#4FEF5F'
                />
              </svg>
            </div>
          </DialogTitle>

          <div className='mb-[.5rem] mt-6 flex items-center justify-center text-[1.125rem] font-[500] leading-none'>
            {title ? (
              <span>{title}&nbsp;Successfully</span>
            ) : (
              <span>Successfully</span>
            )}
          </div>

          {description && (
            <DialogDescription className='w-full text-center text-[0.875rem] font-[500] text-gray-400'>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {content && <div className=''>{content}</div>}

        <DialogFooter className='mt-[.5rem] flex w-full items-center'>
          {showCancel && (
            <Button
              variant='outline'
              onClick={handleCancel}
              disabled={loading}
              className='h-12 flex-1 rounded-full text-[1rem]'
            >
              {cancelText}
            </Button>
          )}

          {showConfirm && (
            <Button
              onClick={handleConfirm}
              disabled={disableConfirm || loading}
              className={cn(
                'h-12 flex-1 rounded-full bg-brand-500 text-[1rem] outline-none hover:bg-brand-600',
                !showCancel && 'w-full'
              )}
            >
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}

              {confirmText}
            </Button>
          )}
        </DialogFooter>

        <a
          className='flex cursor-pointer items-center justify-center px-5 text-[.8125rem] font-[500] text-brand hover:underline'
          href={scanUrl || ''}
          target='_blank'
          rel='noreferrer'
        >
          {chainId && scanUrl && (
            <>
              <span>View on</span>&nbsp; {`CHAIN_SCAN_NAME(预留)`}
              {/* {CHAIN_SCAN_NAME[chainId]} */}
            </>
          )}
        </a>
      </DialogContent>
    </Dialog>
  );
}
