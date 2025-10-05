import React, { useState } from "react";
import { Card, Button, Timeline, Tag, Alert } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ShopOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const Sending: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 h-full">
      {/* Success Alert */}
      <Alert
        message="Ready to Submit"
        description="Your prescription is ready to be sent to your selected pharmacy. Please review the details below before submitting."
        type="success"
        showIcon
        icon={<CheckCircleOutlined />}
        className="rounded-lg border-2 border-green-200"
      />

      {/* Pharmacy Details Card */}
      <Card 
        className="shadow-lg rounded-2xl border-2 border-cyan-100"
        bodyStyle={{ padding: '32px' }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
            <ShopOutlined className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 m-0">Selected Pharmacy</h2>
            <p className="text-gray-500 m-0 mt-1">Your prescription will be sent here</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">CVS Pharmacy</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <EnvironmentOutlined className="text-cyan-600 text-lg mt-1" />
              <div>
                <p className="text-gray-600 text-sm m-0">Address</p>
                <p className="text-gray-800 font-semibold m-0">123 Main Street, New York, NY 10001</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <PhoneOutlined className="text-cyan-600 text-lg mt-1" />
              <div>
                <p className="text-gray-600 text-sm m-0">Phone</p>
                <p className="text-gray-800 font-semibold m-0">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <ClockCircleOutlined className="text-cyan-600 text-lg mt-1" />
              <div>
                <p className="text-gray-600 text-sm m-0">Hours</p>
                <p className="text-gray-800 font-semibold m-0">Mon-Fri: 8:00 AM - 9:00 PM | Sat-Sun: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MailOutlined className="text-cyan-600 text-lg mt-1" />
              <div>
                <p className="text-gray-600 text-sm m-0">Email</p>
                <p className="text-gray-800 font-semibold m-0">pharmacy@cvs.com</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Tag color="green">Open Now</Tag>
            <Tag color="cyan">24/7 Available</Tag>
            <Tag color="blue">Drive-Through</Tag>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">What Happens Next</h3>
          <Timeline
            items={[
              {
                color: 'green',
                dot: <CheckCircleOutlined style={{ fontSize: '16px' }} />,
                children: (
                  <div>
                    <p className="font-semibold text-gray-800 m-0">Prescription Submitted</p>
                    <p className="text-gray-600 text-sm m-0">Your prescription will be sent electronically to the pharmacy</p>
                  </div>
                ),
              },
              {
                color: 'blue',
                children: (
                  <div>
                    <p className="font-semibold text-gray-800 m-0">Pharmacy Processing</p>
                    <p className="text-gray-600 text-sm m-0">The pharmacy will review and prepare your medication (typically 1-2 hours)</p>
                  </div>
                ),
              },
              {
                color: 'purple',
                children: (
                  <div>
                    <p className="font-semibold text-gray-800 m-0">Ready for Pickup</p>
                    <p className="text-gray-600 text-sm m-0">You'll receive a notification when your prescription is ready</p>
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* Prescription Summary */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Prescription Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Medications:</span>
              <span className="font-semibold text-gray-800">2 items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Patient:</span>
              <span className="font-semibold text-gray-800">John Smith</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Prescription ID:</span>
              <span className="font-semibold text-gray-800">RX-2025-001234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Ready Time:</span>
              <span className="font-semibold text-cyan-600">Today, 3:30 PM</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!submitted ? (
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            block
            className="h-14 text-lg font-semibold premium-button"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
            }}
            onClick={() => setSubmitted(true)}
          >
            Submit Prescription to Pharmacy
          </Button>
        ) : (
          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <CheckCircleOutlined className="text-6xl text-green-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Successfully Submitted!</h3>
            <p className="text-gray-600 mb-0">
              Your prescription has been sent to CVS Pharmacy. You'll receive a notification when it's ready for pickup.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Sending;
