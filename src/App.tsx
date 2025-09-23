import "./App.css";
import "antd/dist/reset.css";
import { useState } from "react";
import { Button, message, Steps, Drawer } from "antd";
import { Step1 } from "./pages/step1";
import Map from "./components/Map";

const App = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const showLoading = () => {
    setOpen(true);
    setLoading(false);
  };
  const steps = [
    {
      title: "First",
      description: "First-content",
    },
    {
      title: "Second",
      description: "Second-content",
    },
    {
      title: "Third",
      description: "Last-content",
    },
    {
      title: "Last",
      description: "Last-content",
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
    <div className="grid grid-cols-6 gap-4 p-4 mt-2">
      <div className="col-span-1 flex justify-start ">
        <Steps direction="vertical" current={current} items={items} />
      </div>
      <div className=" w-[800px] col-span-5 ml-12 p-6 border rounded-lg bg-white flex flex-col justify-end max-h-[550px] min-h-[550px] gap-4">
        <div className="flex-1 mb-4"></div>
        {/*  */}
        {current === 0 && <Step1 />}
        {current === 1 && <Map />}
        <div className="flex gap-2 mt-4 justify-end">
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
      <div className="col-span-1">
        <Button type="primary" onClick={showLoading}>
          Open Drawer
        </Button>
      </div>
      <Drawer
        closable
        destroyOnHidden
        title={<p>Loading Drawer</p>}
        placement="right"
        open={open}
        loading={loading}
        onClose={() => setOpen(false)}
      >
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={showLoading}
        >
          Reload
        </Button>
      </Drawer>
    </div>
  );
};
export default App;
