'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chat';
import { formatDate } from '@/lib/utils';
import { 
  MessageCircle, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  X,
  User,
  LogOut 
} from 'lucide-react';

interface ChatSidebarProps {
  onClose: () => void;
}

export default function ChatSidebar({ onClose }: ChatSidebarProps) {
  const { 
    user, 
    chats, 
    currentChat, 
    loadChatHistory, 
    createNewChat, 
    loadChat,
    setUser 
  } = useChatStore();

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user, loadChatHistory]);

  const handleNewChat = () => {
    createNewChat();
  };

  const handleLogout = () => {
    localStorage.removeItem('chatUser');
    setUser(null);
  };

  return (
    <div className="h-full admin-sidebar border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{user?.username}</p>
              <p className="text-white/50 text-xs">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden btn-secondary p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewChat}
          className="w-full btn-primary py-3 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </motion.button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-white/70 text-sm font-medium mb-3">Recent Chats</h3>
        
        <AnimatePresence>
          {chats.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <MessageCircle className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/50 text-sm">No chats yet</p>
              <p className="text-white/30 text-xs">Start your first conversation!</p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat, index) => (
                <motion.button
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => loadChat(chat.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                    currentChat?.id === chat.id
                      ? 'bg-blue-600/20 border border-blue-500/30'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-sm font-medium truncate">
                        {chat.title}
                      </p>
                      <p className="text-white/50 text-xs mt-1">
                        {formatDate(chat.updatedAt)}
                      </p>
                      <p className="text-white/40 text-xs">
                        {chat.messages?.length || 0} messages
                      </p>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-white/10 rounded">
                        <MoreVertical className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full btn-secondary py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-red-400 hover:text-red-300"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
        
        <div className="mt-3 text-center">
          <p className="text-white/30 text-xs">
            Made with ❤️ by Bnoy Studios
          </p>
        </div>
      </div>
    </div>
  );
}