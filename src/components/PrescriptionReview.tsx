import React, { useState, useEffect } from "react";
import {
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
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  getPrescriptionById,
  updatePrescriptionById,
  setPrescriptionPharmacy,
} from "../apis/patient";
import {
  useSelectedPharmacyStore,
  useGeneratedOrdersStore,
  useOrderSubmittedStore,
} from "../store";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const PrescriptionReview: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState(false);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isPrescriptionChanged, setIsPrescriptionChanged] = useState(false);
  const [prescriptionForm] = Form.useForm();
  const { selectedPharmacy } = useSelectedPharmacyStore();
  const { prescriptionId } = useGeneratedOrdersStore();
  const { setOrderSubmitted, isOrderSubmitted } = useOrderSubmittedStore();

  const fetchOrderData = async () => {
    if (!prescriptionId) {
      message.warning("Please generate prescription first in Step 2");
      return;
    }

    setInitialLoading(true);
    try {
      const prescriptionRes = await getPrescriptionById(prescriptionId);

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
    } catch (error) {
      message.error("Failed to load prescription data");
      console.error("Error loading prescription data:", error);
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
      setIsPrescriptionChanged(false);
    } catch (error) {
      message.error("Failed to update prescription. Please try again.");
      console.error("Update prescription failed:", error);
    } finally {
      setPrescriptionLoading(false);
    }
  };

  const handleSubmitOrder = async () => {
    try {
      if (isPrescriptionChanged) {
        message.warning({
          content:
            "Please save your changes before submitting. Click the Update button to save your changes.",
          duration: 5,
        });
        return;
      }

      const prescriptionValues = await prescriptionForm.validateFields();

      if (!prescriptionId) {
        message.error("Prescription ID not found. Please generate prescription first.");
        return;
      }

      setSubmitLoading(true);

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

      const apiCalls = [
        updatePrescriptionById(prescriptionId, prescriptionUpdateData),
      ];

      if (selectedPharmacy?.pharmacy_id) {
        apiCalls.push(
          setPrescriptionPharmacy(prescriptionId, selectedPharmacy.pharmacy_id)
        );
      }

      await Promise.all(apiCalls);

      setOrderSubmitted(true);
      message.success(
        "Prescription submitted successfully! You can now proceed to the next step."
      );
    } catch (error) {
      message.error("Failed to submit prescription. Please try again.");
      console.error("Submission failed:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Review & Confirm Prescription
          </h1>
          <p className="text-gray-600 text-lg">
            Please review and confirm prescription details
          </p>
        </div>

        {/* Prescription Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300 group flex flex-col">
          {/* Card Header - Sticky */}
          <div
            className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-white border-b border-slate-100 shadow-sm py-4 px-6 flex items-center justify-between gap-4 rounded-t-3xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                <MedicineBoxOutlined className="text-2xl" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 m-0">
                Prescription
              </h2>
            </div>

            <Button
              type="primary"
              size="middle"
              icon={<CheckCircleOutlined />}
              onClick={handleUpdatePrescription}
              loading={prescriptionLoading}
              disabled={!isPrescriptionChanged}
              className={`
                font-bold shadow-md border-none transition-all duration-300 rounded-xl px-6
                ${
                  isPrescriptionChanged
                    ? "bg-amber-400 hover:bg-amber-500 text-slate-900 scale-105 animate-pulse"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200 opacity-50 cursor-not-allowed"
                }
              `}
            >
              {isPrescriptionChanged ? "Save Changes" : "Update"}
            </Button>
          </div>

          {/* Card Body */}
          <div className="p-6 bg-white rounded-b-3xl">
            <Form
              form={prescriptionForm}
              layout="vertical"
              className="space-y-4"
              onValuesChange={() => setIsPrescriptionChanged(true)}
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
                    label={<span className="font-medium">Medication Name</span>}
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
                    <Input className="rounded-lg" placeholder="e.g., Tablet" />
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
                    label={<span className="font-medium">Refills Allowed</span>}
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
                  label={<span className="font-medium">Dosage Instructions</span>}
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
                    label={<span className="font-medium">Date Prescribed</span>}
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
                    <span className="font-medium text-blue-800">Pharmacy Name</span>
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
            </Form>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-8">
          {isOrderSubmitted ? (
            <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <CheckCircleOutlined className="text-4xl text-green-600" />
                <div>
                  <p className="text-xl font-bold text-green-800 mb-1">
                    Prescription Submitted Successfully!
                  </p>
                  <p className="text-sm text-green-600">
                    Your prescription has been submitted. You can now proceed to
                    the next step.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 border-none h-14 px-12 text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 rounded-xl"
              onClick={handleSubmitOrder}
              loading={submitLoading}
            >
              Submit Prescription
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionReview;
