"use client";

import React, { useState, useMemo } from 'react';
import {
  Receipt, Plus, Download, Trash2, TrendingDown,
  DollarSign, PieChart, Calendar, Search, Menu, X,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import CreateExpenseModal from './CreateExpenseModal';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockExpenses = [
  { expenseId: '1', category: 'Office Supplies', amount: 15000, timestamp: new Date('2024-12-15').toISOString() },
  { expenseId: '2', category: 'Transportation', amount: 8000, timestamp: new Date('2024-12-20').toISOString() },
  { expenseId: '3', category: 'Utilities', amount: 12000, timestamp: new Date('2024-12-22').toISOString() },
  { expenseId: '4', category: 'Office Supplies', amount: 5000, timestamp: new Date('2024-11-10').toISOString() },
  { expenseId: '5', category: 'Marketing', amount: 25000, timestamp: new Date('2024-12-18').toISOString() },
  { expenseId: '6', category: 'Transportation', amount: 6000, timestamp: new Date('2024-11-25').toISOString() },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getCategoryColor = (category) => {
  const colors = {
    'Office Supplies': 'from-blue-400 to-cyan-500',
    'Transportation': 'from-green-400 to-emerald-500',
    'Utilities': 'from-yellow-400 to-orange-500',
    'Marketing': 'from-purple-400 to-pink-500',
    'Food': 'from-red-400 to-rose-500',
  };
  return colors[category] || 'from-gray-400 to-gray-500';
};

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SummaryCard = ({ label, value, icon: Icon, colorClass, bgClass, borderClass, dark }) => (
  <div className={`rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 border hover:-translate-y-0.5 ${dark ? 'bg-gradient-to-br from-orange-500 to-red-600 border-orange-400' : `bg-white ${borderClass}`}`}>
    <div className="flex items-center justify-between">
      <div className="min-w-0 flex-1">
        <p className={`text-xs sm:text-sm font-medium mb-1 truncate ${dark ? 'text-orange-100' : 'text-gray-500'}`}>{label}</p>
        <p className={`text-xl sm:text-2xl lg:text-3xl font-bold truncate ${dark ? 'text-white' : colorClass}`}>{value}</p>
      </div>
      <div className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ml-2 ${dark ? 'bg-white/20' : bgClass}`}>
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${dark ? 'text-white' : colorClass}`} />
      </div>
    </div>
  </div>
);

// ─── Mobile Expense Card ──────────────────────────────────────────────────────
const ExpenseCard = ({ expense, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Always-visible row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left focus:outline-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 flex-shrink-0 bg-gradient-to-br ${getCategoryColor(expense.category)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
            {expense.category.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">{expense.category}</p>
            <p className="text-xs text-gray-400">#{expense.serial}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <p className="text-sm font-bold text-red-600">
            ₨{Number(expense.amount).toLocaleString()}
          </p>
          {open
            ? <ChevronUp className="w-4 h-4 text-gray-400" />
            : <ChevronDown className="w-4 h-4 text-gray-400" />
          }
        </div>
      </button>

      {/* Expanded */}
      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3 bg-gray-50/40">
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
            <div className="flex justify-between items-center px-3 py-2">
              <span className="text-xs text-gray-500">Amount</span>
              <span className="text-sm font-bold text-red-600">₨{Number(expense.amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center px-3 py-2">
              <span className="text-xs text-gray-500">Date & Time</span>
              <span className="text-xs font-medium text-gray-700">{expense.timestamp}</span>
            </div>
          </div>

          <button
            onClick={() => onDelete(expense.expenseId)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 active:scale-95 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Expense
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Expenses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expensesList, setExpensesList] = useState(mockExpenses);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const expenses = useMemo(() => {
    if (!expensesList) return [];
    return expensesList.map((expense, index) => ({
      serial: index + 1,
      expenseId: expense.expenseId || 'N/A',
      category: expense.category || 'Uncategorized',
      amount: expense.amount != null ? expense.amount : 0,
      timestamp: expense.timestamp ? new Date(expense.timestamp).toLocaleString() : 'N/A',
    }));
  }, [expensesList]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e =>
      e.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [expenses, searchTerm]);

  const summaryData = useMemo(() => {
    if (!expenses.length) return null;
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryWiseTotals = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
    const monthlyTotals = expenses.reduce((acc, e) => {
      const month = new Date(e.timestamp).toLocaleString('default', { month: 'long', year: 'numeric' });
      acc[month] = (acc[month] || 0) + e.amount;
      return acc;
    }, {});
    return { totalAmount, categoryWiseTotals, monthlyTotals, expenseCount: expenses.length };
  }, [expenses]);

  const handleCreateExpense = (expenseData) => {
    setExpensesList(prev => [...prev, {
      expenseId: String(prev.length + 1),
      category: expenseData.category,
      amount: Number(expenseData.amount),
      timestamp: new Date().toISOString(),
    }]);
    setIsModalOpen(false);
  };

  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpensesList(prev => prev.filter(e => e.expenseId !== expenseId));
    }
  };

  const handleExport = () => {
    const rows = [
      ['S.No', 'Category', 'Amount (PKR)', 'Date'],
      ...expenses.map(e => [e.serial, e.category, e.amount, e.timestamp])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: 'expenses.csv',
    });
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            {/* Left */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-md flex-shrink-0">
                <Receipt className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 truncate">
                  Expense Management
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">
                  Track and manage your business expenses
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
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all text-sm font-medium whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add Expense
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
                className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Expense
              </button>
            </div>
          )}
        </div>

        {/* ── Summary Cards ──────────────────────────────────────── */}
        {summaryData && (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <SummaryCard
              label="Total Expenses" value={summaryData.expenseCount}
              icon={Receipt} colorClass="text-orange-600" bgClass="bg-orange-50" borderClass="border-orange-100"
            />
            <div className="col-span-2 xl:col-span-1 order-last xl:order-none">
              <SummaryCard
                label="Total Amount" value={`₨${summaryData.totalAmount.toLocaleString()}`}
                icon={TrendingDown} dark
              />
            </div>
            <SummaryCard
              label="Categories" value={Object.keys(summaryData.categoryWiseTotals).length}
              icon={PieChart} colorClass="text-blue-600" bgClass="bg-blue-50" borderClass="border-blue-100"
            />
            <SummaryCard
              label="Avg. Expense"
              value={`₨${Math.round(summaryData.totalAmount / summaryData.expenseCount).toLocaleString()}`}
              icon={DollarSign} colorClass="text-purple-600" bgClass="bg-purple-50" borderClass="border-purple-100"
            />
          </div>
        )}

        {/* ── Search ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm transition-all"
            />
          </div>
        </div>

        {/* ── Mobile Cards (< lg) ──────────────────────────────── */}
        <div className="block lg:hidden">
          {filteredExpenses.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <Receipt className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm font-medium">No expenses found</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredExpenses.map(expense => (
                <ExpenseCard
                  key={expense.expenseId}
                  expense={expense}
                  onDelete={handleDeleteExpense}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Desktop Table (≥ lg) ─────────────────────────────── */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  {['S.No', 'Category', 'Amount', 'Date / Time', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <Receipt className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No expenses found</p>
                    </td>
                  </tr>
                ) : filteredExpenses.map(expense => (
                  <tr key={expense.expenseId} className="hover:bg-orange-50/40 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-500 font-medium">{expense.serial}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 flex-shrink-0 bg-gradient-to-br ${getCategoryColor(expense.category)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                          {expense.category.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">{expense.category}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-red-600 whitespace-nowrap">
                      ₨{Number(expense.amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{expense.timestamp}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDeleteExpense(expense.expenseId)}
                        className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Category-wise Summary ──────────────────────────────── */}
        {summaryData && Object.keys(summaryData.categoryWiseTotals).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-base sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-orange-600" />
              Category-wise Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {Object.entries(summaryData.categoryWiseTotals).map(([category, amount]) => (
                <div key={category} className="p-4 bg-gradient-to-br from-gray-50 to-orange-50 rounded-xl border border-orange-100 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 flex-shrink-0 bg-gradient-to-br ${getCategoryColor(category)} rounded-xl flex items-center justify-center text-white font-bold`}>
                      {category.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{category}</h3>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-orange-200">
                    <span className="text-xs text-gray-500">Total</span>
                    <span className="font-bold text-red-600 text-base">₨{amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Monthly Summary ────────────────────────────────────── */}
        {summaryData && Object.keys(summaryData.monthlyTotals).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-base sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Monthly Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {Object.entries(summaryData.monthlyTotals).map(([month, amount]) => (
                <div key={month} className="p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-red-50 rounded-xl border border-red-100 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 mb-1">Month</p>
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{month}</h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-400 mb-1">Total</p>
                      <p className="font-bold text-red-600 text-base sm:text-xl">₨{amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal */}
      <CreateExpenseModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateExpense}
      />
    </div>
  );
};

export default Expenses;