import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  WalletType,
  ConnectedWallet,
  createWalletAdapter,
  getAvailableWallets,
  WalletInfo,
  StellarWalletsKitAdapter,
} from '@/wallet-connector';
// 移除 WalletSignerProxy 导入，不再使用复杂的代理模式
import { getStellarAPI } from '@/stellar';
import {
  getCurrentStellarNetwork,
  getCurrentNetworkType,
} from '@/config/stellar';
import { Horizon } from '@stellar/stellar-sdk';

export interface WalletState {
  // 连接状态
  isConnected: boolean;
  isConnecting: boolean;
  connectedWallet: ConnectedWallet | null;
  walletAdapter: StellarWalletsKitAdapter | null;

  // 账户信息
  accountInfo: Horizon.AccountResponse | null;
  balances: Horizon.HorizonApi.BalanceLine[];
  xlmBalance: string;

  // 可用钱包
  availableWallets: WalletInfo[];

  // 错误状态
  error: string | null;

  // 加载状态
  isLoadingAccount: boolean;
  isLoadingBalances: boolean;
}

export interface WalletActions {
  // 钱包连接
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  validateAndFixWalletConnection: () => Promise<boolean>;

  // 数据刷新
  refreshAccountInfo: () => Promise<void>;
  refreshBalances: () => Promise<void>;

  // 错误处理
  setError: (error: string | null) => void;
  clearError: () => void;

  // 初始化
  initializeWallets: () => void;

  // 模态框管理
  openWalletModal: (
    onWalletSelected?: (walletType: WalletType) => void
  ) => Promise<void>;

  // 重置状态
  reset: () => void;
}

type WalletStore = WalletState & WalletActions;

