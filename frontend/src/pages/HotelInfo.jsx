import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hotel, CheckCircle2, Search, Globe, DollarSign, Edit2, Trash2, Clock, Phone, Mail, MapPin } from 'lucide-react';
import clsx from 'clsx';
import OwnerAuthModal from '../components/modals/OwnerAuthModal';

const COUNTRIES = [
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
  { code: 'TH', name: 'Thailand', currency: 'THB' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'IT', name: 'Italy', currency: 'EUR' },
  { code: 'ES', name: 'Spain', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR' },
  { code: 'BR', name: 'Brazil', currency: 'BRL' },
  { code: 'MX', name: 'Mexico', currency: 'MXN' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR' },
  { code: 'PH', name: 'Philippines', currency: 'PHP' },
  { code: 'LK', name: 'Sri Lanka', currency: 'LKR' },
  { code: 'NP', name: 'Nepal', currency: 'NPR' },
  { code: 'BD', name: 'Bangladesh', currency: 'BDT' },
  { code: 'CN', name: 'China', currency: 'CNY' },
  { code: 'KR', name: 'South Korea', currency: 'KRW' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD' },
];

const CURRENCY_OPTIONS = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
];

const FACILITIES_LIST = [
  "Free WiFi", "Swimming Pool", "In-house Restaurant", "Gym / Fitness Center",
  "Spa & Wellness", "Conference Room", "Free Parking", "Room Service",
  "Bar / Lounge", "Airport Shuttle", "Pet Friendly", "Business Center",
  "Laundry Service", "24/7 Front Desk", "Elevators", "Kids Play Area",
  "Banquet Hall", "EV Charging Station", "Valet Parking", "Wheelchair Accessible",
];

export default function HotelInfo() {
  // States: 'view', 'edit', 'add'
  const [viewState, setViewState] = useState('view');
  const [hotelData, setHotelData] = useState(null);
  
  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'edit' or 'delete'

  // Form State
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    hotelName: '',
    totalRooms: '',
    country: '',
    currency: '',
    phone: '',
    email: '',
    address: '',
    facilities: [],
    checkoutDuration: '24hr',
  });

  // Check if the current user is an Owner
  const isOwner = useMemo(() => {
    try {
      const session = JSON.parse(localStorage.getItem('helloStay_session') || '{}');
      return session.role === 'Owner';
    } catch { return false; }
  }, []);

  const loadHotelData = () => {
    const data = localStorage.getItem('helloStay_hotelData');
    if (data) {
      const parsed = JSON.parse(data);
      setHotelData(parsed);
      setViewState('view');
      setFormData({
        hotelName: parsed.hotelName || '',
        totalRooms: parsed.totalRooms || '',
        country: parsed.country || '',
        currency: parsed.currency || '',
        phone: parsed.phone || '',
        email: parsed.email || '',
        address: parsed.address || '',
        facilities: parsed.facilities || [],
        checkoutDuration: parsed.checkoutDuration || '24hr',
      });
    } else {
      setViewState('add');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadHotelData();
  }, []);

  const handleActionRequest = (action) => {
    setPendingAction(action);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    if (pendingAction === 'edit') {
      setViewState('edit');
    } else if (pendingAction === 'delete') {
      localStorage.removeItem('helloStay_hotelData');
      setHotelData(null);
      setViewState('add');
      setFormData({
        hotelName: '', totalRooms: '', country: '', currency: '', phone: '', email: '', address: '', facilities: [],
        checkoutDuration: '24hr',
      });
    }
  };

  // Form Handlers
  const toggleFacility = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleCountryChange = (countryCode) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    setFormData(prev => ({
      ...prev,
      country: countryCode,
      currency: country ? country.currency : prev.currency
    }));
  };

  const handleSaveHotel = () => {
    const dataToSave = {
      hotelName: formData.hotelName || 'My Awesome Hotel',
      totalRooms: formData.totalRooms || '50',
      country: formData.country,
      currency: formData.currency || 'INR',
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      facilities: formData.facilities,
      checkoutDuration: formData.checkoutDuration || '24hr',
    };

    localStorage.setItem('helloStay_hotelData', JSON.stringify(dataToSave));
    loadHotelData();
  };

  const filteredFacilities = useMemo(() => {
    return FACILITIES_LIST.filter(facility =>
      facility.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hotel Information</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your property details</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {viewState === 'view' && hotelData && (
          <>
            {/* Read Only View */}
            <div className="bg-indigo-600 p-8 text-white flex justify-between items-start">
              <div>
                <Hotel className="w-10 h-10 mb-3 text-indigo-200" />
                <h2 className="text-2xl font-bold">{hotelData.hotelName}</h2>
                <p className="text-indigo-100 mt-1 flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4" /> {COUNTRIES.find(c => c.code === hotelData.country)?.name || 'Unknown Country'}
                </p>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleActionRequest('edit')}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    title="Edit Hotel"
                  >
                    <Edit2 className="w-5 h-5 text-white" />
                  </button>
                  <button 
                    onClick={() => handleActionRequest('delete')}
                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                    title="Delete Hotel"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Total Rooms</p>
                  <p className="text-2xl font-bold text-gray-800">{hotelData.totalRooms}</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Primary Currency</p>
                  <p className="text-2xl font-bold text-gray-800">{hotelData.currency}</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Stay Duration</p>
                  <p className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    {hotelData.checkoutDuration === '12hr' ? '12 Hours' : '24 Hours'}
                  </p>
                </div>
              </div>

              <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1.5"><Phone className="w-4 h-4" /> Phone</p>
                  <p className="font-medium text-gray-800">{hotelData.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1.5"><Mail className="w-4 h-4" /> Email</p>
                  <p className="font-medium text-gray-800">{hotelData.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Address</p>
                  <p className="font-medium text-gray-800">{hotelData.address || 'Not provided'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Facilities</h3>
                <div className="flex flex-wrap gap-2">
                  {hotelData.facilities && hotelData.facilities.length > 0 ? (
                    hotelData.facilities.map(f => (
                      <span key={f} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg border border-indigo-100">
                        {f}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No facilities configured.</p>
                  )}
                </div>
              </div>

              {!isOwner && (
                <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-700">
                  Only accounts with the <span className="font-bold">Owner</span> role can edit or delete hotel information.
                </div>
              )}
            </div>
          </>
        )}

        {(viewState === 'edit' || viewState === 'add') && (
          <>
            {/* Form View */}
            <div className="bg-indigo-600 p-8 text-white relative">
              {viewState === 'edit' && (
                <button 
                  onClick={() => setViewState('view')}
                  className="absolute top-8 right-8 text-indigo-200 hover:text-white flex items-center text-sm font-medium"
                >
                  Cancel Editing
                </button>
              )}
              <Hotel className="w-10 h-10 mb-3 text-indigo-200" />
              <h2 className="text-2xl font-bold">{viewState === 'edit' ? 'Edit Hotel Profile' : 'Setup Hotel Profile'}</h2>
              <p className="text-indigo-100 mt-2">Configure your property details. This will customize your dashboard.</p>
            </div>

            <div className="p-8">
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                    <input
                      type="text"
                      value={formData.hotelName}
                      onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all"
                      placeholder="e.g. The Grand Plaza"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Number of Rooms</label>
                    <input
                      type="number"
                      value={formData.totalRooms}
                      onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all"
                      placeholder="e.g. 150"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-gray-400" />
                        Country
                      </div>
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="">Select country...</option>
                      {COUNTRIES.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        Currency
                      </div>
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="">Select currency...</option>
                      {CURRENCY_OPTIONS.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.symbol} - {currency.name} ({currency.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all"
                      placeholder="contact@hotel.com"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      rows="2"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all"
                      placeholder="Full property address..."
                    />
                  </div>
                </div>

                {/* Stay Duration */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Stay Duration</label>
                  <p className="text-xs text-gray-500 mb-3">Default duration for bookings. Can be overridden per booking.</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, checkoutDuration: '12hr' }))}
                      className={clsx(
                        "flex-1 py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all",
                        formData.checkoutDuration === '12hr'
                          ? "bg-indigo-50 border-indigo-400 text-indigo-700 shadow-sm"
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
                      onClick={() => setFormData(prev => ({ ...prev, checkoutDuration: '24hr' }))}
                      className={clsx(
                        "flex-1 py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all",
                        (formData.checkoutDuration || '24hr') === '24hr'
                          ? "bg-indigo-50 border-indigo-400 text-indigo-700 shadow-sm"
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

                {/* Facilities */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Available Facilities</label>
                      <p className="text-xs text-gray-500 mt-1">Select all the amenities your property offers.</p>
                    </div>
                    <div className="relative w-full sm:w-64">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all text-sm"
                        placeholder="Search facilities..."
                      />
                    </div>
                  </div>

                  {filteredFacilities.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                      <p className="text-gray-500 text-sm">No facilities match your search.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-72 overflow-y-auto custom-scrollbar p-1">
                      {filteredFacilities.map((facility) => {
                        const isSelected = formData.facilities.includes(facility);
                        return (
                          <button
                            key={facility}
                            onClick={() => toggleFacility(facility)}
                            className={clsx(
                              "flex items-center p-3 rounded-xl border transition-all text-sm font-medium text-left",
                              isSelected
                                ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                                : "bg-white border-gray-200 text-gray-600 hover:border-indigo-100 hover:bg-gray-50"
                            )}
                          >
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 mr-2 text-indigo-600 flex-shrink-0" />
                            ) : (
                              <div className="w-4 h-4 mr-2 border rounded-full flex-shrink-0" />
                            )}
                            <span className="truncate">{facility}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-8 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={handleSaveHotel}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center"
                  >
                    {viewState === 'add' ? 'Save Hotel Info' : 'Update Hotel Info'}
                    <CheckCircle2 className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

      </motion.div>

      <OwnerAuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
