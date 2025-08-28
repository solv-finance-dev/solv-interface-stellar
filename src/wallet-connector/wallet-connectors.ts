import { Networks, Transaction } from '@stellar/stellar-sdk';
import {
  StellarWalletsKit,
  WalletNetwork,
} from '@creit.tech/stellar-wallets-kit';
import {
  WalletAdapter,
  WalletType,
  ConnectedWallet,
  WalletError,
  SignTransactionOptions,
  kitNetworkToStellarNetwork,
  stellarNetworkToKitNetwork,
} from './types';
import {
  createStellarWalletsKit,
  getWalletIdFromType,
  getWalletTypeFromId,
  getWalletDisplayName,
} from './wallet-config';

// Stellar Wallets Kit 适配器
export class StellarWalletsKitAdapter implements WalletAdapter {
  private kit: StellarWalletsKit;
  private connectedWallet: ConnectedWallet | null = null;
  private network: WalletNetwork;

  constructor(network: Networks = Networks.TESTNET) {
    this.network = stellarNetworkToKitNetwork(network);
    this.kit = createStellarWalletsKit(this.network);
  }

  // 获取底层的 StellarWalletsKit 实例
  getKit(): StellarWalletsKit {
    return this.kit;
  }

  async connect(): Promise<ConnectedWallet> {
    throw new WalletError(
      'Please use connectWallet(walletType) method instead'
    );
  }

  async connectWallet(walletType: WalletType): Promise<ConnectedWallet> {
    try {
      const walletId = getWalletIdFromType(walletType);

      // 设置选中的钱包
      await this.kit.setWallet(walletId);

      // 获取地址
      const { address } = await this.kit.getAddress();

      const connectedWallet: ConnectedWallet = {
        id: walletType,
        name: getWalletDisplayName(walletType),
        publicKey: address,
        address,
      };

      this.connectedWallet = connectedWallet;
      return connectedWallet;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to connect wallet';
      throw new WalletError(
        `Failed to connect ${getWalletDisplayName(walletType)}: ${errorMessage}`
      );
    }
  }

  async disconnect(): Promise<void> {
    try {
      // Stellar Wallets Kit 没有显式的 disconnect 方法
      // 我们只需要清除本地状态
      this.connectedWallet = null;
    } catch (error) {
      console.warn('Error during wallet disconnect:', error);
    }
  }

  async signTransaction(
    transaction: Transaction,
    opts?: SignTransactionOptions
  ): Promise<string> {
    if (!this.connectedWallet) {
      throw new WalletError('Wallet not connected');
    }

    try {
      const networkPassphrase =
        opts?.networkPassphrase || kitNetworkToStellarNetwork(this.network);

      const { signedTxXdr } = await this.kit.signTransaction(
        transaction.toXDR(),
        {
          address: this.connectedWallet.address,
          networkPassphrase,
        }
      );

      return signedTxXdr;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to sign transaction';
      throw new WalletError(`Failed to sign transaction: ${errorMessage}`);
    }
  }

