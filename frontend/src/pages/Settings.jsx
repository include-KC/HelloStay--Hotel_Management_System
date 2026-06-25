import { useState } from 'react';
import { Settings as SettingsIcon, Database, Bell, Palette, Download, Upload, Trash2, AlertTriangle } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('system');



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
