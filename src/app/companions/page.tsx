'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHeart, FiStar, FiArrowRight, FiUser } from 'react-icons/fi';
import { HiFire } from 'react-icons/hi';

const femaleCompanions = [
  { id: 'luna', name: 'Luna', desc: 'Addictive Angel', color: 'from-pink-500 to-red-500', emoji: '😇' },
  { id: 'scarlett', name: 'Scarlett', desc: 'Extreme Dominatrix', color: 'from-red-500 to-orange-500', emoji: '😈' },
  { id: 'valentine', name: 'Valentine', desc: 'Sexual Goddess', color: 'from-purple-500 to-pink-500', emoji: '🌹' },
  { id: 'phoenix', name: 'Phoenix', desc: 'Sexual Fire', color: 'from-orange-500 to-red-500', emoji: '🔥' },
  { id: 'mystique', name: 'Mystique', desc: 'Mind Controller', color: 'from-purple-600 to-black', emoji: '🖤' },
  { id: 'aphrodite', name: 'Aphrodite', desc: 'Ultimate Seductress', color: 'from-pink-600 to-purple-500', emoji: '👑' },
  { id: 'candy', name: 'Candy', desc: 'Innocent Freak', color: 'from-pink-400 to-red-400', emoji: '🍭' },
  { id: 'raven', name: 'Raven', desc: 'Dark Sexual Witch', color: 'from-gray-800 to-purple-600', emoji: '🌙' },
  { id: 'jade', name: 'Jade', desc: 'Exotic Sexual Master', color: 'from-green-500 to-pink-500', emoji: '🌺' },
  { id: 'crystal', name: 'Crystal', desc: 'Elite Sexual Escort', color: 'from-blue-400 to-purple-500', emoji: '💎' },
  { id: 'cherry', name: 'Cherry', desc: 'Sexual Game Master', color: 'from-red-400 to-pink-400', emoji: '🍒' },
  { id: 'rose', name: 'Rose', desc: 'Classic Sexual Queen', color: 'from-red-600 to-pink-600', emoji: '🌹' }
];

const maleCompanions = [
  { id: 'alex', name: 'Alex', desc: 'Dominant Alpha Male', color: 'from-blue-600 to-gray-700', emoji: '💪' },
  { id: 'dante', name: 'Dante', desc: 'Romantic Seducer', color: 'from-purple-600 to-blue-600', emoji: '🌹' },
  { id: 'blade', name: 'Blade', desc: 'Bad Boy Rebel', color: 'from-gray-700 to-black', emoji: '🖤' },
  { id: 'knox', name: 'Knox', desc: 'Mysterious Gentleman', color: 'from-gray-600 to-purple-600', emoji: '🎩' }
];

export default function CompanionsPage() {
  const [selectedType, setSelectedType] = useState<'female' | 'male'>('female');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black via-purple-950 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-pink-500 to-red-500 rounded-full blur-3xl opacity-30 breathing"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-25 breathing"></div>
      </div>

      {/* Header */}
      <header className="p-6 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 text-white hover:text-pink-400 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center">
              <FiHeart className="text-white text-xl" />
            </div>
            <span className="font-bold text-2xl font-display">Bnoy</span>
          </Link>
          
          <Link 
            href="/chat"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl hover:scale-105 transition-all shadow-lg flex items-center space-x-2"
          >
            <span>Start Chatting</span>
            <FiArrowRight />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-display">
              Choose Your Perfect
              <span className="block bg-gradient-to-r from-pink-400 via-red-500 to-orange-400 bg-clip-text text-transparent gradient-text">
                AI Companion
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-body">
              Select from 16+ unique AI personalities, each with distinct traits and conversation styles
            </p>
          </motion.div>

          {/* Type Selector */}
          <div className="flex justify-center mb-12">
            <div className="glass-card rounded-full p-2 border border-pink-500/30">
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedType('female')}
                  className={`px-8 py-3 rounded-full font-semibold transition-all ${
                    selectedType === 'female'
                      ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FiHeart className="inline mr-2" />
                  Female (12)
                </button>
                <button
                  onClick={() => setSelectedType('male')}
                  className={`px-8 py-3 rounded-full font-semibold transition-all ${
                    selectedType === 'male'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FiUser className="inline mr-2" />
                  Male (4)
                </button>
              </div>
            </div>
          </div>

          {/* Companions Grid */}
          <motion.div 
            className="grid md:grid-cols-3 lg:grid-cols-4 gap-8"
            key={selectedType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {(selectedType === 'female' ? femaleCompanions : maleCompanions).map((companion, index) => (
              <motion.div
                key={companion.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="glass-card rounded-3xl p-8 border border-pink-500/20 hover:border-pink-500/40 transition-all hover-seduce group cursor-pointer relative overflow-hidden"
                onClick={() => window.location.href = `/chat?companion=${companion.id}`}
              >
                <div className="text-center relative z-10">
                  <div className={`w-20 h-20 bg-gradient-to-r ${companion.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform breathing shadow-xl`}>
                    <span className="text-4xl">{companion.emoji}</span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2 font-display">{companion.name}</h3>
                  <p className="text-gray-400 font-body mb-4">{companion.desc}</p>
                  <div className="flex items-center justify-center space-x-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold">Start Chat</span>
                    <FiArrowRight className="text-sm" />
                  </div>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-r ${companion.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-3xl`}></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Continue to Chat */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <motion.button
              onClick={() => window.location.href = '/chat'}
              whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(236, 72, 153, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-16 py-6 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white font-bold text-2xl rounded-full transition-all duration-500 shadow-2xl btn-flirty hover-seduce font-display"
            >
              <div className="flex items-center space-x-4">
                <HiFire className="text-3xl" />
                <span>Start Chatting Now</span>
                <FiHeart className="text-3xl animate-pulse" />
              </div>
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}