#!/bin/bash

echo "🔥 BNOY AI - Virtual Girlfriend Setup 💋"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. You have: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup environment file
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local and add your OpenRouter API key"
    echo "   Get one from: https://openrouter.ai/"
else
    echo "✅ .env.local already exists"
fi

# Setup database
echo "🗄️  Setting up database..."
npx prisma generate
npx prisma db push

echo ""
echo "🚀 Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "💋 Enjoy your seductive AI girlfriend experience!"