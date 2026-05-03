"use client";

import React, { useState, useMemo } from "react";
import {
  Wallet, Plus, Download, Trash2, TrendingUp, DollarSign,
  Users, Calendar, Search, ChevronDown, ChevronUp, Menu, X, Pencil,
} from "lucide-react";
import CreateSalariesModal from "./CreateSallariesModal";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockSalaries = [
  { userId: "1", name: "Ali Raza", phoneNumber: "+92-300-1234567", salaryAmount: 50000, paidAmount: 40000, petrolExpense: 3000, otherExpense: 2000, remainingAmount: 5000, startDate: "2024-12-01", endDate: "2024-12-31", timestamp: new Date("2024-12-15").toISOString() },
  { userId: "2", name: "Sara Khan", phoneNumber: "+92-301-7654321", salaryAmount: 45000, paidAmount: 45000, petrolExpense: 0, otherExpense: 0, remainingAmount: 0, startDate: "2024-12-01", endDate: "2024-12-31", timestamp: new Date("2024-12-20").toISOString() },
  { userId: "3", name: "Usman Ali", phoneNumber: "+92-302-9876543", salaryAmount: 55000, paidAmount: 30000, petrolExpense: 5000, otherExpense: 3000, remainingAmount: 17000, startDate: "2024-11-01", endDate: "2024-11-30", timestamp: new Date("2024-11-10").toISOString() },
  { userId: "4", name: "Ayesha Ahmed", phoneNumber: "+92-303-1112233", salaryAmount: 48000, paidAmount: 48000, petrolExpense: 0, otherExpense: 0, remainingAmount: 0, startDate: "2024-12-01", endDate: "2024-12-31", timestamp: new Date("2024-12-22").toISOString() },
];

