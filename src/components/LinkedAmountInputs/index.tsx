'use client';

import React from 'react';
import { FormControl, FormField, FormItem } from '@solvprotocol/ui-v2';
import {
  sanitizeAmountInput,
  TOKEN_DECIMALS_FALLBACK,
} from '@/lib/amount-schema';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { InputComplex } from '@/components/InputComplex';

export type LinkedAmountInputsSideConfig<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: React.ReactNode;
  decimals?: number;
  placeholder?: string;
  suffix?: React.ReactNode;
  error?: boolean;
  formItemClassName?: string;
  onAfterChange?: (sanitizedValue: string) => void;
};

export type LinkedAmountInputsProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  left: LinkedAmountInputsSideConfig<TFieldValues>;
  right: LinkedAmountInputsSideConfig<TFieldValues>;
  midNode?: React.ReactNode;
  containerClassName?: string;
};

export function LinkedAmountInputs<TFieldValues extends FieldValues>(
  props: LinkedAmountInputsProps<TFieldValues>
) {
  const { form, left, right, midNode, containerClassName } = props;

  const leftDecimals = left.decimals ?? TOKEN_DECIMALS_FALLBACK;
  const rightDecimals = right.decimals ?? TOKEN_DECIMALS_FALLBACK;

  return (
    <div
      className={
        containerClassName ?? 'flex flex-col justify-between md:flex-row'
      }
    >
      <FormField
        control={form.control}
        name={left.name}
        render={({ field }) => (
          <FormItem
            className={
              left.formItemClassName ?? 'w-full gap-[.5rem] md:w-[47%]'
            }
          >
            {left.label}
            <div className='flex items-center'>
              <FormControl>
                <InputComplex
                  className='h-[2.5rem]'
                  error={!!left.error}
                  inputValue={field.value as string}
                  onInputChange={value => {
                    const sanitized = sanitizeAmountInput(value, leftDecimals);
                    field.onChange(sanitized);
                    left.onAfterChange?.(sanitized);
                  }}
                  inputProps={{
                    placeholder: left.placeholder ?? '0.00',
                    className:
                      'h-[2.5rem] outline-none !border-none !ring-transparent !pl-[1rem]',
                  }}
                  iSuffix={left.suffix}
                />
              </FormControl>
            </div>
          </FormItem>
        )}
      />

      <div className='box-border flex h-[2.5rem] items-center justify-center px-[1.5rem] md:mt-[1.75rem]'>
        {midNode}
      </div>

      <FormField
        control={form.control}
        name={right.name}
        render={({ field }) => (
          <FormItem
            className={
              right.formItemClassName ?? 'w-full gap-[.5rem] md:w-[47%]'
            }
          >
            {right.label}
            <FormControl>
              <InputComplex
                className='h-[2.5rem]'
                error={!!right.error}
                inputValue={field.value as string}
                onInputChange={value => {
                  const sanitized = sanitizeAmountInput(value, rightDecimals);
                  field.onChange(sanitized);
                  right.onAfterChange?.(sanitized);
                }}
                inputProps={{
                  placeholder: right.placeholder ?? '0.00',
                  className:
                    'h-[2.5rem] outline-none !border-none !ring-transparent !pl-[1rem]',
                }}
                iSuffix={right.suffix}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

export default LinkedAmountInputs;
