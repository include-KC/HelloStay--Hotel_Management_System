import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Search, Plus, ChevronLeft, ChevronRight, Eye, Trash2,
  Clock, CheckCircle, XCircle, LogOut, User, BedDouble, X, AlertCircle
} from 'lucide-react';
import clsx from 'clsx';
import { CURRENCY_SYMBOLS } from '../utils/currencies';
import BookingModal from '../components/modals/BookingModal';
import { createBookingWithGuest, updateBookingStatus, deleteBooking, triggerSync, getBookings, getRooms } from '../utils/dataStore';

const PAYMENT_STYLES = {
  'Pending': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', gradient: 'from-amber-50 to-orange-50' },
  'Partial': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', gradient: 'from-orange-50 to-yellow-50' },
  'Paid': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-50 to-green-50' },
  'Refunded': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', gradient: 'from-purple-50 to-pink-50' },
};

const BOOKING_STATUS_STYLES = {
  'Reserved': { gradient: 'from-blue-50 to-indigo-50', text: 'text-blue-700', border: 'border-blue-200', shadow: 'shadow-blue-100', iconColor: 'text-blue-500' },
  'Checked In': { gradient: 'from-emerald-50 to-green-50', text: 'text-emerald-700', border: 'border-emerald-200', shadow: 'shadow-emerald-100', iconColor: 'text-emerald-500' },
  'Checked Out': { gradient: 'from-gray-50 to-slate-100', text: 'text-gray-600', border: 'border-gray-200', shadow: 'shadow-gray-100', iconColor: 'text-gray-400' },
  'Cancelled': { gradient: 'from-red-50 to-rose-50', text: 'text-red-600', border: 'border-red-200', shadow: 'shadow-red-100', iconColor: 'text-red-400' },
};

