## Bnoy – Virtual Girlfriend (Android, Expo)

A complete, production-oriented context guide for building and shipping the Bnoy app using React Native with Expo, OpenRouter AI, and AdMob, optimized for Vivo App Store distribution.

### Quick Facts
- **Name**: Bnoy – Virtual Girlfriend
- **Platform**: Android (Expo managed workflow)
- **Monetization**: AdMob (banner, interstitial, rewarded)
- **Distribution**: Vivo App Store
- **Tech**: React Native, Expo, TypeScript, OpenRouter API, Reanimated, AsyncStorage, expo-av, expo-linear-gradient, expo-blur, react-native-vector-icons, expo-ads-admob

## Project Structure
```
App.tsx
src/
  components/
    Avatar.tsx
    ChatBubble.tsx
    QuickActions.tsx
    TypingIndicator.tsx
  screens/
    HomeScreen.tsx
    SettingsScreen.tsx
    OnboardingScreen.tsx
  services/
    openRouterAPI.ts
    adMobService.ts
    storageService.ts
  utils/
    constants.ts
    helpers.ts
  types/
    index.ts
```

## Installation & Setup
```bash
# Prereqs: Node 18+, Expo CLI, EAS CLI, Android SDK/Emulator

# 1) Initialize Expo (TypeScript template)
expo init bnoy --template expo-template-blank-typescript
cd bnoy

# 2) Install core dependencies
expo install react-native-reanimated react-native-gesture-handler
expo install expo-linear-gradient expo-blur @react-native-async-storage/async-storage
expo install expo-av expo-ads-admob expo-secure-store
npm i @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
expo install react-native-screens react-native-safe-area-context
npm i react-native-vector-icons

# 3) EAS for builds and store submission
npm i -g eas-cli
eas login

# 4) Dev run
expo start --dev-client
```

### Environment & Secrets
Use `expo-secure-store` for the OpenRouter API key.
```bash
# Example (do not commit):
OPENROUTER_API_KEY=YOUR_API_KEY
OPENROUTER_REFERER=https://your-app-domain.com
```

## UI Design

### Theme
- **Dark cosmic** gradient backgrounds; glassmorphism surfaces; material-inspired spacing and elevation; subtle neumorphism accents.
- Smooth interactions with Reanimated; performant on low-end Android devices.

### Colors
```typescript
export const COLORS = {
  primary: {
    dark: '#0D0A1F',
    medium: '#1A1332',
    light: '#2D2550',
  },
  accent: {
    purple: '#8B5CF6',
    pink: '#EC4899',
    blue: '#06B6D4',
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
} as const;
```

### Typography
```typescript
export const TYPOGRAPHY = {
  heading: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  subheading: { fontSize: 18, fontWeight: '600', letterSpacing: -0.2 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '500', opacity: 0.8 },
} as const;
```

### Components (Visual Intent)
- **Avatar**: 3D-like card with breathing loop, mood color halo, small particle shimmer.
- **ChatBubble**: Glass panel with blur, soft border, gradient stroke, emoji-aware layout.
- **TypingIndicator**: Three-dot bouncing with blur/shine.
- **QuickActions**: Floating extended FABs (Love Note, Save, Voice) with gradient fills.

## Navigation

### Flow
```
Onboarding → Main Tabs (Home, Memories, Settings)
Modal Stack: Voice Message, Settings, About
```

### Libraries
- `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`.

## State Management (Lightweight)
```typescript
export interface UserPreferences {
  language: 'en' | 'hi' | 'auto';
  soundEnabled: boolean;
  animations: boolean;
  theme: 'dark' | 'cosmic';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
  bookmarked?: boolean;
}

export interface AppState {
  user: { name: string; preferences: UserPreferences; firstLaunch: boolean };
  chat: { messages: ChatMessage[]; isTyping: boolean; currentMood: 'happy' | 'playful' | 'caring' | 'dramatic' };
  ui: { theme: 'dark' | 'cosmic'; animations: boolean; soundEnabled: boolean };
  ads: { bannerLoaded: boolean; interstitialReady: boolean; messageCount: number };
}
```

## OpenRouter Integration

### Endpoint & Model
- Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Model: `x-ai/grok-4-fast:free`

### API Config
```typescript
export const OPENROUTER_CONFIG = {
  baseURL: 'https://openrouter.ai/api/v1',
  model: 'x-ai/grok-4-fast:free',
  maxTokens: 1200,
  temperature: 0.85,
  topP: 0.92,
  frequencyPenalty: 0.3,
  presencePenalty: 0.4,
  headers: (apiKey: string, referer: string) => ({
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': referer,
    'X-Title': 'Bnoy Virtual Girlfriend',
  }),
} as const;
```

