import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BedDouble, Search, Plus, Check, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const INDUSTRY_ROOM_TYPES = [
  'Standard Room', 'Deluxe Room', 'Suite', 'Executive Suite', 'Presidential Suite',
  'Family Room', 'Twin Room', 'Double Room', 'Single Room', 'Studio',
  'Connecting Room', 'Adjoining Room', 'Accessible Room', 'Penthouse',
  'Villa', 'Cottage', 'Bungalow', 'Duplex', 'Loft', 'Cabana',
];

const ROOM_STATUSES = ['Available', 'Occupied', 'Cleaning', 'Reserved'];

const CURRENCIES = {
  INR: { symbol: '₹', label: 'Indian Rupee (₹)' },
  USD: { symbol: '$', label: 'US Dollar ($)' },
  EUR: { symbol: '€', label: 'Euro (€)' },
  GBP: { symbol: '£', label: 'British Pound (£)' },
  AED: { symbol: 'د.إ', label: 'UAE Dirham (د.إ)' },
  THB: { symbol: '฿', label: 'Thai Baht (฿)' },
  JPY: { symbol: '¥', label: 'Japanese Yen (¥)' },
  SGD: { symbol: 'S$', label: 'Singapore Dollar (S$)' },
  AUD: { symbol: 'A$', label: 'Australian Dollar (A$)' },
  CAD: { symbol: 'C$', label: 'Canadian Dollar (C$)' },
};

const INITIAL_FORM = {
  roomNumber: '',
  roomType: '',
  pricePerNight: '',
  pricingModel: 'per_night',
  maxOccupancy: '2',
  roomStatus: 'Available',
  facilities: '',
  freeServices: '',
};

const INITIAL_ERRORS = {
  roomNumber: '',
  roomType: '',
  pricePerNight: '',
  maxOccupancy: '',
};

