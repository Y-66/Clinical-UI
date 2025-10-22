import "./App.css";
import "antd/dist/reset.css";
import { useState } from "react";
import { Button, message, Card } from "antd";
import {
  RobotOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  SendOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Step1 } from "./pages/step1";
import { Step3 } from "./pages/step3";
import { Step4 } from "./pages/step4";
import { Step2 } from "./pages/step2";
import SideBot from "./components/SideBot";
import CustomSteps from "./components/CustomSteps";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const App = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const steps = [
    {
      title: "Personal Info",
      description: "Confirm Client Information",
      icon: <CheckCircleOutlined />,
    },
    {
      title: "Facility Selection",
      description: "Select the Pharmacy & Lab",
      icon: <EnvironmentOutlined />,
    },
    {
      title: "Form Review",
      description: "Review the Prescription and Requisition",
      icon: <FileTextOutlined />,
    },
    {
      title: "Submit",
      description: "Send fax to Pharmacy & Lab",
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
  return (
    <div className="min-h-screen w-full p-8 relative">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-0">
        <h1 className="text-4xl font-bold text-white text-center mb-0 drop-shadow-lg">
          Digital Medical Document System
        </h1>
        <p className="text-white/90 text-center text-lg">
          Your health, simplified and secured
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Left Steps Panel */}
        <div className="col-span-3">
          <div className="glass-card p-6 min-h-[calc(100vh-8rem)]">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                Progress Tracker
              </h3>
              <p className="text-sm text-gray-500">
                Step {current + 1} of {steps.length}
              </p>
            </div>
            <CustomSteps steps={steps} current={current} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-9">
          <div className="glass-card p-8 min-h-[calc(100vh-8rem)] flex flex-col justify-between">
            {/* Step Title */}
            <div className="mb-0 flex items-center justify-between">
              <div className="flex items-baseline">
                <h2 className="text-3xl font-bold gradient-text">
                  {steps[current].title}
                </h2>
                <p className="text-gray-600 text-base ml-4">
                  {steps[current].description}
                </p>
              </div>
              <Button
                onClick={() => setShowSidebar(!showSidebar)}
                icon={<RobotOutlined />}
                size="large"
                className="premium-button shadow-lg"
                style={{
                  background: showSidebar
                    ? "linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)"
                    : "white",
                  color: showSidebar ? "white" : "#06b6d4",
                  border: showSidebar ? "none" : "2px solid #06b6d4",
                  fontWeight: 600,
                  height: "44px",
                  padding: "0 24px",
                }}
              >
                AI Assistant
              </Button>
            </div>

            {/* Step Content with Animation */}
            <div className="flex-1 overflow-hidden relative">
              <TransitionGroup component={null}>
                <CSSTransition key={current} timeout={500} classNames="page">
                  <div className="absolute inset-0 overflow-auto">
                    {current === 0 && <Step1 />}
                    {current === 1 && <Step2 />}
                    {current === 2 && <Step3 />}
                    {current === 3 && <Step4 />}
                  </div>
                </CSSTransition>
              </TransitionGroup>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-center mt-6 pt-6 border-t-2 border-gray-200">
              <div className="flex gap-3">
                {current > 0 && (
                  <Button
                    onClick={() => prev()}
                    size="large"
                    className="premium-button"
                    style={{
                      fontWeight: 600,
                      border: "2px solid #d1d5db",
                    }}
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
                        "linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)",
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
            className="glass-card h-full border-2 border-cyan-200/50 shadow-2xl"
            bodyStyle={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "24px",
            }}
          >
            <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center floating shadow-lg shadow-cyan-500/50">
                  <RobotOutlined className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 m-0">
                    AI Assistant
                  </h3>
                  <p className="text-sm text-gray-500 m-0">Here to help you</p>
                </div>
              </div>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setShowSidebar(false)}
                className="hover:bg-gray-100 transition-colors"
                style={{
                  color: '#6b7280',
                  width: '32px',
                  height: '32px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <SideBot />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
export default App;
