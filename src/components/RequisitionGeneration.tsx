import React, { useState } from "react";
import { Button, message, Spin, Empty, Tag } from "antd";
import {
  ThunderboltOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import {
  createEmptyRequisition,
  completeRequisition,
  getRequisitionById,
} from "../apis/patient";
import {
  useCurrentDiagnosisInfoStore,
  useGeneratedOrdersStore,
  useWorkflowGenerationStore,
} from "../store";
import type { RequisitionOrder } from "../types/WorkflowOrder";

const RequisitionGeneration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [requisitionData, setRequisitionData] =
    useState<RequisitionOrder | null>(null);
  const { diagnosisInfo } = useCurrentDiagnosisInfoStore();
  const { updateOrderIds } = useGeneratedOrdersStore();
  const { setHasGeneratedOrders } = useWorkflowGenerationStore();

  const handleGenerateRequisition = async () => {
    if (!diagnosisInfo || diagnosisInfo.length === 0) {
      message.error("Please search for diagnosis information first");
      return;
    }

    const patientId = diagnosisInfo[0].patient_id;

    setLoading(true);
    try {
      // Step 1: Create empty requisition with patient_id only
      const emptyRequisition = await createEmptyRequisition(patientId);
      const requisitionId = emptyRequisition.requisition_id;

      // Step 2: Complete the requisition using AI agent
      await completeRequisition(requisitionId);

      // Step 3: Fetch the completed requisition data
      const completedData = await getRequisitionById(requisitionId);
      setRequisitionData(completedData.requisition);

      // Save the generated ID to store (prescriptionId is null for requisition-only workflow)
      updateOrderIds(null, requisitionId);
      setHasGeneratedOrders(true);
      message.success("Requisition generated successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to generate requisition. Please try again.";
      message.error(errorMessage);
      console.error("Error generating requisition:", err);
    } finally {
      setLoading(false);
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
      requested: "blue",
      completed: "green",
      pending: "orange",
      routine: "blue",
      urgent: "red",
      stat: "red",
    };
    return statusMap[status?.toLowerCase()] || "default";
  };

  return (
    <div className="w-full h-full space-y-8 p-2">
      {/* Diagnosis Description Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-white p-6 border-b border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
            <ExperimentOutlined className="text-2xl" />
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

      {/* Generate Requisition Button */}
      {!requisitionData && (
        <div className="flex justify-center py-8">
          <Button
            type="primary"
            size="large"
            icon={<ThunderboltOutlined />}
            onClick={handleGenerateRequisition}
            loading={loading}
            disabled={!diagnosisInfo || diagnosisInfo.length === 0}
            className="h-16 px-12 rounded-full text-lg font-bold shadow-xl shadow-green-200 hover:shadow-green-300 hover:scale-105 transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              border: "none",
            }}
          >
            Generate Requisition
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center shadow-lg border border-slate-100">
          <Spin size="large" />
          <p className="text-slate-500 mt-6 text-lg font-medium">
            Generating requisition based on diagnosis...
          </p>
        </div>
      )}

      {/* Generated Requisition Display */}
      {requisitionData && !loading && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Requisition Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-white p-6 border-b border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shadow-sm group-hover:scale-110 transition-transform">
                <ExperimentOutlined className="text-2xl" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 m-0">
                Requisition Form
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-green-600 font-bold uppercase tracking-wider">
                    Requisition ID
                  </span>
                  <span className="font-mono bg-white px-3 py-1 rounded-lg text-green-700 font-bold text-lg shadow-sm border border-green-100">
                    #{requisitionData.requisition_id}
                  </span>
                </div>
                <div className="bg-white/60 p-2 rounded-lg inline-block w-full">
                  <span className="text-slate-500 block text-xs mb-1">
                    Patient ID
                  </span>
                  <span className="font-bold text-slate-700">
                    {requisitionData.patient_id}
                  </span>
                </div>
              </div>

              {/* Department and Test Info */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <div className="text-xs text-slate-400 uppercase tracking-wide mb-1 font-bold">
                    Department
                  </div>
                  <div className="text-xl font-bold text-green-700">
                    {requisitionData.department}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1 font-medium">
                      Test Type
                    </div>
                    <div className="font-bold text-slate-800 text-lg">
                      {requisitionData.test_type}
                    </div>
                  </div>
                  {requisitionData.test_code && (
                    <div>
                      <div className="text-xs text-slate-500 mb-1 font-medium">
                        Test Code
                      </div>
                      <div className="font-mono bg-slate-100 px-3 py-1 rounded-lg inline-block font-bold text-slate-600 border border-slate-200">
                        {requisitionData.test_code}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Clinical Information */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                <div className="text-xs text-blue-600 uppercase tracking-wide mb-2 font-bold">
                  Clinical Information
                </div>
                <div className="text-slate-700 leading-relaxed font-medium">
                  {requisitionData.clinical_info}
                </div>
              </div>

              {/* Date and Priority */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">
                    Date Requested
                  </div>
                  <div className="font-medium text-slate-800">
                    {formatDateTime(requisitionData.date_requested)}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-bold uppercase">
                      Priority
                    </span>
                    <Tag
                      color={getStatusColor(requisitionData.priority)}
                      className="text-sm font-bold px-3 py-0.5 rounded-full border-0"
                    >
                      {requisitionData.priority?.toUpperCase()}
                    </Tag>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-bold uppercase">
                      Status
                    </span>
                    <Tag
                      color={getStatusColor(requisitionData.status)}
                      className="text-sm font-bold px-3 py-0.5 rounded-full border-0"
                    >
                      {requisitionData.status?.toUpperCase()}
                    </Tag>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {requisitionData.notes && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <div className="text-xs text-amber-600 uppercase tracking-wide mb-2 font-bold">
                    Notes
                  </div>
                  <div className="text-slate-700 text-sm leading-relaxed">
                    {requisitionData.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No Requisition State */}
      {!requisitionData && !loading && diagnosisInfo && diagnosisInfo.length > 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <ThunderboltOutlined className="text-5xl text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-400 mb-3">
              No Requisition Generated Yet
            </h3>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              Click the button above to generate a requisition form based on
              the diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequisitionGeneration;
