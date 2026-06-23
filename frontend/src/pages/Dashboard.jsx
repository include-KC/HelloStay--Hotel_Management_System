import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Clock, ArrowDownCircle, ArrowUpCircle,
  CreditCard, Sparkles
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

export default function Dashboard() {
  const [hotelData] = useState(() => {
    const savedData = localStorage.getItem('helloStay_hotelData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      hotelName: "HelloStay Demo Hotel",
      totalRooms: "100",
      facilities: ["Free WiFi", "Parking"]
    };
  });

  const [rooms] = useState(() => {
    const saved = localStorage.getItem('helloStay_rooms');
    return saved ? JSON.parse(saved) : [];
  });

  const totalRoomsNum = parseInt(hotelData.totalRooms) || 100;

  const occupancyData = [
    {
      name: 'Available',
      value: rooms.length > 0
        ? rooms.filter(r => r.roomStatus === 'Available').length
        : Math.floor(totalRoomsNum * 0.4),
      fill: '#10b981'
    },
    {
      name: 'Occupied',
      value: rooms.length > 0
        ? rooms.filter(r => r.roomStatus === 'Occupied').length
        : Math.floor(totalRoomsNum * 0.35),
      fill: '#ef4444'
    },
    {
      name: 'Cleaning',
      value: rooms.length > 0
        ? rooms.filter(r => r.roomStatus === 'Cleaning').length
        : Math.floor(totalRoomsNum * 0.15),
      fill: '#f97316'
    },
    {
      name: 'Reserved',
      value: rooms.length > 0
        ? rooms.filter(r => r.roomStatus === 'Reserved').length
        : Math.floor(totalRoomsNum * 0.1),
      fill: '#3b82f6'
    },
  ];

  const recentActivity = [
    { id: 1, type: 'checkin', title: 'Guest Check-in', detail: 'Room 301 — Mr. Sharma', time: '2 minutes ago', icon: ArrowDownCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 2, type: 'checkout', title: 'Guest Check-out', detail: 'Room 105 — Mrs. Patel', time: '15 minutes ago', icon: ArrowUpCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 3, type: 'payment', title: 'Payment Received', detail: '\u20B912,500 — Room 402', time: '1 hour ago', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 4, type: 'cleaning', title: 'Room Cleaned', detail: 'Room 204 — Ready for check-in', time: '2 hours ago', icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-100' },
    { id: 5, type: 'checkin', title: 'Guest Check-in', detail: 'Room 512 — Mr. Gupta', time: '3 hours ago', icon: ArrowDownCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  const availableCount = rooms.length > 0
    ? rooms.filter(r => r.roomStatus === 'Available').length
    : Math.floor(totalRoomsNum * 0.4);
  const occupiedCount = rooms.length > 0
    ? rooms.filter(r => r.roomStatus === 'Occupied').length
    : Math.floor(totalRoomsNum * 0.6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-md">
        <h1 className="text-3xl font-bold mb-2">Welcome to {hotelData.hotelName}</h1>
        <p className="text-blue-100">Here is what&apos;s happening at your property today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Today's Check-ins", value: "12", color: "text-blue-600" },
          { title: "Available Rooms", value: availableCount.toString(), color: "text-emerald-600" },
          { title: "Occupied Rooms", value: occupiedCount.toString(), color: "text-amber-600" },
          { title: "Total Capacity", value: hotelData.totalRooms, color: "text-purple-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
            <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {hotelData.facilities.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Active Property Facilities</h3>
          <div className="flex flex-wrap gap-3">
            {hotelData.facilities.map((facility, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium border border-indigo-100">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-indigo-500" />
                {facility}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Room Occupancy Overview</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 13, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 13, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                  {occupancyData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h3>
          <div className="space-y-1">
            {recentActivity.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl ${activity.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-500 truncate">{activity.detail}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
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
