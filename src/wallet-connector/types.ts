import { Networks, Transaction } from '@stellar/stellar-sdk';
import { ISupportedWallet, WalletNetwork } from '@creit.tech/stellar-wallets-kit';

export enum WalletType {
    FREIGHTER = 'freighter',
    XBULL = 'xbull',
    ALBEDO = 'albedo',
    LOBSTR = 'lobstr',
    RABET = 'rabet',
    HANA = 'hana',
    WALLETCONNECT = 'walletconnect',
    HOTWALLET = 'hotwallet',
}

export interface WalletInfo {
    id: WalletType;
    name: string;
    icon: string;
    url: string;
    isInstalled?: boolean;
    supportedWallet?: ISupportedWallet;
}

export interface ConnectedWallet {
    id: WalletType;
    name: string;
    publicKey: string;
    address: string;
}

export interface WalletAdapter {
    connect(): Promise<ConnectedWallet>;
    disconnect(): Promise<void>;
    signTransaction(transaction: Transaction, opts?: {
        network?: Networks;
        networkPassphrase?: string;
        accountToSign?: string;
    }): Promise<string>;
    signMessage?(message: string): Promise<string>;
    isConnected(): boolean;
    getPublicKey(): string | null;
}

export interface WalletConnectionResult {
    publicKey: string;
    address: string;
}

export class WalletError extends Error {
    code?: string;
    details?: any;

    constructor(message: string, code?: string, details?: any) {
        super(message);
        this.name = 'WalletError';
        this.code = code;
        this.details = details;
    }
}

export interface SignTransactionOptions {
    network?: Networks;
    networkPassphrase?: string;
    accountToSign?: string;
}

export interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    onWalletSelect: (walletType: WalletType) => Promise<void>;
    availableWallets: WalletInfo[];
    isConnecting: boolean;
    error?: string;
}

// Stellar Wallets Kit types re-export
export type { ISupportedWallet, WalletNetwork };

// Helper function to convert kit network to stellar-sdk network
export function kitNetworkToStellarNetwork(network: WalletNetwork): Networks {
    switch (network) {
        case WalletNetwork.PUBLIC:
            return Networks.PUBLIC;
        case WalletNetwork.TESTNET:
            return Networks.TESTNET;
        default:
            return Networks.TESTNET;
    }
}

// Helper function to convert stellar-sdk network to kit network
export function stellarNetworkToKitNetwork(network: Networks): WalletNetwork {
    switch (network) {
        case Networks.PUBLIC:
            return WalletNetwork.PUBLIC;
        case Networks.TESTNET:
            return WalletNetwork.TESTNET;
        default:
            return WalletNetwork.TESTNET;
    }
}