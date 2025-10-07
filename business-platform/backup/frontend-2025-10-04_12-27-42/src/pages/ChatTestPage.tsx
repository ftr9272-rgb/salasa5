import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, User, Truck, Store } from 'lucide-react';
import ChatSystem from '../components/ChatSystem';
// Chat is handled globally via header + ChatController

const ChatTestPage: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userType, setUserType] = useState<'merchant' | 'supplier' | 'driver'>('merchant');
  const [hasNotifications, setHasNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(5);

  const userTypes = [
    { 
      id: 'merchant' as const, 
      name: 'تاجر', 
      icon: <Store className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600',
      description: 'تجربة لوحة تحكم التاجر'
    },
    { 
      id: 'supplier' as const, 
      name: 'مورد', 
      icon: <User className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      description: 'تجربة لوحة تحكم المورد'
    },
    { 
      id: 'driver' as const, 
      name: 'سائق', 
      icon: <Truck className="w-5 h-5" />,
      color: 'from-green-500 to-green-600',
      description: 'تجربة لوحة تحكم السائق'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            اختبار نظام المحادثة المتطور
          </h1>
          <p className="text-gray-600 text-lg">
            جرب نظام المحادثة التفاعلي مع أنواع المستخدمين المختلفة
          </p>
        </motion.div>

        {/* User Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            اختر نوع المستخدم
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userTypes.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUserType(type.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  userType === type.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center text-white mb-3 mx-auto`}>
                  {type.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Chat Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            التحكم في المحادثة
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notification Settings */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">إعدادات الإشعارات</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 space-x-reverse">
                  <input
                    type="checkbox"
                    checked={hasNotifications}
                    onChange={(e) => setHasNotifications(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">تفعيل الإشعارات</span>
                </label>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عدد الرسائل الجديدة: {notificationCount}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="99"
                    value={notificationCount}
                    onChange={(e) => setNotificationCount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Chat Actions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">إجراءات المحادثة</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsChatOpen(true)}
                  disabled={isChatOpen}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    isChatOpen
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isChatOpen ? 'المحادثة مفتوحة' : 'فتح المحادثة'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsChatOpen(false)}
                  disabled={!isChatOpen}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    !isChatOpen
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  إغلاق المحادثة
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            مميزات نظام المحادثة
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              '💬 محادثات في الوقت الفعلي',
              '📎 إرفاق الملفات والصور',
              '🎤 الرسائل الصوتية',
              '😊 الرموز التعبيرية',
              '🔍 البحث في جهات الاتصال',
              '⚡ الردود السريعة',
              '📱 تصميم متجاوب',
              '🔔 إشعارات فورية',
              '🎨 واجهة عصرية وجذابة'
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 text-center"
              >
                <span className="text-gray-800 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Chat is available in the header — floating instance removed */}
    </div>
  );
};

export default ChatTestPage;