// ─── Mobile Salary Card ───────────────────────────────────────────────────────
const SalaryCard = ({ salary, onEdit }) => {
  const [open, setOpen] = useState(false);
  const isPaid = Number(salary.remainingAmount) === 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Always-visible row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left focus:outline-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {salary.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">{salary.name}</p>
            <p className="text-xs text-gray-400 truncate">{salary.phoneNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <div className="text-right">
            <p className="text-sm font-bold text-purple-600">
              ₨{Number(salary.salaryAmount).toLocaleString()}
            </p>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isPaid ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
              {isPaid ? "Fully Paid" : `Due ₨${Number(salary.remainingAmount).toLocaleString()}`}
            </span>
          </div>
          {open
            ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
            : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
          }
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3 bg-gray-50/40">
          {/* Period */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Period</span>
            <span className="text-xs font-medium text-gray-700 bg-purple-50 px-2.5 py-1 rounded-lg">
              {salary.startDate} → {salary.endDate}
            </span>
          </div>

          {/* Amounts breakdown */}
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
            {[
              { label: "Salary", value: salary.salaryAmount, color: "text-purple-600" },
              { label: "Paid", value: salary.paidAmount, color: "text-green-600" },
              { label: "Petrol Expense", value: salary.petrolExpense, color: "text-blue-500" },
              { label: "Other Expense", value: salary.otherExpense, color: "text-gray-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center px-3 py-2">
                <span className="text-xs text-gray-500">{label}</span>
                <span className={`text-sm font-semibold ${color}`}>₨{Number(value).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between items-center px-3 py-2 bg-orange-50/50 rounded-b-xl">
              <span className="text-xs font-medium text-gray-700">Remaining</span>
              <span className="text-sm font-bold text-orange-500">₨{Number(salary.remainingAmount).toLocaleString()}</span>
            </div>
          </div>

          {/* Edit button */}
          <button
            onClick={() => onEdit(salary)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Salary
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SummaryCard = ({ label, value, icon: Icon, colorClass, bgClass, borderClass, dark }) => (
  <div className={`rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 border hover:-translate-y-0.5 ${dark ? "bg-gradient-to-br from-purple-500 to-pink-600 border-purple-400" : `bg-white ${borderClass}`}`}>
    <div className="flex items-center justify-between">
      <div className="min-w-0 flex-1">
        <p className={`text-xs sm:text-sm font-medium mb-1 truncate ${dark ? "text-purple-100" : "text-gray-500"}`}>{label}</p>
        <p className={`text-xl sm:text-2xl lg:text-3xl font-bold truncate ${dark ? "text-white" : colorClass}`}>{value}</p>
      </div>
      <div className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ml-2 ${dark ? "bg-white/20" : bgClass}`}>
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${dark ? "text-white" : colorClass}`} />
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Salaries = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [salariesList, setSalariesList] = useState(mockSalaries);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const salaries = useMemo(() => {
    if (!salariesList) return [];
    return salariesList.map((salary, index) => ({
      serial: index + 1,
      userId: salary.userId || "N/A",
      name: salary.name || "N/A",
      phoneNumber: salary.phoneNumber || "N/A",
      salaryAmount: salary.salaryAmount ?? 0,
      paidAmount: salary.paidAmount ?? 0,
      remainingAmount: salary.remainingAmount ?? 0,
      startDate: salary.startDate ? new Date(salary.startDate).toLocaleDateString() : "N/A",
      endDate: salary.endDate ? new Date(salary.endDate).toLocaleDateString() : "N/A",
      petrolExpense: salary.petrolExpense ?? 0,
      otherExpense: salary.otherExpense ?? 0,
      timestamp: salary.timestamp ? new Date(salary.timestamp).toLocaleString() : "N/A",
    }));
  }, [salariesList]);

  const filteredSalaries = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return salaries.filter(s =>
      s.name.toLowerCase().includes(term) || s.phoneNumber.includes(term)
    );
  }, [salaries, searchTerm]);

  const summaryData = useMemo(() => {
    if (!salaries.length) return null;
    return salaries.reduce((acc, s) => {
      const sa = Number(s.salaryAmount) || 0;
      const pa = Number(s.paidAmount) || 0;
      const pe = Number(s.petrolExpense) || 0;
      const oe = Number(s.otherExpense) || 0;
      const ra = Number(s.remainingAmount) || 0;

      acc.totalSalary += sa;
      acc.totalPaid += pa;
      acc.totalPetrolExpense += pe;
      acc.totalOtherExpense += oe;
      acc.totalRemaining += ra;
      acc.employeeCount += 1;

      if (!acc.employees[s.name]) acc.employees[s.name] = { totalSalary: 0, totalPaid: 0, totalRemaining: 0 };
      acc.employees[s.name].totalSalary += sa;
      acc.employees[s.name].totalPaid += pa;
      acc.employees[s.name].totalRemaining += ra;
      return acc;
    }, { totalSalary: 0, totalPaid: 0, totalPetrolExpense: 0, totalOtherExpense: 0, totalRemaining: 0, employeeCount: 0, employees: {} });
  }, [salaries]);

  const handleCreateSalary = (salaryData) => {
    if (isEditMode && selectedSalary) {
      setSalariesList(prev => prev.map(item =>
        item.userId === selectedSalary.userId
          ? { ...item, ...salaryData, salaryAmount: Number(salaryData.salaryAmount), paidAmount: Number(salaryData.paidAmount), petrolExpense: Number(salaryData.petrolExpense) || 0, otherExpense: Number(salaryData.otherExpense) || 0, remainingAmount: Number(salaryData.remainingAmount) }
          : item
      ));
    } else {
      setSalariesList(prev => [...prev, {
        userId: String(prev.length + 1),
        ...salaryData,
        salaryAmount: Number(salaryData.salaryAmount),
        paidAmount: Number(salaryData.paidAmount),
        petrolExpense: Number(salaryData.petrolExpense) || 0,
        otherExpense: Number(salaryData.otherExpense) || 0,
        remainingAmount: Number(salaryData.remainingAmount),
        timestamp: new Date().toISOString(),
      }]);
    }
    setIsModalOpen(false);
    setSelectedSalary(null);
    setIsEditMode(false);
  };

  const handleExport = () => {
    const rows = [
      ["Name", "Phone", "Salary", "Paid", "Petrol", "Other", "Remaining", "Start", "End"],
      ...salariesList.map(s => [s.name, s.phoneNumber, s.salaryAmount, s.paidAmount, s.petrolExpense, s.otherExpense, s.remainingAmount, s.startDate, s.endDate])
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
      download: "salaries.csv"
    });
    a.click();
  };

  const openEdit = (salary) => {
    setSelectedSalary(salariesList.find(s => s.userId === salary.userId));
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            {/* Left: icon + title */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-md flex-shrink-0">
                <Wallet className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 truncate">
                  Salary Management
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">
                  Track and manage employee salaries
                </p>
              </div>
            </div>

            {/* Desktop buttons */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-green-600 rounded-xl shadow-sm hover:shadow-md transition-all border border-green-100 text-sm font-medium whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all text-sm font-medium whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add Salary
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-xl bg-gray-50 border border-gray-200 flex-shrink-0"
            >
              {mobileMenuOpen
                ? <X className="w-5 h-5 text-gray-600" />
                : <Menu className="w-5 h-5 text-gray-600" />
              }
            </button>
          </div>

          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => { handleExport(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 py-2.5 bg-white text-green-600 rounded-xl border border-green-100 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => { setIsModalOpen(true); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Salary
              </button>
            </div>
          )}
        </div>

        {/* ── Summary Cards ──────────────────────────────────────── */}
        {summaryData && (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <SummaryCard
              label="Total Employees" value={summaryData.employeeCount}
              icon={Users} colorClass="text-purple-600" bgClass="bg-purple-50" borderClass="border-purple-100"
            />
            <SummaryCard
              label="Total Paid" value={`₨${summaryData.totalPaid.toLocaleString()}`}
              icon={DollarSign} colorClass="text-green-600" bgClass="bg-green-50" borderClass="border-green-100"
            />
            <SummaryCard
              label="Remaining" value={`₨${summaryData.totalRemaining.toLocaleString()}`}
              icon={Calendar} colorClass="text-orange-500" bgClass="bg-orange-50" borderClass="border-orange-100"
            />
            <div className="col-span-2 xl:col-span-1">
              <SummaryCard
                label="Total Salaries" value={`₨${summaryData.totalSalary.toLocaleString()}`}
                icon={TrendingUp} dark
              />
            </div>
          </div>
        )}

        {/* ── Search ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by employee name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm transition-all"
            />
          </div>
        </div>

        {/* ── Mobile Cards (< lg) ──────────────────────────────── */}
        <div className="block lg:hidden">
          {filteredSalaries.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm font-medium">No employees found</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredSalaries.map(salary => (
                <SalaryCard
                  key={salary.userId}
                  salary={salary}
                  onEdit={openEdit}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Desktop Table (≥ lg) ─────────────────────────────── */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  {["Employee", "Period", "Salary", "Paid", "Petrol", "Other", "Remaining", "Actions"].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSalaries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <Users className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No employees found</p>
                    </td>
                  </tr>
                ) : filteredSalaries.map(salary => (
                  <tr key={salary.userId} className="hover:bg-purple-50/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {salary.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{salary.name}</p>
                          <p className="text-xs text-gray-400">{salary.phoneNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700 font-medium whitespace-nowrap">{salary.startDate}</p>
                      <p className="text-xs text-gray-400 whitespace-nowrap">to {salary.endDate}</p>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-purple-600 whitespace-nowrap">
                      ₨{Number(salary.salaryAmount).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-green-600 whitespace-nowrap">
                      ₨{Number(salary.paidAmount).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-blue-500 whitespace-nowrap">
                      ₨{Number(salary.petrolExpense).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                      ₨{Number(salary.otherExpense).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-orange-500 whitespace-nowrap">
                      ₨{Number(salary.remainingAmount).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => openEdit(salary)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Employee Summary ───────────────────────────────────── */}
        {summaryData && Object.keys(summaryData.employees).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-base sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Employee Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {Object.entries(summaryData.employees).map(([employeeName, data]) => (
                <div
                  key={employeeName}
                  className="p-4 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl border border-purple-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {employeeName.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{employeeName}</h3>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { label: "Total Salary", value: data.totalSalary, color: "text-purple-600" },
                      { label: "Paid", value: data.totalPaid, color: "text-green-600" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-gray-500">{label}:</span>
                        <span className={`font-semibold ${color}`}>₨{value.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm pt-2 border-t border-purple-200">
                      <span className="font-medium text-gray-700">Remaining:</span>
                      <span className="font-bold text-orange-500">₨{data.totalRemaining.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateSalariesModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedSalary(null); setIsEditMode(false); }}
        onCreate={handleCreateSalary}
        initialData={selectedSalary}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default Salaries;