export * from './types';
export * from './wallet-connectors';
export * from './wallet-config';

// Re-export commonly used items from types
export {
    WalletType,
    type WalletAdapter,
    type ConnectedWallet,
    type WalletInfo,
    WalletError,
    type ISupportedWallet,

    kitNetworkToStellarNetwork,
    stellarNetworkToKitNetwork,
} from './types';

// Re-export commonly used items from wallet-connectors
export {
    StellarWalletsKitAdapter,
    createWalletAdapter,
    getWalletAdapter,
    resetWalletAdapter,
    connectWallet,
    StellarWalletsKitHelper,
} from './wallet-connectors';

// Re-export commonly used items from wallet-config
export {
    SUPPORTED_WALLETS,
    WALLET_ID_MAP,
    ID_WALLET_MAP,
    getWalletInfo,
    getWalletTypeFromId,
    getWalletIdFromType,
    createStellarWalletsKit,
    getAvailableWallets,
    isWalletInstalled,
    getWalletDisplayName,
    isValidWalletType,
} from './wallet-config';

// Re-export Stellar Wallets Kit types and constants
export {
    FREIGHTER_ID,
    XBULL_ID,
    ALBEDO_ID,
    LOBSTR_ID,
    RABET_ID,
    HANA_ID,
    HOTWALLET_ID,
    WalletNetwork,
    allowAllModules,
} from '@creit.tech/stellar-wallets-kit';