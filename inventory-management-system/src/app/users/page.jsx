"use client";

import React, { useState, useMemo } from 'react';
import { User, Plus, Download, Trash2, TrendingUp, DollarSign, Package, CreditCard } from 'lucide-react';
import CreateUsersModal from './CreateUsersModal';

// Mock data for demonstration
const mockUsers = [
  { userId: '1', name: 'Ahmed Khan', producttype: 'Electronics', phoneNumber: '+92-300-1234567', unitCost: 1500, quantity: 5, paidAmount: 5000, totalAmount: 7500, remainingAmount: 2500, timestamp: new Date('2024-12-15').toISOString() },
  { userId: '2', name: 'Fatima Ali', producttype: 'Clothing', phoneNumber: '+92-301-7654321', unitCost: 800, quantity: 10, paidAmount: 6000, totalAmount: 8000, remainingAmount: 2000, timestamp: new Date('2024-12-20').toISOString() },
  { userId: '3', name: 'Hassan Shah', producttype: 'Furniture', phoneNumber: '+92-302-9876543', unitCost: 3000, quantity: 3, paidAmount: 7000, totalAmount: 9000, remainingAmount: 2000, timestamp: new Date('2024-11-10').toISOString() },
  { userId: '4', name: 'Ayesha Malik', producttype: 'Electronics', phoneNumber: '+92-303-1112233', unitCost: 2000, quantity: 4, paidAmount: 8000, totalAmount: 8000, remainingAmount: 0, timestamp: new Date('2024-12-22').toISOString() },
  { userId: '5', name: 'Ahmed Khan', producttype: 'Accessories', phoneNumber: '+92-300-1234567', unitCost: 500, quantity: 8, paidAmount: 2000, totalAmount: 4000, remainingAmount: 2000, timestamp: new Date('2024-11-25').toISOString() },
];

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [usersList, setUsersList] = useState(mockUsers);

  const users = useMemo(() => {
    if (!usersList) return [];
    return usersList.map((user, index) => ({
      serial: index + 1,
      userId: user.userId || 'N/A',
      name: user.name || 'N/A',
      producttype: user.producttype ?? "N/A",
      phoneNumber: user.phoneNumber ?? "N/A",
      unitCost: user.unitCost ?? "N/A",
      quantity: user.quantity ?? 'N/A',
      paidAmount: user.paidAmount ?? "N/A",
      remainingAmount: user.remainingAmount ?? "N/A",
      totalAmount: user.totalAmount ?? "N/A",
      timestamp: user.timestamp ? new Date(user.timestamp).toLocaleString() : 'N/A',
    }));
  }, [usersList]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.producttype.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm)
    );
  }, [users, searchTerm]);

  const summaryData = useMemo(() => {
    if (!users?.length) return null;
    return users.reduce((acc, user) => ({
      totalQuantity: acc.totalQuantity + (Number(user.quantity) || 0),
      totalPaidAmount: acc.totalPaidAmount + (Number(user.paidAmount) || 0),
      totalRemainingAmount: acc.totalRemainingAmount + (Number(user.remainingAmount) || 0),
      grandTotal: acc.grandTotal + (Number(user.totalAmount) || 0),
      totalUsers: acc.totalUsers + 1
    }), {
      totalQuantity: 0,
      totalPaidAmount: 0,
      totalRemainingAmount: 0,
      grandTotal: 0,
      totalUsers: 0,
    });
  }, [users]);

  const nameWiseSummary = useMemo(() => {
    if (!users?.length) return [];
    const summaryByName = users.reduce((acc, user) => {
      const name = user.name;
      if (!acc[name]) {
        acc[name] = {
          totalPaidAmount: 0,
          totalRemainingAmount: 0,
          totalAmount: 0,
          transactions: 0
        };
      }
      acc[name].totalPaidAmount += Number(user.paidAmount) || 0;
      acc[name].totalRemainingAmount += Number(user.remainingAmount) || 0;
      acc[name].totalAmount += Number(user.totalAmount) || 0;
      acc[name].transactions += 1;
      return acc;
    }, {});

    return Object.entries(summaryByName)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }, [users]);

  const handleCreateUser = (userData) => {
    const totalAmount = Number(userData.quantity) * Number(userData.unitCost);
    const remainingAmount = totalAmount - Number(userData.paidAmount);
    
    const newUser = {
      userId: String(usersList.length + 1),
      name: userData.name,
      producttype: userData.producttype,
      phoneNumber: userData.phoneNumber,
      unitCost: Number(userData.unitCost),
      quantity: Number(userData.quantity),
      paidAmount: Number(userData.paidAmount),
      totalAmount: totalAmount,
      remainingAmount: remainingAmount,
      timestamp: new Date().toISOString()
    };

    setUsersList([...usersList, newUser]);
    setIsModalOpen(false);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setUsersList(usersList.filter(user => user.userId !== userId));
    }
  };

  const exportToExcel = () => {
    alert('Export functionality would trigger here');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
              <p className="text-gray-500 text-sm">Track and manage your customer transactions</p>
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
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add Customer</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {summaryData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Customers</p>
                  <p className="text-3xl font-bold text-gray-800">{summaryData.totalUsers}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-green-100 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Paid</p>
                  <p className="text-3xl font-bold text-green-600">₨{summaryData.totalPaidAmount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-orange-100 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Remaining</p>
                  <p className="text-3xl font-bold text-orange-600">₨{summaryData.totalRemainingAmount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                  <CreditCard className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-100 mb-1">Grand Total</p>
                  <p className="text-3xl font-bold text-white">₨{summaryData.grandTotal.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <input
            type="text"
            placeholder="Search by name, product, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Customer Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Paid</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remaining</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.timestamp}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                        {user.producttype}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.phoneNumber}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
                        {user.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">₨{Number(user.paidAmount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-orange-600">₨{Number(user.remainingAmount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-indigo-600">₨{Number(user.totalAmount).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDeleteUser(user.userId)}
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

        {/* Name-wise Summary */}
        {nameWiseSummary.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              Customer Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nameWiseSummary.map((summary) => (
                <div key={summary.name} className="p-5 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">{summary.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      {summary.transactions} orders
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Paid:</span>
                      <span className="font-semibold text-green-600">₨{summary.totalPaidAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining:</span>
                      <span className="font-semibold text-orange-600">₨{summary.totalRemainingAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="font-medium text-gray-700">Total:</span>
                      <span className="font-bold text-indigo-600">₨{summary.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateUsersModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateUser}
      />
    </div>
  );
};

export default Users;