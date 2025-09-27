import "./App.css";
import "antd/dist/reset.css";
import { useState } from "react";
import { Button, message, Steps, Card } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import { Step1 } from "./pages/step1";
import { Step3 } from "./pages/step3";
import { Step4 } from "./pages/step4";
import { Step2 } from "./pages/step2";
import SideBot from "./components/SideBot";

const App = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const steps = [
    {
      title: "Confirm",
      description: "Confirm Your Personal Information",
    },
    {
      title: "Address",
      description: "Comfirm Your Pharmacy",
    },
    {
      title: "Prescription",
      description: "Get Your Prescription",
    },
    {
      title: "Send",
      description: "Send to Pharmacy",
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
  }));

  return (
    <div className="relative grid grid-cols-6 gap-4 p-4 mt-2">
      {/* 左侧 Steps */}
      <div className="col-span-1 flex justify-start ">
        <Steps direction="vertical" current={current} items={items} />
      </div>

      {/* 主区域 */}
      <div className="w-[800px] col-span-5 ml-12 p-6 border rounded-lg bg-white flex flex-col justify-end max-h-[550px] min-h-[550px] gap-4">
        {current === 0 && <Step1 />}
        {current === 1 && <Step2 />}
        {current === 2 && <Step3 />}
        {current === 3 && <Step4 />}

        {/* 按钮组 */}
        <div className="flex gap-2 mt-4 justify-between">
          {/* 这里加一个按钮控制右侧栏 */}
          <Button
            onClick={() => setShowSidebar(!showSidebar)}
            icon={<RobotOutlined />}
          >
            {showSidebar ? "Close" : "Robot"}
          </Button>

          <div className="flex gap-2">
            {current > 0 && <Button onClick={() => prev()}>Previous</Button>}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => message.success("Processing complete!")}
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 右侧栏（默认隐藏，用 absolute 定位，不影响主内容宽度） */}
      {showSidebar && (
        <Card className="fixed top-8 bottom-8 right-5 w-[280px] border-4 bg-gray-100 shadow-lg ">
          <h3 className="font-semibold mb-2">Assistant</h3>
          <SideBot />
        </Card>
      )}
    </div>
  );
};
export default App;
