"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { useRouter } from "next/navigation";
import { setIsSidebarCollapsed } from "@/state";
import logo from "../../../../public/logo.png"
import {
  Archive,
  CircleDollarSign,
  Clipboard,
  Wallet,
  Layout,
  Menu,
  SlidersHorizontal,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SidebarLink = ({ href, icon: Icon, label, isCollapsed }) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4 mx-2" : "justify-start px-4 py-3.5 mx-3"
        }
        gap-3 transition-all duration-200 rounded-xl group relative
        ${
          isActive 
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" 
            : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600"
        }`}
      >
        {isActive && !isCollapsed && (
          <div className="absolute left-0 top-1/2 w-1 h-8 bg-white rounded-r-full" style={{ transform: 'translateY(-50%)' }}></div>
        )}
        
        <Icon className={`w-5 h-5 transition-all duration-200 ${
          isActive ? "text-white" : "text-gray-600 group-hover:text-blue-600"
        }`} style={{ transform: isActive ? 'none' : 'group-hover:scale(1.1)' }} />

        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-semibold text-sm transition-all duration-200`}
        >
          {label}
        </span>

        {!isCollapsed && !isActive && (
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-20" : "w-72 md:w-64"
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-xl z-40 border-r border-gray-100`;

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 pb-6 ${
          isSidebarCollapsed ? "px-5" : "px-6"
        } border-b border-gray-100`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-md opacity-30"></div>
            <Image
              src={logo}
              alt="edstock-logo"
              width={40}
              height={40}
              className="relative rounded-xl shadow-md"
            />
          </div>
          <div className={`${isSidebarCollapsed ? "hidden" : "block"}`}>
            <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Ahmad Foods
            </h1>
            <p className="text-xs text-gray-500 font-medium">Management System</p>
          </div>
        </div>

        <button
          className="md:hidden p-2 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors"
          onClick={toggleSidebar}
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-6 space-y-1 overflow-y-auto">
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          label="Dashboard"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/inventory"
          icon={Archive}
          label="Inventory"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/products"
          icon={Clipboard}
          label="Products"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/users"
          icon={User}
          label="Users"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/sallaries"
          icon={Wallet}
          label="Salaries"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/settings"
          icon={SlidersHorizontal}
          label="Settings"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/expenses"
          icon={CircleDollarSign}
          label="Expenses"
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      
        <div className="border-t border-gray-100 py-4">
          <p className="text-center text-xs text-gray-500">
            &copy; 2024 Best Tech Solutions
          </p>
        </div>
      </div>
  );
};

export default Sidebar;