export default function AddRoomModal({ isOpen, onClose, onRoomAdded, editingRoom, onRoomUpdated }) {
  const isEditMode = !!editingRoom;

  const getInitialForm = () => {
    if (editingRoom) {
      return {
        roomNumber: editingRoom.roomNumber,
        roomType: editingRoom.roomType,
        pricePerNight: editingRoom.pricePerNight,
        pricingModel: editingRoom.pricingModel || 'per_night',
        maxOccupancy: String(editingRoom.maxOccupancy),
        roomStatus: editingRoom.roomStatus,
        facilities: editingRoom.facilities || '',
        freeServices: editingRoom.freeServices || '',
      };
    }
    return INITIAL_FORM;
  };

  const [formData, setFormData] = useState(getInitialForm);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [typeSearch, setTypeSearch] = useState(() => editingRoom?.roomType || '');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const typeInputRef = useRef(null);
  const typeDropdownRef = useRef(null);

  const hotelData = useMemo(() => {
    const saved = localStorage.getItem('helloStay_hotelData');
    return saved ? JSON.parse(saved) : {};
  }, []);

  const currencySymbol = CURRENCIES[hotelData.currency]?.symbol || '₹';

  const filteredTypes = useMemo(() => {
    const search = typeSearch.toLowerCase();
    const matches = INDUSTRY_ROOM_TYPES.filter(t =>
      t.toLowerCase().includes(search)
    );
    return matches;
  }, [typeSearch]);

  const showAddCustom = typeSearch.trim() &&
    !INDUSTRY_ROOM_TYPES.some(t => t.toLowerCase() === typeSearch.toLowerCase());

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target)) {
        setShowTypeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, roomType: type }));
    setTypeSearch(type);
    setShowTypeDropdown(false);
    if (errors.roomType) {
      setErrors(prev => ({ ...prev, roomType: '' }));
    }
  };

  const handleAddCustomType = () => {
    const custom = typeSearch.trim();
    if (custom) {
      handleTypeSelect(custom);
    }
  };

  const validate = () => {
    const newErrors = { ...INITIAL_ERRORS };
    let isValid = true;

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required.';
      isValid = false;
    }

    if (!formData.roomType.trim()) {
      newErrors.roomType = 'Room type is required.';
      isValid = false;
    }

    if (!formData.pricePerNight || parseFloat(formData.pricePerNight) <= 0) {
      newErrors.pricePerNight = 'Valid price is required.';
      isValid = false;
    }

    if (!formData.maxOccupancy || parseInt(formData.maxOccupancy) <= 0) {
      newErrors.maxOccupancy = 'At least 1 guest required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode) {
      const updatedRoom = {
        ...editingRoom,
        roomNumber: formData.roomNumber.trim(),
        roomType: formData.roomType.trim(),
        pricePerNight: parseFloat(formData.pricePerNight),
        pricingModel: formData.pricingModel,
        maxOccupancy: parseInt(formData.maxOccupancy),
        facilities: formData.facilities.trim(),
        freeServices: formData.freeServices.trim(),
      };

      const existing = JSON.parse(localStorage.getItem('helloStay_rooms') || '[]');
      const updated = existing.map(r => r.id === editingRoom.id ? updatedRoom : r);
      localStorage.setItem('helloStay_rooms', JSON.stringify(updated));

      setFormData(INITIAL_FORM);
      setErrors(INITIAL_ERRORS);
      setTypeSearch('');
      onRoomUpdated(updatedRoom);
      onClose();
    } else {
      const newRoom = {
        id: Date.now(),
        roomNumber: formData.roomNumber.trim(),
        roomType: formData.roomType.trim(),
        pricePerNight: parseFloat(formData.pricePerNight),
        pricingModel: formData.pricingModel,
        maxOccupancy: parseInt(formData.maxOccupancy),
        roomStatus: formData.roomStatus,
        facilities: formData.facilities.trim(),
        freeServices: formData.freeServices.trim(),
      };

      const existing = JSON.parse(localStorage.getItem('helloStay_rooms') || '[]');
      existing.push(newRoom);
      localStorage.setItem('helloStay_rooms', JSON.stringify(existing));

      setFormData(INITIAL_FORM);
      setErrors(INITIAL_ERRORS);
      setTypeSearch('');
      onRoomAdded(newRoom);
      onClose();
    }
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
    setTypeSearch('');
    setShowTypeDropdown(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
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
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{isEditMode ? 'Edit Room' : 'Add New Room'}</h2>
                  <p className="text-indigo-200 text-sm">{isEditMode ? 'Update room details below' : 'Configure room details below'}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => handleChange('roomNumber', e.target.value)}
                  className={clsx(
                    "w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all text-sm",
                    errors.roomNumber ? "border-red-300" : "border-gray-200"
                  )}
                  placeholder="e.g. 301"
                />
                {errors.roomNumber && (
                  <p className="text-xs text-red-500 mt-1">{errors.roomNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative" ref={typeDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      ref={typeInputRef}
                      type="text"
                      value={typeSearch}
                      onChange={(e) => {
                        setTypeSearch(e.target.value);
                        setShowTypeDropdown(true);
                        if (formData.roomType && e.target.value !== formData.roomType) {
                          setFormData(prev => ({ ...prev, roomType: '' }));
                        }
                      }}
                      onFocus={() => setShowTypeDropdown(true)}
                      className={clsx(
                        "w-full pl-9 pr-8 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all text-sm",
                        errors.roomType ? "border-red-300" : "border-gray-200"
                      )}
                      placeholder="Search or type room type..."
                    />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {showTypeDropdown && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                      {filteredTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleTypeSelect(type)}
                          className={clsx(
                            "w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-indigo-50 transition-colors",
                            formData.roomType === type && "bg-indigo-50 text-indigo-700"
                          )}
                        >
                          {formData.roomType === type && (
                            <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                          )}
                          <span className={formData.roomType === type ? "font-medium" : "ml-6"}>
                            {type}
                          </span>
                        </button>
                      ))}

                      {showAddCustom && (
                        <button
                          type="button"
                          onClick={handleAddCustomType}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left text-indigo-600 hover:bg-indigo-50 border-t border-gray-100 font-medium transition-colors"
                        >
                          <Plus className="w-4 h-4 flex-shrink-0" />
                          Add &quot;{typeSearch.trim()}&quot;
                        </button>
                      )}

                      {filteredTypes.length === 0 && !showAddCustom && (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No matching types. Type to add your own.
                        </div>
                      )}
                    </div>
                  )}
                  {errors.roomType && (
                    <p className="text-xs text-red-500 mt-1">{errors.roomType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Status
                  </label>
                  <select
                    value={formData.roomStatus}
                    onChange={(e) => handleChange('roomStatus', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all text-sm"
                  >
                    {ROOM_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ({currencySymbol}) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={formData.pricePerNight}
                      onChange={(e) => handleChange('pricePerNight', e.target.value)}
                      className={clsx(
                        "w-full pl-9 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all text-sm",
                        errors.pricePerNight ? "border-red-300" : "border-gray-200"
                      )}
                      placeholder="e.g. 2500"
                    />
                  </div>
                  {errors.pricePerNight && (
                    <p className="text-xs text-red-500 mt-1">{errors.pricePerNight}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pricing Model <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.pricingModel}
                    onChange={(e) => handleChange('pricingModel', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all text-sm"
                  >
                    <option value="per_night">Per Night</option>
                    <option value="per_person">Per Person</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Occupancy <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.maxOccupancy}
                    onChange={(e) => handleChange('maxOccupancy', e.target.value)}
                    className={clsx(
                      "w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all text-sm",
                      errors.maxOccupancy ? "border-red-300" : "border-gray-200"
                    )}
                    placeholder="e.g. 2"
                  />
                  {errors.maxOccupancy && (
                    <p className="text-xs text-red-500 mt-1">{errors.maxOccupancy}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
                <input
                  type="text"
                  value={formData.facilities}
                  onChange={(e) => handleChange('facilities', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all text-sm"
                  placeholder="e.g. AC, Mini Bar, Lake View (comma separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Free Services</label>
                <input
                  type="text"
                  value={formData.freeServices}
                  onChange={(e) => handleChange('freeServices', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all text-sm"
                  placeholder="e.g. Free WiFi, Free Breakfast, Free Parking (comma separated)"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-md shadow-indigo-200"
                >
                  {isEditMode ? 'Save Changes' : 'Add Room'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
