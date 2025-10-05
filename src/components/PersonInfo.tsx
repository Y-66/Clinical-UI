import React from "react";
import { Form, Input, DatePicker, Select, InputNumber, Row, Col, Collapse } from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  HomeOutlined, 
  IdcardOutlined,
  MedicineBoxOutlined
} from "@ant-design/icons";

const PersonInfo: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <div className="w-full max-h-[420px] overflow-y-auto pr-2">
      <Form
        form={form}
        layout="vertical"
        size="large"
        className="w-full"
        initialValues={{
          fullName: "John Smith",
          email: "john.smith@email.com",
          phone: "+1 (555) 123-4567",
          dateOfBirth: null,
          gender: "male",
          insuranceId: "INS-123456789",
          bloodType: "A+",
          address: "123 Main Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
        }}
      >
        <Collapse
          defaultActiveKey={['1']}
          ghost
          className="bg-white"
          items={[
            {
              key: '1',
              label: (
                <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
                  <UserOutlined className="text-purple-600" />
                  Basic Information
                </div>
              ),
              children: (
                <>
                  <Row gutter={[24, 0]}>
                    <Col span={12}>
                      <Form.Item
                        label={<span className="font-semibold text-gray-700">Full Name</span>}
                        name="fullName"
                        rules={[{ required: true, message: "Please enter your full name" }]}
                      >
                        <Input 
                          prefix={<UserOutlined className="text-gray-400" />} 
                          placeholder="Enter your full name"
                          className="rounded-lg"
                        />
                      </Form.Item>
                    </Col>
                    
                    <Col span={12}>
                      <Form.Item
                        label={<span className="font-semibold text-gray-700">Date of Birth</span>}
                        name="dateOfBirth"
                        rules={[{ required: true, message: "Please select your date of birth" }]}
                      >
                        <DatePicker 
                          className="w-full rounded-lg" 
                          placeholder="Select date"
                          format="MM/DD/YYYY"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[24, 0]}>
                    <Col span={12}>
                      <Form.Item
                        label={<span className="font-semibold text-gray-700">Gender</span>}
                        name="gender"
                        rules={[{ required: true, message: "Please select your gender" }]}
                      >
                        <Select 
                          placeholder="Select gender"
                          className="rounded-lg"
                        >
                          <Select.Option value="male">Male</Select.Option>
                          <Select.Option value="female">Female</Select.Option>
                          <Select.Option value="other">Other</Select.Option>
                          <Select.Option value="prefer-not-to-say">Prefer not to say</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    
                    <Col span={12}>
                      <Form.Item
                        label={<span className="font-semibold text-gray-700">Blood Type</span>}
                        name="bloodType"
                      >
                        <Select 
                          placeholder="Select blood type"
                          className="rounded-lg"
                        >
                          <Select.Option value="A+">A+</Select.Option>
                          <Select.Option value="A-">A-</Select.Option>
                          <Select.Option value="B+">B+</Select.Option>
                          <Select.Option value="B-">B-</Select.Option>
                          <Select.Option value="AB+">AB+</Select.Option>
                          <Select.Option value="AB-">AB-</Select.Option>
                          <Select.Option value="O+">O+</Select.Option>
                          <Select.Option value="O-">O-</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              key: '2',
              label: (
                <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
                  <MailOutlined className="text-purple-600" />
                  Contact Information
                </div>
              ),
              children: (
                <>
                  <Row gutter={[24, 0]}>
                    <Col span={12}>
                      <Form.Item
                        label={<span className="font-semibold text-gray-700">Email Address</span>}
                        name="email"
                        rules={[
                          { required: true, message: "Please enter your email" },
                          { type: "email", message: "Please enter a valid email" }
                        ]}
                      >
                        <Input 
                          prefix={<MailOutlined className="text-gray-400" />} 
                          placeholder="your.email@example.com"
                          className="rounded-lg"
                        />
                      </Form.Item>
                    </Col>
                    
                    <Col span={12}>
                      <Form.Item
                        label={<span className="font-semibold text-gray-700">Phone Number</span>}
                        name="phone"
                        rules={[{ required: true, message: "Please enter your phone number" }]}
                      >
                        <Input 
                          prefix={<PhoneOutlined className="text-gray-400" />} 
                          placeholder="+1 (555) 000-0000"
                          className="rounded-lg"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              key: '3',
              label: (
                <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
                  <MedicineBoxOutlined className="text-purple-600" />
                  Insurance Information
                </div>
              ),
              children: (
                <Form.Item
                  label={<span className="font-semibold text-gray-700">Insurance ID</span>}
                  name="insuranceId"
                  rules={[{ required: true, message: "Please enter your insurance ID" }]}
                >
                  <Input 
                    prefix={<IdcardOutlined className="text-gray-400" />} 
                    placeholder="Enter your insurance ID"
                    className="rounded-lg"
                  />
                </Form.Item>
              ),
            },
            {
              key: '4',
              label: (
                <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
                  <HomeOutlined className="text-purple-600" />
                  Address Information
                </div>
              ),
              children: (
                <>
                  <Form.Item
                    label={<span className="font-semibold text-gray-700">Street Address</span>}
                    name="address"
                    rules={[{ required: true, message: "Please enter your address" }]}
                  >
                    <Input 
                      prefix={<HomeOutlined className="text-gray-400" />} 
                      placeholder="123 Main Street"
                      className="rounded-lg"
                    />
                  </Form.Item>

                  <Row gutter={[24, 0]}>
                    <Col span={10}>
                      <Form.Item
                        label={<span className="font-semibold text-gray-700">City</span>}
                        name="city"
                        rules={[{ required: true, message: "Please enter your city" }]}
                      >
                        <Input 
                          placeholder="City"
                          className="rounded-lg"
                        />
                      </Form.Item>
                    </Col>
                    
                    <Col span={7}>
                      <Form.Item
                        label={<span className="font-semibold text-gray-700">State</span>}
                        name="state"
                        rules={[{ required: true, message: "Please select your state" }]}
                      >
                        <Select 
                          placeholder="State"
                          className="rounded-lg"
                          showSearch
                        >
                          <Select.Option value="NY">NY</Select.Option>
                          <Select.Option value="CA">CA</Select.Option>
                          <Select.Option value="TX">TX</Select.Option>
                          <Select.Option value="FL">FL</Select.Option>
                          <Select.Option value="IL">IL</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    
                    <Col span={7}>
                      <Form.Item
                        label={<span className="font-semibold text-gray-700">ZIP Code</span>}
                        name="zipCode"
                        rules={[{ required: true, message: "Please enter your ZIP code" }]}
                      >
                        <InputNumber 
                          placeholder="10001"
                          className="w-full rounded-lg"
                          controls={false}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },
          ]}
        />
      </Form>
    </div>
  );
};

export default PersonInfo;