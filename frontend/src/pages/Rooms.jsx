import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, BedDouble, Pencil, Trash2, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, Users, Filter, Wrench, SprayCan
} from 'lucide-react';
import clsx from 'clsx';
import AddRoomModal from '../components/modals/AddRoomModal';
import { CURRENCY_SYMBOLS } from '../utils/currencies';

const STATUS_STYLES = {
  Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Occupied: 'bg-red-50 text-red-700 border-red-200',
  Cleaning: 'bg-orange-50 text-orange-700 border-orange-200',
  Reserved: 'bg-blue-50 text-blue-700 border-blue-200',
  Maintenance: 'bg-amber-50 text-amber-700 border-amber-200',
};

const MANUAL_STATUS_OPTIONS = ['Available', 'Maintenance', 'Cleaning'];

const ROWS_PER_PAGE = 10;

export default function Rooms() {
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('helloStay_rooms');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'roomNumber', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);

  const userRole = localStorage.getItem('helloStay_userRole') || 'owner';
  const canOverrideStatus = userRole === 'owner' || userRole === 'manager';

  const currencySymbol = useMemo(() => {
    const saved = localStorage.getItem('helloStay_hotelData');
    const data = saved ? JSON.parse(saved) : {};
    return CURRENCY_SYMBOLS[data.currency] || '₹';
  }, []);

  const handleRoomAdded = (newRoom) => {
    setRooms(prev => [...prev, newRoom]);
    setCurrentPage(1);
  };

  const handleRoomUpdated = (updatedRoom) => {
    setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleDelete = (roomId) => {
    setDeletingId(roomId);
  };

  const confirmDelete = (roomId) => {
    const updated = rooms.filter(r => r.id !== roomId);
    setRooms(updated);
    localStorage.setItem('helloStay_rooms', JSON.stringify(updated));
    setDeletingId(null);
    const totalPages = Math.ceil(updated.length / ROWS_PER_PAGE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  };

  const handleStatusChange = (roomId, newStatus) => {
    const updated = rooms.map(r =>
      r.id === roomId ? { ...r, roomStatus: newStatus } : r
    );
    setRooms(updated);
    localStorage.setItem('helloStay_rooms', JSON.stringify(updated));
    setEditingStatusId(null);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5" />
      : <ChevronDown className="w-3.5 h-3.5" />;
  };

  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.roomNumber.toLowerCase().includes(q) ||
        r.roomType.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(r => r.roomStatus === statusFilter);
    }

    result.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [rooms, searchQuery, statusFilter, sortConfig]);

  const totalPages = Math.ceil(filteredRooms.length / ROWS_PER_PAGE);
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <BedDouble className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Room Management</h1>
            <p className="text-sm text-gray-500">{rooms.length} rooms configured</p>
          </div>
        </div>
        <button
          onClick={() => { setEditingRoom(null); setIsModalOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-colors shadow-md shadow-indigo-200 flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Room
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 w-full transition-all"
              placeholder="Search by room number or type..."
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 appearance-none cursor-pointer transition-all"
            >
              <option value="All">All Status</option>
              {Object.keys(STATUS_STYLES).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {paginatedRooms.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <BedDouble className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-1">
              {rooms.length === 0 ? 'No rooms yet' : 'No rooms match your search'}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {rooms.length === 0
                ? 'Add your first room to get started.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {rooms.length === 0 && (
              <button
                onClick={() => { setEditingRoom(null); setIsModalOpen(true); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-colors shadow-md shadow-indigo-200 flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add First Room
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    {[
                      { key: 'roomNumber', label: 'Room No.' },
                      { key: 'roomType', label: 'Type' },
                      { key: 'pricePerNight', label: 'Price/Night' },
                      { key: 'roomStatus', label: 'Status' },
                      { key: 'maxOccupancy', label: 'Occupancy' },
                    ].map(col => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          {col.label}
                          <SortIcon columnKey={col.key} />
                        </div>
                      </th>
                    ))}
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedRooms.map((room, i) => (
                    <motion.tr
                      key={room.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-gray-800">{room.roomNumber}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600">{room.roomType}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-gray-800">
                          {currencySymbol}{room.pricePerNight.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {canOverrideStatus && editingStatusId === room.id ? (
                          <select
                            autoFocus
                            value={room.roomStatus}
                            onChange={(e) => handleStatusChange(room.id, e.target.value)}
                            onBlur={() => setEditingStatusId(null)}
                            className="text-xs font-semibold px-2 py-1.5 rounded-lg border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                          >
                            {MANUAL_STATUS_OPTIONS.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        ) : (
                          <button
                            onClick={() => canOverrideStatus && setEditingStatusId(room.id)}
                            className={clsx(
                              'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all',
                              canOverrideStatus ? 'cursor-pointer hover:shadow-sm' : 'cursor-default',
                              STATUS_STYLES[room.roomStatus] || STATUS_STYLES.Available
                            )}
                            title={canOverrideStatus ? 'Click to change status' : room.roomStatus}
                          >
                            {room.roomStatus === 'Maintenance' && <Wrench className="w-3 h-3 mr-1" />}
                            {room.roomStatus === 'Cleaning' && <SprayCan className="w-3 h-3 mr-1" />}
                            {room.roomStatus}
                          </button>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          {room.maxOccupancy}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {deletingId === room.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Delete?</span>
                              <button
                                onClick={() => confirmDelete(room.id)}
                                className="text-xs font-semibold text-red-600 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeletingId(null)}
                                className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(room)}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Edit Room"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(room.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Room"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * ROWS_PER_PAGE) + 1} to{' '}
                  {Math.min(currentPage * ROWS_PER_PAGE, filteredRooms.length)} of{' '}
                  {filteredRooms.length} rooms
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={clsx(
                      "p-2 rounded-lg border transition-colors",
                      currentPage === 1
                        ? "border-gray-100 text-gray-300 cursor-not-allowed"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={clsx(
                        "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={clsx(
                      "p-2 rounded-lg border transition-colors",
                      currentPage === totalPages
                        ? "border-gray-100 text-gray-300 cursor-not-allowed"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AddRoomModal
        key={editingRoom ? `edit-${editingRoom.id}` : 'add'}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingRoom(null); }}
        onRoomAdded={handleRoomAdded}
        editingRoom={editingRoom}
        onRoomUpdated={handleRoomUpdated}
      />
    </motion.div>
  );
}
