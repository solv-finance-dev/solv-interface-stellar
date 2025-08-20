import { create } from "zustand";

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
