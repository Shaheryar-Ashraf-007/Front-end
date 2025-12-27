import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CreateExpenseModal = ({ open, onClose, onCreate }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  /* Reset form when modal opens */
  useEffect(() => {
    if (open) {
      setCategory('');
      setAmount('');
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !amount) {
      alert("Both category and amount are required!");
      return;
    }

    onCreate({ category, amount: parseFloat(amount) });
    setCategory('');
    setAmount('');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Add New Expense</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expense Category *
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="e.g., Office Supplies, Transportation"
            />
            <p className="mt-1 text-xs text-gray-500">Enter the category of this expense</p>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount (₨) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="0.00"
            />
            <p className="mt-1 text-xs text-gray-500">Enter the expense amount</p>
          </div>

          {/* Summary Box */}
          {amount && (
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100 mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Expense Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold text-gray-800">{category || 'Not specified'}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-orange-200">
                  <span className="font-medium text-gray-700">Amount:</span>
                  <span className="font-bold text-red-600">₨{Number(amount || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExpenseModal;