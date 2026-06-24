import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BedDouble, Clock, CheckCircle, XCircle, Wrench, SprayCan, User, CalendarDays } from 'lucide-react';
import clsx from 'clsx';

const STATUS_STYLES = {
  Available: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
  Occupied: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle },
  Cleaning: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: SprayCan },
  Reserved: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Clock },
  Maintenance: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Wrench },
};

const MANUAL_STATUS_OPTIONS = ['Available', 'Maintenance', 'Cleaning'];

const BOOKING_STATUS_STYLES = {
  'Reserved': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Checked In': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

export default function RoomStatusSidebar({ isOpen, onClose, room, bookings, currencySymbol, onStatusChange }) {
  const userRole = localStorage.getItem('helloStay_userRole') || 'owner';
  const canOverrideStatus = userRole === 'owner' || userRole === 'manager';

  const upcomingReservations = useMemo(() => {
    if (!room || !bookings) return [];
    const today = new Date().toISOString().split('T')[0];
    return bookings
      .filter(b =>
        b.roomId === room.id &&
        (b.status === 'Reserved' || b.status === 'Checked In') &&
        (b.checkOutDate >= today || !b.checkOutDate)
      )
      .sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate));
  }, [room, bookings]);

  if (!room) return null;

  const statusStyle = STATUS_STYLES[room.roomStatus] || STATUS_STYLES.Available;
  const StatusIcon = statusStyle.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-indigo-600 p-5 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Room {room.roomNumber}</h2>
                  <p className="text-indigo-200 text-sm">{room.roomType}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Current Status */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Current Status</h3>
                {canOverrideStatus ? (
                  <select
                    value={room.roomStatus}
                    onChange={(e) => onStatusChange(room.id, e.target.value)}
                    className={clsx(
                      'w-full px-4 py-3 rounded-xl border text-sm font-semibold appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none transition-all',
                      statusStyle.bg, statusStyle.text, statusStyle.border
                    )}
                  >
                    {MANUAL_STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                ) : (
                  <div className={clsx(
                    'inline-flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold',
                    statusStyle.bg, statusStyle.text, statusStyle.border
                  )}>
                    <StatusIcon className="w-4 h-4" />
                    {room.roomStatus}
                  </div>
                )}
              </div>

              {/* Room Details */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Room Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-500">Price / Night</p>
                    <p className="text-sm font-bold text-gray-800 mt-0.5">{currencySymbol}{room.pricePerNight?.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-500">Max Occupancy</p>
                    <p className="text-sm font-bold text-gray-800 mt-0.5">{room.maxOccupancy} guests</p>
                  </div>
                </div>
                {room.facilities && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1.5">Facilities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {room.facilities.split(',').map((f, i) => (
                        <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-lg border border-indigo-100">
                          {f.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {room.freeServices && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1.5">Free Services</p>
                    <div className="flex flex-wrap gap-1.5">
                      {room.freeServices.split(',').map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-100">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Upcoming Reservations */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Upcoming Reservations ({upcomingReservations.length})
                </h3>
                {upcomingReservations.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <CalendarDays className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No upcoming reservations</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {upcomingReservations.map(b => {
                      const bookingStyle = BOOKING_STATUS_STYLES[b.status] || BOOKING_STATUS_STYLES.Reserved;
                      return (
                        <div
                          key={b.id}
                          className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 hover:border-indigo-100 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-indigo-600" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{b.guestName}</p>
                                <p className="text-xs text-gray-500">{b.guestPhone}</p>
                              </div>
                            </div>
                            <span className={clsx(
                              'text-xs font-semibold px-2 py-0.5 rounded-full border',
                              bookingStyle.bg, bookingStyle.text, bookingStyle.border
                            )}>
                              {b.status}
                            </span>
                          </div>
                          <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Check-in: </span>
                              <span className="font-medium text-gray-700">{b.checkInDate}</span>
                              {b.checkInTime && <span className="text-gray-500"> {b.checkInTime}</span>}
                            </div>
                            <div>
                              <span className="text-gray-500">Check-out: </span>
                              <span className="font-medium text-gray-700">
                                {b.checkOutDate || 'At checkout'}
                              </span>
                              {b.checkOutTime && b.checkOutDate && <span className="text-gray-500"> {b.checkOutTime}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
