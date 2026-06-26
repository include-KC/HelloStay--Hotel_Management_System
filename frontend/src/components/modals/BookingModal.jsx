import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, BedDouble, User, CalendarDays, Search,
  CheckCircle, ChevronRight, ChevronLeft, Users, Filter, Plus, Trash2, Check
} from 'lucide-react';
import clsx from 'clsx';
import { createBookingWithGuest, getGuests } from '../../utils/dataStore';

const ID_PROOF_TYPES = ['Aadhaar Card', 'Passport', "Driver's License", 'Voter ID', 'PAN Card', 'Other'];

const INITIAL_GUEST = {
  name: '',
  phone: '',
  address: '',
  email: '',
  idProofType: '',
  idProofNumber: '',
  nationality: '',
  gender: '',
  guestId: null,
};

function StepIndicator({ currentStep }) {
  const steps = [
    { num: 1, label: 'Select Room' },
    { num: 2, label: 'Guest Details' },
    { num: 3, label: 'Confirm Booking' },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
              currentStep >= step.num
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-500"
            )}>
              {currentStep > step.num ? (
                <CheckCircle className="w-4 h-4" />
              ) : step.num}
            </div>
            <span className={clsx(
              "text-xs font-medium hidden sm:block",
              currentStep >= step.num ? "text-indigo-600" : "text-gray-400"
            )}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={clsx(
              "w-8 sm:w-12 h-0.5 mx-1",
              currentStep > step.num ? "bg-indigo-600" : "bg-gray-200"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

function Step1({ rooms, bookings, currencySymbol, onSelectRoom }) {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('11:00');
  const [setCheckoutLater, setSetCheckoutLater] = useState(false);
  const [roomTypeFilter, setRoomTypeFilter] = useState('All');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('All');
  const [freeServiceFilter, setFreeServiceFilter] = useState('All');
  const [minOccupancy, setMinOccupancy] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const allRoomTypes = useMemo(() => {
    const set = new Set(rooms.map(r => r.roomType).filter(Boolean));
    return Array.from(set).sort();
  }, [rooms]);

  const allFacilities = useMemo(() => {
    const set = new Set();
    rooms.forEach(r => {
      if (r.facilities) {
        r.facilities.split(',').forEach(f => {
          const t = f.trim();
          if (t) set.add(t);
        });
      }
    });
    return Array.from(set).sort();
  }, [rooms]);

  const allFreeServices = useMemo(() => {
    const set = new Set();
    rooms.forEach(r => {
      if (r.freeServices) {
        r.freeServices.split(',').forEach(s => {
          const t = s.trim();
          if (t) set.add(t);
        });
      }
    });
    return Array.from(set).sort();
  }, [rooms]);

  const isRoomAvailable = useCallback((room) => {
    if (room.roomStatus === 'Maintenance' || room.roomStatus === 'Cleaning' || room.roomStatus === 'Occupied') return false;
    if (!checkInDate) return true;

    const ciDate = new Date(checkInDate);
    const coDate = setCheckoutLater ? null : (checkOutDate ? new Date(checkOutDate) : null);

    const conflicting = bookings.find(b =>
      b.roomId === room.id &&
      b.status !== 'Cancelled' &&
      b.status !== 'Checked Out' &&
      (!coDate || (ciDate < new Date(b.checkOutDate || b.checkInDate) && coDate > b.checkInDate))
    );
    return !conflicting;
  }, [bookings, checkInDate, checkOutDate, setCheckoutLater]);

  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    if (roomTypeFilter !== 'All') {
      result = result.filter(r => r.roomType === roomTypeFilter);
    }
    if (priceMin) result = result.filter(r => r.pricePerNight >= parseFloat(priceMin));
    if (priceMax) result = result.filter(r => r.pricePerNight <= parseFloat(priceMax));
    if (facilityFilter !== 'All') {
      result = result.filter(r => r.facilities && r.facilities.split(',').some(f => f.trim() === facilityFilter));
    }
    if (freeServiceFilter !== 'All') {
      result = result.filter(r => r.freeServices && r.freeServices.split(',').some(s => s.trim() === freeServiceFilter));
    }
    if (minOccupancy) {
      result = result.filter(r => r.maxOccupancy >= parseInt(minOccupancy));
    }

    return result;
  }, [rooms, roomTypeFilter, priceMin, priceMax, facilityFilter, freeServiceFilter, minOccupancy]);

  const handleSelect = (room) => {
    onSelectRoom({
      room,
      checkInDate,
      checkInTime,
      checkOutDate: setCheckoutLater ? '' : checkOutDate,
      checkOutTime: setCheckoutLater ? '' : checkOutTime,
      checkoutOption: setCheckoutLater ? 'at_checkout' : 'now',
    });
  };

  return (
    <div className="space-y-4">
      {/* Date Selection */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <CalendarDays className="w-4 h-4" /> Stay Dates
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Check-in Date *</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Check-in Time</label>
            <input
              type="time"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={setCheckoutLater}
              onChange={(e) => setSetCheckoutLater(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="text-xs font-medium text-gray-600">Set checkout date at billing time</span>
          </label>
          {!setCheckoutLater && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Check-out Date *</label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  min={checkInDate || new Date().toISOString().split('T')[0]}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Check-out Time</label>
                <input
                  type="time"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        <Filter className="w-4 h-4" />
        {showFilters ? 'Hide Filters' : 'Show More Filters'}
      </button>

      {/* Extended Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Room Type</label>
                  <select
                    value={roomTypeFilter}
                    onChange={(e) => setRoomTypeFilter(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="All">All Types</option>
                    {allRoomTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Min Occupancy</label>
                  <input
                    type="number"
                    min="1"
                    value={minOccupancy}
                    onChange={(e) => setMinOccupancy(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Any"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Facility</label>
                  <select
                    value={facilityFilter}
                    onChange={(e) => setFacilityFilter(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="All">All Facilities</option>
                    {allFacilities.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Free Service</label>
                  <select
                    value={freeServiceFilter}
                    onChange={(e) => setFreeServiceFilter(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="All">All Free Services</option>
                    {allFreeServices.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Min Price</label>
                  <input
                    type="number"
                    min="0"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="No min"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max Price</label>
                  <input
                    type="number"
                    min="0"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="No max"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available Rooms */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Available Rooms ({filteredRooms.length})
        </h4>
        {filteredRooms.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <BedDouble className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No rooms found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {filteredRooms.map(room => {
              const available = isRoomAvailable(room);
              const statusLabel = room.roomStatus === 'Occupied' ? 'Occupied'
                : room.roomStatus === 'Reserved' ? 'Reserved'
                : room.roomStatus === 'Maintenance' ? 'Under Maintenance'
                : room.roomStatus === 'Cleaning' ? 'Being Cleaned'
                : null;

              return (
                <button
                  key={room.id}
                  onClick={() => available && handleSelect(room)}
                  disabled={!available}
                  className={clsx(
                    "text-left p-4 border rounded-xl transition-all group",
                    available
                      ? "bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer"
                      : "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={clsx("text-sm font-bold", available ? "text-gray-800 group-hover:text-indigo-700" : "text-gray-500")}>
                        {room.roomNumber}
                      </p>
                      <p className="text-xs text-gray-500">{room.roomType}</p>
                    </div>
                    <p className={clsx("text-sm font-bold", available ? "text-indigo-600" : "text-gray-400")}>
                      {currencySymbol}{room.pricePerNight?.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-gray-500">{room.pricingModel === 'per_person' ? '/person' : '/night'}</span>
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {room.maxOccupancy} guests
                    </span>
                    {statusLabel && (
                      <span className={clsx(
                        "font-medium",
                        room.roomStatus === 'Occupied' && "text-red-600",
                        room.roomStatus === 'Reserved' && "text-blue-600",
                        room.roomStatus === 'Maintenance' && "text-amber-600",
                        room.roomStatus === 'Cleaning' && "text-orange-600",
                      )}>
                        {statusLabel}
                      </span>
                    )}
                  </div>
                  {room.facilities && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {room.facilities.split(',').slice(0, 3).map((f, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded">
                          {f.trim()}
                        </span>
                      ))}
                      {room.facilities.split(',').length > 3 && (
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">
                          +{room.facilities.split(',').length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  <div className="mt-2 text-right">
                    <span className={clsx(
                      "text-xs font-medium",
                      available ? "text-indigo-600 group-hover:text-indigo-800" : "text-gray-400"
                    )}>
                      {available ? 'Select →' : 'Not Available'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function GuestSelector({ guestIndex, guest, errors, onSelectExisting, onFieldChange, isPrimary }) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mode, setMode] = useState(() => guest.guestId ? 'selected' : (guest.name ? 'manual' : 'search'));

  const allGuestsList = useMemo(() => {
    try { return getGuests(); }
    catch { return []; }
  }, []);

  const selectedGuest = useMemo(() => {
    if (guest.guestId) return allGuestsList.find(g => g.id === guest.guestId);
    return null;
  }, [guest.guestId, allGuestsList]);

  const filtered = useMemo(() => {
    if (!search.trim()) return allGuestsList.slice(0, 20);
    const q = search.toLowerCase();
    return allGuestsList.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.phone.includes(q) ||
      (g.email && g.email.toLowerCase().includes(q))
    );
  }, [allGuestsList, search]);

  const handleSelectGuest = (g) => {
    onSelectExisting(guestIndex, g);
    setSearch('');
    setShowDropdown(false);
    setMode('selected');
  };

  const handleCreateNew = () => {
    setMode('manual');
    setShowDropdown(false);
    setSearch('');
  };

  const prefix = isPrimary ? 'Primary Guest' : `Guest ${guestIndex + 1}`;

  if (mode === 'selected' && selectedGuest) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-indigo-200 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-indigo-600 uppercase flex items-center gap-1">
            <Check className="w-3 h-3" /> {prefix} — Existing Guest
          </span>
          <button onClick={() => { setMode('search'); onSelectExisting(guestIndex, null); }} className="text-[10px] text-gray-500 hover:text-red-500 transition-colors underline">
            Change
          </button>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <p className="text-sm font-semibold text-gray-900">{selectedGuest.name}</p>
          <p className="text-xs text-gray-500">{selectedGuest.phone}</p>
          {selectedGuest.email && <p className="text-xs text-gray-400">{selectedGuest.email}</p>}
          {selectedGuest.nationality && <p className="text-xs text-gray-400">{selectedGuest.nationality}</p>}
          <p className="text-[10px] text-indigo-500 mt-1">Guest ID: {selectedGuest.id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase">{prefix}</span>
      </div>

      {mode === 'search' && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Search guest by name or phone..."
            />
          </div>

          {showDropdown && (
            <div className="absolute z-30 mt-1 left-4 right-4 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleSelectGuest(g)}
                    className="w-full text-left p-3 hover:bg-indigo-50 border-b border-gray-50 last:border-0 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{g.name}</p>
                      <p className="text-xs text-gray-500">{g.phone}{g.email ? ` • ${g.email}` : ''}</p>
                    </div>
                    <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Select</span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center">
                  <p className="text-xs text-gray-500">No guests found</p>
                </div>
              )}
              <button
                type="button"
                onClick={handleCreateNew}
                className="w-full text-left p-3 text-indigo-600 hover:bg-indigo-50 border-t border-gray-200 font-medium text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create New Guest
              </button>
            </div>
          )}

          {!showDropdown && (
            <button type="button" onClick={handleCreateNew} className="w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 justify-center py-1">
              <Plus className="w-3 h-3" /> Or create new guest
            </button>
          )}
        </div>
      )}

      {mode === 'manual' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-400">Manually entering guest details</span>
            {allGuestsList.length > 0 && (
              <button type="button" onClick={() => setMode('search')} className="text-[10px] text-indigo-600 hover:underline">
                Search existing instead
              </button>
            )}
          </div>
          <GuestFormFields guestIndex={guestIndex} guest={guest} errors={errors} onFieldChange={onFieldChange} />
        </div>
      )}

      {guestIndex === 0 && mode === 'search' && (
        <p className="text-[10px] text-gray-400 mt-2">Primary guest details will be used for billing contact</p>
      )}
    </div>
  );
}

function GuestFormFields({ guestIndex, guest, errors, onFieldChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
        <input
          type="text"
          value={guest.name}
          onChange={(e) => onFieldChange(guestIndex, 'name', e.target.value)}
          className={clsx(
            "w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none",
            errors[`guest_${guestIndex}_name`] ? "border-red-300" : "border-gray-200"
          )}
          placeholder="Full name"
        />
        {errors[`guest_${guestIndex}_name`] && <p className="text-[10px] text-red-500 mt-0.5">{errors[`guest_${guestIndex}_name`]}</p>}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Phone *</label>
        <input
          type="tel"
          value={guest.phone}
          onChange={(e) => onFieldChange(guestIndex, 'phone', e.target.value)}
          className={clsx(
            "w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none",
            errors[`guest_${guestIndex}_phone`] ? "border-red-300" : "border-gray-200"
          )}
          placeholder="+91 XXXXX XXXXX"
        />
        {errors[`guest_${guestIndex}_phone`] && <p className="text-[10px] text-red-500 mt-0.5">{errors[`guest_${guestIndex}_phone`]}</p>}
      </div>
      <div className="col-span-2">
        <label className="block text-xs font-medium text-gray-600 mb-1">Address *</label>
        <textarea
          rows="2"
          value={guest.address}
          onChange={(e) => onFieldChange(guestIndex, 'address', e.target.value)}
          className={clsx(
            "w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none",
            errors[`guest_${guestIndex}_address`] ? "border-red-300" : "border-gray-200"
          )}
          placeholder="Full address"
        />
        {errors[`guest_${guestIndex}_address`] && <p className="text-[10px] text-red-500 mt-0.5">{errors[`guest_${guestIndex}_address`]}</p>}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">ID Proof Type *</label>
        <select
          value={guest.idProofType}
          onChange={(e) => onFieldChange(guestIndex, 'idProofType', e.target.value)}
          className={clsx(
            "w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none",
            errors[`guest_${guestIndex}_idProofType`] ? "border-red-300" : "border-gray-200"
          )}
        >
          <option value="">Select...</option>
          {ID_PROOF_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {errors[`guest_${guestIndex}_idProofType`] && <p className="text-[10px] text-red-500 mt-0.5">{errors[`guest_${guestIndex}_idProofType`]}</p>}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">ID Proof Number *</label>
        <input
          type="text"
          value={guest.idProofNumber}
          onChange={(e) => onFieldChange(guestIndex, 'idProofNumber', e.target.value)}
          className={clsx(
            "w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none",
            errors[`guest_${guestIndex}_idProofNumber`] ? "border-red-300" : "border-gray-200"
          )}
          placeholder="ID number"
        />
        {errors[`guest_${guestIndex}_idProofNumber`] && <p className="text-[10px] text-red-500 mt-0.5">{errors[`guest_${guestIndex}_idProofNumber`]}</p>}
      </div>
    </div>
  );
}

function Step2({ room, stayData, onUpdateStay, onBack, onContinue, currencySymbol }) {
  const guestCount = room.maxOccupancy;
  const [guests, setGuests] = useState(() => {
    if (stayData.guests && stayData.guests.length > 0) return stayData.guests;
    return Array.from({ length: Math.min(1, guestCount) }, () => ({ ...INITIAL_GUEST }));
  });
  const [errors, setErrors] = useState({});

  const handleGuestChange = (index, field, value) => {
    const updated = guests.map((g, i) => i === index ? { ...g, [field]: value } : g);
    setGuests(updated);
    if (errors[`guest_${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`guest_${index}_${field}`]: '' }));
    }
  };

  const handleSelectExisting = (index, existingGuest) => {
    const updated = guests.map((g, i) => {
      if (i !== index) return g;
      if (!existingGuest) return { ...INITIAL_GUEST, guestId: null };
      return {
        name: existingGuest.name || '',
        phone: existingGuest.phone || '',
        address: existingGuest.address || '',
        email: existingGuest.email || '',
        idProofType: existingGuest.idProofType || '',
        idProofNumber: existingGuest.idProofNumber || '',
        nationality: existingGuest.nationality || '',
        gender: existingGuest.gender || '',
        guestId: existingGuest.id,
      };
    });
    setGuests(updated);
  };

  const addGuest = () => {
    if (guests.length < guestCount) {
      setGuests([...guests, { ...INITIAL_GUEST }]);
    }
  };

  const removeGuest = (index) => {
    if (guests.length > 1 && index > 0) {
      setGuests(guests.filter((_, i) => i !== index));
    }
  };

  const handleContinue = () => {
    const newErrors = {};
    guests.forEach((g, i) => {
      if (!g.name.trim()) newErrors[`guest_${i}_name`] = 'Required';
      if (!g.phone.trim()) newErrors[`guest_${i}_phone`] = 'Required';
      if (!g.guestId) {
        if (!g.address.trim()) newErrors[`guest_${i}_address`] = 'Required';
        if (!g.idProofType) newErrors[`guest_${i}_idProofType`] = 'Required';
        if (!g.idProofNumber.trim()) newErrors[`guest_${i}_idProofNumber`] = 'Required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onUpdateStay({
      guests,
      adults: guests.length,
    });
    onContinue();
  };

  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BedDouble className="w-5 h-5 text-indigo-600" />
          <div>
            <p className="text-sm font-bold text-indigo-800">Room {room.roomNumber}</p>
            <p className="text-xs text-indigo-600">{room.roomType} • {currencySymbol}{room.pricePerNight?.toLocaleString('en-IN')}{room.pricingModel === 'per_person' ? '/person' : '/night'} • Max {guestCount} guest{guestCount > 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onClick={onBack} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 underline">
          Change
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4" /> Guest Details ({guests.length}/{guestCount})
          </h4>
          {guests.length < guestCount && (
            <button onClick={addGuest} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Guest
            </button>
          )}
        </div>

        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {guests.map((guest, i) => (
            <div key={i} className="relative">
              {i > 0 && (
                <button
                  onClick={() => removeGuest(i)}
                  className="absolute -top-1 -right-1 z-10 p-1 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full border border-gray-200 shadow-sm"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              <GuestSelector
                guestIndex={i}
                guest={guest}
                allGuests={guests}
                errors={errors}
                onSelectExisting={handleSelectExisting}
                onFieldChange={handleGuestChange}
                isPrimary={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Special Requests (optional)</label>
        <textarea
          rows="2"
          value={stayData.specialRequests || ''}
          onChange={(e) => onUpdateStay({ specialRequests: e.target.value })}
          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="Late check-in, extra towels, etc."
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleContinue}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-indigo-200 text-sm flex items-center gap-2"
        >
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Step3({ room, stayData, onBack, currencySymbol, onConfirm }) {
  const hotelData = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('helloStay_hotelData') || '{}'); }
    catch { return {}; }
  }, []);

  const defaultDuration = hotelData.checkoutDuration || '24hr';

  const nights = useMemo(() => {
    if (!stayData.checkInDate || !stayData.checkOutDate) return 0;
    const diff = new Date(stayData.checkOutDate) - new Date(stayData.checkInDate);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [stayData.checkInDate, stayData.checkOutDate]);

  const guestCount = stayData.guests?.length || 1;

  const calculatedTotal = useMemo(() => {
    if (room.pricingModel === 'per_person') {
      return nights > 0 ? nights * room.pricePerNight * guestCount : room.pricePerNight * guestCount;
    }
    return nights > 0 ? nights * room.pricePerNight : room.pricePerNight;
  }, [nights, room.pricePerNight, room.pricingModel, guestCount]);

  const [bookingAmount, setBookingAmount] = useState(stayData.bookingAmount || calculatedTotal);
  const [paymentStatus, setPaymentStatus] = useState(stayData.paymentStatus || 'Pending');
  const [amountPaid, setAmountPaid] = useState(stayData.amountPaid || 0);
  const [useDefaultDuration, setUseDefaultDuration] = useState(stayData.useDefaultDuration !== false);
  const [bookingDuration, setBookingDuration] = useState(stayData.bookingDuration || defaultDuration);
  const [errors, setErrors] = useState({});

  const handlePaymentStatusChange = (status) => {
    setPaymentStatus(status);
    if (status === 'Paid') {
      setAmountPaid(bookingAmount);
    } else if (status === 'Pending') {
      setAmountPaid(0);
    }
  };

  const handleConfirm = () => {
    const newErrors = {};
    if (!bookingAmount || bookingAmount <= 0) newErrors.bookingAmount = 'Enter booking amount';
    if (paymentStatus === 'Paid' && amountPaid < bookingAmount) {
      newErrors.amountPaid = 'Amount must match total for "Paid" status';
    }
    if (paymentStatus === 'Partial' && (amountPaid <= 0 || amountPaid >= bookingAmount)) {
      newErrors.amountPaid = 'Enter a valid partial amount';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onConfirm({
      bookingAmount: parseFloat(bookingAmount),
      paymentStatus,
      amountPaid: parseFloat(amountPaid) || 0,
      useDefaultDuration,
      bookingDuration: useDefaultDuration ? defaultDuration : bookingDuration,
    });
  };

  return (
    <div className="space-y-4">
      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Booking Summary</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Room: </span>
            <span className="font-medium text-gray-800">{room.roomNumber} ({room.roomType})</span>
          </div>
          <div>
            <span className="text-gray-500">Rate: </span>
            <span className="font-medium text-gray-800">{currencySymbol}{room.pricePerNight?.toLocaleString('en-IN')}{room.pricingModel === 'per_person' ? '/person' : '/night'}</span>
          </div>
          <div>
            <span className="text-gray-500">Check-in: </span>
            <span className="font-medium text-gray-800">{stayData.checkInDate} {stayData.checkInTime}</span>
          </div>
          <div>
            <span className="text-gray-500">Check-out: </span>
            <span className="font-medium text-gray-800">
              {stayData.checkOutDate ? `${stayData.checkOutDate} ${stayData.checkOutTime}` : 'At billing time'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Guests: </span>
            <span className="font-medium text-gray-800">{guestCount}</span>
          </div>
          <div>
            <span className="text-gray-500">Nights: </span>
            <span className="font-medium text-gray-800">{nights > 0 ? nights : 'TBD'}</span>
          </div>
          {room.pricingModel === 'per_person' && (
            <div className="col-span-2">
              <span className="text-gray-500">Total: </span>
              <span className="font-medium text-gray-800">
                {nights > 0 ? `${nights} nights × ` : ''}{currencySymbol}{room.pricePerNight?.toLocaleString('en-IN')} × {guestCount} guests = {currencySymbol}{calculatedTotal.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Primary Guest</p>
          <p className="text-sm font-semibold text-gray-800">
            {stayData.guests?.[0]?.name || 'N/A'} — {stayData.guests?.[0]?.phone || ''}
          </p>
        </div>
      </div>

      {/* Checkout Duration Override */}
      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
        <h4 className="text-sm font-semibold text-indigo-700 mb-2">Checkout Duration</h4>
        <label className="flex items-center gap-2 cursor-pointer mb-2">
          <input
            type="checkbox"
            checked={useDefaultDuration}
            onChange={(e) => setUseDefaultDuration(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span className="text-xs font-medium text-gray-600">Use hotel default ({defaultDuration})</span>
        </label>
        {!useDefaultDuration && (
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setBookingDuration('12hr')}
              className={clsx(
                "flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all",
                bookingDuration === '12hr'
                  ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              12 Hours
            </button>
            <button
              type="button"
              onClick={() => setBookingDuration('24hr')}
              className={clsx(
                "flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all",
                bookingDuration === '24hr'
                  ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              24 Hours
            </button>
          </div>
        )}
      </div>

      {/* Booking Amount */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Booking Amount *</label>
        <p className="text-[10px] text-gray-400 mb-1.5">
          {room.pricingModel === 'per_person'
            ? (nights > 0
              ? `Calculated: ${nights} nights × ${currencySymbol}${room.pricePerNight?.toLocaleString('en-IN')} × ${guestCount} guests = ${currencySymbol}${calculatedTotal.toLocaleString('en-IN')}`
              : `Room rate: ${currencySymbol}${room.pricePerNight?.toLocaleString('en-IN')}/person`)
            : (nights > 0
              ? `Calculated: ${nights} nights × ${currencySymbol}${room.pricePerNight?.toLocaleString('en-IN')} = ${currencySymbol}${calculatedTotal.toLocaleString('en-IN')}`
              : `Room rate: ${currencySymbol}${room.pricePerNight?.toLocaleString('en-IN')}/night`)}
          . Edit if negotiated.
        </p>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{currencySymbol}</span>
          <input
            type="number"
            min="0"
            value={bookingAmount}
            onChange={(e) => { setBookingAmount(e.target.value); setErrors(prev => ({ ...prev, bookingAmount: '' })); }}
            className={clsx(
              "w-full pl-8 pr-3 p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none",
              errors.bookingAmount ? "border-red-300" : "border-gray-200"
            )}
          />
        </div>
        {errors.bookingAmount && <p className="text-[10px] text-red-500 mt-0.5">{errors.bookingAmount}</p>}
      </div>

      {/* Payment */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Payment Status *</label>
        <div className="flex gap-2">
          {['Pending', 'Partial', 'Paid'].map(status => (
            <button
              key={status}
              onClick={() => handlePaymentStatusChange(status)}
              className={clsx(
                "flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all",
                paymentStatus === status
                  ? status === 'Paid' ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : status === 'Partial' ? "bg-orange-50 border-orange-200 text-orange-700"
                    : "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Amount Paid */}
      {paymentStatus !== 'Pending' && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Amount Paid * {paymentStatus === 'Paid' && `(Must be ${currencySymbol}${parseFloat(bookingAmount).toLocaleString('en-IN')})`}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{currencySymbol}</span>
            <input
              type="number"
              min="0"
              max={bookingAmount}
              value={amountPaid}
              onChange={(e) => { setAmountPaid(e.target.value); setErrors(prev => ({ ...prev, amountPaid: '' })); }}
              className={clsx(
                "w-full pl-8 pr-3 p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none",
                errors.amountPaid ? "border-red-300" : "border-gray-200"
              )}
            />
          </div>
          {errors.amountPaid && <p className="text-[10px] text-red-500 mt-0.5">{errors.amountPaid}</p>}
        </div>
      )}

      {/* Confirm */}
      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-800 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleConfirm}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-indigo-200 text-sm flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default function BookingModal({ isOpen, onClose, rooms, bookings, currencySymbol, onBookingCreated }) {
  const [step, setStep] = useState(1);
  const [stayData, setStayData] = useState({
    checkInDate: '',
    checkInTime: '14:00',
    checkOutDate: '',
    checkOutTime: '11:00',
    checkoutOption: 'now',
    guests: [],
    specialRequests: '',
    bookingAmount: 0,
    paymentStatus: 'Pending',
    amountPaid: 0,
  });
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleSelectRoom = (data) => {
    setSelectedRoom(data.room);
    setStayData(prev => ({
      ...prev,
      checkInDate: data.checkInDate,
      checkInTime: data.checkInTime,
      checkOutDate: data.checkOutDate,
      checkOutTime: data.checkOutTime,
      checkoutOption: data.checkoutOption,
    }));
    setStep(2);
  };

  const handleUpdateStay = (updates) => {
    setStayData(prev => ({ ...prev, ...updates }));
  };

  const handleBackToStep1 = () => {
    setStep(1);
  };

  const handleBackToStep2 = () => {
    setStep(2);
  };

  const handleGoToStep3 = () => {
    setStep(3);
  };

  const handleConfirm = (paymentData) => {
    const primaryGuest = stayData.guests[0] || {};

    const guestData = {
      name: primaryGuest.name || '',
      phone: primaryGuest.phone || '',
      address: primaryGuest.address || '',
      email: primaryGuest.email || '',
      idProofType: primaryGuest.idProofType || '',
      idProofNumber: primaryGuest.idProofNumber || '',
      nationality: primaryGuest.nationality || '',
      gender: primaryGuest.gender || '',
      id: primaryGuest.guestId || null,
    };

    const isNewGuest = !primaryGuest.guestId;

    const guestsWithIds = stayData.guests.map(g => ({
      ...g,
      guestId: g.guestId || null,
    }));

    const bookingData = {
      roomId: selectedRoom.id,
      roomNumber: selectedRoom.roomNumber,
      roomType: selectedRoom.roomType,
      primaryGuest: guestsWithIds[0],
      guests: guestsWithIds,
      guestName: primaryGuest.name || '',
      guestPhone: primaryGuest.phone || '',
      adults: stayData.guests.length,
      children: 0,
      checkInDate: stayData.checkInDate,
      checkInTime: stayData.checkInTime,
      checkOutDate: stayData.checkOutDate,
      checkOutTime: stayData.checkOutTime,
      checkoutOption: stayData.checkoutOption,
      totalAmount: paymentData.bookingAmount,
      bookingAmount: paymentData.bookingAmount,
      amountPaid: paymentData.amountPaid,
      paymentStatus: paymentData.paymentStatus,
      specialRequests: stayData.specialRequests,
      status: 'Reserved',
    };

    createBookingWithGuest(bookingData, guestData, isNewGuest);
    onBookingCreated(bookingData);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setSelectedRoom(null);
    setStayData({
      checkInDate: '',
      checkInTime: '14:00',
      checkOutDate: '',
      checkOutTime: '11:00',
      checkoutOption: 'now',
      guests: [],
      specialRequests: '',
      bookingAmount: 0,
      paymentStatus: 'Pending',
      amountPaid: 0,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">New Booking</h3>
                <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <StepIndicator currentStep={step} />
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Step1
                      rooms={rooms}
                      bookings={bookings}
                      currencySymbol={currencySymbol}
                      onSelectRoom={handleSelectRoom}
                      onClose={handleClose}
                    />
                  </motion.div>
                )}
                {step === 2 && selectedRoom && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Step2
                      room={selectedRoom}
                      stayData={stayData}
                      onUpdateStay={handleUpdateStay}
                      onBack={handleBackToStep1}
                      onContinue={handleGoToStep3}
                      currencySymbol={currencySymbol}
                    />
                  </motion.div>
                )}
                {step === 3 && selectedRoom && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Step3
                      room={selectedRoom}
                      stayData={stayData}
                      onUpdateStay={handleUpdateStay}
                      onBack={handleBackToStep2}
                      currencySymbol={currencySymbol}
                      onConfirm={handleConfirm}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
