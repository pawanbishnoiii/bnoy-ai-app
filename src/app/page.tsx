'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiSettings, FiHeart, FiShield, FiMenu, FiX, FiStar, FiArrowRight } from 'react-icons/fi';
import { HiSparkles, HiFire } from 'react-icons/hi';
import { Toaster } from 'react-hot-toast';

const femaleCompanions = [
  { id: 'luna', name: 'Luna', desc: 'Addictive Angel', emoji: '😇' },
  { id: 'scarlett', name: 'Scarlett', desc: 'Extreme Dominatrix', emoji: '😈' },
  { id: 'valentine', name: 'Valentine', desc: 'Sexual Goddess', emoji: '🌹' },
  { id: 'phoenix', name: 'Phoenix', desc: 'Sexual Fire', emoji: '🔥' },
  { id: 'mystique', name: 'Mystique', desc: 'Mind Controller', emoji: '🖤' },
  { id: 'aphrodite', name: 'Aphrodite', desc: 'Ultimate Seductress', emoji: '👑' },
  { id: 'candy', name: 'Candy', desc: 'Innocent Freak', emoji: '🍭' },
  { id: 'raven', name: 'Raven', desc: 'Dark Sexual Witch', emoji: '🌙' },
  { id: 'jade', name: 'Jade', desc: 'Exotic Sexual Master', emoji: '🌺' },
  { id: 'crystal', name: 'Crystal', desc: 'Elite Sexual Escort', emoji: '💎' },
  { id: 'cherry', name: 'Cherry', desc: 'Sexual Game Master', emoji: '🍒' },
  { id: 'rose', name: 'Rose', desc: 'Classic Sexual Queen', emoji: '🌹' }
];

