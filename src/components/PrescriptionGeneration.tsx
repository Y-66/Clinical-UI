import React, { useState } from "react";
import { Button, message, Spin, Empty, Tag } from "antd";
import {
  ThunderboltOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import {
  createEmptyPrescription,
  completePrescription,
  getPrescriptionById,
} from "../apis/patient";
import {
  useCurrentDiagnosisInfoStore,
  useGeneratedOrdersStore,
  useWorkflowGenerationStore,
} from "../store";
import type { PrescriptionOrder } from "../types/WorkflowOrder";

const PrescriptionGeneration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [prescriptionData, setPrescriptionData] =
    useState<PrescriptionOrder | null>(null);
  const { diagnosisInfo } = useCurrentDiagnosisInfoStore();
  const { updateOrderIds } = useGeneratedOrdersStore();
  const { setHasGeneratedOrders } = useWorkflowGenerationStore();

  const handleGeneratePrescription = async () => {
    if (!diagnosisInfo || diagnosisInfo.length === 0) {
      message.error("Please search for diagnosis information first");
      return;
    }

    const patientId = diagnosisInfo[0].patient_id;

    setLoading(true);
    try {
      // Step 1: Create empty prescription with patient_id only
      const emptyPrescription = await createEmptyPrescription(patientId);
      const prescriptionId = emptyPrescription.prescription_id;

      // Step 2: Complete the prescription using AI agent
      await completePrescription(prescriptionId);

      // Step 3: Fetch the completed prescription data
      const completedData = await getPrescriptionById(prescriptionId);
      setPrescriptionData(completedData.prescription);

      // Save the generated ID to store (requisitionId is null for prescription-only workflow)
      updateOrderIds(prescriptionId, null);
      setHasGeneratedOrders(true);
      message.success("Prescription generated successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to generate prescription. Please try again.";
      message.error(errorMessage);
      console.error("Error generating prescription:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "--";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "--";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      active: "green",
      inactive: "red",
      requested: "blue",
      completed: "green",
      pending: "orange",
    };
    return statusMap[status?.toLowerCase()] || "default";
  };

  return (
    <div className="w-full h-full space-y-8 p-2">
      {/* Diagnosis Description Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-white p-6 border-b border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
            <MedicineBoxOutlined className="text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 m-0">
            Patient Diagnosis
          </h2>
        </div>

        <div className="p-8">
          {diagnosisInfo && diagnosisInfo.length > 0 ? (
            <div className="space-y-6">
              <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                <p className="text-slate-700 leading-relaxed text-lg m-0">
                  {diagnosisInfo[0].diagnosis_description}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium">
                    Diagnosis Code:
                  </span>
                  <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                    {diagnosisInfo[0].diagnosis_code}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium">
                    Patient ID:
                  </span>
                  <span className="font-bold text-slate-700">
                    {diagnosisInfo[0].patient_id}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <Empty
              description={
                <span className="text-slate-400">
                  No diagnosis information available. Please search for a
                  patient first.
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      </div>

      {/* Generate Prescription Button */}
      {!prescriptionData && (
        <div className="flex justify-center py-8">
          <Button
            type="primary"
            size="large"
            icon={<ThunderboltOutlined />}
            onClick={handleGeneratePrescription}
            loading={loading}
            disabled={!diagnosisInfo || diagnosisInfo.length === 0}
            className="h-16 px-12 rounded-full text-lg font-bold shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:scale-105 transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
              border: "none",
            }}
          >
            Generate Prescription
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center shadow-lg border border-slate-100">
          <Spin size="large" />
          <p className="text-slate-500 mt-6 text-lg font-medium">
            Generating prescription based on diagnosis...
          </p>
        </div>
      )}

      {/* Generated Prescription Display */}
      {prescriptionData && !loading && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Prescription Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                <MedicineBoxOutlined className="text-2xl" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 m-0">
                Prescription Form
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-blue-600 font-bold uppercase tracking-wider">
                    Prescription ID
                  </span>
                  <span className="font-mono bg-white px-3 py-1 rounded-lg text-blue-700 font-bold text-lg shadow-sm border border-blue-100">
                    #{prescriptionData.prescription_id}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/60 p-2 rounded-lg">
                    <span className="text-slate-500 block text-xs mb-1">
                      Patient ID
                    </span>
                    <span className="font-bold text-slate-700">
                      {prescriptionData.patient_id}
                    </span>
                  </div>
                  <div className="bg-white/60 p-2 rounded-lg">
                    <span className="text-slate-500 block text-xs mb-1">
                      Prescriber ID
                    </span>
                    <span className="font-bold text-slate-700">
                      {prescriptionData.prescriber_id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medication Info */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <div className="text-xs text-slate-400 uppercase tracking-wide mb-1 font-bold">
                    Medication
                  </div>
                  <div className="text-xl font-bold text-blue-700">
                    {prescriptionData.medication_name}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1 font-medium">
                      Strength
                    </div>
                    <div className="font-bold text-slate-800">
                      {prescriptionData.medication_strength}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1 font-medium">
                      Form
                    </div>
                    <div className="font-bold text-slate-800 capitalize">
                      {prescriptionData.medication_form}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1 font-medium">
                      Quantity
                    </div>
                    <div className="font-bold text-slate-800">
                      {prescriptionData.quantity}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dosage Instructions */}
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                <div className="text-xs text-amber-700 uppercase tracking-wide mb-2 font-semibold">
                  Dosage Instructions
                </div>
                <div className="text-gray-800 leading-relaxed">
                  {prescriptionData.dosage_instructions}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">
                    Date Prescribed
                  </div>
                  <div className="font-medium text-gray-800 text-sm">
                    {formatDateTime(prescriptionData.date_prescribed)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Expiry Date</div>
                  <div className="font-medium text-gray-800 text-sm">
                    {formatDate(prescriptionData.expiry_date)}
                  </div>
                </div>
              </div>

              {/* Status and Refills */}
              <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div>
                  <span className="text-xs text-gray-500 mr-2">Status:</span>
                  <Tag
                    color={getStatusColor(prescriptionData.status)}
                    className="text-sm font-semibold"
                  >
                    {prescriptionData.status?.toUpperCase()}
                  </Tag>
                </div>
                <div>
                  <span className="text-xs text-gray-500 mr-2">
                    Refills Allowed:
                  </span>
                  <span className="font-bold text-lg text-blue-600">
                    {prescriptionData.refills_allowed}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {prescriptionData.notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-xs text-blue-700 uppercase tracking-wide mb-2 font-semibold">
                    Notes
                  </div>
                  <div className="text-gray-700 text-sm leading-relaxed">
                    {prescriptionData.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No Prescription State */}
      {!prescriptionData && !loading && diagnosisInfo && diagnosisInfo.length > 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <ThunderboltOutlined className="text-5xl text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-400 mb-3">
              No Prescription Generated Yet
            </h3>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              Click the button above to generate a prescription form based on
              the diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionGeneration;
