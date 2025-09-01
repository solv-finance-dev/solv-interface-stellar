import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client as ContractClient } from '@stellar/stellar-sdk/contract';

import { SolvBTCVaultClient } from '@/contracts/solvBTCVaultContract/src';
import { SolvBTCTokenClient } from '@/contracts/solvBTCTokenContract/src';
import { getCurrentStellarNetwork } from '@/config/stellar';
import { TransactionBuilder, FeeBumpTransaction } from '@stellar/stellar-sdk';
import { useWalletStore } from '@/states/wallet-store';
import { StellarWalletsKitAdapter, ConnectedWallet } from '@/wallet-connector';
import useSolvBtcStore from './solvbtc';

// Contract client configuration type definition
export interface ContractClientConfig {
  networkPassphrase: string;
  rpcUrl: string;
  contractId: string;
}

// Contract client constructor type
export type ContractClientConstructor = new (
  config: ContractClientConfig
) => ContractClient;

// Contract client state
export interface ContractState {
  // Map of all contract clients - key is class name, value is instance
  clients: Map<string, ContractClient>;

  // Map of contract initialization status - key is class name, value is initialization status
  initializedClients: Map<string, boolean>;

  // Loading status
  isInitializing: boolean;

  // Error status
  initError: string | null;
}

// Contract client operations
export interface ContractActions {
  // Initialize all contract clients
  initializeContracts: () => Promise<void>;

  // Initialize specific contract client - by class name
  initializeClient: (
    clientName: string,
    config?: ContractClientConfig
  ) => Promise<void>;

  // Generic method to get contract client
  getClient: <T extends ContractClient = ContractClient>(
    clientName: string
  ) => T | null;

  // Generic method to set contract client
  setClient: (clientName: string, client: ContractClient) => void;

  // Check if contract is initialized
  isClientInitialized: (clientName: string) => boolean;

  // Reset all contract clients
  resetContracts: () => void;

  // Reset specific contract client
  resetClient: (clientName: string) => void;

  // Error handling
  setInitError: (error: string | null) => void;
  clearInitError: () => void;

  // Get all client names
  getClientNames: () => string[];
}

type ContractStore = ContractState & ContractActions;

// Registered contract client types
const registeredClientTypes: Map<
  string,
  {
    constructor: ContractClientConstructor;
    defaultConfig?: Partial<ContractClientConfig>;
  }
> = new Map();

const initialState: ContractState = {
  clients: new Map(),
  initializedClients: new Map(),
  isInitializing: false,
  initError: null,
};

export const useContractStore = create<ContractStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      initializeContracts: async () => {
        const { setInitError } = get();

        try {
          set({ isInitializing: true, initError: null });

          // Initialize all registered contract clients
          const initPromises = Array.from(registeredClientTypes.keys()).map(
            clientName => get().initializeClient(clientName)
          );

          await Promise.all(initPromises);

          set({ isInitializing: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to initialize contracts';
          console.error('❌ Failed to initialize contracts:', errorMessage);
          setInitError(errorMessage);
          set({ isInitializing: false });
        }
      },

      initializeClient: async (
        clientName: string,
        config?: ContractClientConfig
      ) => {
        const { setInitError, setClient } = get();

        try {
          // Get registered client type
          const registeredType = registeredClientTypes.get(clientName);
          if (!registeredType) {
            throw new Error(`Client type '${clientName}' is not registered`);
          }

          // Use passed configuration or default configuration
          const clientConfig: ContractClientConfig = {
            networkPassphrase: getCurrentStellarNetwork(),
            rpcUrl: config?.rpcUrl || process.env.NEXT_PUBLIC_STELLAR_RPC_URL!,
            contractId: getDefaultContractId(clientName),
            ...registeredType.defaultConfig,
            ...config,
          };

          // Validate required configuration
          if (!clientConfig.rpcUrl) {
            throw new Error(
              'NEXT_PUBLIC_STELLAR_RPC_URL environment variable is required'
            );
          }
          if (!clientConfig.contractId) {
            throw new Error(`Contract ID for ${clientName} is required`);
          }

          // Create client instance - 简单配置，不注入 signTransaction
          const clientOptions: any = {
            contractId: clientConfig.contractId,
            networkPassphrase: clientConfig.networkPassphrase,
            rpcUrl: clientConfig.rpcUrl,
            allowHttp: true,
            // 不注入 signTransaction，让每次调用时自己处理
          };

          const client = new registeredType.constructor(clientOptions);

          // Set client
          setClient(clientName, client);

        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : `Failed to initialize ${clientName}`;
          console.error(`❌ Failed to initialize ${clientName}:`, errorMessage);
          setInitError(errorMessage);

          // Reset this client
          get().resetClient(clientName);
          throw error;
        }
      },

      getClient: <T extends ContractClient = ContractClient>(
        clientName: string
      ): T | null => {
        const { clients } = get();
        return (clients.get(clientName) as T) || null;
      },

      setClient: (clientName: string, client: ContractClient) => {
        set(state => {
          const newClients = new Map(state.clients);
          const newInitialized = new Map(state.initializedClients);

          newClients.set(clientName, client);
          newInitialized.set(clientName, true);

          return {
            clients: newClients,
            initializedClients: newInitialized,
            initError: null,
          };
        });
      },

      isClientInitialized: (clientName: string): boolean => {
        const { initializedClients } = get();
        return initializedClients.get(clientName) || false;
      },

      resetContracts: () => {
        set({
          ...initialState,
          clients: new Map(),
          initializedClients: new Map(),
        });
        console.log('🔄 All contract clients reset');
      },

      resetClient: (clientName: string) => {
        set(state => {
          const newClients = new Map(state.clients);
          const newInitialized = new Map(state.initializedClients);

          newClients.delete(clientName);
          newInitialized.set(clientName, false);

          return {
            clients: newClients,
            initializedClients: newInitialized,
          };
        });
        console.log(`🔄 ${clientName} client reset`);
      },

      setInitError: (error: string | null) => {
        set({ initError: error });
      },

      clearInitError: () => {
        set({ initError: null });
      },

      getClientNames: (): string[] => {
        const { clients } = get();
        return Array.from(clients.keys());
      },
    }),
    {
      name: 'stellar-contract-storage',
      partialize: state => ({
        // Only persist initialization status, not client instances
        initializedClients: Array.from(state.initializedClients.entries()),
      }),
      onRehydrateStorage: () => state => {
        if (state) {
          // Rebuild Map objects
          state.clients = new Map();
          state.initializedClients = new Map(state.initializedClients || []);
        }
      },
    }
  )
);

// Get default contract ID
const getDefaultContractId = (clientName: string): string => {
  switch (clientName) {
    case 'SolvBTCVaultClient':
      return process.env.NEXT_PUBLIC_VAULT_CONTRACT || '';
    case 'SolvBTCTokenClient':
      return useSolvBtcStore.getState().supportedTokens[0].address || '';
    default:
      return '';
  }
};

// Register default contract client types
registeredClientTypes.set('SolvBTCVaultClient', {
  constructor: SolvBTCVaultClient,
});

registeredClientTypes.set('SolvBTCTokenClient', {
  constructor: SolvBTCTokenClient,
});

// Generic contract client Hook
export const useContractClient = <T extends ContractClient = ContractClient>(
  clientName: string
): T | null => {
  const { getClient, isClientInitialized, initializeClient } =
    useContractStore();

  // If not initialized, auto-initialize
  if (!isClientInitialized(clientName)) {
    initializeClient(clientName).catch(console.error);
  }

  return getClient<T>(clientName);
};

// SolvBTCVaultClient dedicated Hook
export const useSolvBTCVaultClient = (): SolvBTCVaultClient | null => {
  return useContractClient<SolvBTCVaultClient>('SolvBTCVaultClient');
};

// SolvBTCTokenClient dedicated Hook
export const useSolvBTCTokenClient = (): SolvBTCTokenClient | null => {
  return useContractClient<SolvBTCTokenClient>('SolvBTCTokenClient');
};

// Utility function: ensure all contract clients are initialized
export const ensureContractInitialized = async (): Promise<void> => {
  const { isInitializing, initializeContracts } = useContractStore.getState();

  if (!isInitializing) {
    await initializeContracts();
  }
};

// Utility function: ensure specific contract client is initialized
export const ensureClientInitialized = async (
  clientName: string
): Promise<void> => {
  const { isClientInitialized, initializeClient } = useContractStore.getState();

  if (!isClientInitialized(clientName)) {
    await initializeClient(clientName);
  }
};

// Utility function: initialize all contracts (can be called externally)
export const initializeContracts = async (): Promise<void> => {
  const { initializeContracts: storeInitializeContracts } =
    useContractStore.getState();
  await storeInitializeContracts();
};

// Utility function: reset all contracts (can be called externally)
export const resetContracts = (): void => {
  const { resetContracts: storeResetContracts } = useContractStore.getState();
  storeResetContracts();
};

// Utility function to get all contract clients
export const getContractClients = (): Record<string, ContractClient> => {
  const { clients } = useContractStore.getState();
  console.log('🔍 getContractClients:', clients);
  const result: Record<string, ContractClient> = {};

  clients.forEach((client, name) => {
    result[name] = client;
  });

  return result;
};

