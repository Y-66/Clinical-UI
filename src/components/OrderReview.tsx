import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Spin,
  InputNumber,
  DatePicker,
  Select,
} from "antd";
import {
  MedicineBoxOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  getPrescriptionById,
  getRequisitionById,
  updatePrescriptionById,
  updateRequisitionById,
  setPrescriptionPharmacy,
  setRequisitionLab,
} from "../apis/patient";
import {
  useSelectedPharmacyStore,
  useSelectedLabStore,
  useGeneratedOrdersStore,
} from "../store";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const OrderReview: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState(false);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [requisitionLoading, setRequisitionLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [prescriptionForm] = Form.useForm();
  const [requisitionForm] = Form.useForm();
  const { selectedPharmacy } = useSelectedPharmacyStore();
  const { selectedLab } = useSelectedLabStore();
  const { prescriptionId, requisitionId } = useGeneratedOrdersStore();

  const fetchOrderData = async () => {
    // Check if IDs are available
    if (!prescriptionId || !requisitionId) {
      message.warning("Please generate orders first in Step 2");
      return;
    }

    setInitialLoading(true);
    try {
      const [prescriptionRes, requisitionRes] = await Promise.all([
        getPrescriptionById(prescriptionId),
        getRequisitionById(requisitionId),
      ]);

      // Set form values with store data override for pharmacy/lab
      if (prescriptionRes) {
        prescriptionForm.setFieldsValue({
          prescription_id: prescriptionRes.prescription.prescription_id,
          ...prescriptionRes.prescription,
          date_prescribed: dayjs(prescriptionRes.prescription.date_prescribed),
          expiry_date: dayjs(prescriptionRes.prescription.expiry_date),
          pharmacy_name:
            selectedPharmacy?.name || prescriptionRes.pharmacy_name,
          pharmacy_address:
            selectedPharmacy?.address || prescriptionRes.pharmacy_address,
        });
      }

      if (requisitionRes) {
        requisitionForm.setFieldsValue({
          requisition_id: requisitionRes.requisition.requisition_id,
          ...requisitionRes.requisition,
          date_requested: dayjs(requisitionRes.requisition.date_requested),
          lab_name: selectedLab?.name || requisitionRes.lab_name,
          lab_address: selectedLab?.address || requisitionRes.lab_address,
        });
      }
    } catch (error) {
      message.error("Failed to load order data");
      console.error("Error loading order data:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdatePrescription = async () => {
    try {
      const prescriptionValues = await prescriptionForm.validateFields();

      if (!prescriptionId) {
        message.error("Prescription ID not found.");
        return;
      }

      setPrescriptionLoading(true);

      // Prepare prescription update data
      const prescriptionUpdateData = {
        status: prescriptionValues.status,
        notes: prescriptionValues.notes,
        medication_name: prescriptionValues.medication_name,
        medication_strength: prescriptionValues.medication_strength,
        medication_form: prescriptionValues.medication_form,
        dosage_instructions: prescriptionValues.dosage_instructions,
        quantity: prescriptionValues.quantity,
        refills_allowed: prescriptionValues.refills_allowed,
        expiry_date: prescriptionValues.expiry_date
          ? prescriptionValues.expiry_date.format("YYYY-MM-DD")
          : undefined,
      };

      await updatePrescriptionById(prescriptionId, prescriptionUpdateData);
      message.success("Prescription updated successfully!");
    } catch (error) {
      message.error("Failed to update prescription. Please try again.");
      console.error("Update prescription failed:", error);
    } finally {
      setPrescriptionLoading(false);
    }
  };

  const handleUpdateRequisition = async () => {
    try {
      const requisitionValues = await requisitionForm.validateFields();

      if (!requisitionId) {
        message.error("Requisition ID not found.");
        return;
      }

      setRequisitionLoading(true);

      // Prepare requisition update data
      const requisitionUpdateData = {
        status: requisitionValues.status,
        notes: requisitionValues.notes,
        department: requisitionValues.department,
        test_type: requisitionValues.test_type,
        test_code: requisitionValues.test_code,
        clinical_info: requisitionValues.clinical_info,
        priority: requisitionValues.priority,
      };

      await updateRequisitionById(requisitionId, requisitionUpdateData);
      message.success("Requisition updated successfully!");
    } catch (error) {
      message.error("Failed to update requisition. Please try again.");
      console.error("Update requisition failed:", error);
    } finally {
      setRequisitionLoading(false);
    }
  };

  const handleSubmitOrders = async () => {
    try {
      // Validate both forms
      const prescriptionValues = await prescriptionForm.validateFields();
      const requisitionValues = await requisitionForm.validateFields();

      if (!prescriptionId || !requisitionId) {
        message.error("Order IDs not found. Please generate orders first.");
        return;
      }

      setSubmitLoading(true);

      // Prepare prescription update data (only editable fields)
      const prescriptionUpdateData = {
        status: prescriptionValues.status,
        notes: prescriptionValues.notes,
        medication_name: prescriptionValues.medication_name,
        medication_strength: prescriptionValues.medication_strength,
        medication_form: prescriptionValues.medication_form,
        dosage_instructions: prescriptionValues.dosage_instructions,
        quantity: prescriptionValues.quantity,
        refills_allowed: prescriptionValues.refills_allowed,
        expiry_date: prescriptionValues.expiry_date
          ? prescriptionValues.expiry_date.format("YYYY-MM-DD")
          : undefined,
      };

      // Prepare requisition update data (only editable fields)
      const requisitionUpdateData = {
        status: requisitionValues.status,
        notes: requisitionValues.notes,
        department: requisitionValues.department,
        test_type: requisitionValues.test_type,
        test_code: requisitionValues.test_code,
        clinical_info: requisitionValues.clinical_info,
        priority: requisitionValues.priority,
      };

      // Prepare API calls array
      const apiCalls = [
        updatePrescriptionById(prescriptionId, prescriptionUpdateData),
        updateRequisitionById(requisitionId, requisitionUpdateData),
      ];

      // Add pharmacy ID if selected
      if (selectedPharmacy?.pharmacy_id) {
        apiCalls.push(
          setPrescriptionPharmacy(prescriptionId, selectedPharmacy.pharmacy_id)
        );
      }

      // Add lab ID if selected
      if (selectedLab?.lab_id) {
        apiCalls.push(setRequisitionLab(requisitionId, selectedLab.lab_id));
      }

      // Call all APIs
      await Promise.all(apiCalls);

      message.success("Orders submitted successfully!");
    } catch (error) {
      message.error("Failed to submit orders. Please try again.");
      console.error("Validation or submission failed:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            Order Review & Confirmation
          </h1>
          <p className="text-gray-600 text-lg">
            Please review and confirm the order details before submission
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prescription Card */}
          <Card
            className="shadow-2xl border-0 hover:shadow-3xl transition-all duration-300 overflow-hidden"
            bodyStyle={{ padding: 0 }}
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <MedicineBoxOutlined className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Prescription Order
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Medication details and pharmacy information
                  </p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 bg-white">
              <Form
                form={prescriptionForm}
                layout="vertical"
                className="space-y-4"
              >
                {/* ID Section */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <Form.Item
                    label={
                      <span className="text-blue-800 font-semibold">
                        Prescription ID
                      </span>
                    }
                    name="prescription_id"
                    className="mb-0"
                  >
                    <Input
                      disabled
                      className="font-mono text-lg"
                      style={{
                        fontWeight: "bold",
                        color: "#1e40af",
                        backgroundColor: "#dbeafe",
                        border: "2px solid #3b82f6",
                      }}
                    />
                  </Form.Item>
                </div>

                {/* Medication Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                    Medication Details
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                      label={
                        <span className="font-medium">Medication Name</span>
                      }
                      name="medication_name"
                    >
                      <Input
                        className="rounded-lg"
                        placeholder="Enter medication name"
                      />
                    </Form.Item>
                    <Form.Item
                      label={<span className="font-medium">Status</span>}
                      name="status"
                    >
                      <Select className="rounded-lg">
                        <Option value="active">Active</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="completed">Completed</Option>
                        <Option value="cancelled">Cancelled</Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                      label={<span className="font-medium">Strength</span>}
                      name="medication_strength"
                    >
                      <Input className="rounded-lg" placeholder="e.g., 500mg" />
                    </Form.Item>
                    <Form.Item
                      label={<span className="font-medium">Form</span>}
                      name="medication_form"
                    >
                      <Input
                        className="rounded-lg"
                        placeholder="e.g., Tablet"
                      />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                      label={<span className="font-medium">Quantity</span>}
                      name="quantity"
                    >
                      <InputNumber
                        min={1}
                        className="w-full rounded-lg"
                        placeholder="0"
                      />
                    </Form.Item>
                    <Form.Item
                      label={
                        <span className="font-medium">Refills Allowed</span>
                      }
                      name="refills_allowed"
                    >
                      <InputNumber
                        min={0}
                        className="w-full rounded-lg"
                        placeholder="0"
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    label={
                      <span className="font-medium">Dosage Instructions</span>
                    }
                    name="dosage_instructions"
                  >
                    <TextArea
                      rows={3}
                      className="rounded-lg"
                      placeholder="Enter dosage instructions..."
                    />
                  </Form.Item>

                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                      label={
                        <span className="font-medium">Date Prescribed</span>
                      }
                      name="date_prescribed"
                    >
                      <DatePicker
                        className="w-full rounded-lg"
                        format="YYYY-MM-DD"
                        disabled
                      />
                    </Form.Item>
                    <Form.Item
                      label={<span className="font-medium">Expiry Date</span>}
                      name="expiry_date"
                    >
                      <DatePicker
                        className="w-full rounded-lg"
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    label={<span className="font-medium">Notes</span>}
                    name="notes"
                  >
                    <TextArea
                      rows={2}
                      className="rounded-lg"
                      placeholder="Additional notes..."
                    />
                  </Form.Item>
                </div>

                {/* Pharmacy Information Section */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-300">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <MedicineBoxOutlined />
                    Selected Pharmacy
                  </h3>
                  <Form.Item
                    label={
                      <span className="font-medium text-blue-800">
                        Pharmacy Name
                      </span>
                    }
                    name="pharmacy_name"
                    className="mb-3"
                  >
                    <Input
                      disabled
                      className="rounded-lg"
                      style={{
                        color: "#1e40af",
                        fontWeight: "600",
                        backgroundColor: "#ffffff",
                        border: "2px solid #3b82f6",
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="font-medium text-blue-800">Address</span>
                    }
                    name="pharmacy_address"
                    className="mb-0"
                  >
                    <Input
                      disabled
                      className="rounded-lg"
                      style={{
                        color: "#1e40af",
                        backgroundColor: "#ffffff",
                        border: "2px solid #3b82f6",
                      }}
                    />
                  </Form.Item>
                </div>

                {/* Update Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="primary"
                    size="large"
                    icon={<CheckCircleOutlined />}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 border-none h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
                    onClick={handleUpdatePrescription}
                    loading={prescriptionLoading}
                  >
                    Update Prescription
                  </Button>
                </div>
              </Form>
            </div>
          </Card>

          {/* Requisition Card */}
          <Card
            className="shadow-2xl border-0 hover:shadow-3xl transition-all duration-300 overflow-hidden"
            bodyStyle={{ padding: 0 }}
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <ExperimentOutlined className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Lab Requisition Order
                  </h2>
                  <p className="text-green-100 text-sm">
                    Test requirements and laboratory information
                  </p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 bg-white">
              <Form
                form={requisitionForm}
                layout="vertical"
                className="space-y-4"
              >
                {/* ID Section */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <Form.Item
                    label={
                      <span className="text-green-800 font-semibold">
                        Requisition ID
                      </span>
                    }
                    name="requisition_id"
                    className="mb-0"
                  >
                    <Input
                      disabled
                      className="font-mono text-lg"
                      style={{
                        fontWeight: "bold",
                        color: "#16a34a",
                        backgroundColor: "#dcfce7",
                        border: "2px solid #22c55e",
                      }}
                    />
                  </Form.Item>
                </div>

                {/* Test Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-green-200 pb-2">
                    Test Details
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                      label={<span className="font-medium">Department</span>}
                      name="department"
                    >
                      <Input
                        className="rounded-lg"
                        placeholder="Enter department"
                      />
                    </Form.Item>
                    <Form.Item
                      label={<span className="font-medium">Status</span>}
                      name="status"
                    >
                      <Select className="rounded-lg">
                        <Option value="pending">Pending</Option>
                        <Option value="in_progress">In Progress</Option>
                        <Option value="completed">Completed</Option>
                        <Option value="cancelled">Cancelled</Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                      label={<span className="font-medium">Test Type</span>}
                      name="test_type"
                    >
                      <Input
                        className="rounded-lg"
                        placeholder="Enter test type"
                      />
                    </Form.Item>
                    <Form.Item
                      label={<span className="font-medium">Test Code</span>}
                      name="test_code"
                    >
                      <Input
                        className="rounded-lg"
                        placeholder="Enter test code"
                      />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                      label={<span className="font-medium">Priority</span>}
                      name="priority"
                    >
                      <Select className="rounded-lg">
                        <Option value="routine">Routine</Option>
                        <Option value="urgent">Urgent</Option>
                        <Option value="stat">STAT</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label={
                        <span className="font-medium">Date Requested</span>
                      }
                      name="date_requested"
                    >
                      <DatePicker
                        className="w-full rounded-lg"
                        format="YYYY-MM-DD"
                        disabled
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    label={
                      <span className="font-medium">Clinical Information</span>
                    }
                    name="clinical_info"
                  >
                    <TextArea
                      rows={3}
                      className="rounded-lg"
                      placeholder="Enter clinical information..."
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="font-medium">Notes</span>}
                    name="notes"
                  >
                    <TextArea
                      rows={2}
                      className="rounded-lg"
                      placeholder="Additional notes..."
                    />
                  </Form.Item>
                </div>

                {/* Lab Information Section */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-300">
                  <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <ExperimentOutlined />
                    Selected Laboratory
                  </h3>
                  <Form.Item
                    label={
                      <span className="font-medium text-green-800">
                        Lab Name
                      </span>
                    }
                    name="lab_name"
                    className="mb-3"
                  >
                    <Input
                      disabled
                      className="rounded-lg"
                      style={{
                        color: "#16a34a",
                        fontWeight: "600",
                        backgroundColor: "#ffffff",
                        border: "2px solid #22c55e",
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className="font-medium text-green-800">
                        Address
                      </span>
                    }
                    name="lab_address"
                    className="mb-0"
                  >
                    <Input
                      disabled
                      className="rounded-lg"
                      style={{
                        color: "#16a34a",
                        backgroundColor: "#ffffff",
                        border: "2px solid #22c55e",
                      }}
                    />
                  </Form.Item>
                </div>

                {/* Update Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="primary"
                    size="large"
                    icon={<CheckCircleOutlined />}
                    className="bg-gradient-to-r from-green-500 to-green-600 border-none h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
                    onClick={handleUpdateRequisition}
                    loading={requisitionLoading}
                  >
                    Update Requisition
                  </Button>
                </div>
              </Form>
            </div>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-8">
          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 border-none h-14 px-12 text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 rounded-xl"
            onClick={handleSubmitOrders}
            loading={submitLoading}
          >
            Submit Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;
