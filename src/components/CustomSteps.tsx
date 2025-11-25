import React from "react";
import { CheckOutlined } from "@ant-design/icons";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface CustomStepsProps {
  steps: Step[];
  current: number;
}

const CustomSteps: React.FC<CustomStepsProps> = ({ steps, current }) => {
  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-gray-200 via-gray-200 to-gray-200">
        <div
          className="w-full bg-gradient-to-b from-cyan-500 to-teal-500 transition-all duration-700 ease-out"
          style={{
            height: `${(current / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isCompleted = index < current;
          const isCurrent = index === current;

          return (
            <div
              key={index}
              className={`relative flex items-start gap-4 transition-all duration-500 ${
                isCurrent ? "scale-105" : ""
              }`}
            >
              {/* Icon Circle */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                    isCompleted
                      ? "bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/50 scale-100"
                      : isCurrent
                      ? "bg-gradient-to-br from-cyan-500 to-teal-500 shadow-xl shadow-cyan-500/60 scale-110 animate-pulse"
                      : "bg-gray-200 scale-90"
                  }`}
                >
                  {isCompleted ? (
                    <CheckOutlined className="text-white text-xl" />
                  ) : (
                    <span
                      className={`text-xl ${
                        isCurrent ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </span>
                  )}
                </div>

                {/* Ripple Effect for Current Step */}
                {isCurrent && (
                  <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20" />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 pt-2">
                <h4
                  className={`font-semibold text-base mb-1 transition-all duration-300 ${
                    isCurrent
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600"
                      : isCompleted
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
                >
                  {step.title}
                </h4>
                <p
                  className={`text-sm transition-all duration-300 ${
                    isCurrent
                      ? "text-gray-600 font-medium"
                      : isCompleted
                      ? "text-gray-500"
                      : "text-gray-400"
                  }`}
                >
                  {step.description}
                </p>

                {/* Progress Badge */}
                {isCurrent && (
                  <div className="mt-0 inline-block">
                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 text-xs font-semibold rounded-full animate-pulse">
                      In Progress
                    </span>
                  </div>
                )}

                {isCompleted && (
                  <div className="mt-0 inline-block">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Completed
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomSteps;
