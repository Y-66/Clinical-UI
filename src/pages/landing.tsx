import { Card, Button } from "antd";
import {
  UserOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();

  const patientOptions = [
    { id: 1, name: "John Smith", condition: "Diabetes Type 2" },
    { id: 2, name: "Sarah Johnson", condition: "Hypertension" },
    { id: 3, name: "Michael Chen", condition: "Asthma" },
    { id: 4, name: "Emma Wilson", condition: "Arthritis" },
  ];

  const handlePatientSelect = (patientId: number) => {
    // Navigate to root with patient_id parameter
    navigate(`/?patient_id=${patientId}`);
  };

  return (
    <div className="min-h-screen w-full p-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center shadow-2xl animate-pulse">
              <MedicineBoxOutlined className="text-white text-4xl" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Digital Medical Document System
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Streamline your healthcare workflow with intelligent automation
          </p>
          <p className="text-lg text-gray-500">
            Select a patient to begin processing medical documents
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-t-cyan-500">
            <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-4">
              <UserOutlined className="text-2xl text-cyan-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Patient Management
            </h3>
            <p className="text-sm text-gray-600">
              Access and manage patient diagnoses with ease
            </p>
          </Card>

          <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-t-teal-500">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
              <MedicineBoxOutlined className="text-2xl text-teal-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Prescription Processing
            </h3>
            <p className="text-sm text-gray-600">
              Generate and send prescriptions to pharmacies instantly
            </p>
          </Card>

          <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-t-blue-500">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <ExperimentOutlined className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Lab Requisitions
            </h3>
            <p className="text-sm text-gray-600">
              Create and transmit lab orders to testing facilities
            </p>
          </Card>
        </div>

        {/* Patient Selection Section */}
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Select a Patient
            </h2>
            <p className="text-gray-600">
              Choose a patient to start the medical document workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {patientOptions.map((patient) => (
              <Card
                key={patient.id}
                className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-cyan-400"
                onClick={() => handlePatientSelect(patient.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <UserOutlined className="text-white text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {patient.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Patient ID: {patient.id}
                    </p>
                    <div className="inline-block px-3 py-1 bg-blue-50 rounded-full">
                      <p className="text-xs text-blue-700 font-medium m-0">
                        {patient.condition}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button
                      type="primary"
                      icon={<RocketOutlined />}
                      size="large"
                      style={{
                        background:
                          "linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)",
                        border: "none",
                        fontWeight: 600,
                      }}
                    >
                      Start
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Or enter a custom patient ID in the next step
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Secure • HIPAA Compliant • Encrypted Communication
          </p>
        </div>
      </div>
    </div>
  );
};
