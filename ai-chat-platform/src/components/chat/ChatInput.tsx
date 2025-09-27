'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '@/store/chat';
import { Send, Mic, Paperclip, Square } from 'lucide-react';

export default function ChatInput() {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isLoading, isStreaming } = useChatStore();

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading || isStreaming) return;

    const messageToSend = message.trim();
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await sendMessage(messageToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    textareaRef.current?.focus();
  };

  const suggestions = [
    "Explain quantum computing",
    "Write a creative story",
    "Help me code in React",
    "What's new in AI?",
  ];

  return (
    <div className="border-t border-white/10 bg-black/20 backdrop-blur-lg">
      {/* Suggestions (show when no message) */}
      {!message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-b border-white/5"
        >
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="glass-effect px-3 py-1.5 rounded-full text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="glass-effect rounded-2xl border border-white/20 focus-within:border-blue-400/50 focus-within:ring-2 focus-within:ring-blue-400/20 transition-all duration-200">
            <div className="flex items-end gap-3 p-4">
              {/* Attachment Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className="text-white/60 hover:text-white/90 transition-colors p-1 rounded-lg hover:bg-white/10"
                title="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </motion.button>

              {/* Text Input */}
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message... (Shift + Enter for new line)"
                  disabled={isLoading || isStreaming}
                  rows={1}
                  className="w-full bg-transparent text-white placeholder-white/50 resize-none focus:outline-none disabled:opacity-50"
                  style={{ minHeight: '24px', maxHeight: '200px' }}
                />
              </div>

              {/* Voice Recording */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : 'text-white/60 hover:text-white/90 hover:bg-white/10'
                }`}
                title={isRecording ? 'Stop recording' : 'Start voice recording'}
              >
                <Mic className="w-5 h-5" />
              </motion.button>

              {/* Send/Stop Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type={isLoading || isStreaming ? 'button' : 'submit'}
                onClick={isLoading || isStreaming ? undefined : undefined}
                disabled={!message.trim() && !isLoading && !isStreaming}
                className={`p-2 rounded-xl transition-all duration-200 flex-shrink-0 ${
                  isLoading || isStreaming
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : message.trim()
                    ? 'btn-primary'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
                title={isLoading || isStreaming ? 'Stop generation' : 'Send message'}
              >
                {isLoading || isStreaming ? (
                  <Square className="w-5 h-5" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Character Counter */}
          {message.length > 500 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-right mt-2"
            >
              <span className={`text-xs ${
                message.length > 2000 ? 'text-red-400' : 'text-white/50'
              }`}>
                {message.length} / 4000
              </span>
            </motion.div>
          )}
        </form>

        {/* Status Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center"
        >
          {isLoading && (
            <p className="text-white/50 text-xs">
              🤖 AI is processing your request...
            </p>
          )}
          {isStreaming && (
            <p className="text-blue-400 text-xs">
              ⚡ Streaming response...
            </p>
          )}
          {!isLoading && !isStreaming && (
            <p className="text-white/30 text-xs">
              Press Enter to send • Shift + Enter for new line
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}