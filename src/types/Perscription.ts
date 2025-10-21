export type PrescriptionInfo = {
  prescriptionId: string;
  clientId: number;
  prescriberId: string;
  medicationName: string;
  medicationStrength: string;
  medicationForm: string;
  dosageInstructions: string;
  quantity: number;
  refillsAllowed: number;
  datePrescribed: string;
  expiryDate: string;
  pharmacyName: string;
  pharmacyAddress: string;
  status: string;
  notes: string;
}