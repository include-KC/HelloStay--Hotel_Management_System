import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BedDouble } from 'lucide-react';
import clsx from 'clsx';

const ROOM_TYPES = ['Single', 'Double', 'Suite', 'Deluxe', 'Presidential'];
const ROOM_STATUSES = ['Available', 'Occupied', 'Cleaning', 'Reserved'];

const INITIAL_FORM = {
  roomNumber: '',
  roomType: 'Single',
  pricePerNight: '',
  maxOccupancy: '2',
  roomStatus: 'Available',
  facilities: '',
};

const INITIAL_ERRORS = {
  roomNumber: '',
  pricePerNight: '',
  maxOccupancy: '',
};

export default function AddRoomModal({ isOpen, onClose, onRoomAdded }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);

  const validate = () => {
    const newErrors = { ...INITIAL_ERRORS };
    let isValid = true;

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required.';
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

    const newRoom = {
      id: Date.now(),
      roomNumber: formData.roomNumber.trim(),
      roomType: formData.roomType,
      pricePerNight: parseFloat(formData.pricePerNight),
      maxOccupancy: parseInt(formData.maxOccupancy),
      roomStatus: formData.roomStatus,
      facilities: formData.facilities.trim(),
    };

    const existing = JSON.parse(localStorage.getItem('helloStay_rooms') || '[]');
    existing.push(newRoom);
    localStorage.setItem('helloStay_rooms', JSON.stringify(existing));

    setFormData(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
    onRoomAdded(newRoom);
    onClose();
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
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
                  <h2 className="text-lg font-bold">Add New Room</h2>
                  <p className="text-indigo-200 text-sm">Configure room details below</p>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => handleChange('roomType', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all text-sm"
                  >
                    {ROOM_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Per Night (\u20B9) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={formData.pricePerNight}
                    onChange={(e) => handleChange('pricePerNight', e.target.value)}
                    className={clsx(
                      "w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all text-sm",
                      errors.pricePerNight ? "border-red-300" : "border-gray-200"
                    )}
                    placeholder="e.g. 2500"
                  />
                  {errors.pricePerNight && (
                    <p className="text-xs text-red-500 mt-1">{errors.pricePerNight}</p>
                  )}
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
                  Add Room
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
