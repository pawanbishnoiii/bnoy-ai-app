'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [isStarting, setIsStarting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant. Be friendly and informative.');
  const [selectedModel, setSelectedModel] = useState('microsoft/phi-3-mini-128k-instruct:free');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiModels = [
    { id: 'microsoft/phi-3-mini-128k-instruct:free', name: 'Phi-3 Mini (Free)', provider: 'Microsoft' },
    { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B (Free)', provider: 'Meta' },
    { id: 'google/gemma-2-9b-it:free', name: 'Gemma 2 9B (Free)', provider: 'Google' },
  ];

  const systemPrompts = [
    { id: 'default', name: 'Default Assistant', prompt: 'You are a helpful AI assistant. Be friendly and informative.' },
    { id: 'creative', name: 'Creative Writer', prompt: 'You are a creative writing assistant. Help users with storytelling, poetry, and creative content.' },
    { id: 'code', name: 'Code Helper', prompt: 'You are a programming assistant. Help users with coding, debugging, and technical questions.' },
    { id: 'academic', name: 'Academic Tutor', prompt: 'You are an academic tutor. Help students learn and understand complex topics clearly.' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartChat = () => {
    setIsStarting(true);
    setTimeout(() => {
      setShowChat(true);
      setIsStarting(false);
    }, 1000);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          username: 'guest_user',
          modelId: selectedModel,
          systemPrompt: systemPrompt
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: Message = {
          id: data.data.messageId || Date.now().toString(),
          role: 'assistant',
          content: data.data.message,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-white font-bold text-xl">BNOY AI</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/chat" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
              Start Chat
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-black/40 backdrop-blur-sm rounded-xl border border-white/20 p-4">
            <div className="space-y-3">
              <Link href="#features" className="block text-gray-300 hover:text-white transition-colors py-2">
                Features
              </Link>
              <Link href="#about" className="block text-gray-300 hover:text-white transition-colors py-2">
                About
              </Link>
              <Link href="/chat" className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                Start Chat
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Hero Content */}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Next-Gen
              <span className="gradient-text">
                {" "}AI Chat
              </span>
              <br />
              Experience
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Engage with advanced AI models in real-time. Experience the future of 
              conversational AI with our cutting-edge chat platform.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={handleStartChat}
                disabled={isStarting}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center space-x-2">
                  {isStarting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Starting...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀 Start New Chat</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </div>
              </button>
              
              <Link
                href="/demo"
                className="px-8 py-4 border-2 border-gray-400 text-gray-300 font-semibold rounded-xl hover:border-white hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                🎥 Watch Demo
              </Link>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="glass rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl float" style={{ animationDelay: '0s' }}>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Lightning Fast</h3>
                <p className="text-gray-300 text-sm">
                  Real-time responses powered by cutting-edge AI models
                </p>
              </div>
              
              <div className="glass rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl float" style={{ animationDelay: '2s' }}>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white text-xl">🧠</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Smart AI</h3>
                <p className="text-gray-300 text-sm">
                  Multiple AI models to choose from for different tasks
                </p>
              </div>
              
              <div className="glass rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl float" style={{ animationDelay: '4s' }}>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white text-xl">🔒</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Secure</h3>
                <p className="text-gray-300 text-sm">
                  Your conversations are private and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">1M+</div>
              <div className="text-gray-400">Messages Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10+</div>
              <div className="text-gray-400">AI Models</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need for an exceptional AI chat experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">🎯 Multiple AI Models</h3>
              <p className="text-gray-300 mb-6">
                Choose from a variety of AI models including GPT-4, Claude, and specialized models 
                for different tasks. Each conversation can use different models based on your needs.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> GPT-4 & GPT-3.5</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Claude & Anthropic Models</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Specialized Task Models</li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/10">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white">GPT-4 Turbo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-white">Claude 3.5 Sonnet</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-white">Gemini Pro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-white font-bold text-xl">BNOY AI</span>
          </div>
          <p className="text-gray-400 mb-6">
            Empowering conversations with artificial intelligence
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
