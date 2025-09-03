import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client as ContractClient } from '@stellar/stellar-sdk/contract';
import { TransactionBuilder, FeeBumpTransaction } from '@stellar/stellar-sdk';

import { SolvBTCVaultClient } from '@/contracts/solvBTCVaultContract/src';
import { SolvBTCTokenClient } from '@/contracts/solvBTCTokenContract/src';
import { getCurrentStellarNetwork } from '@/config/stellar';
import { useWalletStore } from '@/states/wallet-store';
import { StellarWalletsKitAdapter, ConnectedWallet } from '@/wallet-connector';

// -------------------------
// Types & Interfaces
// -------------------------

export interface VaultToken {
  name: string;
  id: string;
  client: SolvBTCTokenClient;
  decimal: number;
}

export interface StoredContract {
  name: string;
  id: string;
  client: SolvBTCVaultClient;
  supportedTokenClients: Map<string, VaultToken>;
  shareTokenClient?: VaultToken;
}

export interface VaultContractMeta {
  name: string;
  id: string;
}

interface ContractState {
  vaults: Map<string, StoredContract>;
  isInitializing: boolean;
  initError: string | null;
}

interface ContractActions {
  initializeContracts: () => Promise<void>; // compatibility wrapper
  initializeVaults: (contracts: VaultContractMeta[]) => Promise<void>;
  getVault: (name: string) => StoredContract | null;
  // Compatibility API: map legacy client names to vault clients
  getClient: <T extends ContractClient = ContractClient>(
    clientName: string
  ) => T | null;
  resetContracts: () => void;
  setInitError: (error: string | null) => void;
  clearInitError: () => void;
}

type ContractStore = ContractState & ContractActions;

const DEFAULT_VAULT_CONTRACTS: VaultContractMeta[] = [
  {
    id:
      process.env.NEXT_PUBLIC_VAULT_CONTRACT ||
      'CAW4Y6AD3BPHUYTTPE4DZPERC4KTMJM7TTMYM6AJNYAAWJMU2TH2ZCJ2',
    name: 'solvBTCVault',
  },
];

const initialState: ContractState = {
  vaults: new Map(),
  isInitializing: false,
  initError: null,
};

