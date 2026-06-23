import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Installer() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing Setup...');
  const [isFinished, setIsFinished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stages = [
      { p: 20, text: 'Configuring Local Database...' },
      { p: 50, text: 'Setting up Administrator Profiles...' },
      { p: 80, text: 'Applying Security Protocols...' },
      { p: 100, text: 'Installation Complete!' }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProgress(stages[currentStage].p);
        setStatus(stages[currentStage].text);
        if (stages[currentStage].p === 100) {
          setIsFinished(true);
          clearInterval(interval);
        }
        currentStage++;
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <span className="text-white font-bold text-3xl">H</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">HelloStay Setup</h1>
          <p className="text-gray-500 mt-2 text-sm">v1.0.0 Enterprise Edition</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span className={isFinished ? "text-emerald-600" : "text-blue-600"}>{status}</span>
            <span className="text-gray-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className={`h-2.5 rounded-full ${isFinished ? 'bg-emerald-500' : 'bg-blue-600'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {isFinished ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center text-emerald-600 bg-emerald-50 p-3 rounded-lg mb-6">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              <span className="font-medium">System is ready for first launch</span>
            </div>
            <button
              onClick={() => {
                localStorage.setItem('helloStay_userRole', 'owner');
                navigate('/register-owner');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center justify-center"
            >
              Continue to Registration
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center text-gray-400 py-6">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">Please do not close this window...</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
