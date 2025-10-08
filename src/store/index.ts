// src/store/useStore.ts
import { create } from "zustand";
import type { Poi } from "../types/Poi";

export const useCurrentPoiStore = create((set) => ({
  currentPoi: {
    latitude: 0,
    longitude: 0,
  },
  // 更新经纬度
  updatePoi: (lat: number, lng: number): void => 
    set(() => ({
      currentPoi: { latitude: lat, longitude: lng },
    })),

  // 重置为 {0,0}
  resetPoi: () =>
    set(() => ({
      currentPoi: { latitude: 0, longitude: 0 },
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
