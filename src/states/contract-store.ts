import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client as ContractClient } from '@stellar/stellar-sdk/contract';
import { SolvBTCVaultClient } from '@/contracts/solvBTCVaultContract/src';
import { getCurrentStellarNetwork } from '@/config/stellar';

// 合约客户端配置类型定义
export interface ContractClientConfig {
    networkPassphrase: string;
    rpcUrl: string;
    contractId: string;
}

// 合约客户端构造函数类型
export type ContractClientConstructor = new (config: ContractClientConfig) => ContractClient;

// 合约客户端状态
export interface ContractState {
    // 所有合约客户端的Map - key是类名，value是实例
    clients: Map<string, ContractClient>;

    // 合约初始化状态Map - key是类名，value是初始化状态
    initializedClients: Map<string, boolean>;

    // 加载状态
    isInitializing: boolean;

    // 错误状态
    initError: string | null;
}

// 合约客户端操作
export interface ContractActions {
    // 初始化所有合约客户端
    initializeContracts: () => Promise<void>;

    // 初始化特定合约客户端 - 通过类名
    initializeClient: (clientName: string, config?: ContractClientConfig) => Promise<void>;

    // 通用的获取合约客户端方法
    getClient: <T extends ContractClient = ContractClient>(clientName: string) => T | null;

    // 通用的设置合约客户端方法
    setClient: (clientName: string, client: ContractClient) => void;

    // 检查合约是否已初始化
    isClientInitialized: (clientName: string) => boolean;

    // 重置所有合约客户端
    resetContracts: () => void;

    // 重置特定合约客户端
    resetClient: (clientName: string) => void;

    // 错误处理
    setInitError: (error: string | null) => void;
    clearInitError: () => void;

    // 获取所有客户端名称
    getClientNames: () => string[];

    // 注册合约客户端类型（用于自动初始化）
    registerClientType: (clientName: string, constructor: ContractClientConstructor, defaultConfig?: Partial<ContractClientConfig>) => void;

    // 便利方法 - 向后兼容
    getSolvBTCVaultClient: () => SolvBTCVaultClient | null;
    initializeSolvBTCVaultClient: (config?: ContractClientConfig) => Promise<void>;
}

type ContractStore = ContractState & ContractActions;

