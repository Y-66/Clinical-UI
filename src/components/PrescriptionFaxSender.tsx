import { useState, useEffect } from "react";
import { Button, message, Result, Alert, Tag } from "antd";
import {
  SendOutlined,
  CheckCircleOutlined,
  MedicineBoxOutlined,
  LoadingOutlined,
  EnvironmentOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import {
  useGeneratedOrdersStore,
  useSelectedPharmacyStore,
  useFaxSentStore,
} from "../store";
import { sendPrescriptionFax } from "../apis/patient";

const PrescriptionFaxSender: React.FC = () => {
  const [prescriptionFaxSent, setPrescriptionFaxSent] = useState(false);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [prescriptionMessage, setPrescriptionMessage] = useState("");
  const { prescriptionId } = useGeneratedOrdersStore();
  const { selectedPharmacy } = useSelectedPharmacyStore();
  const { setPrescriptionFaxSent: setGlobalPrescriptionFaxSent } =
    useFaxSentStore();

  useEffect(() => {
    if (prescriptionFaxSent) {
      setGlobalPrescriptionFaxSent(true);
    }
  }, [prescriptionFaxSent, setGlobalPrescriptionFaxSent]);

  const handleSendPrescriptionFax = async () => {
    if (!prescriptionId) {
      message.error("Prescription ID not found. Please generate prescription first.");
      return;
    }

    setPrescriptionLoading(true);
    try {
      const response = await sendPrescriptionFax(prescriptionId);
      setPrescriptionFaxSent(true);
      setPrescriptionMessage(response.message || "Fax sent successfully");
      message.success("Prescription fax sent successfully!");
    } catch (error) {
      message.error("Failed to send prescription fax. Please try again.");
      console.error("Error sending prescription fax:", error);
    } finally {
      setPrescriptionLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[500px] flex flex-col">
      {/* Header Info */}
      <Alert
        message="Fax Transmission"
        description="Transmit prescription to pharmacy. Click the button below to send the fax."
        type="info"
        showIcon
        className="mb-6"
      />

      {/* Fax Sent Success State */}
      {prescriptionFaxSent && (
        <Result
          status="success"
          icon={<CheckCircleOutlined className="text-green-600" />}
          title={
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Prescription Fax Sent Successfully!
            </span>
          }
          subTitle="Your prescription has been successfully faxed to the pharmacy."
          extra={
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <MedicineBoxOutlined className="text-2xl text-white" />
                  </div>
                  <span className="font-bold text-blue-800 text-lg">
                    Prescription Fax
                  </span>
                </div>
                {selectedPharmacy && (
                  <div className="bg-white rounded-lg p-3 mb-3 border border-blue-100">
                    <div className="flex items-start gap-2">
                      <ShopOutlined className="text-blue-600 mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm mb-1">
                          {selectedPharmacy.name}
                        </p>
                        <div className="flex items-start gap-1">
                          <EnvironmentOutlined className="text-blue-500 text-xs mt-0.5" />
                          <p className="text-xs text-gray-600">
                            {selectedPharmacy.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                  <p className="text-sm text-green-800 font-medium mb-1">
                    ✓ {prescriptionMessage}
                  </p>
                </div>
              </div>
            </div>
          }
        />
      )}

      {/* Fax Sending Interface */}
      {!prescriptionFaxSent && (
        <div className="space-y-6 flex-1">
          <div className="max-w-xl mx-auto">
            {/* Prescription Fax Card */}
            <div className="shadow-lg transition-all duration-300 rounded-3xl p-6 border-2 border-blue-300 hover:shadow-xl bg-white">
              <div className="flex flex-col items-center text-center space-y-3 py-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-blue-400 to-blue-600">
                  <MedicineBoxOutlined className="text-3xl text-white" />
                </div>

                <div className="w-full">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                    <MedicineBoxOutlined className="text-blue-600" />
                    Prescription Fax
                  </h3>

                  {selectedPharmacy ? (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 text-left border border-blue-100">
                      <div className="flex items-start gap-2">
                        <ShopOutlined className="text-blue-600 mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm mb-1">
                            {selectedPharmacy.name}
                          </p>
                          <div className="flex items-start gap-1">
                            <EnvironmentOutlined className="text-blue-500 mt-0.5 text-xs" />
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {selectedPharmacy.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No pharmacy selected</p>
                  )}

                  {prescriptionId && (
                    <div className="mt-2">
                      <Tag color="cyan">Prescription ID: {prescriptionId}</Tag>
                    </div>
                  )}
                </div>

                <Button
                  type="primary"
                  icon={
                    prescriptionLoading ? <LoadingOutlined /> : <SendOutlined />
                  }
                  onClick={handleSendPrescriptionFax}
                  loading={prescriptionLoading}
                  disabled={!prescriptionId}
                  className="h-12 px-10 font-semibold text-lg mt-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
                    border: "none",
                  }}
                >
                  Send Prescription Fax
                </Button>
              </div>
            </div>
          </div>

          {/* Warning if ID is missing */}
          {!prescriptionId && (
            <Alert
              message="Missing Prescription Information"
              description="Please generate and submit a prescription before sending fax."
              type="warning"
              showIcon
              className="mt-4"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PrescriptionFaxSender;
