/**
 * Common utility functions for transactions
 */

import { multipliedBy } from './utils';

/**
 * Convert user input amount to contract format (considering decimal places)
 * Uses BigNumber for precise calculation to avoid floating point precision issues
 * @param amount - User input amount string
 * @param decimals - Token decimal places
 * @returns Converted BigInt format amount
 */
export const convertAmountToContractFormat = (
  amount: string,
  decimals: number = 7
): bigint => {
  // Use BigNumber for precise calculation
  const multiplier = Math.pow(10, decimals).toString();
  const amountWithDecimals = multipliedBy(amount, multiplier);

  // Floor and convert to BigInt
  const flooredAmount = Math.floor(parseFloat(amountWithDecimals)).toString();
  return BigInt(flooredAmount);
};

/**
 * Extract transaction hash from transaction response
 * @param signedTx - Signed transaction response
 * @returns Transaction hash or undefined
 */
export const extractTransactionHash = (signedTx: any): string | undefined => {
  if (typeof signedTx === 'object' && signedTx) {
    // Try different hash field names
    if ('hash' in signedTx) {
      return signedTx.hash;
    }
    if ('id' in signedTx) {
      return signedTx.id;
    }
    if ('txHash' in signedTx) {
      return signedTx.txHash;
    }
    if ('transactionHash' in signedTx) {
      return signedTx.transactionHash;
    }
  }
  return undefined;
};

/**
 * Transaction error type definition
 */
export interface TransactionError {
  title: string;
  message: string;
}

/**
 * Parse transaction error message and return user-friendly error information
 * @param error - Error object
 * @param defaultTitle - Default error title
 * @param defaultMessage - Default error message
 * @returns Formatted error information
 */
export const parseTransactionError = (
  error: any,
  defaultTitle: string = 'Transaction Failed',
  defaultMessage: string = 'Transaction failed. Please try again.'
): TransactionError => {
  let errorTitle = defaultTitle;
  let errorMessage = defaultMessage;

  if (error instanceof Error) {
    // Common Stellar/Soroban error handling
    const message = error.message;

    // Authorization related errors
    if (
      message.includes('Transaction requires signatures from') ||
      message.includes('HostError: Error(Contract, #101)')
    ) {
      errorTitle = 'Authorization Required';
      errorMessage =
        'This transaction requires additional authorization. Please contact the contract administrator.';
    }
    // Wallet connection errors
    else if (
      message.includes('NoSignerError') ||
      message.includes('Wallet not connected')
    ) {
      errorTitle = 'Wallet Not Connected';
      errorMessage = 'Please connect your wallet to sign this transaction.';
    }
    // User cancelled transaction
    else if (
      message.includes('User rejected') ||
      message.includes('User cancelled')
    ) {
      errorTitle = 'Transaction Cancelled';
      errorMessage = 'You cancelled the transaction in your wallet.';
    }
    // Currency not supported error
    else if (
      message.includes('Currency') &&
      message.includes('not supported')
    ) {
      errorTitle = 'Unsupported Currency';
      errorMessage = message;
    }
    // Insufficient balance error
    else if (
      message.includes('insufficient') &&
      (message.includes('balance') || message.includes('funds'))
    ) {
      errorTitle = 'Insufficient Balance';
      errorMessage =
        "You don't have enough balance to complete this transaction.";
    }
    // Network errors
    else if (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('connection')
    ) {
      errorTitle = 'Network Error';
      errorMessage =
        'Network connection issue. Please check your connection and try again.';
    }
    // Gas/Fee related errors
    else if (message.includes('fee') || message.includes('gas')) {
      errorTitle = 'Transaction Fee Error';
      errorMessage =
        'Transaction fee issue. Please try again with a higher fee.';
    }
    // Other known errors, use error message directly
    else {
      errorMessage = message;
    }
  }

  return { title: errorTitle, message: errorMessage };
};

/**
 * Format token amount (convert from contract format to user-readable format)
 * @param amount - Contract format amount (BigInt or string)
 * @param decimals - Token decimal places
 * @param precision - Display precision (decimal places)
 * @returns Formatted amount string
 */
export const formatTokenAmount = (
  amount: bigint | string | number,
  decimals: number = 7,
  precision: number = 6
): string => {
  const bigIntAmount =
    typeof amount === 'bigint' ? amount : BigInt(amount.toString());
  const divisor = BigInt(Math.pow(10, decimals));
  const wholePart = bigIntAmount / divisor;
  const fractionalPart = bigIntAmount % divisor;

  if (fractionalPart === BigInt(0)) {
    return wholePart.toString();
  }

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr
    .substring(0, precision)
    .replace(/0+$/, '');

  if (trimmedFractional === '') {
    return wholePart.toString();
  }

  return `${wholePart.toString()}.${trimmedFractional}`;
};

/**
 * Validate if amount format is valid
 * @param amount - Amount string to validate
 * @returns Whether it's a valid amount
 */
export const isValidAmount = (amount: string): boolean => {
  if (!amount || amount.trim() === '') {
    return false;
  }

  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && isFinite(num);
};

/**
 * Validate if amount exceeds balance
 * @param amount - Amount string to validate
 * @param balance - Available balance string
 * @returns Whether amount exceeds balance
 */
export const isAmountExceedsBalance = (
  amount: string,
  balance: string
): boolean => {
  if (!isValidAmount(amount) || !balance) {
    return false;
  }

  return parseFloat(amount) > parseFloat(balance);
};

/**
 * Transaction configuration type
 */
export interface TransactionConfig {
  fee?: number;
  timeoutInSeconds?: number;
  simulate?: boolean;
}

/**
 * Default transaction configuration
 */
export const DEFAULT_TRANSACTION_CONFIG: TransactionConfig = {
  fee: 100_000, // Base fee
  timeoutInSeconds: 30,
  simulate: true,
};