const STATUS_CARDS = [
  { id: 'Reserved', label: 'Reservations', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', activeBg: 'bg-blue-100' },
  { id: 'Checked In', label: 'Checked In', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', activeBg: 'bg-emerald-100' },
  { id: 'Checked Out', label: 'Recently Checked Out', icon: LogOut, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', activeBg: 'bg-gray-100' },
  { id: 'Cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', activeBg: 'bg-red-100' },
];

const ITEMS_PER_PAGE = 8;

export default function Bookings() {
  const [bookings, setBookings] = useState(() => getBookings());
  const [rooms, setRooms] = useState(() => getRooms());

  const hotelData = useMemo(() => {
    try {
      const saved = localStorage.getItem('helloStay_hotelData');
      return saved ? JSON.parse(saved) : { currency: 'INR' };
    } catch { return { currency: 'INR' }; }
  }, []);

  const currencySymbol = useMemo(() => CURRENCY_SYMBOLS[hotelData.currency] || '₹', [hotelData.currency]);
  const recentCheckoutDays = hotelData.recentCheckoutDays || 7;
  const checkoutTime = hotelData.checkoutTime || '11:00';
  const chargeForLateCheckout = hotelData.chargeForLateCheckout !== false;
  const lateCheckoutFeeType = hotelData.lateCheckoutFeeType || 'flat';
  const lateCheckoutFee = hotelData.lateCheckoutFee || 0;

  const [searchQuery, setSearchQuery] = useState('');
  const [cardFilter, setCardFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [billingModal, setBillingModal] = useState(null);

  const userRole = localStorage.getItem('helloStay_userRole') || 'owner';
  const isOwner = userRole === 'owner';

  const handleBookingCreated = useCallback((newBooking) => {
    setBookings(prev => [...prev, newBooking]);
    triggerSync();
  }, []);

  const handleStatusChange = useCallback((bookingId, newStatus, paymentDetails = null) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (newStatus === 'Checked Out' && !paymentDetails) {
      setBillingModal(booking);
      return;
    }

    updateBookingStatus(bookingId, newStatus, paymentDetails);
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus, updatedAt: new Date().toISOString() } : b));
    triggerSync();
  }, [bookings, billingModal]);

  const handleBillingConfirm = useCallback((bookingId, extraCharge, totalAmount, amountPaid) => {
    const now = new Date().toISOString();
    updateBookingStatus(bookingId, 'Checked Out', { extraCharge, totalAmount, amountPaid });
    setBookings(prev => prev.map(b => b.id === bookingId ? { 
      ...b, 
      status: 'Checked Out', 
      actualCheckOut: now,
      totalAmount, 
      amountPaid, 
      paymentStatus: amountPaid >= totalAmount ? 'Paid' : amountPaid > 0 ? 'Partial' : 'Pending',
      extraCharge,
      updatedAt: now,
    } : b));
    setBillingModal(null);
    triggerSync();
  }, []);

  const handleDelete = useCallback((bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    deleteBooking(bookingId);
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    setDeletingId(null);
    triggerSync();
  }, [bookings]);

  const cardStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - recentCheckoutDays);
    const cutoffStr = cutoffDate.toISOString();

    return {
      reserved: bookings.filter(b => b.status === 'Reserved').length,
      checkedIn: bookings.filter(b => b.status === 'Checked In').length,
      recentCheckedOut: bookings.filter(b =>
        b.status === 'Checked Out' &&
        b.actualCheckOut &&
        b.actualCheckOut >= cutoffStr
      ).length,
      cancelled: bookings.filter(b => b.status === 'Cancelled').length,
      todayCheckIns: bookings.filter(b => b.checkInDate === today && b.status === 'Reserved').length,
      todayCheckOuts: bookings.filter(b =>
        b.checkOutDate === today && b.status === 'Checked In'
      ).length,
    };
  }, [bookings, recentCheckoutDays]);

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (cardFilter === 'Checked Out') {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - recentCheckoutDays);
      const cutoffStr = cutoffDate.toISOString();
      result = result.filter(b =>
        b.status === 'Checked Out' &&
        b.actualCheckOut &&
        b.actualCheckOut >= cutoffStr
      );
    } else if (cardFilter !== 'All') {
      result = result.filter(b => b.status === cardFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        (b.guestName || '').toLowerCase().includes(q) ||
        (b.roomNumber || '').toString().includes(q) ||
        (b.guestPhone || '').includes(q)
      );
    }

    result.sort((a, b) => {
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

    return result;
  }, [bookings, cardFilter, searchQuery, sortConfig, recentCheckoutDays]);

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
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
          onClick={() => setIsBookingModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Booking
        </motion.button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATUS_CARDS.map((card) => {
          const count = card.id === 'Checked Out' ? cardStats.recentCheckedOut : cardStats[card.id === 'Reserved' ? 'reserved' : card.id === 'Checked In' ? 'checkedIn' : 'cancelled'];
          const isActive = cardFilter === card.id;
          return (
            <motion.button
              key={card.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setCardFilter(isActive ? 'All' : card.id); setCurrentPage(1); }}
              className={clsx(
                "rounded-xl p-4 border text-left transition-all",
                isActive
                  ? `${card.activeBg} ${card.border} shadow-sm`
                  : `${card.bg} border-transparent hover:${card.border}`
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <card.icon className={`w-4 h-4 ${card.color}`} />
                <span className="text-xs font-medium text-gray-600">{card.label}</span>
              </div>
              <p className={`text-2xl font-bold ${card.color}`}>{count}</p>
            </motion.button>
          );
        })}
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
          {(searchQuery || cardFilter !== 'All') && (
            <button
              onClick={() => { setSearchQuery(''); setCardFilter('All'); setCurrentPage(1); }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <span>{filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {cardStats.reserved} Reserved
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {cardStats.checkedIn} Checked In
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
                        onClick={() => setIsBookingModalOpen(true)}
                        className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        + New Booking
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedBookings.map((booking, index) => (
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
                        {booking.checkInTime && <div className="text-xs text-gray-400">{booking.checkInTime}</div>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div>{booking.checkOutDate || 'At checkout'}</div>
                        {booking.checkOutTime && booking.checkOutDate && <div className="text-xs text-gray-400">{booking.checkOutTime}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-gray-900">{currencySymbol}{booking.totalAmount?.toLocaleString('en-IN')}</div>
                        {booking.amountPaid > 0 && booking.amountPaid < booking.totalAmount && (
                          <div className="text-xs text-amber-600">Paid: {currencySymbol}{booking.amountPaid.toLocaleString('en-IN')}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {(() => {
                          const st = BOOKING_STATUS_STYLES[booking.status] || BOOKING_STATUS_STYLES['Reserved'];
                          const StatusIcon = booking.status === 'Reserved' ? Clock
                            : booking.status === 'Checked In' ? CheckCircle
                            : booking.status === 'Checked Out' ? LogOut
                            : XCircle;
                          return (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-gradient-to-r ${st.gradient} ${st.text} ${st.border} shadow-sm ${st.shadow}`}>
                              <StatusIcon className={`w-3.5 h-3.5 ${st.iconColor}`} />
                              {booking.status}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${PAYMENT_STYLES[booking.paymentStatus]?.bg} ${PAYMENT_STYLES[booking.paymentStatus]?.text} ${PAYMENT_STYLES[booking.paymentStatus]?.border}`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {deletingId === booking.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(booking.id)} className="text-xs font-semibold text-red-600 hover:text-red-800 px-2 py-1 rounded-lg bg-red-50 border border-red-100 transition-colors">Yes</button>
                              <button onClick={() => setDeletingId(null)} className="text-xs font-semibold text-gray-600 hover:text-gray-800 px-2 py-1 rounded-lg bg-gray-100 border border-gray-200 transition-colors">No</button>
                            </div>
                          ) : (
                            <>
                              <button onClick={() => setViewBooking(booking)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                <Eye className="w-4 h-4" />
                              </button>
                              <select
                                value={booking.status}
                                onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                className="text-[10px] font-semibold px-1.5 py-1 rounded-md border border-gray-200 bg-white text-gray-600 cursor-pointer hover:bg-gray-50 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                title="Change Status"
                              >
                                {['Reserved', 'Checked In', 'Checked Out', 'Cancelled'].map(s => (
                                  <option key={s} value={s}>{s === 'Checked Out' ? 'Checkout' : s === 'Checked In' ? 'Check In' : s}</option>
                                ))}
                              </select>
                              {isOwner && (
                                <button onClick={() => setDeletingId(booking.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
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

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        rooms={rooms}
        bookings={bookings}
        currencySymbol={currencySymbol}
        onBookingCreated={handleBookingCreated}
      />

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
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Guest List */}
                {viewBooking.guests && viewBooking.guests.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Guests ({viewBooking.guests.length})</p>
                    <div className="space-y-2">
                      {viewBooking.guests.map((g, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm font-semibold text-gray-800">{g.name}</span>
                            {i === 0 && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-medium">Primary</span>}
                          </div>
                          <div className="text-xs text-gray-500 ml-5">
                            <p>{g.phone} • {g.address}</p>
                            <p>{g.idProofType}: {g.idProofNumber}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Phone', value: viewBooking.guestPhone },
                    { label: 'Check-in', value: `${viewBooking.checkInDate}${viewBooking.checkInTime ? ' ' + viewBooking.checkInTime : ''}` },
                    { label: 'Check-out', value: viewBooking.checkOutDate ? `${viewBooking.checkOutDate}${viewBooking.checkOutTime ? ' ' + viewBooking.checkOutTime : ''}` : 'At billing' },
                    { label: 'Adults', value: viewBooking.adults },
                    { label: 'Total Amount', value: `${currencySymbol}${viewBooking.totalAmount?.toLocaleString('en-IN')}` },
                    { label: 'Amount Paid', value: `${currencySymbol}${viewBooking.amountPaid?.toLocaleString('en-IN')}` },
                    { label: 'Payment', value: viewBooking.paymentStatus, style: PAYMENT_STYLES[viewBooking.paymentStatus] },
                    { label: 'Nights', value: calculateNights(viewBooking.checkInDate, viewBooking.checkOutDate) || 'TBD' },
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
                <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                  Created: {new Date(viewBooking.createdAt).toLocaleString('en-IN')}
                  {viewBooking.updatedAt && ` • Updated: ${new Date(viewBooking.updatedAt).toLocaleString('en-IN')}`}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Billing Modal */}
      <AnimatePresence>
        {billingModal && (
          <BillingModal
            booking={billingModal}
            currencySymbol={currencySymbol}
            checkoutTime={checkoutTime}
            chargeForLateCheckout={chargeForLateCheckout}
            lateCheckoutFeeType={lateCheckoutFeeType}
            lateCheckoutFee={lateCheckoutFee}
            onConfirm={handleBillingConfirm}
            onCancel={() => setBillingModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function BillingModal({ booking, currencySymbol, checkoutTime, chargeForLateCheckout, lateCheckoutFeeType, lateCheckoutFee, onConfirm, onCancel }) {
  const [extraCharge, setExtraCharge] = useState(0);
  const [finalAmountPaid, setFinalAmountPaid] = useState(booking.amountPaid || 0);

  const nights = useMemo(() => {
    if (!booking.checkInDate || !booking.checkOutDate) return 1;
    const diff = new Date(booking.checkOutDate) - new Date(booking.checkInDate);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [booking.checkInDate, booking.checkOutDate]);

  const baseAmount = booking.bookingAmount || booking.totalAmount || 0;

  const calculatedExtraCharge = useMemo(() => {
    if (!chargeForLateCheckout) return 0;
    if (!booking.actualCheckIn) return 0;

    const now = new Date();
    const [hours, minutes] = checkoutTime.split(':').map(Number);
    const checkoutDeadline = new Date(now);
    checkoutDeadline.setHours(hours, minutes, 0, 0);

    if (now > checkoutDeadline) {
      if (lateCheckoutFeeType === 'hourly') {
        const overdueMinutes = Math.max(0, (now - checkoutDeadline) / (1000 * 60));
        const overdueHours = Math.ceil(overdueMinutes / 60);
        return overdueHours * lateCheckoutFee;
      }
      if (lateCheckoutFeeType === 'room_rate') {
        return booking.roomRate || booking.pricePerNight || booking.totalAmount || 0;
      }
      return lateCheckoutFee;
    }
    return 0;
  }, [chargeForLateCheckout, checkoutTime, lateCheckoutFeeType, lateCheckoutFee, booking.actualCheckIn, booking.roomRate, booking.pricePerNight, booking.totalAmount]);

  const totalAmount = baseAmount + (chargeForLateCheckout ? extraCharge : 0);
  const balanceDue = totalAmount - finalAmountPaid;

  const handleConfirm = () => {
    onConfirm(booking.id, chargeForLateCheckout ? extraCharge : 0, totalAmount, finalAmountPaid);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Checkout & Billing</h3>
              <p className="text-blue-100 text-sm mt-0.5">Room {booking.roomNumber} — {booking.guestName}</p>
            </div>
            <button onClick={onCancel} className="text-white/70 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Stay Summary */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Check-in:</span>
              <span className="font-medium text-gray-800">{booking.checkInDate} {booking.checkInTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Expected Check-out:</span>
              <span className="font-medium text-gray-800">{booking.checkOutDate || 'Not set'} {booking.checkOutTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Actual Check-out:</span>
              <span className="font-medium text-gray-800">{new Date().toLocaleDateString('en-IN')} {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Charges Breakdown */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">Charges Breakdown</h4>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              <div className="flex justify-between p-3">
                <span className="text-sm text-gray-600">Base charges ({nights} nights)</span>
                <span className="text-sm font-semibold text-gray-800">{currencySymbol}{baseAmount.toLocaleString('en-IN')}</span>
              </div>
              {chargeForLateCheckout && (
                <div className="flex justify-between p-3">
                  <div>
                    <span className="text-sm text-gray-600">Late checkout fee</span>
                    {calculatedExtraCharge > 0 && extraCharge === 0 && (
                      <span className="text-xs text-amber-600 ml-2">(suggested: {currencySymbol}{calculatedExtraCharge})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">{currencySymbol}{extraCharge.toLocaleString('en-IN')}</span>
                    <input
                      type="number"
                      min="0"
                      value={extraCharge}
                      onChange={(e) => setExtraCharge(Number(e.target.value) || 0)}
                      className="w-20 p-1.5 border border-gray-200 rounded-lg text-xs text-right focus:ring-2 focus:ring-blue-500 outline-none"
                      title="Edit late checkout charge"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-between p-3 bg-gray-50 rounded-b-xl">
                <span className="text-sm font-bold text-gray-800">Total</span>
                <span className="text-sm font-bold text-gray-800">{currencySymbol}{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">Payment</h4>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              <div className="flex justify-between p-3">
                <span className="text-sm text-gray-600">Already Paid</span>
                <span className="text-sm font-semibold text-emerald-600">{currencySymbol}{booking.amountPaid?.toLocaleString('en-IN') || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3">
                <span className="text-sm text-gray-600">Final Payment</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{currencySymbol}</span>
                  <input
                    type="number"
                    min="0"
                    value={finalAmountPaid}
                    onChange={(e) => setFinalAmountPaid(Number(e.target.value) || 0)}
                    className="w-28 p-1.5 border border-gray-200 rounded-lg text-sm text-right focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-b-xl">
                <span className="text-sm font-bold text-gray-800">Balance Due</span>
                <span className={`text-sm font-bold ${balanceDue > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {currencySymbol}{balanceDue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Confirm */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Confirm Checkout
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
