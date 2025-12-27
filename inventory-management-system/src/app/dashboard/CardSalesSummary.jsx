import { useGetDashboardMetricsQuery } from "@/state/api";
import { TrendingUp, BarChart3, Calendar, Loader2, Award } from "lucide-react";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Dummy data for demonstration
const dummySalesData = [
  { date: "2024-01-01", totalValue: 2500000, changePercentage: 5.2 },
  { date: "2024-01-02", totalValue: 2800000, changePercentage: 12.0 },
  { date: "2024-01-03", totalValue: 2300000, changePercentage: -17.9 },
  { date: "2024-01-04", totalValue: 3200000, changePercentage: 39.1 },
  { date: "2024-01-05", totalValue: 2900000, changePercentage: -9.4 },
  { date: "2024-01-06", totalValue: 3500000, changePercentage: 20.7 },
  { date: "2024-01-07", totalValue: 3800000, changePercentage: 8.6 },
  { date: "2024-01-08", totalValue: 3300000, changePercentage: -13.2 },
  { date: "2024-01-09", totalValue: 4100000, changePercentage: 24.2 },
  { date: "2024-01-10", totalValue: 4500000, changePercentage: 9.8 },
  { date: "2024-01-11", totalValue: 4200000, changePercentage: -6.7 },
  { date: "2024-01-12", totalValue: 4800000, changePercentage: 14.3 },
];

const CardSalesSummary = () => {
  const { data, isLoading, isError } = useGetDashboardMetricsQuery();
  
  // Use API data if available, otherwise use dummy data
  const salesData = data?.salesSummary?.length > 0 ? data.salesSummary : dummySalesData;

  const [timeframe, setTimeframe] = useState("weekly");

  const totalValueSum =
    salesData.reduce((acc, curr) => acc + curr.totalValue, 0) || 0;

  const averageChangePercentage =
    salesData.reduce((acc, curr, _, array) => {
      return acc + curr.changePercentage / array.length;
    }, 0) || 0;

  const highestValueData = salesData.reduce((acc, curr) => {
    return acc.totalValue > curr.totalValue ? acc : curr;
  }, salesData[0] || {});

  const highestValueDate = highestValueData.date
    ? new Date(highestValueData.date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      })
    : "N/A";

  if (isError) {
    return (
      <div className="row-span-3 xl:row-span-6 bg-white shadow-lg rounded-2xl flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-gray-700 font-semibold">Failed to fetch data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[500px] space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-500 font-medium">Loading sales data...</p>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Sales Summary
                </h2>
                <p className="text-blue-100 text-sm">Performance overview</p>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="flex-1 flex flex-col">
            {/* BODY HEADER */}
            <div className="flex justify-between items-center px-6 pt-6 pb-4">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                  Total Value
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-800">
                    ₨
                    {(totalValueSum / 1000000).toLocaleString("en", {
                      maximumFractionDigits: 2,
                    })}
                    m
                  </span>
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-green-100 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold text-green-700">
                      {averageChangePercentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  className="appearance-none bg-white border-2 border-gray-200 text-gray-700 pl-10 pr-10 py-2.5 rounded-xl font-medium focus:outline-none focus:border-blue-500 hover:border-gray-300 transition-colors cursor-pointer shadow-sm"
                  value={timeframe}
                  onChange={(e) => {
                    setTimeframe(e.target.value);
                  }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* CHART */}
            <div className="flex-1 px-6 pb-4">
              <ResponsiveContainer width="100%" height="100%" minHeight={320}>
                <BarChart
                  data={salesData}
                  margin={{ top: 20, right: 10, left: -10, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(value) => {
                      return `${(value / 1000000).toFixed(0)}m`;
                    }}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      padding: "12px 16px",
                    }}
                    formatter={(value) => [
                      `₨${value.toLocaleString("en")}`,
                      "Sales"
                    ]}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                    }}
                    cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                  />
                  <Bar
                    dataKey="totalValue"
                    fill="url(#colorBar)"
                    barSize={16}
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Data Period</p>
                  <p className="text-lg font-bold text-gray-800">
                    {salesData.length || 0} Days
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Peak Sales</p>
                  <p className="text-sm font-bold text-gray-800">
                    {highestValueDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardSalesSummary;