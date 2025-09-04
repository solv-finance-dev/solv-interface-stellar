import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistConfig } from './config';

// data from https://lab.stellar.org/smart-contracts/contract-explorer
// read get_supported_currencies from solvbtc contract

interface useSolvBtcStore {
  navOpen: boolean;
  setNavOpen: (navOpen: boolean) => void;
}

const useSolvBtcStore = create<useSolvBtcStore>()(
  persist(
    set => ({
      navOpen: false,
      setNavOpen: (navOpen: boolean) => set({ navOpen }),
    }),
    persistConfig('solvbtc-storage')
  )
);

export default useSolvBtcStore;
