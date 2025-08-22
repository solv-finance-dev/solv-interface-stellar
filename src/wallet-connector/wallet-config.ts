import {
    FREIGHTER_ID,
    XBULL_ID,
    ALBEDO_ID,
    LOBSTR_ID,
    RABET_ID,
    HANA_ID,
    HOTWALLET_ID,
    allowAllModules,
    StellarWalletsKit,
    WalletNetwork,
    ISupportedWallet
} from '@creit.tech/stellar-wallets-kit';
import { WalletInfo, WalletType } from './types';

// 钱包ID映射
export const WALLET_ID_MAP = {
    [WalletType.FREIGHTER]: FREIGHTER_ID,
    [WalletType.XBULL]: XBULL_ID,
    [WalletType.ALBEDO]: ALBEDO_ID,
    [WalletType.LOBSTR]: LOBSTR_ID,
    [WalletType.RABET]: RABET_ID,
    [WalletType.HANA]: HANA_ID,
    [WalletType.WALLETCONNECT]: 'walletconnect', // 使用字符串常量
    [WalletType.HOTWALLET]: HOTWALLET_ID,
};

// 反向映射
export const ID_WALLET_MAP: Record<string, WalletType> = {};
Object.entries(WALLET_ID_MAP).forEach(([walletType, id]) => {
    ID_WALLET_MAP[id] = walletType as WalletType;
});

export const SUPPORTED_WALLETS: WalletInfo[] = [
    {
        id: WalletType.FREIGHTER,
        name: 'Freighter',
        icon: '/icons/freighter.svg',
        url: 'https://freighter.app/',
    },
    {
        id: WalletType.XBULL,
        name: 'xBull',
        icon: '/icons/xbull.svg',
        url: 'https://xbull.app/',
    },
    {
        id: WalletType.ALBEDO,
        name: 'Albedo',
        icon: '/icons/albedo.svg',
        url: 'https://albedo.link/',
    },
    {
        id: WalletType.LOBSTR,
        name: 'LOBSTR',
        icon: '/icons/lobstr.svg',
        url: 'https://lobstr.co/',
    },
    {
        id: WalletType.RABET,
        name: 'Rabet',
        icon: '/icons/rabet.svg',
        url: 'https://rabet.io/',
    },
    {
        id: WalletType.HANA,
        name: 'Hana Wallet',
        icon: '/icons/hana.svg',
        url: 'https://hanawallet.io/',
    },
    {
        id: WalletType.WALLETCONNECT,
        name: 'WalletConnect',
        icon: '/icons/walletconnect.svg',
        url: 'https://walletconnect.com/',
    },
    {
        id: WalletType.HOTWALLET,
        name: 'Hot Wallet',
        icon: '/icons/hotwallet.svg',
        url: '#',
    },
];

export function getWalletInfo(walletType: WalletType): WalletInfo | undefined {
    return SUPPORTED_WALLETS.find(wallet => wallet.id === walletType);
}

export function getWalletTypeFromId(walletId: string): WalletType | undefined {
    return ID_WALLET_MAP[walletId] as WalletType;
}

export function getWalletIdFromType(walletType: WalletType): string {
    return WALLET_ID_MAP[walletType];
}

// 创建 Stellar Wallets Kit 实例
export function createStellarWalletsKit(network: WalletNetwork): StellarWalletsKit {
    return new StellarWalletsKit({
        network,
        selectedWalletId: XBULL_ID, // 默认选择 xBull
        modules: allowAllModules(),
    });
}

// 获取可用钱包列表
export async function getAvailableWallets(kit: StellarWalletsKit): Promise<WalletInfo[]> {
    const supportedWallets = await kit.getSupportedWallets();

    return SUPPORTED_WALLETS.map(wallet => {
        const supportedWallet = supportedWallets.find((sw: ISupportedWallet) =>
            getWalletIdFromType(wallet.id) === sw.id
        );

        return {
            ...wallet,
            isInstalled: supportedWallet?.isAvailable || false,
            supportedWallet,
        };
    }).filter(wallet => wallet.supportedWallet); // 只返回库支持的钱包
}

// 检查钱包是否已安装
export async function isWalletInstalled(walletType: WalletType, kit: StellarWalletsKit): Promise<boolean> {
    const walletId = getWalletIdFromType(walletType);
    const supportedWallets = await kit.getSupportedWallets();
    const supportedWallet = supportedWallets.find((sw: ISupportedWallet) => sw.id === walletId);
    return supportedWallet?.isAvailable || false;
}

// 获取钱包的显示名称
export function getWalletDisplayName(walletType: WalletType): string {
    const walletInfo = getWalletInfo(walletType);
    return walletInfo?.name || walletType.toString();
}

// 验证钱包类型
export function isValidWalletType(walletType: string): walletType is WalletType {
    return (Object.values(WalletType) as string[]).includes(walletType);
}