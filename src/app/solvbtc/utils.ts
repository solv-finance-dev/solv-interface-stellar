'use client';

import BigNumber from 'bignumber.js';
import { z } from 'zod';

export const TOKEN_DECIMALS_FALLBACK = 6;

export const getFractionalLength = (value: string): number => {
  if (!value || !value.includes('.')) return 0;
  const [, fractional = ''] = value.split('.');
  return fractional.length;
};

export const truncateToDecimals = (value: string, decimals: number): string => {
  if (!value) return '';
  const normalized = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
  if (!normalized) return '';
  const [i = '', f = ''] = normalized.split('.');
  if (decimals <= 0) return i || '';
  if (normalized.endsWith('.') && f.length === 0) {
    return `${i || '0'}.`;
  }
  const tf = f.slice(0, Math.max(0, decimals));
  return tf.length > 0 ? `${i || '0'}.${tf}` : i || '';
};

export const sanitizeAmountInput = (
  value: string,
  decimals: number
): string => {
  if (!value) return '';
  let v = value.trim();
  if (v.startsWith('.')) v = `0${v}`;
  v = v.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
  return truncateToDecimals(v, decimals);
};

export const bnToTruncatedString = (
  value: BigNumber,
  decimals: number
): string => {
  const d = Math.max(0, decimals);
  const s = value.toFixed(d, BigNumber.ROUND_DOWN);
  return s.replace(/\.0+$/, '').replace(/\.$/, '');
};

export const computeReceiveFromDeposit = (
  depositAmount: string,
  feeRatePercentage: string,
  receiveDecimals: number
): string => {
  const depositValue = new BigNumber(depositAmount || '0');
  const feeRateValue = new BigNumber(feeRatePercentage || '0');
  const one = new BigNumber(1);
  const ratio = one.minus(feeRateValue);
  const receiveAmount = depositValue.multipliedBy(ratio);
  return bnToTruncatedString(receiveAmount, receiveDecimals);
};

export const computeDepositFromReceive = (
  receiveAmount: string,
  feeRatePercentage: string,
  depositDecimals: number
): string => {
  const receiveValue = new BigNumber(receiveAmount || '0');
  const feeRateValue = new BigNumber(feeRatePercentage || '0');
  const one = new BigNumber(1);
  const denom = one.minus(feeRateValue.div(100));
  if (denom.lte(0)) return '';
  const depositAmount = receiveValue.div(denom);
  return bnToTruncatedString(depositAmount, depositDecimals);
};

export const scaleAmountToBigInt = (
  amount: string,
  decimals: number
): bigint => {
  const scaled = new BigNumber(amount)
    .multipliedBy(new BigNumber(10).pow(decimals))
    .integerValue(BigNumber.ROUND_DOWN);
  return BigInt(scaled.toFixed(0));
};

export interface LinkedAmountSchemaParams {
  depositDecimals: number;
  receiveDecimals: number;
  maxDeposit?: string;
  depositTokenName?: string;
  receiveTokenName?: string;
}

export const createLinkedAmountSchema = (params: LinkedAmountSchemaParams) =>
  z.object({
    deposit: z
      .string()
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          const num = parseFloat(val);
          return !isNaN(num) && isFinite(num);
        },
        { message: 'Deposit amount must be a valid number' }
      )
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          return parseFloat(val) > 0;
        },
        { message: 'Deposit amount must be greater than 0' }
      )
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          return (
            getFractionalLength(val) <=
            (params.depositDecimals ?? TOKEN_DECIMALS_FALLBACK)
          );
        },
        {
          message: `Exceeds maximum decimals (${params.depositDecimals ?? TOKEN_DECIMALS_FALLBACK})${params.depositTokenName ? ` for ${params.depositTokenName}` : ''}`,
        }
      )
      .refine(
        val => {
          if (!val || val.trim() === '' || params.maxDeposit == null)
            return true;
          const amount = parseFloat(val);
          const max = parseFloat(params.maxDeposit || '0');
          return amount <= max;
        },
        {
          message: `Deposit amount cannot exceed your balance of ${params.maxDeposit ?? '0'}${params.depositTokenName ? ` ${params.depositTokenName}` : ''}`,
        }
      ),
    receive: z
      .string()
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          const num = parseFloat(val);
          return !isNaN(num) && isFinite(num);
        },
        { message: 'Receive amount must be a valid number' }
      )
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          return parseFloat(val) > 0;
        },
        { message: 'Receive amount must be greater than 0' }
      )
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          return (
            getFractionalLength(val) <=
            (params.receiveDecimals ?? TOKEN_DECIMALS_FALLBACK)
          );
        },
        {
          message: `Exceeds maximum decimals (${params.receiveDecimals ?? TOKEN_DECIMALS_FALLBACK})${params.receiveTokenName ? ` for ${params.receiveTokenName}` : ''}`,
        }
      ),
  });
