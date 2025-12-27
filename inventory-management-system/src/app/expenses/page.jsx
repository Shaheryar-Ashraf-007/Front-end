"use client";

import React, { useState, useMemo } from 'react';
import { Receipt, Plus, Download, Trash2, TrendingDown, DollarSign, PieChart, Calendar } from 'lucide-react';
import CreateExpenseModal from './CreateExpenseModal';

// Mock data for demonstration
const mockExpenses = [
  { expenseId: '1', category: 'Office Supplies', amount: 15000, timestamp: new Date('2024-12-15').toISOString() },
  { expenseId: '2', category: 'Transportation', amount: 8000, timestamp: new Date('2024-12-20').toISOString() },
  { expenseId: '3', category: 'Utilities', amount: 12000, timestamp: new Date('2024-12-22').toISOString() },
  { expenseId: '4', category: 'Office Supplies', amount: 5000, timestamp: new Date('2024-11-10').toISOString() },
  { expenseId: '5', category: 'Marketing', amount: 25000, timestamp: new Date('2024-12-18').toISOString() },
  { expenseId: '6', category: 'Transportation', amount: 6000, timestamp: new Date('2024-11-25').toISOString() },
];

const Expenses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expensesList, setExpensesList] = useState(mockExpenses);

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
    return expenses.filter(expense => 
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [expenses, searchTerm]);

  const summaryData = useMemo(() => {
    if (!expenses.length) return null;
    
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const categoryWiseTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const monthlyTotals = expenses.reduce((acc, expense) => {
      const month = new Date(expense.timestamp).toLocaleString('default', { month: 'long', year: 'numeric' });
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {});

    return {
      totalAmount,
      categoryWiseTotals,
      monthlyTotals,
      expenseCount: expenses.length
    };
  }, [expenses]);

  const handleCreateExpense = (expenseData) => {
    const newExpense = {
      expenseId: String(expensesList.length + 1),
      category: expenseData.category,
      amount: Number(expenseData.amount),
      timestamp: new Date().toISOString()
    };

    setExpensesList([...expensesList, newExpense]);
    setIsModalOpen(false);
  };

  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpensesList(expensesList.filter(expense => expense.expenseId !== expenseId));
    }
  };

  const exportToExcel = () => {
    alert('Export functionality would trigger here');
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
              <Receipt className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Expense Management</h1>
              <p className="text-gray-500 text-sm">Track and manage your business expenses</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-green-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-green-100"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Export</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add Expense</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {summaryData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-orange-100 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Expenses</p>
                  <p className="text-3xl font-bold text-gray-800">{summaryData.expenseCount}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                  <Receipt className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-100 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-white">₨{summaryData.totalAmount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Categories</p>
                  <p className="text-3xl font-bold text-gray-800">{Object.keys(summaryData.categoryWiseTotals).length}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <PieChart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-purple-100 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Avg. Expense</p>
                  <p className="text-3xl font-bold text-gray-800">₨{Math.round(summaryData.totalAmount / summaryData.expenseCount).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <input
            type="text"
            placeholder="Search by category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date/Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.expenseId} className="hover:bg-orange-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{expense.serial}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getCategoryColor(expense.category)} rounded-full flex items-center justify-center text-white font-semibold`}>
                          {expense.category.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{expense.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-red-600">₨{Number(expense.amount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{expense.timestamp}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDeleteExpense(expense.expenseId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

        {/* Category-wise Summary */}
        {summaryData && Object.keys(summaryData.categoryWiseTotals).length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-orange-600" />
              Category-wise Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(summaryData.categoryWiseTotals).map(([category, amount]) => (
                <div key={category} className="p-5 bg-gradient-to-br from-gray-50 to-orange-50 rounded-xl border border-orange-100 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(category)} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                      {category.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-gray-800">{category}</h3>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-orange-200">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="font-bold text-red-600 text-lg">₨{amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Summary */}
        {summaryData && Object.keys(summaryData.monthlyTotals).length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Monthly Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(summaryData.monthlyTotals).map(([month, amount]) => (
                <div key={month} className="p-5 bg-gradient-to-br from-gray-50 to-red-50 rounded-xl border border-red-100 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Month</p>
                      <h3 className="font-semibold text-gray-800 text-lg">{month}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                      <p className="font-bold text-red-600 text-xl">₨{amount.toLocaleString()}</p>
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