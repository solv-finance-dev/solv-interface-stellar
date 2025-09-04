import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistConfig } from './config';

interface MenuStoreState {
  menuH5Open: boolean;
  setMenuH5Open: (open: boolean) => void;
  toggleMenuH5Open: () => void;
}

export const useMenuStore = create<MenuStoreState>()(
  persist(
    set => ({
      menuH5Open: false,
      setMenuH5Open: menuH5Open => set({ menuH5Open }),
      toggleMenuH5Open: () => set(state => ({ menuH5Open: !state.menuH5Open })),
    }),
    persistConfig('menu-storage')
  )
);
