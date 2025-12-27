"use client";

import React, { useState, useMemo } from 'react';
import { Wallet, Plus, Download, Trash2, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
import CreateSalariesModal from './CreateSallariesModal';

// Mock data for demonstration
const mockSalaries = [
  { userId: '1', name: 'Ali Raza', phoneNumber: '+92-300-1234567', salaryAmount: 50000, paidAmount: 40000, petrolExpense: 3000, otherExpense: 2000, remainingAmount: 5000, startDate: '2024-12-01', endDate: '2024-12-31', timestamp: new Date('2024-12-15').toISOString() },
  { userId: '2', name: 'Sara Khan', phoneNumber: '+92-301-7654321', salaryAmount: 45000, paidAmount: 45000, petrolExpense: 0, otherExpense: 0, remainingAmount: 0, startDate: '2024-12-01', endDate: '2024-12-31', timestamp: new Date('2024-12-20').toISOString() },
  { userId: '3', name: 'Usman Ali', phoneNumber: '+92-302-9876543', salaryAmount: 55000, paidAmount: 30000, petrolExpense: 5000, otherExpense: 3000, remainingAmount: 17000, startDate: '2024-11-01', endDate: '2024-11-30', timestamp: new Date('2024-11-10').toISOString() },
  { userId: '4', name: 'Ayesha Ahmed', phoneNumber: '+92-303-1112233', salaryAmount: 48000, paidAmount: 48000, petrolExpense: 0, otherExpense: 0, remainingAmount: 0, startDate: '2024-12-01', endDate: '2024-12-31', timestamp: new Date('2024-12-22').toISOString() },
];

const Salaries = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [salariesList, setSalariesList] = useState(mockSalaries);

  const salaries = useMemo(() => {
    if (!salariesList) return [];
    return salariesList.map((salary, index) => ({
      serial: index + 1,
      userId: salary.userId || 'N/A',
      name: salary.name || 'N/A',
      phoneNumber: salary.phoneNumber || 'N/A',
      salaryAmount: salary.salaryAmount != null ? salary.salaryAmount : "N/A",
      paidAmount: salary.paidAmount != null ? salary.paidAmount : "N/A",
      remainingAmount: salary.remainingAmount != null ? salary.remainingAmount : "N/A",
      startDate: salary.startDate ? new Date(salary.startDate).toLocaleDateString() : 'N/A',
      endDate: salary.endDate ? new Date(salary.endDate).toLocaleDateString() : 'N/A',
      petrolExpense: salary.petrolExpense != null ? salary.petrolExpense : "N/A",
      otherExpense: salary.otherExpense != null ? salary.otherExpense : "N/A",
      timestamp: salary.timestamp ? new Date(salary.timestamp).toLocaleString() : 'N/A',
    }));
  }, [salariesList]);

  const filteredSalaries = useMemo(() => {
    return salaries.filter(salary => 
      salary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salary.phoneNumber.includes(searchTerm)
    );
  }, [salaries, searchTerm]);

  const summaryData = useMemo(() => {
    if (!salaries.length) return null;
    
    return salaries.reduce((acc, salary) => {
      const salaryAmount = Number(salary.salaryAmount) || 0;
      const paidAmount = Number(salary.paidAmount) || 0;
      const petrolExpense = Number(salary.petrolExpense) || 0;
      const otherExpense = Number(salary.otherExpense) || 0;
      const remainingAmount = Number(salary.remainingAmount) || 0;

      acc.totalSalary += salaryAmount;
      acc.totalPaid += paidAmount;
      acc.totalPetrolExpense += petrolExpense;
      acc.totalOtherExpense += otherExpense;
      acc.totalRemaining += remainingAmount;
      acc.employeeCount += 1;

      const employeeName = salary.name;
      if (!acc.employees[employeeName]) {
        acc.employees[employeeName] = { totalSalary: 0, totalPaid: 0, totalRemaining: 0 };
      }
      acc.employees[employeeName].totalSalary += salaryAmount;
      acc.employees[employeeName].totalPaid += paidAmount;
      acc.employees[employeeName].totalRemaining += remainingAmount;

      return acc;
    }, {
      totalSalary: 0,
      totalPaid: 0,
      totalPetrolExpense: 0,
      totalOtherExpense: 0,
      totalRemaining: 0,
      employeeCount: 0,
      employees: {}
    });
  }, [salaries]);

  const handleCreateSalary = (salaryData) => {
    const newSalary = {
      userId: String(salariesList.length + 1),
      name: salaryData.name,
      phoneNumber: salaryData.phoneNumber,
      salaryAmount: Number(salaryData.salaryAmount),
      paidAmount: Number(salaryData.paidAmount),
      petrolExpense: Number(salaryData.petrolExpense) || 0,
      otherExpense: Number(salaryData.otherExpense) || 0,
      remainingAmount: salaryData.remainingAmount,
      startDate: salaryData.startDate,
      endDate: salaryData.endDate,
      timestamp: new Date().toISOString()
    };

    setSalariesList([...salariesList, newSalary]);
    setIsModalOpen(false);
  };

  const handleDeleteSalary = (userId) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      setSalariesList(salariesList.filter(salary => salary.userId !== userId));
    }
  };

  const exportToExcel = () => {
    alert('Export functionality would trigger here');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Salary Management</h1>
              <p className="text-gray-500 text-sm">Track and manage employee salaries</p>
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
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add Salary</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {summaryData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-purple-100 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Employees</p>
                  <p className="text-3xl font-bold text-gray-800">{summaryData.employeeCount}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-green-100 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Paid</p>
                  <p className="text-3xl font-bold text-green-600">₨{summaryData.totalPaid.toLocaleString()}</p>
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
                  <p className="text-3xl font-bold text-orange-600">₨{summaryData.totalRemaining.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-100 mb-1">Total Salaries</p>
                  <p className="text-3xl font-bold text-white">₨{summaryData.totalSalary.toLocaleString()}</p>
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
            placeholder="Search by employee name or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Salaries Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Paid</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Petrol</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Other</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remaining</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSalaries.map((salary) => (
                  <tr key={salary.userId} className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {salary.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{salary.name}</p>
                          <p className="text-xs text-gray-500">{salary.phoneNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-800 font-medium">{salary.startDate}</p>
                        <p className="text-gray-500">to {salary.endDate}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-purple-600">₨{Number(salary.salaryAmount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">₨{Number(salary.paidAmount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">₨{Number(salary.petrolExpense).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">₨{Number(salary.otherExpense).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-orange-600">₨{Number(salary.remainingAmount).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDeleteSalary(salary.userId)}
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

        {/* Employee-wise Summary */}
        {summaryData && Object.keys(summaryData.employees).length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Employee Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(summaryData.employees).map(([employeeName, data]) => (
                <div key={employeeName} className="p-5 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl border border-purple-100 hover:shadow-md transition-all">
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-800 text-lg">{employeeName}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Salary:</span>
                      <span className="font-semibold text-purple-600">₨{data.totalSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Paid:</span>
                      <span className="font-semibold text-green-600">₨{data.totalPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-purple-200">
                      <span className="font-medium text-gray-700">Remaining:</span>
                      <span className="font-bold text-orange-600">₨{data.totalRemaining.toLocaleString()}</span>
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
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateSalary}
      />
    </div>
  );
};

export default Salaries;