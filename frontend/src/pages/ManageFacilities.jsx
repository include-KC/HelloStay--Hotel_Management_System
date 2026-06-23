import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Plus, X,
  Settings, DollarSign, Trash2, Eye
} from 'lucide-react';
import clsx from 'clsx';

const CURRENCY_SYMBOLS = {
  INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ', THB: '฿',
  JPY: '¥', SGD: 'S$', AUD: 'A$', CAD: 'C$', CHF: 'Fr',
  CNY: '¥', BRL: 'R$', ZAR: 'R', MYR: 'RM', IDR: 'Rp',
  PHP: '₱', SEK: 'kr', NOK: 'kr', DKK: 'kr', KRW: '₩',
  TRY: '₺', RUB: '₽', SAR: '﷼', EGP: 'E£', NGN: '₦', VND: '₫',
};

const PAYMENT_OPTIONS = [
  { value: 'clubbed', label: 'Club to Final Bill', description: 'Add charges to room bill at checkout' },
  { value: 'paid_before', label: 'Paid Before', description: 'Guest pays before using the service' },
  { value: 'paid_after', label: 'Paid After', description: 'Guest pays after using the service' },
  { value: 'free', label: 'Complimentary', description: 'No charge for this service' },
];

const CHARGES_SCOPE = [
  { value: 'all', label: 'All Guests', description: 'Same charge for every guest' },
  { value: 'room_type', label: 'By Room Type', description: 'Different charges based on room type' },
  { value: 'room_number', label: 'By Room Number', description: 'Specific charges for specific rooms' },
  { value: 'free_all', label: 'Free for All', description: 'No charges for any guest' },
];

const INITIAL_BOOKING = {
  facilityName: '',
  guestName: '',
  roomNumber: '',
  date: '',
  time: '',
  guests: '1',
  paymentType: 'clubbed',
  notes: '',
};

const INITIAL_CHARGES = {
  scope: 'all',
  defaultCharge: '',
  roomTypeCharges: [],
  roomNumberCharges: [],
};

