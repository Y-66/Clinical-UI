// src/store/useStore.ts
import { create } from "zustand";
import type { DiagnosisInfo } from "../types/Diagnosis";


interface currentDiagnosisInfo {
  diagnosisInfo: DiagnosisInfo[] | null;
  updateDiagnosisInfo: (info: DiagnosisInfo[] | null) => void;
}
export const useCurrentDiagnosisInfoStore = create<currentDiagnosisInfo>((set) => ({
  diagnosisInfo: null,
  updateDiagnosisInfo: (info) => set(() => ({ diagnosisInfo: info })),
}));

interface SelectedPharmacyStore {
  selectedPharmacy: { pharmacy_id: number; name: string; address: string } | null;
  updateSelectedPharmacy: (pharmacy: { pharmacy_id: number; name: string; address: string } | null) => void;
}
export const useSelectedPharmacyStore = create<SelectedPharmacyStore>((set) => ({
  selectedPharmacy: null,
  updateSelectedPharmacy: (pharmacy) => set(() => ({ selectedPharmacy: pharmacy })),
}));

interface SelectedLabStore {
  selectedLab: { lab_id: number; name: string; address: string } | null;
  updateSelectedLab: (lab: { lab_id: number; name: string; address: string } | null) => void;
}
export const useSelectedLabStore = create<SelectedLabStore>((set) => ({
  selectedLab: null,
  updateSelectedLab: (lab) => set(() => ({ selectedLab: lab })),
}));

interface GeneratedOrdersStore {
  prescriptionId: string | null;
  requisitionId: string | null;
  updateOrderIds: (prescriptionId: string | null, requisitionId: string | null) => void;
}
export const useGeneratedOrdersStore = create<GeneratedOrdersStore>((set) => ({
  prescriptionId: null,
  requisitionId: null,
  updateOrderIds: (prescriptionId, requisitionId) => 
    set(() => ({ prescriptionId, requisitionId })),
}));

interface OrderSubmittedStore {
  isOrderSubmitted: boolean;
  setOrderSubmitted: (submitted: boolean) => void;
}
export const useOrderSubmittedStore = create<OrderSubmittedStore>((set) => ({
  isOrderSubmitted: false,
  setOrderSubmitted: (submitted) => set(() => ({ isOrderSubmitted: submitted })),
}));
