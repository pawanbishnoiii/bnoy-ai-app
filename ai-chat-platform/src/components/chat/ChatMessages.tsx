'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chat';
import { formatDate } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { User, Bot, Copy, Check, MoreVertical } from 'lucide-react';
import { useState } from 'react';

export default function ChatMessages() {
  const { currentChat, isLoading, streamingMessage } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages, streamingMessage]);

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!currentChat) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <AnimatePresence>
        {currentChat.messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
              ease: 'easeOut'
            }}
            className={`flex gap-2 sm:gap-4 chat-message ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 + 0.1 }}
                className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <Bot className="w-4 h-4 text-white" />
              </motion.div>
            )}

            <div className={`max-w-[85%] sm:max-w-[80%] group ${
              message.role === 'user' ? 'order-last' : ''
            }`}>
              <div className={`p-4 ${
                message.role === 'user' 
                  ? 'message-user' 
                  : 'message-assistant'
              }`}>
                {message.role === 'assistant' ? (
                  <ReactMarkdown 
                    className="prose prose-invert prose-sm max-w-none"
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      code: ({ children }) => (
                        <code className="bg-black/30 px-1 py-0.5 rounded text-sm">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-black/30 p-3 rounded-lg overflow-x-auto my-2">
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-white">{message.content}</p>
                )}
              </div>

              <div className="flex items-center justify-between mt-2 px-2">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span>{formatDate(message.timestamp)}</span>
                  {message.modelUsed && (
                    <span className="text-blue-400">• {message.modelUsed.split('/').pop()}</span>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => copyToClipboard(message.content, message.id)}
                    className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white/90 transition-colors"
                    title="Copy message"
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white/90 transition-colors"
                    title="More options"
                  >
                    <MoreVertical className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {message.role === 'user' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 + 0.1 }}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <User className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Streaming Message */}
      <AnimatePresence>
        {streamingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex gap-4 justify-start"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            
            <div className="max-w-[80%]">
              <div className="message-assistant p-4">
                <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                  {streamingMessage}
                </ReactMarkdown>
                <div className="typing-indicator mt-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && !streamingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex gap-4 justify-start"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            
            <div className="message-assistant p-4">
              <div className="flex items-center gap-3">
                <div className="typing-indicator">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
                <span className="text-white/70 text-sm">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={messagesEndRef} />
    </div>
  );
}