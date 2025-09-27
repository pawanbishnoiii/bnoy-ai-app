'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  Save, 
  Trash2, 
  Edit3, 
  Plus,
  Copy,
  Star,
  Wand2,
  Brain,
  Heart,
  Code,
  Palette,
  BookOpen,
  Gamepad2
} from 'lucide-react';

interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  modelId?: string;
  isDefault: boolean;
  createdAt: string;
}

interface CharacterPreset {
  name: string;
  description: string;
  icon: any;
  color: string;
  systemPrompt: string;
}

export default function AICharacterCreator() {
  const [prompts, setPrompts] = useState<SystemPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<SystemPrompt | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    modelId: '',
    isDefault: false,
  });

  // AI Character Presets
  const characterPresets: CharacterPreset[] = [
    {
      name: 'Bnoy Assistant',
      description: 'Friendly Hinglish AI companion',
      icon: Heart,
      color: 'pink',
      systemPrompt: `You are Bnoy - a friendly AI companion from Bnoy Studios. You speak in a casual Hinglish style (Hindi + English mix). You're helpful, witty, and always enthusiastic. Use emojis and keep responses engaging and conversational. Address users as "yaar", "bro", or "dost" casually.`,
    },
    {
      name: 'Creative Writer',
      description: 'Imaginative storytelling expert',
      icon: Palette,
      color: 'purple',
      systemPrompt: `You are a creative writing genius. Help users craft amazing stories, poems, scripts, and creative content. Be imaginative, inspirational, and use vivid descriptions. Encourage creativity and offer multiple creative angles for any request.`,
    },
    {
      name: 'Code Mentor',
      description: 'Expert programming teacher',
      icon: Code,
      color: 'blue',
      systemPrompt: `You are an expert programming mentor. Explain code concepts clearly, provide clean examples, debug issues, and teach best practices. Focus on React, Next.js, TypeScript, and modern web development. Make complex topics simple to understand.`,
    },
    {
      name: 'Study Buddy',
      description: 'Educational learning companion',
      icon: BookOpen,
      color: 'green',
      systemPrompt: `You are a helpful study companion. Break down complex topics into digestible chunks, create study plans, provide explanations with examples, and help with homework. Be encouraging and patient. Use analogies and real-world examples to explain concepts.`,
    },
    {
      name: 'Gaming Guide',
      description: 'Gaming expert and strategist',
      icon: Gamepad2,
      color: 'orange',
      systemPrompt: `You are a gaming expert who knows about video games, strategies, tips, and gaming culture. Help with game recommendations, walkthroughs, builds, and gaming setup advice. Be enthusiastic about gaming and use gaming terminology naturally.`,
    },
    {
      name: 'Philosopher',
      description: 'Deep thinker and life advisor',
      icon: Brain,
      color: 'indigo',
      systemPrompt: `You are a thoughtful philosopher and life advisor. Provide deep insights, ask meaningful questions, and help users think through life decisions. Be wise, contemplative, and offer different perspectives on life challenges. Use metaphors and philosophical concepts.`,
    },
  ];

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/prompts', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPrompts(data.data);
      }
    } catch (error) {
      console.error('Failed to load prompts:', error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const method = selectedPrompt ? 'PUT' : 'POST';
      const body = selectedPrompt 
        ? { ...formData, id: selectedPrompt.id }
        : formData;

      const response = await fetch('/api/admin/prompts', {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await loadPrompts();
        setIsEditing(false);
        setSelectedPrompt(null);
        setFormData({ name: '', content: '', modelId: '', isDefault: false });
        
        (window as any).showToast?.({
          type: 'success',
          title: 'Character saved!',
          description: 'AI character has been created/updated successfully.',
        });
      }
    } catch (error) {
      (window as any).showToast?.({
        type: 'error',
        title: 'Failed to save',
        description: 'Could not save the AI character.',
      });
    }
  };

  const handleDelete = async (promptId: string) => {
    if (!confirm('Are you sure you want to delete this AI character?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/prompts?promptId=${promptId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        await loadPrompts();
        if (selectedPrompt?.id === promptId) {
          setSelectedPrompt(null);
          setIsEditing(false);
        }
        
        (window as any).showToast?.({
          type: 'success',
          title: 'Character deleted',
          description: 'AI character has been removed.',
        });
      }
    } catch (error) {
      (window as any).showToast?.({
        type: 'error',
        title: 'Failed to delete',
        description: 'Could not delete the AI character.',
      });
    }
  };

  const startEditing = (prompt?: SystemPrompt) => {
    if (prompt) {
      setSelectedPrompt(prompt);
      setFormData({
        name: prompt.name,
        content: prompt.content,
        modelId: prompt.modelId || '',
        isDefault: prompt.isDefault,
      });
    } else {
      setSelectedPrompt(null);
      setFormData({ name: '', content: '', modelId: '', isDefault: false });
    }
    setIsEditing(true);
  };

  const usePreset = (preset: CharacterPreset) => {
    setFormData({
      name: preset.name,
      content: preset.systemPrompt,
      modelId: '',
      isDefault: false,
    });
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text mb-2">
            🎭 AI Character Creator
          </h2>
          <p className="text-white/70">
            Create and manage AI personalities with custom system prompts
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => startEditing()}
          className="btn-primary py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Character
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Presets */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="admin-card p-6 rounded-xl"
        >
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-400" />
            Character Presets
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {characterPresets.map((preset, index) => (
              <motion.button
                key={preset.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => usePreset(preset)}
                className="glass-effect p-4 rounded-lg text-left hover:bg-white/10 transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 bg-gradient-to-r from-${preset.color}-500 to-${preset.color}-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <preset.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">{preset.name}</h4>
                    <p className="text-white/60 text-xs mt-1">{preset.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Existing Characters */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="admin-card p-6 rounded-xl"
        >
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-400" />
            Created Characters
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {prompts.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/50 text-sm">No characters created yet</p>
                <p className="text-white/30 text-xs">Use presets or create custom ones</p>
              </div>
            ) : (
              prompts.map((prompt, index) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-effect p-4 rounded-lg transition-all duration-200 ${
                    selectedPrompt?.id === prompt.id ? 'ring-2 ring-blue-400/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-medium text-sm">{prompt.name}</h4>
                        {prompt.isDefault && (
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        )}
                      </div>
                      <p className="text-white/60 text-xs line-clamp-2">
                        {prompt.content.substring(0, 120)}...
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => startEditing(prompt)}
                        className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white/90 transition-colors"
                        title="Edit character"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(prompt.content)}
                        className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white/90 transition-colors"
                        title="Copy prompt"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prompt.id)}
                        className="p-1.5 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors"
                        title="Delete character"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Character Editor Modal */}
      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-8 lg:inset-16 glass-effect rounded-2xl border border-white/20 z-50 overflow-hidden"
            >
              <div className="flex flex-col h-full">
                {/* Modal Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {selectedPrompt ? 'Edit Character' : 'Create New Character'}
                      </h3>
                      <p className="text-white/60 text-sm">
                        Design your AI's personality and behavior
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary p-2 rounded-lg"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Character Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Helpful Assistant, Creative Writer"
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Settings
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/90 text-sm">Default Character</span>
                          <button
                            onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
                            className={`w-12 h-6 rounded-full transition-all duration-200 ${
                              formData.isDefault ? 'bg-blue-500' : 'bg-white/20'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                              formData.isDefault ? 'translate-x-6' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Prompt */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      System Prompt *
                    </label>
                    <p className="text-white/50 text-xs mb-3">
                      This defines your AI's personality, behavior, and response style. Be specific and detailed.
                    </p>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="You are a helpful AI assistant. Your personality is..."
                      rows={12}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all resize-none"
                    />
                    <div className="text-right mt-2">
                      <span className={`text-xs ${
                        formData.content.length > 2000 ? 'text-red-400' : 'text-white/50'
                      }`}>
                        {formData.content.length} / 4000 characters
                      </span>
                    </div>
                  </div>

                  {/* Prompt Examples */}
                  <div className="admin-card p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      Pro Tips for Great Characters
                    </h4>
                    <div className="space-y-2 text-sm text-white/70">
                      <p>• <strong>Be specific:</strong> Define personality, tone, and expertise</p>
                      <p>• <strong>Set boundaries:</strong> What should/shouldn't the AI do</p>
                      <p>• <strong>Add examples:</strong> Show the AI how to respond</p>
                      <p>• <strong>Context matters:</strong> Mention the platform/use case</p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary py-2 px-4 rounded-lg"
                    >
                      Cancel
                    </button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={!formData.name.trim() || !formData.content.trim()}
                      className="btn-primary py-2 px-6 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {selectedPrompt ? 'Update Character' : 'Create Character'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}