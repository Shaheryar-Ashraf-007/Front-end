"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { Bell, Menu, Moon, Settings, Sun, Search, X } from "lucide-react";
import logo from "../../../../public/logo.jpg";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Login } from "@mui/icons-material";

const Navbar = () => {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const toggleSidebar = () => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  const toggleDarkMode = () => dispatch(setIsDarkMode(!isDarkMode));
  const handleSettings = () => router.push("/settings");
  const handleLogin = () => router.push("/login");

  return (
    <div className="w-full mb-7">
      {/* ── Main Navbar Bar ── */}
      <div className="flex items-center justify-between bg-white shadow-md rounded-2xl px-3 sm:px-6 py-3 sm:py-4 border border-gray-100 gap-2">

        {/* ── LEFT: Hamburger + Desktop Search ── */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Sidebar toggle */}
          <button
            onClick={toggleSidebar}
            className="flex-shrink-0 p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 group"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {/* Desktop search — hidden on mobile */}
          <div className="relative hidden sm:block">
            <input
              type="search"
              placeholder="Search groups & products..."
              className="pl-10 pr-4 py-2.5 w-56 md:w-80 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-sm font-medium text-gray-700 placeholder-gray-400"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={17} />
            </div>
          </div>
        </div>

        {/* ── RIGHT: Actions + Profile ── */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="sm:hidden p-2.5 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all duration-200 group"
          >
            {searchOpen
              ? <X className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
              : <Search className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
            }
          </button>

          {/* Dark mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 sm:p-3 bg-gray-50 rounded-xl hover:bg-yellow-50 transition-all duration-200 group"
            title={isDarkMode ? "Light mode" : "Dark mode"}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-yellow-500 group-hover:rotate-180 transition-all duration-300" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-indigo-600 group-hover:-rotate-12 transition-all duration-300" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={handleSettings}
            className="p-2.5 sm:p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-all duration-200 group"
            title="Settings"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-purple-600 group-hover:rotate-90 transition-all duration-300" />
          </button>

          {/* Login */}
          <button
            onClick={handleLogin}
            className="p-2.5 sm:p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-all duration-200 group"
            title="Login"
          >
            <Login className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-purple-600 transition-all duration-300" />
          </button>

          {/* Divider — desktop only */}
          <div className="hidden md:block w-px h-10 bg-gray-200 mx-1" />

          {/* Profile — desktop only */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer group">
            <div className="relative flex-shrink-0">
              <Image
                src={logo}
                alt="Profile"
                width={38}
                height={38}
                className="rounded-xl object-cover ring-2 ring-white shadow-sm group-hover:ring-blue-500 transition-all duration-200"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors whitespace-nowrap">
                Sunny Mobiles
              </span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
          </div>

          {/* Mobile avatar — visible only on mobile */}
          <div className="flex md:hidden items-center ml-1">
            <div className="relative">
              <Image
                src={logo}
                alt="Profile"
                width={34}
                height={34}
                className="rounded-xl object-cover ring-2 ring-white shadow-sm"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Search Dropdown ── */}
      {searchOpen && (
        <div className="sm:hidden mt-2 px-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="relative bg-white rounded-2xl shadow-md border border-gray-100 px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search groups & products..."
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-sm font-medium text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;