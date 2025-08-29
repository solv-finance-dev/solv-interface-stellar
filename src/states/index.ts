import { create } from 'zustand';
export * from './wallet-store';
export * from './contract-store';

import useSolvBtcStore, { Token } from './solvbtc';

interface Store {
  noticeOpen: boolean;
  setNoticeOpen: (noticeOpen: boolean) => void;
}

const useStore = create<Store>(set => ({
  noticeOpen: true,
  setNoticeOpen: (noticeOpen: boolean) => set({ noticeOpen }),
}));

export { useSolvBtcStore, useStore, type Token };

// Re-export commonly used hooks and utilities
export {
  useWalletStore,
  startAutoRefresh,
  stopAutoRefresh,
  type WalletState,
  type WalletActions,
} from './wallet-store';

// Re-export contract store hooks and utilities
export {
  useContractStore,
  useContractClient,
  useSolvBTCVaultClient,
  ensureContractInitialized,
  ensureClientInitialized,
  getContractClients,
  getContractClient,
  setContractClient,
  registerContractClientType,
  type ContractState,
  type ContractActions,
  type ContractClientConfig,
  type ContractClientConstructor,
} from './contract-store';
