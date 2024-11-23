"use client";

import React from "react";
import {
  CheckCircle,
  Package,
  Tag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import CardExpenseSummary from "./CardExpenseSummary";
import CardPopularProducts from "./CardPopularProducts";
import CardPurchaseSummary from "./CardPurchaseSummary";
import CardSalesSummary from "./CardSalesSummary";
import StatCard from "./StatCard";

const Dashboard = () => {
  return React.createElement(
    "div",
    { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows" },
    React.createElement(CardPopularProducts),
    React.createElement(CardSalesSummary),
    React.createElement(CardPurchaseSummary),
    React.createElement(CardExpenseSummary),
    React.createElement(StatCard, {
      title: "Customer & Expenses",
      primaryIcon: React.createElement(Package, { className: "text-blue-600 w-6 h-6" }),
      dateRange: "22 - 29 October 2023",
      details: [
        {
          title: "Customer Growth",
          amount: "175.00",
          changePercentage: 131,
          IconComponent: TrendingUp,
        },
        {
          title: "Expenses",
          amount: "10.00",
          changePercentage: -56,
          IconComponent: TrendingDown,
        },
      ],
    }),
    React.createElement(StatCard, {
      title: "Dues & Pending Orders",
      primaryIcon: React.createElement(CheckCircle, { className: "text-blue-600 w-6 h-6" }),
      dateRange: "22 - 29 October 2023",
      details: [
        {
          title: "Dues",
          amount: "250.00",
          changePercentage: 131,
          IconComponent: TrendingUp,
        },
        {
          title: "Pending Orders",
          amount: "147",
          changePercentage: -56,
          IconComponent: TrendingDown,
        },
      ],
    }),
    React.createElement(StatCard, {
      title: "Sales & Discount",
      primaryIcon: React.createElement(Tag, { className: "text-blue-600 w-6 h-6" }),
      dateRange: "22 - 29 October 2023",
      details: [
        {
          title: "Sales",
          amount: "1000.00",
          changePercentage: 20,
          IconComponent: TrendingUp,
        },
        {
          title: "Discount",
          amount: "200.00",
          changePercentage: -10,
          IconComponent: TrendingDown,
        },
      ],
    })
  );
};

export default Dashboard;
