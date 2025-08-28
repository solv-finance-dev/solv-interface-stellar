import {
  getContractClient,
  ensureClientInitialized,
} from '@/states/contract-store';
import { Client as ContractClient } from '@stellar/stellar-sdk/contract';

export interface TokenBalanceResult {
  balance: string;
  decimals: number;
  symbol?: string;
  name?: string;
  error?: string;
}

export interface TokenInfo {
  symbol?: string;
  name?: string;
  decimals: number;
}

/**
 * Generic token balance query function
 * @param userAddress User address
 * @param contractClientName Contract client name (registered in contract-store)
 * @param options Optional configuration
 * @returns Object containing balance, decimals and possible error information
 */
export async function getTokenBalance(
  userAddress: string,
  contractClientName: string,
  options: {
    includeMetadata?: boolean; // Whether to fetch token metadata (symbol, name)
    logPrefix?: string; // Log prefix (deprecated, kept for compatibility)
  } = {}
): Promise<TokenBalanceResult> {
  const { includeMetadata = false } = options;

  try {
    // Ensure contract client is initialized
    await ensureClientInitialized(contractClientName);

    // Get token contract client
    const tokenClient = getContractClient<ContractClient>(contractClientName);
    if (!tokenClient) {
      const error = `${contractClientName} contract client not initialized`;
      return { balance: '0', decimals: 0, error };
    }

    // Check required methods
    const tokenClientAny = tokenClient as any;
    if (
      typeof tokenClientAny.balance !== 'function' ||
      typeof tokenClientAny.decimals !== 'function'
    ) {
      const error = `${contractClientName} does not implement required token methods`;
      return { balance: '0', decimals: 0, error };
    }

    // Get basic information in parallel
    const calls: Array<Promise<any>> = [
      tokenClientAny.balance({ account: userAddress }),
      tokenClientAny.decimals(),
    ];

    // If metadata is needed, add corresponding calls
    if (includeMetadata) {
      if (typeof tokenClientAny.symbol === 'function') {
        calls.push(tokenClientAny.symbol());
      }
      if (typeof tokenClientAny.name === 'function') {
        calls.push(tokenClientAny.name());
      }
    }

    const transactions = await Promise.all(calls);
    const results = await Promise.all(
      transactions.map(transaction => transaction.simulate())
    );

    const [balanceResult, decimalsResult, symbolResult, nameResult] = results;

    if (
      balanceResult.result !== undefined &&
      decimalsResult.result !== undefined
    ) {
      const rawBalance = balanceResult.result;
      const decimals = Number(decimalsResult.result);

      // Convert BigInt balance to decimal string
      const balance = Number(rawBalance) / Math.pow(10, decimals);
      const formattedBalance = balance.toFixed(decimals).replace(/\.?0+$/, '');

      const result: TokenBalanceResult = {
        balance: formattedBalance,
        decimals,
      };

      // Add metadata (if available)
      if (includeMetadata) {
        if (symbolResult?.result) result.symbol = symbolResult.result;
        if (nameResult?.result) result.name = nameResult.result;
      }

      return result;
    }

    const error = 'Contract calls returned empty results';
    return { balance: '0', decimals: 0, error };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return { balance: '0', decimals: 0, error: errorMessage };
  }
}

/**
 * Get token information (excluding balance)
 * @param contractClientName Contract client name
 * @returns Basic token information
 */
