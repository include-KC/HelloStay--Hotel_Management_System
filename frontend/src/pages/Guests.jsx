import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Plus, ChevronLeft, ChevronRight, Eye, Edit3, Trash2, XCircle, ArrowRight, Phone, MapPin, User, BedDouble, Mail, FileText } from 'lucide-react';
import { CURRENCY_SYMBOLS } from '../utils/currencies';

const ID_PROOF_TYPES = ['Aadhaar Card', 'Passport', 'Driving License', 'Voter ID', 'PAN Card', 'National ID'];

const INITIAL_GUEST = {
  name: '',
  phone: '',
  email: '',
  address: '',
  idProofType: 'Aadhaar Card',
  idProofNumber: '',
  nationality: '',
  dateOfBirth: '',
  gender: '',
  notes: '',
};

const ITEMS_PER_PAGE = 8;

export default function Guests() {
  const [guests, setGuests] = useState(() => {
    try {
      const saved = localStorage.getItem('helloStay_guests');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [bookings] = useState(() => {
    try {
      const saved = localStorage.getItem('helloStay_bookings');
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
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewGuest, setViewGuest] = useState(null);
  const [editingGuest, setEditingGuest] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_GUEST);
  const [formErrors, setFormErrors] = useState({});

  const saveGuests = (updated) => {
    setGuests(updated);
    localStorage.setItem('helloStay_guests', JSON.stringify(updated));
  };

  const getGuestStayHistory = (guestId) => {
    return bookings.filter(b =>
      b.guestName?.toLowerCase() === guests.find(g => g.id === guestId)?.name?.toLowerCase()
    );
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Guest name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const now = new Date().toISOString();
    if (editingGuest) {
      const updated = guests.map(g =>
        g.id === editingGuest.id ? { ...g, ...formData, updatedAt: now } : g
      );
      saveGuests(updated);
    } else {
      const newGuest = {
        id: Date.now(),
        ...formData,
        totalStays: 0,
        createdAt: now,
        updatedAt: now,
      };
      saveGuests([...guests, newGuest]);
    }
    setIsModalOpen(false);
    setEditingGuest(null);
    setFormData(INITIAL_GUEST);
    setFormErrors({});
  };

  const handleEdit = (guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      phone: guest.phone,
      email: guest.email || '',
      address: guest.address || '',
      idProofType: guest.idProofType || 'Aadhaar Card',
      idProofNumber: guest.idProofNumber || '',
      nationality: guest.nationality || '',
      dateOfBirth: guest.dateOfBirth || '',
      gender: guest.gender || '',
      notes: guest.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (guestId) => {
    saveGuests(guests.filter(g => g.id !== guestId));
    setDeletingId(null);
    setViewGuest(null);
  };

  const filteredGuests = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return guests.filter(g => {
      return !searchQuery ||
        g.name.toLowerCase().includes(q) ||
        g.phone.includes(searchQuery) ||
        (g.email && g.email.toLowerCase().includes(q)) ||
        (g.idProofNumber && g.idProofNumber.toLowerCase().includes(q));
    });
  }, [guests, searchQuery]);

  const totalPages = Math.ceil(filteredGuests.length / ITEMS_PER_PAGE);
  const paginatedGuests = filteredGuests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const stats = useMemo(() => ({
    total: guests.length,
    thisMonth: guests.filter(g => {
      const created = new Date(g.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length,
    withBookings: guests.filter(g => {
      return bookings.filter(b =>
        b.guestName?.toLowerCase() === g.name?.toLowerCase()
      ).length > 0;
    }).length,
    countries: [...new Set(guests.map(g => g.nationality).filter(Boolean))].length,
  }), [guests, bookings]);

  const openAddModal = () => {
    setEditingGuest(null);
    setFormData(INITIAL_GUEST);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStayCount = (guestName) => {
    return bookings.filter(b => b.guestName?.toLowerCase() === guestName?.toLowerCase()).length;
  };

  const getTotalSpent = (guestName) => {
    return bookings
      .filter(b => b.guestName?.toLowerCase() === guestName?.toLowerCase())
      .reduce((sum, b) => sum + (b.amountPaid || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guests</h1>
          <p className="text-sm text-gray-500 mt-1">Guest profiles, stay history, and identity records</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Guest
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Guests', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Added This Month', value: stats.thisMonth, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'With Bookings', value: stats.withBookings, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Nationalities', value: stats.countries, color: 'text-amber-600', bg: 'bg-amber-50' },
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

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email, or ID number..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-gray-50"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">{filteredGuests.length} guest{filteredGuests.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Guest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {paginatedGuests.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-500">No guests found</p>
              <p className="mt-1 text-xs text-gray-400">Add your first guest to get started</p>
              <button onClick={openAddModal} className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800">
                + Add Guest
              </button>
            </div>
          ) : (
            paginatedGuests.map((guest, index) => {
              const stayCount = getStayCount(guest.name);
              const totalSpent = getTotalSpent(guest.name);
              const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'];
              const avatarColor = colors[guest.name.charCodeAt(0) % colors.length];
              return (
                <motion.div
                  key={guest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 ${avatarColor} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                          {getInitials(guest.name)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{guest.name}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {guest.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setViewGuest(guest)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleEdit(guest)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {deletingId === guest.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(guest.id)} className="text-xs font-semibold text-red-600 px-2 py-1 rounded bg-red-50">Yes</button>
                            <button onClick={() => setDeletingId(null)} className="text-xs font-semibold text-gray-600 px-2 py-1 rounded bg-gray-100">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeletingId(guest.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-lg font-bold text-gray-900">{stayCount}</p>
                        <p className="text-[10px] font-medium text-gray-500 uppercase">Stays</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-lg font-bold text-gray-900">{currencySymbol}{totalSpent.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] font-medium text-gray-500 uppercase">Spent</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-lg font-bold text-gray-900">{guest.nationality || '—'}</p>
                        <p className="text-[10px] font-medium text-gray-500 uppercase">Country</p>
                      </div>
                    </div>

                    {guest.email && (
                      <p className="mt-3 text-xs text-gray-500 flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 flex-shrink-0" /> {guest.email}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredGuests.length)} of {filteredGuests.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) page = i + 1;
              else if (currentPage <= 3) page = i + 1;
              else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
              else page = currentPage - 2 + i;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${currentPage === page ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Guest Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingGuest ? 'Edit Guest' : 'Add New Guest'}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Personal Info */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Personal Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.name ? 'border-red-300' : 'border-gray-200'}`}
                        placeholder="John Smith"
                      />
                      {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFormChange('phone', e.target.value)}
                        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.phone ? 'border-red-300' : 'border-gray-200'}`}
                        placeholder="+91 XXXXX XXXXX"
                      />
                      {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.email ? 'border-red-300' : 'border-gray-200'}`}
                        placeholder="john@example.com"
                      />
                      {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleFormChange('gender', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleFormChange('dateOfBirth', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                      <input
                        type="text"
                        value={formData.nationality}
                        onChange={(e) => handleFormChange('nationality', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                        placeholder="Indian"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Address
                  </h4>
                  <textarea
                    rows="2"
                    value={formData.address}
                    onChange={(e) => handleFormChange('address', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                    placeholder="Full address..."
                  />
                </div>

                {/* Identity */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Identity Document
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                      <select
                        value={formData.idProofType}
                        onChange={(e) => handleFormChange('idProofType', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      >
                        {ID_PROOF_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                      <input
                        type="text"
                        value={formData.idProofNumber}
                        onChange={(e) => handleFormChange('idProofNumber', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                        placeholder="ID number"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows="2"
                    value={formData.notes}
                    onChange={(e) => handleFormChange('notes', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                    placeholder="VIP, allergies, preferences..."
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-200 text-sm flex items-center gap-2"
                >
                  {editingGuest ? 'Update Guest' : 'Add Guest'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Guest Details Modal */}
      <AnimatePresence>
        {viewGuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setViewGuest(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                      {getInitials(viewGuest.name)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{viewGuest.name}</h3>
                      <p className="text-blue-100 text-sm">{viewGuest.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => setViewGuest(null)} className="text-white/70 hover:text-white p-1">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Email', value: viewGuest.email || '—' },
                    { label: 'Gender', value: viewGuest.gender || '—' },
                    { label: 'Date of Birth', value: viewGuest.dateOfBirth || '—' },
                    { label: 'Nationality', value: viewGuest.nationality || '—' },
                    { label: 'ID Type', value: viewGuest.idProofType || '—' },
                    { label: 'ID Number', value: viewGuest.idProofNumber || '—' },
                    { label: 'Total Stays', value: getStayCount(viewGuest.name) },
                    { label: 'Total Spent', value: `${currencySymbol}${getTotalSpent(viewGuest.name).toLocaleString('en-IN')}` },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs font-medium text-gray-500 uppercase">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>

                {viewGuest.address && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Address</p>
                    <p className="text-sm text-gray-700">{viewGuest.address}</p>
                  </div>
                )}

                {viewGuest.notes && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <p className="text-xs font-medium text-amber-600 uppercase mb-1">Notes</p>
                    <p className="text-sm text-amber-800">{viewGuest.notes}</p>
                  </div>
                )}

                {/* Stay History */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Stay History</h4>
                  {getGuestStayHistory(viewGuest.id).length === 0 ? (
                    <p className="text-sm text-gray-400">No stays recorded</p>
                  ) : (
                    <div className="space-y-2">
                      {getGuestStayHistory(viewGuest.id).slice(0, 5).map(booking => (
                        <div key={booking.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center gap-3">
                            <BedDouble className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Room {booking.roomNumber}</p>
                              <p className="text-xs text-gray-500">{booking.checkInDate} → {booking.checkOutDate}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">{currencySymbol}{booking.totalAmount?.toLocaleString('en-IN')}</p>
                            <span className={`text-xs font-medium ${booking.status === 'Checked In' ? 'text-emerald-600' : booking.status === 'Reserved' ? 'text-blue-600' : 'text-gray-500'}`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                  Added: {new Date(viewGuest.createdAt).toLocaleString('en-IN')}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
