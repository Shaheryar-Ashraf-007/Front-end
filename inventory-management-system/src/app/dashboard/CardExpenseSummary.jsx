import { useGetDashboardMetricsQuery } from "@/state/api";
import { TrendingUp, PieChart as PieChartIcon, Loader2 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];

const CardExpenseSummary = () => {
    const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

    const expenseSummary = dashboardMetrics?.expenseSummary[0];

    const expenseByCategorySummary = dashboardMetrics?.expenseByCategorySummary || [];

    const expenseSums = expenseByCategorySummary.reduce(
        (acc, item) => {
            const category = item.category + " Expenses";
            const amount = parseInt(item.amount, 10);
            if (!acc[category]) acc[category] = 0;
            acc[category] += amount;
            return acc;
        },
        {}
    );

    const expenseCategories = Object.entries(expenseSums).map(
        ([name, value]) => ({
            name,
            value,
        })
    );

    const totalExpenses = expenseCategories.reduce(
        (acc, category) => acc + category.value,
        100
    );
    const formattedTotalExpenses = totalExpenses.toFixed(2);

    return (
        <div className="row-span-3 bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                    <p className="text-gray-500 font-medium">Loading expenses...</p>
                </div>
            ) : (
                <>
                    {/* HEADER */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <PieChartIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Expense Summary
                                </h2>
                                <p className="text-orange-100 text-sm">Category breakdown</p>
                            </div>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="p-6">
                        <div className="xl:flex justify-between items-center gap-6">
                            {/* CHART */}
                            <div className="relative basis-3/5 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={expenseCategories}
                                            innerRadius={45}
                                            outerRadius={65}
                                            fill="#8884d8"
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            strokeWidth={3}
                                            stroke="#fff"
                                        >
                                            {expenseCategories.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={colors[index % colors.length]}
                                                />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                    <div className="flex flex-col items-center justify-center bg-white w-8 rounded-full p-4">
                                        <span className="text-xs text-gray-500 font-medium">Total</span>
                                        <span className="font-bold text-xl text-gray-800">
                                            ₨{formattedTotalExpenses}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* LABELS */}
                            <ul className="flex flex-col justify-center gap-3 basis-2/5 mt-6 xl:mt-0">
                                {expenseCategories.map((entry, index) => (
                                    <li
                                        key={`legend-${index}`}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="w-4 h-4 rounded-full shadow-sm group-hover:scale-110 transition-transform"
                                                style={{ backgroundColor: colors[index % colors.length] }}
                                            ></span>
                                            <span className="text-sm font-medium text-gray-700">
                                                {entry.name}
                                            </span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-800">
                                            ₨{entry.value.toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-orange-50 px-6 py-4">
                        {expenseSummary && (
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Average Expense</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            ₨{typeof expenseSummary.totalExpenses === 'number' 
                                                ? expenseSummary.totalExpenses.toFixed(2) 
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-xl">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    <span className="text-lg font-bold text-green-700">+30%</span>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CardExpenseSummary;