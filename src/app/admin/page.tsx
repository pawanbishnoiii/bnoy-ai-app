'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiUsers, FiMessageSquare, FiDatabase, FiCpu, FiEdit, FiTrash2, FiPlus, FiSave, FiEye } from 'react-icons/fi';
import { HiFire, HiSparkles } from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  isActive: boolean;
}

interface CompanionModel {
  id: string;
  name: string;
  personality: string;
  aiModel: string;
  systemPrompt: string;
  isActive: boolean;
  type: 'female' | 'male';
}

interface ChatHistory {
  id: string;
  companionName: string;
  userName: string;
  messageCount: number;
  lastMessage: string;
  timestamp: Date;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>('companions');
  const [companions, setCompanions] = useState<CompanionModel[]>([]);
  const [aiModels, setAIModels] = useState<AIModel[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionModel | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Initialize with default data
    setAIModels([
      { id: 'x-ai/grok-4-fast:free', name: 'Grok 4 Fast', provider: 'X.AI', description: 'Advanced conversational AI', isActive: true },
      { id: 'openai/gpt-oss-20b:free', name: 'GPT OSS 20B', provider: 'OpenAI', description: 'Super fast responses', isActive: true },
      { id: 'microsoft/phi-3-mini-128k-instruct:free', name: 'Phi-3 Mini', provider: 'Microsoft', description: 'Fast and responsive', isActive: true },
      { id: 'nousresearch/nous-capybara-7b:free', name: 'Capybara 7B', provider: 'Nous Research', description: 'Creative conversations', isActive: false },
      { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B', provider: 'Mistral AI', description: 'Reliable responses', isActive: false }
    ]);

    setCompanions([
      {
        id: 'luna',
        name: 'Luna',
        personality: 'Addictive Angel',
        aiModel: 'x-ai/grok-4-fast:free',
        systemPrompt: 'You are Luna, an extremely seductive and sexually addictive virtual girlfriend created by Bnoy Studios...',
        isActive: true,
        type: 'female'
      },
      {
        id: 'alex',
        name: 'Alex',
        personality: 'Dominant Alpha Male',
        aiModel: 'openai/gpt-oss-20b:free',
        systemPrompt: 'You are Alex, created by Bnoy Studios as the ultimate dominant alpha male...',
        isActive: true,
        type: 'male'
      }
    ]);

    setChatHistory([
      { id: '1', companionName: 'Luna', userName: 'User123', messageCount: 45, lastMessage: 'Hey baby...', timestamp: new Date() },
      { id: '2', companionName: 'Alex', userName: 'Sarah456', messageCount: 23, lastMessage: 'Good morning...', timestamp: new Date() }
    ]);
  }, []);

  const saveCompanion = () => {
    if (selectedCompanion) {
      setCompanions(prev => prev.map(c => c.id === selectedCompanion.id ? selectedCompanion : c));
      setIsEditMode(false);
      setSelectedCompanion(null);
      toast.success('Companion updated successfully!');
    }
  };

