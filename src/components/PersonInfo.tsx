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
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  IdcardOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { getLatestDiagnosisByPatientId } from "../apis/patient";
import type { DiagnosisInfo } from "../types/Diagnosis";

const PersonInfo: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisInfo[] | null>(
    null
  );

  const handleSearch = async (values: { patientId: string }) => {
    const patientId = parseInt(values.patientId);

    if (!patientId || patientId <= 0) {
      message.error("Please enter a valid patient ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getLatestDiagnosisByPatientId(patientId);
      console.log("Received diagnosis data:", data);

      // 检查数据是否有效
      if (!data || (Array.isArray(data) && data.length === 0)) {
        setError("No diagnosis information found for this patient");
        setDiagnosisData(null);
        message.warning("No diagnosis information found");
        return;
      }

      setDiagnosisData(Array.isArray(data) ? data : [data]);
      message.success("Diagnosis information loaded successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Diagnosis information not found or network error";
      setError(errorMessage);
      setDiagnosisData(null);
      console.error("Error:", err);
      message.error(errorMessage);
    } finally {
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

  return (
    <div className="w-full h-full space-y-6">
      {/* Client ID Search Area */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <SearchOutlined className="text-cyan-600" />
            <span className="text-lg font-semibold">
              Diagnosis Information Search
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
            label={<span className="font-medium">Patient ID</span>}
            rules={[
              { required: true, message: "Please enter patient ID" },
              { pattern: /^\d+$/, message: "Please enter a valid numeric ID" },
            ]}
            className="flex-1"
          >
            <Input
              placeholder="Enter patient ID to search diagnosis"
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
              Search Diagnosis
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
                Searching for diagnosis information...
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              This may take a few moments...
            </p>
          </div>
        </Card>
      )}

      {/* Diagnosis Information Display */}
      {diagnosisData && diagnosisData.length > 0 && !loading && (
        <div className="space-y-4">
          {diagnosisData.map((diagnosis, index) => (
            <Card
              key={diagnosis.diagnosis_id}
              title={
                <div className="flex items-center gap-2">
                  <FileTextOutlined className="text-purple-600" />
                  <span className="text-lg font-semibold">
                    Diagnosis #{index + 1}
                  </span>
                </div>
              }
              className="shadow-sm border-l-4 border-l-purple-500"
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
                      <IdcardOutlined className="text-purple-600 text-sm" />
                      <span>Diagnosis ID</span>
                    </div>
                  }
                >
                  <span className="font-bold text-purple-600 text-base">
                    #{diagnosis.diagnosis_id}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <div className="flex items-center gap-1">
                      <UserOutlined className="text-cyan-600 text-sm" />
                      <span>Patient ID</span>
                    </div>
                  }
                >
                  <span className="font-semibold">{diagnosis.patient_id}</span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <div className="flex items-center gap-1">
                      <UserOutlined className="text-blue-600 text-sm" />
                      <span>Doctor ID</span>
                    </div>
                  }
                >
                  {diagnosis.doctor_id}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <div className="flex items-center gap-1">
                      <FileTextOutlined className="text-green-600 text-sm" />
                      <span>Diagnosis Code</span>
                    </div>
                  }
                  span={2}
                >
                  <span className="font-mono bg-purple-50 px-3 py-1 rounded text-purple-700 text-base font-semibold">
                    {diagnosis.diagnosis_code}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <div className="flex items-center gap-1">
                      <CalendarOutlined className="text-orange-600 text-sm" />
                      <span>Diagnosis Date</span>
                    </div>
                  }
                >
                  {formatDate(diagnosis.diagnosis_date)}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <div className="flex items-center gap-1">
                      <FileTextOutlined className="text-amber-600 text-sm" />
                      <span>Description</span>
                    </div>
                  }
                  span={3}
                >
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {diagnosis.diagnosis_description}
                    </p>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!diagnosisData && !loading && !error && (
        <Card className="text-center py-16 shadow-sm border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center justify-center">
            <FileTextOutlined className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              No Diagnosis Information
            </h3>
            <p className="text-gray-400 text-base">
              Please enter a patient ID above to search for diagnosis details
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PersonInfo;
