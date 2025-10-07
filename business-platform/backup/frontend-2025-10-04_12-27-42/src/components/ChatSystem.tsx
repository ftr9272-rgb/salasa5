import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreHorizontal, 
  Minimize2, 
  Maximize2, 
  X,
  User,
  Bot,
  Search,
  Settings,
  Archive,
  Star,
  Mic,
  Image,
  File,
  CheckCheck,
  Clock,
  Volume2,
  VolumeX,
  Move,
  RotateCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    type: 'user' | 'support' | 'bot';
  };
  content: string;
  type: 'text' | 'image' | 'file' | 'voice';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string;
}

interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  type: 'user' | 'support' | 'bot' | 'supplier' | 'merchant' | 'shipping';
  lastMessage?: string;
  lastSeen?: Date;
  unreadCount: number;
  isOnline: boolean;
  status: string;
}

interface ChatSystemProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  initialContact?: ChatContact;
  userType?: 'merchant' | 'supplier' | 'driver';
  onNotificationChange?: (hasNew: boolean, count: number) => void;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ 
  onToggle, 
  onClose,
  initialContact,
  userType = 'merchant',
  onNotificationChange 
}) => {
  const { user } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeContact, setActiveContact] = useState<ChatContact | null>(initialContact || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContacts, setShowContacts] = useState(!initialContact);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 360, height: 480 });
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Sample contacts
  const [contacts] = useState<ChatContact[]>([
    {
      id: '1',
      name: 'دعم العملاء',
      type: 'support',
      lastMessage: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
      lastSeen: new Date(),
      unreadCount: 0,
      isOnline: true,
      status: 'متاح دائماً للمساعدة'
    },
    {
      id: '2',
      name: 'المساعد الذكي',
      type: 'bot',
      lastMessage: 'يمكنني مساعدتك في إيجاد المنتجات المناسبة',
      lastSeen: new Date(),
      unreadCount: 2,
      isOnline: true,
      status: 'مساعد ذكي متطور'
    },
    {
      id: '3',
      name: 'شركة النقل السريع',
      type: 'shipping',
      lastMessage: 'طلبك في الطريق وسيصل خلال ساعة',
      lastSeen: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 1,
      isOnline: true,
      status: 'شركة شحن موثوقة'
    },
    {
      id: '4',
      name: 'مورد الأغذية الطازجة',
      type: 'supplier',
      lastMessage: 'لدينا عروض جديدة على الخضار الطازجة',
      lastSeen: new Date(Date.now() - 15 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
      status: 'مورد معتمد'
    }
  ]);

  // Sample messages for active contact
  useEffect(() => {
    if (activeContact) {
      const sampleMessages: Message[] = [
        {
          id: '1',
          sender: {
            id: activeContact.id,
            name: activeContact.name,
            type: activeContact.type as any
          },
          content: activeContact.lastMessage || 'مرحباً!',
          type: 'text',
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          status: 'read'
        },
        {
          id: '2',
          sender: {
            id: user?.id || 'me',
            name: user?.name || 'أنت',
            type: 'user'
          },
          content: 'شكراً لك، أحتاج لمساعدة في طلب جديد',
          type: 'text',
          timestamp: new Date(Date.now() - 8 * 60 * 1000),
          status: 'read'
        },
        {
          id: '3',
          sender: {
            id: activeContact.id,
            name: activeContact.name,
            type: activeContact.type as any
          },
          content: 'بالطبع! سأساعدك في إنجاز طلبك بأفضل شكل ممكن',
          type: 'text',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          status: 'read'
        }
      ];
      setMessages(sampleMessages);
    }
  }, [activeContact, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add resize event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && chatRef.current) {
        const rect = chatRef.current.getBoundingClientRect();
        const newWidth = Math.max(300, Math.min(800, e.clientX - rect.left));
        const newHeight = Math.max(400, Math.min(700, e.clientY - rect.top));
        
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };





  // Reset position and size
  const resetPositionAndSize = useCallback(() => {
    const defaultPosition = { x: 0, y: 0 };
    const defaultSize = { width: 360, height: 480 };
    
    setPosition(defaultPosition);
    setSize(defaultSize);
    
    localStorage.setItem('chatPosition', JSON.stringify(defaultPosition));
    localStorage.setItem('chatSize', JSON.stringify(defaultSize));
  }, []);

  // Save position and size to localStorage
  useEffect(() => {
    localStorage.setItem('chatPosition', JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    localStorage.setItem('chatSize', JSON.stringify(size));
  }, [size]);

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'support': return '🎧';
      case 'bot': return '🤖';
      case 'supplier': return '🏭';
      case 'merchant': return '🏪';
      case 'shipping': return '🚚';
      default: return '👤';
    }
  };

  const getContactColor = (type: string) => {
    switch (type) {
      case 'support': return 'from-blue-500 to-cyan-500';
      case 'bot': return 'from-purple-500 to-pink-500';
      case 'supplier': return 'from-green-500 to-emerald-500';
      case 'merchant': return 'from-orange-500 to-yellow-500';
      case 'shipping': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeContact) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: {
        id: user?.id || 'me',
        name: user?.name || 'أنت',
        type: 'user'
      },
      content: newMessage,
      type: 'text',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message sending
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 1000);

    // Simulate response for bots and support
    if (activeContact.type === 'bot' || activeContact.type === 'support') {
      setTimeout(() => {
        const responses = [
          'شكراً لتواصلك معنا! سأساعدك في حل مشكلتك',
          'يمكنني مساعدتك في إيجاد أفضل الحلول المناسبة لك',
          'هل تحتاج لمزيد من المساعدة؟',
          'ممتاز! هل هناك أي شيء آخر أستطيع مساعدتك فيه؟'
        ];
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: {
            id: activeContact.id,
            name: activeContact.name,
            type: activeContact.type as any
          },
          content: responses[Math.floor(Math.random() * responses.length)],
          type: 'text',
          timestamp: new Date(),
          status: 'sent'
        };

        setMessages(prev => [...prev, botMessage]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'متاح الآن';
    if (minutes < 60) return `آخر ظهور منذ ${minutes} دقيقة`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `آخر ظهور منذ ${hours} ساعة`;
    
    const days = Math.floor(hours / 24);
    return `آخر ظهور منذ ${days} يوم`;
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        ref={chatRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: position.x,
          y: position.y
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.95,
          transition: { duration: 0.2 }
        }}
        drag={!isResizing && !isMinimized}
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={{
          left: -window.innerWidth + 100,
          right: window.innerWidth - 500,
          top: -window.innerHeight + 100,
          bottom: 100
        }}
        onDrag={(_, info) => {
          if (!isResizing) {
            setPosition({ 
              x: info.offset.x, 
              y: info.offset.y 
            });
          }
        }}
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden select-none"
        style={{ 
          width: isMinimized ? 280 : size.width,
          height: isMinimized ? 56 : size.height,
          minWidth: 280,
          minHeight: isMinimized ? 56 : 400
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30
        }}
      >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Drag Handle */}
            <div
              className="cursor-move p-2 hover:bg-white/20 rounded transition-colors select-none flex items-center gap-2"
              title="اسحب لنقل النافذة"
            >
              <Move className="w-4 h-4" />
              <span className="text-xs">سحب</span>
            </div>
            
            {activeContact ? (
              <>
                <button
                  onClick={() => setShowContacts(true)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  title="العودة للمحادثات"
                >
                  ←
                </button>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getContactColor(activeContact.type)} flex items-center justify-center text-sm shadow-lg`}>
                    {getContactIcon(activeContact.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{activeContact.name}</h3>
                    <p className="text-xs text-blue-100">
                      {activeContact.isOnline ? 'متاح الآن' : formatLastSeen(activeContact.lastSeen!)}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <h3 className="font-semibold text-sm">المحادثات</h3>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {activeContact && (
              <>
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors" title="مكالمة هاتفية">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors" title="مكالمة فيديو">
                  <Video className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title={soundEnabled ? "إيقاف الصوت" : "تشغيل الصوت"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={resetPositionAndSize}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="إعادة تعيين الحجم والموضع"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title={isMinimized ? "تكبير النافذة" : "تصغير النافذة"}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose || onToggle}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="إغلاق المحادثة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-1 flex flex-col"
          >
            {showContacts || !activeContact ? (
              /* Contacts List */
              <div className="flex-1 flex flex-col">
                {/* Search */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="البحث في المحادثات..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Contacts */}
                <div className="flex-1 overflow-y-auto">
                  {filteredContacts.map((contact) => (
                    <motion.button
                      key={contact.id}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      onClick={() => {
                        setActiveContact(contact);
                        setShowContacts(false);
                      }}
                      className="w-full p-4 flex items-center gap-3 border-b border-gray-100 hover:bg-gray-50 transition-colors text-right"
                    >
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getContactColor(contact.type)} flex items-center justify-center text-lg shadow-lg`}>
                          {getContactIcon(contact.type)}
                        </div>
                        {contact.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                        {contact.unreadCount > 0 && (
                          <div className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {contact.unreadCount}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 text-right">
                        <h4 className="font-semibold text-gray-800 text-sm">{contact.name}</h4>
                        <p className="text-gray-500 text-xs truncate">
                          {contact.lastMessage}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {contact.lastSeen ? formatLastSeen(contact.lastSeen) : ''}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              /* Chat Interface */
              <div className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50" style={{ maxHeight: '320px' }}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender.id === (user?.id || 'me') ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender.id === (user?.id || 'me')
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 ${
                          message.sender.id === (user?.id || 'me') ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span className="text-xs">{formatTime(message.timestamp)}</span>
                          {message.sender.id === (user?.id || 'me') && (
                            <div className="flex">
                              {message.status === 'read' && <CheckCheck className="w-3 h-3" />}
                              {message.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                              {message.status === 'sent' && <CheckCheck className="w-3 h-3" />}
                              {message.status === 'sending' && <Clock className="w-3 h-3" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-200">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-gray-200 bg-white">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      accept="image/*,application/pdf"
                      title="اختيار ملفات للإرفاق"
                    />
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="إرفاق ملف"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="اكتب رسالتك..."
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="absolute left-2 top-2 text-gray-500 hover:text-blue-600 transition-colors"
                        title="إضافة رموز تعبيرية"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                    </div>

                    {newMessage.trim() ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                      >
                        <Send className="w-5 h-5" />
                      </motion.button>
                    ) : (
                      <button
                        onClick={() => setIsRecording(!isRecording)}
                        className={`p-3 rounded-xl transition-colors shadow-lg ${
                          isRecording 
                            ? 'bg-red-600 text-white animate-pulse' 
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Quick Replies */}
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {['شكراً', 'متفق', 'سأتواصل لاحقاً', 'ممتاز'].map((reply) => (
                      <button
                        key={reply}
                        onClick={() => setNewMessage(reply)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-blue-100 hover:text-blue-700 transition-colors whitespace-nowrap"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resize Handle */}
      {!isMinimized && (
        <div
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize bg-gradient-to-br from-blue-500 to-purple-600 opacity-40 hover:opacity-80 transition-opacity rounded-tl-lg flex items-center justify-center select-none z-10"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsResizing(true);
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsResizing(false);
          }}
          title="تغيير حجم النافذة - اسحب للتغيير"
        >
          <div className="w-3 h-3 border-r-2 border-b-2 border-white opacity-90"></div>
        </div>
      )}
      </motion.div>
    </div>
  );
};

export default ChatSystem;