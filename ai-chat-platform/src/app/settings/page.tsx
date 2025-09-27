'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Download, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState('dark');
  const [autoSave, setAutoSave] = useState(true);

  const handleSave = () => {
    // Save settings logic
    (window as any).showToast?.({
      type: 'success',
      title: 'Settings saved successfully!',
      description: 'Your preferences have been updated.',
    });
  };

  const handleExportData = () => {
    // Export data logic
    (window as any).showToast?.({
      type: 'info',
      title: 'Exporting data...',
      description: 'Your chat history will be downloaded shortly.',
    });
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all your chat data? This cannot be undone.')) {
      // Clear data logic
      (window as any).showToast?.({
        type: 'warning',
        title: 'Data cleared',
        description: 'All your chat history has been removed.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 p-4 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <Link href="/" className="btn-secondary p-2 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Settings</h1>
              <p className="text-white/60">Customize your AI chat experience</p>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-xl p-6"
          >
            <h2 className="text-white font-bold text-lg mb-4">Profile Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all"
                />
              </div>
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-xl p-6"
          >
            <h2 className="text-white font-bold text-lg mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 font-medium">Auto-save chats</p>
                  <p className="text-white/60 text-sm">Automatically save your conversations</p>
                </div>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`w-12 h-6 rounded-full transition-all duration-200 ${
                    autoSave ? 'bg-blue-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                    autoSave ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-xl p-6"
          >
            <h2 className="text-white font-bold text-lg mb-4">Data Management</h2>
            <div className="space-y-4">
              <button
                onClick={handleExportData}
                className="w-full btn-secondary py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export Chat History
              </button>
              
              <button
                onClick={handleClearData}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
              >
                <Trash2 className="w-5 h-5" />
                Clear All Data
              </button>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={handleSave}
              className="w-full btn-primary py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Settings
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}