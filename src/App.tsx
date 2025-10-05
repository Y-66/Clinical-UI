import "./App.css";
import "antd/dist/reset.css";
import { useState } from "react";
import { Button, message, Steps, Card } from "antd";
import {
  RobotOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Step1 } from "./pages/step1";
import { Step3 } from "./pages/step3";
import { Step4 } from "./pages/step4";
import { Step2 } from "./pages/step2";
import SideBot from "./components/SideBot";

const App = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const steps = [
    {
      title: "Personal Info",
      description: "Confirm Your Information",
      icon: <CheckCircleOutlined />,
    },
    {
      title: "Pharmacy",
      description: "Select Your Pharmacy",
      icon: <EnvironmentOutlined />,
    },
    {
      title: "Prescription",
      description: "Review Your Prescription",
      icon: <FileTextOutlined />,
    },
    {
      title: "Submit",
      description: "Send to Pharmacy",
      icon: <SendOutlined />,
    },
  ];
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    title: item.title,
    description: item.description,
    icon: item.icon,
  }));

  return (
    <div className="min-h-screen w-full p-8 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Left Steps Panel */}
        <div className="col-span-3">
          <div className="glass-card p-6 sticky top-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              Progress
            </h3>
            <Steps
              direction="vertical"
              current={current}
              items={items}
              className="custom-steps"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-9">
          <div className="glass-card p-8 min-h-[600px] flex flex-col justify-between step-animation">
            {/* Step Title */}
            <div className="mb-0">
              <h2 className="text-2xl font-bold gradient-text">
                {steps[current].title}
              </h2>
              <p className="text-gray-600 mt-1">{steps[current].description}</p>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-auto">
              {current === 0 && <Step1 />}
              {current === 1 && <Step2 />}
              {current === 2 && <Step3 />}
              {current === 3 && <Step4 />}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={() => setShowSidebar(!showSidebar)}
                icon={<RobotOutlined />}
                size="large"
                className="premium-button"
                style={{
                  background: showSidebar
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "white",
                  color: showSidebar ? "white" : "#667eea",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                {showSidebar ? "Close Assistant" : "AI Assistant"}
              </Button>

              <div className="flex gap-3">
                {current > 0 && (
                  <Button
                    onClick={() => prev()}
                    size="large"
                    className="premium-button"
                    style={{ fontWeight: 600 }}
                  >
                    Previous
                  </Button>
                )}
                {current < steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={() => next()}
                    size="large"
                    className="premium-button"
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      fontWeight: 600,
                    }}
                  >
                    Next Step
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={() =>
                      message.success("Prescription submitted successfully!")
                    }
                    size="large"
                    className="premium-button"
                    icon={<SendOutlined />}
                    style={{
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      border: "none",
                      fontWeight: 600,
                    }}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      {showSidebar && (
        <div className="fixed top-8 bottom-8 right-8 w-[380px] z-50 animate-in slide-in-from-right duration-300">
          <Card
            className="glass-card h-full border-2 border-white/30 shadow-2xl"
            bodyStyle={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "24px",
            }}
          >
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center floating">
                <RobotOutlined className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 m-0">
                  AI Assistant
                </h3>
                <p className="text-sm text-gray-500 m-0">Here to help you</p>
              </div>
            </div>
            <SideBot />
          </Card>
        </div>
      )}
    </div>
  );
};
export default App;
