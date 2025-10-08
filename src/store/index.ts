// src/store/useStore.ts
import { create } from "zustand";
import type { Poi } from "../types/Poi";

interface CurrentPoiStore {
  currentPoi: Poi | null;
  distance: string;
  updateSelectedPoi: (poi: Poi | null) => void;
  setDistance: (distance: string) => void;
}
export const useCurrentPoiStore = create<CurrentPoiStore>((set) => ({
  currentPoi: null,
  distance: '',
  
  updateSelectedPoi: (poi) =>
    set(() => ({
      currentPoi: poi,
    })),
  setDistance: (distance) =>
    set(() =>({
      distance: distance
    }))

}));


interface PoisListStore {
  poisList: Poi[];
  updataPoisList: (pois: Poi[]) => void;
}
export const usePoisListStore = create<PoisListStore>((set) => ({
  poisList: [],
  updataPoisList: (pois) => set({ poisList: pois }),
}))
