import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight, ChevronLeft, Shield, Key, UserCircle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const ROLES = [
  { value: 'Owner', label: 'Owner', description: 'Full administrative access to all modules', color: 'purple' },
  { value: 'Manager', label: 'Manager', description: 'Operational access to most modules', color: 'blue' },
  { value: 'Employee', label: 'Employee', description: 'Limited access based on assigned permissions', color: 'emerald' },
];

export default function RegisterAccount() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.password) errs.password = 'Password is required';
    if (formData.password.length > 0 && formData.password.length < 4) errs.password = 'Password must be at least 4 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!formData.role) errs.role = 'Please select a role';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const newAccount = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      avatar: formData.name.trim().charAt(0).toUpperCase(),
      role: formData.role,
      password: formData.password,
      permissions: formData.role === 'Owner' ? ['Full Access'] : [],
      hotelName: '',
    };

    // Add to existing accounts
    const existingAccounts = JSON.parse(localStorage.getItem('helloStay_accounts') || '[]');
    existingAccounts.push(newAccount);
    localStorage.setItem('helloStay_accounts', JSON.stringify(existingAccounts));

    navigate('/login');
  };

  const roleColors = {
    purple: { selected: 'bg-purple-50 border-purple-300 text-purple-800', dot: 'bg-purple-500' },
    blue: { selected: 'bg-blue-50 border-blue-300 text-blue-800', dot: 'bg-blue-500' },
    emerald: { selected: 'bg-emerald-50 border-emerald-300 text-emerald-800', dot: 'bg-emerald-500' },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Branding */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 text-white flex-col justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-800 opacity-90 z-0"></div>
        <div className="relative z-10 max-w-lg">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/30">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Create your profile.</h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Set up a new user profile for your hotel. Each profile gets its own login credentials and role-based access to the system.
          </p>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => navigate('/login')}
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Login
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">New Account</h2>
              <p className="text-gray-500 mt-2">Fill in the details for the new profile.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <UserCircle className="w-4 h-4 text-gray-400" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={clsx(
                    "w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50 transition-all text-sm",
                    errors.name ? 'border-red-300' : 'border-gray-200'
                  )}
                  placeholder="e.g. Krishna Sharma"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-gray-400" /> Email <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50 transition-all text-sm"
                  placeholder="user@hotel.com"
                />
              </div>

              {/* Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-gray-400" /> Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={clsx(
                      "w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50 transition-all text-sm",
                      errors.password ? 'border-red-300' : 'border-gray-200'
                    )}
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={clsx(
                      "w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50 transition-all text-sm",
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                    )}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-gray-400" /> Assign Role
                </label>
                {errors.role && <p className="text-xs text-red-500 mb-2">{errors.role}</p>}
                <div className="space-y-2">
                  {ROLES.map(role => {
                    const isSelected = formData.role === role.value;
                    const colors = roleColors[role.color];
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: role.value })}
                        className={clsx(
                          "w-full flex items-center p-3.5 rounded-xl border-2 transition-all text-left",
                          isSelected
                            ? colors.selected
                            : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                        )}
                      >
                        <div className={clsx(
                          "w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center shrink-0 transition-colors",
                          isSelected ? `border-current` : "border-gray-300"
                        )}>
                          {isSelected && <div className={clsx("w-2 h-2 rounded-full", colors.dot)} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{role.label}</p>
                          <p className={clsx("text-xs mt-0.5", isSelected ? 'opacity-80' : 'text-gray-500')}>{role.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center mt-6"
              >
                Create Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