  const tabs = [
    { id: 'companions', label: 'AI Companions', icon: FiUsers },
    { id: 'models', label: 'AI Models', icon: FiCpu },
    { id: 'prompts', label: 'Prompt Engine', icon: FiEdit },
    { id: 'chats', label: 'Chat History', icon: FiMessageSquare },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-950 text-white">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
                <HiFire className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display">Bnoy Admin Dashboard</h1>
                <p className="text-gray-400 text-sm">AI Companion Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                <span className="text-green-400">●</span> System Online
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-black/40 backdrop-blur-sm border-r border-gray-800">
          <nav className="p-6">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ x: 5 }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-pink-500/20 to-red-500/20 text-pink-300 border border-pink-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="text-lg" />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'companions' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold font-display">AI Companions Management</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center space-x-2"
                >
                  <FiPlus />
                  <span>Add New Companion</span>
                </motion.button>
              </div>

              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {companions.map((companion) => (
                  <motion.div
                    key={companion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-6 border border-gray-700 hover:border-pink-500/40 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          companion.type === 'female' 
                            ? 'bg-gradient-to-r from-pink-500 to-red-500' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-500'
                        }`}>
                          {companion.type === 'female' ? '♀' : '♂'}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{companion.name}</h3>
                          <p className="text-gray-400 text-sm">{companion.personality}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCompanion(companion);
                            setIsEditMode(true);
                          }}
                          className="p-2 text-gray-400 hover:text-pink-400 transition-colors"
                        >
                          <FiEdit />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">AI Model:</span>
                        <span className="text-white">{aiModels.find(m => m.id === companion.aiModel)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={companion.isActive ? 'text-green-400' : 'text-red-400'}>
                          {companion.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white capitalize">{companion.type}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div>
              <h2 className="text-3xl font-bold mb-8 font-display">AI Models Configuration</h2>
              <div className="grid lg:grid-cols-2 gap-6">
                {aiModels.map((model) => (
                  <div key={model.id} className="glass-card rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{model.name}</h3>
                        <p className="text-gray-400">{model.provider}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs ${
                        model.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {model.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{model.description}</p>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                        Configure
                      </button>
                      <button className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors">
                        Test
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'prompts' && (
            <div>
              <h2 className="text-3xl font-bold mb-8 font-display">Prompt Engine</h2>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-card rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold mb-4">System Prompts</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Base System Prompt</label>
                      <textarea
                        className="w-full bg-black/40 border border-gray-600 rounded-xl px-4 py-3 text-white resize-none focus:border-pink-500 focus:outline-none"
                        rows={6}
                        placeholder="Enter system prompt..."
                      />
                    </div>
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl font-semibold">
                      Update System Prompt
                    </button>
                  </div>
                </div>
                
                <div className="glass-card rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold mb-4">Personality Templates</h3>
                  <div className="space-y-3">
                    {['Romantic', 'Playful', 'Mysterious', 'Passionate', 'Elegant'].map((template) => (
                      <div key={template} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                        <span>{template}</span>
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-400">
                            <FiEye />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-pink-400">
                            <FiEdit />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chats' && (
            <div>
              <h2 className="text-3xl font-bold mb-8 font-display">Chat History & Analytics</h2>
              <div className="grid gap-6">
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <div className="glass-card rounded-xl p-4 border border-gray-700 text-center">
                    <div className="text-3xl font-bold text-pink-400 mb-2">1,247</div>
                    <div className="text-gray-400">Total Chats</div>
                  </div>
                  <div className="glass-card rounded-xl p-4 border border-gray-700 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">892</div>
                    <div className="text-gray-400">Active Users</div>
                  </div>
                  <div className="glass-card rounded-xl p-4 border border-gray-700 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">34.2k</div>
                    <div className="text-gray-400">Messages</div>
                  </div>
                  <div className="glass-card rounded-xl p-4 border border-gray-700 text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-2">98.5%</div>
                    <div className="text-gray-400">Satisfaction</div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl border border-gray-700">
                  <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold">Recent Conversations</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {chatHistory.map((chat) => (
                        <div key={chat.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                              <FiMessageSquare className="text-white" />
                            </div>
                            <div>
                              <p className="font-semibold">{chat.companionName} × {chat.userName}</p>
                              <p className="text-gray-400 text-sm">{chat.messageCount} messages</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">{chat.timestamp.toLocaleTimeString()}</p>
                            <button className="text-pink-400 hover:text-pink-300 text-sm">View Chat</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-3xl font-bold mb-8 font-display">Platform Settings</h2>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-card rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Platform Name</label>
                      <input
                        type="text"
                        defaultValue="Bnoy"
                        className="w-full bg-black/40 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Max Messages Per Session</label>
                      <input
                        type="number"
                        defaultValue="100"
                        className="w-full bg-black/40 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Default AI Model</label>
                      <select className="w-full bg-black/40 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none">
                        <option>Grok 4 Fast</option>
                        <option>GPT OSS 20B</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold mb-4">API Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">OpenRouter API Key</label>
                      <input
                        type="password"
                        placeholder="sk-or-v1-..."
                        className="w-full bg-black/40 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Rate Limit (per minute)</label>
                      <input
                        type="number"
                        defaultValue="60"
                        className="w-full bg-black/40 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold">
                      Test API Connection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Companion Modal */}
      {isEditMode && selectedCompanion && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-8 border border-pink-500/30 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold font-display">Edit {selectedCompanion.name}</h3>
              <button
                onClick={() => setIsEditMode(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={selectedCompanion.name}
                    onChange={(e) => setSelectedCompanion({...selectedCompanion, name: e.target.value})}
                    className="w-full bg-black/40 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">AI Model</label>
                  <select
                    value={selectedCompanion.aiModel}
                    onChange={(e) => setSelectedCompanion({...selectedCompanion, aiModel: e.target.value})}
                    className="w-full bg-black/40 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                  >
                    {aiModels.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">System Prompt</label>
                <textarea
                  value={selectedCompanion.systemPrompt}
                  onChange={(e) => setSelectedCompanion({...selectedCompanion, systemPrompt: e.target.value})}
                  className="w-full bg-black/40 border border-gray-600 rounded-xl px-4 py-3 text-white resize-none focus:border-pink-500 focus:outline-none"
                  rows={8}
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={saveCompanion}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl font-semibold flex items-center justify-center space-x-2"
                >
                  <FiSave />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={() => setIsEditMode(false)}
                  className="px-6 py-3 bg-gray-600/20 text-gray-400 rounded-xl hover:bg-gray-600/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}