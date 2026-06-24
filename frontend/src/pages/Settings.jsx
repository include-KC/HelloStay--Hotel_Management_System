import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, Building, Database, Bell, Palette, Download, Upload, Trash2, AlertTriangle, Clock, Search, CheckCircle2 } from 'lucide-react';
import { CURRENCY_SYMBOLS } from '../utils/currencies';
import clsx from 'clsx';

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'UAE', 'Saudi Arabia', 'Singapore', 'Thailand', 'Malaysia', 'Australia', 'Canada', 'Germany', 'France', 'Japan', 'South Korea', 'Other'];

const CHECKOUT_TIMES = [
  { time: '10:00', label: '10:00 AM', description: 'Early / Budget (Common in India)' },
  { time: '10:30', label: '10:30 AM', description: 'Early checkout' },
  { time: '11:00', label: '11:00 AM', description: 'Industry Standard (Most Common Worldwide)' },
  { time: '11:30', label: '11:30 AM', description: 'Slightly extended standard' },
  { time: '12:00', label: '12:00 PM', description: 'Noon Standard (Hilton, IHG)' },
  { time: '12:30', label: '12:30 PM', description: 'Mid-day checkout' },
  { time: '13:00', label: '1:00 PM', description: 'Late Standard (Boutique Hotels)' },
  { time: '14:00', label: '2:00 PM', description: 'Extended (Luxury Properties)' },
  { time: 'custom', label: 'Custom Time', description: 'Set your own checkout time' },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('hotel');

  const [hotelData, setHotelData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('helloStay_hotelData') || '{}'); }
    catch { return {}; }
  });

  const [saved, setSaved] = useState(false);
  const [checkoutSearch, setCheckoutSearch] = useState('');
  const [showCheckoutDropdown, setShowCheckoutDropdown] = useState(false);

  const filteredCheckoutTimes = useMemo(() => {
    if (!checkoutSearch.trim()) return CHECKOUT_TIMES;
    const q = checkoutSearch.toLowerCase();
    return CHECKOUT_TIMES.filter(ct =>
      ct.label.toLowerCase().includes(q) ||
      ct.description.toLowerCase().includes(q)
    );
  }, [checkoutSearch]);

  const effectiveCheckoutTime = hotelData.checkoutTime || '11:00';
  const effectiveCheckoutLabel = hotelData.checkoutTimeLabel || '11:00 AM';
  const effectiveCustomTime = hotelData.customCheckoutTime || '';

  const handleSave = () => {
    localStorage.setItem('helloStay_hotelData', JSON.stringify(hotelData));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportData = () => {
    const data = {
      hotelData: JSON.parse(localStorage.getItem('helloStay_hotelData') || '{}'),
      rooms: JSON.parse(localStorage.getItem('helloStay_rooms') || '[]'),
      bookings: JSON.parse(localStorage.getItem('helloStay_bookings') || '[]'),
      guests: JSON.parse(localStorage.getItem('helloStay_guests') || '[]'),
      employees: JSON.parse(localStorage.getItem('helloStay_employees') || '[]'),
      expenses: JSON.parse(localStorage.getItem('helloStay_expenses') || '[]'),
      inventory: JSON.parse(localStorage.getItem('helloStay_inventory') || '[]'),
      facilityBookings: JSON.parse(localStorage.getItem('helloStay_facilityBookings') || '[]'),
      facilityCharges: JSON.parse(localStorage.getItem('helloStay_facilityCharges') || '{}'),
      restaurantMenu: JSON.parse(localStorage.getItem('helloStay_restaurantMenu') || '[]'),
      restaurantOrders: JSON.parse(localStorage.getItem('helloStay_restaurantOrders') || '[]'),
      attendance: JSON.parse(localStorage.getItem('helloStay_attendance') || '[]'),
      payslips: JSON.parse(localStorage.getItem('helloStay_payslips') || '[]'),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `helloStay_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure? This will delete ALL data including rooms, bookings, guests, and settings. This cannot be undone.')) {
      const keys = [
        'helloStay_hotelData', 'helloStay_rooms', 'helloStay_bookings', 'helloStay_guests',
        'helloStay_employees', 'helloStay_expenses', 'helloStay_inventory', 'helloStay_facilityBookings',
        'helloStay_facilityCharges', 'helloStay_restaurantMenu', 'helloStay_restaurantOrders',
        'helloStay_attendance', 'helloStay_payslips', 'helloStay_userRole'
      ];
      keys.forEach(k => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'hotel', label: 'Hotel Profile', icon: Building },
    { id: 'system', label: 'System', icon: SettingsIcon },
    { id: 'backup', label: 'Backup & Data', icon: Database },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Hotel profile, system configuration, and data management</p>
        </div>
        {saved && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border border-emerald-200">
            <Save className="w-4 h-4" /> Saved successfully!
          </motion.div>
        )}
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

      {/* Hotel Profile */}
      {activeTab === 'hotel' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" /> Hotel Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
              <input type="text" value={hotelData.hotelName || ''} onChange={(e) => setHotelData(prev => ({ ...prev, hotelName: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Rooms</label>
              <input type="number" min="1" value={hotelData.totalRooms || ''} onChange={(e) => setHotelData(prev => ({ ...prev, totalRooms: Number(e.target.value) }))}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select value={hotelData.country || ''} onChange={(e) => setHotelData(prev => ({ ...prev, country: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm appearance-none">
                <option value="">Select country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select value={hotelData.currency || 'INR'} onChange={(e) => setHotelData(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm appearance-none">
                {Object.entries(CURRENCY_SYMBOLS).map(([code, symbol]) => (
                  <option key={code} value={code}>{symbol} {code}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={hotelData.phone || ''} onChange={(e) => setHotelData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                placeholder="+91 XXXXX XXXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={hotelData.email || ''} onChange={(e) => setHotelData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                placeholder="hotel@example.com" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea rows="2" value={hotelData.address || ''} onChange={(e) => setHotelData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                placeholder="Full address..." />
            </div>
          </div>

          {/* Checkout Time Settings */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600" /> Checkout Configuration
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standard Checkout Time</label>
                <div className="relative">
                  <div
                    onClick={() => setShowCheckoutDropdown(!showCheckoutDropdown)}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm cursor-pointer hover:border-blue-200 transition-all flex items-center justify-between"
                  >
                    <span className="text-gray-800">
                      {effectiveCheckoutTime === 'custom'
                        ? (effectiveCustomTime || 'Select custom time...')
                        : effectiveCheckoutLabel}
                    </span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showCheckoutDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {showCheckoutDropdown && (
                    <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                      <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={checkoutSearch}
                            onChange={(e) => setCheckoutSearch(e.target.value)}
                            className="pl-9 w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search checkout times..."
                          />
                        </div>
                      </div>
                      <div className="max-h-56 overflow-y-auto">
                        {filteredCheckoutTimes.map((ct) => (
                          <button
                            key={ct.time}
                            type="button"
                            onClick={() => {
                              setHotelData(prev => ({
                                ...prev,
                                checkoutTime: ct.time,
                                checkoutTimeLabel: ct.label,
                              }));
                              setShowCheckoutDropdown(false);
                              setCheckoutSearch('');
                            }}
                            className={clsx(
                              "w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0",
                              effectiveCheckoutTime === ct.time && "bg-blue-50"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{ct.label}</p>
                                <p className="text-xs text-gray-500">{ct.description}</p>
                              </div>
                              {effectiveCheckoutTime === ct.time && (
                                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {effectiveCheckoutTime === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Checkout Time</label>
                  <input
                    type="time"
                    value={effectiveCustomTime}
                    onChange={(e) => setHotelData(prev => ({ ...prev, customCheckoutTime: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                  />
                </div>
              )}

              {/* Late Checkout Fee */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Charge for late checkout</p>
                    <p className="text-xs text-gray-500">Apply extra charges when guests stay past the standard checkout time</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHotelData(prev => ({ ...prev, chargeForLateCheckout: !prev.chargeForLateCheckout }))}
                    className={clsx(
                      "relative w-11 h-6 rounded-full transition-colors",
                      hotelData.chargeForLateCheckout ? "bg-blue-600" : "bg-gray-300"
                    )}
                  >
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform"
                      style={{ transform: hotelData.chargeForLateCheckout ? 'translateX(22px)' : 'translateX(2px)' }} />
                  </button>
                </div>

                {hotelData.chargeForLateCheckout && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Fee Type</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setHotelData(prev => ({ ...prev, lateCheckoutFeeType: 'flat' }))}
                          className={clsx(
                            "flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all",
                            (hotelData.lateCheckoutFeeType || 'flat') === 'flat'
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          Flat Fee
                        </button>
                        <button
                          type="button"
                          onClick={() => setHotelData(prev => ({ ...prev, lateCheckoutFeeType: 'hourly' }))}
                          className={clsx(
                            "flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all",
                            hotelData.lateCheckoutFeeType === 'hourly'
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          Per Hour
                        </button>
                        <button
                          type="button"
                          onClick={() => setHotelData(prev => ({ ...prev, lateCheckoutFeeType: 'room_rate' }))}
                          className={clsx(
                            "flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all",
                            hotelData.lateCheckoutFeeType === 'room_rate'
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          Room Rate
                        </button>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Fee Amount {hotelData.lateCheckoutFeeType === 'hourly' ? '(per hour)' : hotelData.lateCheckoutFeeType === 'room_rate' ? '(uses room rate)' : ''}
                      </label>
                      {hotelData.lateCheckoutFeeType === 'room_rate' ? (
                        <div className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 italic">
                          Will charge the room's nightly rate at checkout
                        </div>
                      ) : (
                        <input
                          type="number"
                          min="0"
                          value={hotelData.lateCheckoutFee || ''}
                          onChange={(e) => setHotelData(prev => ({ ...prev, lateCheckoutFee: Number(e.target.value) }))}
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          placeholder="0"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Checkout Window */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-1">Recently Checked Out (days)</label>
                <p className="text-xs text-gray-500 mb-2">Number of days to show in "Recently Checked Out" bookings card</p>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={hotelData.recentCheckoutDays || 7}
                  onChange={(e) => setHotelData(prev => ({ ...prev, recentCheckoutDays: Number(e.target.value) || 7 }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                />
              </div>

              {/* Checkout Duration */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-1">Checkout Duration</label>
                <p className="text-xs text-gray-500 mb-3">Default duration for bookings. Can be overridden per booking.</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setHotelData(prev => ({ ...prev, checkoutDuration: '12hr' }))}
                    className={clsx(
                      "flex-1 py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all",
                      (hotelData.checkoutDuration || '24hr') === '12hr'
                        ? "bg-blue-50 border-blue-400 text-blue-700 shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    <div className="text-center">
                      <div className="font-bold">12 Hours</div>
                      <div className="text-[10px] opacity-70 mt-0.5">Half-day stay</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHotelData(prev => ({ ...prev, checkoutDuration: '24hr' }))}
                    className={clsx(
                      "flex-1 py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all",
                      (hotelData.checkoutDuration || '24hr') === '24hr'
                        ? "bg-blue-50 border-blue-400 text-blue-700 shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    <div className="text-center">
                      <div className="font-bold">24 Hours</div>
                      <div className="text-[10px] opacity-70 mt-0.5">Full-day stay</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2 text-sm">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      )}

      {/* System Settings */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-purple-600" /> Appearance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm appearance-none" disabled>
                  <option>Light</option>
                  <option>Dark (Coming Soon)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm appearance-none" disabled>
                  <option>English</option>
                  <option>Hindi (Coming Soon)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-amber-600" /> Notifications
            </h3>
            <div className="space-y-3">
              {['Low inventory alerts', 'New booking notifications', 'Payment reminders', 'Staff attendance alerts'].map((item) => (
                <label key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-700">{item}</span>
                  <div className="w-10 h-6 bg-gray-300 rounded-full relative cursor-not-allowed">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm" />
                  </div>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Notification settings will be available in a future update.</p>
          </div>
        </div>
      )}

      {/* Backup & Data */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Download className="w-5 h-5 text-blue-600" /> Export Data
            </h3>
            <p className="text-sm text-gray-500 mb-4">Download all your hotel data as a JSON backup file.</p>
            <button onClick={handleExportData}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" /> Export All Data
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-emerald-600" /> Import Data
            </h3>
            <p className="text-sm text-gray-500 mb-4">Restore data from a previously exported backup file.</p>
            <label className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-emerald-200 text-sm cursor-pointer">
              <Upload className="w-4 h-4" /> Import Backup
              <input type="file" accept=".json" className="hidden" onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  try {
                    const data = JSON.parse(ev.target.result);
                    Object.entries(data).forEach(([key, value]) => {
                      if (key !== 'exportDate') localStorage.setItem(`helloStay_${key.replace('helloStay_', '')}`, JSON.stringify(value));
                    });
                    window.location.reload();
                  } catch { alert('Invalid backup file'); }
                };
                reader.readAsText(file);
              }} />
            </label>
          </div>

          <div className="bg-red-50 rounded-xl border border-red-200 p-6">
            <h3 className="text-lg font-bold text-red-800 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5" /> Danger Zone
            </h3>
            <p className="text-sm text-red-600 mb-4">Permanently delete all data. This action cannot be undone.</p>
            <button onClick={handleClearAllData}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 text-sm">
              <Trash2 className="w-4 h-4" /> Clear All Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