export const useContractStore = create<ContractStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Backward compatible entry point
      initializeContracts: async () => {
        await get().initializeVaults(DEFAULT_VAULT_CONTRACTS);
      },

      initializeVaults: async (contracts: VaultContractMeta[]) => {
        try {
          set({ isInitializing: true, initError: null });

          const networkPassphrase = getCurrentStellarNetwork();
          const rpcUrl = process.env.NEXT_PUBLIC_STELLAR_RPC_URL!;
          if (!rpcUrl)
            throw new Error('NEXT_PUBLIC_STELLAR_RPC_URL is missing');

          const vaultEntries = await Promise.all(
            contracts.map(async meta => {
              // Create vault client
              const vaultClient = new SolvBTCVaultClient({
                contractId: meta.id,
                networkPassphrase,
                rpcUrl,
                allowHttp: true,
              } as any);

              // Query supported currencies and shares token in parallel
              const [supportedCurrenciesTx, sharesTokenTx] = await Promise.all([
                vaultClient.get_supported_currencies(),
                vaultClient.get_shares_token(),
              ]);

              const supportedCurrencies = supportedCurrenciesTx.result || [];
              const sharesTokenId = sharesTokenTx.result || undefined;

              // Build supported token clients
              const supportedTokenClients = new Map<
                string,
                {
                  name: string;
                  id: string;
                  client: SolvBTCTokenClient;
                  decimal: number;
                }
              >();

              await Promise.all(
                supportedCurrencies.map(async address => {
                  try {
                    const tokenClient = new SolvBTCTokenClient({
                      contractId: address,
                      networkPassphrase,
                      rpcUrl,
                      allowHttp: true,
                    } as any);

                    // Try to resolve token symbol and decimals
                    let tokenName = address;
                    let decimal = 0;
                    try {
                      const [nameTx, decimalsTx] = await Promise.all([
                        tokenClient.symbol(),
                        tokenClient.decimals(),
                      ]);
                      tokenName = nameTx.result || address;
                      decimal = Number(decimalsTx.result) || 0;
                    } catch {}

                    supportedTokenClients.set(address, {
                      name: tokenName,
                      id: address,
                      client: tokenClient,
                      decimal,
                    });
                  } catch (e) {
                    console.warn(
                      'Failed creating token client for',
                      address,
                      e
                    );
                  }
                })
              );

              // Build share token client (optional)
              let shareTokenClient: StoredContract['shareTokenClient'];
              if (sharesTokenId) {
                try {
                  const client = new SolvBTCTokenClient({
                    contractId: sharesTokenId,
                    networkPassphrase,
                    rpcUrl,
                    allowHttp: true,
                  } as any);
                  let name = sharesTokenId;
                  let decimal = 0;
                  try {
                    const [symbolTx, decimalsTx] = await Promise.all([
                      client.symbol(),
                      client.decimals(),
                    ]);
                    name = symbolTx.result || sharesTokenId;
                    decimal = Number(decimalsTx.result) || 0;
                  } catch {}
                  shareTokenClient = {
                    name,
                    id: sharesTokenId,
                    client,
                    decimal,
                  };
                } catch (e) {
                  console.warn(
                    'Failed creating share token client for',
                    sharesTokenId,
                    e
                  );
                }
              }

              const entry: StoredContract = {
                name: meta.name,
                id: meta.id,
                client: vaultClient,
                supportedTokenClients,
                shareTokenClient,
              };
              return entry;
            })
          );

          // Commit state
          set(() => {
            const newVaults = new Map<string, StoredContract>();
            vaultEntries.forEach(entry => newVaults.set(entry.name, entry));
            return { vaults: newVaults, isInitializing: false };
          });
        } catch (error) {
          const msg =
            error instanceof Error
              ? error.message
              : 'Failed to initialize vaults';
          console.error('❌ initializeVaults error:', msg);
          set({ isInitializing: false, initError: msg });
        }
      },

      getVault: (name: string) => {
        const { vaults } = get();
        return vaults.get(name) || null;
      },

      getClient: <T extends ContractClient = ContractClient>(
        clientName: string
      ): T | null => {
        // Currently only SolvBTCVaultClient is supported as a legacy name
        if (clientName === 'SolvBTCVaultClient') {
          const entry = get().getVault('solvBTCVault');
          return (entry?.client as unknown as T) || null;
        }
        return null;
      },

      resetContracts: () => {
        set({ ...initialState, vaults: new Map() });
        console.log('🔄 All vault contract clients reset');
      },

      setInitError: (error: string | null) => set({ initError: error }),
      clearInitError: () => set({ initError: null }),
    }),
    {
      name: 'stellar-contract-storage',
      partialize: state => ({
        // persist nothing heavy; only a flag is useful
        isInitializing: state.isInitializing,
      }),
      onRehydrateStorage: () => state => {
        if (state) {
          state.vaults = new Map();
        }
      },
    }
  )
);

// -------------------------
// Hooks & Utilities (compat)
// -------------------------

export const useContractClient = <T extends ContractClient = ContractClient>(
  clientName: string
): T | null => {
  // Compatibility: return the solvBTCVault client when asking for SolvBTCVaultClient
  if (clientName === 'SolvBTCVaultClient') {
    const entry = useContractStore.getState().getVault('solvBTCVault');
    return (entry?.client as unknown as T) || null;
  }
  return null;
};

export const useSolvBTCVaultClient = (): SolvBTCVaultClient | null => {
  const entry = useContractStore(state => state.getVault('solvBTCVault'));
  return entry?.client || null;
};

export const ensureContractInitialized = async (): Promise<void> => {
  await useContractStore.getState().initializeContracts();
};

export const ensureClientInitialized = async (
  _clientName: string
): Promise<void> => {
  // No-op in the new model; just ensure all vaults are initialized
  await ensureContractInitialized();
};

