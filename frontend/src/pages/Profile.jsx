import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Save, Mail, Phone, Lock, Eye, EyeOff, Building, Calendar, Edit2, Trash2, Users } from 'lucide-react';
import OwnerAuthModal from '../components/modals/OwnerAuthModal';
import ProfileEditModal from '../components/modals/ProfileEditModal';

export default function Profile() {
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const session = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('helloStay_session') || '{}'); }
    catch { return {}; }
  }, []);

  const hotelData = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('helloStay_hotelData') || '{}'); }
    catch { return {}; }
  }, []);

  const [accounts, setAccounts] = useState(() => {
    const stored = localStorage.getItem('helloStay_accounts');
    return stored ? JSON.parse(stored) : [];
  });

  const [profile, setProfile] = useState({
    name: session.name || 'User',
    email: session.email || '',
    phone: session.phone || '',
    role: session.role || 'employee',
    hotelName: hotelData.hotelName || '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  // Management State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [targetOwnerId, setTargetOwnerId] = useState(null);

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

    // Update password in accounts list
    const newAccounts = accounts.map(a => {
      if (a.id === session.id) {
        return { ...a, password: passwords.newPass };
      }
      return a;
    });
    setAccounts(newAccounts);
    localStorage.setItem('helloStay_accounts', JSON.stringify(newAccounts));

    setPasswords({ current: '', newPass: '', confirm: '' });
    setPasswordErrors({});
    alert('Password updated successfully!');
  };

  const getInitials = (name) => {
    if (!name) return 'HO';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadge = (role) => {
    const styles = {
      Owner: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      Manager: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      Employee: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    };
    const s = styles[role] || styles.Employee;
    return (
      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  // --- Profile Management Handlers ---

  const handleActionRequest = (type, account) => {
    if (type === 'delete' && account.role === 'Owner') {
      const ownerCount = accounts.filter(a => a.role === 'Owner').length;
      if (ownerCount <= 1) {
        alert("Cannot delete the final Owner account. At least one Owner must remain.");
        return;
      }
    }

    setPendingAction({ type, account });

    // When deleting or editing ANOTHER owner, require their password.
    if (account.role === 'Owner' && account.id !== session.id) {
      setTargetOwnerId(account.id);
      setAuthModalOpen(true);
    } else {
      // Employees/Managers can be edited directly since we assume the active user has permissions to see this section
      // If we are editing ourself, we don't need a password prompt here.
      if (type === 'edit') {
        setEditModalOpen(true);
      } else if (type === 'delete') {
        executeDelete(account);
      }
    }
  };

  const executeDelete = (account) => {
    if (window.confirm(`Are you sure you want to delete the profile for ${account.name}?`)) {
      const newAccounts = accounts.filter(a => a.id !== account.id);
      setAccounts(newAccounts);
      localStorage.setItem('helloStay_accounts', JSON.stringify(newAccounts));
    }
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    if (pendingAction.type === 'edit') {
      setEditModalOpen(true);
    } else if (pendingAction.type === 'delete') {
      executeDelete(pendingAction.account);
    }
  };

  const handleSaveProfile = (updatedProfile) => {
    const newAccounts = accounts.map(a => a.id === updatedProfile.id ? updatedProfile : a);
    setAccounts(newAccounts);
    localStorage.setItem('helloStay_accounts', JSON.stringify(newAccounts));
    setEditModalOpen(false);
  };

  // Determine if active user can manage staff
  const canManageStaff = session.permissions?.includes('Full Access') || session.permissions?.includes('Staff Management');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account and security settings</p>
        </div>
        {saved && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border border-emerald-200">
            <Save className="w-4 h-4" /> Saved!
          </motion.div>
        )}
      </div>

      {/* Main Profile Settings (Personal) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
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
              <div className="space-y-4">
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
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={handleProfileSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2 text-sm">
                  <Save className="w-4 h-4" /> Save Details
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input type={showPassword ? 'text' : 'password'} value={passwords.newPass}
                    onChange={(e) => setPasswords(prev => ({ ...prev, newPass: e.target.value }))}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${passwordErrors.newPass ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="Min 6 chars" />
                  {passwordErrors.newPass && <p className="text-xs text-red-500 mt-1">{passwordErrors.newPass}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input type={showPassword ? 'text' : 'password'} value={passwords.confirm}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm ${passwordErrors.confirm ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="Re-enter" />
                  {passwordErrors.confirm && <p className="text-xs text-red-500 mt-1">{passwordErrors.confirm}</p>}
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={handlePasswordChange}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-amber-200 flex items-center gap-2 text-sm">
                  <Lock className="w-4 h-4" /> Update
                </button>
              </div>
            </div>
          </motion.div>

          {/* Account Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" /> Account Status
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-gray-500 uppercase">Account Type</p><p className="font-semibold">{profile.role}</p></div>
              <div><p className="text-xs text-gray-500 uppercase">Hotel</p><p className="font-semibold">{profile.hotelName || '—'}</p></div>
            </div>
            {session.permissions && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 uppercase mb-2">Assigned Permissions</p>
                <div className="flex flex-wrap gap-1.5">
                  {session.permissions.map(p => (
                    <span key={p} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium border border-gray-200">{p}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Staff Management Section */}
      {canManageStaff && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-600" /> Staff Management
              </h3>
              <p className="text-sm text-gray-500 mt-1">Manage profiles, roles, and permissions for employees.</p>
            </div>
            <button className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
              + Add Staff
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map(account => (
              <div key={account.id} className="border border-gray-200 rounded-xl p-4 flex items-center bg-gray-50 hover:bg-white hover:border-indigo-200 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mr-3 shrink-0">
                  {account.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate flex items-center gap-2">
                    {account.name}
                    {account.id === session.id && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">YOU</span>}
                  </p>
                  <p className="text-xs font-medium text-gray-500 flex gap-2 mt-0.5">
                    {account.role} • {account.permissions?.length || 0} permissions
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleActionRequest('edit', account)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {account.id !== session.id && (
                    <button 
                      onClick={() => handleActionRequest('delete', account)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <OwnerAuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
        targetOwnerId={targetOwnerId}
      />

      <ProfileEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveProfile}
        profile={pendingAction?.account}
      />
    </div>
  );
}
