#!/bin/bash

echo "🔥 BNOY AI - GitHub Upload Script 💋"
echo "===================================="

# Check if git is installed
if ! command -v git &> /dev/null
then
    echo "❌ Git not found. Please install Git first."
    exit 1
fi

echo "✅ Git found: $(git --version)"

# Initialize git if not already done
if [ ! -d .git ]; then
    echo "📁 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Add all files
echo "📝 Adding all files to Git..."
git add .

# Create commit
echo "💾 Creating commit..."
git commit -m "🔥 BNOY AI Virtual Girlfriend - Premium AI Chat App with 12+ Seductive Personalities

✨ Features:
- 🤖 Dual AI Models (Grok 4 Fast + GPT OSS 20B)
- 💋 12+ Seductive Virtual Girlfriend Personalities
- 🎨 Premium UI with Glassmorphism & Animations
- 💬 ChatGPT-style Interface
- 🔒 100% Private & Secure
- 📱 Fully Responsive Design
- 🚀 Built with Next.js 15, React 19, TypeScript

🌟 Personalities Include:
- Luna (Seductive Angel)
- Scarlett (Sultry Temptress)
- Valentine (Romantic Goddess)
- Phoenix (Fiery Passion)
- Mystique (Mysterious Seductress)
- Aphrodite (Goddess of Love)
- Candy (Sweet & Naughty)
- Raven (Dark Seductress)
- Jade (Exotic Beauty)
- Crystal (Pure Elegance)
- Cherry (Playful Minx)
- Rose (Classic Romance)

💻 Tech Stack:
- Frontend: Next.js 15, React 19, TypeScript
- Styling: Tailwind CSS 4, Framer Motion
- AI: OpenRouter API (Grok & GPT models)
- Database: SQLite with Prisma
- Icons: Phosphor Icons, Lucide React
- Fonts: Poppins, DM Sans, Playfair Display"

echo "✅ Commit created successfully!"
echo ""
echo "🌐 Next Steps:"
echo "1. Create a new repository on GitHub.com"
echo "2. Copy the repository URL"
echo "3. Run these commands:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/bnoy-ai-virtual-girlfriend.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "💋 Your seductive AI girlfriend app will be live on GitHub!"