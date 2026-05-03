"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./[components]/Navbar";
import Sidebar from "./[components]/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // 🌙 Dark mode handler
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Simulate loading for demonstration purpose
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Change this to your desired loading time

    return () => clearTimeout(timer);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`${
          isDarkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        } min-h-screen flex items-center justify-center transition-colors duration-300`}
      >
        <div className="text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-indigo-500 border-l-pink-500 animate-spin-reverse"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
          </div>

          <div className="space-y-2">
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Unlocking Dashboard
            </h2>

            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce delay-150"></div>
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce delay-300"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ DASHBOARD UNLOCKED
  return (
    <div
      className={`${
        isDarkMode
          ? "dark bg-gray-900"
          : "light bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      } flex text-gray-900 w-full min-h-screen transition-colors duration-300`}
    >
      <Sidebar />

      <main
        className={`flex flex-col w-full h-full py-7 px-9 ${
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        } transition-all duration-300 ease-in-out`}
      >
        <Navbar />
        <div className="animate-fade-in">{children}</div>
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;