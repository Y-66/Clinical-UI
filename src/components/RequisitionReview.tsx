import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Spin,
  DatePicker,
  Select,
} from "antd";
import {
  ExperimentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  getRequisitionById,
  updateRequisitionById,
  setRequisitionLab,
} from "../apis/patient";
import {
  useSelectedLabStore,
  useGeneratedOrdersStore,
  useOrderSubmittedStore,
} from "../store";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const RequisitionReview: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState(false);
  const [requisitionLoading, setRequisitionLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isRequisitionChanged, setIsRequisitionChanged] = useState(false);
  const [requisitionForm] = Form.useForm();
  const { selectedLab } = useSelectedLabStore();
  const { requisitionId } = useGeneratedOrdersStore();
  const { setOrderSubmitted, isOrderSubmitted } = useOrderSubmittedStore();

  const fetchOrderData = async () => {
    if (!requisitionId) {
      message.warning("Please generate requisition first in Step 2");
      return;
    }

    setInitialLoading(true);
    try {
      const requisitionRes = await getRequisitionById(requisitionId);

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
      message.error("Failed to load requisition data");
      console.error("Error loading requisition data:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateRequisition = async () => {
    try {
      const requisitionValues = await requisitionForm.validateFields();

      if (!requisitionId) {
        message.error("Requisition ID not found.");
        return;
      }

      setRequisitionLoading(true);

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
      setIsRequisitionChanged(false);
    } catch (error) {
      message.error("Failed to update requisition. Please try again.");
      console.error("Update requisition failed:", error);
    } finally {
      setRequisitionLoading(false);
    }
  };

  const handleSubmitOrder = async () => {
    try {
      if (isRequisitionChanged) {
        message.warning({
          content:
            "Please save your changes before submitting. Click the Update button to save your changes.",
          duration: 5,
        });
        return;
      }

      const requisitionValues = await requisitionForm.validateFields();

      if (!requisitionId) {
        message.error("Requisition ID not found. Please generate requisition first.");
        return;
      }

      setSubmitLoading(true);

      const requisitionUpdateData = {
        status: requisitionValues.status,
        notes: requisitionValues.notes,
        department: requisitionValues.department,
        test_type: requisitionValues.test_type,
        test_code: requisitionValues.test_code,
        clinical_info: requisitionValues.clinical_info,
        priority: requisitionValues.priority,
      };

      const apiCalls = [
        updateRequisitionById(requisitionId, requisitionUpdateData),
      ];

      if (selectedLab?.lab_id) {
        apiCalls.push(setRequisitionLab(requisitionId, selectedLab.lab_id));
      }

      await Promise.all(apiCalls);

      setOrderSubmitted(true);
      message.success(
        "Requisition submitted successfully! You can now proceed to the next step."
      );
    } catch (error) {
      message.error("Failed to submit requisition. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Review & Confirm Requisition
          </h1>
          <p className="text-gray-600 text-lg">
            Please review and confirm requisition details
          </p>
        </div>

        {/* Requisition Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300 group flex flex-col">
          {/* Card Header - Sticky */}
          <div
            className="sticky top-0 z-10 bg-gradient-to-r from-green-50 to-white border-b border-slate-100 shadow-sm py-4 px-6 flex items-center justify-between gap-4 rounded-t-3xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shadow-sm group-hover:scale-110 transition-transform">
                <ExperimentOutlined className="text-2xl" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 m-0">
                Lab Requisition
              </h2>
            </div>

            <Button
              type="primary"
              size="middle"
              icon={<CheckCircleOutlined />}
              onClick={handleUpdateRequisition}
              loading={requisitionLoading}
              disabled={!isRequisitionChanged}
              className={`
                font-bold shadow-md border-none transition-all duration-300 rounded-xl px-6
                ${
                  isRequisitionChanged
                    ? "bg-amber-400 hover:bg-amber-500 text-slate-900 scale-105 animate-pulse"
                    : "bg-green-100 text-green-600 hover:bg-green-200 opacity-50 cursor-not-allowed"
                }
              `}
            >
              {isRequisitionChanged ? "Save Changes" : "Update"}
            </Button>
          </div>

          {/* Card Body */}
          <div className="p-6 bg-white rounded-b-3xl">
            <Form
              form={requisitionForm}
              layout="vertical"
              className="space-y-4"
              onValuesChange={() => setIsRequisitionChanged(true)}
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
                    label={<span className="font-medium">Date Requested</span>}
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
                  label={<span className="font-medium">Clinical Information</span>}
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
                    <span className="font-medium text-green-800">Lab Name</span>
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
                    <span className="font-medium text-green-800">Address</span>
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
                    Requisition Submitted Successfully!
                  </p>
                  <p className="text-sm text-green-600">
                    Your requisition has been submitted. You can now proceed to
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
              className="bg-gradient-to-r from-green-600 to-teal-600 border-none h-14 px-12 text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 rounded-xl"
              onClick={handleSubmitOrder}
              loading={submitLoading}
            >
              Submit Requisition
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequisitionReview;
