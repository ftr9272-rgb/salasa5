import { motion } from 'framer-motion';
import { useState } from 'react';
import { X, Search, Plus, Users, MessageSquare, Truck, ShoppingBag } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/localStorage';
import type { Participant, Conversation } from '../contexts/ChatContext';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated?: () => void;
}

interface PotentialContact {
  id: string;
  name: string;
  type: 'merchant' | 'supplier' | 'shipping_company';
  rating?: number;
  verified?: boolean;
  lastActive?: string;
}

function NewChatModal({ isOpen, onClose, onChatCreated }: NewChatModalProps) {
  const { user } = useAuth();
  const { createConversation, setActiveConversation } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<PotentialContact[]>([]);
  const [chatTitle, setChatTitle] = useState('');
  const [chatType, setChatType] = useState<Conversation['type']>('general');
  const [activeTab, setActiveTab] = useState<'contacts' | 'marketplace'>('contacts');

  if (!isOpen) return null;

  // جلب جهات الاتصال المحتملة من السوق المشترك
  const getPotentialContacts = (): PotentialContact[] => {
    const marketItems = storage.getMarketItems();
    const contacts: PotentialContact[] = [];
    const addedIds = new Set<string>();

    marketItems.forEach(item => {
      if (item.provider.name && !addedIds.has(item.provider.name) && item.provider.type !== user?.role) {
        addedIds.add(item.provider.name);
        contacts.push({
          id: `provider_${item.provider.name}`,
          name: item.provider.name,
          type: item.provider.type,
          rating: item.provider.rating,
          verified: item.provider.verified,
          lastActive: new Date().toISOString()
        });
      }
    });

    // إضافة بعض جهات الاتصال التجريبية
  const sampleContacts = [
      {
        id: 'contact_1',
        name: 'شركة التوريد المتقدم',
        type: 'supplier',
        rating: 4.8,
        verified: true,
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'contact_2', 
        name: 'معرض الأجهزة الذكية',
        type: 'merchant',
        rating: 4.6,
        verified: true,
        lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'contact_3',
        name: 'الشحن السريع المحدود',
        type: 'shipping_company',
        rating: 4.9,
        verified: true,
        lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
  ].filter(contact => contact.type !== user?.role) as PotentialContact[];

    return [...contacts, ...sampleContacts].filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const potentialContacts = getPotentialContacts();

  const getUserTypeIcon = (type: 'merchant' | 'supplier' | 'shipping_company') => {
    switch (type) {
      case 'merchant': return '🏪';
      case 'supplier': return '🏭';
      case 'shipping_company': return '🚛';
      default: return '👤';
    }
  };

  const getUserTypeLabel = (type: 'merchant' | 'supplier' | 'shipping_company') => {
    switch (type) {
      case 'merchant': return 'تاجر';
      case 'supplier': return 'مورد';
      case 'shipping_company': return 'شركة شحن';
      default: return 'مستخدم';
    }
  };

  const getChatTypeLabel = (type: Conversation['type']) => {
    switch (type) {
      case 'business_inquiry': return 'استفسار تجاري';
      case 'order_discussion': return 'مناقشة طلب';
      case 'shipping_coordination': return 'تنسيق شحن';
      case 'general': return 'عام';
      default: return 'عام';
    }
  };

  const toggleContactSelection = (contact: PotentialContact) => {
    setSelectedContacts(prev => {
      const isSelected = prev.find(c => c.id === contact.id);
      if (isSelected) {
        return prev.filter(c => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleCreateChat = () => {
    if (selectedContacts.length === 0) return;

    console.log('إنشاء محادثة جديدة مع:', selectedContacts);

    const participants: Participant[] = selectedContacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      type: contact.type,
      isOnline: Math.random() > 0.3, // محاكاة الحالة اون لاين
      lastSeen: contact.lastActive
    }));

    const title = chatTitle || 
                 (selectedContacts.length === 1 ? selectedContacts[0].name : 'محادثة جماعية');

    console.log('إنشاء المحادثة بالعنوان:', title);
    const newConversation = createConversation(participants, title, chatType);
    console.log('المحادثة المنشأة:', newConversation);
    setActiveConversation(newConversation);
    
    // إعادة تعيين النموذج
    setSelectedContacts([]);
    setChatTitle('');
    setChatType('general');
    setSearchQuery('');
    
    // استدعاء callback إذا كان موجوداً
    if (onChatCreated) {
      onChatCreated();
    } else {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* رأس المودال */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">بدء محادثة جديدة</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* محتوى المودال */}
        <div className="p-6">
          {/* تبويبات */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'contacts'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              جهات الاتصال
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'marketplace'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              من السوق
            </button>
          </div>

          {activeTab === 'contacts' && (
            <div className="space-y-4">
              {/* شريط البحث */}
              <div className="relative">
                <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث عن جهات اتصال..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* قائمة جهات الاتصال */}
              <div className="max-h-60 overflow-y-auto space-y-2">
                {potentialContacts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>لا توجد جهات اتصال متاحة</p>
                  </div>
                ) : (
                  potentialContacts.map(contact => {
                    const isSelected = selectedContacts.find(c => c.id === contact.id);
                    return (
                      <div
                        key={contact.id}
                        onClick={() => toggleContactSelection(contact)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-primary bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white">
                            {getUserTypeIcon(contact.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{contact.name}</h4>
                              {contact.verified && (
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span>{getUserTypeLabel(contact.type)}</span>
                              {contact.rating && (
                                <span className="flex items-center gap-1">
                                  ⭐ {contact.rating}
                                </span>
                              )}
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'marketplace' && (
            <div className="text-center py-12 text-gray-500">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">قريباً</h3>
              <p>ميزة بدء المحادثات من السوق المشترك قادمة قريباً</p>
            </div>
          )}

          {/* إعدادات المحادثة */}
          {selectedContacts.length > 0 && (
            <div className="mt-6 space-y-4 border-t border-gray-200 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان المحادثة (اختياري)
                </label>
                <input
                  type="text"
                  value={chatTitle}
                  onChange={(e) => setChatTitle(e.target.value)}
                  placeholder={selectedContacts.length === 1 ? selectedContacts[0].name : 'محادثة جماعية'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع المحادثة
                </label>
                <select
                  value={chatType}
                  onChange={(e) => setChatType(e.target.value as Conversation['type'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="general">عام</option>
                  <option value="business_inquiry">استفسار تجاري</option>
                  <option value="order_discussion">مناقشة طلب</option>
                  <option value="shipping_coordination">تنسيق شحن</option>
                </select>
              </div>

              {/* المشاركون المختارون */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المشاركون ({selectedContacts.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedContacts.map(contact => (
                    <div
                      key={contact.id}
                      className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{getUserTypeIcon(contact.type)}</span>
                      <span>{contact.name}</span>
                      <button
                        onClick={() => toggleContactSelection(contact)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* أزرار التحكم */}
        <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleCreateChat}
            disabled={selectedContacts.length === 0}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            بدء المحادثة
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default NewChatModal;