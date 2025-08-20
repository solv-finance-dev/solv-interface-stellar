import { create } from "zustand";
import { persist } from "zustand/middleware";

import { persistConfig } from "./config";

interface useSolvBtcStore {
  mode: string;
  setMode: (mode: string) => void;
  navOpen: boolean;
  setNavOpen: (navOpen: boolean) => void;
}

const useSolvBtcStore = create<useSolvBtcStore>()(
  persist(
    (set) => ({
      mode: "dark",
      setMode: (mode: string) => set({ mode }),
      navOpen: false,
      setNavOpen: (navOpen: boolean) => set({ navOpen })
    }),
    persistConfig("solvbtc-storage")
  )
);

export default useSolvBtcStore;
