import { useState, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Chat-specific API hook
export function useChatApi() {
  const api = useApi<any>();

  const sendMessage = useCallback(async (
    message: string, 
    chatId?: string, 
    username?: string, 
    modelId?: string
  ) => {
    return api.execute(async () => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, chatId, username, modelId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to send message');
      }

      return data.data;
    });
  }, [api]);

  const loadChat = useCallback(async (chatId: string) => {
    return api.execute(async () => {
      const response = await fetch(`/api/chat?chatId=${chatId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to load chat');
      }

      return data.data;
    });
  }, [api]);

  const loadChatHistory = useCallback(async (username: string) => {
    return api.execute(async () => {
      const response = await fetch(`/api/chat?username=${username}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to load chat history');
      }

      return data.data;
    });
  }, [api]);

  return {
    ...api,
    sendMessage,
    loadChat,
    loadChatHistory,
  };
}

// Admin API hook
export function useAdminApi() {
  const api = useApi<any>();

  const login = useCallback(async (password: string) => {
    return api.execute(async () => {
      const response = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      return data.data;
    });
  }, [api]);

  const getUsers = useCallback(async (token: string) => {
    return api.execute(async () => {
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      return data.data;
    });
  }, [api]);

  return {
    ...api,
    login,
    getUsers,
  };
}