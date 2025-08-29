import {
  Transaction,
  TransactionBuilder,
  FeeBumpTransaction,
} from '@stellar/stellar-sdk';
import { WalletAdapter, ConnectedWallet, WalletError } from './types';

/**
 * Wallet Signer Proxy Class
 * Uses proxy pattern, internally holds reference to current wallet adapter
 * When wallet switches, only need to update internal reference, no need to recreate contract client
 */
export class WalletSignerProxy {
  private walletAdapter: WalletAdapter | null = null;
  private connectedWallet: ConnectedWallet | null = null;

  constructor() {
    this.signTransaction = this.signTransaction.bind(this);
  }

  /**
   * Update wallet adapter reference
   */
  updateWallet(
    walletAdapter: WalletAdapter | null,
    connectedWallet: ConnectedWallet | null
  ) {
    this.walletAdapter = walletAdapter;
    this.connectedWallet = connectedWallet;
  }

  /**
   * Sign transaction method - conforms to Soroban SDK's SignTransaction interface
   */
  async signTransaction(txXdr: string): Promise<{
    signedTxXdr: string;
    signerAddress?: string;
  }> {
    if (!this.walletAdapter || !this.connectedWallet) {
      throw new WalletError(
        'No wallet connected or wallet adapter not available'
      );
    }

    try {
      // Parse XDR to Transaction object
      const parsedTx = TransactionBuilder.fromXDR(
        txXdr,
        this.getNetworkPassphrase()
      );

      // Handle FeeBumpTransaction case
      let transaction: Transaction;
      if (parsedTx instanceof FeeBumpTransaction) {
        transaction = parsedTx.innerTransaction;
      } else {
        transaction = parsedTx;
      }

      // Use wallet adapter's signTransaction method
      const signedTxXdr = await this.walletAdapter.signTransaction(
        transaction,
        {
          networkPassphrase: this.getNetworkPassphrase(),
          accountToSign: this.connectedWallet.publicKey,
        }
      );

      return {
        signedTxXdr,
        signerAddress: this.connectedWallet.publicKey,
      };
    } catch (error) {
      console.error('WalletSignerProxy: Failed to sign transaction', error);
      throw new WalletError(
        `Failed to sign transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Check if there's an available wallet
   */
  isWalletAvailable(): boolean {
    return !!(
      this.walletAdapter &&
      this.connectedWallet &&
      this.walletAdapter.isConnected()
    );
  }

  /**
   * Get current wallet information
   */
  getCurrentWallet(): ConnectedWallet | null {
    return this.connectedWallet;
  }

  /**
   * Get network passphrase - get from configuration
   */
  private getNetworkPassphrase(): string {
    // Import configuration function to get current network
    const { getCurrentStellarNetwork } = require('@/config/stellar');
    return getCurrentStellarNetwork();
  }
}

// Global singleton instance
let globalWalletSignerProxy: WalletSignerProxy | null = null;

/**
 * Get global wallet signer proxy instance
 */
export function getWalletSignerProxy(): WalletSignerProxy {
  if (!globalWalletSignerProxy) {
    globalWalletSignerProxy = new WalletSignerProxy();
  }
  return globalWalletSignerProxy;
}

/**
 * Reset global wallet signer proxy
 */
export function resetWalletSignerProxy(): void {
  globalWalletSignerProxy = null;
}
