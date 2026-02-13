'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole =
  | 'developer'
  | 'designer'
  | 'guardian'
  | 'product-manager'
  | 'project-owner'
  | null;

export interface OfficeHoursGuardian {
  name: string;
  specialty: string;
  nextSlot: string;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  componentPreview?: 'datatable' | 'button';
  sources?: {
    title: string;
    type: 'figma' | 'storybook' | 'github' | 'chromatic';
    url: string;
  }[];
  trustBadge?: 'official' | 'best-practice';
  /** When true, show guardian "Record an answer" CTA (optional video escalation) */
  suggestVideoAnswer?: boolean;
  /** Office hours booking flow data */
  officeHours?: {
    step: 'select-role' | 'select-guardian' | 'confirmed';
    role?: 'designer' | 'developer';
    guardians?: OfficeHoursGuardian[];
    booking?: { guardian: string; time: string; specialty: string };
  };
  /** Clickable suggested questions rendered after the message */
  suggestedQuestions?: string[];
  timestamp: Date;
}

interface RoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  chatHistory: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

function loadChatHistory(): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem('carbon-chat-history');
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(loadChatHistory);

  /* Persist chat history to sessionStorage */
  useEffect(() => {
    try {
      sessionStorage.setItem('carbon-chat-history', JSON.stringify(chatHistory));
    } catch { /* quota exceeded — ignore */ }
  }, [chatHistory]);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, newMessage]);
  };

  const clearHistory = () => {
    setChatHistory([]);
    try { sessionStorage.removeItem('carbon-chat-history'); } catch { /* ignore */ }
  };

  return (
    <RoleContext.Provider value={{ userRole, setUserRole, chatHistory, addMessage, clearHistory }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
}
