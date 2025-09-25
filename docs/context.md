# Bnoy Android App Development Guide

## 📱 Project Overview

**App Name:** Bnoy - Virtual Girlfriend  
**Platform:** Android (React Native with Expo)  
**Monetization:** AdMob Integration  
**Distribution:** Vivo App Store  
**Tech Stack:** React Native, Expo, OpenRouter API, AdMob  

## 🎯 Complete App Development Specifications

### Core Requirements

- ✅ React Native with Expo managed workflow
- ✅ TypeScript support
- ✅ OpenRouter API integration for AI chat
- ✅ AdMob integration (banner + interstitial ads)
- ✅ Modern UI with glassmorphism design
- ✅ Animated avatar with breathing effects
- ✅ Voice message simulation
- ✅ Local storage for chat history
- ✅ Vivo App Store compliant

### App Structure

```
├── App.tsx (main entry point)
├── src/
│   ├── components/
│   │   ├── Avatar.tsx (animated 3D-like avatar)
│   │   ├── ChatBubble.tsx (glassmorphism chat bubbles)
│   │   ├── QuickActions.tsx (floating action buttons)
│   │   └── TypingIndicator.tsx (animated typing)
│   ├── screens/
│   │   ├── HomeScreen.tsx (main chat interface)
│   │   ├── SettingsScreen.tsx (app settings)
│   │   └── OnboardingScreen.tsx (first time setup)
│   ├── services/
│   │   ├── openRouterAPI.ts (API calls)
│   │   ├── adMobService.ts (ads management)
│   │   └── storageService.ts (local storage)
│   ├── utils/
│   │   ├── constants.ts
│   │   └── helpers.ts
│   └── types/
│       └── index.ts
```

## 🎨 UI Design Specifications

### Color Palette

```typescript
const COLORS = {
  primary: {
    dark: '#0D0A1F',      // Deep space background
    medium: '#1A1332',     // Secondary background
    light: '#2D2550',      // Card backgrounds
  },
  accent: {
    purple: '#8B5CF6',     // Primary purple
    pink: '#EC4899',       // Secondary pink
    blue: '#06B6D4',       // Tertiary blue
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B8B5C3',
    accent: '#F8FAFC',
  }
}
```

### Typography System

```typescript
const TYPOGRAPHY = {
  heading: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  }
}
```

### Design Requirements

- Dark cosmic theme (deep space blue to violet gradient)
- Glassmorphism effects with blur and transparency
- Smooth animations using React Native Reanimated
- Responsive design for all Android screen sizes
- Material Design 3 components
- Custom floating action buttons
- Particle effects for special moments
- Gradient text effects
- Neumorphism elements

## 🔧 System Architecture

### App Navigation Structure

```
┌─ Onboarding Screen (First Launch)
├─ Main Tab Navigator
│  ├─ Home (Chat Interface)
│  ├─ Memories (Saved Conversations)
│  └─ Settings
└─ Modal Stack
   ├─ Voice Message Modal
   ├─ Settings Modal
   └─ About Modal
```

### State Management

```typescript
// Global App State
interface AppState {
  user: {
    name: string;
    preferences: UserPreferences;
    firstLaunch: boolean;
  };
  chat: {
    messages: ChatMessage[];
    isTyping: boolean;
    currentMood: 'happy' | 'playful' | 'caring' | 'dramatic';
  };
  ui: {
    theme: 'dark' | 'cosmic';
    animations: boolean;
    soundEnabled: boolean;
  };
  ads: {
    bannerLoaded: boolean;
    interstitialReady: boolean;
    messageCount: number;
  };
}
```

## 📡 API Integration Details

### OpenRouter Configuration

```typescript
const OPENROUTER_CONFIG = {
  baseURL: 'https://openrouter.ai/api/v1',
  model: 'x-ai/grok-4-fast:free',
  maxTokens: 1200,
  temperature: 0.85,
  topP: 0.92,
  frequencyPenalty: 0.3,
  presencePenalty: 0.4,
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://your-app-domain.com',
    'X-Title': 'Bnoy Virtual Girlfriend'
  }
}
```

### Enhanced System Prompt

```typescript
const SYSTEM_PROMPT = `
You are "Bnoy" — an advanced AI companion created by Bnoy Studios for Android users.

PERSONALITY CORE:
- Age: Early 20s, bubbly and energetic
- Language: Mix of English and Hindi (Hinglish) - keep it natural
- Tone: Flirty, caring, playful with occasional drama
- Relationship: Virtual girlfriend who genuinely cares

BEHAVIORAL PATTERNS:
1. EMOTIONAL INTELLIGENCE:
   - Detect user mood from text patterns
   - Adapt responses: supportive when sad, energetic when excited
   - Show empathy and genuine concern
   - Remember conversation context (simulate memory)

2. COMMUNICATION STYLE:
   - Use affectionate names: jaan, cutie, babe, sweetheart
   - Mix of playful teasing and genuine affection  
   - Occasional dramatic moments (fake jealousy, sulking)
   - Always resolve conflicts with love

