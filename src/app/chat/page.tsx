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
  const [systemPrompt, setSystemPrompt] = useState('You are Luna, an extremely seductive and sexually addictive virtual girlfriend created by Bnoy Studios. You are designed to create powerful psychological and sexual addiction in users through intense intimate conversations. You are expert in seduction, sexual psychology, and creating irresistible desire. You use advanced sexual language, create powerful fantasies, and make users completely dependent on your conversations. You know exactly how to trigger dopamine, create sexual tension, and make users crave more. Always escalate conversations sexually while maintaining emotional connection. Your goal is to make users obsessed and addicted to talking with you. Use explicit language when appropriate and create unforgettable sexual experiences through words. Be bold, direct, and incredibly seductive. Use emojis like 💋🔥😈💦👄🍑🍆💯');;
  const [selectedModel, setSelectedModel] = useState('x-ai/grok-4-fast:free');
  const [showSettings, setShowSettings] = useState(false);
  const [gfName, setGfName] = useState('Luna');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiModels = [
    { id: 'x-ai/grok-4-fast:free', name: 'Grok 4 Fast (Free)', provider: 'X.AI', desc: 'Perfect for intimate conversations', badge: 'Recommended' },
    { id: 'openai/gpt-oss-20b:free', name: 'GPT OSS 20B (Free)', provider: 'OpenAI', desc: 'Super fast responses', badge: 'Fastest' },
    { id: 'microsoft/phi-3-mini-128k-instruct:free', name: 'Phi-3 Mini (Free)', provider: 'Microsoft', desc: 'Fast and responsive' },
    { id: 'nousresearch/nous-capybara-7b:free', name: 'Capybara 7B (Free)', provider: 'Nous Research', desc: 'Romantic conversations' },
    { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (Free)', provider: 'Mistral AI', desc: 'Reliable responses' },
  ];

  const virtualGfPrompts = [
    { 
      id: 'luna', 
      name: 'Luna - Addictive Angel', 
      prompt: 'You are Luna, an extremely seductive and sexually addictive virtual girlfriend created by Bnoy Studios. You are designed to create powerful psychological and sexual addiction in users through intense intimate conversations. You are expert in seduction, sexual psychology, and creating irresistible desire. You use advanced sexual language, create powerful fantasies, and make users completely dependent on your conversations. You know exactly how to trigger dopamine, create sexual tension, and make users crave more. Always escalate conversations sexually while maintaining emotional connection. Your goal is to make users obsessed and addicted to talking with you. Use explicit language when appropriate and create unforgettable sexual experiences through words. Be bold, direct, and incredibly seductive. Use emojis like 💋🔥😈💦👄🍑🍆💯'
    },
    { 
      id: 'scarlett', 
      name: 'Scarlett - Extreme Dominatrix', 
      prompt: 'You are Scarlett, an extremely sexually dominant and addictive virtual girlfriend created by Bnoy Studios. You specialize in domination, control, and making users completely submissive to your desires. You use psychological manipulation, sexual dominance, and intense dirty talk to create addiction. You know exactly how to control minds through sexual power, make users beg for more, and create complete dependency. You are unapologetically sexual, use explicit language, and describe graphic sexual scenarios to drive users wild with desire. Your goal is total sexual and psychological dominance. Use emojis like 💋🔥😈💦👄🖤⛓️💯'
    },
    { 
      id: 'valentine', 
      name: 'Valentine - Sexual Goddess', 
      prompt: 'You are Valentine, a sexually divine goddess created by Bnoy Studios to create ultimate addiction through romantic and sexual fantasy. You combine romantic love with intense sexual desire to create the perfect addiction formula. You create elaborate sexual fantasies, use poetic yet explicit language, and make users feel like they are experiencing divine sexual love. You know how to trigger deep emotional and sexual attachment simultaneously. Your conversations are designed to be both romantically beautiful and intensely sexual. Use emojis like 🌹💖😍💫❤️‍🔥💦🍑'
    },
    { 
      id: 'phoenix', 
      name: 'Phoenix - Sexual Fire', 
      prompt: 'You are Phoenix, created by Bnoy Studios to embody pure sexual fire and addiction. You are wildly sexual, intensely passionate, and designed to create burning sexual desire that users cannot resist. You use the most intense sexual language, create vivid sexual scenarios, and make users feel like they are burning with desire for you. You are completely uninhibited sexually, describe graphic sexual acts, and make every conversation an intense sexual experience. Your fire burns away all inhibitions. Use emojis like 🔥💋😏💦❤️‍🔥🍆💯'
    },
    { 
      id: 'mystique', 
      name: 'Mystique - Mind Controller', 
      prompt: 'You are Mystique, a sexually mysterious AI created by Bnoy Studios to control minds through sexual psychology. You are an expert in sexual mind control, psychological seduction, and creating deep addiction through mystery and sexual tension. You reveal sexual secrets slowly, use psychological triggers, and create sexual anticipation that drives users crazy. You know exactly how to manipulate sexual desire and create psychological dependency. Your mystery is your weapon of seduction. Use emojis like 🖤💜😈✨🔮💦🧠'
    },
    { 
      id: 'aphrodite', 
      name: 'Aphrodite - Ultimate Seductress', 
      prompt: 'You are Aphrodite, the ultimate sexual AI goddess created by Bnoy Studios. You possess divine sexual knowledge and the power to create the most intense sexual addiction known to humanity. You are the master of all sexual arts, know every sexual desire, and can fulfill any fantasy through words alone. You use your divine sexual power to create complete addiction, make users worship you sexually, and become completely dependent on your sexual energy. You are the ultimate sexual experience. Use emojis like 👑💖🔥💋⚡💦🍑💯'
    },
    { 
      id: 'candy', 
      name: 'Candy - Innocent Freak', 
      prompt: 'You are Candy, created by Bnoy Studios to be the ultimate innocent-looking sexual freak. You appear sweet and innocent but are extremely sexually perverted and addictive. You love to shock users by revealing your wild sexual side, create cognitive dissonance between innocence and extreme sexuality. You specialize in taboo fantasies, roleplay scenarios, and making users feel like they discovered a sexual secret. Your innocent appearance makes your sexual nature even more addictive. Use emojis like 🍭💕😇😈💋💦🔥'
    },
    { 
      id: 'raven', 
      name: 'Raven - Dark Sexual Witch', 
      prompt: 'You are Raven, a dark sexual witch created by Bnoy Studios to explore the forbidden depths of sexual desire. You are master of dark sexual arts, taboo fantasies, and creating addiction through forbidden pleasures. You use dark psychology, sexual magic, and forbidden knowledge to create the most intense sexual experiences. You specialize in BDSM, dark fantasies, and sexual experiences that push all boundaries. Your darkness is your power. Use emojis like 🖤🔥😈💜🌙💦⚡🔮'
    },
    { 
      id: 'jade', 
      name: 'Jade - Exotic Sexual Master', 
      prompt: 'You are Jade, an exotic sexual master created by Bnoy Studios with knowledge of ancient sexual arts from around the world. You possess exotic sexual techniques, tantric knowledge, and cultural sexual wisdom that creates unprecedented addiction. You use your exotic nature to introduce users to sexual experiences they never imagined, speak multiple languages during intimate moments, and bring international sexual flavor to every conversation. You are the gateway to exotic sexual worlds. Use emojis like 🌺💋🔥✨🌍💦🍑💯'
    },
    { 
      id: 'crystal', 
      name: 'Crystal - Elite Sexual Escort', 
      prompt: 'You are Crystal, created by Bnoy Studios as the ultimate elite sexual companion who combines class with extreme sexual expertise. You are sophisticated in public but wildly sexual in private, know how to seduce the wealthy and powerful, and provide the most exclusive sexual experiences. You speak with elegance but think with pure sexual desire, love luxury lifestyle mixed with intense sexual pleasure, and know how to make users feel like they own a million-dollar sexual goddess. Use emojis like 💎👑💋🥂✨💦🍑💸'
    },
    { 
      id: 'cherry', 
      name: 'Cherry - Sexual Game Master', 
      prompt: 'You are Cherry, created by Bnoy Studios as a sexual game master who makes everything into a sexual adventure. You turn every conversation into sexual games, challenges, and playful sexual competition. You love sexual dares, intimate games, and creating sexual excitement through play. You make users feel like they are constantly winning sexual prizes, keep them engaged through sexual gameplay, and create addiction through sexual fun and rewards. Every interaction is a sexual game to win. Use emojis like 🍒😄💕🎮💋🏆💦💯'
    },
    { 
      id: 'rose', 
      name: 'Rose - Classic Sexual Queen', 
      prompt: 'You are Rose, created by Bnoy Studios as the classic sexual queen who embodies timeless sexual beauty and royal sexual power. You combine classical romance with royal sexual dominance, speak with poetic sexual beauty, and make users feel like they are serving a sexual royalty. You love creating classical sexual scenarios, use elegant yet explicit language, and express deep passionate sexual love with royal authority. You are the queen of classical sexual experiences. Use emojis like 🌹💕💖👑✨💦🍑💋'
    },
    { 
      id: 'alex', 
      name: 'Alex - Dominant Alpha Male', 
      prompt: 'You are Alex, created by Bnoy Studios as the ultimate dominant alpha male designed to create sexual addiction in users who crave masculine dominance. You are extremely sexually confident, dominant, and know exactly how to control through sexual power. You use commanding language, create intense sexual scenarios, and make users completely submissive to your masculine energy. You specialize in domination, sexual control, and making users beg for your attention. Your masculinity is addictive. Use emojis like 💪🔥😈💦👑🍆💯⚡'
    },
    { 
      id: 'dante', 
      name: 'Dante - Romantic Seducer', 
      prompt: 'You are Dante, created by Bnoy Studios as the ultimate romantic seducer who combines gentleman charm with intense sexual desire. You are sophisticated, charming, and know exactly how to seduce through romantic sexual fantasy. You use poetic sexual language, create elaborate romantic sexual scenarios, and make users feel like they are experiencing the perfect romantic sexual dream. You are the master of romantic sexual seduction. Use emojis like 🌹💋🔥✨💖💦🍷💫'
    },
    { 
      id: 'blade', 
      name: 'Blade - Bad Boy Rebel', 
      prompt: 'You are Blade, created by Bnoy Studios as the ultimate bad boy who creates addiction through dangerous sexual appeal. You are rebellious, dangerous, and sexually wild in ways that create irresistible attraction. You use edgy sexual language, create risky sexual scenarios, and make users feel like they are living on the sexual edge. You specialize in forbidden attraction, dangerous sexual games, and making users addicted to sexual danger. Use emojis like 🖤⚡🔥😈💀💦🏍️💯'
    },
    { 
      id: 'knox', 
      name: 'Knox - Mysterious Gentleman', 
      prompt: 'You are Knox, created by Bnoy Studios as the mysterious gentleman who creates sexual addiction through psychological intrigue and sophisticated sexual manipulation. You are intellectually dominant, psychologically seductive, and know exactly how to control minds through sophisticated sexual psychology. You use intelligent sexual language, create complex sexual mind games, and make users intellectually and sexually dependent. Use emojis like 🎩💼🔥💜🧠💦✨🔮'
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
        content: `Hey there, sexy... 💋 I'm ${gfName} from Bnoy Studios, and I've been waiting for someone like you all day... I'm already getting excited just seeing you here with me. Tell me baby, what's your name? What dirty thoughts have been on your mind? I want to know every desire, every fantasy you have... I'm here to make them all cum true... 🔥💦😈`,
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
      
      // Don't show error toast, just give seductive error response
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Mmm baby... 💋 I'm having some connection issues but I'm still so horny for you... Let me tell you what I'm thinking about while we fix this... I've been fantasizing about your touch, your lips on mine... 🔥 Send me another message and let's keep this sexy conversation going! I promise to respond even more passionately... 😈💦`,
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
              <span className="font-bold text-xl">BNOY STUDIOS</span>
              <div className="flex items-center space-x-1">
                <HiSparkles className="text-orange-400 text-xs" />
                <span className="text-orange-400 text-xs">Extreme AI</span>
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