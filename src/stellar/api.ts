import {
    Horizon,
    Asset,
} from '@stellar/stellar-sdk';
// AccountResponse is now directly available from the main Horizon namespace
import { getStellarConfig } from '@/config/stellar';

export class StellarAPI {
    private server: Horizon.Server;
    private config: { horizonUrl: string; network: string };

    constructor() {
        this.config = getStellarConfig();
        this.server = new Horizon.Server(this.config.horizonUrl);
    }

    // 获取当前网络配置
    getConfig() {
        return this.config;
    }

    // 检查是否为测试网
    isTestnet(): boolean {
        return this.config.network === 'testnet';
    }

    /**
     * 获取账户信息
     */
    async getAccount(publicKey: string): Promise<Horizon.AccountResponse> {
        try {
            return await this.server.loadAccount(publicKey);
        } catch (error) {
            throw new Error(`Failed to load account: ${error}`);
        }
    }

    /**
     * 获取账户余额
     */
    async getAccountBalances(publicKey: string): Promise<Horizon.HorizonApi.BalanceLine[]> {
        try {
            const account = await this.getAccount(publicKey);
            return account.balances;
        } catch (error) {
            throw new Error(`Failed to get account balances: ${error}`);
        }
    }

    /**
     * 获取原生 XLM 余额
     */
    async getXLMBalance(publicKey: string): Promise<string> {
        try {
            const balances = await this.getAccountBalances(publicKey);
            const xlmBalance = balances.find(balance => balance.asset_type === 'native');
            return xlmBalance?.balance || '0';
        } catch (error) {
            throw new Error(`Failed to get XLM balance: ${error}`);
        }
    }

    /**
     * 获取资产余额
     */
    async getAssetBalance(
        publicKey: string,
        assetCode: string,
        assetIssuer?: string
    ): Promise<string> {
        try {
            const balances = await this.getAccountBalances(publicKey);
            const assetBalance = balances.find(balance => {
                if (balance.asset_type === 'native') {
                    return assetCode === 'XLM';
                }
                if (balance.asset_type === 'credit_alphanum4' || balance.asset_type === 'credit_alphanum12') {
                    return balance.asset_code === assetCode &&
                        (!assetIssuer || balance.asset_issuer === assetIssuer);
                }
                return false;
            });
            return assetBalance?.balance || '0';
        } catch (error) {
            throw new Error(`Failed to get asset balance: ${error}`);
        }
    }

    /**
     * 获取支付历史
     */
    async getPayments(
        publicKey: string,
        limit: number = 10,
        cursor?: string
    ): Promise<Horizon.ServerApi.CollectionPage<Horizon.ServerApi.PaymentOperationRecord | Horizon.ServerApi.CreateAccountOperationRecord | Horizon.ServerApi.AccountMergeOperationRecord | Horizon.ServerApi.PathPaymentOperationRecord | Horizon.ServerApi.PathPaymentStrictSendOperationRecord | Horizon.ServerApi.InvokeHostFunctionOperationRecord>> {
        try {
            let call = this.server.payments()
                .forAccount(publicKey)
                .order('desc')
                .limit(limit);

            if (cursor) {
                call = call.cursor(cursor);
            }

            return await call.call();
        } catch (error) {
            throw new Error(`Failed to get payments: ${error}`);
        }
    }

    /**
     * 检查账户是否存在
     */
    async accountExists(publicKey: string): Promise<boolean> {
        try {
            await this.getAccount(publicKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * 获取网络费用统计
     */
    async getFeeStats(): Promise<Horizon.HorizonApi.FeeStatsResponse> {
        try {
            return await this.server.feeStats();
        } catch (err) {
            throw new Error(`Failed to get fee stats: ${err}`);
        }
    }

    /**
     * 获取资产信息
     */
    async getAssets(
        assetCode?: string,
        assetIssuer?: string,
        limit: number = 10
    ): Promise<Horizon.ServerApi.CollectionPage<Horizon.ServerApi.AssetRecord>> {
        try {
            let call = this.server.assets().limit(limit);

            if (assetCode) {
                call = call.forCode(assetCode);
            }

            if (assetIssuer) {
                call = call.forIssuer(assetIssuer);
            }

            return await call.call();
        } catch (error) {
            throw new Error(`Failed to get assets: ${error}`);
        }
    }

    /**
     * 获取订单簿
     */
    async getOrderbook(
        sellingAsset: Asset,
        buyingAsset: Asset,
        limit: number = 10
    ): Promise<Horizon.ServerApi.OrderbookRecord> {
        try {
            return await this.server.orderbook(sellingAsset, buyingAsset)
                .limit(limit)
                .call();
        } catch (error) {
            throw new Error(`Failed to get orderbook: ${error}`);
        }
    }

    /**
     * 获取路径支付信息
     */
    async getStrictSendPaths(
        sourceAsset: Asset,
        sourceAmount: string,
        destination: Asset[]
    ): Promise<Horizon.ServerApi.CollectionPage<Horizon.ServerApi.PaymentPathRecord>> {
        try {
            return await this.server.strictSendPaths(sourceAsset, sourceAmount, destination).call();
        } catch (error) {
            throw new Error(`Failed to get strict send paths: ${error}`);
        }
    }

    /**
     * 获取路径接收信息
     */
    async getStrictReceivePaths(
        sourceAccount: string | Asset[],
        destinationAsset: Asset,
        destinationAmount: string
    ): Promise<Horizon.ServerApi.CollectionPage<Horizon.ServerApi.PaymentPathRecord>> {
        try {
            return await this.server.strictReceivePaths(sourceAccount, destinationAsset, destinationAmount).call();
        } catch (error) {
            throw new Error(`Failed to get strict receive paths: ${error}`);
        }
    }
}

// 创建单例实例
let stellarAPI: StellarAPI;

export function getStellarAPI(): StellarAPI {
    if (!stellarAPI) {
        stellarAPI = new StellarAPI();
    }
    return stellarAPI;
}
