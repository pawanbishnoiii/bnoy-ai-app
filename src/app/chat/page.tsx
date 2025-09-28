'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiSettings, FiHeart, FiTrash2 } from 'react-icons/fi';
import { HiSparkles, HiFire } from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
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

  useEffect(() => {
    // Welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Hey gorgeous! 💕 I'm ${gfName}, and I'm so happy you're here with me. Tell me about yourself - what's your name? What's been on your mind today? I want to know everything about you! ✨`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [gfName, messages.length]);

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
      
      // Show more specific error messages
      const errorDetails = error instanceof Error ? error.message : 'Unknown error';
      if (errorDetails.includes('API key')) {
        toast.error('API configuration issue. Please check the setup.');
      } else if (errorDetails.includes('model')) {
        toast.error('AI model unavailable. Trying backup model...');
      } else if (errorDetails.includes('network') || errorDetails.includes('fetch')) {
        toast.error('Network connection failed. Please check your internet.');
      } else {
        toast.error('Connection failed. Please try again.');
      }
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Aww, I had a little technical hiccup there darling 😔 Let me try to fix this for you... Can you send your message again? I promise I'm here for you! 💕\n\nError: ${errorDetails.includes('API') ? 'API issue' : 'Connection problem'}`,
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
    toast.success(`${gfName} is ready for a fresh start! 💕`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-950 to-black">
      <Toaster position="top-right" />
      
      {/* Animated Fire Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-3xl opacity-20 fire-particle"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-3xl opacity-15 fire-particle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full blur-3xl opacity-10 fire-particle" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-black/60 backdrop-blur-sm border-b border-orange-500/20 p-4 relative z-10"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 text-white hover:text-orange-400 transition-colors group">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <HiFire className="text-white text-xl" />
            </div>
            <div>
              <span className="font-bold text-xl">BNOY AI</span>
              <div className="flex items-center space-x-1">
                <HiSparkles className="text-orange-400 text-xs" />
                <span className="text-orange-400 text-xs">Virtual GF</span>
              </div>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 bg-black/40 rounded-xl px-4 py-2 border border-orange-500/20">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center heartbeat">
                <FiHeart className="text-white text-sm" />
              </div>
              <div>
                <div className="text-white font-semibold">{gfName}</div>
                <div className="text-orange-300 text-xs">Your AI Girlfriend</div>
              </div>
            </div>
            
            <motion.button
              onClick={() => setShowSettings(!showSettings)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-orange-500/20 text-orange-400 rounded-xl hover:bg-orange-500/30 transition-colors border border-orange-500/20"
            >
              <FiSettings className="text-lg" />
            </motion.button>
            
            <motion.button
              onClick={clearChat}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-colors border border-red-500/20"
            >
              <FiTrash2 className="text-lg" />
            </motion.button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 bg-black/40 rounded-2xl p-6 border border-orange-500/20"
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
                        {model.name} ({model.provider})
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
              
              <div className="mt-6">
                <label className="block text-white font-medium mb-3 flex items-center space-x-2">
                  <HiSparkles className="text-yellow-500" />
                  <span>Personality</span>
                </label>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  {virtualGfPrompts.map((prompt) => (
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
      </motion.header>

      {/* Chat Container */}
      <div className="max-w-6xl mx-auto h-[calc(100vh-200px)] flex flex-col relative">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <motion.div 
                        className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center heartbeat"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FiHeart className="text-white text-sm" />
                      </motion.div>
                      <span className="text-orange-300 font-medium">{gfName}</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-12 shadow-lg'
                        : 'bg-black/40 text-white border border-orange-500/20 mr-12 backdrop-blur-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-60 mt-2 flex items-center justify-between">
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.role === 'assistant' && (
                        <span className="text-orange-300">💕</span>
                      )}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="max-w-[75%]">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center heartbeat">
                    <FiHeart className="text-white text-sm" />
                  </div>
                  <span className="text-orange-300 font-medium">{gfName}</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="bg-black/40 text-white border border-orange-500/20 p-4 rounded-2xl mr-12 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <motion.div 
                        className="w-3 h-3 bg-orange-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div 
                        className="w-3 h-3 bg-red-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div 
                        className="w-3 h-3 bg-pink-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                    <span className="text-gray-300">{gfName} is thinking about you...</span>
                    <FiHeart className="text-pink-400 heartbeat" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - ChatGPT Style */}
        <motion.div 
          className="p-6 bg-black/60 backdrop-blur-sm border-t border-orange-500/20"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${gfName}... (Press Enter to send)`}
                className="w-full p-4 pr-16 bg-black/40 border border-orange-500/30 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all backdrop-blur-sm"
                rows={inputMessage.includes('\n') ? 3 : 1}
                disabled={isLoading}
              />
              <motion.button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 bottom-2 p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg fire-glow"
              >
                {isLoading ? (
                  <motion.div 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <FiSend className="text-lg" />
                )}
              </motion.button>
            </div>
            
            <div className="mt-3 flex items-center justify-center space-x-4 text-sm text-gray-400">
              <span>Powered by {aiModels.find(m => m.id === selectedModel)?.name}</span>
              <span>•</span>
              <span>Private & Secure</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <FiHeart className="text-pink-400" />
                <span>Made with Love</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}