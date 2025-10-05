import { Tabs } from "antd";
import { ShopOutlined, FileTextOutlined } from "@ant-design/icons";
import MyMap from "../components/maps/MyMap";

export const Step2 = () => {
  const tabItems = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <ShopOutlined />
          Pharmacy
        </span>
      ),
      children: (
        <div className="w-full">
          <MyMap />
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <FileTextOutlined />
          Requisition Center
        </span>
      ),
      children: (
        <div className="w-full">
          <MyMap />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full px-4">
      <Tabs 
        defaultActiveKey="1" 
        items={tabItems} 
        size="large"
        className="requisition-tabs"
      />
    </div>
  );
};