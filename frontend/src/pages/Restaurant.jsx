import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Search, Plus, XCircle, ArrowRight, ChefHat, Clock, CheckCircle, CreditCard, Trash2, Eye, Edit3, Users, Hash } from 'lucide-react';
import { CURRENCY_SYMBOLS } from '../utils/currencies';

const MENU_CATEGORIES = ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Snacks', 'Specials'];

const STATUS_STYLES = {
  'Preparing': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
  'Ready': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: CheckCircle },
  'Served': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
  'Paid': { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', icon: CreditCard },
};

const INITIAL_MENU_ITEM = { name: '', category: 'Main Course', price: '', description: '', isAvailable: true };
const INITIAL_ORDER = { tableNumber: '', items: [], specialInstructions: '', guestName: '' };

export default function Restaurant() {
  const [activeTab, setActiveTab] = useState('orders');
  const orderCounter = useRef(0);

  const [menu, setMenu] = useState(() => {
    try { const s = localStorage.getItem('helloStay_restaurantMenu'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });

  const [orders, setOrders] = useState(() => {
    try { const s = localStorage.getItem('helloStay_restaurantOrders'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });

  const [tables] = useState(() => {
    try {
      const hotel = JSON.parse(localStorage.getItem('helloStay_hotelData') || '{}');
      return Array.from({ length: hotel.totalTables || 10 }, (_, i) => ({ id: i + 1, number: i + 1 }));
    } catch { return Array.from({ length: 10 }, (_, i) => ({ id: i + 1, number: i + 1 })); }
  });

  const hotelData = useMemo(() => {
    try { const s = localStorage.getItem('helloStay_hotelData'); return s ? JSON.parse(s) : { currency: 'INR' }; }
    catch { return { currency: 'INR' }; }
  }, []);

  const currencySymbol = useMemo(() => CURRENCY_SYMBOLS[hotelData.currency] || '₹', [hotelData.currency]);

  const [menuModal, setMenuModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [menuForm, setMenuForm] = useState(INITIAL_MENU_ITEM);
  const [menuErrors, setMenuErrors] = useState({});

  const [orderModal, setOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState(INITIAL_ORDER);
  const [orderErrors, setOrderErrors] = useState({});

  const [viewOrder, setViewOrder] = useState(null);
  const [deletingMenuId, setDeletingMenuId] = useState(null);

  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState('All');

  // Menu handlers
  const handleMenuChange = (field, value) => {
    setMenuForm(prev => ({ ...prev, [field]: value }));
    if (menuErrors[field]) setMenuErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateMenu = () => {
    const errors = {};
    if (!menuForm.name.trim()) errors.name = 'Name is required';
    if (!menuForm.price || Number(menuForm.price) <= 0) errors.price = 'Valid price required';
    setMenuErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleMenuSubmit = () => {
    if (!validateMenu()) return;
    if (editingMenu) {
      setMenu(prev => prev.map(m => m.id === editingMenu.id ? { ...m, ...menuForm, price: Number(menuForm.price) } : m));
    } else {
      setMenu(prev => [...prev, { id: Date.now(), ...menuForm, price: Number(menuForm.price) }]);
    }
    const updatedMenu = editingMenu
      ? menu.map(m => m.id === editingMenu.id ? { ...m, ...menuForm, price: Number(menuForm.price) } : m)
      : [...menu, { id: Date.now(), ...menuForm, price: Number(menuForm.price) }];
    localStorage.setItem('helloStay_restaurantMenu', JSON.stringify(updatedMenu));
    setMenuModal(false);
    setEditingMenu(null);
    setMenuForm(INITIAL_MENU_ITEM);
  };

  const handleDeleteMenu = (id) => {
    const updated = menu.filter(m => m.id !== id);
    setMenu(updated);
    localStorage.setItem('helloStay_restaurantMenu', JSON.stringify(updated));
    setDeletingMenuId(null);
  };

  // Order handlers
  const addOrderItem = (menuItem) => {
    const existing = orderForm.items.find(i => i.menuItemId === menuItem.id);
    if (existing) {
      setOrderForm(prev => ({
        ...prev,
        items: prev.items.map(i => i.menuItemId === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i)
      }));
    } else {
      setOrderForm(prev => ({
        ...prev,
        items: [...prev.items, { menuItemId: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1 }]
      }));
    }
  };

  const updateOrderItemQty = (menuItemId, delta) => {
    setOrderForm(prev => ({
      ...prev,
      items: prev.items.map(i => i.menuItemId === menuItemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0)
    }));
  };

  const orderTotal = orderForm.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleOrderSubmit = () => {
    const errors = {};
    if (!orderForm.tableNumber) errors.tableNumber = 'Select a table';
    if (orderForm.items.length === 0) errors.items = 'Add at least one item';
    setOrderErrors(errors);
    if (Object.keys(errors).length > 0) return;

    orderCounter.current += 1;
    const newOrder = {
      id: `order-${orderForm.tableNumber}-${orderCounter.current}`,
      ...orderForm,
      total: orderTotal,
      status: 'Preparing',
      createdAt: new Date().toISOString(),
    };
    const updated = [...orders, newOrder];
    setOrders(updated);
    localStorage.setItem('helloStay_restaurantOrders', JSON.stringify(updated));
    setOrderModal(false);
    setOrderForm(INITIAL_ORDER);
    setOrderErrors({});
  };

  const handleOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    localStorage.setItem('helloStay_restaurantOrders', JSON.stringify(updated));
  };

  const filteredMenu = useMemo(() => {
    return menu.filter(m => {
      const matchSearch = !menuSearch || m.name.toLowerCase().includes(menuSearch.toLowerCase());
      const matchCategory = menuCategoryFilter === 'All' || m.category === menuCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [menu, menuSearch, menuCategoryFilter]);

  const stats = useMemo(() => ({
    totalOrders: orders.length,
    activeOrders: orders.filter(o => o.status !== 'Paid').length,
    todayRevenue: orders.filter(o => o.status === 'Paid').reduce((s, o) => s + (o.total || 0), 0),
    menuItems: menu.length,
  }), [orders, menu]);

  const tabs = [
    { id: 'orders', label: 'Orders', icon: ChefHat },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'tables', label: 'Tables', icon: Hash },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant</h1>
          <p className="text-sm text-gray-500 mt-1">Menu management, orders, and table tracking</p>
        </div>
        {activeTab === 'orders' && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setOrderForm(INITIAL_ORDER); setOrderErrors({}); setOrderModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2">
            <Plus className="w-5 h-5" /> New Order
          </motion.button>
        )}
        {activeTab === 'menu' && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setEditingMenu(null); setMenuForm(INITIAL_MENU_ITEM); setMenuErrors({}); setMenuModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Menu Item
          </motion.button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Orders', value: stats.activeOrders, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total Orders', value: stats.totalOrders, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Revenue', value: `${currencySymbol}${stats.todayRevenue.toLocaleString('en-IN')}`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Menu Items', value: stats.menuItems, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`${stat.bg} rounded-xl p-4 border border-gray-100`}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {orders.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-xl border border-gray-100">
              <ChefHat className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-500">No orders yet</p>
              <p className="mt-1 text-xs text-gray-400">Create your first order to get started</p>
            </div>
          ) : orders.filter(o => o.status !== 'Paid').length === 0 && orders.length > 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-xl border border-gray-100">
              <CheckCircle className="mx-auto h-12 w-12 text-emerald-300" />
              <p className="mt-3 text-sm font-medium text-gray-500">All orders completed!</p>
            </div>
          ) : (
            orders.filter(o => o.status !== 'Paid').map((order) => {
              return (
                <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                        <Hash className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Table {order.tableNumber}</h4>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[order.status]?.bg} ${STATUS_STYLES[order.status]?.text} ${STATUS_STYLES[order.status]?.border}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.quantity}× {item.name}</span>
                        <span className="font-medium text-gray-900">{currencySymbol}{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="font-bold text-gray-900">Total: {currencySymbol}{order.total?.toLocaleString('en-IN')}</span>
                    <div className="flex items-center gap-1">
                      {order.status === 'Preparing' && (
                        <button onClick={() => handleOrderStatus(order.id, 'Ready')}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">Mark Ready</button>
                      )}
                      {order.status === 'Ready' && (
                        <button onClick={() => handleOrderStatus(order.id, 'Served')}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors">Mark Served</button>
                      )}
                      {order.status === 'Served' && (
                        <button onClick={() => handleOrderStatus(order.id, 'Paid')}
                          className="text-xs font-semibold text-purple-600 hover:text-purple-800 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">Mark Paid</button>
                      )}
                      <button onClick={() => setViewOrder(order)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* Menu Tab */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search menu items..." value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50" />
              </div>
              <select value={menuCategoryFilter} onChange={(e) => setMenuCategoryFilter(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                <option value="All">All Categories</option>
                {MENU_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenu.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <UtensilsCrossed className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No menu items. Add your first dish!</p>
              </div>
            ) : filteredMenu.map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingMenu(item); setMenuForm({ name: item.name, category: item.category, price: item.price, description: item.description || '', isAvailable: item.isAvailable }); setMenuModal(true); }}
                      className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><Edit3 className="w-3.5 h-3.5" /></button>
                    {deletingMenuId === item.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleDeleteMenu(item.id)} className="text-xs font-semibold text-red-600 px-2 py-0.5 rounded bg-red-50">Yes</button>
                        <button onClick={() => setDeletingMenuId(null)} className="text-xs font-semibold text-gray-600 px-2 py-0.5 rounded bg-gray-100">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeletingMenuId(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                </div>
                {item.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">{currencySymbol}{item.price?.toLocaleString('en-IN')}</span>
                  <button onClick={() => addOrderItem(item)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add to Order
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tables Tab */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {tables.map(table => {
            const activeOrder = orders.find(o => Number(o.tableNumber) === table.number && o.status !== 'Paid');
            return (
              <motion.div key={table.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className={`rounded-xl p-5 border-2 text-center transition-all ${
                  activeOrder ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-200'
                }`}>
                <Users className={`mx-auto w-8 h-8 mb-2 ${activeOrder ? 'text-amber-600' : 'text-emerald-600'}`} />
                <h4 className="font-bold text-lg text-gray-900">Table {table.number}</h4>
                <p className={`text-xs font-medium mt-1 ${activeOrder ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {activeOrder ? `Order #${activeOrder.id.toString().slice(-4)}` : 'Available'}
                </p>
                {activeOrder && (
                  <p className="text-xs text-amber-600 mt-1">{currencySymbol}{activeOrder.total?.toLocaleString('en-IN')}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Menu Add/Edit Modal */}
      <AnimatePresence>
        {menuModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setMenuModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold">{editingMenu ? 'Edit Item' : 'Add Menu Item'}</h3>
                <button onClick={() => setMenuModal(false)} className="text-gray-400 hover:text-gray-600"><XCircle className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={menuForm.name} onChange={(e) => handleMenuChange('name', e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${menuErrors.name ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="Butter Chicken" />
                  {menuErrors.name && <p className="text-xs text-red-500 mt-1">{menuErrors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={menuForm.category} onChange={(e) => handleMenuChange('category', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm">
                      {MENU_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ({currencySymbol}) *</label>
                    <input type="number" min="0" value={menuForm.price} onChange={(e) => handleMenuChange('price', e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${menuErrors.price ? 'border-red-300' : 'border-gray-200'}`}
                      placeholder="250" />
                    {menuErrors.price && <p className="text-xs text-red-500 mt-1">{menuErrors.price}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows="2" value={menuForm.description} onChange={(e) => handleMenuChange('description', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                    placeholder="Description..." />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setMenuModal(false)} className="px-5 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-100 text-sm">Cancel</button>
                <button onClick={handleMenuSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm flex items-center gap-2">
                  {editingMenu ? 'Update' : 'Add'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Order Modal */}
      <AnimatePresence>
        {orderModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setOrderModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
                <h3 className="text-lg font-bold">New Order</h3>
                <button onClick={() => setOrderModal(false)} className="text-gray-400 hover:text-gray-600"><XCircle className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Table *</label>
                    <select value={orderForm.tableNumber} onChange={(e) => setOrderForm(prev => ({ ...prev, tableNumber: e.target.value }))}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${orderErrors.tableNumber ? 'border-red-300' : 'border-gray-200'}`}>
                      <option value="">Select table</option>
                      {tables.map(t => <option key={t.id} value={t.number}>Table {t.number}</option>)}
                    </select>
                    {orderErrors.tableNumber && <p className="text-xs text-red-500 mt-1">{orderErrors.tableNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                    <input type="text" value={orderForm.guestName} onChange={(e) => setOrderForm(prev => ({ ...prev, guestName: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      placeholder="Optional" />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Menu Items</h4>
                  {orderErrors.items && <p className="text-xs text-red-500 mb-2">{orderErrors.items}</p>}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {menu.filter(m => m.isAvailable).map(item => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{currencySymbol}{item.price}</p>
                        </div>
                        <button onClick={() => addOrderItem(item)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {orderForm.items.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-700 mb-2">Order Summary</h4>
                    {orderForm.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateOrderItemQty(item.menuItemId, -1)}
                            className="w-6 h-6 rounded bg-white text-red-600 hover:bg-red-100 text-xs font-bold flex items-center justify-center border border-red-200">-</button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateOrderItemQty(item.menuItemId, 1)}
                            className="w-6 h-6 rounded bg-white text-emerald-600 hover:bg-emerald-100 text-xs font-bold flex items-center justify-center border border-emerald-200">+</button>
                          <span className="text-sm text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold">{currencySymbol}{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 mt-2 border-t border-blue-200">
                      <span className="font-bold text-blue-800">Total</span>
                      <span className="font-bold text-blue-800">{currencySymbol}{orderTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                  <textarea rows="2" value={orderForm.specialInstructions}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                    placeholder="Allergies, preferences..." />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
                <button onClick={() => setOrderModal(false)} className="px-5 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-100 text-sm">Cancel</button>
                <button onClick={handleOrderSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm flex items-center gap-2">
                  Place Order <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Order Modal */}
      <AnimatePresence>
        {viewOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewOrder(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Order #{viewOrder.id.toString().slice(-4)}</h3>
                    <p className="text-amber-100 text-sm">Table {viewOrder.tableNumber}</p>
                  </div>
                  <button onClick={() => setViewOrder(null)} className="text-white/70 hover:text-white"><XCircle className="w-6 h-6" /></button>
                </div>
              </div>
              <div className="p-6 space-y-3">
                {viewOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-700">{item.quantity}× {item.name}</span>
                    <span className="text-sm font-semibold">{currencySymbol}{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">{currencySymbol}{viewOrder.total?.toLocaleString('en-IN')}</span>
                </div>
                {viewOrder.specialInstructions && (
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                    <p className="text-xs font-medium text-amber-600 uppercase mb-1">Special Instructions</p>
                    <p className="text-sm text-amber-800">{viewOrder.specialInstructions}</p>
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
