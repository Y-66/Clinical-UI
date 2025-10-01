// src/store/useStore.ts
import { create } from "zustand";

export const useStore = create((set) => ({
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
