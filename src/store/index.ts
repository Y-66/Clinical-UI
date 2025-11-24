// src/store/useStore.ts
import { create } from "zustand";
import type { Poi } from "../types/Poi";
import type { PatientInfo } from "../types/Patient";
import type { DiagnosisInfo } from "../types/Diagnosis";

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

interface PharmacyCenterStore {
  pharmacyCenter: { lat: number; lng: number } | null;
  updatePharmacyCenter: (center: { lat: number; lng: number }) => void;
}
export const usePharmacyCenterStore = create<PharmacyCenterStore>((set) => ({
  pharmacyCenter: null,
  updatePharmacyCenter: (center) => set({ pharmacyCenter: center }),
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

interface RequisitionCenterStore {
  requisitionCenter: { lat: number; lng: number } | null;
  updateRequisitionCenter: (center: { lat: number; lng: number }) => void;
}
export const useRequisitionCenterStore = create<RequisitionCenterStore>((set) => ({
  requisitionCenter: null,
  updateRequisitionCenter: (center) => set({ requisitionCenter: center }),
}));

interface currentPatientInfo {
  patientInfo: PatientInfo | null;
  updatePatientInfo: (info: PatientInfo | null) => void;
}
export const useCurrentPatientInfoStore = create<currentPatientInfo>((set) => ({
  patientInfo: null,
  updatePatientInfo: (info) => set(() => ({ patientInfo: info })),
}));

interface currentDiagnosisInfo {
  diagnosisInfo: DiagnosisInfo[] | null;
  updateDiagnosisInfo: (info: DiagnosisInfo[] | null) => void;
}
export const useCurrentDiagnosisInfoStore = create<currentDiagnosisInfo>((set) => ({
  diagnosisInfo: null,
  updateDiagnosisInfo: (info) => set(() => ({ diagnosisInfo: info })),
}));
