"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { Bell, Menu, Moon, Settings, Sun, Search } from "lucide-react";
import logo from "../../../../public/logo.png"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"
import React, { useState } from "react";
import { Login } from "@mui/icons-material";

const Navbar = () => {
  const router = useRouter();
  const handleSettings = () =>{
    router.push("/settings")
  }

  const handleLogin = ()=>{
    router.push("/login")
  }
  
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  return (
    <div className="flex justify-between items-center w-full mb-7 bg-white shadow-md rounded-2xl px-6 py-4 border border-gray-100">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {/* Menu Button */}
        <button
          className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 group"
          onClick={toggleSidebar}
        >
          <Menu className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="search"
            placeholder="Search groups & products..."
            className="pl-11 pr-4 py-2.5 w-50 md:w-80 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-sm font-medium text-gray-700 placeholder-gray-400"
          />
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all duration-200 group">
          <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="p-3 bg-gray-50 rounded-xl hover:bg-yellow-50 transition-all duration-200 group"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-gray-600 group-hover:text-yellow-500 transition-colors group-hover:rotate-180 duration-300" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors group-hover:-rotate-12 duration-300" />
          )}
        </button>

        {/* Settings */}
        <button 
          onClick={handleSettings}
          className="p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-all duration-200 group"
        >
          <Settings className="w-5 h-5 text-gray-600 group-hover:text-purple-600 group-hover:rotate-90 transition-all duration-300" />
        </button>

        <button onClick={handleLogin} className=" p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-all duration-200 group">
          <Login className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-all duration-300"/>
        </button>

        {/* Divider */}
        <div className="hidden md:block w-px h-10 bg-gray-200 mx-2"></div>

        {/* Profile Section */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div className="relative">
            <Image
              src={logo}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-xl object-cover ring-2 ring-white shadow-sm group-hover:ring-blue-500 transition-all duration-200"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
              Ahmad Foods
            </span>
            <span className="text-xs text-gray-500">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;