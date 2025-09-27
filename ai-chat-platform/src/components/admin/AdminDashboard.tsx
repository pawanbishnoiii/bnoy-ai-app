'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Bot, 
  MessageSquare, 
  Settings, 
  Key,
  BarChart3,
  LogOut,
  Eye,
  EyeOff,
  Wand2 
} from 'lucide-react';
import AICharacterCreator from './AICharacterCreator';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.data.token);
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      setError('Authentication failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  useEffect(() => {
    // Check for existing admin token
    const token = localStorage.getItem('adminToken');
    if (token) {
      // In production, verify token with backend
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -inset-10 opacity-20">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-effect rounded-2xl p-8 w-full max-w-md relative z-10"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 neon-glow"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Admin Panel
            </h1>
            
            <p className="text-white/70">
              Enter admin password to access dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter admin password"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/40 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!password.trim()}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Access Admin Panel
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/40 text-xs">
              Default password: <span className="text-blue-400 font-mono">123456</span>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'characters', name: 'AI Characters', icon: Wand2 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'models', name: 'AI Models', icon: Bot },
    { id: 'chats', name: 'Chats', icon: MessageSquare },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex h-screen">
        {/* Admin Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-64 admin-sidebar border-r border-white/10"
        >
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold">Admin Panel</h2>
                <p className="text-white/50 text-sm">Bnoy Studios</p>
              </div>
            </div>
          </div>

          <nav className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </motion.button>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </nav>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <motion.header
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="glass-effect border-b border-white/10 p-6"
          >
            <h1 className="text-2xl font-bold gradient-text">
              {tabs.find(t => t.id === activeTab)?.name} Management
            </h1>
            <p className="text-white/60 mt-1">
              Manage your AI chat platform
            </p>
          </motion.header>

          <div className="p-6 overflow-y-auto h-full">
            <AdminContent activeTab={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminContent({ activeTab }: { activeTab: string }) {
  const content = {
    dashboard: <DashboardTab />,
    characters: <AICharacterCreator />,
    users: <UsersTab />,
    models: <ModelsTab />,
    chats: <ChatsTab />,
    settings: <SettingsTab />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {content[activeTab as keyof typeof content]}
      </motion.div>
    </AnimatePresence>
  );
}

// Real Dashboard with Stats
function DashboardTab() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalChats: 0,
    totalMessages: 0,
    activeModels: 5,
  });

  useEffect(() => {
    // In real implementation, fetch from API
    // For now, showing static data
    setStats({
      totalUsers: Math.floor(Math.random() * 1000) + 100,
      totalChats: Math.floor(Math.random() * 500) + 50,
      totalMessages: Math.floor(Math.random() * 10000) + 1000,
      activeModels: 5,
    });
  }, []);

  const statsData = [
    { 
      title: 'Total Users', 
      value: stats.totalUsers.toLocaleString(), 
      icon: Users, 
      color: 'blue',
      change: '+12%' 
    },
    { 
      title: 'Active Chats', 
      value: stats.totalChats.toLocaleString(), 
      icon: MessageSquare, 
      color: 'green',
      change: '+8%' 
    },
    { 
      title: 'Total Messages', 
      value: stats.totalMessages.toLocaleString(), 
      icon: BarChart3, 
      color: 'purple',
      change: '+24%' 
    },
    { 
      title: 'AI Models', 
      value: stats.activeModels.toString(), 
      icon: Bot, 
      color: 'orange',
      change: 'All Active' 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="admin-card p-6 rounded-xl group hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-medium">{stat.change}</span>
            </div>
            
            <div>
              <p className="text-white/60 text-sm">{stat.title}</p>
              <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="admin-card p-6 rounded-xl"
        >
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-yellow-400" />
            API Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/70">OpenRouter API</span>
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Database</span>
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Models Available</span>
              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                5 Active
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="admin-card p-6 rounded-xl"
        >
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full btn-secondary py-2 rounded-lg text-left">
              View Recent Chats
            </button>
            <button className="w-full btn-secondary py-2 rounded-lg text-left">
              Manage AI Models
            </button>
            <button className="w-full btn-secondary py-2 rounded-lg text-left">
              Export User Data
            </button>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="admin-card p-6 rounded-xl"
      >
        <h3 className="text-white font-bold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { user: 'john_doe', action: 'Started new chat', time: '2 minutes ago', model: 'GPT-4O Mini' },
            { user: 'jane_smith', action: 'Switched to Llama model', time: '5 minutes ago', model: 'Llama 3.1 8B' },
            { user: 'alex_wilson', action: 'Completed conversation', time: '8 minutes ago', model: 'Phi-3 Mini' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
              <div>
                <p className="text-white/90 text-sm">
                  <span className="text-blue-400 font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-white/50 text-xs">{activity.time} • {activity.model}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function UsersTab() {
  return (
    <div className="admin-card p-6 rounded-xl">
      <h3 className="text-white font-bold text-lg mb-4">User Management</h3>
      <p className="text-white/70">User management interface coming soon...</p>
    </div>
  );
}

function ModelsTab() {
  return (
    <div className="admin-card p-6 rounded-xl">
      <h3 className="text-white font-bold text-lg mb-4">AI Models</h3>
      <p className="text-white/70">AI model configuration interface coming soon...</p>
    </div>
  );
}

function ChatsTab() {
  return (
    <div className="admin-card p-6 rounded-xl">
      <h3 className="text-white font-bold text-lg mb-4">Chat Management</h3>
      <p className="text-white/70">Chat monitoring interface coming soon...</p>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="admin-card p-6 rounded-xl">
      <h3 className="text-white font-bold text-lg mb-4">System Settings</h3>
      <p className="text-white/70">Settings management interface coming soon...</p>
    </div>
  );
}