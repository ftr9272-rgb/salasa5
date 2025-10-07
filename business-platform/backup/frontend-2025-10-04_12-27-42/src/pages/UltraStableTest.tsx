import React, { useState } from 'react';
import { MessageCircle, Bell } from 'lucide-react';
import StableChatWindow from '../components/StableChatWindow';

const UltraStableTest: React.FC = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            اختبار نافذة المحادثة الفائقة الاستقرار
          </h1>
          <p className="text-lg text-gray-600">
            نافذة محادثة بتقنية جديدة مضادة للاختفاء
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                الميزات المتاحة:
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">نافذة فائقة الاستقرار</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">سحب وإفلات بدون اختفاء</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">تصغير وتكبير آمن</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">محادثات تفاعلية</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                تعليمات الاختبار:
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-start gap-2">
                  <span className="font-semibold text-blue-600">1.</span>
                  اضغط زر "فتح المحادثة" أدناه
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-semibold text-blue-600">2.</span>
                  جرب سحب النافذة من الشريط العلوي الأزرق
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-semibold text-blue-600">3.</span>
                  اختبر التصغير والتكبير والإغلاق
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-semibold text-blue-600">4.</span>
                  أرسل رسائل واختبر الاستجابة
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowChat(!showChat)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <MessageCircle size={24} />
              {showChat ? 'إخفاء المحادثة' : 'فتح المحادثة'}
            </button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            showChat 
              ? 'bg-green-100 text-green-800 border-2 border-green-300' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            <Bell size={16} />
            <span className="text-sm font-medium">
              {showChat ? '✅ المحادثة نشطة ومستقرة' : '⚪ المحادثة متوقفة'}
            </span>
          </div>
        </div>

        {/* Stability Info */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            🛡️ تقنية مكافحة الاختفاء المطورة
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="mb-2">✨ <strong>تقنية الثبات:</strong> نظام تموضع محسن</p>
              <p className="mb-2">🔒 <strong>حماية السحب:</strong> منع الانزلاق خارج الشاشة</p>
            </div>
            <div>
              <p className="mb-2">⚡ <strong>استجابة فورية:</strong> بدون تأخير في التحميل</p>
              <p className="mb-2">🎯 <strong>دقة التموضع:</strong> حفظ المكان تلقائياً</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra Stable Chat Window */}
      {showChat && (
        <StableChatWindow 
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default UltraStableTest;