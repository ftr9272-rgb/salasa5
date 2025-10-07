import React, { useState } from 'react';
import { Bell, Zap, Brain, Target, Users, ShoppingBag, Package, Truck, User, AlertTriangle, CheckCircle, Info, MessageCircle } from 'lucide-react';
import { NotificationProvider, useNotifications } from '../components/NotificationProvider';
import { motion } from 'framer-motion';

const NotificationTestContent: React.FC<{ userType: 'merchant' | 'supplier' | 'shipping' | 'customer' }> = ({ userType }) => {
  const { addNotification, addToast, showQuickAlert } = useNotifications();

  const testNotifications = {
    merchant: [
      {
        type: 'order' as const,
        title: 'طلب جديد عاجل! 🔥',
        message: 'طلب بقيمة 850 ريال من عميل VIP يحتاج موافقة فورية',
        priority: 'urgent' as const,
        actionButton: {
          label: 'موافقة سريعة',
          action: () => showQuickAlert('success', 'تم قبول الطلب!', 'جاري تحضير الطلب للشحن')
        }
      },
      {
        type: 'warning' as const,
        title: 'تحذير مخزون! ⚠️',
        message: 'منتج "سماعات لاسلكية" نفد من المخزون تماماً',
        priority: 'high' as const
      },
      {
        type: 'payment' as const,
        title: 'دفعة استُلمت 💰',
        message: 'تم استلام 2,400 ريال من مبيعات اليوم',
        priority: 'medium' as const
      }
    ],
    supplier: [
      {
        type: 'order' as const,
        title: 'طلب ضخم من تاجر مميز! 🏪',
        message: '500 قطعة من منتجات متنوعة بقيمة 25,000 ريال',
        priority: 'urgent' as const,
        actionButton: {
          label: 'مراجعة وقبول',
          action: () => showQuickAlert('success', 'تم قبول الطلب!', 'سيتم تحضير الطلب خلال 24 ساعة')
        }
      },
      {
        type: 'shipping' as const,
        title: 'شحنة جاهزة! 📦',
        message: '25 صندوق جاهز للشحن إلى جدة والرياض',
        priority: 'high' as const
      },
      {
        type: 'info' as const,
        title: 'تقرير أسبوعي 📊',
        message: 'ارتفاع المبيعات بنسبة 30% هذا الأسبوع',
        priority: 'medium' as const
      }
    ],
    shipping: [
      {
        type: 'order' as const,
        title: 'مهمة توصيل عاجلة! 🚨',
        message: 'طلب طبي عاجل - مكافأة إضافية 150 ريال',
        priority: 'urgent' as const,
        actionButton: {
          label: 'قبول المهمة',
          action: () => showQuickAlert('success', 'تم قبول المهمة!', 'جاري تحديد أفضل مسار للوصول')
        }
      },
      {
        type: 'warning' as const,
        title: 'تحذير مروري! ⚠️',
        message: 'ازدحام شديد على طريق الملك عبدالعزيز',
        priority: 'high' as const
      },
      {
        type: 'success' as const,
        title: 'إنجاز ممتاز! 🎯',
        message: 'تم تسليم 20 طلب اليوم بنجاح - تقييم 5 نجوم',
        priority: 'medium' as const
      }
    ],
    customer: [
      {
        type: 'shipping' as const,
        title: 'طلبك وصل! 🎁',
        message: 'طلب #12345 تم تسليمه بنجاح - نتمنى أن يعجبك',
        priority: 'high' as const,
        actionButton: {
          label: 'تقييم الخدمة',
          action: () => showQuickAlert('info', 'شكراً لك!', 'تم فتح نموذج التقييم')
        }
      },
      {
        type: 'info' as const,
        title: 'عرض خاص! 🏷️',
        message: 'خصم 25% على جميع الأجهزة الإلكترونية - لمدة 48 ساعة',
        priority: 'medium' as const
      },
      {
        type: 'order' as const,
        title: 'تأكيد طلب 📋',
        message: 'تم تأكيد طلبك وسيتم الشحن خلال 24 ساعة',
        priority: 'medium' as const
      }
    ]
  };

  const testToasts = {
    merchant: [
      { type: 'success' as const, title: 'مبيعات ممتازة! 🎉', message: 'تجاوزت هدف اليوم بنسبة 120%' },
      { type: 'warning' as const, title: 'تنبيه عميل', message: 'عميل ينتظر رد على استفساره' },
      { type: 'order' as const, title: 'طلب سريع', message: 'طلب توصيل سريع خلال الساعة' }
    ],
    supplier: [
      { type: 'success' as const, title: 'شحنة وصلت! ✅', message: 'شحنة جديدة وصلت للمستودع' },
      { type: 'info' as const, title: 'طلب مراجعة', message: 'طلب من تاجر جديد يحتاج مراجعة' },
      { type: 'payment' as const, title: 'دفعة جديدة', message: 'تم استلام دفعة من تاجر الرياض' }
    ],
    shipping: [
      { type: 'success' as const, title: 'تسليم ناجح! 🎯', message: 'تم تسليم الطلب بنجاح' },
      { type: 'info' as const, title: 'مسار محدث', message: 'مسار جديد أسرع متاح الآن' },
      { type: 'shipping' as const, title: 'طلب جديد', message: '3 طلبات جديدة في منطقتك' }
    ],
    customer: [
      { type: 'success' as const, title: 'خصم مطبق! 💰', message: 'تم تطبيق كود الخصم بنجاح' },
      { type: 'shipping' as const, title: 'في الطريق إليك', message: 'طلبك خرج للتوصيل' },
      { type: 'info' as const, title: 'منتج جديد', message: 'منتج في قائمة أمنياتك متوفر الآن' }
    ]
  };

  const userTypeInfo = {
    merchant: { name: 'التاجر', icon: ShoppingBag, color: 'from-blue-600 to-indigo-600' },
    supplier: { name: 'المورد', icon: Package, color: 'from-green-600 to-emerald-600' },
    shipping: { name: 'الشحن', icon: Truck, color: 'from-orange-600 to-red-600' },
    customer: { name: 'العميل', icon: User, color: 'from-purple-600 to-pink-600' }
  };

  const currentUser = userTypeInfo[userType];
  const Icon = currentUser.icon;

  return (
    <div className="space-y-6">
      {/* معلومات المستخدم */}
      <div className={`bg-gradient-to-r ${currentUser.color} rounded-xl p-6 text-white`}>
        <div className="flex items-center gap-4">
          <Icon size={40} />
          <div>
            <h3 className="text-xl font-semibold">إشعارات {currentUser.name}</h3>
            <p className="text-white/90">اختبر الإشعارات المخصصة لهذا النوع من المستخدمين</p>
          </div>
        </div>
      </div>

      {/* أزرار اختبار الإشعارات */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <Bell size={20} />
            إشعارات القائمة
          </h4>
          {testNotifications[userType].map((notification, index) => (
            <button
              key={index}
              onClick={() => addNotification({
                ...notification,
                read: false,
                userType
              })}
              className="w-full text-left p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {notification.type === 'order' && <Package size={16} className="text-blue-600" />}
                  {notification.type === 'warning' && <AlertTriangle size={16} className="text-orange-600" />}
                  {notification.type === 'success' && <CheckCircle size={16} className="text-green-600" />}
                  {notification.type === 'info' && <Info size={16} className="text-blue-600" />}
                  {notification.type === 'payment' && <CheckCircle size={16} className="text-green-600" />}
                  {notification.type === 'shipping' && <Truck size={16} className="text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                    notification.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    notification.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    notification.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {notification.priority === 'urgent' ? 'عاجل' :
                     notification.priority === 'high' ? 'أولوية عالية' :
                     notification.priority === 'medium' ? 'أولوية متوسطة' : 'أولوية منخفضة'}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <Zap size={20} />
            إشعارات سريعة (توست)
          </h4>
          {testToasts[userType].map((toast, index) => (
            <button
              key={index}
              onClick={() => addToast({
                ...toast,
                duration: 5000
              })}
              className="w-full text-left p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap size={16} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{toast.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{toast.message}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* أزرار إضافية */}
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={() => showQuickAlert('success', 'اختبار ناجح! ✅', 'جميع الأنظمة تعمل بشكل مثالي')}
          className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <CheckCircle className="mx-auto mb-2" size={24} />
          <p className="text-sm font-medium">اختبار النجاح</p>
        </button>
        
        <button
          onClick={() => showQuickAlert('warning', 'تحذير! ⚠️', 'هناك شيء يحتاج انتباهك')}
          className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <AlertTriangle className="mx-auto mb-2" size={24} />
          <p className="text-sm font-medium">اختبار التحذير</p>
        </button>
        
        <button
          onClick={() => showQuickAlert('info', 'معلومة مفيدة! 💡', 'هذه معلومة قد تهمك')}
          className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Info className="mx-auto mb-2" size={24} />
          <p className="text-sm font-medium">اختبار المعلومات</p>
        </button>
      </div>
    </div>
  );
};

const NotificationTestPage: React.FC = () => {
  const [selectedUserType, setSelectedUserType] = useState<'merchant' | 'supplier' | 'shipping' | 'customer'>('merchant');

  const userTypes = [
    { id: 'merchant' as const, name: 'التاجر', icon: ShoppingBag, color: 'from-blue-600 to-indigo-600' },
    { id: 'supplier' as const, name: 'المورد', icon: Package, color: 'from-green-600 to-emerald-600' },
    { id: 'shipping' as const, name: 'الشحن', icon: Truck, color: 'from-orange-600 to-red-600' },
    { id: 'customer' as const, name: 'العميل', icon: User, color: 'from-purple-600 to-pink-600' }
  ];

  return (
    <NotificationProvider userType={selectedUserType} userName={`${userTypes.find(u => u.id === selectedUserType)?.name} التجريبي`}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-gray-900">
                  اختبار نظام الإشعارات الذكي
                </h1>
                <p className="text-lg text-gray-600">
                  إشعارات مخصصة ومنطقية لكل نوع مستخدم
                </p>
              </div>
            </div>
          </div>

          {/* User Type Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              اختر نوع المستخدم لاختبار إشعاراته
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {userTypes.map((userType) => {
                const Icon = userType.icon;
                return (
                  <button
                    key={userType.id}
                    onClick={() => setSelectedUserType(userType.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedUserType === userType.id
                        ? `bg-gradient-to-r ${userType.color} text-white border-transparent shadow-lg scale-105`
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <Icon size={32} className="mx-auto mb-2" />
                    <p className="font-semibold">{userType.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Content */}
          <motion.div
            key={selectedUserType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <NotificationTestContent userType={selectedUserType} />
          </motion.div>

          {/* Features Info */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-blue-600" />
                <h3 className="font-semibold">إشعارات مستهدفة</h3>
              </div>
              <p className="text-gray-600 text-sm">
                إشعارات مخصصة حسب نوع المستخدم ونشاطه مع محتوى منطقي ومفيد
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-8 h-8 text-green-600" />
                <h3 className="font-semibold">ذكاء اصطناعي</h3>
              </div>
              <p className="text-gray-600 text-sm">
                نظام ذكي يولد إشعارات تلقائية بناء على الأنشطة والأولويات
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-purple-600" />
                <h3 className="font-semibold">تجربة شخصية</h3>
              </div>
              <p className="text-gray-600 text-sm">
                واجهات وألوان مخصصة لكل نوع مستخدم مع تفاعلات سهلة وبديهية
              </p>
            </div>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default NotificationTestPage;