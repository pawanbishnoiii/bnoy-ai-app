import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  modelUsed?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  email?: string;
}

interface ChatState {
  // State
  user: User | null;
  currentChat: Chat | null;
  chats: Chat[];
  selectedModel: string;
  isLoading: boolean;
  isStreaming: boolean;
  streamingMessage: string;
  
  // Actions
  setUser: (user: User | null) => void;
  setCurrentChat: (chat: Chat | null) => void;
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  addMessage: (chatId: string, message: Message) => void;
  setSelectedModel: (model: string) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  setStreamingMessage: (message: string) => void;
  clearStreamingMessage: () => void;
  
  // API Actions
  sendMessage: (content: string) => Promise<void>;
  createNewChat: () => Promise<void>;
  startChatWithMessage: (content: string) => Promise<void>;
  loadChatHistory: () => Promise<void>;
  loadChat: (chatId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      currentChat: null,
      chats: [],
      selectedModel: 'openai/gpt-4o-mini-2024-07-18:free',
      isLoading: false,
      isStreaming: false,
      streamingMessage: '',

      // Actions
      setUser: (user) => set({ user }),
      setCurrentChat: (currentChat) => set({ currentChat }),
      setChats: (chats) => set({ chats }),
      
      addChat: (chat) => set((state) => ({ 
        chats: [chat, ...state.chats] 
      })),
      
      updateChat: (chatId, updates) => set((state) => ({
        chats: state.chats.map(chat => 
          chat.id === chatId ? { ...chat, ...updates } : chat
        ),
        currentChat: state.currentChat?.id === chatId 
          ? { ...state.currentChat, ...updates } 
          : state.currentChat
      })),
      
      addMessage: (chatId, message) => set((state) => ({
        chats: state.chats.map(chat => 
          chat.id === chatId 
            ? { ...chat, messages: [...chat.messages, message], updatedAt: new Date() }
            : chat
        ),
        currentChat: state.currentChat?.id === chatId
          ? { 
              ...state.currentChat, 
              messages: [...state.currentChat.messages, message],
              updatedAt: new Date()
            }
          : state.currentChat
      })),
      
      setSelectedModel: (selectedModel) => set({ selectedModel }),
      setLoading: (isLoading) => set({ isLoading }),
      setStreaming: (isStreaming) => set({ isStreaming }),
      setStreamingMessage: (streamingMessage) => set({ streamingMessage }),
      clearStreamingMessage: () => set({ streamingMessage: '' }),

      // API Actions
      sendMessage: async (content: string) => {
        const { user, currentChat, selectedModel } = get();
        if (!user) return;

        set({ isLoading: true });

        try {
          // Add user message immediately
          const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date(),
          };

          let chatId = currentChat?.id;
          
          if (currentChat) {
            get().addMessage(currentChat.id, userMessage);
          }

          // Send to API
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: content,
              chatId,
              username: user.username,
              modelId: selectedModel,
            }),
          });

          const data = await response.json();

          if (data.success) {
            // If new chat was created, update the chat ID
            if (!chatId) {
              chatId = data.data.chatId;
              const newChat: Chat = {
                id: chatId,
                title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
                messages: [userMessage],
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              get().addChat(newChat);
              get().setCurrentChat(newChat);
            }

            // Add AI response
            const aiMessage: Message = {
              id: data.data.messageId,
              role: 'assistant',
              content: data.data.message,
              timestamp: new Date(),
              modelUsed: selectedModel,
            };

            get().addMessage(chatId, aiMessage);
          }
        } catch (error) {
          console.error('Failed to send message:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      createNewChat: async () => {
        set({ currentChat: null });
      },

      startChatWithMessage: async (content: string) => {
        set({ currentChat: null });
        await get().sendMessage(content);
      },

      loadChatHistory: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const response = await fetch(`/api/chat?username=${user.username}`);
          const data = await response.json();
          
          if (data.success) {
            const chats = data.data.chats.map((chat: any) => ({
              ...chat,
              createdAt: new Date(chat.createdAt),
              updatedAt: new Date(chat.updatedAt),
            }));
            set({ chats });
          }
        } catch (error) {
          console.error('Failed to load chat history:', error);
        }
      },

      loadChat: async (chatId: string) => {
        try {
          const response = await fetch(`/api/chat?chatId=${chatId}`);
          const data = await response.json();
          
          if (data.success) {
            const chat = {
              ...data.data,
              createdAt: new Date(data.data.createdAt),
              updatedAt: new Date(data.data.updatedAt),
              messages: data.data.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })),
            };
            set({ currentChat: chat });
          }
        } catch (error) {
          console.error('Failed to load chat:', error);
        }
      },
    }),
    { name: 'chat-store' }
  )
);