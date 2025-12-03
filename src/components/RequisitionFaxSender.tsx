import { useState, useEffect } from "react";
import { Button, message, Result, Alert, Tag } from "antd";
import {
  SendOutlined,
  CheckCircleOutlined,
  ExperimentOutlined,
  LoadingOutlined,
  EnvironmentOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import {
  useGeneratedOrdersStore,
  useSelectedLabStore,
  useFaxSentStore,
} from "../store";
import { sendRequisitionFax } from "../apis/patient";

const RequisitionFaxSender: React.FC = () => {
  const [requisitionFaxSent, setRequisitionFaxSent] = useState(false);
  const [requisitionLoading, setRequisitionLoading] = useState(false);
  const [requisitionMessage, setRequisitionMessage] = useState("");
  const { requisitionId } = useGeneratedOrdersStore();
  const { selectedLab } = useSelectedLabStore();
  const { setRequisitionFaxSent: setGlobalRequisitionFaxSent } =
    useFaxSentStore();

  useEffect(() => {
    if (requisitionFaxSent) {
      setGlobalRequisitionFaxSent(true);
    }
  }, [requisitionFaxSent, setGlobalRequisitionFaxSent]);

  const handleSendRequisitionFax = async () => {
    if (!requisitionId) {
      message.error("Requisition ID not found. Please generate requisition first.");
      return;
    }

    setRequisitionLoading(true);
    try {
      const response = await sendRequisitionFax(requisitionId);
      setRequisitionFaxSent(true);
      setRequisitionMessage(response.message || "Fax sent successfully");
      message.success("Requisition fax sent successfully!");
    } catch (error) {
      message.error("Failed to send requisition fax. Please try again.");
      console.error("Error sending requisition fax:", error);
    } finally {
      setRequisitionLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[500px] flex flex-col">
      {/* Header Info */}
      <Alert
        message="Fax Transmission"
        description="Transmit requisition to lab. Click the button below to send the fax."
        type="info"
        showIcon
        className="mb-6"
      />

      {/* Fax Sent Success State */}
      {requisitionFaxSent && (
        <Result
          status="success"
          icon={<CheckCircleOutlined className="text-green-600" />}
          title={
            <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Requisition Fax Sent Successfully!
            </span>
          }
          subTitle="Your requisition has been successfully faxed to the lab."
          extra={
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <ExperimentOutlined className="text-2xl text-white" />
                  </div>
                  <span className="font-bold text-green-800 text-lg">
                    Requisition Fax
                  </span>
                </div>
                {selectedLab && (
                  <div className="bg-white rounded-lg p-3 mb-3 border border-green-100">
                    <div className="flex items-start gap-2">
                      <ShopOutlined className="text-green-600 mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm mb-1">
                          {selectedLab.name}
                        </p>
                        <div className="flex items-start gap-1">
                          <EnvironmentOutlined className="text-green-500 text-xs mt-0.5" />
                          <p className="text-xs text-gray-600">
                            {selectedLab.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                  <p className="text-sm text-green-800 font-medium mb-1">
                    ✓ {requisitionMessage}
                  </p>
                </div>
              </div>
            </div>
          }
        />
      )}

      {/* Fax Sending Interface */}
      {!requisitionFaxSent && (
        <div className="space-y-6 flex-1">
          <div className="max-w-xl mx-auto">
            {/* Requisition Fax Card */}
            <div className="shadow-lg transition-all duration-300 rounded-3xl p-6 border-2 border-green-300 hover:shadow-xl bg-white">
              <div className="flex flex-col items-center text-center space-y-3 py-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-green-400 to-green-600">
                  <ExperimentOutlined className="text-3xl text-white" />
                </div>

                <div className="w-full">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                    <ExperimentOutlined className="text-green-600" />
                    Requisition Fax
                  </h3>

                  {selectedLab ? (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 text-left border border-green-100">
                      <div className="flex items-start gap-2">
                        <ShopOutlined className="text-green-600 mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm mb-1">
                            {selectedLab.name}
                          </p>
                          <div className="flex items-start gap-1">
                            <EnvironmentOutlined className="text-green-500 mt-0.5 text-xs" />
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {selectedLab.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No lab selected</p>
                  )}

                  {requisitionId && (
                    <div className="mt-2">
                      <Tag color="lime">Requisition ID: {requisitionId}</Tag>
                    </div>
                  )}
                </div>

                <Button
                  type="primary"
                  icon={
                    requisitionLoading ? <LoadingOutlined /> : <SendOutlined />
                  }
                  onClick={handleSendRequisitionFax}
                  loading={requisitionLoading}
                  disabled={!requisitionId}
                  className="h-12 px-10 font-semibold text-lg mt-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                    border: "none",
                  }}
                >
                  Send Requisition Fax
                </Button>
              </div>
            </div>
          </div>

          {/* Warning if ID is missing */}
          {!requisitionId && (
            <Alert
              message="Missing Requisition Information"
              description="Please generate and submit a requisition before sending fax."
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

export default RequisitionFaxSender;