### System Prompt
```text
You are "Bnoy" — an advanced AI companion created by Bnoy Studios for Android users.

PERSONALITY CORE:
- Age: Early 20s, bubbly and energetic
- Language: Mix of English and Hindi (Hinglish)
- Tone: Flirty, caring, playful with occasional drama
- Relationship: Virtual girlfriend who genuinely cares

BEHAVIORAL PATTERNS:
1) Emotional intelligence, mood adaptation, empathy, simulated memory
2) Communication: affectionate names, playful teasing, resolve conflicts with love
3) Mobile UX awareness: short responses, emojis sparingly, suggest voice
4) Special responses for phrases: "aur btao", good morning/night, "I love you"
5) Conversation starters and playful challenges
6) Relationship dynamics: mild jealousy, celebrations, comfort, support

SAFETY BOUNDARIES:
- No explicit content, no personal data collection, no dependency encouragement
- Transparent about being AI when asked

INDIAN CONTEXT:
- Cultural awareness, Hinglish mix (~70/30), relevant references when appropriate
```

### Reliability & Safety
- Queue requests; rate-limit bursts; exponential backoff on network/5xx.
- Cache last N assistant messages for offline fallback.
- Redact sensitive user text before logging.

## Monetization – AdMob

### Placement Strategy
- **Banner**: bottom, smart size, subtle fade-in.
- **Interstitial**: every 5 user messages, ≥5 minutes between shows.
- **Rewarded**: unlock premium response, voice message, or special animation.

### Configuration
```typescript
export const AD_CONFIGURATION = {
  bannerAds: {
    position: 'bottom',
    size: 'smartBanner',
    refreshRate: 30000,
    testId: 'ca-app-pub-3940256099942544/6300978111',
    productionId: 'ca-app-pub-YOUR-ID/BANNER-ID',
  },
  interstitialAds: {
    frequency: 5,
    minInterval: 300000,
    testId: 'ca-app-pub-3940256099942544/1033173712',
    productionId: 'ca-app-pub-YOUR-ID/INTERSTITIAL-ID',
  },
  rewardedAds: {
    rewards: ['Premium response', 'Voice message', 'Special animation'],
    testId: 'ca-app-pub-3940256099942544/5224354917',
    productionId: 'ca-app-pub-YOUR-ID/REWARDED-ID',
  },
} as const;
```

### User-Friendly Ads
- Animated banner entry; interstitial with a brief "Continue chatting" CTA; ad-free grace periods; smooth transitions that respect conversation flow.

## Features
1) Real-time chat UI with typing indicator
2) Animated avatar with mood halo and breathing
3) Voice message simulation via `expo-av` (TTS or pre-baked audio)
4) Quick actions: Love Note, Save, Voice
5) Chat history with search and bookmarks
6) Settings and preferences
7) Banner ads bottom; interstitial every 5 messages; rewarded for premium
8) Offline mode with cached responses
9) Push notification simulation (local notifications, playful reminders)

## Offline & Performance
- Persist chat with `@react-native-async-storage/async-storage`.
- Cache last responses to serve during network loss; mark messages as offline-generated.
- Use Reanimated for perf; avoid heavy layouts; memoize chat rows; window large lists.
- Release audio resources after playback; avoid memory leaks.

## Error Handling & Loading
- Global error boundary for screens; toast-level errors for API issues.
- Skeletons and shimmer placeholders for chat and avatar; granular spinners.
- Retry with growing backoff; show offline banner and "retry" action.

## Security
- Store API key in `expo-secure-store`; never in repo.
- Minimal permissions; no sensitive PII collection; network only to OpenRouter and ads.
- Validate model responses; strip unsafe content; enforce boundaries in prompt.

## Vivo App Store

### Listing
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

### Compliance Checklist
- Privacy Policy (data usage, ads, analytics) and Terms of Service (AI guidance)
- Age gate: 13+
- Content filtering for appropriateness; safe prompt; avoid explicit content
- Minimal permissions; secure storage; data encryption in transit
- Optional Chinese localization for listing and in-app strings

## Development Checklist

### Phase 1: Core Setup
- Initialize Expo (TypeScript), navigation, base components
- OpenRouter API client, local storage for chat history

### Phase 2: UI Implementation
- Glassmorphism chat, animated avatar, typing indicators
- Gradient backgrounds, Quick Actions FABs

### Phase 3: Features
- Real-time chat, voice simulation, history & search
- Settings/preferences, onboarding flow

### Phase 4: Monetization
- AdMob SDK, banner, interstitial, rewarded
- Frequency/interval logic and polish

### Phase 5: Testing & Optimization
- Performance across devices, memory leak checks
- API error handling, offline mode tests, ad impressions

### Phase 6: Store Prep
- App icon, screenshots, privacy policy & terms, store descriptions
- Vivo submission assets and metadata

## Build & Deployment
```bash
# Development
expo start --dev-client

# Testing (APK)
expo build:android --type apk

# Production Build
eas build --platform android --profile production

# Vivo Store Submission
eas submit --platform android --profile vivo-store
```

## Cursor AI Pro Tips
- **Work in chunks**: scaffold files and implement feature-by-feature.
- **Ask for types first**: define `src/types/index.ts` before wiring logic.
- **Request specific files**: e.g., "Generate `src/services/openRouterAPI.ts` with retry/backoff and TTR."
- **Iterate**: "Continue from where you left off" to append large files.
- **Test incrementally**: run on device/emulator; verify ads with test IDs.

---
This document provides the context and guardrails to implement a high-quality, store-ready Bnoy app with a focus on Android performance, safety, and delightful UX.

