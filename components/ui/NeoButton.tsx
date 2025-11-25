import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface NeoButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'danger';
  fullWidth?: boolean;
}

const NeoButton: React.FC<NeoButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  
  const getColors = () => {
    switch(variant) {
      case 'primary': return 'bg-neo-primary hover:bg-[#9BE685]';
      case 'secondary': return 'bg-neo-secondary hover:bg-[#E68585]';
      case 'accent': return 'bg-neo-accent hover:bg-[#85C4E6]';
      case 'danger': return 'bg-red-400 hover:bg-red-500';
      case 'outline': return 'bg-white hover:bg-gray-100';
      default: return 'bg-neo-primary';
    }
  };

  return (
    <motion.button
      whileHover={{ y: 2, x: 2, boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
      whileTap={{ y: 4, x: 4, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' }}
      className={`
        ${getColors()} 
        ${fullWidth ? 'w-full' : ''}
        border-2 border-black 
        shadow-neo 
        text-black font-bold 
        py-3 px-6 
        rounded-lg 
        transition-colors duration-100
        flex items-center justify-center gap-2
        text-lg
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default NeoButton;