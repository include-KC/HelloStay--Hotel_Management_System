import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Search, Plus, ChevronLeft, ChevronRight, Eye, Edit3, Trash2, XCircle, ArrowRight, AlertTriangle, TrendingDown, BarChart3 } from 'lucide-react';
import { CURRENCY_SYMBOLS } from '../utils/currencies';

const CATEGORIES = ['Housekeeping', 'Toiletries', 'Linens', 'Food & Beverage', 'Office Supplies', 'Cleaning', 'Electronics', 'Furniture', 'Maintenance', 'Other'];

const INITIAL_ITEM = {
  name: '',
  category: 'Housekeeping',
  quantity: '',
  unit: 'pieces',
  minStock: '',
  costPerUnit: '',
  supplier: '',
  location: '',
  notes: '',
};

const ITEMS_PER_PAGE = 8;

export default function Inventory() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('helloStay_inventory');
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
  const [stockFilter, setStockFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_ITEM);
  const [formErrors, setFormErrors] = useState({});

  const saveItems = (updated) => {
    setItems(updated);
    localStorage.setItem('helloStay_inventory', JSON.stringify(updated));
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Item name is required';
    if (!formData.quantity || Number(formData.quantity) < 0) errors.quantity = 'Valid quantity is required';
    if (!formData.costPerUnit || Number(formData.costPerUnit) <= 0) errors.costPerUnit = 'Valid cost is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const now = new Date().toISOString();
    if (editingItem) {
      const updated = items.map(i =>
        i.id === editingItem.id ? { ...i, ...formData, quantity: Number(formData.quantity), costPerUnit: Number(formData.costPerUnit), minStock: Number(formData.minStock) || 0, updatedAt: now } : i
      );
      saveItems(updated);
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        quantity: Number(formData.quantity),
        costPerUnit: Number(formData.costPerUnit),
        minStock: Number(formData.minStock) || 0,
        totalValue: Number(formData.quantity) * Number(formData.costPerUnit),
        createdAt: now,
        updatedAt: now,
      };
      saveItems([...items, newItem]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(INITIAL_ITEM);
    setFormErrors({});
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      minStock: item.minStock,
      costPerUnit: item.costPerUnit,
      supplier: item.supplier || '',
      location: item.location || '',
      notes: item.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (itemId) => {
    saveItems(items.filter(i => i.id !== itemId));
    setDeletingId(null);
    setViewItem(null);
  };

  const handleQuickStock = (itemId, delta) => {
    const updated = items.map(i => {
      if (i.id !== itemId) return i;
      const newQty = Math.max(0, i.quantity + delta);
      return { ...i, quantity: newQty, totalValue: newQty * i.costPerUnit, updatedAt: new Date().toISOString() };
    });
    saveItems(updated);
  };

  const getStockStatus = (item) => {
    if (item.quantity === 0) return { label: 'Out of Stock', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
    if (item.minStock && item.quantity <= item.minStock) return { label: 'Low Stock', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { label: 'In Stock', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  };

  const sortedItems = useMemo(() => {
    const sorted = [...items];
    sorted.sort((a, b) => {
      let aVal = a[sortConfig.key] || '';
      let bVal = b[sortConfig.key] || '';
      if (sortConfig.key === 'quantity' || sortConfig.key === 'costPerUnit') { aVal = Number(aVal) || 0; bVal = Number(bVal) || 0; }
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [items, sortConfig]);

  const filteredItems = useMemo(() => {
    return sortedItems.filter(i => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !searchQuery ||
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        (i.supplier && i.supplier.toLowerCase().includes(q));
      const matchCategory = categoryFilter === 'All' || i.category === categoryFilter;
      const status = getStockStatus(i);
      const matchStock = stockFilter === 'All' ||
        (stockFilter === 'Low' && status.label === 'Low Stock') ||
        (stockFilter === 'Out' && status.label === 'Out of Stock') ||
        (stockFilter === 'In' && status.label === 'In Stock');
      return matchSearch && matchCategory && matchStock;
    });
  }, [sortedItems, searchQuery, categoryFilter, stockFilter]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    total: items.length,
    totalValue: items.reduce((s, i) => s + (i.totalValue || i.quantity * i.costPerUnit || 0), 0),
    lowStock: items.filter(i => i.minStock && i.quantity <= i.minStock && i.quantity > 0).length,
    outOfStock: items.filter(i => i.quantity === 0).length,
  }), [items]);

  const handleSort = (key) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Stock tracking, reorder alerts, and supply management</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => { setEditingItem(null); setFormData(INITIAL_ITEM); setFormErrors({}); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Item
        </motion.button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50', icon: Package },
          { label: 'Stock Value', value: `${currencySymbol}${stats.totalValue.toLocaleString('en-IN')}`, color: 'text-purple-600', bg: 'bg-purple-50', icon: BarChart3 },
          { label: 'Low Stock', value: stats.lowStock, color: 'text-amber-600', bg: 'bg-amber-50', icon: AlertTriangle },
          { label: 'Out of Stock', value: stats.outOfStock, color: 'text-red-600', bg: 'bg-red-50', icon: TrendingDown },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`${stat.bg} rounded-xl p-4 border border-gray-100`}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search items..." value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50" />
          </div>
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={stockFilter} onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
            <option value="All">All Stock</option>
            <option value="In">In Stock</option>
            <option value="Low">Low Stock</option>
            <option value="Out">Out of Stock</option>
          </select>
        </div>
        <p className="text-sm text-gray-500 mt-2">{filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {[{ key: 'name', label: 'Item' }, { key: 'category', label: 'Category' }, { key: 'quantity', label: 'Qty' },
                  { key: 'costPerUnit', label: 'Cost/Unit' }, { key: 'totalValue', label: 'Value' }].map(col => (
                  <th key={col.key} onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none">
                    <span className="flex items-center gap-1">{col.label}<SortIcon columnKey={col.key} /></span>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {paginatedItems.length === 0 ? (
                  <tr><td colSpan="7" className="px-4 py-16 text-center">
                    <Package className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-3 text-sm font-medium text-gray-500">No inventory items</p>
                  </td></tr>
                ) : paginatedItems.map((item, index) => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <motion.tr key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                        {item.supplier && <p className="text-xs text-gray-500">{item.supplier}</p>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleQuickStock(item.id, -1)} className="w-6 h-6 rounded bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold flex items-center justify-center">-</button>
                          <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                          <button onClick={() => handleQuickStock(item.id, 1)} className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-bold flex items-center justify-center">+</button>
                          <span className="text-xs text-gray-400 ml-1">{item.unit}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{currencySymbol}{item.costPerUnit?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{currencySymbol}{(item.totalValue || item.quantity * item.costPerUnit)?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${stockStatus.bg} ${stockStatus.color} ${stockStatus.border}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {deletingId === item.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(item.id)} className="text-xs font-semibold text-red-600 px-2 py-1 rounded bg-red-50">Yes</button>
                            <button onClick={() => setDeletingId(null)} className="text-xs font-semibold text-gray-600 px-2 py-1 rounded bg-gray-100">No</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button onClick={() => setViewItem(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => handleEdit(item)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => setDeletingId(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                return <button key={page} onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${currentPage === page ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>{page}</button>;
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">{editingItem ? 'Edit Item' : 'Add Item'}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1"><XCircle className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => handleFormChange('name', e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.name ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="Towel set" />
                  {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={formData.category} onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select value={formData.unit} onChange={(e) => handleFormChange('unit', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm">
                      {['pieces', 'kg', 'liters', 'packs', 'boxes', 'rolls', 'bottles', 'sets'].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                    <input type="number" min="0" value={formData.quantity} onChange={(e) => handleFormChange('quantity', e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.quantity ? 'border-red-300' : 'border-gray-200'}`}
                      placeholder="100" />
                    {formErrors.quantity && <p className="text-xs text-red-500 mt-1">{formErrors.quantity}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock Alert</label>
                    <input type="number" min="0" value={formData.minStock} onChange={(e) => handleFormChange('minStock', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      placeholder="10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost per Unit ({currencySymbol}) *</label>
                    <input type="number" min="0" step="0.01" value={formData.costPerUnit} onChange={(e) => handleFormChange('costPerUnit', e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.costPerUnit ? 'border-red-300' : 'border-gray-200'}`}
                      placeholder="50" />
                    {formErrors.costPerUnit && <p className="text-xs text-red-500 mt-1">{formErrors.costPerUnit}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <input type="text" value={formData.supplier} onChange={(e) => handleFormChange('supplier', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      placeholder="Supplier name" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                    <input type="text" value={formData.location} onChange={(e) => handleFormChange('location', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      placeholder="Store room A" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea rows="2" value={formData.notes} onChange={(e) => handleFormChange('notes', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      placeholder="Additional notes..." />
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm">Cancel</button>
                <button onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-200 text-sm flex items-center gap-2">
                  {editingItem ? 'Update' : 'Add Item'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewItem(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{viewItem.name}</h3>
                    <p className="text-blue-100 text-sm">{viewItem.category}</p>
                  </div>
                  <button onClick={() => setViewItem(null)} className="text-white/70 hover:text-white p-1"><XCircle className="w-6 h-6" /></button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-xs text-gray-500 uppercase">Quantity</p><p className="font-semibold">{viewItem.quantity} {viewItem.unit}</p></div>
                  <div><p className="text-xs text-gray-500 uppercase">Status</p>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStockStatus(viewItem).bg} ${getStockStatus(viewItem).color} ${getStockStatus(viewItem).border}`}>
                      {getStockStatus(viewItem).label}
                    </span>
                  </div>
                  <div><p className="text-xs text-gray-500 uppercase">Cost/Unit</p><p className="font-semibold">{currencySymbol}{viewItem.costPerUnit?.toLocaleString('en-IN')}</p></div>
                  <div><p className="text-xs text-gray-500 uppercase">Total Value</p><p className="font-bold text-blue-600">{currencySymbol}{(viewItem.totalValue || viewItem.quantity * viewItem.costPerUnit)?.toLocaleString('en-IN')}</p></div>
                  <div><p className="text-xs text-gray-500 uppercase">Min Stock</p><p className="font-semibold">{viewItem.minStock || '—'}</p></div>
                  <div><p className="text-xs text-gray-500 uppercase">Supplier</p><p className="font-semibold">{viewItem.supplier || '—'}</p></div>
                  <div><p className="text-xs text-gray-500 uppercase">Location</p><p className="font-semibold">{viewItem.location || '—'}</p></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
