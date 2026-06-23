import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Search, Plus, ChevronLeft, ChevronRight, Eye, Edit3, Trash2, XCircle, ArrowRight, PieChart } from 'lucide-react';
import { CURRENCY_SYMBOLS } from '../utils/currencies';

const EXPENSE_CATEGORIES = [
  'Utilities', 'Maintenance', 'Supplies', 'Staff', 'Marketing', 'Insurance',
  'Cleaning', 'Food & Beverage', 'Technology', 'Legal', 'Travel', 'Miscellaneous'
];

const CATEGORY_COLORS = {
  'Utilities': 'bg-blue-500', 'Maintenance': 'bg-amber-500', 'Supplies': 'bg-emerald-500',
  'Staff': 'bg-purple-500', 'Marketing': 'bg-pink-500', 'Insurance': 'bg-indigo-500',
  'Cleaning': 'bg-teal-500', 'Food & Beverage': 'bg-orange-500', 'Technology': 'bg-cyan-500',
  'Legal': 'bg-gray-500', 'Travel': 'bg-rose-500', 'Miscellaneous': 'bg-gray-400',
};

const INITIAL_EXPENSE = {
  title: '',
  amount: '',
  category: 'Utilities',
  date: new Date().toISOString().split('T')[0],
  paymentMethod: 'Cash',
  description: '',
  receiptNumber: '',
};

const ITEMS_PER_PAGE = 8;

