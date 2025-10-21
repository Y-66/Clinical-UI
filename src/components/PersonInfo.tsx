import React, { useState } from "react";
import { Card, Input, Button, Form, Descriptions, message, Spin, Alert } from "antd";
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
} from "@ant-design/icons";
import { getPatientAndCreateDocsById } from "../apis/patient";

interface PatientInfo {
  clientId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  healthCardNum: string;
  phone: string;
  email: string;
  address: string;
  postalCode: string;
  emergencyContact: string;
  notes: string;
}

interface ApiResponse {
  client: PatientInfo;
}

const PersonInfo: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [error, setError] = useState<string>("");
  const [loadingStep, setLoadingStep] = useState<string>("");

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
      setLoadingStep('Searching for patient information...');
      const response: ApiResponse = await getPatientAndCreateDocsById(patientId);
      
      if (response && response.client) {
        setLoadingStep('Initializing prescription form...');
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate prescription init
        
        setLoadingStep('Preparing requisition documents...');
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate requisition init
        
        setPatientInfo(response.client);
        message.success("Patient information loaded successfully");
      } else {
        setError("Patient information not found");
        setPatientInfo(null);
      }
    } catch (err) {
      setError("Network error, please try again later");
      setPatientInfo(null);
      console.error("Error:", err);
    } finally {
      setLoadingStep('');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
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

  return (
    <div className="w-full h-full space-y-6">
      {/* Client ID Search Area */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <SearchOutlined className="text-cyan-600" />
            <span className="text-lg font-semibold">Patient Information Search</span>
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
            name="clientId"
            label={<span className="font-medium">Client ID</span>}
            rules={[
              { required: true, message: "Please enter client ID" },
              { pattern: /^\d+$/, message: "Please enter a valid numeric ID" },
            ]}
            className="flex-1"
          >
            <Input
              placeholder="Enter client ID to search"
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
                <span className="text-lg font-semibold">Patient Basic Information</span>
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
                <span className="text-lg font-semibold">Contact Information</span>
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
                <span className="font-mono bg-gray-50 px-2 py-1 rounded text-sm" style={{ fontSize: "14px" }}>
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
    </div>
  );
};

export default PersonInfo;
