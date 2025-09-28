'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowingCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'orange' | 'pink' | 'red' | 'purple';
  intensity?: 'low' | 'medium' | 'high';
}

export default function GlowingCard({ 
  children, 
  className = '',
  glowColor = 'orange',
  intensity = 'medium'
}: GlowingCardProps) {
  const glowColors = {
    orange: 'rgba(249, 115, 22, 0.4)',
    pink: 'rgba(236, 72, 153, 0.4)',
    red: 'rgba(220, 38, 38, 0.4)',
    purple: 'rgba(147, 51, 234, 0.4)'
  };

  const intensityValues = {
    low: '0 0 20px',
    medium: '0 0 30px',
    high: '0 0 40px'
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: `${intensityValues[intensity]} ${glowColors[glowColor]}`
      }}
      transition={{ duration: 0.3 }}
      className={`
        bg-black/40 backdrop-blur-sm rounded-2xl border border-${glowColor}-500/20 
        hover:border-${glowColor}-500/40 transition-all duration-300
        ${className}
      `}
      style={{
        boxShadow: `${intensityValues.low} ${glowColors[glowColor]}`
      }}
    >
      {children}
    </motion.div>
  );
}