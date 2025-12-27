"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { X } from 'lucide-react';

const CreateUsersModal = ({ isOpen, onClose, onCreate }) => {
  const [userData, setUserData] = useState({
    userId: uuidv4(),
    name: "",
    producttype: "",
    phoneNumber: "",
    unitCost: 0,
    paidAmount: 0,
    quantity: 0,
    remainingAmount: 0,
    totalAmount: 0,
    timestamp: new Date().toISOString(),
  });

  /* Reset form when modal opens */
  useEffect(() => {
    if (isOpen) {
      setUserData({
        userId: uuidv4(),
        name: "",
        producttype: "",
        phoneNumber: "",
        unitCost: 0,
        paidAmount: 0,
        quantity: 0,
        remainingAmount: 0,
        totalAmount: 0,
        timestamp: new Date().toISOString(),
      });
    }
  }, [isOpen]);

  /* Auto calculate total & remaining */
  useEffect(() => {
    const total = userData.unitCost * userData.quantity || userData.totalAmount;
    const remaining = total - userData.paidAmount;

    setUserData((prev) => ({
      ...prev,
      totalAmount: userData.totalAmount ? userData.totalAmount : total,
      remainingAmount: remaining,
    }));
  }, [userData.unitCost, userData.quantity, userData.paidAmount, userData.totalAmount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: ["unitCost", "quantity", "paidAmount", "totalAmount"].includes(name)
        ? Number(value) || 0
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(userData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Add New Customer</h2>
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
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter customer name"
              />
            </div>

            {/* Product Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Type *
              </label>
              <input
                type="text"
                name="producttype"
                value={userData.producttype}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter product type"
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
                value={userData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="+92-300-1234567"
              />
            </div>

            {/* Unit Cost */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit Cost (₨) *
              </label>
              <input
                type="number"
                name="unitCost"
                value={userData.unitCost}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={userData.quantity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="1"
              />
            </div>

            {/* Total Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Total Amount (₨)
              </label>
              <input
                type="number"
                name="totalAmount"
                value={userData.totalAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Optional - auto calculated"
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
                value={userData.paidAmount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>

            {/* Remaining Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Remaining Amount (₨)
              </label>
              <input
                type="number"
                name="remainingAmount"
                value={userData.remainingAmount}
                readOnly
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed text-gray-600"
                placeholder="Auto calculated"
              />
            </div>
          </div>

          {/* Calculation Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-gray-800">₨{userData.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Paid Amount:</span>
                <span className="font-semibold text-green-600">₨{userData.paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-blue-200">
                <span className="font-medium text-gray-700">Remaining Amount:</span>
                <span className="font-bold text-orange-600">₨{userData.remainingAmount.toLocaleString()}</span>
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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              Create Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUsersModal;