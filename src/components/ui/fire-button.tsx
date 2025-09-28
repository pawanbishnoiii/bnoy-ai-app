'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FireButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function FireButton({ 
  children, 
  onClick, 
  disabled = false, 
  size = 'md',
  variant = 'primary',
  className = ''
}: FireButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white',
    secondary: 'border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
        font-bold rounded-2xl transition-all duration-300 shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        relative overflow-hidden group
      `}
    >
      {/* Fire glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl blur-xl opacity-50 -z-10 group-hover:opacity-70 transition-opacity"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {children}
      </div>
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
}