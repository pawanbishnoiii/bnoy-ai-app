'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const demoSteps = [
    {
      title: "Welcome to BNOY AI",
      description: "Your intelligent chat companion",
      feature: "🤖 Advanced AI Models"
    },
    {
      title: "Multiple AI Models",
      description: "Choose from GPT-4, Claude, Gemini and more",
      feature: "🧠 Smart Conversations"
    },
    {
      title: "Real-time Responses",
      description: "Get instant, intelligent responses",
      feature: "⚡ Lightning Fast"
    },
    {
      title: "Secure & Private",
      description: "Your conversations are encrypted and secure",
      feature: "🔒 Privacy First"
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="font-bold text-xl">BNOY AI</span>
          </Link>
          
          <Link
            href="/chat"
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Try It Now
          </Link>
        </div>
      </header>

      {/* Demo Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Experience the Power of
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {" "}BNOY AI
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Watch how our AI platform transforms conversations into intelligent interactions
          </p>
        </div>

        {/* Interactive Demo */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Demo Screen */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white font-medium ml-4">BNOY AI Chat</span>
              </div>
            </div>
            
            <div className="p-6 h-96 overflow-y-auto">
              {/* Sample Chat Messages */}
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl max-w-xs">
                    <p>Hello! Can you help me with coding?</p>
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-xl max-w-xs border border-white/20">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">🤖</span>
                      </div>
                      <div>
                        <p>Absolutely! I&apos;d be happy to help you with coding. What programming language or specific problem are you working on?</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl max-w-xs">
                    <p>I need help with React components</p>
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-xl max-w-xs border border-white/20">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">🤖</span>
                      </div>
                      <div>
                        <p>Great! React components are fundamental building blocks. What specific aspect would you like help with?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Information */}
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{demoSteps[currentStep].feature}</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {demoSteps[currentStep].title}
                </h3>
                <p className="text-gray-300">
                  {demoSteps[currentStep].description}
                </p>
              </div>
              
              <button
                onClick={nextStep}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Next Feature →
              </button>
            </div>

            {/* Demo Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-bold text-white">&lt; 1s</div>
                <div className="text-gray-400 text-sm">Response Time</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-bold text-white">10+</div>
                <div className="text-gray-400 text-sm">AI Models</div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="/chat"
                className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🚀 Start Your First Chat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}