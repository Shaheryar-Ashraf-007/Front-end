"use client";

import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import { X } from 'lucide-react';

const CreateSalariesModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    userId: v4(),
    name: "",
    phoneNumber: "",
    salaryAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    startDate: "",
    endDate: "",
    timestamp: new Date().toISOString(),
    otherExpense: 0,
    petrolExpense: 0,
  });

  /* Reset form when modal opens */
  useEffect(() => {
    if (isOpen) {
      setFormData({
        userId: v4(),
        name: "",
        phoneNumber: "",
        salaryAmount: 0,
        paidAmount: 0,
        remainingAmount: 0,
        startDate: "",
        endDate: "",
        timestamp: new Date().toISOString(),
        otherExpense: 0,
        petrolExpense: 0,
      });
    }
  }, [isOpen]);

  /* Auto calculate remaining amount */
  useEffect(() => {
    const totalDeductions = (Number(formData.paidAmount) || 0) + 
                           (Number(formData.petrolExpense) || 0) + 
                           (Number(formData.otherExpense) || 0);
    const remaining = (Number(formData.salaryAmount) || 0) - totalDeductions;
    
    setFormData((prev) => ({
      ...prev,
      remainingAmount: remaining,
    }));
  }, [formData.salaryAmount, formData.paidAmount, formData.petrolExpense, formData.otherExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["salaryAmount", "paidAmount", "remainingAmount", "otherExpense", "petrolExpense"].includes(name)
        ? parseFloat(value) || 0
        : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Add New Salary</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Employee Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter employee name"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="+92-300-1234567"
              />
            </div>

            {/* Salary Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Salary Amount (₨) *
              </label>
              <input
                type="number"
                name="salaryAmount"
                value={formData.salaryAmount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Paid Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Paid Amount (₨) *
              </label>
              <input
                type="number"
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Expenses Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Expenses & Deductions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Petrol Expense */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Petrol Expense (₨)
                </label>
                <input
                  type="number"
                  name="petrolExpense"
                  value={formData.petrolExpense}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                />
              </div>

              {/* Other Expense */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Other Expense (₨)
                </label>
                <input
                  type="number"
                  name="otherExpense"
                  value={formData.otherExpense}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                />
              </div>

              {/* Remaining Amount (Read-only) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Remaining Amount (₨)
                </label>
                <input
                  type="number"
                  name="remainingAmount"
                  value={formData.remainingAmount}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed text-gray-600"
                  placeholder="Auto calculated"
                />
              </div>
            </div>
          </div>

          {/* Calculation Summary */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Salary Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Salary:</span>
                <span className="font-semibold text-gray-800">₨{formData.salaryAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Paid Amount:</span>
                <span className="font-semibold text-green-600">₨{formData.paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Petrol Expense:</span>
                <span className="font-semibold text-blue-600">₨{formData.petrolExpense.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Other Expense:</span>
                <span className="font-semibold text-blue-600">₨{formData.otherExpense.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-purple-200">
                <span className="font-medium text-gray-700">Remaining Amount:</span>
                <span className="font-bold text-orange-600">₨{formData.remainingAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              Create Salary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSalariesModal;