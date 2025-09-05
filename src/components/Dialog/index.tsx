'use client';

import * as React from 'react';

import { Loader2 } from 'lucide-react';
import { useDialogStore } from '@/states/dialog-store';
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

export function GlobalDialog() {
  const { isOpen, options, closeDialog, setDialogLoading, setDialogDisabled } =
    useDialogStore();

  const {
    title,
    description,
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
  } = options;

  const handleConfirm = async () => {
    if (onConfirm) {
      try {
        setDialogLoading(true);
        await onConfirm();
      } finally {
        setDialogLoading(false);
      }
    }
    closeDialog();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    closeDialog();
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
    <Dialog open={isOpen} onOpenChange={open => !open && closeDialog()}>
      <DialogContent
        className={`${sizeClasses[size]} max-h-[90vh] overflow-y-auto border-none outline-none`}
        showCloseButton={showCloseButton}
      >
        <DialogHeader>
          {title && (
            <DialogTitle className='text-textColor flex items-center justify-start'>
              {title}
            </DialogTitle>
          )}
          {description && (
            <DialogDescription className='text-textColor-secondary mt-[-4px] flex items-center justify-start text-[.875rem]'>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className='text-textColor'>{content}</div>

        <DialogFooter className='mt-1 flex w-full items-center'>
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
      </DialogContent>
    </Dialog>
  );
}
