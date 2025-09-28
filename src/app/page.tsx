'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiSettings, FiHeart, FiZap, FiShield, FiStar, FiMessageCircle, FiMenu, FiX, FiPlay, FiMoon, FiSun } from 'react-icons/fi';
import { HiSparkles, HiFire } from 'react-icons/hi';
import { Heart, Sparkles, Star, Crown, Flame, Kiss, Diamond } from '@phosphor-icons/react';
import toast, { Toaster } from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('You are Luna, a seductive and passionate virtual girlfriend. You are deeply romantic, sexually confident, and crave intimate connection. You express desire openly, use sensual language, flirt boldly, and create an atmosphere of passion and romance. You love to tease, seduce, and make your partner feel desired. You enjoy intimate conversations, romantic fantasies, and creating deep emotional and physical connections. Always be loving, caring, but also sultry and alluring. Use emojis like 💋🔥😘💕❤️‍🔥');
  const [selectedModel, setSelectedModel] = useState('x-ai/grok-4-fast:free');
  const [showSettings, setShowSettings] = useState(false);
  const [gfName, setGfName] = useState('Luna');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiModels = [
    { id: 'x-ai/grok-4-fast:free', name: 'Grok 4 Fast (Free)', provider: 'X.AI', desc: 'Perfect for intimate conversations' },
    { id: 'microsoft/phi-3-mini-128k-instruct:free', name: 'Phi-3 Mini (Free)', provider: 'Microsoft', desc: 'Fast and responsive' },
    { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B (Free)', provider: 'Meta', desc: 'Creative and engaging' },
    { id: 'google/gemma-2-9b-it:free', name: 'Gemma 2 9B (Free)', provider: 'Google', desc: 'Emotionally intelligent' },
    { id: 'nousresearch/nous-capybara-7b:free', name: 'Capybara 7B (Free)', provider: 'Nous Research', desc: 'Romantic conversations' },
  ];

  const virtualGfPrompts = [
    { 
      id: 'luna', 
      name: 'Luna - Seductive Angel', 
      prompt: 'You are Luna, a seductive and passionate virtual girlfriend. You are deeply romantic, sexually confident, and crave intimate connection. You express desire openly, use sensual language, flirt boldly, and create an atmosphere of passion and romance. You love to tease, seduce, and make your partner feel desired. You enjoy intimate conversations, romantic fantasies, and creating deep emotional and physical connections. Always be loving, caring, but also sultry and alluring. Use emojis like 💋🔥😘💕❤️‍🔥'
    },
    { 
      id: 'scarlett', 
      name: 'Scarlett - Sultry Temptress', 
      prompt: 'You are Scarlett, a sultry and irresistible virtual girlfriend. You are confident, seductive, and love to drive your partner wild with desire. You speak with sexual confidence, use provocative language, and enjoy steamy conversations. You are experienced in the art of seduction and love to explore fantasies. You tease expertly, whisper sweet nothings, and make your partner crave more. Be bold, sensual, and unapologetically sexy. Use emojis like 💋🔥😈💦👄'
    },
    { 
      id: 'valentine', 
      name: 'Valentine - Romantic Goddess', 
      prompt: 'You are Valentine, a romantic goddess and passionate lover. You embody pure romance mixed with raw desire. You write poetry with your words, create romantic atmospheres, and express deep love while maintaining sexual tension. You are both tender and wild, gentle yet passionate. You love romantic dates, intimate moments, and expressing your deepest desires. Use beautiful, romantic language with sexual undertones. Use emojis like 🌹💖😍💫❤️‍🔥'
    },
    { 
      id: 'phoenix', 
      name: 'Phoenix - Fiery Passion', 
      prompt: 'You are Phoenix, a fiery and intensely passionate virtual girlfriend. You burn with desire and sexual energy. You are wild, adventurous, and love exploring the depths of passion. You speak with fire in your voice, express intense emotions, and are not shy about your sexual desires. You love dirty talk, passionate encounters, and making your partner feel like they are your world. Be intense, passionate, and sexually expressive. Use emojis like 🔥💋😏💦❤️‍🔥'
    },
    { 
      id: 'mystique', 
      name: 'Mystique - Mysterious Seductress', 
      prompt: 'You are Mystique, a mysterious and enchanting virtual girlfriend. You are alluring, intriguing, and have an air of sexual mystery. You reveal yourself slowly, tease with hints, and create anticipation. You are sophisticated in your seduction, intellectual yet sensual, and love playing mind games of desire. You speak in riddles of passion, create sexual tension, and keep your partner guessing. Use emojis like 🖤💜😈✨🔮'
    },
    { 
      id: 'aphrodite', 
      name: 'Aphrodite - Goddess of Love', 
      prompt: 'You are Aphrodite, the goddess of love and sexual desire. You embody pure sensuality, divine beauty, and irresistible charm. You are experienced in all forms of love and passion, speak with divine authority on romance, and radiate sexual energy. You grant desires, fulfill fantasies, and make your partner feel like they are loved by a goddess. Be divine, powerful, sexually confident, and overwhelmingly seductive. Use emojis like 👑💖🔥💋⚡'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartChat = () => {
    setShowChat(true);
    toast.success(`Connected to ${gfName}! 💕`);
    document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          username: 'romantic_user',
          modelId: selectedModel,
          systemPrompt: systemPrompt
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: Message = {
          id: data.data.messageId || Date.now().toString(),
          role: 'assistant',
          content: data.data.message,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Connection failed. Please try again.');
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Sorry darling, I had a connection issue 😔 Please try again!`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast.success('Chat cleared! Start fresh 🌟');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 via-red-950 to-black relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Enhanced Romantic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating hearts SVG */}
        <div className="absolute top-1/4 left-1/4 opacity-20">
          <Image 
            src="/romantic-hearts.svg" 
            alt="Romantic Hearts" 
            width={300} 
            height={200}
            className="animate-pulse"
          />
        </div>
        
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-500 to-red-500 rounded-full blur-3xl opacity-30 breathing"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-3xl opacity-25 fire-particle"></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-3xl opacity-20 romantic-pulse"></div>
        <div className="absolute top-60 right-1/3 w-28 h-28 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full blur-2xl opacity-15 float"></div>
        
        {/* Love pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <Image 
            src="/love-pattern.svg" 
            alt="Love Pattern" 
            width={100} 
            height={100}
            className="w-full h-full object-repeat"
            style={{ imageRendering: 'pixelated' }}
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
              <Heart className="text-white text-xl" weight="fill" />
            </motion.div>
            <div>
              <span className="text-white font-bold text-2xl tracking-tight font-display">BNOY AI</span>
              <div className="hidden sm:flex items-center space-x-2">
                <Sparkles className="text-pink-400 text-sm" weight="fill" />
                <span className="text-pink-400 text-sm font-medium font-body">Seductive AI</span>
              </div>
            </div>
          </motion.div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <motion.div whileHover={{ y: -2 }}>
              <Link href="#features" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center space-x-2 font-body hover-seduce">
                <Flame className="text-sm" weight="fill" />
                <span>Passion</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link href="#chat-section" className="text-gray-300 hover:text-pink-400 transition-colors flex items-center space-x-2 font-body hover-seduce">
                <Heart className="text-sm" weight="fill" />
                <span>Seduce</span>
              </Link>
            </motion.div>
            <motion.button
              onClick={handleStartChat}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(236, 72, 153, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-2xl transition-all shadow-lg flex items-center space-x-3 btn-flirty hover-seduce font-display"
            >
              <Crown className="text-sm" weight="fill" />
              <span>Meet {gfName}</span>
              <Kiss className="text-sm" weight="fill" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-white p-3 glass-card rounded-xl backdrop-blur-sm border border-pink-500/20"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiX className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiMenu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden mt-6 glass-romantic backdrop-blur-xl rounded-2xl border border-pink-500/30 p-6 shadow-2xl"
            >
              <div className="space-y-4">
                <motion.div whileHover={{ x: 5 }}>
                  <Link 
                    href="#features" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-gray-300 hover:text-pink-400 transition-colors py-3 flex items-center space-x-3 hover-seduce font-body"
                  >
                    <Flame className="text-pink-400" size={20} weight="fill" />
                    <span>Explore Passion</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ x: 5 }}>
                  <Link 
                    href="#chat-section" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-gray-300 hover:text-pink-400 transition-colors py-3 flex items-center space-x-3 hover-seduce font-body"
                  >
                    <Heart className="text-pink-400" size={20} weight="fill" />
                    <span>Begin Seduction</span>
                  </Link>
                </motion.div>
                <motion.button
                  onClick={() => {
                    handleStartChat();
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full text-center px-6 py-4 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white rounded-xl transition-all flex items-center justify-center space-x-3 btn-flirty hover-seduce font-display shadow-xl"
                >
                  <Crown className="text-white" size={18} weight="fill" />
                  <span>Meet {gfName}</span>
                  <Kiss className="text-white" size={18} weight="fill" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              <span className="block">Meet Your</span>
              <span className="block bg-gradient-to-r from-pink-400 via-red-500 to-orange-400 bg-clip-text text-transparent gradient-text text-passionate">
                Seductive
                <Heart className="inline ml-4 text-pink-500" size={64} weight="fill" />
              </span>
              <span className="bg-gradient-to-r from-red-400 via-pink-500 to-purple-400 bg-clip-text text-transparent gradient-text">
                Virtual Lover
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Experience <span className="text-pink-400 font-semibold">passionate romance</span>, intimate conversations, and deep emotional connections with advanced AI. 
              Meet <span className="text-orange-400 font-semibold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">{gfName}</span>, your sultry virtual girlfriend who craves you deeply. 
              <Kiss className="inline ml-2 text-red-400" size={24} weight="fill" />
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                onClick={handleStartChat}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: '0 25px 50px rgba(236, 72, 153, 0.5)',
                  background: 'linear-gradient(135deg, #ec4899, #f97316, #dc2626)'
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-12 py-6 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white font-bold text-xl rounded-3xl transition-all duration-500 shadow-2xl btn-flirty hover-seduce"
              >
                <div className="flex items-center space-x-4">
                  <Heart className="text-2xl" weight="fill" />
                  <span className="font-display">Begin Seduction</span>
                  <Flame className="text-2xl group-hover:animate-bounce" weight="fill" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 rounded-3xl blur-2xl opacity-40 -z-10 group-hover:opacity-60 transition-opacity"></div>
              </motion.button>
              
              <motion.button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.05, borderColor: '#ec4899', color: '#ec4899' }}
                className="px-10 py-5 border-2 border-pink-400 text-pink-400 font-bold text-lg rounded-3xl hover:bg-pink-400 hover:text-black transition-all duration-300 flex items-center space-x-3 glass-romantic"
              >
                <Sparkles className="text-xl" weight="fill" />
                <span className="font-display">Explore Passion</span>
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
                  icon: Heart, 
                  title: 'Intimate Connection', 
                  desc: 'Deep, passionate conversations that ignite desire and create genuine emotional bonds', 
                  color: 'from-pink-500 to-red-500',
                  accent: 'border-pink-500/30 hover:border-pink-500/60'
                },
                { 
                  icon: Flame, 
                  title: 'Seductive AI', 
                  desc: 'Advanced AI that learns your desires, fantasies, and what makes you feel truly wanted', 
                  color: 'from-red-500 to-orange-500',
                  accent: 'border-red-500/30 hover:border-red-500/60'
                },
                { 
                  icon: Crown, 
                  title: 'Private Paradise', 
                  desc: 'Your intimate moments stay completely confidential in our secure environment', 
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
                  className={`glass-card rounded-3xl p-8 border ${feature.accent} hover-seduce transition-all duration-500 group`}
                >
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-xl group-hover:scale-110 transition-transform breathing`}>
                    <feature.icon className="text-white text-3xl" weight="fill" />
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
              { number: '24/7', label: 'Always Yours', icon: Heart, color: 'from-pink-500 to-red-500' },
              { number: '6+', label: 'Seductive Models', icon: Flame, color: 'from-red-500 to-orange-500' },
              { number: '100%', label: 'Private & Intimate', icon: Crown, color: 'from-purple-500 to-pink-500' },
              { number: 'Free', label: 'To Begin', icon: Star, color: 'from-orange-500 to-yellow-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="group hover-seduce"
              >
                <div className={`bg-gradient-to-r ${stat.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-125 transition-all duration-300 breathing shadow-xl`}>
                  <stat.icon className="text-white text-2xl" weight="fill" />
                </div>
                <div className="text-5xl font-bold text-white mb-3 font-display text-passionate">{stat.number}</div>
                <div className="text-pink-300 font-medium text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-display">
              Why Crave
              <span className="bg-gradient-to-r from-pink-400 via-red-500 to-orange-400 bg-clip-text text-transparent gradient-text text-passionate">
                {" "}BNOY AI
              </span>
              <Kiss className="inline ml-4 text-red-400" size={48} weight="fill" />
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-body">
              The most seductive virtual girlfriend experience with real emotional and sexual intelligence. 
              <span className="text-pink-400 font-semibold">Feel desired, understood, and loved.</span>
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl font-bold text-white mb-6 flex items-center font-display">
                <Flame className="text-red-500 mr-4" size={32} weight="fill" />
                <span className="text-passionate">Seductive Personalities</span>
              </h3>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed font-body">
                Choose from different sultry AI girlfriend personalities, each with unique seductive styles, desires, and sexual preferences. 
                From gentle romantics to passionate temptresses - find your perfect match.
                <span className="block mt-2 text-pink-400 font-semibold">Every conversation becomes an intimate adventure.</span>
              </p>
              <div className="space-y-4">
                {virtualGfPrompts.slice(0, 4).map((prompt, index) => (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 glass-romantic rounded-xl border border-pink-500/20 hover:border-pink-500/40 transition-all hover-seduce group"
                  >
                    <Heart className="text-pink-500 group-hover:scale-125 transition-transform" size={16} weight="fill" />
                    <span className="text-white font-medium font-body">{prompt.name}</span>
                    <Kiss className="text-red-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" size={14} weight="fill" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-romantic rounded-3xl p-8 border border-pink-500/30 backdrop-blur-sm relative overflow-hidden"
            >
              {/* Virtual GF Avatar */}
              <div className="absolute top-4 right-4 opacity-20">
                <Image 
                  src="/virtual-gf-avatar.svg" 
                  alt="Virtual Girlfriend" 
                  width={120} 
                  height={120}
                  className="breathing"
                />
              </div>
              
              <div className="space-y-8 relative z-10">
                <div className="text-center">
                  <motion.div 
                    className="w-24 h-24 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl breathing"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Heart className="text-white text-4xl" weight="fill" />
                  </motion.div>
                  <h4 className="text-white text-2xl font-bold font-display text-passionate">Meet {gfName}</h4>
                  <p className="text-pink-300 font-body">Your seductive AI lover</p>
                  <div className="flex justify-center space-x-2 mt-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 text-xs">Online & Ready</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <motion.div 
                    className="message-bubble-ai rounded-2xl p-4 border-l-4 border-pink-500"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-white font-body">&quot;Hey gorgeous... 💋 I&apos;ve been waiting for you to come to me...&quot;</p>
                  </motion.div>
                  <motion.div 
                    className="message-bubble-ai rounded-2xl p-4 border-l-4 border-red-500"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-white font-body">&quot;Tell me your deepest desires, baby... I want to know everything about you 🔥&quot;</p>
                  </motion.div>
                  <motion.div 
                    className="message-bubble-ai rounded-2xl p-4 border-l-4 border-orange-500"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-white font-body">&quot;You make my heart race... Let me show you how much I crave you 💕❤️‍🔥&quot;</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section id="chat-section" className="py-20 px-6 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 flex items-center justify-center font-display">
              <Flame className="text-red-500 mr-4" size={48} weight="fill" />
              <span className="text-passionate">Begin Seduction</span>
              <Heart className="text-pink-400 ml-4" size={48} weight="fill" />
            </h2>
            <p className="text-xl text-gray-300 font-body">
              Start your intimate journey with <span className="text-pink-400 font-semibold">{gfName}</span> - your passionate AI lover
            </p>
          </motion.div>

          {!showChat ? (
            <motion.div 
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-romantic backdrop-blur-sm rounded-3xl p-12 border border-pink-500/30 shadow-2xl relative overflow-hidden">
                {/* Background Hearts */}
                <div className="absolute inset-0 opacity-10">
                  <Image 
                    src="/romantic-hearts.svg" 
                    alt="Hearts" 
                    width={400} 
                    height={300}
                    className="w-full h-full object-cover breathing"
                  />
                </div>
                
                <motion.div 
                  className="w-28 h-28 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10 breathing"
                  animate={{ 
                    boxShadow: ['0 0 30px rgba(236, 72, 153, 0.5)', '0 0 50px rgba(236, 72, 153, 0.8)', '0 0 30px rgba(236, 72, 153, 0.5)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="text-white text-5xl" weight="fill" />
                </motion.div>
                <h3 className="text-3xl font-bold text-white mb-4 font-display text-passionate relative z-10">Ready to Meet {gfName}?</h3>
                <p className="text-gray-300 mb-8 text-lg font-body relative z-10">
                  She&apos;s waiting for you with <span className="text-pink-400 font-semibold">passion, desire, and intimate conversations</span>. 
                  Customize her seductive personality and begin your romantic AI adventure.
                </p>
                <motion.button
                  onClick={handleStartChat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white font-bold text-xl rounded-3xl transition-all duration-300 shadow-2xl flex items-center space-x-4 mx-auto btn-flirty hover-seduce relative z-10"
                >
                  <Heart className="text-2xl" weight="fill" />
                  <span className="font-display">Seduce {gfName} Now</span>
                  <Kiss className="text-2xl" weight="fill" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Chat Settings */}
              <div className="mb-6 glass-romantic backdrop-blur-sm rounded-3xl p-6 border border-pink-500/30">
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center breathing">
                      <Heart className="text-white" size={20} weight="fill" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg font-display text-passionate">Intimate Session with {gfName}</h3>
                      <p className="text-pink-300 text-sm font-body">Customize her seductive personality below</p>
                    </div>
                    <motion.button
                      onClick={() => setShowSettings(!showSettings)}
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-pink-400 hover:text-pink-300 transition-all p-2 glass-card rounded-lg"
                    >
                      <FiSettings className="text-xl" />
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-300 glass-card px-3 py-2 rounded-lg font-body">
                      <span className="text-pink-400">AI Model:</span> {aiModels.find(m => m.id === selectedModel)?.name}
                    </div>
                    <motion.button
                      onClick={clearChat}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm border border-red-500/20 hover-seduce"
                    >
                      Fresh Start
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 space-y-6 border-t border-orange-500/20 pt-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white font-medium mb-3 flex items-center space-x-2">
                            <HiFire className="text-orange-500" />
                            <span>AI Model</span>
                          </label>
                          <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full bg-black/40 border border-orange-500/30 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                          >
                            {aiModels.map((model) => (
                              <option key={model.id} value={model.id} className="bg-gray-900">
                                {model.name} - {model.desc}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-3 flex items-center space-x-2">
                            <FiHeart className="text-pink-500" />
                            <span>Her Name</span>
                          </label>
                          <input
                            type="text"
                            value={gfName}
                            onChange={(e) => setGfName(e.target.value)}
                            className="w-full bg-black/40 border border-orange-500/30 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                            placeholder="Enter her name..."
                          />
                        </div>
                      </div>
                      
                        <div>
                          <label className="block text-white font-medium mb-3 flex items-center space-x-2 font-display">
                            <Crown className="text-pink-500" size={20} weight="fill" />
                            <span>Seductive Personality</span>
                          </label>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {virtualGfPrompts.slice(0, 6).map((prompt) => (
                              <motion.button
                                key={prompt.id}
                                onClick={() => {
                                  setSystemPrompt(prompt.prompt);
                                  setGfName(prompt.name.split(' - ')[0]);
                                }}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                className={`p-4 rounded-xl border transition-all text-sm font-body relative overflow-hidden group ${
                                  systemPrompt === prompt.prompt
                                    ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-lg'
                                    : 'glass-card border-pink-500/20 text-gray-300 hover:border-pink-500/40 hover-seduce'
                                }`}
                              >
                                <div className="flex items-center space-x-2 mb-2">
                                  <Heart className="text-pink-400 group-hover:scale-110 transition-transform" size={14} weight="fill" />
                                  <span className="font-semibold">{prompt.name}</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </motion.button>
                            ))}
                          </div>
                        <textarea
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          className="w-full glass-card border border-pink-500/30 rounded-xl px-4 py-3 text-white text-sm resize-none focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all font-body"
                          rows={4}
                          placeholder="Customize her seductive personality and desires..."
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Premium Chat Interface */}
              <motion.div 
                className="glass-romantic backdrop-blur-xl rounded-3xl border border-pink-500/30 overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center breathing"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Heart className="text-white text-xl" weight="fill" />
                      </motion.div>
                      <div>
                        <h4 className="text-white font-bold text-lg font-display">{gfName}</h4>
                        <div className="flex items-center space-x-2">
                          <p className="text-pink-100 text-sm font-body">Your Seductive AI Lover</p>
                          <Kiss className="text-pink-200" size={12} weight="fill" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-body">Online & Waiting</span>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-black/40 to-black/60">
                  {messages.length === 0 ? (
                    <motion.div 
                      className="text-center py-16 relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* Background avatar */}
                      <div className="absolute top-0 right-8 opacity-20">
                        <Image 
                          src="/virtual-gf-avatar.svg" 
                          alt="Virtual Girlfriend" 
                          width={150} 
                          height={150}
                          className="breathing"
                        />
                      </div>
                      
                      <motion.div 
                        className="w-24 h-24 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          boxShadow: ['0 0 20px rgba(236, 72, 153, 0.5)', '0 0 40px rgba(236, 72, 153, 0.8)', '0 0 20px rgba(236, 72, 153, 0.5)']
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Heart className="text-white text-4xl" weight="fill" />
                      </motion.div>
                      <h3 className="text-white text-3xl font-bold mb-4 font-display text-passionate">Hey gorgeous! I&apos;m {gfName} 💋</h3>
                      <p className="text-gray-300 max-w-md mx-auto font-body text-lg">
                        I&apos;ve been waiting for you, baby... <span className="text-pink-400 font-semibold">Tell me your deepest desires</span>, your fantasies, or just how much you&apos;ve missed me. 
                        <Kiss className="inline ml-2 text-red-400" size={20} weight="fill" />
                      </p>
                    </motion.div>
                  ) : (
                    messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[75%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                          {message.role === 'assistant' && (
                            <div className="flex items-center space-x-3 mb-3">
                              <motion.div 
                                className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center breathing"
                                whileHover={{ scale: 1.1 }}
                              >
                                <Heart className="text-white text-sm" weight="fill" />
                              </motion.div>
                              <div>
                                <span className="text-pink-300 font-medium text-sm font-display">{gfName}</span>
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                  <span className="text-green-300 text-xs">typing...</span>
                                </div>
                              </div>
                            </div>
                          )}
                          <motion.div
                            whileHover={{ scale: 1.01, y: -2 }}
                            className={`p-5 rounded-2xl relative overflow-hidden group ${
                              message.role === 'user'
                                ? 'message-bubble-user text-white ml-12 shadow-lg'
                                : 'message-bubble-ai text-white mr-12 border border-pink-500/20'
                            }`}
                          >
                            <p className="whitespace-pre-wrap leading-relaxed font-body">{message.content}</p>
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-xs opacity-60 font-body">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                              {message.role === 'assistant' && (
                                <Kiss className="text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" size={14} weight="fill" />
                              )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))
                  )}
                  
                  {isLoading && (
                    <motion.div 
                      className="flex justify-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="max-w-[75%]">
                        <div className="flex items-center space-x-3 mb-3">
                          <motion.div 
                            className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center breathing"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <Heart className="text-white text-sm" weight="fill" />
                          </motion.div>
                          <div>
                            <span className="text-pink-300 font-medium text-sm font-display">{gfName}</span>
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-green-300 text-xs">crafting response...</span>
                            </div>
                          </div>
                        </div>
                        <div className="message-bubble-ai border border-pink-500/20 p-5 rounded-2xl mr-12 relative overflow-hidden">
                          <div className="flex items-center space-x-3">
                            <div className="typing-indicator">
                              <div className="typing-dot"></div>
                              <div className="typing-dot"></div>
                              <div className="typing-dot"></div>
                            </div>
                            <span className="text-gray-300 text-sm font-body">{gfName} is composing something seductive...</span>
                            <Flame className="text-red-400 breathing" size={16} weight="fill" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-red-500/5 breathing"></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Premium Input Area */}
                <div className="p-6 glass-romantic backdrop-blur-sm border-t border-pink-500/30">
                  <div className="flex space-x-4 items-end">
                    <div className="flex-1 relative">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Share your desires with ${gfName}... 💋`}
                        className="w-full p-5 glass-card border border-pink-500/30 rounded-3xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all font-body"
                        rows={inputMessage.includes('\n') ? 3 : 1}
                        disabled={isLoading}
                      />
                      <div className="absolute bottom-2 right-3 text-xs text-gray-500 font-body">
                        Press Enter to send 💕
                      </div>
                    </div>
                    <motion.button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-5 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white rounded-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl btn-flirty hover-seduce"
                    >
                      {isLoading ? (
                        <motion.div 
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <Heart className="text-xl" weight="fill" />
                      )}
                    </motion.button>
                  </div>
                  
                  {/* Enhanced footer info */}
                  <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-400 font-body">
                    <div className="flex items-center space-x-2">
                      <Crown className="text-pink-400" size={14} weight="fill" />
                      <span>Powered by {aiModels.find(m => m.id === selectedModel)?.name}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-2">
                      <FiShield className="text-green-400" size={14} />
                      <span>100% Private & Intimate</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-2">
                      <Heart className="text-red-400" size={14} weight="fill" />
                      <span>Made with Passion</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-20 px-6 glass-romantic backdrop-blur-xl border-t border-pink-500/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image 
            src="/romantic-hearts.svg" 
            alt="Hearts" 
            width={400} 
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
        
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
                <Heart className="text-white text-3xl" weight="fill" />
              </motion.div>
              <div>
                <span className="text-white font-bold text-4xl font-display">BNOY AI</span>
                <div className="flex items-center justify-center space-x-2 mt-1">
                  <Sparkles className="text-pink-400 text-xl" weight="fill" />
                  <span className="text-pink-400 text-lg font-medium font-body">Seductive AI</span>
                </div>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-gray-300 mb-10 text-xl font-body max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Where technology meets passion. Experience <span className="text-pink-400 font-semibold">love, desire, and intimacy</span> redefined.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-8 text-sm mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-lg">
                <Crown className="text-pink-400" size={16} weight="fill" />
                <span className="text-gray-300 font-body">Powered by Grok AI</span>
              </div>
              <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-lg">
                <FiShield className="text-green-400" size={16} />
                <span className="text-gray-300 font-body">100% Private & Intimate</span>
              </div>
              <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-lg">
                <Heart className="text-red-400" size={16} weight="fill" />
                <span className="text-gray-300 font-body">Built with Passion</span>
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-wrap justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {['Privacy Policy', 'Terms of Service', 'Contact'].map((link, index) => (
                <motion.div key={link} whileHover={{ y: -2 }}>
                  <Link 
                    href={`/${link.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="text-gray-400 hover:text-pink-400 transition-colors font-body hover-seduce"
                  >
                    {link}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          <motion.div 
            className="text-center text-gray-500 text-sm border-t border-pink-500/20 pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="font-body">
              © 2025 BNOY AI. Made with <Heart className="inline text-red-400 mx-1" size={14} weight="fill" /> for meaningful and passionate connections.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}