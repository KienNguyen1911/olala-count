import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children, footer }) => {
  
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
          >
            <div className="
              w-full max-w-2xl 
              h-[95vh] 
              bg-white 
              border-t-4 border-l-4 border-r-4 border-black 
              rounded-t-3xl 
              shadow-[0px_-10px_40px_rgba(0,0,0,0.2)]
              flex flex-col
              pointer-events-auto
            ">
              {/* Header - Smaller Size */}
              <div className="flex items-center justify-between p-4 border-b-2 border-black bg-neo-warning rounded-t-[20px]">
                <h2 className="text-lg font-black uppercase tracking-tight text-black">{title}</h2>
                <button 
                  onClick={onClose}
                  className="p-1 text-black hover:bg-black hover:text-white border-2 border-transparent hover:border-black rounded-full transition-all"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar text-black">
                {children}
              </div>

              {/* Sticky Footer */}
              {footer && (
                <div className="p-4 border-t-2 border-black bg-white">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;