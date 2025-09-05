// src/components/global-loading-dialog.tsx
'use client';

import { useLoadingDialogStore } from '@/states/loading-dialog-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@solvprotocol/ui-v2';

import cn from 'classnames';

export function GlobalLoadingDialog() {
  const {
    isOpen,
    title,
    description,
    size,
    showCloseButton = true,
    className,
    closeLoadingDialog,
    chainId,
    scanUrl,
  } = useLoadingDialogStore();

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && closeLoadingDialog()}>
      <DialogContent
        className={cn(
          `${sizeClasses[size || 'sm']} ${className}`,
          'h-[17.75rem] w-[18rem] border-0 outline-none'
        )}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className='mt-[2.75rem]'>
          <DialogTitle className='text-textColor flex items-center justify-center'>
            <div className='bg-background-elevation2 flex size-[4.5rem] items-center justify-center rounded-full'>
              <svg
                className='animate-spin'
                xmlns='http://www.w3.org/2000/svg'
                width='41'
                height='40'
                viewBox='0 0 41 40'
                fill='none'
              >
                <path
                  d='M20.4932 3.10083C20.769 3.10104 20.993 3.32497 20.9932 3.60083C20.9932 3.87684 20.7691 4.10062 20.4932 4.10083C10.8007 4.10094 4.59295 12.041 4.59277 20.0012C4.59298 27.9614 10.8008 35.9005 20.4932 35.9006C25.1655 35.9005 29.016 34.0616 31.7578 31.2717C33.2321 29.7716 34.3872 27.9945 35.1758 26.0784C35.2809 25.8234 35.573 25.7013 35.8281 25.8059C36.0834 25.911 36.2055 26.2039 36.1006 26.4592C35.2643 28.4912 34.0382 30.378 32.4707 31.9729C29.5484 34.9463 25.4442 36.9005 20.4932 36.9006C10.1781 36.9005 3.59298 28.4406 3.59277 20.0012C3.59295 11.5618 10.1781 3.10094 20.4932 3.10083Z'
                  fill='#9391F8'
                />
              </svg>
            </div>
          </DialogTitle>

          <div className='text-textColor mb-2 mt-[1.8rem] !text-[1.25rem] !font-[600] leading-none'>
            {title || <span>Loading</span>}
          </div>
          {description && (
            <DialogDescription className='text-textColor-secondary w-full text-center text-[0.875rem] font-[500]'>
              {description}
            </DialogDescription>
          )}

          {chainId && scanUrl && (
            <a
              className='flex cursor-pointer items-center justify-center px-5 text-[.8125rem] font-[500] text-brand hover:underline'
              href={scanUrl}
              target='_blank'
              rel='noreferrer'
            >
              <span>View on</span> {` `}xxx (预留)
              {/* {CHAIN_SCAN_NAME[chainId]} */}
            </a>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
