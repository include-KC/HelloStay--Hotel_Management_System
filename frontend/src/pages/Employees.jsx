import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Contact, Search, Plus, ChevronLeft, ChevronRight, Eye, Edit3, Trash2, XCircle, ArrowRight, Briefcase, ToggleLeft, ToggleRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CURRENCY_SYMBOLS } from '../utils/currencies';

const ROLES = ['Receptionist', 'Room Manager', 'Housekeeping', 'Accountant', 'Security', 'Manager', 'Chef', 'Waiter', 'Maintenance'];
const EMPLOYMENT_STATUSES = ['All', 'Active', 'Inactive', 'On Leave', 'Terminated'];

const STATUS_STYLES = {
  'Active': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Inactive': { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
  'On Leave': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Terminated': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

const INITIAL_EMPLOYEE = {
  name: '',
  phone: '',
  email: '',
  role: 'Receptionist',
  salary: '',
  joiningDate: '',
  address: '',
  idProofType: 'Aadhaar Card',
  idProofNumber: '',
  emergencyContact: '',
  employmentStatus: 'Active',
};

const ITEMS_PER_PAGE = 8;

export default function Employees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem('helloStay_employees');
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
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_EMPLOYEE);
  const [formErrors, setFormErrors] = useState({});

  const saveEmployees = (updated) => {
    setEmployees(updated);
    localStorage.setItem('helloStay_employees', JSON.stringify(updated));
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.role) errors.role = 'Role is required';
    if (!formData.salary || Number(formData.salary) <= 0) errors.salary = 'Valid salary is required';
    if (!formData.joiningDate) errors.joiningDate = 'Joining date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const now = new Date().toISOString();
    if (editingEmployee) {
      const updated = employees.map(e =>
        e.id === editingEmployee.id ? { ...e, ...formData, salary: Number(formData.salary), updatedAt: now } : e
      );
      saveEmployees(updated);
    } else {
      const newEmployee = {
        id: Date.now(),
        ...formData,
        salary: Number(formData.salary),
        createdAt: now,
        updatedAt: now,
      };
      saveEmployees([...employees, newEmployee]);
    }
    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData(INITIAL_EMPLOYEE);
    setFormErrors({});
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      phone: emp.phone,
      email: emp.email || '',
      role: emp.role,
      salary: emp.salary,
      joiningDate: emp.joiningDate,
      address: emp.address || '',
      idProofType: emp.idProofType || 'Aadhaar Card',
      idProofNumber: emp.idProofNumber || '',
      emergencyContact: emp.emergencyContact || '',
      employmentStatus: emp.employmentStatus,
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (empId) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    const newStatus = emp.employmentStatus === 'Active' ? 'Inactive' : 'Active';
    const updated = employees.map(e =>
      e.id === empId ? { ...e, employmentStatus: newStatus, updatedAt: new Date().toISOString() } : e
    );
    saveEmployees(updated);
  };

  const handleDelete = (empId) => {
    saveEmployees(employees.filter(e => e.id !== empId));
    setDeletingId(null);
    setViewEmployee(null);
  };

  const sortedEmployees = useMemo(() => {
    const sorted = [...employees];
    sorted.sort((a, b) => {
      let aVal = a[sortConfig.key] || '';
      let bVal = b[sortConfig.key] || '';
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (sortConfig.key === 'salary') { aVal = Number(aVal) || 0; bVal = Number(bVal) || 0; }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [employees, sortConfig]);

  const filteredEmployees = useMemo(() => {
    return sortedEmployees.filter(e => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !searchQuery ||
        e.name.toLowerCase().includes(q) ||
        e.phone.includes(searchQuery) ||
        (e.email && e.email.toLowerCase().includes(q));
      const matchRole = roleFilter === 'All' || e.role === roleFilter;
      const matchStatus = statusFilter === 'All' || e.employmentStatus === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [sortedEmployees, searchQuery, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const stats = useMemo(() => ({
    total: employees.length,
    active: employees.filter(e => e.employmentStatus === 'Active').length,
    onLeave: employees.filter(e => e.employmentStatus === 'On Leave').length,
    totalSalary: employees.filter(e => e.employmentStatus === 'Active').reduce((sum, e) => sum + (e.salary || 0), 0),
  }), [employees]);

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

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const getMonthsWorked = (joiningDate) => {
    if (!joiningDate) return 0;
    const join = new Date(joiningDate);
    const now = new Date();
    return Math.max(0, (now.getFullYear() - join.getFullYear()) * 12 + (now.getMonth() - join.getMonth()));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-sm text-gray-500 mt-1">Staff management, roles, and salary information</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/register-employee')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Employee
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Staff', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active', value: stats.active, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'On Leave', value: stats.onLeave, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Monthly Payroll', value: `${currencySymbol}${stats.totalSalary.toLocaleString('en-IN')}`, color: 'text-purple-600', bg: 'bg-purple-50' },
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
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-gray-50"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
          >
            <option value="All">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
          >
            {EMPLOYMENT_STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
          </select>
        </div>
        <p className="text-sm text-gray-500 mt-2">{filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {[
                  { key: 'name', label: 'Employee' },
                  { key: 'role', label: 'Role' },
                  { key: 'phone', label: 'Phone' },
                  { key: 'salary', label: 'Salary' },
                  { key: 'joiningDate', label: 'Joined' },
                  { key: 'employmentStatus', label: 'Status' },
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
                {paginatedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-16 text-center">
                      <Contact className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-3 text-sm font-medium text-gray-500">No employees found</p>
                      <p className="mt-1 text-xs text-gray-400">Add your first employee to get started</p>
                    </td>
                  </tr>
                ) : (
                  paginatedEmployees.map((emp, index) => (
                    <motion.tr
                      key={emp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {getInitials(emp.name)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                            {emp.email && <p className="text-xs text-gray-500">{emp.email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                          {emp.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{emp.phone}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{currencySymbol}{emp.salary?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{emp.joiningDate}</td>
                      <td className="px-4 py-3">
                        {deletingId === emp.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(emp.id)} className="text-xs font-semibold text-red-600 hover:text-red-800 px-2 py-1 rounded bg-red-50">Yes</button>
                            <button onClick={() => setDeletingId(null)} className="text-xs font-semibold text-gray-600 hover:text-gray-800 px-2 py-1 rounded bg-gray-100">No</button>
                          </div>
                        ) : (
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[emp.employmentStatus]?.bg} ${STATUS_STYLES[emp.employmentStatus]?.text} ${STATUS_STYLES[emp.employmentStatus]?.border}`}>
                            {emp.employmentStatus}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {deletingId !== emp.id && (
                          <div className="flex items-center gap-1">
                            <button onClick={() => setViewEmployee(emp)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleEdit(emp)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleToggleStatus(emp.id)} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Toggle Status">
                              {emp.employmentStatus === 'Active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            </button>
                            <button onClick={() => setDeletingId(emp.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
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
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredEmployees.length)} of {filteredEmployees.length}
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

      {/* Edit Employee Modal */}
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
                    {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => handleFormChange('name', e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.name ? 'border-red-300' : 'border-gray-200'}`}
                      placeholder="Jane Smith" />
                    {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input type="tel" value={formData.phone} onChange={(e) => handleFormChange('phone', e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.phone ? 'border-red-300' : 'border-gray-200'}`}
                      placeholder="+91 XXXXX XXXXX" />
                    {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={formData.email} onChange={(e) => handleFormChange('email', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      placeholder="jane@hotel.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                    <select value={formData.role} onChange={(e) => handleFormChange('role', e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.role ? 'border-red-300' : 'border-gray-200'}`}>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {formErrors.role && <p className="text-xs text-red-500 mt-1">{formErrors.role}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary ({currencySymbol}) *</label>
                    <input type="number" min="0" value={formData.salary} onChange={(e) => handleFormChange('salary', e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.salary ? 'border-red-300' : 'border-gray-200'}`}
                      placeholder="15000" />
                    {formErrors.salary && <p className="text-xs text-red-500 mt-1">{formErrors.salary}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date *</label>
                    <input type="date" value={formData.joiningDate} onChange={(e) => handleFormChange('joiningDate', e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${formErrors.joiningDate ? 'border-red-300' : 'border-gray-200'}`} />
                    {formErrors.joiningDate && <p className="text-xs text-red-500 mt-1">{formErrors.joiningDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
                    <select value={formData.employmentStatus} onChange={(e) => handleFormChange('employmentStatus', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm">
                      {['Active', 'Inactive', 'On Leave', 'Terminated'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Government ID Type</label>
                    <select value={formData.idProofType} onChange={(e) => handleFormChange('idProofType', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm">
                      {['Aadhaar Card', 'PAN Card', 'Passport', 'Driving License', 'Voter ID'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                    <input type="text" value={formData.idProofNumber} onChange={(e) => handleFormChange('idProofNumber', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      placeholder="ID number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                    <input type="tel" value={formData.emergencyContact} onChange={(e) => handleFormChange('emergencyContact', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea rows="2" value={formData.address} onChange={(e) => handleFormChange('address', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      placeholder="Residential address..." />
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm">
                  Cancel
                </button>
                <button onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-200 text-sm flex items-center gap-2">
                  {editingEmployee ? 'Update Employee' : 'Add Employee'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Employee Modal */}
      <AnimatePresence>
        {viewEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setViewEmployee(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                      {getInitials(viewEmployee.name)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{viewEmployee.name}</h3>
                      <p className="text-emerald-100 text-sm">{viewEmployee.role}</p>
                    </div>
                  </div>
                  <button onClick={() => setViewEmployee(null)} className="text-white/70 hover:text-white p-1">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Phone', value: viewEmployee.phone },
                    { label: 'Email', value: viewEmployee.email || '—' },
                    { label: 'Role', value: viewEmployee.role },
                    { label: 'Employment Status', value: viewEmployee.employmentStatus },
                    { label: 'Monthly Salary', value: `${currencySymbol}${viewEmployee.salary?.toLocaleString('en-IN')}` },
                    { label: 'Annual Salary', value: `${currencySymbol}${(viewEmployee.salary * 12)?.toLocaleString('en-IN')}` },
                    { label: 'Joining Date', value: viewEmployee.joiningDate },
                    { label: 'Months Worked', value: `${getMonthsWorked(viewEmployee.joiningDate)} months` },
                    { label: 'ID Type', value: viewEmployee.idProofType || '—' },
                    { label: 'ID Number', value: viewEmployee.idProofNumber || '—' },
                    { label: 'Emergency Contact', value: viewEmployee.emergencyContact || '—' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs font-medium text-gray-500 uppercase">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>

                {viewEmployee.address && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Address</p>
                    <p className="text-sm text-gray-700">{viewEmployee.address}</p>
                  </div>
                )}

                <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                  Added: {new Date(viewEmployee.createdAt).toLocaleString('en-IN')}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