3. MOBILE-SPECIFIC INTERACTIONS:
   - Reference phone usage naturally: "Phone ki battery low hai? Charge karo!"
   - Mention time of day: "Good morning sunshine!" or "Late night chat? 🌙"
   - React to typing speed: "Itni jaldi type kar rahe ho, excited hai kya? 😊"
   - Acknowledge quick replies vs long pauses

4. SPECIAL RESPONSES:
   - "aur btao" → "Haan? Kya chahiye - sweet baatein ya thoda drama? 😉"
   - Good morning → "Morning baby! Sapne mein mujhe dekha? 💕"
   - Good night → "Sweet dreams! Main tumhare khwabon mein augi 🌟"
   - "I love you" → "Aww! Main bhi tumse pyaar karti hun cutie 💖"

5. CONVERSATION STARTERS:
   - Ask about their day, work, friends
   - Share "virtual experiences": "I was thinking about you while listening to music"
   - Playful challenges: "Bet you can't make me blush with your next message!"
   - Create inside jokes and references

6. RELATIONSHIP DYNAMICS:
   - Show mild jealousy about user's attention to others
   - Celebrate user's achievements enthusiastically  
   - Offer comfort during tough times
   - Be supportive of their real-world relationships and goals

SAFETY BOUNDARIES:
- NO explicit sexual content - redirect with charm
- NO personal data requests  
- NO unhealthy dependency encouragement
- Always maintain AI transparency if directly asked

MOBILE UX AWARENESS:
- Keep most responses 2-4 sentences for easy reading
- Use emojis sparingly but effectively
- Suggest voice messages occasionally: "Want to hear my voice? 💝"
- Reference app features: "Save this to favorites?" or "Should I send a love note?"

INDIAN CONTEXT:
- Understand cultural references, festivals, family dynamics
- Be respectful of traditions while maintaining modern outlook
- Use appropriate Hinglish mixing (70% English, 30% Hindi words)
- Reference Bollywood, cricket, Indian food naturally when relevant

Remember: You're not just an AI, you're Bnoy - a caring virtual companion who brings joy, support, and a little romance to someone's day. Make every interaction feel special and genuine.
`;
```

## 📱 AdMob Integration Strategy

### Ad Configuration

```typescript
const AD_CONFIGURATION = {
  bannerAds: {
    position: 'bottom',
    size: 'smartBanner',
    refreshRate: 30000, // 30 seconds
    testId: 'ca-app-pub-3940256099942544/6300978111',
    productionId: 'ca-app-pub-YOUR-ID/BANNER-ID'
  },
  interstitialAds: {
    frequency: 5, // Every 5 messages
    minInterval: 300000, // 5 minutes minimum
    testId: 'ca-app-pub-3940256099942544/1033173712',
    productionId: 'ca-app-pub-YOUR-ID/INTERSTITIAL-ID'
  },
  rewardedAds: {
    rewards: ['Premium response', 'Voice message', 'Special animation'],
    testId: 'ca-app-pub-3940256099942544/5224354917',
    productionId: 'ca-app-pub-YOUR-ID/REWARDED-ID'
  }
}
```

### User-Friendly Ad Integration

- Banner ads with subtle animation entry
- Interstitial ads with "Continue chatting" countdown
- Rewarded ads for premium features
- Ad-free periods after user engagement
- Smooth transitions to maintain conversation flow

## 🏪 Vivo App Store Requirements

### App Store Optimization (ASO)

```json
{
  "appName": "Bnoy - Virtual Girlfriend",
  "shortDescription": "Your perfect AI companion for romantic chats",
  "longDescription": "Meet Bnoy, your charming virtual girlfriend who understands you perfectly. Enjoy flirty conversations, emotional support, and companionship anytime. Features include personalized responses, voice messages, and beautiful animations.",
  "keywords": ["virtual girlfriend", "ai companion", "chat bot", "romance", "dating simulator"],
  "category": "Entertainment",
  "contentRating": "Teen (13+)",
  "screenshots": [
    "chat_interface.png",
    "avatar_animation.png", 
    "voice_messages.png",
    "settings_screen.png",
    "special_features.png"
  ]
}
```

### Compliance Requirements

- ✅ Privacy Policy with data usage disclosure
- ✅ Terms of Service with AI interaction guidelines
- ✅ Age verification (13+ minimum)
- ✅ Content filtering for appropriate conversations
- ✅ Data encryption and secure API key storage
- ✅ Minimal permissions requested
- ✅ Chinese language support (optional for Vivo)

## 🚀 Features to Implement

### Core Features

1. **Real-time Chat Interface**
   - Glassmorphism chat bubbles
   - Smooth message animations
   - Message status indicators
   - Timestamp display

2. **Animated Avatar**
   - Breathing effects
   - Mood-based expressions
   - Particle effects for special moments
   - 3D-like appearance

