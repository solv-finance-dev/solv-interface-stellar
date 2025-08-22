import { create } from "zustand";
export * from './wallet-store';

import useSolvBtcStore from "./solvbtc";

interface Store {
  noticeOpen: boolean;
  setNoticeOpen: (noticeOpen: boolean) => void;
}

const useStore = create<Store>((set) => ({
  noticeOpen: true,
  setNoticeOpen: (noticeOpen: boolean) => set({ noticeOpen })
}));

export { useSolvBtcStore, useStore };

// Re-export commonly used hooks and utilities
export {
  useWalletStore,
  startAutoRefresh,
  stopAutoRefresh,
  type WalletState,
  type WalletActions,
} from './wallet-store';
