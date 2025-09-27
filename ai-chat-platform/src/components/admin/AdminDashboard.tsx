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
  EyeOff 
} from 'lucide-react';

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

// Placeholder tab components
function DashboardTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { title: 'Total Users', value: '1,234', icon: Users, color: 'blue' },
        { title: 'Active Chats', value: '89', icon: MessageSquare, color: 'green' },
        { title: 'AI Models', value: '5', icon: Bot, color: 'purple' },
        { title: 'API Calls', value: '12.3K', icon: BarChart3, color: 'orange' },
      ].map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="admin-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">{stat.title}</p>
              <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
          </div>
        </motion.div>
      ))}
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