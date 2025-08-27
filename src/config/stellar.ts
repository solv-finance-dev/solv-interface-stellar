import { Networks } from '@stellar/stellar-sdk';

export interface StellarConfig {
    networkPassphrase: string;
    horizonUrl: string;
    network: 'testnet' | 'mainnet';
    baseFee: string;
    defaultTimeout: number;
}

// 测试网配置
const TESTNET_CONFIG: StellarConfig = {
    networkPassphrase: Networks.TESTNET,
    horizonUrl: 'https://horizon-testnet.stellar.org',
    network: 'testnet',
    baseFee: '100',
    defaultTimeout: 30,
};

// 主网配置
const MAINNET_CONFIG: StellarConfig = {
    networkPassphrase: Networks.PUBLIC,
    horizonUrl: 'https://horizon.stellar.org',
    network: 'mainnet',
    baseFee: '100',
    defaultTimeout: 30,
};

// 获取当前网络配置 (完全基于环境变量)
export function getStellarConfig(): StellarConfig {
    const currentNetwork = process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet';

    // 支持自定义 Horizon URL
    const customHorizonUrl = process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL;

    let config: StellarConfig;
    switch (currentNetwork) {
        case 'mainnet':
            config = { ...MAINNET_CONFIG };
            break;
        case 'testnet':
        default:
            config = { ...TESTNET_CONFIG };
            break;
    }

    // 如果设置了自定义 Horizon URL，则使用它
    if (customHorizonUrl) {
        config.horizonUrl = customHorizonUrl;
    }

    return config;
}

// 获取当前网络类型
export function getCurrentNetworkType(): 'testnet' | 'mainnet' {
    return (process.env.NEXT_PUBLIC_STELLAR_NETWORK as 'testnet' | 'mainnet') || 'testnet';
}

// 获取当前网络的 Networks 枚举值
export function getCurrentStellarNetwork(): Networks {
    const networkType = getCurrentNetworkType();
    return networkType === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET;
}

// 常用资产定义
export const STELLAR_ASSETS = {
    XLM: {
        code: 'XLM',
        issuer: null,
        native: true,
    },
    USDC: {
        code: 'USDC',
        issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN', // Testnet USDC issuer
        native: false,
    },
    // 可以添加更多资产
};

// 网络配置
export const NETWORK_CONFIG = {
    testnet: {
        name: 'Stellar Testnet',
        shortName: 'Testnet',
        chainId: 'testnet',
        currency: 'XLM',
        explorerUrl: 'https://stellar.expert/explorer/testnet',
        friendbotUrl: 'https://friendbot.stellar.org',
    },
    mainnet: {
        name: 'Stellar Mainnet',
        shortName: 'Mainnet',
        chainId: 'mainnet',
        currency: 'XLM',
        explorerUrl: 'https://stellar.expert/explorer/public',
        friendbotUrl: null,
    },
};

// 获取当前网络信息
export function getCurrentNetworkInfo() {
    const config = getStellarConfig();
    return NETWORK_CONFIG[config.network];
}

// 获取交易浏览器链接
export function getTransactionUrl(hash: string): string {
    const networkInfo = getCurrentNetworkInfo();
    return `${networkInfo.explorerUrl}/tx/${hash}`;
}

// 获取账户浏览器链接
export function getAccountUrl(publicKey: string): string {
    const networkInfo = getCurrentNetworkInfo();
    return `${networkInfo.explorerUrl}/account/${publicKey}`;
}

// 获取资产浏览器链接
export function getAssetUrl(assetCode: string, assetIssuer?: string): string {
    const networkInfo = getCurrentNetworkInfo();
    if (assetCode === 'XLM') {
        return `${networkInfo.explorerUrl}/asset/XLM`;
    }
    return `${networkInfo.explorerUrl}/asset/${assetCode}-${assetIssuer}`;
}

// Friendbot 相关（仅测试网）
export async function fundTestnetAccount(publicKey: string): Promise<boolean> {
    const config = getStellarConfig();
    const networkInfo = getCurrentNetworkInfo();

    if (config.network !== 'testnet' || !networkInfo.friendbotUrl) {
        throw new Error('Friendbot is only available on testnet');
    }

    try {
        const response = await fetch(`${networkInfo.friendbotUrl}?addr=${encodeURIComponent(publicKey)}`);
        return response.ok;
    } catch (error) {
        console.error('Failed to fund testnet account:', error);
        return false;
    }
}

// 验证网络连接
export async function validateNetworkConnection(): Promise<boolean> {
    try {
        const config = getStellarConfig();
        const response = await fetch(`${config.horizonUrl}/ledgers?limit=1`);
        return response.ok;
    } catch (error) {
        console.error('Network connection validation failed:', error);
        return false;
    }
}
