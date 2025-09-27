import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        
        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Predefined shortcuts for the chat app
export function useChatShortcuts(callbacks: {
  newChat: () => void;
  toggleSidebar: () => void;
  focusInput: () => void;
  openSettings: () => void;
}) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'n',
      ctrl: true,
      callback: callbacks.newChat,
      description: 'Create new chat',
    },
    {
      key: 'b',
      ctrl: true,
      callback: callbacks.toggleSidebar,
      description: 'Toggle sidebar',
    },
    {
      key: '/',
      callback: callbacks.focusInput,
      description: 'Focus message input',
    },
    {
      key: ',',
      ctrl: true,
      callback: callbacks.openSettings,
      description: 'Open settings',
    },
  ];

  useKeyboardShortcuts(shortcuts);
  
  return shortcuts;
}