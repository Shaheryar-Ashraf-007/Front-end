import { useGetDashboardMetricsQuery } from "@/state/api";
import { TrendingDown, TrendingUp, ShoppingCart, Loader2 } from "lucide-react";
import numeral from "numeral";
import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Dummy data for demonstration
const dummyPurchaseData = [
  { date: "2024-01-01", totalPurchased: 45000, changePercentage: 5 },
  { date: "2024-01-08", totalPurchased: 52000, changePercentage: 15.5 },
  { date: "2024-01-15", totalPurchased: 48000, changePercentage: -7.7 },
  { date: "2024-01-22", totalPurchased: 61000, changePercentage: 27.1 },
  { date: "2024-01-29", totalPurchased: 58000, changePercentage: -4.9 },
  { date: "2024-02-05", totalPurchased: 67000, changePercentage: 15.5 },
  { date: "2024-02-12", totalPurchased: 72000, changePercentage: 7.5 },
  { date: "2024-02-19", totalPurchased: 69000, changePercentage: -4.2 },
  { date: "2024-02-26", totalPurchased: 78000, changePercentage: 13.0 },
  { date: "2024-03-04", totalPurchased: 85000, changePercentage: 9.0 },
];

const CardPurchaseSummary = () => {
  const { data, isLoading } = useGetDashboardMetricsQuery();
  
  // Use API data if available, otherwise use dummy data
  const purchaseData = data?.purchaseSummary?.length > 0 ? data.purchaseSummary : dummyPurchaseData;

  const lastDataPoint = purchaseData[purchaseData.length - 1] || null;

  return (
    <div className="flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          <p className="text-gray-500 font-medium">Loading purchases...</p>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Purchase Summary
                </h2>
                <p className="text-purple-100 text-sm">Monthly trends</p>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="flex-1">
            {/* BODY HEADER */}
            <div className="mt-6 px-6">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">
                Total Purchased
              </p>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-800">
                  {lastDataPoint
                    ? numeral(lastDataPoint.totalPurchased).format("₨0.00a")
                    : "₨0"}
                </p>
                {lastDataPoint && (
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                      lastDataPoint.changePercentage >= 0
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {lastDataPoint.changePercentage >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                    <span
                      className={`text-lg font-bold ${
                        lastDataPoint.changePercentage >= 0
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {lastDataPoint.changePercentage >= 0 ? "+" : ""}
                      {Math.abs(lastDataPoint.changePercentage)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CHART */}
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={200} className="px-2">
                <AreaChart
                  data={purchaseData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPurchased" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tick={false} 
                    axisLine={false}
                    height={0}
                  />
                  <YAxis 
                    tickLine={false} 
                    tick={false} 
                    axisLine={false}
                    width={0}
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
                      "Purchased"
                    ]}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalPurchased"
                    stroke="#a855f7"
                    strokeWidth={3}
                    fill="url(#colorPurchased)"
                    dot={{
                      fill: "#a855f7",
                      strokeWidth: 2,
                      r: 4,
                      stroke: "#fff",
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#a855f7",
                      stroke: "#fff",
                      strokeWidth: 3,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-purple-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Data Points</p>
                  <p className="text-lg font-bold text-gray-800">
                    {purchaseData.length} Records
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-sm font-bold text-gray-800">
                  {lastDataPoint
                    ? new Date(lastDataPoint.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardPurchaseSummary;