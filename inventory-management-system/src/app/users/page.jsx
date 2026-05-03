"use client";

import React, { useState, useMemo } from 'react';
import {
  User, Plus, Download, Trash2, TrendingUp, DollarSign,
  Package, CreditCard, Printer, Search, ChevronDown, ChevronUp, Menu, X
} from 'lucide-react';
import CreateUsersModal from './CreateUsersModal';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockUsers = [
  { userId: '1', name: 'Ahmed Khan', producttype: 'Electronics', phoneNumber: '+92-300-1234567', unitCost: 1500, quantity: 5, paidAmount: 5000, totalAmount: 7500, remainingAmount: 2500, timestamp: new Date('2024-12-15').toISOString() },
  { userId: '2', name: 'Fatima Ali', producttype: 'Clothing', phoneNumber: '+92-301-7654321', unitCost: 800, quantity: 10, paidAmount: 6000, totalAmount: 8000, remainingAmount: 2000, timestamp: new Date('2024-12-20').toISOString() },
  { userId: '3', name: 'Hassan Shah', producttype: 'Furniture', phoneNumber: '+92-302-9876543', unitCost: 3000, quantity: 3, paidAmount: 7000, totalAmount: 9000, remainingAmount: 2000, timestamp: new Date('2024-11-10').toISOString() },
  { userId: '4', name: 'Ayesha Malik', producttype: 'Electronics', phoneNumber: '+92-303-1112233', unitCost: 2000, quantity: 4, paidAmount: 8000, totalAmount: 8000, remainingAmount: 0, timestamp: new Date('2024-12-22').toISOString() },
  { userId: '5', name: 'Ahmed Khan', producttype: 'Accessories', phoneNumber: '+92-300-1234567', unitCost: 500, quantity: 8, paidAmount: 2000, totalAmount: 4000, remainingAmount: 2000, timestamp: new Date('2024-11-25').toISOString() },
];

