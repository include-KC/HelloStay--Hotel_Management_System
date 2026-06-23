import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Search, Calendar, CreditCard, CheckCircle, XCircle, Download } from 'lucide-react';
import { CURRENCY_SYMBOLS } from '../utils/currencies';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ATTENDANCE_STATUSES = ['Present', 'Absent', 'Half Day', 'Leave', 'Holiday'];

const STATUS_STYLES = {
  'Present': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Absent': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  'Half Day': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Leave': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Holiday': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

export default function HRPayroll() {
  const [activeTab, setActiveTab] = useState('attendance');
  const idCounter = useRef(0);

  const [employees] = useState(() => {
    try {
      const saved = localStorage.getItem('helloStay_employees');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [attendance, setAttendance] = useState(() => {
    try {
      const saved = localStorage.getItem('helloStay_attendance');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [payslips, setPayslips] = useState(() => {
    try {
      const saved = localStorage.getItem('helloStay_payslips');
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

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const activeEmployees = useMemo(() =>
    employees.filter(e => e.employmentStatus === 'Active'),
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return activeEmployees.filter(e =>
      !searchQuery || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q)
    );
  }, [activeEmployees, searchQuery]);

  const getAttendanceForDate = (empId, date) => {
    return attendance.find(a => a.employeeId === empId && a.date === date);
  };

  const handleMarkAttendance = (empId, status) => {
    const existing = attendance.find(a => a.employeeId === empId && a.date === attendanceDate);
    let updated;
    if (existing) {
      updated = attendance.map(a =>
        a.employeeId === empId && a.date === attendanceDate ? { ...a, status } : a
      );
    } else {
      idCounter.current += 1;
      const newId = `${empId}-${attendanceDate}-${idCounter.current}`;
      updated = [...attendance, { id: newId, employeeId: empId, date: attendanceDate, status }];
    }
    setAttendance(updated);
    localStorage.setItem('helloStay_attendance', JSON.stringify(updated));
  };

  const getMonthAttendanceStats = (empId) => {
    const monthAttendance = attendance.filter(a => {
      const d = new Date(a.date);
      return a.employeeId === empId && d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
    return {
      present: monthAttendance.filter(a => a.status === 'Present').length,
      absent: monthAttendance.filter(a => a.status === 'Absent').length,
      halfDay: monthAttendance.filter(a => a.status === 'Half Day').length,
      leave: monthAttendance.filter(a => a.status === 'Leave').length,
    };
  };

  const calculateSalary = (emp) => {
    const stats = getMonthAttendanceStats(emp.id);
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const perDay = emp.salary / daysInMonth;
    const earned = (stats.present * perDay) + (stats.halfDay * perDay * 0.5);
    const deductions = payslips
      .filter(p => p.employeeId === emp.id && p.month === selectedMonth && p.year === selectedYear)
      .reduce((sum, p) => sum + (p.deductions || 0), 0);
    return {
      baseSalary: emp.salary,
      daysPresent: stats.present,
      daysAbsent: stats.absent,
      halfDays: stats.halfDay,
      leaves: stats.leave,
      earned: Math.round(earned),
      deductions,
      netPay: Math.round(earned - deductions),
    };
  };

  const generatePayslips = () => {
    const newPayslips = activeEmployees.map(emp => {
      const salary = calculateSalary(emp);
      const existing = payslips.find(p =>
        p.employeeId === emp.id && p.month === selectedMonth && p.year === selectedYear
      );
      if (existing) return existing;
      return {
        id: Date.now() + emp.id,
        employeeId: emp.id,
        employeeName: emp.name,
        role: emp.role,
        month: selectedMonth,
        year: selectedYear,
        ...salary,
        generatedAt: new Date().toISOString(),
      };
    });
    setPayslips(newPayslips);
    localStorage.setItem('helloStay_payslips', JSON.stringify(newPayslips));
  };

  const getMonthName = (m) => MONTHS[m];

  const tabs = [
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'payroll', label: 'Payroll', icon: CreditCard },
    { id: 'payslips', label: 'Payslips', icon: Download },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HR & Payroll</h1>
          <p className="text-sm text-gray-500 mt-1">Attendance tracking, salary calculation, and payslip generation</p>
        </div>
      </div>

      {/* Month/Year Selector */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-50 outline-none"
          >
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <div className="flex-1" />
          <div className="text-sm text-gray-500">
            {activeEmployees.length} active employee{activeEmployees.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50"
                />
              </div>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Month Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEmployees.map((emp) => {
                  const todayStatus = getAttendanceForDate(emp.id, attendanceDate);
                  const monthStats = getMonthAttendanceStats(emp.id);
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {emp.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                            <p className="text-xs text-gray-500">{emp.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{emp.role}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {ATTENDANCE_STATUSES.map(status => {
                            const isActive = todayStatus?.status === status;
                            return (
                              <button
                                key={status}
                                onClick={() => handleMarkAttendance(emp.id, status)}
                                className={`text-[10px] font-semibold px-2 py-1 rounded-full border transition-all ${
                                  isActive
                                    ? `${STATUS_STYLES[status].bg} ${STATUS_STYLES[status].text} ${STATUS_STYLES[status].border}`
                                    : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                {status}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-emerald-600 font-semibold">{monthStats.present}P</span>
                          <span className="text-red-600 font-semibold">{monthStats.absent}A</span>
                          <span className="text-amber-600 font-semibold">{monthStats.halfDay}H</span>
                          <span className="text-blue-600 font-semibold">{monthStats.leave}L</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredEmployees.length === 0 && (
              <div className="py-12 text-center">
                <Briefcase className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No active employees</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payroll Tab */}
      {activeTab === 'payroll' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Employee</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Base Salary</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Days Present</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Earned</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Deductions</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Net Pay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activeEmployees.map(emp => {
                  const salary = calculateSalary(emp);
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {emp.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                            <p className="text-xs text-gray-500">{emp.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">{currencySymbol}{salary.baseSalary?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-600">{salary.daysPresent}/{new Date(selectedYear, selectedMonth + 1, 0).getDate()}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{currencySymbol}{salary.earned?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">{currencySymbol}{salary.deductions?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-emerald-600">{currencySymbol}{salary.netPay?.toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-4 py-3 text-sm text-gray-900">Total</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {currencySymbol}{activeEmployees.reduce((s, e) => s + e.salary, 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {currencySymbol}{activeEmployees.reduce((s, e) => s + calculateSalary(e).earned, 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">
                    {currencySymbol}{activeEmployees.reduce((s, e) => s + calculateSalary(e).deductions, 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-emerald-600">
                    {currencySymbol}{activeEmployees.reduce((s, e) => s + calculateSalary(e).netPay, 0).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              onClick={generatePayslips}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Generate Payslips for {getMonthName(selectedMonth)} {selectedYear}
            </button>
          </div>
        </div>
      )}

      {/* Payslips Tab */}
      {activeTab === 'payslips' && (
        <div className="space-y-4">
          {payslips.filter(p => p.month === selectedMonth && p.year === selectedYear).length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 text-center">
              <Download className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-500">No payslips generated for {getMonthName(selectedMonth)} {selectedYear}</p>
              <p className="mt-1 text-xs text-gray-400">Go to Payroll tab and click "Generate Payslips"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {payslips
                .filter(p => p.month === selectedMonth && p.year === selectedYear)
                .map((payslip) => (
                  <motion.div
                    key={payslip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => { setSelectedPayslip(payslip); setShowPayslipModal(true); }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {payslip.employeeName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{payslip.employeeName}</h4>
                          <p className="text-xs text-gray-500">{payslip.role}</p>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-[10px] text-gray-500 uppercase">Earned</p>
                        <p className="font-semibold text-gray-900">{currencySymbol}{payslip.earned?.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-[10px] text-gray-500 uppercase">Net Pay</p>
                        <p className="font-bold text-emerald-600">{currencySymbol}{payslip.netPay?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-400">
                      Generated: {new Date(payslip.generatedAt).toLocaleDateString('en-IN')}
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Payslip Detail Modal */}
      <AnimatePresence>
        {showPayslipModal && selectedPayslip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPayslipModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Payslip</h3>
                    <p className="text-emerald-100 text-sm">{getMonthName(selectedPayslip.month)} {selectedPayslip.year}</p>
                  </div>
                  <button onClick={() => setShowPayslipModal(false)} className="text-white/70 hover:text-white p-1">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center pb-4 border-b border-gray-100">
                  <p className="text-lg font-bold text-gray-900">{selectedPayslip.employeeName}</p>
                  <p className="text-sm text-gray-500">{selectedPayslip.role}</p>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Base Salary', value: `${currencySymbol}${selectedPayslip.baseSalary?.toLocaleString('en-IN')}`, color: 'text-gray-900' },
                    { label: 'Days Present', value: `${selectedPayslip.daysPresent}`, color: 'text-gray-900' },
                    { label: 'Half Days', value: `${selectedPayslip.halfDays}`, color: 'text-amber-600' },
                    { label: 'Leaves', value: `${selectedPayslip.leaves}`, color: 'text-blue-600' },
                    { label: 'Earned Amount', value: `${currencySymbol}${selectedPayslip.earned?.toLocaleString('en-IN')}`, color: 'text-gray-900' },
                    { label: 'Deductions', value: `- ${currencySymbol}${selectedPayslip.deductions?.toLocaleString('en-IN')}`, color: 'text-red-600' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-500">{item.label}</span>
                      <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex justify-between">
                  <span className="font-bold text-emerald-700">Net Pay</span>
                  <span className="text-xl font-bold text-emerald-700">{currencySymbol}{selectedPayslip.netPay?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
