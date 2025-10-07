import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Play, Square } from 'lucide-react';
import SimpleChatWindow from '../components/SimpleChatWindow';

const SimpleChatTest: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [count, setCount] = useState(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            اختبار نافذة المحادثة البسيط
          </h1>
          <p className="text-gray-600 text-lg">
            اختبار سريع للتأكد من عمل النافذة بشكل صحيح
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-8 shadow-lg mb-8 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">حالة النافذة</h2>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              showChat 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {showChat ? '🟢 مفتوحة' : '🔴 مغلقة'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Controls */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">التحكم في النافذة</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowChat(true)}
                  disabled={showChat}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    showChat
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  فتح النافذة
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowChat(false)}
                  disabled={!showChat}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    !showChat
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg'
                  }`}
                >
                  <Square className="w-4 h-4" />
                  إغلاق النافذة
                </motion.button>
              </div>
            </div>

            {/* Settings */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">إعدادات الإشعارات</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">تفعيل الإشعارات</span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد الرسائل الجديدة: {count}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 تعليمات الاستخدام</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🎯 الاستخدام العادي</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• اضغط "فتح النافذة" لعرض المحادثة</li>
                <li>• استخدم الزر العائم أسفل اليسار</li>
                <li>• جرب تغيير إعدادات الإشعارات</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🚀 المميزات المتقدمة</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• اسحب النافذة لنقلها</li>
                <li>• غير حجم النافذة من الزاوية</li>
                <li>• استخدم أزرار التحكم في الشريط</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chat is available in the header — floating instance removed */}
    </div>
  );
};

export default SimpleChatTest;