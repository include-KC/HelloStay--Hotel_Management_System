import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Save, Mail, Phone, Lock, Eye, EyeOff, Shield, Building, Calendar } from 'lucide-react';

export default function Profile() {
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const hotelData = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('helloStay_hotelData') || '{}'); }
    catch { return {}; }
  }, []);

  const userRole = useMemo(() => {
    try { return localStorage.getItem('helloStay_userRole') || 'owner'; }
    catch { return 'owner'; }
  }, []);

  const [profile, setProfile] = useState({
    name: hotelData.ownerName || 'Hotel Owner',
    email: hotelData.email || '',
    phone: hotelData.phone || '',
    role: userRole,
    hotelName: hotelData.hotelName || '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  const handleProfileSave = () => {
    const updated = { ...hotelData, ownerName: profile.name, email: profile.email, phone: profile.phone };
    localStorage.setItem('helloStay_hotelData', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = () => {
    const errors = {};
    if (!passwords.current) errors.current = 'Current password is required';
    if (!passwords.newPass) errors.newPass = 'New password is required';
    if (passwords.newPass.length < 6) errors.newPass = 'Password must be at least 6 characters';
    if (passwords.newPass !== passwords.confirm) errors.confirm = 'Passwords do not match';
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    alert('Password change functionality will be available when backend authentication is connected.');
    setPasswords({ current: '', newPass: '', confirm: '' });
    setPasswordErrors({});
  };

  const getInitials = (name) => {
    if (!name) return 'HO';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadge = (role) => {
    const styles = {
      owner: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      manager: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      employee: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    };
    const s = styles[role] || styles.owner;
    return (
      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account and security settings</p>
        </div>
        {saved && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border border-emerald-200">
            <Save className="w-4 h-4" /> Saved!
          </motion.div>
        )}
      </div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
              {getInitials(profile.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {getRoleBadge(profile.role)}
                {profile.hotelName && (
                  <span className="text-blue-100 text-sm flex items-center gap-1">
                    <Building className="w-3 h-3" /> {profile.hotelName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-9 pr-4 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-9 pr-4 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                  placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pl-9 pr-4 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                  placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={handleProfileSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2 text-sm">
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-600" /> Change Password
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} value={passwords.current}
                onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                className={`w-full pl-9 pr-10 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${passwordErrors.current ? 'border-red-300' : 'border-gray-200'}`}
                placeholder="Enter current password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordErrors.current && <p className="text-xs text-red-500 mt-1">{passwordErrors.current}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type={showPassword ? 'text' : 'password'} value={passwords.newPass}
              onChange={(e) => setPasswords(prev => ({ ...prev, newPass: e.target.value }))}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${passwordErrors.newPass ? 'border-red-300' : 'border-gray-200'}`}
              placeholder="Min 6 characters" />
            {passwordErrors.newPass && <p className="text-xs text-red-500 mt-1">{passwordErrors.newPass}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input type={showPassword ? 'text' : 'password'} value={passwords.confirm}
              onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${passwordErrors.confirm ? 'border-red-300' : 'border-gray-200'}`}
              placeholder="Re-enter new password" />
            {passwordErrors.confirm && <p className="text-xs text-red-500 mt-1">{passwordErrors.confirm}</p>}
          </div>
          <div className="flex justify-end">
            <button onClick={handlePasswordChange}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-amber-200 flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4" /> Update Password
            </button>
          </div>
        </div>
      </motion.div>

      {/* Account Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" /> Account Information
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-xs text-gray-500 uppercase">Account Type</p><p className="font-semibold">{profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</p></div>
          <div><p className="text-xs text-gray-500 uppercase">Hotel</p><p className="font-semibold">{profile.hotelName || '—'}</p></div>
          <div><p className="text-xs text-gray-500 uppercase">Setup Completed</p><p className="font-semibold text-emerald-600">Yes</p></div>
          <div><p className="text-xs text-gray-500 uppercase">Data Storage</p><p className="font-semibold">Local Browser</p></div>
        </div>
      </motion.div>
    </div>
  );
}
