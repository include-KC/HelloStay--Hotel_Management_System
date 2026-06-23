import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, UserCircle, KeyRound, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [role, setRole] = useState('employee');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 text-white flex-col justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90 z-0"></div>
        <div className="relative z-10 max-w-lg">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/30">
            <span className="text-white font-bold text-3xl">H</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Manage your hotel effortlessly.</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            HelloStay provides commercial-grade tools to manage rooms, payroll, and guest experiences from a single dashboard.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
            <button 
              onClick={() => setRole('employee')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'employee' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Employee Login
            </button>
            <button 
              onClick={() => setRole('owner')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'owner' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Owner Login
            </button>
          </div>

          <form className="space-y-5">
            {role === 'employee' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="text" className="pl-10 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 transition-all" placeholder="EMP-001" />
                </div>
              </div>
            )}

            {role === 'owner' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registered Email / Hotel ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="text" className="pl-10 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 transition-all" placeholder="admin@hotel.com" />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input type="password" className="pl-10 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 transition-all" placeholder="••••••••" />
              </div>
            </div>

            <button 
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center justify-center mt-6"
            >
              Sign In
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </form>

          {/* Setup Link for first-time use */}
          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              First time setting up the software?{' '}
              <button onClick={() => navigate('/installer')} className="font-medium text-blue-600 hover:text-blue-500">
                Run Setup Wizard
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
