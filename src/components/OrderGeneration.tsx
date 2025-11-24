import React, { useState } from "react";
import { Card, Button, message, Spin, Empty, Tag } from "antd";
import {
  FileTextOutlined,
  ThunderboltOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { generateWorkflowOrders } from "../apis/patient";
import {
  useCurrentDiagnosisInfoStore,
  useGeneratedOrdersStore,
} from "../store";
import type { WorkflowOrderResponse } from "../types/WorkflowOrder";

const OrderGeneration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<WorkflowOrderResponse | null>(
    null
  );
  const { diagnosisInfo } = useCurrentDiagnosisInfoStore();
  const { updateOrderIds } = useGeneratedOrdersStore();

  const handleGenerateOrders = async () => {
    if (!diagnosisInfo || diagnosisInfo.length === 0) {
      message.error("Please search for diagnosis information first");
      return;
    }

    const patientId = diagnosisInfo[0].patient_id;

    setLoading(true);
    try {
      const data = await generateWorkflowOrders(patientId);
      setOrderData(data);
      // Save the generated IDs to store
      updateOrderIds(
        data.prescription.prescription_id,
        data.requisition.requisition_id
      );
      message.success("Orders generated successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to generate orders. Please try again.";
      message.error(errorMessage);
      console.error("Error generating orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "--";
    try {
      const date = new Date(dateString);
      // 只显示日期部分
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
      routine: "blue",
      urgent: "red",
      stat: "red",
    };
    return statusMap[status.toLowerCase()] || "default";
  };

  return (
    <div className="w-full h-full space-y-6 p-6">
      {/* Diagnosis Description Card */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-purple-600" />
            <span className="text-lg font-semibold">Current Diagnosis</span>
          </div>
        }
        className="shadow-md border-l-4 border-l-purple-500"
      >
        {diagnosisInfo && diagnosisInfo.length > 0 ? (
          <div className="space-y-3">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-gray-800 leading-relaxed text-base">
                {diagnosisInfo[0].diagnosis_description}
              </p>
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>
                <strong>Diagnosis Code:</strong>{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {diagnosisInfo[0].diagnosis_code}
                </span>
              </span>
              <span>
                <strong>Patient ID:</strong> {diagnosisInfo[0].patient_id}
              </span>
            </div>
          </div>
        ) : (
          <Empty
            description="No diagnosis information available. Please search for a patient first."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>

      {/* Generate Orders Button */}
      <div className="flex justify-center">
        <Button
          type="primary"
          size="large"
          icon={<ThunderboltOutlined />}
          onClick={handleGenerateOrders}
          loading={loading}
          disabled={!diagnosisInfo || diagnosisInfo.length === 0}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            fontWeight: 600,
            height: "50px",
            paddingLeft: "32px",
            paddingRight: "32px",
            fontSize: "16px",
          }}
        >
          Generate Prescription & Requisition Forms
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="text-center py-12 shadow-md">
          <Spin size="large" />
          <p className="text-gray-600 mt-4 text-base">
            Generating orders based on diagnosis...
          </p>
        </Card>
      )}

      {/* Generated Orders Display */}
      {orderData && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prescription Card */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <MedicineBoxOutlined className="text-blue-600 text-xl" />
                <span className="text-lg font-semibold">Prescription Form</span>
              </div>
            }
            className="shadow-lg border-l-4 border-l-blue-500 hover:shadow-xl transition-shadow"
          >
            <div className="space-y-4">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 font-medium">
                    Prescription ID
                  </span>
                  <span className="font-mono bg-white px-3 py-1 rounded text-blue-700 font-bold text-lg shadow-sm">
                    #{orderData.prescription.prescription_id}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Patient ID:</span>
                    <span className="ml-2 font-semibold">
                      {orderData.prescription.patient_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Prescriber ID:</span>
                    <span className="ml-2 font-semibold">
                      {orderData.prescription.prescriber_id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medication Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="mb-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Medication
                  </div>
                  <div className="text-xl font-bold text-blue-700">
                    {orderData.prescription.medication_name}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Strength</div>
                    <div className="font-semibold text-gray-800">
                      {orderData.prescription.medication_strength}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Form</div>
                    <div className="font-semibold text-gray-800 capitalize">
                      {orderData.prescription.medication_form}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Quantity</div>
                    <div className="font-semibold text-gray-800">
                      {orderData.prescription.quantity}
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
                  {orderData.prescription.dosage_instructions}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">
                    Date Prescribed
                  </div>
                  <div className="font-medium text-gray-800 text-sm">
                    {formatDateTime(orderData.prescription.date_prescribed)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Expiry Date</div>
                  <div className="font-medium text-gray-800 text-sm">
                    {formatDate(orderData.prescription.expiry_date)}
                  </div>
                </div>
              </div>

              {/* Status and Refills */}
              <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div>
                  <span className="text-xs text-gray-500 mr-2">Status:</span>
                  <Tag
                    color={getStatusColor(orderData.prescription.status)}
                    className="text-sm font-semibold"
                  >
                    {orderData.prescription.status.toUpperCase()}
                  </Tag>
                </div>
                <div>
                  <span className="text-xs text-gray-500 mr-2">
                    Refills Allowed:
                  </span>
                  <span className="font-bold text-lg text-blue-600">
                    {orderData.prescription.refills_allowed}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {orderData.prescription.notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-xs text-blue-700 uppercase tracking-wide mb-2 font-semibold">
                    Notes
                  </div>
                  <div className="text-gray-700 text-sm leading-relaxed">
                    {orderData.prescription.notes}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Requisition Card */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <ExperimentOutlined className="text-green-600 text-xl" />
                <span className="text-lg font-semibold">Requisition Form</span>
              </div>
            }
            className="shadow-lg border-l-4 border-l-green-500 hover:shadow-xl transition-shadow"
          >
            <div className="space-y-4">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 font-medium">
                    Requisition ID
                  </span>
                  <span className="font-mono bg-white px-3 py-1 rounded text-green-700 font-bold text-lg shadow-sm">
                    #{orderData.requisition.requisition_id}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Patient ID:</span>
                  <span className="ml-2 font-semibold">
                    {orderData.requisition.patient_id}
                  </span>
                </div>
              </div>

              {/* Department and Test Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="mb-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Department
                  </div>
                  <div className="text-xl font-bold text-green-700">
                    {orderData.requisition.department}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Test Type</div>
                    <div className="font-semibold text-gray-800 text-lg">
                      {orderData.requisition.test_type}
                    </div>
                  </div>
                  {orderData.requisition.test_code && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Test Code
                      </div>
                      <div className="font-mono bg-gray-100 px-3 py-1 rounded inline-block font-medium">
                        {orderData.requisition.test_code}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Clinical Information */}
              <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                <div className="text-xs text-blue-700 uppercase tracking-wide mb-2 font-semibold">
                  Clinical Information
                </div>
                <div className="text-gray-800 leading-relaxed">
                  {orderData.requisition.clinical_info}
                </div>
              </div>

              {/* Date and Priority */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-500 mb-2">Date Requested</div>
                <div className="font-medium text-gray-800 mb-3">
                  {formatDateTime(orderData.requisition.date_requested)}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500 mr-2">
                      Priority:
                    </span>
                    <Tag
                      color={getStatusColor(orderData.requisition.priority)}
                      className="text-sm font-semibold"
                    >
                      {orderData.requisition.priority.toUpperCase()}
                    </Tag>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 mr-2">Status:</span>
                    <Tag
                      color={getStatusColor(orderData.requisition.status)}
                      className="text-sm font-semibold"
                    >
                      {orderData.requisition.status.toUpperCase()}
                    </Tag>
                  </div>
                </div>
              </div>

              {/* Result Date */}
              {orderData.requisition.result_date && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="text-xs text-green-700 mb-1">Result Date</div>
                  <div className="font-medium text-gray-800">
                    {formatDate(orderData.requisition.result_date)}
                  </div>
                </div>
              )}

              {/* Notes */}
              {orderData.requisition.notes && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-xs text-green-700 uppercase tracking-wide mb-2 font-semibold">
                    Notes
                  </div>
                  <div className="text-gray-700 text-sm leading-relaxed">
                    {orderData.requisition.notes}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* No Orders State */}
      {!orderData && !loading && diagnosisInfo && diagnosisInfo.length > 0 && (
        <Card className="text-center py-16 shadow-sm border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center justify-center">
            <ThunderboltOutlined className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              No Orders Generated Yet
            </h3>
            <p className="text-gray-400 text-base">
              Click the button above to generate prescription and requisition
              forms
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OrderGeneration;
