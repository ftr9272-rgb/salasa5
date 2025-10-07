import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Move, RotateCw, Settings } from 'lucide-react';
// Chat handled globally via header + ChatController

const DraggableChatTest: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(7);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-xl">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            نافذة المحادثة القابلة للنقل
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            تجربة نظام المحادثة المتطور مع إمكانية السحب والإفلات وتغيير الحجم بحرية كاملة
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Drag Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Move className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">سحب وإفلات</h3>
            <p className="text-gray-600">
              اسحب النافذة من المقبض في أعلى اليسار لنقلها إلى أي مكان على الشاشة
            </p>
          </motion.div>

          {/* Resize Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <RotateCw className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">تغيير الحجم</h3>
            <p className="text-gray-600">
              استخدم المقبض في الزاوية السفلية اليمنى لتغيير حجم النافذة حسب احتياجك
            </p>
          </motion.div>

          {/* Settings Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">إعادة التعيين</h3>
            <p className="text-gray-600">
              استخدم زر إعادة التعيين في شريط الأدوات لاستعادة الحجم والموضع الافتراضي
            </p>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-8 shadow-lg mb-8 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            كيفية الاستخدام
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 السحب والنقل</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>انقر على رمز السحب (⟷) في أعلى يسار النافذة</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>اسحب النافذة إلى الموضع المرغوب</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>اتركها في المكان الجديد</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📏 تغيير الحجم</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>انقر على المقبض في الزاوية السفلية اليمنى</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>اسحب لتكبير أو تصغير النافذة</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>الحد الأدنى: 300×400 بكسل | الحد الأقصى: 800×700 بكسل</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            لوحة التحكم
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Open Chat Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsChatOpen(true)}
              disabled={isChatOpen}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${
                isChatOpen
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-xl'
              }`}
            >
              {isChatOpen ? '✅ النافذة مفتوحة' : '🚀 فتح نافذة المحادثة'}
            </motion.button>

            {/* Notification Settings */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasNotifications}
                  onChange={(e) => setHasNotifications(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">الإشعارات</span>
              </label>
              
              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-medium">العدد:</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={notificationCount}
                  onChange={(e) => setNotificationCount(Number(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-center"
                />
              </div>
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsChatOpen(false)}
              disabled={!isChatOpen}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${
                !isChatOpen
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-xl'
              }`}
            >
              {!isChatOpen ? '❌ النافذة مغلقة' : '🔒 إغلاق النافذة'}
            </motion.button>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="inline-block bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-medium">
              💡 <strong>نصيحة:</strong> يمكنك الضغط على زر إعادة التعيين (⟲) في شريط الأدوات لاستعادة الحجم والموضع الافتراضي في أي وقت
            </p>
          </div>
        </motion.div>
      </div>

      {/* Chat is available in the header — floating instance removed */}
    </div>
  );
};

export default DraggableChatTest;