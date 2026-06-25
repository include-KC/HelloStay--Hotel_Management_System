import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, AlertCircle } from 'lucide-react';

export default function OwnerAuthModal({ isOpen, onClose, onSuccess, targetOwnerId = null }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAuthenticate = (e) => {
    e.preventDefault();
    
    const accountsData = localStorage.getItem('helloStay_accounts');
    const accounts = accountsData ? JSON.parse(accountsData) : [];
    
    // Determine the valid owners
    let validOwners;
    if (targetOwnerId) {
      // Must authenticate as the specific owner being targeted
      validOwners = accounts.filter(a => a.id === targetOwnerId && a.role === 'Owner');
    } else {
      // Can authenticate as ANY owner
      validOwners = accounts.filter(a => a.role === 'Owner');
    }

    if (validOwners.length === 0) {
      setError('No owner profile found to authorize this action.');
      return;
    }

    // In a real application, this would make an API call to verify the hash.
    // For this frontend prototype, we'll accept 'admin123' or any stored password.
    const isAuthenticated = validOwners.some(owner => {
      const validPass = owner.password || 'admin123';
      return password === validPass;
    });

    if (isAuthenticated) {
      setError('');
      setPassword('');
      onSuccess();
    } else {
      setError('Incorrect password. Authentication failed.');
    }
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
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden pointer-events-auto border border-gray-100"
            >
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white flex justify-between items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Lock className="w-24 h-24" />
                </div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/30">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold">Owner Authentication</h2>
                  <p className="text-red-100 text-sm mt-1">This action requires administrative privileges.</p>
                </div>
                
                <button
                  onClick={onClose}
                  className="text-white/70 hover:text-white transition-colors relative z-10 bg-black/10 rounded-full p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleAuthenticate} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {targetOwnerId ? "Target Owner's Password" : "Owner Password"}
                    </label>
                    <input
                      type="password"
                      autoFocus
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-gray-50 transition-all"
                      placeholder="Enter password..."
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Hint for demo: Default password is 'admin123'
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-md shadow-red-200 transition-colors"
                    >
                      Authenticate
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
