import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, AlertTriangle, Info, CheckCircle, Box, Truck, Store, DollarSign, Clock, MapPin, TrendingUp, Users, Star, MessageSquare, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'order' | 'payment' | 'shipping' | 'message';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  userType: 'merchant' | 'supplier' | 'shipping' | 'customer' | 'all';
  data?: any;
  actionButton?: {
    label: string;
    action: () => void;
  };
}

interface NotificationSystemProps {
  userType: 'merchant' | 'supplier' | 'shipping' | 'customer';
  userName?: string;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ userType, userName = 'المستخدم' }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
  const audioRef = useRef<HTMLAudioElement>(null);

  // توليد إشعارات ذكية حسب نوع المستخدم
  const generateSmartNotifications = (): Notification[] => {
    const baseNotifications: { [key: string]: Notification[] } = {
      merchant: [
        {
          id: '1',
          type: 'order',
          title: 'طلب جديد وصل! 🎉',
          message: 'طلب بقيمة 450 ريال من عميل مميز - يحتاج تأكيد فوري',
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          read: false,
          priority: 'high',
          userType: 'merchant',
          actionButton: {
            label: 'عرض الطلب',
            action: () => console.log('فتح تفاصيل الطلب')
          }
        },
        {
          id: '2',
          type: 'warning',
          title: 'تنبيه مخزون ⚠️',
          message: '3 منتجات أوشكت على النفاد - يُنصح بإعادة الطلب',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          read: false,
          priority: 'medium',
          userType: 'merchant'
        },
        {
          id: '3',
          type: 'success',
          title: 'ارتفاع في المبيعات! 📈',
          message: 'مبيعات اليوم ارتفعت بنسبة 25% مقارنة بالأمس',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: true,
          priority: 'medium',
          userType: 'merchant'
        },
        {
          id: '4',
          type: 'payment',
          title: 'دفعة مستلمة 💰',
          message: 'تم استلام دفعة 1,200 ريال من 3 طلبات',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          read: false,
          priority: 'medium',
          userType: 'merchant'
        },
        {
          id: '5',
          type: 'info',
          title: 'تقرير أسبوعي جاهز 📊',
          message: 'تقرير الأداء الأسبوعي متاح للمراجعة',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true,
          priority: 'low',
          userType: 'merchant'
        }
      ],
      supplier: [
        {
          id: '6',
          type: 'order',
          title: 'طلب كبير من تاجر مميز! 🏪',
          message: 'طلب 500 قطعة من منتجات متنوعة بقيمة 15,000 ريال',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          read: false,
          priority: 'urgent',
          userType: 'supplier',
          actionButton: {
            label: 'مراجعة الطلب',
            action: () => console.log('فتح طلب التاجر')
          }
        },
        {
          id: '7',
          type: 'shipping',
          title: 'شحنة جاهزة للشحن 📦',
          message: '12 صندوق جاهز للشحن إلى الرياض - يحتاج تنسيق',
          timestamp: new Date(Date.now() - 20 * 60 * 1000),
          read: false,
          priority: 'high',
          userType: 'supplier'
        },
        {
          id: '8',
          type: 'warning',
          title: 'نقص في المخزون ⚠️',
          message: '5 منتجات رئيسية تحتاج إعادة تموين عاجل',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          read: false,
          priority: 'high',
          userType: 'supplier'
        },
        {
          id: '9',
          type: 'success',
          title: 'تم تأكيد الدفع ✅',
          message: 'تم استلام دفعة 8,500 ريال من 4 تجار',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true,
          priority: 'medium',
          userType: 'supplier'
        }
      ],
      shipping: [
        {
          id: '10',
          type: 'warning',
          title: 'طلب توصيل عاجل! 🚨',
          message: 'طلب VIP يحتاج توصيل فوري - مكافأة إضافية 100 ريال',
          timestamp: new Date(Date.now() - 1 * 60 * 1000),
          read: false,
          priority: 'urgent',
          userType: 'shipping',
          actionButton: {
            label: 'قبول المهمة',
            action: () => console.log('قبول مهمة التوصيل العاجل')
          }
        },
        {
          id: '11',
          type: 'info',
          title: 'مسار محدث 🗺️',
          message: 'مسار أفضل متاح لمنطقة شمال الرياض - يوفر 20 دقيقة',
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          read: false,
          priority: 'medium',
          userType: 'shipping'
        },
        {
          id: '12',
          type: 'success',
          title: 'تم إنجاز جميع التسليمات! 🎯',
          message: '15 طلب تم تسليمهم بنجاح اليوم - أداء ممتاز!',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: true,
          priority: 'medium',
          userType: 'shipping'
        },
        {
          id: '13',
          type: 'warning',
          title: 'تأخير محتمل ⚠️',
          message: 'ازدحام مروري على طريق الملك فهد - خذ الطريق البديل',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          read: false,
          priority: 'high',
          userType: 'shipping'
        }
      ],
      customer: [
        {
          id: '14',
          type: 'shipping',
          title: 'طلبك في الطريق! 🚚',
          message: 'طلب #12345 خرج للتوصيل - وصول متوقع خلال ساعة',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          read: false,
          priority: 'high',
          userType: 'customer',
          actionButton: {
            label: 'تتبع الطلب',
            action: () => console.log('فتح تتبع الطلب')
          }
        },
        {
          id: '15',
          type: 'success',
          title: 'تم التسليم بنجاح! ✅',
          message: 'طلب #12344 تم تسليمه - نتمنى أن يعجبك!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          priority: 'medium',
          userType: 'customer'
        },
        {
          id: '16',
          type: 'info',
          title: 'عرض خاص لك! 🎁',
          message: 'خصم 20% على منتجاتك المفضلة - لمدة محدودة',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          read: true,
          priority: 'low',
          userType: 'customer'
        }
      ]
    };

    return baseNotifications[userType] || [];
  };

  // تهيئة الإشعارات
  useEffect(() => {
    console.debug('[NotificationSystem] mounting, generating initial notifications for', userType);
    const initialNotifications = generateSmartNotifications();
    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.filter(n => !n.read).length);
  }, [userType]);

  // استمع لحدث عام لفتح لوحة الإشعارات من أي مكان
  useEffect(() => {
    const onOpen = () => {
      console.debug('[NotificationSystem] received open-notifications event');
      setIsOpen(true);
    };
    window.addEventListener('open-notifications', onOpen as EventListener);
    return () => window.removeEventListener('open-notifications', onOpen as EventListener);
  }, []);

  // إرسال تحديث عام عند تغير عدد غير المقروء
  useEffect(() => {
    console.debug('[NotificationSystem] dispatching notifications-updated, unreadCount=', unreadCount);
    const ev = new CustomEvent('notifications-updated', { detail: { unreadCount } });
    window.dispatchEvent(ev);
  }, [unreadCount]);

  // محاكاة إشعارات جديدة كل فترة
  useEffect(() => {
    const interval = setInterval(() => {
      addRandomNotification();
    }, 30000); // كل 30 ثانية

    return () => clearInterval(interval);
  }, [userType]);

  // إضافة إشعار عشوائي
  const addRandomNotification = () => {
    const newNotificationTemplates: { [key: string]: Omit<Notification, 'id' | 'timestamp'>[] } = {
      merchant: [
        {
          type: 'order',
          title: 'طلب جديد! 🛍️',
          message: `طلب بقيمة ${Math.floor(Math.random() * 1000) + 100} ريال وصل الآن`,
          read: false,
          priority: 'medium',
          userType: 'merchant'
        },
        {
          type: 'message',
          title: 'رسالة من عميل 💬',
          message: 'عميل يسأل عن توفر منتج معين',
          read: false,
          priority: 'medium',
          userType: 'merchant'
        }
      ],
      supplier: [
        {
          type: 'order',
          title: 'طلب من تاجر جديد 🏪',
          message: `طلب ${Math.floor(Math.random() * 100) + 20} قطعة من منتج شائع`,
          read: false,
          priority: 'medium',
          userType: 'supplier'
        }
      ],
      shipping: [
        {
          type: 'info',
          title: 'طلب توصيل جديد 📦',
          message: `${Math.floor(Math.random() * 5) + 1} طلبات جديدة في منطقتك`,
          read: false,
          priority: 'medium',
          userType: 'shipping'
        }
      ],
      customer: [
        {
          type: 'info',
          title: 'تحديث على طلبك 📋',
          message: 'طلبك قيد التحضير وسيتم الشحن قريباً',
          read: false,
          priority: 'medium',
          userType: 'customer'
        }
      ]
    };

    const templates = newNotificationTemplates[userType] || [];
    if (templates.length === 0) return;

    const template = templates[Math.floor(Math.random() * templates.length)];
    const newNotification: Notification = {
      ...template,
      id: `new_${Date.now()}`,
      timestamp: new Date()
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // تشغيل صوت تنبيه
    playNotificationSound();
  };

  // تشغيل صوت تنبيه
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // تجاهل الأخطاء إذا لم يُسمح بتشغيل الصوت
      });
    }
  };

  // وضع علامة مقروء
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // حذف إشعار
  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const notificationToDelete = prev.find(n => n.id === id);
      const newNotifications = prev.filter(n => n.id !== id);
      
      if (notificationToDelete && !notificationToDelete.read) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
      
      return newNotifications;
    });
  };

  // وضع علامة مقروء على الكل
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // فلترة الإشعارات
  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'high':
        return notification.priority === 'high' || notification.priority === 'urgent';
      default:
        return true;
    }
  });

  // أيقونة حسب نوع الإشعار
  const getNotificationIcon = (type: Notification['type']) => {
    const icons = {
      success: CheckCircle,
      warning: AlertTriangle,
      error: AlertTriangle,
      info: Info,
      order: Box,
      payment: DollarSign,
      shipping: Truck,
      message: MessageSquare,
      urgent: AlertTriangle
    };
    const Icon = icons[type] || Info;
    return <Icon size={20} />;
  };

  // لون حسب الأولوية
  const getPriorityColor = (priority: Notification['priority']) => {
    const colors = {
      low: 'border-l-gray-400 bg-gray-50',
      medium: 'border-l-blue-400 bg-blue-50',
      high: 'border-l-orange-400 bg-orange-50',
      urgent: 'border-l-red-400 bg-red-50'
    };
    return colors[priority];
  };

  // لون حسب نوع الإشعار
  const getTypeColor = (type: Notification['type']) => {
    const colors = {
      success: 'text-green-600',
      warning: 'text-orange-600',
      error: 'text-red-600',
      info: 'text-blue-600',
      order: 'text-purple-600',
      payment: 'text-green-600',
      shipping: 'text-blue-600',
      message: 'text-indigo-600',
      urgent: 'text-red-600'
    };
    return colors[type] || 'text-gray-600';
  };

  return (
    <>
      {/* زر الإشعارات تمت إزالته — لا داعي لظهور أيقونة عائمة أسفل الصفحة */}

      {/* قائمة الإشعارات */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* خلفية شفافة */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 z-40"
            />
            
            {/* نافذة الإشعارات */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 right-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-[80vh] flex flex-col"
            >
              {/* رأس النافذة */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-gray-700" />
                  <h3 className="font-semibold text-gray-900">الإشعارات</h3>
                  {unreadCount > 0 && (
                    <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                      {unreadCount} جديد
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* فلاتر */}
              <div className="p-3 border-b border-gray-100">
                <div className="flex gap-2">
                  {[
                    { key: 'all', label: 'الكل', count: notifications.length },
                    { key: 'unread', label: 'غير مقروء', count: unreadCount },
                    { key: 'high', label: 'عالي الأولوية', count: notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length }
                  ].map((filterOption) => (
                    <button
                      key={filterOption.key}
                      onClick={() => setFilter(filterOption.key as any)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filter === filterOption.key
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {filterOption.label} ({filterOption.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* قائمة الإشعارات */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>لا توجد إشعارات</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`border-l-4 rounded-lg p-3 mb-2 cursor-pointer transition-all hover:shadow-md ${
                          getPriorityColor(notification.priority)
                        } ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'}`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={getTypeColor(notification.type)}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`font-medium text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {notification.timestamp.toLocaleTimeString('ar-EG', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              
                              {notification.actionButton && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    notification.actionButton!.action();
                                  }}
                                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full hover:bg-blue-700 transition-colors"
                                >
                                  {notification.actionButton.label}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* تذييل النافذة */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-100">
                  <div className="flex justify-between">
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      disabled={unreadCount === 0}
                    >
                      وضع علامة مقروء على الكل
                    </button>
                    <button
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      الإعدادات
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ملف صوت التنبيه */}
      <audio
        ref={audioRef}
        preload="auto"
      >
        {/* يمكن إضافة ملف صوتي هنا */}
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmIcBjaP2fPFdiMFKHnN9NSLU..." />
      </audio>
    </>
  );
};

export default NotificationSystem;