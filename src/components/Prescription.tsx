import React from "react";
import { Card, Tag, Divider, Row, Col, Avatar, Button } from "antd";
import { 
  UserOutlined, 
  CalendarOutlined, 
  MedicineBoxOutlined,
  FileTextOutlined,
  DownloadOutlined,
  PrinterOutlined
} from "@ant-design/icons";

const Prescription: React.FC = () => (
  <div className="w-full max-w-4xl mx-auto h-full">
    <Card 
      className="shadow-lg rounded-2xl border-2 border-cyan-100"
      bodyStyle={{ padding: '32px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
            <FileTextOutlined className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 m-0">Digital Prescription</h2>
            <p className="text-gray-500 m-0 mt-1">Electronic Health Record</p>
          </div>
        </div>
        <Tag color="green" className="px-4 py-1 text-base font-semibold">
          ACTIVE
        </Tag>
      </div>

      {/* Patient Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <UserOutlined className="text-cyan-600" />
          Patient Information
        </h3>
        <Row gutter={[24, 16]}>
          <Col span={12}>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Patient Name</p>
              <p className="text-gray-800 font-semibold text-base m-0">John Smith</p>
            </div>
          </Col>
          <Col span={12}>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Date of Birth</p>
              <p className="text-gray-800 font-semibold text-base m-0">January 15, 1985</p>
            </div>
          </Col>
          <Col span={12}>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Prescription ID</p>
              <p className="text-gray-800 font-semibold text-base m-0">RX-2025-001234</p>
            </div>
          </Col>
          <Col span={12}>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Issue Date</p>
              <p className="text-gray-800 font-semibold text-base m-0 flex items-center gap-2">
                <CalendarOutlined className="text-cyan-600" />
                October 5, 2025
              </p>
            </div>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* Medication Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <MedicineBoxOutlined className="text-cyan-600" />
          Prescribed Medications
        </h3>
        
        <div className="space-y-4">
          {/* Medication 1 */}
          <div className="border-2 border-cyan-100 rounded-xl p-5 bg-gradient-to-r from-cyan-50/50 to-teal-50/50">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-lg font-bold text-gray-800 m-0">Amoxicillin 500mg</h4>
                <p className="text-gray-600 mt-1">Antibiotic - Capsules</p>
              </div>
              <Tag color="blue" className="text-sm font-semibold">30 Days</Tag>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div>
                <p className="text-gray-500 text-sm mb-1">Dosage</p>
                <p className="text-gray-800 font-semibold m-0">1 tablet</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Frequency</p>
                <p className="text-gray-800 font-semibold m-0">3 times daily</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Quantity</p>
                <p className="text-gray-800 font-semibold m-0">90 tablets</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-3 italic">
              Take with food. Complete full course even if symptoms improve.
            </p>
          </div>

          {/* Medication 2 */}
          <div className="border-2 border-cyan-100 rounded-xl p-5 bg-gradient-to-r from-cyan-50/50 to-teal-50/50">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-lg font-bold text-gray-800 m-0">Ibuprofen 400mg</h4>
                <p className="text-gray-600 mt-1">Pain Reliever - Tablets</p>
              </div>
              <Tag color="orange" className="text-sm font-semibold">As Needed</Tag>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div>
                <p className="text-gray-500 text-sm mb-1">Dosage</p>
                <p className="text-gray-800 font-semibold m-0">1 tablet</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Frequency</p>
                <p className="text-gray-800 font-semibold m-0">Every 6-8 hours</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Quantity</p>
                <p className="text-gray-800 font-semibold m-0">30 tablets</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-3 italic">
              Take with food or milk. Do not exceed 3 tablets in 24 hours.
            </p>
          </div>
        </div>
      </div>

      <Divider />

      {/* Prescriber Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Prescriber Information</h3>
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
          <Avatar 
            size={56} 
            icon={<UserOutlined />}
            style={{ backgroundColor: '#06b6d4' }}
          />
          <div>
            <p className="text-gray-800 font-bold text-base m-0">Dr. Sarah Johnson, MD</p>
            <p className="text-gray-600 m-0">Internal Medicine Specialist</p>
            <p className="text-gray-500 text-sm m-0 mt-1">License: MD-123456 | NPI: 1234567890</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <Button 
          icon={<DownloadOutlined />} 
          size="large"
          className="premium-button"
        >
          Download PDF
        </Button>
        <Button 
          icon={<PrinterOutlined />} 
          type="primary"
          size="large"
          className="premium-button"
          style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
            border: 'none',
          }}
        >
          Print Prescription
        </Button>
      </div>
    </Card>
  </div>
);

export default Prescription;
