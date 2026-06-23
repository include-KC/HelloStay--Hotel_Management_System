import { motion } from 'framer-motion';
import { UserPlus, Upload, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RegisterEmployee() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="bg-emerald-600 p-8 text-white">
            <UserPlus className="w-12 h-12 mb-4 text-emerald-200" />
            <h2 className="text-2xl font-bold">Add New Employee</h2>
            <p className="text-emerald-100 mt-2">Register a staff member and assign their role and salary.</p>
          </div>

          <div className="p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50" placeholder="Jane Smith" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50" placeholder="+91 XXXXX XXXXX" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">System Role</label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50">
                    <option>Receptionist</option>
                    <option>Room Manager</option>
                    <option>Housekeeping</option>
                    <option>Accountant</option>
                    <option>Security</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary (₹)</label>
                  <input type="number" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50" placeholder="15000" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                  <input type="date" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Government ID Number</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50" placeholder="Aadhaar / PAN" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                <textarea rows="2" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50" placeholder="Employee address..."></textarea>
              </div>

              {/* ID Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof Upload</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500">
                        Upload ID copy
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => navigate('/employees')}
                  className="px-6 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/employees')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-md shadow-emerald-200 flex items-center"
                >
                  Save Employee
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
