import { createContext, useContext, useState, ReactNode } from 'react';

export interface Participant {
  id: string;
  name: string;
  type: 'merchant' | 'supplier' | 'shipping_company';
  isOnline: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  participants: Participant[];
  messages: Message[];
  type: 'general' | 'business_inquiry' | 'order_discussion' | 'shipping_coordination';
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
}

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation | null) => void;
  createConversation: (participants: Participant[], title: string, type: Conversation['type']) => Conversation;
  sendMessage: (conversationId: string, content: string) => Message;
  markAsRead: (conversationId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const createConversation = (
    participants: Participant[], 
    title: string, 
    type: Conversation['type']
  ): Conversation => {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      title,
      participants,
      messages: [],
      type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unreadCount: 0
    };

    setConversations(prev => [...prev, newConversation]);
    return newConversation;
  };

  const sendMessage = (conversationId: string, content: string): Message => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: 'current_user', // This would be the actual user ID in a real app
      content,
      timestamp: new Date().toISOString(),
      read: false
    };

    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages, newMessage],
              updatedAt: new Date().toISOString()
            } 
          : conv
      )
    );

    return newMessage;
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 } 
          : conv
      )
    );
  };

  const value: ChatContextType = {
    conversations,
    activeConversation,
    setActiveConversation,
    createConversation,
    sendMessage,
    markAsRead
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}