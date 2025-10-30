'use client';

import * as React from 'react';
import cn from 'classnames';
import { Input } from '@solvprotocol/ui-v2';
import { ChangeEvent, ReactNode, useCallback, useState } from 'react';

export type InputMode = 'integer' | 'decimal' | 'text';
export interface InputComplexProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange' | 'onFocus' | 'onBlur'
  > {
  /* input */
  inputValue?: string;
  mode?: InputMode;
  decimal?: number;

  onInputChange?: (val: string) => void;
  // onInputChange: (
  //   event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  // ) => void;
  onBlur?: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onFocus?: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  inputProps?: Omit<
    React.ComponentProps<'input'>,
    'value' | 'onChange' | 'disabled'
  >;
  error?: boolean;

  iPrefix?: ReactNode;
  iSuffix?: ReactNode;
  topContent?: ReactNode;
  bottomContent?: ReactNode;

  /* disabled */
  disabled?: boolean;

  maxLength?: number;
}

const handleIntegerValue = (value: string) => {
  if (value === 'NaN' || !value) {
    return '';
  }

  value = value.split('.')[0] || '';
  value = value.replace(/[^0-9]/g, '');
  value = parseInt(value) + '';

  const res: string = value ? new BigNumber(value).toString(10) : '';

  return res;
};

const handleDecimalValue = (value: string, decimals: number) => {
  value = value.replace(/。/, '.');
  value = value.replace(/[^\d.]/g, '');
  value = value.replace(/^\./g, '');
  value = value.replace(/\.{4,}/g, '.');
  value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');

  if (value.indexOf('.') > -1) {
    if (value.split('.')[1] && value.split('.')[1].length > decimals) {
      value = new BigNumber(value).toFixed(decimals, 1);
    }
  } else {
    value = value.replace(
      new RegExp(`^(\\-)*(\\d+)\\.(${'\\d'.repeat(Number(decimals))}).*$`, 'g'),
      '$1$2.$3'
    );
  }
  return value;
};

export const InputComplex = React.forwardRef<HTMLDivElement, InputComplexProps>(
  (props, ref) => {
    const {
      mode,
      decimal,
      inputValue,
      onInputChange,
      onBlur,
      onFocus,
      inputProps,
      iPrefix,
      iSuffix,
      topContent,
      bottomContent,
      disabled = false,
      maxLength,
      className,
      error = false,
      ...rest
    } = props;

    const [isFocus, setIsFocus] = useState(false);

    let saveValue = '';

    // const handleChange = (
    //   event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    // ) => {
    //   if (mode === 'integer') {
    //     event.target.value = handleIntegerValue(event.target.value);
    //   }
    //   if (mode === 'decimal') {
    //     event.target.value = handleDecimalValue(
    //       event.target.value,
    //       decimal || 0
    //     );
    //   }

    //   if (maxLength) {
    //     event.target.value = event.target.value.substring(0, maxLength);
    //   }

    //   if (saveValue != event.target.value || !event.target.value) {
    //     onInputChange?.(event);
    //   }
    //   saveValue = event.target.value;
    // };

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsFocus(true);
        onFocus?.(event);
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsFocus(false);
        onBlur?.(event);
      },
      [onBlur]
    );

    return (
      <div
        ref={ref}
        className={cn(
          'box-border flex flex-col',
          'border-input w-full items-stretch overflow-hidden rounded-[4px] border', //bg-transparent
          'pr-4 transition-colors duration-150',
          'hover:border-base-primary-500',
          'active:border-base-primary-500',
          'bg-base-neutral-0 dark:!bg-base-neutral-900',
          isFocus && 'border-base-primary-500',
          disabled && 'cursor-not-allowed opacity-50',
          error && '!border-errorColor',

          className
        )}
        {...rest}
      >
        {topContent && <div className='pl-4'>{topContent}</div>}
        <div className='flex w-full items-center'>
          {iPrefix && (
            <div className='flex-y-center mr-4 h-full'>{iPrefix}</div>
          )}
          {/* input */}
          <Input
            value={inputValue}
            onChange={e => onInputChange?.(e.target.value)}
            // onChange={handleChange}
            disabled={disabled}
            className='!box-border min-w-0 flex-1 rounded-none rounded-l-md border-0 !bg-transparent !px-0 shadow-none focus-visible:ring-0 dark:!bg-transparent'
            {...inputProps}
            onFocus={event => {
              handleFocus(event);
            }}
            onBlur={event => {
              handleBlur(event);
            }}
          />
          {iSuffix && (
            <div className='flex-y-center h-full text-textColor'>{iSuffix}</div>
          )}
        </div>

        {bottomContent && (
          <div className='flex items-end justify-end'>{bottomContent}</div>
        )}
      </div>
    );
  }
);
InputComplex.displayName = 'InputComplex';