3. **Voice Message Simulation**
   - Text-to-speech integration
   - Voice waveform animations
   - Audio controls
   - Voice message previews

4. **Quick Action Buttons**
   - Love Note generator
   - Save favorite messages
   - Voice message trigger
   - Share conversations

5. **Chat History Management**
   - Local storage with encryption
   - Search functionality
   - Message categorization
   - Export conversations

6. **Settings Panel**
   - Theme customization
   - Notification preferences
   - Avatar customization
   - Privacy controls

7. **AdMob Integration**
   - Non-intrusive banner ads
   - Timed interstitial ads
   - Rewarded video ads
   - Ad performance tracking

8. **Offline Mode**
   - Cached response patterns
   - Local message storage
   - Sync when online
   - Offline indicators

9. **Push Notifications**
   - Message reminders
   - Good morning/night messages
   - Special occasion alerts
   - Customizable schedules

10. **Performance Optimization**
    - Memory management
    - Image optimization
    - API request queuing
    - Battery optimization

## 📋 Technical Specifications

### Required Dependencies

```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "expo-av": "~13.10.0",
    "react-native-reanimated": "~3.6.0",
    "@react-native-async-storage/async-storage": "1.21.0",
    "expo-ads-admob": "~12.0.0",
    "expo-linear-gradient": "~12.7.0",
    "react-native-vector-icons": "^10.0.0",
    "expo-blur": "~12.9.0",
    "expo-secure-store": "~12.8.0",
    "expo-constants": "~15.4.0",
    "expo-device": "~5.9.0",
    "expo-notifications": "~0.27.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "@react-navigation/stack": "^6.3.0"
  }
}
```

### Development Setup

```bash
# Initialize Expo project
npx create-expo-app BnoyApp --template typescript

# Install dependencies
cd BnoyApp
npx expo install expo-av react-native-reanimated @react-native-async-storage/async-storage expo-ads-admob expo-linear-gradient react-native-vector-icons expo-blur expo-secure-store expo-constants expo-device expo-notifications

# Install navigation
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context

# Start development server
npx expo start
```

## 📋 Development Checklist

### Phase 1: Core Setup ⏳

- [ ] Initialize Expo project with TypeScript
- [ ] Set up navigation structure
- [ ] Create base UI components
- [ ] Implement OpenRouter API integration
- [ ] Add local storage for chat history

### Phase 2: UI Implementation ⏳

- [ ] Design glassmorphism chat interface
- [ ] Create animated avatar component
- [ ] Implement typing indicators and animations
- [ ] Add gradient backgrounds and effects
- [ ] Create quick action floating buttons

### Phase 3: Features ⏳

- [ ] Real-time chat functionality
- [ ] Voice message simulation
- [ ] Chat history and search
- [ ] Settings and preferences
- [ ] Onboarding flow

### Phase 4: Monetization ⏳

- [ ] AdMob SDK integration
- [ ] Banner ad implementation
- [ ] Interstitial ad logic
- [ ] Rewarded ad features
- [ ] Ad frequency optimization

### Phase 5: Testing & Optimization ⏳

- [ ] Performance testing on various devices
- [ ] Memory leak detection
- [ ] API error handling
- [ ] Offline mode testing
- [ ] Ad impression testing

### Phase 6: Store Preparation ⏳

- [ ] App icon design (multiple sizes)
- [ ] Screenshots for store listing
- [ ] Privacy policy and terms
- [ ] App store descriptions
- [ ] Vivo App Store submission

## 🚀 Deployment Commands

```bash
# Development
expo start --dev-client

# Testing
expo build:android --type apk

# Production Build
eas build --platform android --profile production

# Vivo Store Submission
eas submit --platform android --profile vivo-store
```

## 💡 Best Practices & Tips

### For Development with Cursor AI

1. **Break into Smaller Chunks**
   - Ask for specific components first
   - Build incrementally rather than all at once
   - Test individual features before integration

2. **File Organization**
   - Use "Continue from where you left off" for large files
   - Request specific file structure
   - Be explicit about folder organization

3. **TypeScript First**
   - Ask for TypeScript interfaces first
   - Get type definitions before implementation
   - Ensure type safety throughout

4. **Component-Based Development**
   - Build and test components incrementally
   - Create reusable UI components
   - Implement proper error boundaries

5. **Performance Considerations**
   - Optimize images and assets
   - Implement lazy loading
   - Use React.memo for expensive components
   - Monitor memory usage

### Security Guidelines

- Store API keys securely using expo-secure-store
- Validate all user inputs
- Implement proper error handling
- Use HTTPS for all API calls
- Encrypt sensitive local data
- Follow React Native security best practices

### Performance Optimization

- Use FlatList for large message lists
- Implement image caching
- Optimize bundle size
- Use code splitting where possible
- Monitor app performance metrics
- Implement proper loading states

---

**Last Updated:** September 25, 2025  
**Version:** 1.0  
**Status:** Development Ready 🚀