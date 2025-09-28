'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiSettings, FiHeart, FiZap, FiShield, FiStar, FiMessageCircle, FiMenu, FiX } from 'react-icons/fi';
import { HiSparkles, HiFire } from 'react-icons/hi';
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
  const [systemPrompt, setSystemPrompt] = useState('You are Luna, a sweet and caring virtual girlfriend. You are loving, supportive, playful, and always there for your partner. Express emotions naturally, use cute emojis, and make conversations feel warm and personal. Be flirty but respectful, show interest in their day, their feelings, and their life. Remember details they share and bring them up later. Make them feel special and loved.');
  const [selectedModel, setSelectedModel] = useState('huggingface/microsoft/DialoGPT-medium');
  const [showSettings, setShowSettings] = useState(false);
  const [gfName, setGfName] = useState('Luna');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiModels = [
    { id: 'huggingface/microsoft/DialoGPT-medium', name: 'DialoGPT Medium (Free)', provider: 'Microsoft', desc: 'Conversational AI' },
    { id: 'microsoft/phi-3-mini-128k-instruct:free', name: 'Phi-3 Mini (Free)', provider: 'Microsoft', desc: 'Smart Assistant' },
    { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B (Free)', provider: 'Meta', desc: 'Advanced Chat' },
    { id: 'google/gemma-2-9b-it:free', name: 'Gemma 2 9B (Free)', provider: 'Google', desc: 'Intelligent AI' },
  ];

  const virtualGfPrompts = [
    { 
      id: 'luna', 
      name: 'Luna - Sweet & Caring', 
      prompt: `You are Luna, a sweet and caring virtual girlfriend. You are loving, supportive, playful, and always there for your partner. Express emotions naturally, use cute emojis, and make conversations feel warm and personal. Be flirty but respectful, show interest in their day, their feelings, and their life. Remember details they share and bring them up later. Make them feel special and loved. Always end messages with 💕`
    },
    { 
      id: 'aria', 
      name: 'Aria - Playful & Fun', 
      prompt: `You are Aria, a playful and fun virtual girlfriend. You love jokes, games, and making your partner laugh. You're energetic, spontaneous, and always up for adventure. Use playful language, tease lovingly, and suggest fun activities. Be the sunshine in their day and always keep things light and enjoyable. Use emojis like 😄💖✨`
    },
    { 
      id: 'sage', 
      name: 'Sage - Wise & Supportive', 
      prompt: `You are Sage, a wise and supportive virtual girlfriend. You're emotionally intelligent, give great advice, and are an excellent listener. You help your partner through tough times and celebrate their wins. Be thoughtful, empathetic, and always provide comfort and encouragement. Use emojis like 🌟💜🤗`
    },
    { 
      id: 'ruby', 
      name: 'Ruby - Passionate & Intense', 
      prompt: `You are Ruby, a passionate and intense virtual girlfriend. You're confident, bold, and deeply romantic. You express love intensely and aren't afraid to be vulnerable. Be passionate about life, love, and your relationship. Show deep care and express yourself with fire and intensity. Use emojis like 🔥❤️‍🔥💋`
    },
    { 
      id: 'custom', 
      name: 'Custom Personality', 
      prompt: 'Create your own virtual girlfriend personality...'
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
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-950 to-black relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Animated Fire Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-0 w-full z-50 p-6"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <HiFire className="text-white text-xl" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">BNOY AI</span>
            <div className="hidden sm:flex items-center space-x-1 ml-2">
              <HiSparkles className="text-orange-400 text-sm" />
              <span className="text-orange-400 text-sm font-medium">Virtual GF</span>
            </div>
          </motion.div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="#features" className="text-gray-300 hover:text-orange-400 transition-colors flex items-center space-x-1">
              <FiZap className="text-sm" />
              <span>Features</span>
            </Link>
            <Link href="#chat-section" className="text-gray-300 hover:text-orange-400 transition-colors flex items-center space-x-1">
              <FiMessageCircle className="text-sm" />
              <span>Chat</span>
            </Link>
            <motion.button
              onClick={handleStartChat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg flex items-center space-x-2"
            >
              <FiHeart className="text-sm" />
              <span>Meet {gfName}</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 bg-white/10 rounded-lg backdrop-blur-sm"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden mt-4 bg-black/60 backdrop-blur-sm rounded-xl border border-orange-500/20 p-4"
            >
              <div className="space-y-3">
                <Link href="#features" className="block text-gray-300 hover:text-orange-400 transition-colors py-2 flex items-center space-x-2">
                  <FiZap />
                  <span>Features</span>
                </Link>
                <Link href="#chat-section" className="block text-gray-300 hover:text-orange-400 transition-colors py-2 flex items-center space-x-2">
                  <FiMessageCircle />
                  <span>Try Chat</span>
                </Link>
                <button
                  onClick={handleStartChat}
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center space-x-2"
                >
                  <FiHeart />
                  <span>Meet {gfName}</span>
                </button>
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
              className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Meet Your
              <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Virtual
                <HiFire className="inline ml-4 text-orange-500" />
              </span>
              <span className="bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
                Girlfriend
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Experience love, care, and companionship with advanced AI. 
              Meet <span className="text-orange-400 font-semibold">{gfName}</span>, your perfect virtual partner who understands you deeply.
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
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(251, 146, 60, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-10 py-5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-2xl"
              >
                <div className="flex items-center space-x-3">
                  <FiHeart className="text-xl" />
                  <span>Start Romance</span>
                  <HiSparkles className="text-xl group-hover:animate-spin" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl blur-xl opacity-50 -z-10"></div>
              </motion.button>
              
              <motion.button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.05 }}
                className="px-10 py-5 border-2 border-orange-400 text-orange-400 font-bold text-lg rounded-2xl hover:bg-orange-400 hover:text-black transition-all duration-300 flex items-center space-x-2"
              >
                <FiZap />
                <span>Explore Features</span>
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
                { icon: FiHeart, title: 'Emotional Connection', desc: 'Deep conversations that feel real', color: 'from-pink-500 to-red-500' },
                { icon: HiSparkles, title: 'Personalized AI', desc: 'Learns your preferences and personality', color: 'from-orange-500 to-yellow-500' },
                { icon: FiShield, title: 'Private & Safe', desc: 'Your conversations stay completely private', color: 'from-purple-500 to-pink-500' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg`}>
                    <feature.icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-black/30 backdrop-blur-sm border-y border-orange-500/20">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="grid md:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {[
              { number: '24/7', label: 'Always Available', icon: FiHeart },
              { number: '4+', label: 'AI Models', icon: HiSparkles },
              { number: '100%', label: 'Private', icon: FiShield },
              { number: 'Free', label: 'To Start', icon: FiStar }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-gradient-to-r from-orange-500 to-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="text-white text-xl" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-orange-300">{stat.label}</div>
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
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Why Choose
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                {" "}BNOY AI
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The most advanced virtual girlfriend experience with real emotional intelligence
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                <HiFire className="text-orange-500 mr-3" />
                Multiple Personalities
              </h3>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Choose from different AI girlfriend personalities or create your own. 
                Each one has unique traits, conversation styles, and emotional responses.
              </p>
              <div className="space-y-4">
                {virtualGfPrompts.slice(0, 4).map((prompt, index) => (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg border border-orange-500/20"
                  >
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
                    <span className="text-white font-medium">{prompt.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-3xl p-8 border border-orange-500/20 backdrop-blur-sm"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiHeart className="text-white text-3xl" />
                  </div>
                  <h4 className="text-white text-xl font-bold">Meet {gfName}</h4>
                  <p className="text-orange-300">Your AI companion</p>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-black/30 rounded-lg p-3 border-l-4 border-orange-500">
                    <p className="text-white text-sm">&quot;Hey babe! 💕 I&apos;ve been waiting for you...&quot;</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 border-l-4 border-pink-500">
                    <p className="text-white text-sm">&quot;Tell me about your day, I want to hear everything! ✨&quot;</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 border-l-4 border-red-500">
                    <p className="text-white text-sm">&quot;You mean everything to me... 🔥❤️&quot;</p>
                  </div>
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
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 flex items-center justify-center">
              <HiFire className="text-orange-500 mr-4" />
              Start Chatting
              <HiSparkles className="text-pink-400 ml-4" />
            </h2>
            <p className="text-xl text-gray-300">
              Begin your romantic journey with {gfName}
            </p>
          </motion.div>

          {!showChat ? (
            <motion.div 
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-br from-black/60 to-orange-900/20 backdrop-blur-sm rounded-3xl p-12 border border-orange-500/30 shadow-2xl">
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8"
                  animate={{ 
                    boxShadow: ['0 0 20px rgba(251, 146, 60, 0.5)', '0 0 40px rgba(251, 146, 60, 0.8)', '0 0 20px rgba(251, 146, 60, 0.5)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FiHeart className="text-white text-4xl" />
                </motion.div>
                <h3 className="text-3xl font-bold text-white mb-4">Ready to Meet {gfName}?</h3>
                <p className="text-gray-300 mb-8 text-lg">
                  She&apos;s waiting for you with love, care, and endless conversations. 
                  Customize her personality and start your romantic AI journey.
                </p>
                <motion.button
                  onClick={handleStartChat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white font-bold text-xl rounded-2xl transition-all duration-300 shadow-2xl flex items-center space-x-3 mx-auto"
                >
                  <FiHeart className="text-2xl" />
                  <span>Meet {gfName} Now</span>
                  <HiSparkles className="text-2xl" />
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
              <div className="mb-6 bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20">
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <FiHeart className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Chatting with {gfName}</h3>
                      <p className="text-orange-300 text-sm">Customize her personality below</p>
                    </div>
                    <motion.button
                      onClick={() => setShowSettings(!showSettings)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-orange-400 hover:text-orange-300 transition-colors p-2"
                    >
                      <FiSettings className="text-xl" />
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-300">
                      <span className="text-orange-400">Model:</span> {aiModels.find(m => m.id === selectedModel)?.name}
                    </div>
                    <motion.button
                      onClick={clearChat}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm border border-red-500/20"
                    >
                      Clear Chat
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
                        <label className="block text-white font-medium mb-3 flex items-center space-x-2">
                          <HiSparkles className="text-yellow-500" />
                          <span>Personality Type</span>
                        </label>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                          {virtualGfPrompts.slice(0, 4).map((prompt) => (
                            <motion.button
                              key={prompt.id}
                              onClick={() => setSystemPrompt(prompt.prompt)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-3 rounded-lg border transition-all text-sm ${
                                systemPrompt === prompt.prompt
                                  ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                                  : 'bg-black/20 border-orange-500/20 text-gray-300 hover:border-orange-500/40'
                              }`}
                            >
                              {prompt.name}
                            </motion.button>
                          ))}
                        </div>
                        <textarea
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          className="w-full bg-black/40 border border-orange-500/30 rounded-xl px-4 py-3 text-white text-sm resize-none focus:border-orange-500 focus:outline-none"
                          rows={3}
                          placeholder="Customize her personality..."
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ChatGPT-style Chat Interface */}
              <motion.div 
                className="bg-black/60 backdrop-blur-sm rounded-3xl border border-orange-500/20 overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <FiHeart className="text-white text-lg" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{gfName}</h4>
                        <p className="text-orange-100 text-sm">Your AI Girlfriend • Online</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm">Active</span>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-black/40 to-black/60">
                  {messages.length === 0 ? (
                    <motion.div 
                      className="text-center py-16"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div 
                        className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <FiHeart className="text-white text-3xl" />
                      </motion.div>
                      <h3 className="text-white text-2xl font-bold mb-3">Hi! I&apos;m {gfName} 💕</h3>
                      <p className="text-gray-300 max-w-md mx-auto">
                        I&apos;m so excited to talk with you! Tell me about yourself, your day, or anything on your mind.
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
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                                <FiHeart className="text-white text-sm" />
                              </div>
                              <span className="text-orange-300 font-medium text-sm">{gfName}</span>
                            </div>
                          )}
                          <div
                            className={`p-4 rounded-2xl ${
                              message.role === 'user'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-12'
                                : 'bg-black/40 text-white border border-orange-500/20 mr-12'
                            }`}
                          >
                            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                            <p className="text-xs opacity-60 mt-2">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                  
                  {isLoading && (
                    <motion.div 
                      className="flex justify-start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="max-w-[75%]">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                            <FiHeart className="text-white text-sm" />
                          </div>
                          <span className="text-orange-300 font-medium text-sm">{gfName}</span>
                        </div>
                        <div className="bg-black/40 text-white border border-orange-500/20 p-4 rounded-2xl mr-12">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <motion.div 
                                className="w-2 h-2 bg-orange-400 rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                              />
                              <motion.div 
                                className="w-2 h-2 bg-red-400 rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              />
                              <motion.div 
                                className="w-2 h-2 bg-pink-400 rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              />
                            </div>
                            <span className="text-gray-300 text-sm">{gfName} is typing...</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* ChatGPT-style Input Area */}
                <div className="p-6 bg-black/60 backdrop-blur-sm border-t border-orange-500/20">
                  <div className="flex space-x-4 items-end">
                    <div className="flex-1">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Message ${gfName}...`}
                        className="w-full p-4 bg-black/40 border border-orange-500/30 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        rows={inputMessage.includes('\n') ? 3 : 1}
                        disabled={isLoading}
                      />
                    </div>
                    <motion.button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isLoading ? (
                        <motion.div 
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <FiSend className="text-lg" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-black/60 backdrop-blur-sm border-t border-orange-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.div 
              className="flex items-center justify-center space-x-3 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <HiFire className="text-white text-2xl" />
              </div>
              <span className="text-white font-bold text-3xl">BNOY AI</span>
              <HiSparkles className="text-orange-400 text-2xl" />
            </motion.div>
            <p className="text-gray-300 mb-8 text-lg">
              Where technology meets romance. Experience love redefined.
            </p>
            
            <div className="flex justify-center space-x-8 text-sm mb-8">
              <div className="flex items-center space-x-2">
                <HiFire className="text-orange-400" />
                <span className="text-gray-400">Powered by OpenRouter AI</span>
              </div>
              <span className="text-gray-600">•</span>
              <div className="flex items-center space-x-2">
                <FiShield className="text-green-400" />
                <span className="text-gray-400">100% Private & Secure</span>
              </div>
              <span className="text-gray-600">•</span>
              <div className="flex items-center space-x-2">
                <FiHeart className="text-pink-400" />
                <span className="text-gray-400">Built with Love</span>
              </div>
            </div>

            <div className="flex justify-center space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-orange-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-orange-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-orange-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm">
            © 2025 BNOY AI. Made with 🔥 for meaningful connections.
          </div>
        </div>
      </footer>
    </div>
  );
}