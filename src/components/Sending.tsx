import React, { useState } from "react";
import { Card, Button, Radio, Space, Divider } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ShopOutlined,
  RocketOutlined,
  CarOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const Sending: React.FC = () => {
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 h-full">
      {/* Main Card */}
      <Card className="shadow-xl rounded-2xl border-2 border-cyan-100">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg">
            <ShopOutlined className="text-white text-3xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 m-0">Selected Pharmacy</h2>
            <p className="text-gray-500 m-0 mt-1">CVS Pharmacy - Main Street</p>
          </div>
        </div>

        {/* Pharmacy Info */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <EnvironmentOutlined className="text-cyan-600 text-xl" />
            <div>
              <p className="text-xs text-gray-500 m-0">Address</p>
              <p className="text-sm font-semibold text-gray-800 m-0">123 Main St, NY 10001</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <PhoneOutlined className="text-cyan-600 text-xl" />
            <div>
              <p className="text-xs text-gray-500 m-0">Phone</p>
              <p className="text-sm font-semibold text-gray-800 m-0">(555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <ClockCircleOutlined className="text-cyan-600 text-xl" />
            <div>
              <p className="text-xs text-gray-500 m-0">Open Hours</p>
              <p className="text-sm font-semibold text-gray-800 m-0">8:00 AM - 9:00 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border-2 border-green-200">
            <CheckCircleOutlined className="text-green-600 text-xl" />
            <div>
              <p className="text-xs text-gray-500 m-0">Status</p>
              <p className="text-sm font-bold text-green-700 m-0">Open Now</p>
            </div>
          </div>
        </div>

        <Divider />

        {/* Two Column Layout: Delivery Method + Order Summary */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Left Column: Delivery Method Selection */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Choose Delivery Method</h3>
            <Radio.Group 
              value={deliveryMethod} 
              onChange={(e) => setDeliveryMethod(e.target.value)}
              className="w-full"
            >
              <Space direction="vertical" className="w-full" size="large">
                <Radio value="pickup" className="w-full">
                  <div 
                    className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                      deliveryMethod === 'pickup' 
                        ? 'border-cyan-500 bg-cyan-50' 
                        : 'border-gray-200 bg-white hover:border-cyan-300'
                    }`}
                    onClick={() => setDeliveryMethod('pickup')}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        deliveryMethod === 'pickup' 
                          ? 'bg-gradient-to-br from-cyan-500 to-teal-500' 
                          : 'bg-gray-200'
                      }`}>
                        <CarOutlined className={`text-2xl ${
                          deliveryMethod === 'pickup' ? 'text-white' : 'text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-gray-800 m-0 mb-1">Pickup at Pharmacy</h4>
                        <p className="text-sm text-gray-600 m-0 mb-2">Visit the pharmacy to collect</p>
                        <div className="flex gap-3 text-xs">
                          <span className="text-gray-500">
                            <ClockCircleOutlined className="mr-1" />
                            1-2 hours
                          </span>
                          <span className="font-semibold text-green-600">FREE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Radio>

                <Radio value="delivery" className="w-full">
                  <div 
                    className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                      deliveryMethod === 'delivery' 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 bg-white hover:border-purple-300'
                    }`}
                    onClick={() => setDeliveryMethod('delivery')}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        deliveryMethod === 'delivery' 
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                          : 'bg-gray-200'
                      }`}>
                        <HomeOutlined className={`text-2xl ${
                          deliveryMethod === 'delivery' ? 'text-white' : 'text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-gray-800 m-0 mb-1">Home Delivery</h4>
                        <p className="text-sm text-gray-600 m-0 mb-2">Delivered to your doorstep</p>
                        <div className="flex gap-3 text-xs">
                          <span className="text-gray-500">
                            <ClockCircleOutlined className="mr-1" />
                            2-4 hours
                          </span>
                          <span className="font-semibold text-purple-600">$5.99</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Radio>
              </Space>
            </Radio.Group>

            {/* Delivery Address (only show when delivery is selected) */}
            {deliveryMethod === 'delivery' && (
              <div className="mt-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                <h4 className="text-sm font-bold text-gray-800 m-0 mb-2">Delivery Address</h4>
                <div className="flex items-start gap-2">
                  <EnvironmentOutlined className="text-purple-600 text-base mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 m-0">456 Oak Avenue, Apt 12B</p>
                    <p className="text-sm text-gray-600 m-0">New York, NY 10002</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
            <div className="p-6 bg-gray-50 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Medications</span>
                <span className="font-semibold text-gray-800">2 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Patient</span>
                <span className="font-semibold text-gray-800">John Smith</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Prescription ID</span>
                <span className="font-mono text-xs bg-white px-3 py-1 rounded font-semibold text-gray-800">RX-2025-001234</span>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  {deliveryMethod === 'pickup' ? 'Pickup' : 'Delivery'} Fee
                </span>
                <span className="font-bold text-gray-800">
                  {deliveryMethod === 'pickup' ? 'FREE' : '$5.99'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimated Time</span>
                <span className={`font-bold ${deliveryMethod === 'pickup' ? 'text-cyan-600' : 'text-purple-600'}`}>
                  {deliveryMethod === 'pickup' ? 'Today, 3:30 PM' : 'Today, 5:30 PM'}
                </span>
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div className={`p-4 rounded-lg ${
                deliveryMethod === 'pickup' 
                  ? 'bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200' 
                  : 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className={`text-xl font-bold ${
                    deliveryMethod === 'pickup' ? 'text-cyan-700' : 'text-purple-700'
                  }`}>
                    {deliveryMethod === 'pickup' ? 'FREE' : '$5.99'}
                  </span>
                </div>
              </div>
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
            className="h-14 text-lg font-semibold"
            style={{
              background: deliveryMethod === 'pickup' 
                ? 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)'
                : 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              border: 'none',
            }}
            onClick={() => setSubmitted(true)}
          >
            {deliveryMethod === 'pickup' 
              ? 'Confirm Pickup Order' 
              : 'Confirm Delivery Order'}
          </Button>
        ) : (
          <div className={`text-center p-8 rounded-2xl ${
            deliveryMethod === 'pickup' 
              ? 'bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200' 
              : 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200'
          }`}>
            <CheckCircleOutlined className={`text-6xl mb-4 ${
              deliveryMethod === 'pickup' ? 'text-cyan-600' : 'text-purple-600'
            }`} />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h3>
            <p className="text-gray-600 mb-0">
              {deliveryMethod === 'pickup' 
                ? "Your prescription has been sent to CVS Pharmacy. You'll receive a notification when it's ready for pickup."
                : "Your prescription will be delivered to your address. You'll receive tracking updates via SMS."}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Sending;