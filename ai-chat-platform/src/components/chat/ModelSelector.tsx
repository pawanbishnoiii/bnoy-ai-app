'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chat';
import { ChevronDown, Bot, Zap, Cpu, Sparkles } from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
  maxTokens: number;
  isFree: boolean;
}

export default function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<AIModel[]>([]);
  const { selectedModel, setSelectedModel } = useChatStore();

  useEffect(() => {
    // Load available models (from our seeded data)
    const defaultModels: AIModel[] = [
      {
        id: 'openai/gpt-4o-mini-2024-07-18:free',
        name: 'GPT-4O Mini',
        description: 'Latest GPT-4O Mini - Fast and intelligent',
        provider: 'OpenAI',
        maxTokens: 128000,
        isFree: true,
      },
      {
        id: 'meta-llama/llama-3.1-8b-instruct:free',
        name: 'Llama 3.1 8B',
        description: 'Meta\'s powerful Llama model',
        provider: 'Meta',
        maxTokens: 8192,
        isFree: true,
      },
      {
        id: 'microsoft/phi-3-mini-128k-instruct:free',
        name: 'Phi-3 Mini',
        description: 'Microsoft\'s efficient model',
        provider: 'Microsoft',
        maxTokens: 128000,
        isFree: true,
      },
      {
        id: 'mistralai/mistral-7b-instruct:free',
        name: 'Mistral 7B',
        description: 'Instruction-following specialist',
        provider: 'Mistral AI',
        maxTokens: 4096,
        isFree: true,
      },
      {
        id: 'google/gemma-2-9b-it:free',
        name: 'Gemma 2 9B',
        description: 'Google\'s creative model',
        provider: 'Google',
        maxTokens: 8192,
        isFree: true,
      },
    ];
    setModels(defaultModels);
  }, []);

  const currentModel = models.find(m => m.id === selectedModel) || models[0];

  const getModelIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai': return <Sparkles className="w-4 h-4" />;
      case 'meta': return <Bot className="w-4 h-4" />;
      case 'microsoft': return <Cpu className="w-4 h-4" />;
      case 'mistral ai': return <Zap className="w-4 h-4" />;
      case 'google': return <Sparkles className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai': return 'from-green-400 to-emerald-500';
      case 'meta': return 'from-blue-400 to-blue-500';
      case 'microsoft': return 'from-cyan-400 to-blue-500';
      case 'mistral ai': return 'from-orange-400 to-red-500';
      case 'google': return 'from-red-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="glass-effect px-4 py-2 rounded-lg flex items-center gap-3 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
      >
        <div className={`w-6 h-6 bg-gradient-to-r ${getProviderColor(currentModel?.provider || '')} rounded-md flex items-center justify-center`}>
          {getModelIcon(currentModel?.provider || '')}
        </div>
        
        <div className="text-left">
          <p className="text-sm font-medium">{currentModel?.name || 'Select Model'}</p>
          <p className="text-xs text-white/50">{currentModel?.provider}</p>
        </div>
        
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className="absolute right-0 top-full mt-2 w-80 glass-effect rounded-xl border border-white/20 overflow-hidden z-50"
            >
              <div className="p-3 border-b border-white/10">
                <h3 className="text-white font-medium text-sm">Select AI Model</h3>
                <p className="text-white/50 text-xs">Choose your preferred AI assistant</p>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {models.map((model, index) => (
                  <motion.button
                    key={model.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    onClick={() => {
                      setSelectedModel(model.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-4 transition-all duration-200 ${
                      selectedModel === model.id 
                        ? 'bg-blue-600/20 border-l-4 border-blue-400' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${getProviderColor(model.provider)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {getModelIcon(model.provider)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium text-sm">{model.name}</h4>
                          {model.isFree && (
                            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">
                              FREE
                            </span>
                          )}
                        </div>
                        
                        <p className="text-white/60 text-xs mb-2">{model.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-white/40">
                          <span>{model.provider}</span>
                          <span>•</span>
                          <span>{(model.maxTokens / 1000).toFixed(0)}K tokens</span>
                        </div>
                      </div>

                      {selectedModel === model.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-2"
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="p-3 border-t border-white/10 bg-white/5">
                <p className="text-white/40 text-xs text-center">
                  More models coming soon! ✨
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}