export async function getTokenInfo(
  contractClientName: string
): Promise<TokenInfo & { error?: string }> {
  try {
    await ensureClientInitialized(contractClientName);
    const tokenClient = getContractClient<ContractClient>(contractClientName);

    if (!tokenClient) {
      return {
        decimals: 0,
        error: `${contractClientName} contract client not initialized`,
      };
    }

    if (typeof (tokenClient as any).decimals !== 'function') {
      return {
        decimals: 0,
        error: `${contractClientName} does not implement required token methods`,
      };
    }

    const calls: Array<Promise<any>> = [(tokenClient as any).decimals()];
    if (typeof (tokenClient as any).symbol === 'function') {
      calls.push((tokenClient as any).symbol());
    }
    if (typeof (tokenClient as any).name === 'function') {
      calls.push((tokenClient as any).name());
    }

    const transactions = await Promise.all(calls);
    const results = await Promise.all(
      transactions.map(transaction => transaction.simulate())
    );

    const [decimalsResult, symbolResult, nameResult] = results;

    if (decimalsResult.result !== undefined) {
      const info: TokenInfo = {
        decimals: Number(decimalsResult.result),
      };

      if (symbolResult?.result) info.symbol = symbolResult.result;
      if (nameResult?.result) info.name = nameResult.result;

      return info;
    }

    return { decimals: 0, error: 'Failed to get token info' };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return { decimals: 0, error: errorMessage };
  }
}

/**
 * SolvBTC Token specific function (backward compatible)
 * @param userAddress User address
 * @returns SolvBTC Token balance information
 */
export async function getSolvBTCTokenBalance(
  userAddress: string
): Promise<TokenBalanceResult> {
  return getTokenBalance(userAddress, 'SolvBTCTokenClient', {
    includeMetadata: true,
  });
}

/**
 * Batch query multiple token balances
 * @param userAddress User address
 * @param contractClientNames Array of contract client names
 * @returns Array of token balance results
 */
export async function getMultipleTokenBalances(
  userAddress: string,
  contractClientNames: string[]
): Promise<Array<TokenBalanceResult & { contractName: string }>> {
  const results = await Promise.allSettled(
    contractClientNames.map(async contractName => {
      const result = await getTokenBalance(userAddress, contractName, {
        includeMetadata: true,
      });
      return { ...result, contractName };
    })
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        balance: '0',
        decimals: 0,
        contractName: contractClientNames[index],
        error: result.reason?.message || 'Unknown error',
      };
    }
  });
}

/**
 * Format token amount display
 * @param balance Balance string
 * @param decimals Number of decimals
 * @param maxDecimals Maximum display decimals (default 4)
 * @returns Formatted balance string
 */
export function formatTokenBalance(
  balance: string,
  decimals: number,
  maxDecimals: number = 4
): string {
  const num = parseFloat(balance);
  if (isNaN(num) || num === 0) return '0';

  // If balance is very small, show more decimals
  if (num < 0.0001) {
    return num.toFixed(Math.min(decimals, 8));
  }

  // Normally limit decimal places
  return num.toFixed(Math.min(maxDecimals, decimals)).replace(/\.?0+$/, '');
}

/**
 * Format token amount display (with symbol)
 * @param balance Balance string
 * @param decimals Number of decimals
 * @param symbol Token symbol
 * @param maxDecimals Maximum display decimals (default 4)
 * @returns Formatted balance string (with symbol)
 */
export function formatTokenBalanceWithSymbol(
  balance: string,
  decimals: number,
  symbol: string = 'TOKEN',
  maxDecimals: number = 4
): string {
  const formattedBalance = formatTokenBalance(balance, decimals, maxDecimals);
  return `${formattedBalance} ${symbol}`;
}

/**
 * Parse user input token amount
 * @param input User input string
 * @param decimals Token decimals
 * @returns Convert to smallest unit string, return null on failure
 */
export function parseTokenAmount(
  input: string,
  decimals: number
): string | null {
  try {
    const num = parseFloat(input);
    if (isNaN(num) || num < 0) return null;

    const rawAmount = num * Math.pow(10, decimals);
    return Math.floor(rawAmount).toString();
  } catch {
    return null;
  }
}

// Predefined token contract mapping (extensible)
export const TOKEN_CONTRACTS = {
  SOLVBTC: 'SolvBTCTokenClient',
  // More tokens can be added in the future
  // USDC: 'USDCTokenClient',
  // OTHER: 'OtherTokenClient',
} as const;

export type TokenSymbol = keyof typeof TOKEN_CONTRACTS;