// ─── Invoice Print ────────────────────────────────────────────────────────────
const handlePrintInvoice = (user) => {
  const invoiceNumber = `INV-${String(user.userId).padStart(4, '0')}`;
  const dateStr = new Date(user.timestamp).toLocaleDateString('en-PK', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const invoiceHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Invoice ${invoiceNumber}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Segoe UI',Arial,sans-serif;color:#1a1a1a;background:#fff;padding:40px}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;padding-bottom:20px;border-bottom:1px solid #e5e5e5}
    .invoice-title{font-size:28px;font-weight:600}
    .invoice-number{font-size:13px;color:#888;margin-top:4px}
    .business-name{font-size:15px;font-weight:600;text-align:right}
    .business-sub{font-size:12px;color:#888;margin-top:2px;text-align:right}
    .meta{display:flex;justify-content:space-between;margin-bottom:32px}
    .meta-label{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#999;margin-bottom:4px}
    .meta-value{font-size:14px;font-weight:600}
    .meta-sub{font-size:12px;color:#555;margin-top:2px}
    table{width:100%;border-collapse:collapse;margin-bottom:20px}
    thead tr{background:#f7f7f7}
    th{padding:9px 12px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#666;text-align:left}
    th:not(:first-child){text-align:right}
    td{padding:12px;font-size:13px;color:#333;border-bottom:1px solid #f0f0f0}
    td:not(:first-child){text-align:right}
    .totals{max-width:260px;margin-left:auto;border-top:1px solid #e5e5e5;padding-top:14px}
    .total-row{display:flex;justify-content:space-between;margin-bottom:7px;font-size:13px}
    .label{color:#888}
    .value{font-weight:600}
    .paid .value{color:#1D9E75}
    .remaining{border-top:1px solid #e5e5e5;padding-top:10px;margin-top:3px;font-size:14px}
    .remaining .value{color:#D85A30}
    .footer{margin-top:40px;text-align:center;font-size:11px;color:#bbb;border-top:1px solid #f0f0f0;padding-top:18px}
    @media print{body{padding:20px}}
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="invoice-title">Invoice</div>
      <div class="invoice-number">${invoiceNumber}</div>
    </div>
    <div>
      <div class="business-name">Sunny Mobiles</div>
      <div class="business-sub">Kacheri Bazar, Faisalabad</div>
    </div>
  </div>
  <div class="meta">
    <div>
      <div class="meta-label">Billed to</div>
      <div class="meta-value">${user.name}</div>
      <div class="meta-sub">${user.phoneNumber}</div>
    </div>
    <div style="text-align:right">
      <div class="meta-label">Date</div>
      <div class="meta-value">${dateStr}</div>
    </div>
  </div>
  <table>
    <thead>
      <tr><th>Product</th><th>Qty</th><th>Unit Cost</th><th>Total</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>${user.producttype}</td>
        <td style="text-align:right">${user.quantity}</td>
        <td style="text-align:right">₨${Number(user.unitCost).toLocaleString()}</td>
        <td style="text-align:right;font-weight:600">₨${Number(user.totalAmount).toLocaleString()}</td>
      </tr>
    </tbody>
  </table>
  <div class="totals">
    <div class="total-row"><span class="label">Grand total</span><span class="value">₨${Number(user.totalAmount).toLocaleString()}</span></div>
    <div class="total-row paid"><span class="label">Paid</span><span class="value">₨${Number(user.paidAmount).toLocaleString()}</span></div>
    <div class="total-row remaining"><span class="label">Remaining balance</span><span class="value">₨${Number(user.remainingAmount).toLocaleString()}</span></div>
  </div>
  <div class="footer">Thank you for your business!</div>
</body>
</html>`;

  const w = window.open('', '_blank', 'width=800,height=600');
  w.document.write(invoiceHTML);
  w.document.close();
  w.focus();
  w.print();
  w.onafterprint = () => w.close();
};

// ─── Mobile Customer Card (accordion) ────────────────────────────────────────
const CustomerCard = ({ user, onDelete, onPrint }) => {
  const [open, setOpen] = useState(false);
  const isPaid = Number(user.remainingAmount) === 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200">
      {/* Always-visible row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left focus:outline-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-sm leading-tight truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.phoneNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <div className="text-right">
            <p className="text-sm font-bold text-indigo-600">₨{Number(user.totalAmount).toLocaleString()}</p>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              {isPaid ? 'Paid' : `Due ₨${Number(user.remainingAmount).toLocaleString()}`}
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
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3 bg-gray-50/50">
          {/* Product + Qty row */}
          <div className="flex gap-2">
            <span className="flex-1 text-center px-2 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
              {user.producttype}
            </span>
            <span className="flex-1 text-center px-2 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
              Qty: {user.quantity}
            </span>
            <span className="flex-1 text-center px-2 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
              ₨{Number(user.unitCost).toLocaleString()}/unit
            </span>
          </div>

          {/* Amount breakdown */}
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
            <div className="flex justify-between items-center px-3 py-2">
              <span className="text-xs text-gray-500">Paid</span>
              <span className="text-sm font-semibold text-green-600">₨{Number(user.paidAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center px-3 py-2">
              <span className="text-xs text-gray-500">Remaining</span>
              <span className="text-sm font-semibold text-orange-500">₨{Number(user.remainingAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center px-3 py-2 bg-indigo-50/50 rounded-b-xl">
              <span className="text-xs font-medium text-gray-700">Grand Total</span>
              <span className="text-sm font-bold text-indigo-600">₨{Number(user.totalAmount).toLocaleString()}</span>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 text-right">
            {new Date(user.timestamp).toLocaleString('en-PK')}
          </p>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onPrint(user)}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 active:scale-95 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Invoice
            </button>
            <button
              onClick={() => onDelete(user.userId)}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 active:scale-95 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SummaryCard = ({ label, value, icon: Icon, colorClass, bgClass, borderClass, dark }) => (
  <div className={`rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 border hover:-translate-y-0.5 ${dark ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400' : `bg-white ${borderClass}`}`}>
    <div className="flex items-center justify-between">
      <div className="min-w-0 flex-1">
        <p className={`text-xs sm:text-sm font-medium mb-1 truncate ${dark ? 'text-indigo-100' : 'text-gray-500'}`}>{label}</p>
        <p className={`text-xl sm:text-2xl lg:text-3xl font-bold truncate ${dark ? 'text-white' : colorClass}`}>{value}</p>
      </div>
      <div className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ml-2 ${dark ? 'bg-white/20' : bgClass}`}>
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${dark ? 'text-white' : colorClass}`} />
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [usersList, setUsersList] = useState(mockUsers);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const users = useMemo(() => {
    if (!usersList) return [];
    return usersList.map((user, index) => ({
      serial: index + 1,
      userId: user.userId || 'N/A',
      name: user.name || 'N/A',
      producttype: user.producttype ?? 'N/A',
      phoneNumber: user.phoneNumber ?? 'N/A',
      unitCost: user.unitCost ?? 0,
      quantity: user.quantity ?? 0,
      paidAmount: user.paidAmount ?? 0,
      remainingAmount: user.remainingAmount ?? 0,
      totalAmount: user.totalAmount ?? 0,
      timestamp: user.timestamp || new Date().toISOString(),
    }));
  }, [usersList]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.producttype.toLowerCase().includes(term) ||
      u.phoneNumber.includes(term)
    );
  }, [users, searchTerm]);

  const summaryData = useMemo(() => {
    if (!users?.length) return null;
    return users.reduce((acc, u) => ({
      totalPaidAmount: acc.totalPaidAmount + (Number(u.paidAmount) || 0),
      totalRemainingAmount: acc.totalRemainingAmount + (Number(u.remainingAmount) || 0),
      grandTotal: acc.grandTotal + (Number(u.totalAmount) || 0),
      totalUsers: acc.totalUsers + 1
    }), { totalPaidAmount: 0, totalRemainingAmount: 0, grandTotal: 0, totalUsers: 0 });
  }, [users]);

  const nameWiseSummary = useMemo(() => {
    if (!users?.length) return [];
    const map = users.reduce((acc, u) => {
      if (!acc[u.name]) acc[u.name] = { totalPaidAmount: 0, totalRemainingAmount: 0, totalAmount: 0, transactions: 0 };
      acc[u.name].totalPaidAmount += Number(u.paidAmount) || 0;
      acc[u.name].totalRemainingAmount += Number(u.remainingAmount) || 0;
      acc[u.name].totalAmount += Number(u.totalAmount) || 0;
      acc[u.name].transactions += 1;
      return acc;
    }, {});
    return Object.entries(map).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [users]);

  const handleCreateUser = (userData) => {
    const totalAmount = Number(userData.quantity) * Number(userData.unitCost);
    const remainingAmount = totalAmount - Number(userData.paidAmount);
    setUsersList(prev => [...prev, {
      userId: String(prev.length + 1),
      name: userData.name,
      producttype: userData.producttype,
      phoneNumber: userData.phoneNumber,
      unitCost: Number(userData.unitCost),
      quantity: Number(userData.quantity),
      paidAmount: Number(userData.paidAmount),
      totalAmount,
      remainingAmount,
      timestamp: new Date().toISOString()
    }]);
    setIsModalOpen(false);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setUsersList(prev => prev.filter(u => u.userId !== userId));
    }
  };

  const handleExport = () => {
    const rows = [
      ['Name', 'Phone', 'Product', 'Qty', 'Unit Cost', 'Paid', 'Remaining', 'Total', 'Date'],
      ...users.map(u => [
        u.name, u.phoneNumber, u.producttype, u.quantity,
        u.unitCost, u.paidAmount, u.remainingAmount, u.totalAmount,
        new Date(u.timestamp).toLocaleDateString()
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: 'customers.csv'
    });
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Icon + Title */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-md flex-shrink-0">
                <User className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 truncate">Customer Management</h1>
                <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">Track and manage your customer transactions</p>
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
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all text-sm font-medium whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add Customer
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-xl bg-gray-50 border border-gray-200 flex-shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
          </div>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => { handleExport(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 py-2.5 bg-white text-green-600 rounded-xl border border-green-100 text-sm font-medium shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => { setIsModalOpen(true); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Customer
              </button>
            </div>
          )}
        </div>

        {/* ── Summary Cards ──────────────────────────────────────── */}
        {summaryData && (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <SummaryCard
              label="Total Customers" value={summaryData.totalUsers}
              icon={User} colorClass="text-blue-600" bgClass="bg-blue-50" borderClass="border-blue-100"
            />
            <SummaryCard
              label="Total Paid" value={`₨${summaryData.totalPaidAmount.toLocaleString()}`}
              icon={DollarSign} colorClass="text-green-600" bgClass="bg-green-50" borderClass="border-green-100"
            />
            <SummaryCard
              label="Remaining" value={`₨${summaryData.totalRemainingAmount.toLocaleString()}`}
              icon={CreditCard} colorClass="text-orange-500" bgClass="bg-orange-50" borderClass="border-orange-100"
            />
            <div className="col-span-2 xl:col-span-1">
              <SummaryCard
                label="Grand Total" value={`₨${summaryData.grandTotal.toLocaleString()}`}
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
              placeholder="Search by name, product or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm transition-all"
            />
          </div>
        </div>

        {/* ── Mobile: Accordion Cards (< lg) ───────────────────── */}
        <div className="block lg:hidden">
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <User className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm font-medium">No customers found</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredUsers.map(user => (
                <CustomerCard
                  key={user.userId}
                  user={user}
                  onDelete={handleDeleteUser}
                  onPrint={handlePrintInvoice}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Desktop: Table (≥ lg) ────────────────────────────── */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  {['Customer', 'Product', 'Phone', 'Qty', 'Paid', 'Remaining', 'Total', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <User className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No customers found</p>
                    </td>
                  </tr>
                ) : filteredUsers.map(user => (
                  <tr key={user.userId} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-400">{new Date(user.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium whitespace-nowrap">
                        {user.producttype}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{user.phoneNumber}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                        {user.quantity}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-green-600 whitespace-nowrap">
                      ₨{Number(user.paidAmount).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-orange-500 whitespace-nowrap">
                      ₨{Number(user.remainingAmount).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-indigo-600 whitespace-nowrap">
                      ₨{Number(user.totalAmount).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePrintInvoice(user)}
                          title="Print invoice"
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.userId)}
                          title="Delete"
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Customer Summary ───────────────────────────────────── */}
        {nameWiseSummary.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-base sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              Customer Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {nameWiseSummary.map((s) => (
                <div key={s.name} className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{s.name}</h3>
                    <span className="flex-shrink-0 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      {s.transactions} orders
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Paid', value: s.totalPaidAmount, color: 'text-green-600' },
                      { label: 'Remaining', value: s.totalRemainingAmount, color: 'text-orange-500' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-gray-500">{label}:</span>
                        <span className={`font-semibold ${color}`}>₨{value.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="font-medium text-gray-700">Total:</span>
                      <span className="font-bold text-indigo-600">₨{s.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CreateUsersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateUser}
      />
    </div>
  );
};

export default Users;