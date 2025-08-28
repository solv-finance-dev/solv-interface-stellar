import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client as ContractClient } from '@stellar/stellar-sdk/contract';
import { SolvBTCVaultClient } from '@/contracts/solvBTCVaultContract/src';
import { getCurrentStellarNetwork } from '@/config/stellar';

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
          console.log('✅ All contract clients initialized successfully');
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
            rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL!,
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

          // Create client instance
          const client = new registeredType.constructor(clientConfig);

          // Set client
          setClient(clientName, client);

          console.log(`✅ ${clientName} initialized successfully:`, {
            networkPassphrase: clientConfig.networkPassphrase,
            contractId: clientConfig.contractId,
            rpcUrl: clientConfig.rpcUrl,
          });
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
    default:
      return '';
  }
};

// Register default contract client types
registeredClientTypes.set('SolvBTCVaultClient', {
  constructor: SolvBTCVaultClient,
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

// Utility function to get all contract clients
export const getContractClients = (): Record<string, ContractClient> => {
  const { clients } = useContractStore.getState();
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
