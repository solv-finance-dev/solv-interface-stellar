import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistConfig } from './config';

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
