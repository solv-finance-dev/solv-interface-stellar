import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistConfig } from './config';

interface useMeunStore {
  meunH5Open: boolean;
  setMeunH5Open: (meunH5Open: boolean) => void;
}

const useMeunStore = create<useMeunStore>()(
  persist(
    set => ({
      meunH5Open: false,
      setMeunH5Open: (meunH5Open: boolean) => set({ meunH5Open }),
    }),
    persistConfig('meun-storage')
  )
);

export default useMeunStore;
