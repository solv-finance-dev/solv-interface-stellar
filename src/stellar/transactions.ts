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
     * 发送支付交易
     */
    async sendPayment(
        wallet: WalletAdapter,
        params: PaymentParams,
        options?: TransactionOptions
    ): Promise<string> {
        try {
            const sourcePublicKey = wallet.getPublicKey();
            if (!sourcePublicKey) {
                throw new Error('Wallet not connected');
            }

            // 加载源账户
            const sourceAccount = await getStellarAPI().getAccount(sourcePublicKey);

            // 检查目标账户是否存在
            const destExists = await getStellarAPI().accountExists(params.destination);

            // 构建交易
            let transaction = new TransactionBuilder(sourceAccount, {
                fee: options?.fee || await this.getBaseFee(),
                networkPassphrase: this.networkPassphrase,
                timebounds: options?.timebounds,
            });

            // 如果目标账户不存在且发送的是XLM，使用createAccount操作
            if (!destExists && (!params.asset || params.asset.isNative())) {
                transaction = transaction.addOperation(
                    Operation.createAccount({
                        destination: params.destination,
                        startingBalance: params.amount,
                    })
                );
            } else {
                // 普通支付操作
                transaction = transaction.addOperation(
                    Operation.payment({
                        destination: params.destination,
                        asset: params.asset || Asset.native(),
                        amount: params.amount,
                    })
                );
            }

            // 添加备注
            if (params.memo) {
                transaction = transaction.addMemo(
                    this.createMemo(params.memo, params.memoType)
                );
            }

            const builtTransaction = transaction.setTimeout(30).build();

            // 签名交易
            const signedXdr = await wallet.signTransaction(builtTransaction, {
                networkPassphrase: this.networkPassphrase,
            });

            // 提交交易
            const transactionResult = await this.server.submitTransaction(
                TransactionBuilder.fromXDR(signedXdr, this.networkPassphrase)
            );

            return transactionResult.hash;
        } catch (error) {
            throw new Error(`Payment failed: ${error}`);
        }
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
