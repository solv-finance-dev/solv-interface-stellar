import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistConfig } from './config';

export interface Token {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  icon: string;
}
// data from https://lab.stellar.org/smart-contracts/contract-explorer
// read get_supported_currencies from solvbtc contract
const supportedTokens = [
  {
    name: 'SolvBTC',
    symbol: 'solvBTC',
    decimals: 8,
    address: 'CDFIUMMXASPLEZFIFZ6RIC2BKJOIO7YSZ66DW3K3M6NOSPY53O3RUTWG',
    icon: 'https://res1.sft-api.com/token/cbBTC.png',
  },
];

interface useSolvBtcStore {
  navOpen: boolean;
  supportedTokens: Token[];
  setNavOpen: (navOpen: boolean) => void;
}

const useSolvBtcStore = create<useSolvBtcStore>()(
  persist(
    set => ({
      navOpen: false,
      supportedTokens,
      setNavOpen: (navOpen: boolean) => set({ navOpen }),
    }),
    persistConfig('solvbtc-storage')
  )
);

export default useSolvBtcStore;
