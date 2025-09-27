'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chat';
import { useChatShortcuts } from '@/hooks/useKeyboardShortcuts';
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ModelSelector from './ModelSelector';
import CharacterSelector from './CharacterSelector';
import UserSetup from './UserSetup';
import { MessageCircle, Settings, Sparkles } from 'lucide-react';

export default function ChatInterface() {
  const { user, currentChat, isLoading, setUser, createNewChat } = useChatStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keyboard shortcuts
  useChatShortcuts({
    newChat: createNewChat,
    toggleSidebar: () => setSidebarOpen(!sidebarOpen),
    focusInput: () => inputRef.current?.focus(),
    openSettings: () => router.push('/settings'),
  });

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
  }, [setUser]);

  if (!user) {
    return <UserSetup />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Mobile overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-80 relative z-50 lg:z-10"
            >
              <ChatSidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-effect border-b border-white/10 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="btn-secondary p-2 rounded-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              )}
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="gradient-text text-xl font-bold">
                    AI Chat Platform
                  </h1>
                  <p className="text-white/60 text-sm">
                    Powered by Bnoy Studios
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CharacterSelector />
              <ModelSelector />
              <a
                href="/admin"
                className="btn-secondary p-2 rounded-lg"
                title="Admin Panel"
              >
                <Settings className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.header>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col">
          {currentChat ? (
            <>
              <ChatMessages />
              <ChatInput ref={inputRef} />
            </>
          ) : (
            <WelcomeScreen />
          )}
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen() {
  const { user, startChatWithMessage, selectedModel } = useChatStore();

  const suggestions = [
    "Explain quantum computing in simple terms",
    "Write a creative story about AI",
    "Help me plan a web application",
    "What's the latest in technology?",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex items-center justify-center p-8"
    >
      <div className="max-w-3xl text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 neon-glow">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Welcome to AI Chat Platform
          </h1>
          
          <p className="text-white/70 text-lg mb-2">
            Hey {user?.username}! 👋 Ready to chat with advanced AI models?
          </p>
          
          <p className="text-white/50 text-sm">
            Currently using: <span className="text-blue-400 font-medium">{selectedModel}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                startChatWithMessage(suggestion);
              }}
              className="glass-effect p-4 rounded-xl text-left hover:bg-white/10 transition-all duration-300"
            >
              <p className="text-white/90 text-sm">{suggestion}</p>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-white/40 text-xs">
            Start typing below or click a suggestion to begin your conversation
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}