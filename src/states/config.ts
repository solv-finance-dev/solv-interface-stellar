import { PersistOptions, createJSONStorage } from 'zustand/middleware';

export const persistConfig = <T>(name: string): PersistOptions<T> => ({
  name,
  storage: createJSONStorage(() => localStorage),
  // partialize: (state) => ({ ...state }),
});
