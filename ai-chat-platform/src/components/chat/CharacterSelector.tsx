'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chat';
import { ChevronDown, Wand2, Star } from 'lucide-react';

interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
}

export default function CharacterSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [characters, setCharacters] = useState<SystemPrompt[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      // For now, load from local storage or use defaults
      const defaultCharacters: SystemPrompt[] = [
        {
          id: 'default',
          name: 'Helpful Assistant',
          content: 'You are a helpful AI assistant.',
          isDefault: true,
        },
        {
          id: 'bnoy',
          name: 'Bnoy (Hinglish Buddy)',
          content: 'You are Bnoy - a friendly AI companion. Speak in Hinglish, be casual and enthusiastic.',
          isDefault: false,
        },
        {
          id: 'creative',
          name: 'Creative Writer',
          content: 'You are a creative writing expert. Help with stories, poems, and imaginative content.',
          isDefault: false,
        },
        {
          id: 'coder',
          name: 'Code Mentor',
          content: 'You are a programming expert. Help with coding, debugging, and technical explanations.',
          isDefault: false,
        },
      ];
      
      setCharacters(defaultCharacters);
      const defaultChar = defaultCharacters.find(c => c.isDefault);
      if (defaultChar) {
        setSelectedCharacter(defaultChar.id);
      }
    } catch (error) {
      console.error('Failed to load characters:', error);
    }
  };

  const currentCharacter = characters.find(c => c.id === selectedCharacter) || characters[0];

  const getCharacterEmoji = (name: string) => {
    if (name.includes('Bnoy')) return '🤖';
    if (name.includes('Creative')) return '🎨';
    if (name.includes('Code')) return '💻';
    if (name.includes('Helper')) return '🤝';
    return '✨';
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="glass-effect px-3 py-2 rounded-lg flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
      >
        <span className="text-lg">{getCharacterEmoji(currentCharacter?.name || '')}</span>
        
        <div className="text-left hidden sm:block">
          <p className="text-xs font-medium">{currentCharacter?.name || 'Select Character'}</p>
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
              className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] glass-effect rounded-xl border border-white/20 overflow-hidden z-50"
            >
              <div className="p-3 border-b border-white/10">
                <h3 className="text-white font-medium text-sm flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  Select AI Character
                </h3>
                <p className="text-white/50 text-xs">Choose your AI's personality</p>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {characters.map((character, index) => (
                  <motion.button
                    key={character.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    onClick={() => {
                      setSelectedCharacter(character.id);
                      setIsOpen(false);
                      
                      (window as any).showToast?.({
                        type: 'success',
                        title: 'Character selected!',
                        description: `Now chatting with ${character.name}`,
                      });
                    }}
                    className={`w-full text-left p-4 transition-all duration-200 ${
                      selectedCharacter === character.id 
                        ? 'bg-purple-600/20 border-l-4 border-purple-400' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">
                        {getCharacterEmoji(character.name)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium text-sm">{character.name}</h4>
                          {character.isDefault && (
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          )}
                        </div>
                        
                        <p className="text-white/60 text-xs line-clamp-2">
                          {character.content.substring(0, 100)}...
                        </p>
                      </div>

                      {selectedCharacter === character.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0 mt-2"
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="p-3 border-t border-white/10 bg-white/5">
                <p className="text-white/40 text-xs text-center">
                  Admins can create more characters! 🎭
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}