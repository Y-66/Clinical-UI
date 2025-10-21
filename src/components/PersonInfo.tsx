import React, { useState } from "react";
import {
  Card,
  Input,
  Button,
  Form,
  Descriptions,
  message,
  Spin,
  Alert,
  Modal,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ContactsOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import {
  getPatientAndCreateDocsById,
  getLatestPrescriptionByClientId,
  getLatestRequisitionByClientId,
} from "../apis/patient";
import type { PatientInfo } from "../types/Patient";
import { useCurrentPatientInfoStore } from "../store";
import type { PrescriptionInfo } from "../types/Perscription";
import type { RequisitionInfo } from "../types/Requisition";

interface ApiResponse {
  client: PatientInfo;
}

const PersonInfo: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [error, setError] = useState<string>("");
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [prescriptionModalVisible, setPrescriptionModalVisible] =
    useState(false);
  const [requisitionModalVisible, setRequisitionModalVisible] = useState(false);
  const [prescriptionData, setPrescriptionData] =
    useState<PrescriptionInfo | null>(null);
  const [requisitionData, setRequisitionData] =
    useState<RequisitionInfo | null>(null);
  const [previewLoading, setPreviewLoading] = useState<string>("");

  const { updatePatientInfo } = useCurrentPatientInfoStore();

  const handleSearch = async (values: { patientId: string }) => {
    const patientId = parseInt(values.patientId);

    if (!patientId || patientId <= 0) {
      message.error("Please enter a valid client ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Show loading steps
      setLoadingStep("Searching for patient information...");
      const response: ApiResponse = await getPatientAndCreateDocsById(
        patientId
      );

      if (response && response.client) {
        setLoadingStep("Initializing prescription form...");
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate prescription init

        setLoadingStep("Preparing requisition documents...");
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate requisition init

        setPatientInfo(response.client);
        message.success("Patient information loaded successfully");
        updatePatientInfo(response.client);
      } else {
        setError("Patient information not found");
        setPatientInfo(null);
      }
    } catch (err) {
      setError("Network error, please try again later");
      setPatientInfo(null);
      console.error("Error:", err);
    } finally {
      setLoadingStep("");
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGenderDisplay = (gender: string) => {
    const genderMap: { [key: string]: string } = {
      male: "Male",
      female: "Female",
      M: "Male",
      F: "Female",
      other: "Other",
    };
    return genderMap[gender] || gender || "--";
  };

  const handlePreviewPrescription = async () => {
    if (!patientInfo) return;

    setPreviewLoading("prescription");
    try {
      const data = await getLatestPrescriptionByClientId(patientInfo.clientId);
      setPrescriptionData(data);
      setPrescriptionModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch prescription data");
      console.error("Error fetching prescription:", error);
    } finally {
      setPreviewLoading("");
    }
  };

  const handlePreviewRequisition = async () => {
    if (!patientInfo) return;

    setPreviewLoading("requisition");
    try {
      const data = await getLatestRequisitionByClientId(patientInfo.clientId);
      setRequisitionData(data);
      setRequisitionModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch requisition data");
      console.error("Error fetching requisition:", error);
    } finally {
      setPreviewLoading("");
    }
  };

  return (
    <div className="w-full h-full space-y-6">
      {/* Client ID Search Area */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <SearchOutlined className="text-cyan-600" />
            <span className="text-lg font-semibold">
              Patient Information Search
            </span>
          </div>
        }
        className="shadow-sm border-l-4 border-l-cyan-500"
      >
        <Form
          form={form}
          onFinish={handleSearch}
          layout="inline"
          className="w-full"
        >
          <Form.Item
            name="patientId"
            label={<span className="font-medium">Client ID</span>}
            rules={[
              { required: true, message: "Please enter patient ID" },
              { pattern: /^\d+$/, message: "Please enter a valid numeric ID" },
            ]}
            className="flex-1"
          >
            <Input
              placeholder="Enter patient ID to search"
              size="large"
              disabled={loading}
              prefix={<IdcardOutlined className="text-gray-400" />}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<SearchOutlined />}
              style={{
                background: "linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)",
                border: "none",
                fontWeight: 600,
                height: "40px",
                paddingLeft: "24px",
                paddingRight: "24px",
              }}
            >
              Search Patient
            </Button>
          </Form.Item>
        </Form>

        {/* Preview Buttons */}
        {patientInfo && !loading && (
          <div className="flex gap-3 mt-4">
            <Button
              icon={<MedicineBoxOutlined />}
              loading={previewLoading === "prescription"}
              onClick={handlePreviewPrescription}
              className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
            >
              Preview Latest Prescription
            </Button>
            <Button
              icon={<ExperimentOutlined />}
              loading={previewLoading === "requisition"}
              onClick={handlePreviewRequisition}
              className="bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
            >
              Preview Latest Requisition
            </Button>
          </div>
        )}
      </Card>

      {/* Error Message Display */}
      {error && (
        <Alert
          message="Search Failed"
          description={error}
          type="error"
          showIcon
          className="shadow-sm"
          closable
        />
      )}

      {/* Loading State */}
      {loading && (
        <Card className="text-center py-12 shadow-sm">
          <Spin size="large" />
          <div className="mt-6 space-y-4">
            <div className="flex flex-col items-center space-y-3">
              <div className="text-gray-700 font-medium flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                Searching for client information
              </div>
              <div className="text-gray-700 font-medium flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                Initializing prescription form
              </div>
              <div className="text-gray-700 font-medium flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                Initializing requisition form
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              This may take a few moments...
            </p>
          </div>
        </Card>
      )}

      {/* Patient Information Display */}
      {patientInfo && !loading && (
        <div className="space-y-4">
          {/* Basic Information Card */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <UserOutlined className="text-green-600" />
                <span className="text-lg font-semibold">
                  Patient Basic Information
                </span>
              </div>
            }
            className="shadow-sm border-l-4 border-l-green-500"
          >
            <Descriptions
              bordered
              column={{ xs: 1, sm: 2, md: 2, lg: 3 }}
              size="middle"
              labelStyle={{
                backgroundColor: "#f8fafc",
                fontWeight: 600,
                color: "#374151",
                width: "160px",
                fontSize: "13px",
                whiteSpace: "nowrap",
              }}
              contentStyle={{
                fontSize: "14px",
              }}
            >
              <Descriptions.Item
                label={
                  <div className="flex items-center gap-1">
                    <IdcardOutlined className="text-cyan-600 text-sm" />
                    <span>Client ID</span>
                  </div>
                }
              >
                <span className="font-bold text-cyan-600 text-base">
                  #{patientInfo.clientId}
                </span>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <div className="flex items-center gap-1">
                    <UserOutlined className="text-blue-600 text-sm" />
                    <span>Full Name</span>
                  </div>
                }
                span={2}
              >
                <span className="font-semibold text-base">
                  {patientInfo.firstName} {patientInfo.lastName}
                </span>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <div className="flex items-center gap-1">
                    <CalendarOutlined className="text-purple-600 text-sm" />
                    <span>Date of Birth</span>
                  </div>
                }
              >
                {formatDate(patientInfo.dateOfBirth)}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <div className="flex items-center gap-1">
                    <UserOutlined className="text-pink-600 text-sm" />
                    <span>Gender</span>
                  </div>
                }
              >
                {getGenderDisplay(patientInfo.gender)}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <div className="flex items-center gap-1">
                    <IdcardOutlined className="text-green-600 text-sm" />
                    <span>Health Card Number</span>
                  </div>
                }
              >
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                  {patientInfo.healthCardNum || "--"}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Contact Information Card */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <ContactsOutlined className="text-blue-600" />
                <span className="text-lg font-semibold">
                  Contact Information
                </span>
              </div>
            }
            className="shadow-sm border-l-4 border-l-blue-500"
          >
            <Descriptions
              bordered
              column={1}
              size="middle"
              labelStyle={{
                backgroundColor: "#f8fafc",
                fontWeight: 600,
                color: "#374151",
                width: "160px",
                fontSize: "13px",
                whiteSpace: "nowrap",
              }}
              contentStyle={{
                fontSize: "14px",
              }}
            >
              <Descriptions.Item
                label={
                  <div className="flex items-center gap-1">
                    <PhoneOutlined className="text-green-600 text-sm" />
                    <span>Phone</span>
                  </div>
                }
                span={1}
              >
                <span className="font-mono">{patientInfo.phone || "--"}</span>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <div className="flex items-center gap-1">
                    <MailOutlined className="text-red-600 text-sm" />
                    <span>Email</span>
                  </div>
                }
                span={1}
              >
                <span className="text-blue-600 underline">
                  {patientInfo.email || "--"}
                </span>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <div className="flex items-center gap-1">
                    <HomeOutlined className="text-orange-600 text-sm" />
                    <span>Address</span>
                  </div>
                }
                span={1}
              >
                {patientInfo.address || "--"}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <div className="flex items-center gap-1">
                    <HomeOutlined className="text-purple-600 text-sm" />
                    <span>Postal Code</span>
                  </div>
                }
                span={1}
              >
                <span
                  className="font-mono bg-gray-50 px-2 py-1 rounded text-sm"
                  style={{ fontSize: "14px" }}
                >
                  {patientInfo.postalCode || "--"}
                </span>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <div className="flex items-center gap-1">
                    <ContactsOutlined className="text-amber-600 text-sm" />
                    <span>Emergency Contact</span>
                  </div>
                }
                span={1}
              >
                {patientInfo.emergencyContact || "--"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Notes Information Card */}
          {patientInfo.notes && (
            <Card
              title={
                <div className="flex items-center gap-2">
                  <FileTextOutlined className="text-amber-600" />
                  <span className="text-lg font-semibold">Notes</span>
                </div>
              }
              className="shadow-sm border-l-4 border-l-amber-500"
            >
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {patientInfo.notes}
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {!patientInfo && !loading && !error && (
        <Card className="text-center py-16 shadow-sm border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center justify-center">
            <UserOutlined className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              No Patient Information
            </h3>
            <p className="text-gray-400 text-base">
              Please enter a client ID above to search for client details
            </p>
          </div>
        </Card>
      )}

      {/* Prescription Preview Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MedicineBoxOutlined className="text-blue-600" />
            <span>Latest Prescription Form</span>
          </div>
        }
        open={prescriptionModalVisible}
        onCancel={() => setPrescriptionModalVisible(false)}
        footer={null}
        width={700}
        style={{
          borderRadius: "12px",
        }}
        bodyStyle={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "8px",
        }}
      >
        {prescriptionData && (
          <Descriptions
            bordered
            column={1}
            size="small"
            labelStyle={{
              backgroundColor: "#f8fafc",
              fontWeight: 600,
              width: "180px",
            }}
          >
            <Descriptions.Item label="Prescription ID">
              {prescriptionData.prescriptionId}
            </Descriptions.Item>
            <Descriptions.Item label="Prescriber ID">
              {prescriptionData.prescriberId}
            </Descriptions.Item>
            <Descriptions.Item label="Medication Name">
              {prescriptionData.medicationName}
            </Descriptions.Item>
            <Descriptions.Item label="Strength">
              {prescriptionData.medicationStrength}
            </Descriptions.Item>
            <Descriptions.Item label="Form">
              {prescriptionData.medicationForm}
            </Descriptions.Item>
            <Descriptions.Item label="Dosage Instructions">
              {prescriptionData.dosageInstructions}
            </Descriptions.Item>
            <Descriptions.Item label="Quantity">
              {prescriptionData.quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Refills Allowed">
              {prescriptionData.refillsAllowed}
            </Descriptions.Item>
            <Descriptions.Item label="Date Prescribed">
              {formatDate(prescriptionData.datePrescribed)}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <span
                className={`px-2 py-1 rounded text-sm ${
                  prescriptionData.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {prescriptionData.status}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Pharmacy Name">
              {prescriptionData.pharmacyName}
            </Descriptions.Item>
            <Descriptions.Item label="Pharmacy Address">
              {prescriptionData.pharmacyAddress}
            </Descriptions.Item>
            {prescriptionData.notes && (
              <Descriptions.Item label="Notes">
                {prescriptionData.notes}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Requisition Preview Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ExperimentOutlined className="text-green-600" />
            <span>Latest Requisition Form</span>
          </div>
        }
        open={requisitionModalVisible}
        onCancel={() => setRequisitionModalVisible(false)}
        footer={null}
        width={700}
        style={{
          borderRadius: "12px",
        }}
        bodyStyle={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "8px",
        }}
      >
        {requisitionData && (
          <Descriptions
            bordered
            column={1}
            size="small"
            labelStyle={{
              backgroundColor: "#f8fafc",
              fontWeight: 600,
              width: "180px",
            }}
          >
            <Descriptions.Item label="Requisition ID">
              {requisitionData.requisitionId}
            </Descriptions.Item>
            <Descriptions.Item label="Requester ID">
              {requisitionData.requesterId}
            </Descriptions.Item>
            <Descriptions.Item label="Department">
              {requisitionData.department}
            </Descriptions.Item>
            <Descriptions.Item label="Test Type">
              {requisitionData.testType}
            </Descriptions.Item>
            <Descriptions.Item label="Test Code">
              {requisitionData.testCode}
            </Descriptions.Item>
            <Descriptions.Item label="Clinical Info">
              {requisitionData.clinicalInfo}
            </Descriptions.Item>
            <Descriptions.Item label="Date Requested">
              {formatDate(requisitionData.dateRequested)}
            </Descriptions.Item>
            <Descriptions.Item label="Priority">
              <span
                className={`px-2 py-1 rounded text-sm ${
                  requisitionData.priority === "High"
                    ? "bg-red-100 text-red-800"
                    : requisitionData.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {requisitionData.priority}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <span
                className={`px-2 py-1 rounded text-sm ${
                  requisitionData.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : requisitionData.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {requisitionData.status}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Lab Name">
              {requisitionData.labName}
            </Descriptions.Item>
            <Descriptions.Item label="Lab Address">
              {requisitionData.labAddress}
            </Descriptions.Item>
            {requisitionData.resultDate && (
              <Descriptions.Item label="Result Date">
                {formatDate(requisitionData.resultDate)}
              </Descriptions.Item>
            )}
            {requisitionData.notes && (
              <Descriptions.Item label="Notes">
                {requisitionData.notes}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PersonInfo;
