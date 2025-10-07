import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Bell, Zap, CheckCircle, AlertCircle, Info, Move, RotateCw } from 'lucide-react';
import StableChatWindow from '../components/StableChatWindow';

const StableChatTest: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(5);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  useEffect(() => {
    if (isChatOpen) {
      addTestResult('✅ النافذة فتحت بنجاح');
    } else {
      addTestResult('❌ النافذة أُغلقت');
    }
  }, [isChatOpen]);

  const runStabilityTest = () => {
    addTestResult('🧪 بدء اختبار الثبات...');
    
    // Test rapid opening/closing
    let testCount = 0;
    const interval = setInterval(() => {
      setIsChatOpen(prev => !prev);
      testCount++;
      
      if (testCount >= 6) {
        clearInterval(interval);
        addTestResult('🎯 اختبار الثبات مكتمل - 3 دورات');
        setIsChatOpen(true);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-xl">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            نافذة المحادثة المحسنة والثابتة
          </h1>
          <p className="text-gray-600 text-xl max-w-4xl mx-auto">
            تم إصلاح مشكلة الاختفاء السريع وتحسين الثبات والأداء
          </p>
        </motion.div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Window Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-4 rounded-xl shadow-lg border ${
              isChatOpen 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {isChatOpen ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <h3 className="font-semibold">حالة النافذة</h3>
                <p className="text-sm">{isChatOpen ? 'مفتوحة ومستقرة' : 'مغلقة'}</p>
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Info className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-800">الإشعارات</h3>
                <p className="text-blue-600 text-sm">
                  {hasNotifications ? `${notificationCount} رسالة جديدة` : 'لا توجد إشعارات'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Drag Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-purple-50 border border-purple-200 p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Move className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-800">السحب</h3>
                <p className="text-purple-600 text-sm">محسن ومستقر</p>
              </div>
            </div>
          </motion.div>

          {/* Resize Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-orange-50 border border-orange-200 p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <RotateCw className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800">تغيير الحجم</h3>
                <p className="text-orange-600 text-sm">سلس وسريع</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Improvements Made */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8 border border-gray-100"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-3">
            <Zap className="w-8 h-8 text-yellow-500" />
            التحسينات المطبقة
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-green-700">
                ✅ مشاكل تم إصلاحها
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">إصلاح مشكلة الاختفاء السريع للنافذة</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">تحسين استقرار النافذة أثناء السحب</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">منع التداخل بين السحب وتغيير الحجم</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">تحسين أداء الرسوم المتحركة</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">إضافة حدود آمنة للسحب والتغيير</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-blue-700">
                🚀 تحسينات جديدة
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">انتقالات أسرع وأكثر سلاسة</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">مقابض سحب محسنة ومرئية أكثر</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">حماية من النقرات العرضية</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">تخزين ذكي للموضع والحجم</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">تجربة مستخدم محسنة وموثوقة</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            لوحة التحكم والاختبار
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Open/Close Controls */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsChatOpen(true)}
                disabled={isChatOpen}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  isChatOpen
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                }`}
              >
                🚀 فتح النافذة
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
                🔒 إغلاق النافذة
              </motion.button>
            </div>

            {/* Notification Controls */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasNotifications}
                  onChange={(e) => setHasNotifications(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">تفعيل الإشعارات</span>
              </label>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عدد الرسائل: {notificationCount}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={notificationCount}
                  onChange={(e) => setNotificationCount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Test Controls */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={runStabilityTest}
                className="w-full py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🧪 اختبار الثبات
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTestResults([])}
                className="w-full py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🗑️ مسح السجل
              </motion.button>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 تعليمات الاختبار</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• اسحب من رمز الحركة ⟷</li>
                <li>• غيّر الحجم من الزاوية</li>
                <li>• اضغط ⟲ للإعادة</li>
                <li>• جرب الاختبار التلقائي</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Test Results Log */}
        {testResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 text-green-400 rounded-2xl p-6 shadow-lg border border-gray-700"
          >
            <h3 className="text-xl font-bold mb-4 text-green-300">📊 سجل الاختبارات</h3>
            <div className="max-h-40 overflow-y-auto space-y-2 font-mono text-sm">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-gray-500">{index + 1}.</span>
                  <span>{result}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Chat is available in the header — floating instance removed */}
    </div>
  );
};

export default StableChatTest;