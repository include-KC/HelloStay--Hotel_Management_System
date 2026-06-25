import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCircle, Shield, Key } from 'lucide-react';
import clsx from 'clsx';

const ALL_PERMISSIONS = [
  'Full Access',
  'Bookings',
  'Guests',
  'Rooms',
  'Housekeeping',
  'Attendance & Salary',
  'Reports',
  'Inventory',
  'Settings',
  'Hotel Information',
  'Staff Management',
];

export default function ProfileEditModal({ isOpen, onClose, onSave, profile }) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Employee',
    password: '',
    permissions: [],
  });

  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: profile.name || '',
        role: profile.role || 'Employee',
        password: profile.password || 'admin123',
        permissions: profile.permissions || (profile.role === 'Owner' ? ['Full Access'] : []),
      });
    }
  }, [profile]);

  if (!isOpen || !profile) return null;

  const isOwner = formData.role === 'Owner';

  const togglePermission = (perm) => {
    if (isOwner) return; // Owners must have Full Access
    
    setFormData(prev => {
      let newPerms = [...prev.permissions];
      
      if (perm === 'Full Access') {
        if (newPerms.includes('Full Access')) {
          newPerms = [];
        } else {
          newPerms = ['Full Access'];
        }
      } else {
        if (newPerms.includes('Full Access')) {
          newPerms = newPerms.filter(p => p !== 'Full Access');
        }
        if (newPerms.includes(perm)) {
          newPerms = newPerms.filter(p => p !== perm);
        } else {
          newPerms.push(perm);
        }
      }
      
      return { ...prev, permissions: newPerms };
    });
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setFormData(prev => ({
      ...prev,
      role: newRole,
      permissions: newRole === 'Owner' ? ['Full Access'] : prev.permissions.filter(p => p !== 'Full Access')
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...profile,
      name: formData.name,
      role: formData.role,
      password: formData.password,
      permissions: isOwner ? ['Full Access'] : formData.permissions,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto border border-gray-100 flex flex-col"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-start shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl border border-white/30">
                    {profile.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Edit Profile</h2>
                    <p className="text-blue-100 text-sm mt-0.5">Manage details and permissions for {profile.name}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/70 hover:text-white transition-colors bg-black/10 rounded-full p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <form id="profile-edit-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                        <UserCircle className="w-4 h-4 text-gray-400" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-gray-400" />
                        Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={handleRoleChange}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                      >
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        <option value="Owner">Owner</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-gray-400" />
                      Login Password
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-gray-800">Module Permissions</h3>
                      <p className="text-xs text-gray-500 mt-1">Control which sections of the application this user can access.</p>
                      {isOwner && (
                        <p className="text-xs text-amber-600 mt-1 font-medium">Owners automatically inherit Full Access.</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {ALL_PERMISSIONS.map(perm => {
                        const isSelected = formData.permissions.includes(perm);
                        const isDisabled = isOwner;
                        return (
                          <button
                            key={perm}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => togglePermission(perm)}
                            className={clsx(
                              "flex items-center p-2.5 rounded-lg border text-sm text-left transition-colors",
                              isSelected 
                                ? "bg-blue-50 border-blue-200 text-blue-700 font-medium" 
                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50",
                              isDisabled && "opacity-60 cursor-not-allowed"
                            )}
                          >
                            <div className={clsx(
                              "w-4 h-4 rounded border flex items-center justify-center mr-2 shrink-0 transition-colors",
                              isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
                            )}>
                              {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className="truncate">{perm}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="profile-edit-form"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
