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

interface selectedPharmacyPoi {
  selectedPharmacyPoi: Poi | null;
  distancePharmacy: string;
  updateSelectedPharmacyPoi: (poi: Poi | null) => void;
  setDistancePharmacy: (distance: string) => void;
}
export const useSelectedPharmacyPoiStore = create<selectedPharmacyPoi>((set) => ({
  selectedPharmacyPoi: null,
  distancePharmacy: '',
  updateSelectedPharmacyPoi: (poi) =>
    set(() => ({
      selectedPharmacyPoi: poi,
    })),
  setDistancePharmacy: (distance) =>
    set(() => ({
      distancePharmacy: distance,
    })),
}));

interface selectedRequisitionPoi {
  selectedRequisitionPoi: Poi | null;
  distanceRequisition: string;
  updateSelectedRequisitionPoi: (poi: Poi | null) => void;
  setDistanceRequisition: (distance: string) => void;
}
export const useSelectedRequisitionPoiStore = create<selectedRequisitionPoi>((set) => ({
  selectedRequisitionPoi: null,
  distanceRequisition: '',
  updateSelectedRequisitionPoi: (poi) =>
    set(() => ({
      selectedRequisitionPoi: poi,
    })),
  setDistanceRequisition: (distance) =>
    set(() => ({
      distanceRequisition: distance,
    })),
}));
