import {
  Horizon,
  TransactionBuilder,
  Operation,
  Asset,
  Keypair,
  Memo,
  MemoType,
} from '@stellar/stellar-sdk';
import { WalletAdapter } from '@/wallet-connector/types';
import { getStellarConfig } from '@/config/stellar';
import { getStellarAPI } from './api';

export interface PaymentParams {
  destination: string;
  amount: string;
  asset?: Asset;
  memo?: string;
  memoType?: MemoType;
}

export interface TransactionOptions {
  fee?: string;
  timebounds?: {
    minTime: number;
    maxTime: number;
  };
  memo?: string;
  memoType?: MemoType;
}

export class StellarTransactions {
  private server: Horizon.Server;
  private networkPassphrase: string;

  constructor() {
    const config = getStellarConfig();
    this.server = new Horizon.Server(config.horizonUrl);
    this.networkPassphrase = config.networkPassphrase;
  }

  /**
   * 获取基础费用
   */
  private async getBaseFee(): Promise<string> {
    try {
      const feeStats = await getStellarAPI().getFeeStats();
      return feeStats.fee_charged.mode;
    } catch (error) {
      // 如果获取失败，返回默认费用
      return '100';
    }
  }

  /**
   * 创建备注
   */
  private createMemo(text: string, type?: MemoType): Memo {
    switch (type) {
      case 'text':
        return Memo.text(text);
      case 'id':
        return Memo.id(text);
      case 'hash':
        return Memo.hash(text);
      case 'return':
        return Memo.return(text);
      default:
        return Memo.text(text);
    }
  }

  /**
   * 估算交易费用
   */
  async estimateFee(operationCount: number = 1): Promise<string> {
    try {
      const feeStats = await getStellarAPI().getFeeStats();
      const baseFee = parseInt(feeStats.fee_charged.mode);
      return (baseFee * operationCount).toString();
    } catch (error) {
      // 默认费用计算
      return (100 * operationCount).toString();
    }
  }

  /**
   * 验证地址格式
   */
  isValidAddress(address: string): boolean {
    try {
      Keypair.fromPublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// 创建单例实例
let stellarTransactions: StellarTransactions;

export function getStellarTransactions(): StellarTransactions {
  if (!stellarTransactions) {
    stellarTransactions = new StellarTransactions();
  }
  return stellarTransactions;
}
