import React from "react";
import { Calendar } from "lucide-react";

const StatCard = ({ title, primaryIcon, details, dateRange }) => {
  const formatPercentage = (value) => {
    // Check if the value is a number and not null/undefined
    if (typeof value !== 'number' || isNaN(value)) {
      return "N/A"; // Return 'N/A' or a default string if value is not a valid number
    }

    const signal = value >= 0 ? "+" : "";
    return `${signal}${value.toFixed(2)}%`; // Using 2 decimal places for clarity
  };

  const getChangeColor = (value) =>
    value >= 0 ? "text-green-700" : "text-red-700";

  const getChangeBgColor = (value) =>
    value >= 0 ? "bg-green-100" : "bg-red-100";

  return (
    <div className="md:row-span-1 xl:row-span-2 bg-white col-span-1 shadow-lg rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl text-white">{title}</h2>
          <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-white" />
            <span className="text-xs text-white font-medium">{dateRange}</span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 flex items-center gap-6 px-6 py-6">
        {/* Icon Section */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-30"></div>
            <div className="relative rounded-2xl p-5 bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200 shadow-md">
              {primaryIcon}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 space-y-3">
          {details.map((detail, index) => (
            <React.Fragment key={index}>
              <div className="group hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl p-3 transition-all duration-200">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-600 font-medium">
                    {detail.title}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-800 text-base">
                      {detail.amount}
                    </span>
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${getChangeBgColor(detail.changePercentage)}`}>
                      <detail.IconComponent
                        className={`w-3.5 h-3.5 ${getChangeColor(
                          detail.changePercentage
                        )}`}
                      />
                      <span
                        className={`font-bold text-sm ${getChangeColor(
                          detail.changePercentage
                        )}`}
                      >
                        {formatPercentage(detail.changePercentage)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {index < details.length - 1 && (
                <div className="border-b border-gray-100"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* FOOTER ACCENT */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
    </div>
  );
};

export default StatCard;