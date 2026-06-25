import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, LogIn, ChevronLeft, ArrowRight, Check, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import OwnerAuthModal from '../components/modals/OwnerAuthModal';
import ProfileEditModal from '../components/modals/ProfileEditModal';

export default function Login() {
  const navigate = useNavigate();
  
  const [accounts, setAccounts] = useState(() => {
    const storedAccounts = localStorage.getItem('helloStay_accounts');
    if (storedAccounts) return JSON.parse(storedAccounts);
    
    const mockAccounts = [
      { id: '1', name: 'Krishna', role: 'Owner', avatar: 'K', hotelName: 'HelloStay Demo', permissions: ['Full Access'], password: 'admin' },
      { id: '2', name: 'Aman', role: 'Employee', avatar: 'A', hotelName: 'HelloStay Demo', permissions: ['Bookings', 'Guests'], password: 'admin' },
      { id: '3', name: 'Priya', role: 'Manager', avatar: 'P', hotelName: 'HelloStay Demo', permissions: ['Bookings', 'Guests', 'Rooms', 'Housekeeping', 'Inventory'], password: 'admin' }
    ];
    localStorage.setItem('helloStay_accounts', JSON.stringify(mockAccounts));
    return mockAccounts;
  });

  const [keepLoggedIn, setKeepLoggedIn] = useState(() => localStorage.getItem('helloStay_keepLoggedIn') === 'true');
  const [manualLogin, setManualLogin] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  
  // Modal States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // { type: 'edit'|'delete', account: {} }
  const [targetOwnerId, setTargetOwnerId] = useState(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleProfileSelect = (account) => {
    setSelectedProfile(account);
    setPassword('');
    setAuthError('');
  };

  const handleProfileAuth = (e) => {
    e.preventDefault();
    const validPass = selectedProfile.password || 'admin123';
    if (password === validPass) {
      setAuthError('');
      authenticate(selectedProfile);
    } else {
      setAuthError('Incorrect password');
    }
  };

  const handleManualLogin = (e) => {
    e.preventDefault();
    const newAccount = { 
      id: email, 
      name: email.split('@')[0], 
      role: 'Manager', 
      avatar: email.charAt(0).toUpperCase(), 
      hotelName: 'HelloStay',
      permissions: ['Bookings', 'Rooms']
    };
    authenticate(newAccount);
  };

  const authenticate = (account) => {
    localStorage.setItem('helloStay_session', JSON.stringify(account));
    localStorage.setItem('helloStay_keepLoggedIn', keepLoggedIn.toString());
    
    const exists = accounts.find(a => a.id === account.id);
    if (!exists) {
      const updatedAccounts = [...accounts, account];
      setAccounts(updatedAccounts);
      localStorage.setItem('helloStay_accounts', JSON.stringify(updatedAccounts));
    }

    const hotelData = localStorage.getItem('helloStay_hotelData');
    if (!hotelData) {
      navigate('/hotel-info');
    } else {
      navigate('/dashboard');
    }
  };

  // Profile Management Actions
  const handleActionRequest = (e, type, account) => {
    e.stopPropagation(); // Prevent profile selection
    
    if (type === 'delete' && account.role === 'Owner') {
      const ownerCount = accounts.filter(a => a.role === 'Owner').length;
      if (ownerCount <= 1) {
        alert("Cannot delete the final Owner account. At least one Owner must remain.");
        return;
      }
    }

    setPendingAction({ type, account });
    
    // On the Login screen, ANY edit/delete requires Owner verification.
    // If the target is an Owner, require THAT specific owner's password.
    // If the target is an Employee, require ANY owner's password.
    if (account.role === 'Owner') {
      setTargetOwnerId(account.id);
    } else {
      setTargetOwnerId(null);
    }
    
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    
    if (pendingAction.type === 'edit') {
      setEditModalOpen(true);
    } else if (pendingAction.type === 'delete') {
      if (window.confirm(`Are you sure you want to delete the profile for ${pendingAction.account.name}?`)) {
        const newAccounts = accounts.filter(a => a.id !== pendingAction.account.id);
        setAccounts(newAccounts);
        localStorage.setItem('helloStay_accounts', JSON.stringify(newAccounts));
      }
    }
  };

  const handleSaveProfile = (updatedProfile) => {
    const newAccounts = accounts.map(a => a.id === updatedProfile.id ? updatedProfile : a);
    setAccounts(newAccounts);
    localStorage.setItem('helloStay_accounts', JSON.stringify(newAccounts));
    setEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 text-white flex-col justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90 z-0"></div>
        <div className="relative z-10 max-w-lg">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/30">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Manage your hotel effortlessly.</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Select your profile to continue. HelloStay provides commercial-grade tools from a single dashboard. Multiple profiles per hotel are seamlessly supported.
          </p>
        </div>
      </div>

      {/* Right side - Interactive UI */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          
          <AnimatePresence mode="wait">
            {!manualLogin && !selectedProfile && (
              <motion.div
                key="profile-selection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center lg:text-left mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
                  <p className="text-gray-500 mt-2">Select an account to sign in.</p>
                </div>

                {/* Account List */}
                <div className="space-y-3 mb-8">
                  {accounts.map(account => (
                    <div
                      key={account.id}
                      className="w-full flex items-center p-4 border border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group bg-white cursor-pointer"
                      onClick={() => handleProfileSelect(account)}
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mr-4 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {account.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{account.name}</p>
                        <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                          {account.role} {account.hotelName && <span className="text-gray-300">•</span>} {account.hotelName}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                        <button 
                          onClick={(e) => handleActionRequest(e, 'edit', account)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Role"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleActionRequest(e, 'delete', account)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Role"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                  ))}
                </div>

                {/* Additional Actions */}
                <div className="space-y-2">
                  <button 
                    onClick={() => navigate('/register-account')}
                    className="w-full flex items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <Plus className="w-4 h-4 text-gray-600" />
                    </div>
                    Create New Account
                  </button>

                  <button 
                    onClick={() => setManualLogin(true)}
                    className="w-full flex items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <LogIn className="w-4 h-4 text-gray-600" />
                    </div>
                    Login with another account
                  </button>
                </div>

              </motion.div>
            )}

            {selectedProfile && (
              <motion.div
                key="profile-login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <button 
                  onClick={() => setSelectedProfile(null)}
                  className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back to profiles
                </button>

                <div className="text-center mb-8 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-3xl mb-4 border-4 border-white shadow-sm">
                    {selectedProfile.avatar}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Hi, {selectedProfile.name}</h2>
                  <p className="text-gray-500 mt-1">Please enter your password.</p>
                </div>

                <form onSubmit={handleProfileAuth} className="space-y-5">
                  {authError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-sm text-red-600 font-medium text-center">{authError}</p>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot?</button>
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 transition-all"
                      placeholder="••••••••"
                      autoFocus
                    />
                  </div>

                  {/* Persistent Login Toggle */}
                  <div className="pt-2">
                    <label className="flex items-center cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={keepLoggedIn}
                          onChange={(e) => {
                            setKeepLoggedIn(e.target.checked);
                            localStorage.setItem('helloStay_keepLoggedIn', e.target.checked.toString());
                          }}
                        />
                        <div className={clsx(
                          "w-5 h-5 border rounded flex items-center justify-center transition-colors",
                          keepLoggedIn ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-400"
                        )}>
                          {keepLoggedIn && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700 select-none">Remember me</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center justify-center mt-6"
                  >
                    Authenticate
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </form>
              </motion.div>
            )}

            {manualLogin && (
              <motion.div
                key="manual-login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <button 
                  onClick={() => setManualLogin(false)}
                  className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back to profiles
                </button>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Manual Login</h2>
                  <p className="text-gray-500 mt-2">Enter your credentials to access your account.</p>
                </div>

                <form onSubmit={handleManualLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email / User ID</label>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 transition-all"
                      placeholder="admin@hotel.com"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot?</button>
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  {/* Persistent Login Toggle */}
                  <div className="pt-2">
                    <label className="flex items-center cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={keepLoggedIn}
                          onChange={(e) => {
                            setKeepLoggedIn(e.target.checked);
                            localStorage.setItem('helloStay_keepLoggedIn', e.target.checked.toString());
                          }}
                        />
                        <div className={clsx(
                          "w-5 h-5 border rounded flex items-center justify-center transition-colors",
                          keepLoggedIn ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-400"
                        )}>
                          {keepLoggedIn && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700 select-none">Remember me</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center justify-center mt-6"
                  >
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

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
