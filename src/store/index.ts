// src/store/useStore.ts
import { create } from "zustand";
import type { Poi } from "../types/Poi";

interface CurrentPoiStore {
  currentPoi: Poi | null;
  updateSelectedPoi: (poi: Poi | null) => void;
}
export const useCurrentPoiStore = create<CurrentPoiStore>((set) => ({
  currentPoi: null,
  // 更新经纬度
  updateSelectedPoi: (poi) =>
    set(() => ({
      currentPoi: poi,
    })),

}));

// 定义 store 的类型结构
interface PoisListStore {
  poisList: Poi[];
  updataPoisList: (pois: Poi[]) => void;
}
export const usePoisListStore = create<PoisListStore>((set) => ({
  poisList: [],
  updataPoisList: (pois) => set({ poisList: pois }),
}))