const initialState: WalletState = {
  isConnected: false,
  isConnecting: false,
  connectedWallet: null,
  walletAdapter: null,
  accountInfo: null,
  balances: [],
  xlmBalance: '0',
  availableWallets: [],
  error: null,
  isLoadingAccount: false,
  isLoadingBalances: false,
};

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      connectWallet: async (walletType: WalletType) => {
        const { setError } = get();

        try {
          set({ isConnecting: true, error: null });

          // 创建或获取适配器 (使用环境变量配置的网络)
          const network = getCurrentStellarNetwork();
          const adapter = createWalletAdapter(network);

          // 连接指定钱包
          const connectedWallet = await adapter.connectWallet(walletType);

          set({
            isConnected: true,
            isConnecting: false,
            connectedWallet,
            walletAdapter: adapter,
          });

          console.log('✅ Wallet connected:', {
            walletType: connectedWallet.id,
            publicKey: connectedWallet.publicKey,
          });

          // 批量更新所有 contract client 的签名器
          try {
            const { updateAllClientsSignTransaction } = await import('@/states/contract-store');
            await updateAllClientsSignTransaction(adapter, connectedWallet);
            console.log('✅ All clients signTransaction updated for connected wallet');
          } catch (updateError) {
            console.warn('Failed to update clients signTransaction:', updateError);
          }

          // 立即加载账户信息
          await get().refreshAccountInfo();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to connect wallet';
          setError(errorMessage);
          set({ isConnecting: false });
          throw error;
        }
      },

      disconnectWallet: async () => {
        const { walletAdapter } = get();

        try {
          if (walletAdapter) {
            await walletAdapter.disconnect();
          }
        } catch (error) {
          console.warn('Error during wallet disconnect:', error);
        } finally {
          // 清除所有 contract client 的签名器
          try {
            const { clearAllClientsSignTransaction } = await import('@/states/contract-store');
            clearAllClientsSignTransaction();
            console.log('✅ All clients signTransaction cleared');
          } catch (clearError) {
            console.warn('Failed to clear clients signTransaction:', clearError);
          }

          set({
            isConnected: false,
            isConnecting: false,
            connectedWallet: null,
            walletAdapter: null,
            accountInfo: null,
            balances: [],
            xlmBalance: '0',
            error: null,
            isLoadingAccount: false,
            isLoadingBalances: false,
          });

          console.log('🔌 Wallet disconnected');
        }
      },

      // 检测并修复钱包连接状态不一致问题
      validateAndFixWalletConnection: async () => {
        const { isConnected, connectedWallet, walletAdapter } = get();

        console.log('🔍 Validating wallet connection state...', {
          globalIsConnected: isConnected,
          hasConnectedWallet: !!connectedWallet,
          hasWalletAdapter: !!walletAdapter,
          walletAdapterIsConnected: walletAdapter?.isConnected?.(),
        });

        // 检测状态不一致：全局状态说已连接，但适配器说未连接
        if (isConnected && connectedWallet && walletAdapter && !walletAdapter.isConnected?.()) {
          console.log('⚠️ Detected wallet state inconsistency after page refresh');
          console.log('🔄 Attempting to re-establish wallet connection...');

          try {
            // 尝试重新连接相同的钱包
            const { connectWallet } = get();
            await connectWallet(connectedWallet.id as any);
            console.log('✅ Wallet connection re-established successfully');
            return true;
          } catch (reconnectError) {
            console.error('❌ Failed to re-establish wallet connection:', reconnectError);
            // 清除不一致的状态
            const { disconnectWallet } = get();
            await disconnectWallet();
            return false;
          }
        }

        // 状态一致，无需处理
        if (isConnected && connectedWallet && walletAdapter?.isConnected?.()) {
          console.log('✅ Wallet connection state is consistent');
          return true;
        }

        // 全局状态说未连接，这是正常的
        if (!isConnected) {
          console.log('ℹ️ Wallet is not connected (normal state)');
          return false;
        }

        return false;
      },

      refreshAccountInfo: async () => {
        const { connectedWallet, setError } = get();

        if (!connectedWallet) {
          setError('No wallet connected');
          return;
        }

        try {
          set({ isLoadingAccount: true, error: null });

          const stellarAPI = getStellarAPI();
          const accountInfo = await stellarAPI.getAccount(
            connectedWallet.publicKey
          );

          set({
            accountInfo,
            isLoadingAccount: false,
          });

          // 同时刷新余额
          await get().refreshBalances();
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to load account info';
          console.error('❌ Failed to load account info:', errorMessage);
          setError(errorMessage);
          set({ isLoadingAccount: false });
        }
      },

      refreshBalances: async () => {
        const { connectedWallet, setError } = get();

        if (!connectedWallet) {
          setError('No wallet connected');
          return;
        }

        try {
          set({ isLoadingBalances: true, error: null });

          const stellarAPI = getStellarAPI();
          const balances = await stellarAPI.getAccountBalances(
            connectedWallet.publicKey
          );
          const xlmBalance = await stellarAPI.getXLMBalance(
            connectedWallet.publicKey
          );

          const networkType = getCurrentNetworkType();
          console.log(`💰 Balances loaded for ${networkType}:`, {
            publicKey: connectedWallet.publicKey,
            xlmBalance,
            totalBalances: balances.length,
            network: stellarAPI.isTestnet() ? 'Testnet' : 'Mainnet',
            horizonUrl: stellarAPI.getConfig().horizonUrl,
          });

          set({
            balances,
            xlmBalance,
            isLoadingBalances: false,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to load balances';
          console.error('❌ Failed to load balances:', errorMessage);
          setError(errorMessage);
          set({ isLoadingBalances: false });
        }
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      initializeWallets: async () => {
        const network = getCurrentStellarNetwork();
        const adapter = createWalletAdapter(network);
        const availableWallets = await getAvailableWallets(adapter.getKit());
        set({ availableWallets, walletAdapter: adapter });
      },

      openWalletModal: async (
        onWalletSelected?: (walletType: WalletType) => void
      ) => {
        const { walletAdapter, connectWallet, setError } = get();

        // 如果 walletAdapter 不存在，重新创建一个
        let adapter = walletAdapter;
        if (!adapter) {
          try {
            const network = getCurrentStellarNetwork();
            adapter = createWalletAdapter(network);
            set({ walletAdapter: adapter });
          } catch (error) {
            setError('Failed to initialize wallet adapter');
            return;
          }
        }

        try {
          await adapter.openModal({
            onWalletSelected: async (walletType: WalletType) => {
              try {
                await connectWallet(walletType);
                if (onWalletSelected) {
                  onWalletSelected(walletType);
                }
              } catch (error) {
                console.error('Failed to connect wallet from modal:', error);
              }
            },
            onClosed: (error?: Error) => {
              if (error) {
                setError(error.message);
              }
            },
            modalTitle: 'Connect Your Wallet',
            notAvailableText:
              'Wallet not available. Please install the wallet extension.',
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to open wallet modal';
          setError(errorMessage);
        }
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'stellar-wallet-storage',
      partialize: state => ({
        // 只持久化必要的状态
        connectedWallet: state.connectedWallet,
        isConnected: state.isConnected,
      }),
    }
  )
);

// 订阅器用于自动刷新数据
let refreshInterval: NodeJS.Timeout | null = null;

// 启动自动刷新
export const startAutoRefresh = (intervalMs: number = 30000) => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }

  refreshInterval = setInterval(() => {
    const { isConnected, refreshBalances } = useWalletStore.getState();
    if (isConnected) {
      refreshBalances();
    }
  }, intervalMs);
};

// 停止自动刷新
export const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

// 监听钱包连接状态变化
let previousConnected = false;
useWalletStore.subscribe(state => {
  if (state.isConnected !== previousConnected) {
    if (state.isConnected) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
    previousConnected = state.isConnected;
  }
});