export const initializeContracts = async (): Promise<void> => {
  await useContractStore.getState().initializeContracts();
};

export const resetContracts = (): void => {
  useContractStore.getState().resetContracts();
};

export const getContractClients = (): Record<string, ContractClient> => {
  const { vaults } = useContractStore.getState();
  const result: Record<string, ContractClient> = {};
  vaults.forEach((entry, name) => {
    result[name] = entry.client;
  });
  return result;
};

export const getContractClient = <T extends ContractClient = ContractClient>(
  clientName: string
): T | null => {
  // Compatibility mapping
  if (clientName === 'SolvBTCVaultClient') {
    const entry = useContractStore.getState().getVault('solvBTCVault');
    return (entry?.client as unknown as T) || null;
  }
  return null;
};

// Batch update signers for all vault clients (token clients stay unsigned)
export const updateAllClientsSignTransaction = async (
  walletAdapter: StellarWalletsKitAdapter,
  connectedWallet: ConnectedWallet
): Promise<void> => {
  // Ensure vaults exist
  if (useContractStore.getState().vaults.size === 0) {
    try {
      await useContractStore.getState().initializeContracts();
    } catch (initError) {
      console.error('❌ Failed to initialize vaults:', initError);
      return;
    }
  }

  const { vaults } = useContractStore.getState();
  vaults.forEach((entry, name) => {
    const client = entry.client as unknown as ContractClient & {
      options?: { signTransaction?: any; publicKey?: string };
    };
    try {
      if (client?.options) {
        client.options.signTransaction = async (txXdr: string) => {
          try {
            const currentWalletState = useWalletStore.getState();
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
              const { validateAndFixWalletConnection } = currentWalletState;
              const reconnected = await validateAndFixWalletConnection();
              if (reconnected) {
                const updated = useWalletStore.getState();
                activeWalletAdapter = updated.walletAdapter!;
                activeConnectedWallet = updated.connectedWallet!;
              } else {
                throw new Error(
                  'Wallet adapter not connected and auto-reconnect failed.'
                );
              }
            }

            const parsedTx = TransactionBuilder.fromXDR(
              txXdr,
              getCurrentStellarNetwork()
            );
            const inner =
              parsedTx instanceof FeeBumpTransaction
                ? parsedTx.innerTransaction
                : parsedTx;
            const signedTxXdr = await activeWalletAdapter.signTransaction(
              inner,
              {
                networkPassphrase: getCurrentStellarNetwork(),
                accountToSign: activeConnectedWallet.publicKey,
              }
            );
            return {
              signedTxXdr,
              signerAddress: activeConnectedWallet.publicKey,
            };
          } catch (e) {
            console.error(`❌ ${name} failed to sign transaction:`, e);
            throw e;
          }
        };
        client.options.publicKey = connectedWallet.publicKey;
      }
    } catch (error) {
      console.error(`❌ Failed updating signer for ${name}:`, error);
    }
  });
};

export const clearAllClientsSignTransaction = (): void => {
  const { vaults } = useContractStore.getState();
  vaults.forEach((entry, name) => {
    const client = entry.client as unknown as ContractClient & {
      options?: { signTransaction?: any; publicKey?: string };
    };
    try {
      if (client?.options) {
        delete client.options.signTransaction;
        delete client.options.publicKey;
      }
    } catch (error) {
      console.error(`❌ Failed to clear signer for ${name}:`, error);
    }
  });
};

// Compatibility shims (no-ops in the new model)
export interface ContractClientConfig {
  networkPassphrase: string;
  rpcUrl: string;
  contractId: string;
}
export type ContractClientConstructor = new (
  config: ContractClientConfig
) => ContractClient;
export const setContractClient = (_name: string, _client: ContractClient) => {};
export const registerContractClientType = (
  _clientName: string,
  _constructor: ContractClientConstructor,
  _defaultConfig?: Partial<ContractClientConfig>
) => {};