// 注册的合约客户端类型
const registeredClientTypes: Map<string, {
    constructor: ContractClientConstructor;
    defaultConfig?: Partial<ContractClientConfig>;
}> = new Map();

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

                    // 初始化所有注册的合约客户端
                    const initPromises = Array.from(registeredClientTypes.keys()).map(clientName =>
                        get().initializeClient(clientName)
                    );

                    await Promise.all(initPromises);

                    set({ isInitializing: false });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to initialize contracts';
                    console.error('❌ Failed to initialize contracts:', errorMessage);
                    setInitError(errorMessage);
                    set({ isInitializing: false });
                }
            },

            initializeClient: async (clientName: string, config?: ContractClientConfig) => {
                const { setInitError, setClient } = get();

                try {
                    // 获取注册的客户端类型
                    const registeredType = registeredClientTypes.get(clientName);
                    if (!registeredType) {
                        throw new Error(`Client type '${clientName}' is not registered`);
                    }

                    // 使用传入的配置或默认配置
                    const clientConfig: ContractClientConfig = {
                        networkPassphrase: getCurrentStellarNetwork(),
                        rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL!,
                        contractId: getDefaultContractId(clientName),
                        ...registeredType.defaultConfig,
                        ...config,
                    };

                    // 验证必要的配置
                    if (!clientConfig.rpcUrl) {
                        throw new Error('NEXT_PUBLIC_STELLAR_RPC_URL environment variable is required');
                    }
                    if (!clientConfig.contractId) {
                        throw new Error(`Contract ID for ${clientName} is required`);
                    }

                    // 创建客户端实例
                    const client = new registeredType.constructor(clientConfig);

                    // 设置客户端
                    setClient(clientName, client);

                    console.log(`✅ ${clientName} initialized successfully:`, {
                        networkPassphrase: clientConfig.networkPassphrase,
                        contractId: clientConfig.contractId,
                        rpcUrl: clientConfig.rpcUrl
                    });

                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : `Failed to initialize ${clientName}`;
                    console.error(`❌ Failed to initialize ${clientName}:`, errorMessage);
                    setInitError(errorMessage);

                    // 重置该客户端
                    get().resetClient(clientName);
                    throw error;
                }
            },

            getClient: <T extends ContractClient = ContractClient>(clientName: string): T | null => {
                const { clients } = get();
                return (clients.get(clientName) as T) || null;
            },

            setClient: (clientName: string, client: ContractClient) => {
                set((state) => {
                    const newClients = new Map(state.clients);
                    const newInitialized = new Map(state.initializedClients);

                    newClients.set(clientName, client);
                    newInitialized.set(clientName, true);

                    return {
                        clients: newClients,
                        initializedClients: newInitialized,
                        initError: null
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
                set((state) => {
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

            registerClientType: (clientName: string, constructor: ContractClientConstructor, defaultConfig?: Partial<ContractClientConfig>) => {
                registeredClientTypes.set(clientName, { constructor, defaultConfig });
                console.log(`📝 Registered client type: ${clientName}`);
            },

            // 便利方法 - 向后兼容
            getSolvBTCVaultClient: (): SolvBTCVaultClient | null => {
                return get().getClient<SolvBTCVaultClient>('SolvBTCVaultClient');
            },

            initializeSolvBTCVaultClient: async (config?: ContractClientConfig) => {
                return get().initializeClient('SolvBTCVaultClient', config);
            },
        }),
        {
            name: 'stellar-contract-storage',
            partialize: (state) => ({
                // 只持久化初始化状态，不持久化客户端实例
                initializedClients: Array.from(state.initializedClients.entries()),
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // 重建Map对象
                    state.clients = new Map();
                    state.initializedClients = new Map(state.initializedClients || []);
                }
            },
        }
    )
);

// 获取默认的合约 ID
const getDefaultContractId = (clientName: string): string => {
    switch (clientName) {
        case 'SolvBTCVaultClient':
            return process.env.NEXT_PUBLIC_VAULT_CONTRACT || '';
        // 后续添加其他合约的环境变量
        default:
            return '';
    }
};

// 注册默认的合约客户端类型
useContractStore.getState().registerClientType('SolvBTCVaultClient', SolvBTCVaultClient);

// 通用合约客户端 Hook
export const useContractClient = <T extends ContractClient = ContractClient>(clientName: string): T | null => {
    const { getClient, isClientInitialized, initializeClient } = useContractStore();

    // 如果还未初始化，自动初始化
    if (!isClientInitialized(clientName)) {
        initializeClient(clientName).catch(console.error);
    }

    return getClient<T>(clientName);
};

// 便利 Hook - 向后兼容
export const useSolvBTCVaultClient = (): SolvBTCVaultClient | null => {
    return useContractClient<SolvBTCVaultClient>('SolvBTCVaultClient');
};

// 保持向后兼容的别名
export const useVaultClient = useSolvBTCVaultClient;

// 工具函数：确保所有合约客户端已初始化
export const ensureContractInitialized = async (): Promise<void> => {
    const { isInitializing, initializeContracts } = useContractStore.getState();

    if (!isInitializing) {
        await initializeContracts();
    }
};

// 工具函数：确保特定合约客户端已初始化
export const ensureClientInitialized = async (clientName: string): Promise<void> => {
    const { isClientInitialized, initializeClient } = useContractStore.getState();

    if (!isClientInitialized(clientName)) {
        await initializeClient(clientName);
    }
};

// 获取所有合约客户端的工具函数
export const getContractClients = (): Record<string, ContractClient> => {
    const { clients } = useContractStore.getState();
    const result: Record<string, ContractClient> = {};

    clients.forEach((client, name) => {
        result[name] = client;
    });

    return result;
};

// 获取特定合约客户端的工具函数
export const getContractClient = <T extends ContractClient = ContractClient>(clientName: string): T | null => {
    return useContractStore.getState().getClient<T>(clientName);
};

// 设置合约客户端的工具函数
export const setContractClient = (clientName: string, client: ContractClient): void => {
    useContractStore.getState().setClient(clientName, client);
};

// 注册新的合约客户端类型
export const registerContractClientType = (
    clientName: string,
    constructor: ContractClientConstructor,
    defaultConfig?: Partial<ContractClientConfig>
): void => {
    useContractStore.getState().registerClientType(clientName, constructor, defaultConfig);
};