  async signMessage?(message: string): Promise<string> {
    if (!this.connectedWallet) {
      throw new WalletError('Wallet not connected');
    }

    try {
      // 注意：不是所有钱包都支持消息签名
      // Stellar Wallets Kit 可能需要单独处理
      throw new WalletError(
        'Message signing not implemented in Stellar Wallets Kit'
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to sign message';
      throw new WalletError(`Failed to sign message: ${errorMessage}`);
    }
  }

  isConnected(): boolean {
    return this.connectedWallet !== null;
  }

  getPublicKey(): string | null {
    return this.connectedWallet?.publicKey || null;
  }

  getConnectedWallet(): ConnectedWallet | null {
    return this.connectedWallet;
  }

  // 获取支持的钱包列表
  getSupportedWallets() {
    return this.kit.getSupportedWallets();
  }

  // 设置网络
  setNetwork(network: Networks) {
    this.network = stellarNetworkToKitNetwork(network);
    // 重新创建 kit 实例
    this.kit = createStellarWalletsKit(this.network);
    // 清除连接状态，因为网络已变更
    this.connectedWallet = null;
  }

  // 获取当前网络
  getNetwork(): Networks {
    return kitNetworkToStellarNetwork(this.network);
  }

  // 打开钱包选择模态框
  async openModal(options: {
    onWalletSelected: (walletType: WalletType) => void;
    onClosed?: (error?: Error) => void;
    modalTitle?: string;
    notAvailableText?: string;
  }): Promise<void> {
    try {
      await this.kit.openModal({
        onWalletSelected: (supportedWallet: any) => {
          const walletType = getWalletTypeFromId(supportedWallet.id);
          if (walletType) {
            options.onWalletSelected(walletType);
          }
        },
        onClosed: options.onClosed,
        modalTitle: options.modalTitle,
        notAvailableText: options.notAvailableText,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to open modal';
      throw new WalletError(`Failed to open wallet modal: ${errorMessage}`);
    }
  }

  // 创建连接按钮
  async createButton(params: {
    container: HTMLElement;
    onConnect: (response: { address: string; walletType: WalletType }) => void;
    onDisconnect: () => void;
    horizonUrl?: string;
    buttonText?: string;
  }): Promise<void> {
    try {
      await this.kit.createButton({
        container: params.container,
        onConnect: ({ address }: { address: string }) => {
          // 从当前连接的钱包获取类型
          const walletType = this.connectedWallet?.id || WalletType.XBULL;
          params.onConnect({ address, walletType });
        },
        onDisconnect: params.onDisconnect,
        horizonUrl: params.horizonUrl,
        buttonText: params.buttonText,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create button';
      throw new WalletError(`Failed to create wallet button: ${errorMessage}`);
    }
  }
}

// 全局适配器实例
let globalAdapter: StellarWalletsKitAdapter | null = null;

// 创建钱包适配器
export function createWalletAdapter(
  network: Networks = Networks.TESTNET
): StellarWalletsKitAdapter {
  if (!globalAdapter) {
    globalAdapter = new StellarWalletsKitAdapter(network);
  } else {
    // 如果网络不同，更新网络
    if (globalAdapter.getNetwork() !== network) {
      globalAdapter.setNetwork(network);
    }
  }
  return globalAdapter;
}

// 获取当前钱包适配器实例
export function getWalletAdapter(): StellarWalletsKitAdapter | null {
  return globalAdapter;
}

// 重置适配器（用于清理）
export function resetWalletAdapter(): void {
  globalAdapter = null;
}

// 向后兼容的方法
export function connectWallet(
  walletType: WalletType,
  network: Networks = Networks.TESTNET
): Promise<ConnectedWallet> {
  const adapter = createWalletAdapter(network);
  return adapter.connectWallet(walletType);
}

// 用于直接使用 Stellar Wallets Kit 的辅助方法
export class StellarWalletsKitHelper {
  static async openWalletModal(
    network: Networks = Networks.TESTNET,
    onWalletSelected: (walletType: WalletType) => void,
    options?: {
      onClosed?: (error?: Error) => void;
      modalTitle?: string;
      notAvailableText?: string;
    }
  ): Promise<void> {
    const adapter = createWalletAdapter(network);
    await adapter.openModal({
      onWalletSelected,
      ...options,
    });
  }

  static async createWalletButton(
    container: HTMLElement,
    network: Networks = Networks.TESTNET,
    onConnect: (response: { address: string; walletType: WalletType }) => void,
    onDisconnect: () => void,
    options?: {
      horizonUrl?: string;
      buttonText?: string;
    }
  ): Promise<void> {
    const adapter = createWalletAdapter(network);
    await adapter.createButton({
      container,
      onConnect,
      onDisconnect,
      ...options,
    });
  }
}

// 导出常用的类和函数
export {
  StellarWalletsKitAdapter as WalletAdapter,
  WalletError,
  type ConnectedWallet,
  type WalletType,
  type SignTransactionOptions,
};
