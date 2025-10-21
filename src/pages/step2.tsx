import { Tabs } from "antd";
import { ShopOutlined, FileTextOutlined } from "@ant-design/icons";
import MyPharmacyMap from "../components/maps/MyPharmacyMap";
import MyRequisitionMap from "../components/maps/MyRequisitionMap";

export const Step2 = () => {
  const tabItems = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2">
          <ShopOutlined />
          Pharmacy
        </span>
      ),
      children: (
        <div className="w-full">
          <MyPharmacyMap />
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2">
          <FileTextOutlined />
          Requisition Center
        </span>
      ),
      children: (
        <div className="w-full">
          <MyRequisitionMap />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full px-4">
      <Tabs
        defaultActiveKey="1"
        items={tabItems}
        size="middle"
        className="requisition-tabs"
        tabBarStyle={{ marginBottom: 10 }}
      />
    </div>
  );
};
