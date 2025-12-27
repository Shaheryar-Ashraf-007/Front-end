"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./[components]/Navbar";
import Sidebar from "./[components]/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // ✅ Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthChecked(true);
      // Add a small delay for smooth transition
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [router]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Beautiful loading screen
  if (!isAuthChecked || isLoading) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} min-h-screen flex items-center justify-center transition-colors duration-300`}>
        <div className="text-center space-y-6">
          {/* Animated Logo/Spinner */}
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-indigo-500 border-l-pink-500 animate-spin-reverse"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
          </div>
          
          {/* Loading Text */}
          <div className="space-y-2">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Loading Dashboard
            </h2>
            <div className="flex items-center justify-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
              <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-purple-400' : 'bg-purple-500'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
              <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-pink-400' : 'bg-pink-500'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isDarkMode ? "dark" : "light"
      } flex ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'} text-gray-900 w-full min-h-screen transition-colors duration-300`}
    >
      <Sidebar />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 ${
          isDarkMode ? 'bg-gray-900' : 'bg-transparent'
        } ${
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        } transition-all duration-300 ease-in-out`}
      >
        <Navbar />
        {/* Content wrapper with fade-in animation */}
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      
      {/* Optional: Decorative background elements */}
      {!isDarkMode && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      )}
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