import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, ArrowDownCircle, ArrowUpCircle,
  CreditCard, Sparkles
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const OCCUPANCY_COLORS = {
  Available: '#10b981',
  Occupied: '#ef4444',
  Cleaning: '#f97316',
  Reserved: '#3b82f6',
};

export default function Dashboard() {
  const [hotelData] = useState(() => {
    const savedData = localStorage.getItem('helloStay_hotelData');
    return savedData ? JSON.parse(savedData) : { hotelName: "HelloStay Demo Hotel", totalRooms: "100", facilities: [] };
  });

  const [rooms] = useState(() => {
    const saved = localStorage.getItem('helloStay_rooms');
    return saved ? JSON.parse(saved) : [];
  });

  const totalRoomsNum = parseInt(hotelData.totalRooms) || 100;

  const availableCount = rooms.length > 0 ? rooms.filter(r => r.roomStatus === 'Available').length : Math.floor(totalRoomsNum * 0.4);
  const occupiedCount = rooms.length > 0 ? rooms.filter(r => r.roomStatus === 'Occupied').length : Math.floor(totalRoomsNum * 0.35);
  const cleaningCount = rooms.length > 0 ? rooms.filter(r => r.roomStatus === 'Cleaning').length : Math.floor(totalRoomsNum * 0.15);
  const reservedCount = rooms.length > 0 ? rooms.filter(r => r.roomStatus === 'Reserved').length : Math.floor(totalRoomsNum * 0.1);

  const occupancyData = [
    { name: 'Available', value: availableCount },
    { name: 'Occupied', value: occupiedCount },
    { name: 'Cleaning', value: cleaningCount },
    { name: 'Reserved', value: reservedCount },
  ].filter(d => d.value > 0);

  const occupancyRate = totalRoomsNum > 0
    ? Math.round(((occupiedCount + reservedCount) / totalRoomsNum) * 100)
    : 0;

  const recentActivity = [
    { id: 1, type: 'checkin', title: 'Guest Check-in', detail: 'Room 301 — Mr. Sharma', time: '2 min ago', icon: ArrowDownCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 2, type: 'checkout', title: 'Guest Check-out', detail: 'Room 105 — Mrs. Patel', time: '15 min ago', icon: ArrowUpCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 3, type: 'payment', title: 'Payment Received', detail: '₹12,500 — Room 402', time: '1 hr ago', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 4, type: 'cleaning', title: 'Room Cleaned', detail: 'Room 204 — Ready', time: '2 hrs ago', icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const [hoveredStatus, setHoveredStatus] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
        <h1 className="text-2xl font-bold mb-1">Welcome to {hotelData.hotelName}</h1>
        <p className="text-blue-100 text-sm">Here is what&apos;s happening at your property today.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Today's Check-ins", value: "12", color: "text-blue-600" },
          { title: "Available Rooms", value: availableCount, color: "text-emerald-600" },
          { title: "Occupied Rooms", value: occupiedCount, color: "text-amber-600" },
          { title: "Occupancy Rate", value: `${occupancyRate}%`, color: "text-purple-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-medium text-gray-500 mb-1">{stat.title}</p>
            <h3 className={`text-xl font-bold ${stat.color}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-bold text-gray-800 mb-4">Room Occupancy Overview</h3>
          {occupancyData.length > 0 ? (
            <div className="flex items-center gap-6">
              <div className="relative w-44 h-44 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      isAnimationActive={true}
                      animationBegin={0}
                      animationDuration={800}
                      animationEasing="ease-out"
                      onMouseEnter={(_, index) => setHoveredStatus(occupancyData[index]?.name)}
                      onMouseLeave={() => setHoveredStatus(null)}
                    >
                      {occupancyData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={OCCUPANCY_COLORS[entry.name]}
                          stroke="none"
                          fillOpacity={
                            hoveredStatus === null || hoveredStatus === entry.name ? 1 : 0.3
                          }
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-gray-800">{occupancyRate}%</span>
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Occupied</span>
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                {occupancyData.map((entry) => {
                  const pct = totalRoomsNum > 0 ? ((entry.value / totalRoomsNum) * 100).toFixed(1) : 0;
                  const isActive = hoveredStatus === null || hoveredStatus === entry.name;
                  return (
                    <div
                      key={entry.name}
                      className="flex items-center gap-3 px-2.5 py-1.5 rounded-lg transition-all duration-200"
                      style={{
                        backgroundColor: hoveredStatus && isActive ? `${OCCUPANCY_COLORS[entry.name]}0D` : 'transparent',
                        opacity: isActive ? 1 : 0.4,
                      }}
                      onMouseEnter={() => setHoveredStatus(entry.name)}
                      onMouseLeave={() => setHoveredStatus(null)}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: OCCUPANCY_COLORS[entry.name] }}
                      />
                      <span className="text-sm font-medium text-gray-700 flex-1 truncate">{entry.name}</span>
                      <span className="text-sm font-bold text-gray-800 tabular-nums">{entry.value}</span>
                      <span className="text-xs text-gray-400 w-11 text-right tabular-nums">{pct}%</span>
                      <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                        <div
                          className="h-full rounded-full transition-all duration-300 ease-out"
                          style={{
                            width: `${Math.max(pct, 2)}%`,
                            backgroundColor: OCCUPANCY_COLORS[entry.name],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-sm text-gray-400">
              No room data available
            </div>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-1">
            {recentActivity.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-9 h-9 rounded-xl ${activity.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-500 truncate">{activity.detail}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
