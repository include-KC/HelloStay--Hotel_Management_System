import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ArrowRight } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();
  const [showStart, setShowStart] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Unconditionally reveal the start button after 2 seconds
      setShowStart(true);
    }, 2000); // 2 second splash duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-blue-600 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 z-0 opacity-90"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/30 shadow-2xl"
        >
          <Building2 className="w-12 h-12 text-white" />
        </motion.div>

        {/* Text */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-extrabold text-white tracking-tight"
        >
          HelloStay
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-blue-200 mt-2 font-medium tracking-wide"
        >
          Premium Hotel Management
        </motion.p>

        {/* Loading Bar or Start Button */}
        <div className="h-16 mt-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!showStart ? (
              <motion.div 
                key="loading-bar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 192, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.8, duration: 1.2, ease: "easeInOut" }}
                className="h-1 bg-white/50 rounded-full overflow-hidden"
              >
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ delay: 0.8, duration: 1.2, ease: "easeInOut" }}
                  className="h-full bg-white w-full rounded-full"
                />
              </motion.div>
            ) : (
              <motion.button
                key="start-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate('/login')}
                className="flex items-center px-8 py-3 bg-white text-blue-600 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
