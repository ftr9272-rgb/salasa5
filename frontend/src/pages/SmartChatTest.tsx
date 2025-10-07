import React, { useState } from 'react';
import { MessageCircle, ShoppingBag, Package, Truck, User, Sparkles, Brain, Zap } from 'lucide-react';
import SmartChatWindow from '../components/SmartChatWindow';

const SmartChatTest: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [userType, setUserType] = useState<'merchant' | 'supplier' | 'shipping' | 'customer'>('merchant');

  const userTypes = [
    {
      id: 'merchant' as const,
      name: 'التاجر',
      icon: ShoppingBag,
      color: 'from-blue-600 to-indigo-600',
      description: 'إدارة المتجر والمبيعات والتحليلات'
    },
    {
      id: 'supplier' as const,
      name: 'المورد',
      icon: Package,
      color: 'from-green-600 to-emerald-600',
      description: 'إدارة المخزون والطلبات والشحن'
    },
    {
      id: 'shipping' as const,
      name: 'الشحن',
      icon: Truck,
      color: 'from-orange-600 to-red-600',
      description: 'إدارة التسليمات والمسارات والتتبع'
    },
    {
      id: 'customer' as const,
      name: 'العميل',
      icon: User,
      color: 'from-purple-600 to-pink-600',
      description: 'التسوق وتتبع الطلبات والدعم'
    }
  ];

  const currentUserType = userTypes.find(type => type.id === userType)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900">
                نظام المحادثة الذكي
              </h1>
              <p className="text-lg text-gray-600">
                مساعد ذكي مخصص لكل نوع مستخدم
              </p>
            </div>
          </div>
        </div>

        {/* User Type Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            اختر نوع المستخدم لاختبار المساعد الذكي
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {userTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setUserType(type.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    userType === type.id
                      ? `bg-gradient-to-r ${type.color} text-white border-transparent shadow-lg scale-105`
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <Icon size={32} />
                    <h3 className="font-semibold">{type.name}</h3>
                    <p className={`text-sm ${
                      userType === type.id ? 'text-white/90' : 'text-gray-600'
                    }`}>
                      {type.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected User Type Info */}
          <div className={`bg-gradient-to-r ${currentUserType.color} rounded-xl p-6 text-white mb-6`}>
            <div className="flex items-center gap-4">
              <currentUserType.icon size={40} />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  مساعد {currentUserType.name} الذكي
                </h3>
                <p className="text-white/90">
                  {currentUserType.description}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={() => setShowChat(!showChat)}
              className={`bg-gradient-to-r ${currentUserType.color} text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-3 mx-auto text-lg font-semibold transform hover:scale-105`}
            >
              <MessageCircle size={24} />
              {showChat ? `إخفاء مساعد ${currentUserType.name}` : `فتح مساعد ${currentUserType.name}`}
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Smart Responses */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">ردود ذكية</h3>
            </div>
            <p className="text-gray-600 text-sm">
              ردود مخصصة حسب نوع المستخدم ونوع الاستفسار مع محتوى منطقي ومفيد
            </p>
          </div>

          {/* Category-based Chat */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800">فئات متخصصة</h3>
            </div>
            <p className="text-gray-600 text-sm">
              فئات محادثة مختلفة لكل نوع مستخدم: الطلبات، المنتجات، التحليلات، الدعم
            </p>
          </div>

          {/* Real-time Experience */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800">تجربة حية</h3>
            </div>
            <p className="text-gray-600 text-sm">
              مؤشر الكتابة، ردود متنوعة، واجهة مخصصة بألوان وأيقونات مناسبة
            </p>
          </div>
        </div>

        {/* Smart Features by User Type */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            الميزات الذكية حسب نوع المستخدم
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">التاجر 🛍️</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• تحليل المبيعات والأرباح</li>
                <li>• إدارة الطلبات والعملاء</li>
                <li>• تحسين وصف المنتجات</li>
                <li>• تنبيهات المخزون</li>
                <li>• اتجاهات السوق</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">المورد 📦</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• إدارة المخزون والتموين</li>
                <li>• تنسيق طلبات التجار</li>
                <li>• تحسين الشحن والتوصيل</li>
                <li>• تتبع الأداء والمبيعات</li>
                <li>• التواصل مع شركات النقل</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">الشحن 🚚</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• تحسين مسارات التسليم</li>
                <li>• تتبع الشحنات والسائقين</li>
                <li>• إدارة الجدولة اليومية</li>
                <li>• تحديثات حالة الطرق</li>
                <li>• تقارير الأداء</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">العميل 👤</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• البحث عن المنتجات</li>
                <li>• تتبع الطلبات</li>
                <li>• مقارنة الأسعار والتقييمات</li>
                <li>• خدمة العملاء الفورية</li>
                <li>• اقتراحات شخصية</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        {showChat && (
          <div className="fixed top-4 right-4 z-50">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${currentUserType.color} text-white shadow-lg`}>
              <currentUserType.icon size={16} />
              <span className="text-sm font-medium">
                مساعد {currentUserType.name} نشط
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Smart Chat Window */}
      {showChat && (
        <SmartChatWindow 
          userType={userType}
          userName={currentUserType.name}
          userRole={currentUserType.description.split(' ')[1]}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default SmartChatTest;