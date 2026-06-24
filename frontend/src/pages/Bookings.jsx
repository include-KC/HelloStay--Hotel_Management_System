import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Search, Plus, ChevronLeft, ChevronRight, Eye, Edit3, Trash2, CheckCircle, XCircle, Clock, ArrowRight, User, BedDouble, CreditCard } from 'lucide-react';
import { CURRENCY_SYMBOLS } from '../utils/currencies';

const BOOKING_STATUSES = ['All', 'Reserved', 'Checked In', 'Checked Out', 'Cancelled'];
const PAYMENT_STATUSES = ['All', 'Pending', 'Partial', 'Paid', 'Refunded'];

const STATUS_STYLES = {
  'Reserved': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Clock },
  'Checked In': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
  'Checked Out': { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', icon: XCircle },
  'Cancelled': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle },
};

const PAYMENT_STYLES = {
  'Pending': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Partial': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Paid': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Refunded': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

const INITIAL_BOOKING = {
  guestName: '',
  guestPhone: '',
  roomId: '',
  roomNumber: '',
  checkInDate: '',
  checkOutDate: '',
  adults: 1,
  children: 0,
  totalAmount: 0,
  amountPaid: 0,
  paymentStatus: 'Pending',
  specialRequests: '',
};

const ITEMS_PER_PAGE = 8;

export default function Bookings() {
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('helloStay_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [rooms, setRooms] = useState(() => {
    try {
      const saved = localStorage.getItem('helloStay_rooms');
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
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_BOOKING);
  const [formErrors, setFormErrors] = useState({});

  const saveBookings = (updated) => {
    setBookings(updated);
    localStorage.setItem('helloStay_bookings', JSON.stringify(updated));
  };

  const syncRoomStatus = (roomId, newRoomStatus) => {
    setRooms(prev => {
      const updated = prev.map(r =>
        r.id === roomId ? { ...r, roomStatus: newRoomStatus } : r
      );
      localStorage.setItem('helloStay_rooms', JSON.stringify(updated));
      return updated;
    });
  };

  const getRoomAvailableStatus = (roomId, checkIn, checkOut, excludeBookingId = null) => {
    const conflicting = bookings.find(b =>
      b.roomId === roomId &&
      b.id !== excludeBookingId &&
      b.status !== 'Cancelled' &&
      b.status !== 'Checked Out' &&
      checkIn < b.checkOutDate &&
      checkOut > b.checkInDate
    );
    return !conflicting;
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const calculateTotal = (roomId, checkIn, checkOut) => {
    const room = rooms.find(r => r.id === parseInt(roomId));
    if (!room) return 0;
    const nights = calculateNights(checkIn, checkOut);
    return nights * room.pricePerNight;
  };

  const handleFormChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    if (field === 'roomId' && value) {
      const room = rooms.find(r => r.id === parseInt(value));
      if (room) {
        updated.roomNumber = room.roomNumber;
        updated.totalAmount = calculateTotal(value, updated.checkInDate, updated.checkOutDate);
      }
    }
    if ((field === 'checkInDate' || field === 'checkOutDate') && updated.roomId) {
      updated.totalAmount = calculateTotal(updated.roomId, updated.checkInDate, updated.checkOutDate);
    }
    if (field === 'adults' || field === 'children') {
      const room = rooms.find(r => r.id === parseInt(updated.roomId));
      const totalGuests = parseInt(updated.adults || 0) + parseInt(updated.children || 0);
      if (room && room.maxOccupancy && totalGuests > room.maxOccupancy) {
        setFormErrors(prev => ({ ...prev, guests: `Max occupancy for ${room.roomNumber} is ${room.maxOccupancy}` }));
      } else {
        setFormErrors(prev => ({ ...prev, guests: '' }));
      }
    }
    setFormData(updated);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.guestName.trim()) errors.guestName = 'Guest name is required';
    if (!formData.guestPhone.trim()) errors.guestPhone = 'Phone number is required';
    if (!formData.roomId) errors.roomId = 'Select a room';
    if (!formData.checkInDate) errors.checkInDate = 'Check-in date is required';
    if (!formData.checkOutDate) errors.checkOutDate = 'Check-out date is required';
    if (formData.checkInDate && formData.checkOutDate && formData.checkInDate >= formData.checkOutDate) {
      errors.checkOutDate = 'Check-out must be after check-in';
    }
    if (formData.roomId && formData.checkInDate && formData.checkOutDate) {
      const isAvailable = getRoomAvailableStatus(
        parseInt(formData.roomId), formData.checkInDate, formData.checkOutDate,
        editingBooking?.id
      );
      if (!isAvailable) errors.roomId = 'Room is not available for selected dates';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const now = new Date().toISOString();
    if (editingBooking) {
      const updated = bookings.map(b =>
        b.id === editingBooking.id
          ? { ...b, ...formData, updatedAt: now }
          : b
      );
      saveBookings(updated);
    } else {
      const newBooking = {
        id: Date.now(),
        ...formData,
        status: 'Reserved',
        createdAt: now,
        updatedAt: now,
      };
      saveBookings([...bookings, newBooking]);
      syncRoomStatus(parseInt(formData.roomId), 'Reserved');
    }
    setIsModalOpen(false);
    setEditingBooking(null);
    setFormData(INITIAL_BOOKING);
    setFormErrors({});
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setFormData({
      guestName: booking.guestName,
      guestPhone: booking.guestPhone,
      roomId: booking.roomId,
      roomNumber: booking.roomNumber,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      adults: booking.adults,
      children: booking.children,
      totalAmount: booking.totalAmount,
      amountPaid: booking.amountPaid,
      paymentStatus: booking.paymentStatus,
      specialRequests: booking.specialRequests,
    });
    setIsModalOpen(true);
  };

  const handleStatusChange = (bookingId, newStatus) => {
    const now = new Date().toISOString();
    const updated = bookings.map(b =>
      b.id === bookingId
        ? {
          ...b,
          status: newStatus,
          ...(newStatus === 'Checked In' ? { actualCheckIn: now } : {}),
          ...(newStatus === 'Checked Out' ? { actualCheckOut: now } : {}),
          updatedAt: now,
        }
        : b
    );
    saveBookings(updated);

    const booking = updated.find(b => b.id === bookingId);
    if (!booking) return;

    if (newStatus === 'Checked In') {
      syncRoomStatus(booking.roomId, 'Occupied');
    } else if (newStatus === 'Checked Out') {
      syncRoomStatus(booking.roomId, 'Cleaning');
    } else if (newStatus === 'Cancelled') {
      const hasOtherActive = updated.some(b =>
        b.roomId === booking.roomId &&
        b.id !== bookingId &&
        b.status !== 'Cancelled' &&
        b.status !== 'Checked Out'
      );
      if (!hasOtherActive) {
        syncRoomStatus(booking.roomId, 'Available');
      }
    }
  };

  const handlePaymentUpdate = (bookingId, amount) => {
    const now = new Date().toISOString();
    const updated = bookings.map(b => {
      if (b.id !== bookingId) return b;
      const newAmountPaid = b.amountPaid + amount;
      const paymentStatus = newAmountPaid >= b.totalAmount ? 'Paid'
        : newAmountPaid > 0 ? 'Partial'
          : 'Pending';
      return { ...b, amountPaid: newAmountPaid, paymentStatus, updatedAt: now };
    });
    saveBookings(updated);
  };

  const handleDelete = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    saveBookings(bookings.filter(b => b.id !== bookingId));
    setDeletingId(null);

    if (booking && booking.status !== 'Checked Out' && booking.status !== 'Cancelled') {
      const hasOtherActive = bookings.some(b =>
        b.roomId === booking.roomId &&
        b.id !== bookingId &&
        b.status !== 'Cancelled' &&
        b.status !== 'Checked Out'
      );
      if (!hasOtherActive) {
        syncRoomStatus(booking.roomId, 'Available');
      }
    }
  };

  const sortedBookings = useMemo(() => {
    const sorted = [...bookings];
    sorted.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (sortConfig.key === 'guestName' || sortConfig.key === 'roomNumber') {
        aVal = (aVal || '').toString().toLowerCase();
        bVal = (bVal || '').toString().toLowerCase();
      }
      if (sortConfig.key === 'totalAmount' || sortConfig.key === 'amountPaid') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [bookings, sortConfig]);

  const filteredBookings = useMemo(() => {
    return sortedBookings.filter(b => {
      const matchSearch = !searchQuery ||
        b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.roomNumber.toString().includes(searchQuery) ||
        b.guestPhone.includes(searchQuery);
      const matchStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchPayment = paymentFilter === 'All' || b.paymentStatus === paymentFilter;
      const matchDate = !dateFilter ||
        b.checkInDate === dateFilter ||
        b.checkOutDate === dateFilter;
      return matchSearch && matchStatus && matchPayment && matchDate;
    });
  }, [sortedBookings, searchQuery, statusFilter, paymentFilter, dateFilter]);

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      total: bookings.length,
      reserved: bookings.filter(b => b.status === 'Reserved').length,
      checkedIn: bookings.filter(b => b.status === 'Checked In').length,
      checkedOut: bookings.filter(b => b.status === 'Checked Out').length,
      todayCheckIns: bookings.filter(b => b.checkInDate === today && b.status === 'Reserved').length,
      todayCheckOuts: bookings.filter(b => b.checkOutDate === today && b.status === 'Checked In').length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
      pendingAmount: bookings.reduce((sum, b) => sum + ((b.totalAmount || 0) - (b.amountPaid || 0)), 0),
    };
  }, [bookings]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
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

  const openAddModal = () => {
    setEditingBooking(null);
    setFormData(INITIAL_BOOKING);
    setFormErrors({});
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage reservations, check-ins, and check-outs</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Booking
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Today\'s Check-ins', value: stats.todayCheckIns, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Today\'s Check-outs', value: stats.todayCheckOuts, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Revenue', value: `${currencySymbol}${stats.totalRevenue.toLocaleString('en-IN')}`, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Pending Amount', value: `${currencySymbol}${stats.pendingAmount.toLocaleString('en-IN')}`, color: 'text-amber-600', bg: 'bg-amber-50' },
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

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by guest, room, or phone..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-gray-50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
          >
            {BOOKING_STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => { setPaymentFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
          >
            {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Payments' : s}</option>)}
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {(searchQuery || statusFilter !== 'All' || paymentFilter !== 'All' || dateFilter) && (
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('All'); setPaymentFilter('All'); setDateFilter(''); setCurrentPage(1); }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <span>{filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {stats.reserved} Reserved
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {stats.checkedIn} Checked In
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {[
                  { key: 'guestName', label: 'Guest' },
                  { key: 'roomNumber', label: 'Room' },
                  { key: 'checkInDate', label: 'Check-in' },
                  { key: 'checkOutDate', label: 'Check-out' },
                  { key: 'totalAmount', label: 'Amount' },
                  { key: 'status', label: 'Status' },
                  { key: 'paymentStatus', label: 'Payment' },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      <SortIcon columnKey={col.key} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {paginatedBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-16 text-center">
                      <CalendarDays className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-3 text-sm font-medium text-gray-500">No bookings found</p>
                      <p className="mt-1 text-xs text-gray-400">Create your first booking to get started</p>
                      <button
                        onClick={openAddModal}
                        className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        + New Booking
                      </button>
                    </td>
                  </tr>
                  ) : (
                    paginatedBookings.map((booking, index) => {
                      return (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{booking.guestName}</p>
                            <p className="text-xs text-gray-500">{booking.guestPhone}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700">
                            <BedDouble className="w-4 h-4 text-gray-400" />
                            {booking.roomNumber}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div>{booking.checkInDate}</div>
                          <div className="text-xs text-gray-400">{booking.adults}A {booking.children > 0 ? `+ ${booking.children}C` : ''}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{booking.checkOutDate}</td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold text-gray-900">{currencySymbol}{booking.totalAmount?.toLocaleString('en-IN')}</div>
                          {booking.amountPaid > 0 && booking.amountPaid < booking.totalAmount && (
                            <div className="text-xs text-amber-600">Paid: {currencySymbol}{booking.amountPaid.toLocaleString('en-IN')}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {deletingId === booking.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(booking.id)} className="text-xs font-semibold text-red-600 hover:text-red-800 px-2 py-1 rounded bg-red-50">Yes</button>
                              <button onClick={() => setDeletingId(null)} className="text-xs font-semibold text-gray-600 hover:text-gray-800 px-2 py-1 rounded bg-gray-100">No</button>
                            </div>
                          ) : (
                            <select
                              value={booking.status}
                              onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[booking.status]?.bg} ${STATUS_STYLES[booking.status]?.text} ${STATUS_STYLES[booking.status]?.border} appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none`}
                            >
                              {['Reserved', 'Checked In', 'Checked Out', 'Cancelled'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${PAYMENT_STYLES[booking.paymentStatus]?.bg} ${PAYMENT_STYLES[booking.paymentStatus]?.text} ${PAYMENT_STYLES[booking.paymentStatus]?.border}`}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {deletingId !== booking.id && (
                            <div className="flex items-center gap-1">
                              <button onClick={() => setViewBooking(booking)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleEdit(booking)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button onClick={() => setDeletingId(booking.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)} of {filteredBookings.length}
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
      </div>

      {/* Booking Modal (Add/Edit) */}
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
                    {editingBooking ? 'Edit Booking' : 'New Booking'}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Guest Info */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Guest Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={formData.guestName}
                        onChange={(e) => handleFormChange('guestName', e.target.value)}
                        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.guestName ? 'border-red-300' : 'border-gray-200'}`}
                        placeholder="John Smith"
                      />
                      {formErrors.guestName && <p className="text-xs text-red-500 mt-1">{formErrors.guestName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={formData.guestPhone}
                        onChange={(e) => handleFormChange('guestPhone', e.target.value)}
                        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.guestPhone ? 'border-red-300' : 'border-gray-200'}`}
                        placeholder="+91 XXXXX XXXXX"
                      />
                      {formErrors.guestPhone && <p className="text-xs text-red-500 mt-1">{formErrors.guestPhone}</p>}
                    </div>
                  </div>
                </div>

                {/* Room & Dates */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <BedDouble className="w-4 h-4" /> Room & Dates
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room *</label>
                      <select
                        value={formData.roomId}
                        onChange={(e) => handleFormChange('roomId', e.target.value)}
                        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.roomId ? 'border-red-300' : 'border-gray-200'}`}
                      >
                        <option value="">Select a room</option>
                        {rooms.filter(r => r.roomStatus !== 'Maintenance').map(r => (
                          <option key={r.id} value={r.id}>
                            {r.roomNumber} - {r.roomType} ({currencySymbol}{r.pricePerNight?.toLocaleString('en-IN')}/night)
                          </option>
                        ))}
                      </select>
                      {formErrors.roomId && <p className="text-xs text-red-500 mt-1">{formErrors.roomId}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-in *</label>
                      <input
                        type="date"
                        value={formData.checkInDate}
                        onChange={(e) => handleFormChange('checkInDate', e.target.value)}
                        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.checkInDate ? 'border-red-300' : 'border-gray-200'}`}
                      />
                      {formErrors.checkInDate && <p className="text-xs text-red-500 mt-1">{formErrors.checkInDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-out *</label>
                      <input
                        type="date"
                        value={formData.checkOutDate}
                        onChange={(e) => handleFormChange('checkOutDate', e.target.value)}
                        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.checkOutDate ? 'border-red-300' : 'border-gray-200'}`}
                      />
                      {formErrors.checkOutDate && <p className="text-xs text-red-500 mt-1">{formErrors.checkOutDate}</p>}
                    </div>
                    <div className="flex items-end">
                      {formData.checkInDate && formData.checkOutDate && (
                        <div className="w-full p-3 bg-blue-50 rounded-xl border border-blue-200 text-sm">
                          <span className="font-semibold text-blue-700">
                            {calculateNights(formData.checkInDate, formData.checkOutDate)} night{calculateNights(formData.checkInDate, formData.checkOutDate) !== 1 ? 's' : ''}
                          </span>
                          <span className="text-blue-600 ml-2">
                            × {currencySymbol}{rooms.find(r => r.id === parseInt(formData.roomId))?.pricePerNight?.toLocaleString('en-IN') || '0'}
                          </span>
                          <div className="font-bold text-blue-800 mt-1">
                            Total: {currencySymbol}{formData.totalAmount?.toLocaleString('en-IN')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Guests & Payment */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Guests & Payment
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.adults}
                        onChange={(e) => handleFormChange('adults', e.target.value)}
                        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.guests ? 'border-red-300' : 'border-gray-200'}`}
                      />
                      {formErrors.guests && <p className="text-xs text-red-500 mt-1">{formErrors.guests}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={formData.children}
                        onChange={(e) => handleFormChange('children', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.amountPaid}
                        onChange={(e) => handleFormChange('amountPaid', Number(e.target.value))}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                      <select
                        value={formData.paymentStatus}
                        onChange={(e) => handleFormChange('paymentStatus', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      >
                        {['Pending', 'Partial', 'Paid', 'Refunded'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                      <textarea
                        rows="2"
                        value={formData.specialRequests}
                        onChange={(e) => handleFormChange('specialRequests', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                        placeholder="Late check-in, extra towels, etc."
                      />
                    </div>
                  </div>
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
                  {editingBooking ? 'Update Booking' : 'Create Booking'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Booking Details Modal */}
      <AnimatePresence>
        {viewBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setViewBooking(null)}
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
                  <div>
                    <h3 className="text-xl font-bold">{viewBooking.guestName}</h3>
                    <p className="text-blue-100 text-sm mt-1">Room {viewBooking.roomNumber}</p>
                  </div>
                  <button onClick={() => setViewBooking(null)} className="text-white/70 hover:text-white p-1">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Phone', value: viewBooking.guestPhone },
                    { label: 'Status', value: viewBooking.status, style: STATUS_STYLES[viewBooking.status] },
                    { label: 'Check-in', value: viewBooking.checkInDate },
                    { label: 'Check-out', value: viewBooking.checkOutDate },
                    { label: 'Adults', value: viewBooking.adults },
                    { label: 'Children', value: viewBooking.children || 0 },
                    { label: 'Total Amount', value: `${currencySymbol}${viewBooking.totalAmount?.toLocaleString('en-IN')}` },
                    { label: 'Amount Paid', value: `${currencySymbol}${viewBooking.amountPaid?.toLocaleString('en-IN')}` },
                    { label: 'Payment', value: viewBooking.paymentStatus, style: PAYMENT_STYLES[viewBooking.paymentStatus] },
                    { label: 'Nights', value: calculateNights(viewBooking.checkInDate, viewBooking.checkOutDate) },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs font-medium text-gray-500 uppercase">{item.label}</p>
                      {item.style ? (
                        <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${item.style.bg} ${item.style.text} ${item.style.border}`}>
                          {item.value}
                        </span>
                      ) : (
                        <p className="text-sm font-semibold text-gray-900 mt-1">{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>
                {viewBooking.specialRequests && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Special Requests</p>
                    <p className="text-sm text-gray-700">{viewBooking.specialRequests}</p>
                  </div>
                )}
                {viewBooking.status === 'Checked In' && (
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <p className="text-sm font-semibold text-emerald-700 mb-2">Record Payment</p>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        id="paymentAmount"
                        placeholder="Amount"
                        className="flex-1 p-2 border border-emerald-200 rounded-lg text-sm bg-white"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById('paymentAmount');
                          const amount = parseFloat(input.value);
                          if (amount > 0) {
                            handlePaymentUpdate(viewBooking.id, amount);
                            setViewBooking({ ...viewBooking, amountPaid: viewBooking.amountPaid + amount });
                            input.value = '';
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
                      >
                        Add Payment
                      </button>
                    </div>
                  </div>
                )}
                <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                  Created: {new Date(viewBooking.createdAt).toLocaleString('en-IN')}
                  {viewBooking.updatedAt && ` • Updated: ${new Date(viewBooking.updatedAt).toLocaleString('en-IN')}`}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
