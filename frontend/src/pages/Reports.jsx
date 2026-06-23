import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, BedDouble, Users, Wallet, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { CURRENCY_SYMBOLS } from '../utils/currencies';

const REPORT_TYPES = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'occupancy', label: 'Occupancy', icon: BedDouble },
  { id: 'revenue', label: 'Revenue', icon: TrendingUp },
  { id: 'expenses', label: 'Expenses', icon: Wallet },
];

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Reports() {
  const [activeReport, setActiveReport] = useState('overview');

  const rooms = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('helloStay_rooms') || '[]'); }
    catch { return []; }
  }, []);

  const bookings = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('helloStay_bookings') || '[]'); }
    catch { return []; }
  }, []);

  const expenses = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('helloStay_expenses') || '[]'); }
    catch { return []; }
  }, []);

  const hotelData = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('helloStay_hotelData') || '{"currency":"INR"}'); }
    catch { return { currency: 'INR' }; }
  }, []);

  const currencySymbol = useMemo(() => CURRENCY_SYMBOLS[hotelData.currency] || '₹', [hotelData.currency]);

  const stats = useMemo(() => {
    const totalRevenue = bookings.reduce((s, b) => s + (b.amountPaid || 0), 0);
    const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
    const avgBookingValue = bookings.length ? totalRevenue / bookings.length : 0;
    const occupancyRate = rooms.length ? (rooms.filter(r => r.roomStatus === 'Occupied').length / rooms.length * 100) : 0;

    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      avgBookingValue,
      occupancyRate,
      totalBookings: bookings.length,
      totalGuests: bookings.reduce((s, b) => s + (Number(b.adults) || 0) + (Number(b.children) || 0), 0),
      totalRooms: rooms.length,
    };
  }, [bookings, expenses, rooms]);

  const occupancyData = useMemo(() => {
    const statuses = ['Available', 'Occupied', 'Cleaning', 'Reserved', 'Maintenance'];
    return statuses.map(status => ({
      name: status,
      count: rooms.filter(r => r.roomStatus === status).length,
    }));
  }, [rooms]);

  const revenueByMonth = useMemo(() => {
    const months = {};
    bookings.forEach(b => {
      const month = b.checkInDate?.substring(0, 7);
      if (month) {
        if (!months[month]) months[month] = { month, revenue: 0, bookings: 0 };
        months[month].revenue += b.amountPaid || 0;
        months[month].bookings += 1;
      }
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
  }, [bookings]);

  const expenseByCategory = useMemo(() => {
    const categories = {};
    expenses.forEach(e => {
      categories[e.category] = (categories[e.category] || 0) + (e.amount || 0);
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [expenses]);

  const paymentStatusData = useMemo(() => {
    const statuses = {};
    bookings.forEach(b => {
      statuses[b.paymentStatus] = (statuses[b.paymentStatus] || 0) + 1;
    });
    return Object.entries(statuses).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Hotel performance analytics and insights</p>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {REPORT_TYPES.map(report => (
          <button key={report.id} onClick={() => setActiveReport(report.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeReport === report.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <report.icon className="w-4 h-4" /> {report.label}
          </button>
        ))}
      </div>

      {/* Overview Report */}
      {activeReport === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', value: `${currencySymbol}${stats.totalRevenue.toLocaleString('en-IN')}`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Total Expenses', value: `${currencySymbol}${stats.totalExpenses.toLocaleString('en-IN')}`, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Net Profit', value: `${currencySymbol}${stats.netProfit.toLocaleString('en-IN')}`, color: stats.netProfit >= 0 ? 'text-blue-600' : 'text-red-600', bg: stats.netProfit >= 0 ? 'bg-blue-50' : 'bg-red-50' },
              { label: 'Avg Booking', value: `${currencySymbol}${Math.round(stats.avgBookingValue).toLocaleString('en-IN')}`, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`${stat.bg} rounded-xl p-4 border border-gray-100`}>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Revenue Trend</h3>
              {revenueByMonth.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No revenue data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => `${currencySymbol}${v.toLocaleString('en-IN')}`} />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Occupancy Pie */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Room Occupancy</h3>
              {rooms.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No room data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="count">
                      {occupancyData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {occupancyData.map((item, i) => (
                  <span key={item.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    {item.name} ({item.count})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar },
              { label: 'Total Guests', value: stats.totalGuests, icon: Users },
              { label: 'Occupancy Rate', value: `${stats.occupancyRate.toFixed(1)}%`, icon: BedDouble },
              { label: 'Total Rooms', value: stats.totalRooms, icon: BedDouble },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Occupancy Report */}
      {activeReport === 'occupancy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {occupancyData.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: CHART_COLORS[i] }} />
                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                <p className="text-xs text-gray-500 mt-1">{item.name}</p>
                <p className="text-xs text-gray-400">{stats.totalRooms ? ((item.count / stats.totalRooms) * 100).toFixed(0) : 0}%</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Room Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {occupancyData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Revenue Report */}
      {activeReport === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Revenue', value: `${currencySymbol}${stats.totalRevenue.toLocaleString('en-IN')}`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Avg Booking Value', value: `${currencySymbol}${Math.round(stats.avgBookingValue).toLocaleString('en-IN')}`, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Total Bookings', value: stats.totalBookings, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`${stat.bg} rounded-xl p-4 border border-gray-100`}>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Revenue by Month</h3>
            {revenueByMonth.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No revenue data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `${currencySymbol}${v.toLocaleString('en-IN')}`} />
                  <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Payment Status</h3>
            {paymentStatusData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No booking data</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={paymentStatusData} cx="50%" cy="50%" outerRadius={70} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {paymentStatusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Expenses Report */}
      {activeReport === 'expenses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Expenses', value: `${currencySymbol}${stats.totalExpenses.toLocaleString('en-IN')}`, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Categories', value: expenseByCategory.length, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Entries', value: expenses.length, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`${stat.bg} rounded-xl p-4 border border-gray-100`}>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Expenses by Category</h3>
            {expenseByCategory.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No expense data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenseByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                  <Tooltip formatter={(v) => `${currencySymbol}${v.toLocaleString('en-IN')}`} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {expenseByCategory.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