// Utility function to get specific contract client
export const getContractClient = <T extends ContractClient = ContractClient>(
  clientName: string
): T | null => {
  return useContractStore.getState().getClient<T>(clientName);
};

// Utility function: 批量更新所有 client 的签名器
export const updateAllClientsSignTransaction = async (
  walletAdapter: StellarWalletsKitAdapter,
  connectedWallet: ConnectedWallet
): Promise<void> => {
  const { clients } = useContractStore.getState();

  // 检查是否有 clients
  if (clients.size === 0) {
    try {
      await useContractStore.getState().initializeContracts();
    } catch (initError) {
      console.error('❌ Failed to initialize contracts:', initError);
      return;
    }
  }

  // 使用静态导入的模块

  // 获取最新的 clients 状态
  const currentClients = useContractStore.getState().clients;

  // 为所有 client 设置统一的签名器
  currentClients.forEach((client, clientName) => {
    try {
      if ((client as any)?.options) {
        // 设置统一的签名器函数
        (client as any).options.signTransaction = async (txXdr: string) => {
          try {
            // 检查全局钱包状态
            const currentWalletState = useWalletStore.getState();

            // 如果当前钱包适配器状态不对，尝试使用最新的
            let activeWalletAdapter = walletAdapter;
            let activeConnectedWallet = connectedWallet;

            if (
              !walletAdapter?.isConnected?.() &&
              currentWalletState.walletAdapter?.isConnected?.()
            ) {
              activeWalletAdapter = currentWalletState.walletAdapter!;
              activeConnectedWallet = currentWalletState.connectedWallet!;
            }

            if (!activeWalletAdapter?.isConnected?.()) {
              // 尝试自动重连
              try {
                const { validateAndFixWalletConnection } = currentWalletState;
                const reconnected = await validateAndFixWalletConnection();

                if (reconnected) {
                  // 重新获取更新后的状态
                  const updatedState = useWalletStore.getState();
                  activeWalletAdapter = updatedState.walletAdapter!;
                  activeConnectedWallet = updatedState.connectedWallet!;
                } else {
                  throw new Error(
                    `Failed to auto-reconnect wallet. Please disconnect and reconnect manually.`
                  );
                }
              } catch (reconnectError) {
                console.error(
                  `❌ ${clientName} auto-reconnect failed:`,
                  reconnectError
                );
                throw new Error(
                  `Wallet adapter is not connected and auto-reconnect failed. Please disconnect and reconnect your wallet manually.`
                );
              }
            }

            const parsedTx = TransactionBuilder.fromXDR(
              txXdr,
              getCurrentStellarNetwork()
            );

            let transaction;
            if (parsedTx instanceof FeeBumpTransaction) {
              transaction = parsedTx.innerTransaction;
            } else {
              transaction = parsedTx;
            }

            const signedTxXdr = await activeWalletAdapter.signTransaction(
              transaction,
              {
                networkPassphrase: getCurrentStellarNetwork(),
                accountToSign: activeConnectedWallet.publicKey,
              }
            );

            return {
              signedTxXdr,
              signerAddress: activeConnectedWallet.publicKey,
            };
          } catch (signError) {
            console.error(
              `❌ ${clientName} failed to sign transaction:`,
              signError
            );
            throw signError;
          }
        };

        // 同时设置 publicKey
        (client as any).options.publicKey = connectedWallet.publicKey;
      }
    } catch (error) {
      console.error(
        `❌ Failed to update signTransaction for ${clientName}:`,
        error
      );
    }
  });
};

// Utility function: 清除所有 client 的签名器
export const clearAllClientsSignTransaction = (): void => {
  const { clients } = useContractStore.getState();

  clients.forEach((client, clientName) => {
    try {
      if ((client as any)?.options) {
        delete (client as any).options.signTransaction;
        delete (client as any).options.publicKey;
      }
    } catch (error) {
      console.error(
        `❌ Failed to clear signTransaction for ${clientName}:`,
        error
      );
    }
  });
};

// Utility function to set contract client
export const setContractClient = (
  clientName: string,
  client: ContractClient
): void => {
  useContractStore.getState().setClient(clientName, client);
};

// Register new contract client types
export const registerContractClientType = (
  clientName: string,
  constructor: ContractClientConstructor,
  defaultConfig?: Partial<ContractClientConfig>
): void => {
  registeredClientTypes.set(clientName, { constructor, defaultConfig });
  console.log(`📝 Registered client type: ${clientName}`);
};