export default function ManageFacilities() {
  const hotelData = useMemo(() => {
    const saved = localStorage.getItem('helloStay_hotelData');
    return saved ? JSON.parse(saved) : {};
  }, []);

  const rooms = useMemo(() => {
    const saved = localStorage.getItem('helloStay_rooms');
    return saved ? JSON.parse(saved) : [];
  }, []);

  const currencySymbol = CURRENCY_SYMBOLS[hotelData.currency] || '₹';

  const hotelFacilities = useMemo(() => {
    const facilities = hotelData.facilities || [];
    return facilities.filter(f =>
      f !== 'Free WiFi' && f !== '24/7 Front Desk' && f !== 'Elevators' &&
      f !== 'Daily Housekeeping' && f !== 'Wake-up Service' && f !== 'Wheelchair Accessible'
    );
  }, [hotelData.facilities]);

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('helloStay_facilityBookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [charges, setCharges] = useState(() => {
    const saved = localStorage.getItem('helloStay_facilityCharges');
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showChargesModal, setShowChargesModal] = useState(false);
  const [bookingForm, setBookingForm] = useState(INITIAL_BOOKING);
  const [chargesForm, setChargesForm] = useState(INITIAL_CHARGES);
  const [viewBooking, setViewBooking] = useState(null);

  const saveBookings = (updated) => {
    setBookings(updated);
    localStorage.setItem('helloStay_facilityBookings', JSON.stringify(updated));
  };

  const saveCharges = (facilityName, updated) => {
    const next = { ...charges, [facilityName]: updated };
    setCharges(next);
    localStorage.setItem('helloStay_facilityCharges', JSON.stringify(next));
  };

  const getFacilityBookings = (facilityName) =>
    bookings.filter(b => b.facilityName === facilityName);

  const getFacilityStats = (facilityName) => {
    const fb = getFacilityBookings(facilityName);
    return {
      total: fb.length,
      today: fb.filter(b => b.date === new Date().toISOString().split('T')[0]).length,
      pending: fb.filter(b => b.paymentType === 'clubbed' || b.paymentType === 'paid_after').length,
    };
  };

  const handleBookFacility = () => {
    if (!bookingForm.guestName.trim() || !bookingForm.roomNumber.trim()) return;

    const newBooking = {
      id: Date.now(),
      ...bookingForm,
      facilityName: selectedFacility,
      createdAt: new Date().toISOString(),
    };

    saveBookings([...bookings, newBooking]);
    setBookingForm(INITIAL_BOOKING);
    setShowBookingModal(false);
  };

  const handleDeleteBooking = (id) => {
    saveBookings(bookings.filter(b => b.id !== id));
  };

  const handleSaveCharges = () => {
    saveCharges(selectedFacility, chargesForm);
    setShowChargesModal(false);
  };

  const openChargesModal = (facilityName) => {
    setSelectedFacility(facilityName);
    setChargesForm(charges[facilityName] || INITIAL_CHARGES);
    setShowChargesModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Facilities</h1>
            <p className="text-sm text-gray-500">{hotelFacilities.length} facilities configured</p>
          </div>
        </div>
      </div>

      {/* Facility Cards */}
      {hotelFacilities.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-20 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-1">No facilities found</h3>
          <p className="text-sm text-gray-400">Add facilities during hotel setup to manage them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotelFacilities.map((facility) => {
            const stats = getFacilityStats(facility);
            const facilityCharges = charges[facility];
            const isActive = selectedFacility === facility;

            return (
              <motion.div
                key={facility}
                layout
                className={clsx(
                  "bg-white rounded-xl border shadow-sm overflow-hidden transition-all cursor-pointer",
                  isActive ? "border-purple-300 ring-2 ring-purple-100" : "border-gray-100 hover:border-gray-200"
                )}
                onClick={() => setSelectedFacility(facility === selectedFacility ? null : facility)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{facility}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {facilityCharges?.scope === 'free_all' ? 'Complimentary' :
                         facilityCharges?.defaultCharge ? `${currencySymbol}${facilityCharges.defaultCharge}/visit` :
                         'Charges not configured'}
                      </p>
                    </div>
                    <span className={clsx(
                      "text-xs font-semibold px-2 py-1 rounded-lg",
                      stats.today > 0 ? "bg-purple-50 text-purple-700" : "bg-gray-50 text-gray-500"
                    )}>
                      {stats.today} today
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-800">{stats.total}</p>
                      <p className="text-[10px] text-gray-500 uppercase">Total</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">{stats.today}</p>
                      <p className="text-[10px] text-gray-500 uppercase">Today</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-orange-600">{stats.pending}</p>
                      <p className="text-[10px] text-gray-500 uppercase">Pending</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFacility(facility);
                        setBookingForm(prev => ({ ...prev, facilityName: facility }));
                        setShowBookingModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      New Booking
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openChargesModal(facility);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded View - Bookings List */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-100 overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-700">Recent Bookings</h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFacility(facility);
                              setBookingForm(prev => ({ ...prev, facilityName: facility }));
                              setShowBookingModal(true);
                            }}
                            className="text-xs text-purple-600 font-medium hover:text-purple-700"
                          >
                            + Add New
                          </button>
                        </div>

                        {getFacilityBookings(facility).length === 0 ? (
                          <p className="text-xs text-gray-400 text-center py-4">No bookings yet</p>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {getFacilityBookings(facility).slice(0, 5).map(booking => (
                              <div
                                key={booking.id}
                                className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-800 truncate">{booking.guestName}</p>
                                  <p className="text-[10px] text-gray-500">
                                    Room {booking.roomNumber} • {booking.date} {booking.time}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1.5 ml-2">
                                  <span className={clsx(
                                    "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                                    booking.paymentType === 'clubbed' && "bg-blue-50 text-blue-600",
                                    booking.paymentType === 'paid_before' && "bg-emerald-50 text-emerald-600",
                                    booking.paymentType === 'paid_after' && "bg-orange-50 text-orange-600",
                                    booking.paymentType === 'free' && "bg-gray-100 text-gray-500",
                                  )}>
                                    {PAYMENT_OPTIONS.find(p => p.value === booking.paymentType)?.label || booking.paymentType}
                                  </span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setViewBooking(booking); }}
                                    className="p-1 text-gray-400 hover:text-blue-600 rounded"
                                  >
                                    <Eye className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteBooking(booking.id); }}
                                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* New Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowBookingModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-purple-600 p-6 text-white rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Book {selectedFacility}</h2>
                    <p className="text-purple-200 text-sm">Create a new reservation</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guest Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bookingForm.guestName}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, guestName: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50 text-sm"
                      placeholder="Guest name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bookingForm.roomNumber}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, roomNumber: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50 text-sm"
                      placeholder="e.g. 301"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={bookingForm.guests}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, guests: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setBookingForm(prev => ({ ...prev, paymentType: opt.value }))}
                        className={clsx(
                          "p-3 rounded-xl border text-left transition-all",
                          bookingForm.paymentType === opt.value
                            ? "bg-purple-50 border-purple-200 ring-1 ring-purple-200"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <p className={clsx(
                          "text-xs font-semibold",
                          bookingForm.paymentType === opt.value ? "text-purple-700" : "text-gray-700"
                        )}>
                          {opt.label}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{opt.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows="2"
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50 text-sm"
                    placeholder="Special requests or notes..."
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleBookFacility}
                    className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors shadow-md shadow-purple-200"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Charges Configuration Modal */}
      <AnimatePresence>
        {showChargesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowChargesModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-indigo-600 p-6 text-white rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Charges — {selectedFacility}</h2>
                    <p className="text-indigo-200 text-sm">Configure pricing for this facility</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChargesModal(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Charges Scope</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CHARGES_SCOPE.map(scope => (
                      <button
                        key={scope.value}
                        type="button"
                        onClick={() => setChargesForm(prev => ({ ...prev, scope: scope.value }))}
                        className={clsx(
                          "p-3 rounded-xl border text-left transition-all",
                          chargesForm.scope === scope.value
                            ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <p className={clsx(
                          "text-xs font-semibold",
                          chargesForm.scope === scope.value ? "text-indigo-700" : "text-gray-700"
                        )}>
                          {scope.label}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{scope.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {chargesForm.scope !== 'free_all' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Charge ({currencySymbol})
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={chargesForm.defaultCharge}
                        onChange={(e) => setChargesForm(prev => ({ ...prev, defaultCharge: e.target.value }))}
                        className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 text-sm"
                        placeholder="e.g. 500"
                      />
                    </div>
                  </div>
                )}

                {chargesForm.scope === 'room_type' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Type Charges</label>
                    <div className="space-y-2">
                      {['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential'].map(type => (
                        <div key={type} className="flex items-center gap-3">
                          <span className="text-xs text-gray-600 w-24">{type}</span>
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{currencySymbol}</span>
                            <input
                              type="number"
                              min="0"
                              className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
                              placeholder="Charge"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {chargesForm.scope === 'room_number' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room-Specific Charges</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {rooms.slice(0, 10).map(room => (
                        <div key={room.id} className="flex items-center gap-3">
                          <span className="text-xs text-gray-600 w-20 font-medium">Room {room.roomNumber}</span>
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{currencySymbol}</span>
                            <input
                              type="number"
                              min="0"
                              className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
                              placeholder="Charge"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {rooms.length > 10 && (
                      <p className="text-[10px] text-gray-400 mt-1">Showing first 10 rooms</p>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowChargesModal(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCharges}
                    className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-md shadow-indigo-200"
                  >
                    Save Charges
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Booking Modal */}
      <AnimatePresence>
        {viewBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setViewBooking(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Booking Details</h2>
                <button
                  onClick={() => setViewBooking(null)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-semibold text-purple-800">{viewBooking.facilityName}</p>
                    <p className="text-xs text-purple-600">Facility</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Guest</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{viewBooking.guestName}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Room</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{viewBooking.roomNumber}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Date</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{viewBooking.date || 'Not set'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Time</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{viewBooking.time || 'Not set'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Guests</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{viewBooking.guests}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Payment</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                      {PAYMENT_OPTIONS.find(p => p.value === viewBooking.paymentType)?.label}
                    </p>
                  </div>
                </div>

                {viewBooking.notes && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Notes</p>
                    <p className="text-sm text-gray-700 mt-0.5">{viewBooking.notes}</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setViewBooking(null)}
                  className="py-2.5 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
