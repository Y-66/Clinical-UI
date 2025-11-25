import { Result, Button, Card, Timeline } from "antd";
import {
  CheckCircleOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  SendOutlined,
  HomeOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  useCurrentDiagnosisInfoStore,
  useSelectedPharmacyStore,
  useSelectedLabStore,
  useFaxSentStore,
} from "../store";

export const CompletionPage = () => {
  const { diagnosisInfo } = useCurrentDiagnosisInfoStore();
  const { selectedPharmacy } = useSelectedPharmacyStore();
  const { selectedLab } = useSelectedLabStore();
  const { prescriptionFaxSent, requisitionFaxSent } = useFaxSentStore();

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="w-full min-h-[600px] flex flex-col items-center justify-center py-8">
      <Result
        status="success"
        icon={
          <div className="relative">
            <CheckCircleOutlined className="text-green-500 text-8xl animate-bounce" />
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
          </div>
        }
        title={
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              All Processes Completed Successfully!
            </h1>
            <p className="text-lg text-gray-600">
              Your medical documents have been processed and sent
            </p>
          </div>
        }
        subTitle={
          <div className="mt-6 max-w-4xl mx-auto">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Patient Info Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <CheckCircleOutlined className="text-white text-xl" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-800 m-0">
                    Patient Information
                  </h3>
                </div>
                {diagnosisInfo && diagnosisInfo.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Diagnosis:</span>{" "}
                      {diagnosisInfo[0].diagnosis_description}
                    </p>
                    <p className="text-xs text-gray-500">
                      ICD-10: {diagnosisInfo[0].diagnosis_code}
                    </p>
                  </div>
                )}
              </Card>

              {/* Pharmacy Card */}
              {selectedPharmacy && (
                <Card
                  className={`bg-gradient-to-br ${
                    prescriptionFaxSent
                      ? "from-purple-50 to-pink-50 border-2 border-purple-200"
                      : "from-gray-50 to-slate-50 border-2 border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-full ${
                        prescriptionFaxSent ? "bg-purple-500" : "bg-gray-400"
                      } flex items-center justify-center`}
                    >
                      {prescriptionFaxSent ? (
                        <MedicineBoxOutlined className="text-white text-xl" />
                      ) : (
                        <CloseCircleOutlined className="text-white text-xl" />
                      )}
                    </div>
                    <h3
                      className={`text-lg font-bold ${
                        prescriptionFaxSent
                          ? "text-purple-800"
                          : "text-gray-600"
                      } m-0`}
                    >
                      Prescription {prescriptionFaxSent ? "Sent" : "Not Sent"}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-700">
                      {selectedPharmacy.name}
                    </p>
                    <p className="text-xs text-gray-500 flex items-start gap-1">
                      <EnvironmentOutlined className="mt-0.5" />
                      {selectedPharmacy.address}
                    </p>
                    {prescriptionFaxSent ? (
                      <p className="text-xs text-green-600 font-medium mt-2">
                        ✓ Fax delivered successfully
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 font-medium mt-2">
                        ⊗ Fax not sent
                      </p>
                    )}
                  </div>
                </Card>
              )}

              {/* Lab Card */}
              {selectedLab && (
                <Card
                  className={`bg-gradient-to-br ${
                    requisitionFaxSent
                      ? "from-green-50 to-emerald-50 border-2 border-green-200"
                      : "from-gray-50 to-slate-50 border-2 border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-full ${
                        requisitionFaxSent ? "bg-green-500" : "bg-gray-400"
                      } flex items-center justify-center`}
                    >
                      {requisitionFaxSent ? (
                        <ExperimentOutlined className="text-white text-xl" />
                      ) : (
                        <CloseCircleOutlined className="text-white text-xl" />
                      )}
                    </div>
                    <h3
                      className={`text-lg font-bold ${
                        requisitionFaxSent ? "text-green-800" : "text-gray-600"
                      } m-0`}
                    >
                      Requisition {requisitionFaxSent ? "Sent" : "Not Sent"}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-700">
                      {selectedLab.name}
                    </p>
                    <p className="text-xs text-gray-500 flex items-start gap-1">
                      <EnvironmentOutlined className="mt-0.5" />
                      {selectedLab.address}
                    </p>
                    {requisitionFaxSent ? (
                      <p className="text-xs text-green-600 font-medium mt-2">
                        ✓ Fax delivered successfully
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 font-medium mt-2">
                        ⊗ Fax not sent
                      </p>
                    )}
                  </div>
                </Card>
              )}

              {/* Completion Status Card */}
              <Card
                className={`bg-gradient-to-br ${
                  prescriptionFaxSent || requisitionFaxSent
                    ? "from-amber-50 to-orange-50 border-2 border-amber-200"
                    : "from-gray-50 to-slate-50 border-2 border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      prescriptionFaxSent || requisitionFaxSent
                        ? "bg-amber-500"
                        : "bg-gray-400"
                    } flex items-center justify-center`}
                  >
                    <SendOutlined className="text-white text-xl" />
                  </div>
                  <h3
                    className={`text-lg font-bold ${
                      prescriptionFaxSent || requisitionFaxSent
                        ? "text-amber-800"
                        : "text-gray-600"
                    } m-0`}
                  >
                    Fax Status
                  </h3>
                </div>
                <p className="text-sm text-gray-700">
                  {prescriptionFaxSent && requisitionFaxSent
                    ? "Both documents have been successfully faxed to their respective destinations"
                    : prescriptionFaxSent
                    ? "Prescription has been faxed to pharmacy"
                    : requisitionFaxSent
                    ? "Requisition has been faxed to laboratory"
                    : "No faxes were sent"}
                </p>
              </Card>
            </div>

            {/* Process Timeline */}
            <Card className="bg-white/50 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileTextOutlined />
                Workflow Summary
              </h3>
              <Timeline
                items={[
                  {
                    color: "green",
                    children: (
                      <div>
                        <p className="font-semibold text-gray-800 m-0">
                          Patient Information Confirmed
                        </p>
                        <p className="text-sm text-gray-500">
                          Client diagnosis and details verified
                        </p>
                      </div>
                    ),
                  },
                  {
                    color: "green",
                    children: (
                      <div>
                        <p className="font-semibold text-gray-800 m-0">
                          Documents Generated
                        </p>
                        <p className="text-sm text-gray-500">
                          Prescription and requisition created
                        </p>
                      </div>
                    ),
                  },
                  {
                    color: "green",
                    children: (
                      <div>
                        <p className="font-semibold text-gray-800 m-0">
                          Facilities Selected
                        </p>
                        <p className="text-sm text-gray-500">
                          Pharmacy and laboratory assigned
                        </p>
                      </div>
                    ),
                  },
                  {
                    color: "green",
                    children: (
                      <div>
                        <p className="font-semibold text-gray-800 m-0">
                          Forms Reviewed & Submitted
                        </p>
                        <p className="text-sm text-gray-500">
                          Documents verified and approved
                        </p>
                      </div>
                    ),
                  },
                  {
                    color: "green",
                    children: (
                      <div>
                        <p className="font-semibold text-gray-800 m-0">
                          Faxes Sent Successfully
                        </p>
                        <p className="text-sm text-gray-500">
                          All documents delivered to destinations
                        </p>
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </div>
        }
        extra={[
          <Button
            key="restart"
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={handleRestart}
            className="h-12 px-8 font-bold shadow-lg"
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)",
              border: "none",
            }}
          >
            Start New Workflow
          </Button>,
        ]}
      />
    </div>
  );
};