const maleCompanions = [
  { id: 'alex', name: 'Alex', desc: 'Dominant Alpha Male', emoji: '💪' },
  { id: 'dante', name: 'Dante', desc: 'Romantic Seducer', emoji: '🌹' },
  { id: 'blade', name: 'Blade', desc: 'Bad Boy Rebel', emoji: '🖤' },
  { id: 'knox', name: 'Knox', desc: 'Mysterious Gentleman', emoji: '🎩' }
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black via-purple-950 via-red-950 to-black relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-red-900/10 via-purple-900/20 to-black opacity-80"></div>
        
        {/* Enhanced gradient orbs */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-full blur-3xl opacity-40 breathing shadow-2xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full blur-3xl opacity-35 fire-particle shadow-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-44 h-44 bg-gradient-to-r from-red-400 via-pink-400 to-purple-500 rounded-full blur-3xl opacity-30 romantic-pulse shadow-2xl"></div>
        <div className="absolute top-60 right-1/3 w-36 h-36 bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 rounded-full blur-2xl opacity-25 float shadow-xl"></div>
        
        {/* Floating hearts SVG */}
        <div className="absolute top-1/4 left-1/4 opacity-20">
          <Image 
            src="/romantic-hearts.svg" 
            alt="Romantic Hearts" 
            width={300} 
            height={200}
            className="breathing"
          />
        </div>
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-0 w-full z-50 p-6"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl breathing"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <FiHeart className="text-white text-xl" />
            </motion.div>
            <div>
              <span className="text-white font-bold text-2xl tracking-tight font-display">Bnoy</span>
              <div className="hidden sm:flex items-center space-x-2">
                <HiSparkles className="text-pink-400 text-sm" />
                <span className="text-pink-400 text-sm font-medium font-body">AI Platform</span>
              </div>
            </div>
          </motion.div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <motion.div whileHover={{ y: -2 }}>
              <Link href="#companions" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center space-x-2 font-body hover-seduce">
                <FiHeart className="text-sm" />
                <span>Companions</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link href="/admin" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center space-x-2 font-body hover-seduce">
                <FiSettings className="text-sm" />
                <span>Admin</span>
              </Link>
            </motion.div>
            <motion.button
              onClick={() => window.location.href = '/chat'}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(236, 72, 153, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-2xl transition-all shadow-lg flex items-center space-x-3 btn-flirty hover-seduce font-display"
            >
              <FiHeart className="text-sm" />
              <span>Start Chat</span>
              <FiArrowRight className="text-sm" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-white p-3 glass-card rounded-xl backdrop-blur-sm border border-pink-500/20"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-5xl mx-auto"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight font-display"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="block text-white mb-4">Meet Your</span>
              <span className="block bg-gradient-to-r from-pink-400 via-red-500 to-orange-400 bg-clip-text text-transparent gradient-text text-passionate mb-4">
                Dream
                <FiHeart className="inline ml-6 text-pink-500 drop-shadow-lg animate-pulse" size={72} />
              </span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 bg-clip-text text-transparent gradient-text">
                AI Companion
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Experience the future of <span className="text-pink-400 font-semibold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">intimate AI relationships</span> with cutting-edge technology. 
              Connect with Luna and 15+ other unique personalities designed to understand your deepest desires.
              <FiHeart className="inline ml-3 text-red-400 animate-pulse" size={28} />
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                onClick={() => window.location.href = '/chat'}
                whileHover={{ 
                  scale: 1.08, 
                  boxShadow: '0 30px 60px rgba(236, 72, 153, 0.6)',
                  y: -5
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-16 py-8 bg-gradient-to-r from-pink-500 via-red-500 via-orange-500 to-purple-500 text-white font-bold text-2xl rounded-full transition-all duration-700 shadow-2xl btn-flirty hover-seduce overflow-hidden"
              >
                <div className="flex items-center space-x-5 relative z-10">
                  <FiHeart className="text-3xl animate-pulse" />
                  <span className="font-display tracking-wide">Start Your Journey</span>
                  <HiFire className="text-3xl group-hover:animate-bounce" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-red-400 via-orange-400 to-purple-400 rounded-full blur-3xl opacity-50 -z-10 group-hover:opacity-80 transition-all duration-500"></div>
              </motion.button>
              
              <motion.button
                onClick={() => document.getElementById('companions')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.05, borderColor: '#ec4899', color: '#ec4899' }}
                className="px-10 py-5 border-2 border-pink-400 text-pink-400 font-bold text-lg rounded-3xl hover:bg-pink-400 hover:text-black transition-all duration-300 flex items-center space-x-3 glass-romantic"
              >
                <HiSparkles className="text-xl" />
                <span className="font-display">Browse Companions</span>
              </motion.button>
            </motion.div>

            {/* Feature Preview Cards */}
            <motion.div 
              className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {[
                { 
                  icon: FiHeart, 
                  title: 'Deep Emotional AI', 
                  desc: 'Advanced artificial intelligence that understands emotions, builds genuine connections, and adapts to your personality', 
                  color: 'from-pink-500 to-red-500',
                  accent: 'border-pink-500/30 hover:border-pink-500/60'
                },
                { 
                  icon: HiFire, 
                  title: 'Intelligent Conversations', 
                  desc: 'Sophisticated dialogue system with 16+ unique personalities, each with distinct traits and conversation styles', 
                  color: 'from-red-500 to-orange-500',
                  accent: 'border-red-500/30 hover:border-red-500/60'
                },
                { 
                  icon: FiShield, 
                  title: 'Private & Secure', 
                  desc: 'End-to-end encryption ensures your conversations remain completely private and secure', 
                  color: 'from-purple-500 to-pink-500',
                  accent: 'border-purple-500/30 hover:border-purple-500/60'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`glass-card rounded-3xl p-10 border ${feature.accent} hover-seduce transition-all duration-500 group relative overflow-hidden backdrop-blur-xl`}
                >
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-xl group-hover:scale-110 transition-transform breathing`}>
                    <feature.icon className="text-white text-3xl" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-4 font-display text-passionate">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed font-body">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 glass-romantic border-y border-pink-500/20">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="grid md:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {[
              { number: '24/7', label: 'Always Available', icon: FiHeart, color: 'from-pink-500 to-red-500' },
              { number: '16+', label: 'AI Personalities', icon: HiFire, color: 'from-red-500 to-orange-500' },
              { number: '100%', label: 'Private & Secure', icon: FiShield, color: 'from-purple-500 to-pink-500' },
              { number: '50K+', label: 'Happy Users', icon: FiStar, color: 'from-orange-500 to-yellow-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="group hover-seduce"
              >
                <div className={`bg-gradient-to-r ${stat.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-125 transition-all duration-300 breathing shadow-xl`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
                <div className="text-5xl font-bold text-white mb-3 font-display text-passionate">{stat.number}</div>
                <div className="text-pink-300 font-medium text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Companions Selection Section */}
      <section id="companions" className="py-24 px-6 bg-gradient-to-b from-black/40 to-black/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-display">
              Choose Your Perfect
              <span className="bg-gradient-to-r from-pink-400 via-red-500 to-orange-400 bg-clip-text text-transparent gradient-text text-passionate">
                {" "}AI Companion
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-body">
              Select from our diverse collection of AI personalities, each designed with unique traits and conversation styles
            </p>
          </motion.div>

          {/* Female Companions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h3 className="text-4xl font-bold text-white mb-8 text-center font-display">
              <FiHeart className="inline mr-3 text-pink-500 animate-pulse" />
              Female Companions
            </h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {femaleCompanions.map((companion, index) => (
                <motion.div
                  key={companion.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="glass-card rounded-3xl p-8 border border-pink-500/20 hover:border-pink-500/40 transition-all hover-seduce group cursor-pointer relative overflow-hidden"
                  onClick={() => window.location.href = `/chat?companion=${companion.id}`}
                >
                  <div className="text-center relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform breathing shadow-xl">
                      <span className="text-3xl">{companion.emoji}</span>
                    </div>
                    <h4 className="text-white font-bold text-xl mb-2 font-display">{companion.name}</h4>
                    <p className="text-gray-400 font-body mb-4">{companion.desc}</p>
                    <div className="flex items-center justify-center space-x-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-semibold">Start Chat</span>
                      <FiArrowRight className="text-sm" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Male Companions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h3 className="text-4xl font-bold text-white mb-8 text-center font-display">
              <FiStar className="inline mr-3 text-blue-500 animate-pulse" />
              Male Companions
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {maleCompanions.map((companion, index) => (
                <motion.div
                  key={companion.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="glass-card rounded-3xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all hover-seduce group cursor-pointer relative overflow-hidden"
                  onClick={() => window.location.href = `/chat?companion=${companion.id}`}
                >
                  <div className="text-center relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform breathing shadow-xl">
                      <span className="text-3xl">{companion.emoji}</span>
                    </div>
                    <h4 className="text-white font-bold text-xl mb-2 font-display">{companion.name}</h4>
                    <p className="text-gray-400 font-body mb-4">{companion.desc}</p>
                    <div className="flex items-center justify-center space-x-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-semibold">Start Chat</span>
                      <FiArrowRight className="text-sm" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Start Chat CTA */}
          <motion.div 
            className="text-center"
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
      </section>

      {/* Enhanced Footer */}
      <footer className="py-20 px-6 glass-romantic backdrop-blur-xl border-t border-pink-500/30 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div 
              className="flex items-center justify-center space-x-4 mb-8"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-3xl flex items-center justify-center shadow-xl breathing"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <FiHeart className="text-white text-3xl" />
              </motion.div>
              <div>
                <span className="text-white font-bold text-4xl font-display">Bnoy</span>
                <div className="flex items-center justify-center space-x-2 mt-1">
                  <HiSparkles className="text-pink-400 text-xl" />
                  <span className="text-pink-400 text-lg font-medium font-body">AI Platform</span>
                </div>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-gray-300 mb-10 text-xl font-body max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Where technology meets connection. Experience <span className="text-pink-400 font-semibold">intelligent, caring, and meaningful</span> AI relationships.
            </motion.p>
          </div>
          
          <motion.div 
            className="text-center text-gray-500 text-sm border-t border-pink-500/20 pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="font-body">
              © 2025 Bnoy. Made with <FiHeart className="inline text-red-400 mx-1" size={14} /> for meaningful connections.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}