export default function Expenses() {
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('helloStay_expenses');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const hotelData = useMemo(() => {
    try {
      const saved = localStorage.getItem('helloStay_hotelData');
      return saved ? JSON.parse(saved) : { currency: 'INR' };
    } catch { return { currency: 'INR' }; }
  }, []);

  const currencySymbol = useMemo(() => CURRENCY_SYMBOLS[hotelData.currency] || '₹', [hotelData.currency]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewExpense, setViewExpense] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_EXPENSE);
  const [formErrors, setFormErrors] = useState({});

  const saveExpenses = (updated) => {
    setExpenses(updated);
    localStorage.setItem('helloStay_expenses', JSON.stringify(updated));
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.amount || Number(formData.amount) <= 0) errors.amount = 'Valid amount is required';
    if (!formData.date) errors.date = 'Date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const now = new Date().toISOString();
    if (editingExpense) {
      const updated = expenses.map(e =>
        e.id === editingExpense.id ? { ...e, ...formData, amount: Number(formData.amount), updatedAt: now } : e
      );
      saveExpenses(updated);
    } else {
      const newExpense = {
        id: Date.now(),
        ...formData,
        amount: Number(formData.amount),
        createdAt: now,
      };
      saveExpenses([...expenses, newExpense]);
    }
    setIsModalOpen(false);
    setEditingExpense(null);
    setFormData(INITIAL_EXPENSE);
    setFormErrors({});
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      paymentMethod: expense.paymentMethod,
      description: expense.description || '',
      receiptNumber: expense.receiptNumber || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (expenseId) => {
    saveExpenses(expenses.filter(e => e.id !== expenseId));
    setDeletingId(null);
    setViewExpense(null);
  };

  const sortedExpenses = useMemo(() => {
    const sorted = [...expenses];
    sorted.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (sortConfig.key === 'amount') { aVal = Number(aVal) || 0; bVal = Number(bVal) || 0; }
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [expenses, sortConfig]);

  const filteredExpenses = useMemo(() => {
    return sortedExpenses.filter(e => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !searchQuery ||
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q));
      const matchCategory = categoryFilter === 'All' || e.category === categoryFilter;
      const matchDate = (!dateRange.start || e.date >= dateRange.start) &&
        (!dateRange.end || e.date <= dateRange.end);
      return matchSearch && matchCategory && matchDate;
    });
  }, [sortedExpenses, searchQuery, categoryFilter, dateRange]);

  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const thisYear = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === now.getFullYear();
    });
    return {
      total: expenses.reduce((s, e) => s + (e.amount || 0), 0),
      thisMonth: thisMonth.reduce((s, e) => s + (e.amount || 0), 0),
      thisYear: thisYear.reduce((s, e) => s + (e.amount || 0), 0),
      count: expenses.length,
    };
  }, [expenses]);

  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    filteredExpenses.forEach(e => {
      breakdown[e.category] = (breakdown[e.category] || 0) + (e.amount || 0);
    });
    return Object.entries(breakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [filteredExpenses]);

  const maxCategoryAmount = useMemo(() => {
    return Math.max(...categoryBreakdown.map(([, amount]) => amount), 1);
  }, [categoryBreakdown]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const SortIcon = ({ columnKey }) => {
    const isActive = sortConfig.key === columnKey;
    return (
      <span className={`ml-1 inline-flex flex-col ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
        <ChevronRight className={`w-3 h-3 -mb-1 rotate-[-90deg] ${isActive && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-300'}`} />
        <ChevronRight className={`w-3 h-3 rotate-90 ${isActive && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-300'}`} />
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage all hotel expenses</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setEditingExpense(null); setFormData(INITIAL_EXPENSE); setFormErrors({}); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Expenses', value: `${currencySymbol}${stats.total.toLocaleString('en-IN')}`, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'This Month', value: `${currencySymbol}${stats.thisMonth.toLocaleString('en-IN')}`, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'This Year', value: `${currencySymbol}${stats.thisYear.toLocaleString('en-IN')}`, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Entries', value: stats.count, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`${stat.bg} rounded-xl p-4 border border-gray-100`}
          >
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4" /> Category Breakdown
          </h3>
          <div className="space-y-3">
            {categoryBreakdown.map(([category, amount]) => (
              <div key={category} className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-600 w-28 truncate">{category}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(amount / maxCategoryAmount) * 100}%` }}
                    className={`h-full ${CATEGORY_COLORS[category] || 'bg-gray-400'} rounded-full`}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-900 w-24 text-right">{currencySymbol}{amount.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
          >
            <option value="All">All Categories</option>
            {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="From"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="To"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">{filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} • Total: {currencySymbol}{filteredExpenses.reduce((s, e) => s + (e.amount || 0), 0).toLocaleString('en-IN')}</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {[
                  { key: 'title', label: 'Expense' },
                  { key: 'category', label: 'Category' },
                  { key: 'amount', label: 'Amount' },
                  { key: 'date', label: 'Date' },
                  { key: 'paymentMethod', label: 'Payment' },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                  >
                    <span className="flex items-center gap-1">{col.label}<SortIcon columnKey={col.key} /></span>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {paginatedExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-16 text-center">
                      <Wallet className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-3 text-sm font-medium text-gray-500">No expenses recorded</p>
                    </td>
                  </tr>
                ) : (
                  paginatedExpenses.map((expense, index) => (
                    <motion.tr
                      key={expense.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">{expense.title}</p>
                        {expense.receiptNumber && <p className="text-xs text-gray-500">Receipt: {expense.receiptNumber}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                          <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[expense.category] || 'bg-gray-400'}`} />
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-red-600">
                        {currencySymbol}{expense.amount?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{expense.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{expense.paymentMethod}</td>
                      <td className="px-4 py-3">
                        {deletingId === expense.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(expense.id)} className="text-xs font-semibold text-red-600 px-2 py-1 rounded bg-red-50">Yes</button>
                            <button onClick={() => setDeletingId(null)} className="text-xs font-semibold text-gray-600 px-2 py-1 rounded bg-gray-100">No</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button onClick={() => setViewExpense(expense)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => handleEdit(expense)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => setDeletingId(expense.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredExpenses.length)} of {filteredExpenses.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) page = i + 1;
                else if (currentPage <= 3) page = i + 1;
                else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                else page = currentPage - 2 + i;
                return (
                  <button key={page} onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${currentPage === page ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
                    {page}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">{editingExpense ? 'Edit Expense' : 'Add Expense'}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1"><XCircle className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => handleFormChange('title', e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.title ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="Electricity bill" />
                  {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount ({currencySymbol}) *</label>
                    <input type="number" min="0" value={formData.amount} onChange={(e) => handleFormChange('amount', e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.amount ? 'border-red-300' : 'border-gray-200'}`}
                      placeholder="5000" />
                    {formErrors.amount && <p className="text-xs text-red-500 mt-1">{formErrors.amount}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={formData.category} onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm">
                      {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input type="date" value={formData.date} onChange={(e) => handleFormChange('date', e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.date ? 'border-red-300' : 'border-gray-200'}`} />
                    {formErrors.date && <p className="text-xs text-red-500 mt-1">{formErrors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select value={formData.paymentMethod} onChange={(e) => handleFormChange('paymentMethod', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm">
                      {['Cash', 'Card', 'Bank Transfer', 'UPI', 'Cheque'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number</label>
                    <input type="text" value={formData.receiptNumber} onChange={(e) => handleFormChange('receiptNumber', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      placeholder="Optional" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows="2" value={formData.description} onChange={(e) => handleFormChange('description', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      placeholder="Additional notes..." />
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm">Cancel</button>
                <button onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-200 text-sm flex items-center gap-2">
                  {editingExpense ? 'Update' : 'Add Expense'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewExpense && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setViewExpense(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{viewExpense.title}</h3>
                    <p className="text-red-100 text-sm">{viewExpense.category}</p>
                  </div>
                  <button onClick={() => setViewExpense(null)} className="text-white/70 hover:text-white p-1"><XCircle className="w-6 h-6" /></button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{currencySymbol}{viewExpense.amount?.toLocaleString('en-IN')}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-xs text-gray-500 uppercase">Date</p><p className="font-semibold">{viewExpense.date}</p></div>
                  <div><p className="text-xs text-gray-500 uppercase">Payment</p><p className="font-semibold">{viewExpense.paymentMethod}</p></div>
                  {viewExpense.receiptNumber && <div><p className="text-xs text-gray-500 uppercase">Receipt</p><p className="font-semibold">{viewExpense.receiptNumber}</p></div>}
                </div>
                {viewExpense.description && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase mb-1">Description</p>
                    <p className="text-sm text-gray-700">{viewExpense.description}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
