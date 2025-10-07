import React, { createContext, useContext, useState, useEffect } from 'react';
import NotificationSystem, { Notification } from './NotificationSystem';
import NotificationToast, { Toast, useToast } from './NotificationToast';

interface NotificationContextType {
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  showQuickAlert: (type: Toast['type'], title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

interface NotificationProviderProps {
  children: React.ReactNode;
  userType: 'merchant' | 'supplier' | 'shipping' | 'customer';
  userName?: string;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  userType,
  userName
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toasts, addToast, removeToast } = useToast();

  // إضافة إشعار جديد للقائمة
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // عرض تنبيه سريع
  const showQuickAlert = (type: Toast['type'], title: string, message: string) => {
    addToast({
      type,
      title,
      message,
      duration: 4000
    });
  };

  // محاكاة إشعارات تلقائية ذكية
  useEffect(() => {
    const smartNotifications: { [key: string]: Array<{ delay: number; notification: Omit<Notification, 'id' | 'timestamp'> }> } = {
      merchant: [
        {
          delay: 10000, // 10 ثوانِ
          notification: {
            type: 'order',
            title: 'طلب جديد! 🎉',
            message: 'طلب بقيمة 320 ريال من عميل جديد',
            read: false,
            priority: 'high',
            userType: 'merchant',
            actionButton: {
              label: 'عرض التفاصيل',
              action: () => showQuickAlert('success', 'تم فتح الطلب!', 'جاري تحميل تفاصيل الطلب...')
            }
          }
        },
        {
          delay: 25000, // 25 ثانية
          notification: {
            type: 'warning',
            title: 'تنبيه مخزون ⚠️',
            message: 'منتج "قميص قطني أزرق" أوشك على النفاد (5 قطع متبقية)',
            read: false,
            priority: 'medium',
            userType: 'merchant'
          }
        }
      ],
      supplier: [
        {
          delay: 8000, // 8 ثوانِ
          notification: {
            type: 'order',
            title: 'طلب من تاجر مميز! 🏪',
            message: 'طلب 200 قطعة من "أكياس التسوق البيئية"',
            read: false,
            priority: 'high',
            userType: 'supplier',
            actionButton: {
              label: 'قبول الطلب',
              action: () => showQuickAlert('success', 'تم قبول الطلب!', 'سيتم تحضير الطلب وشحنه قريباً')
            }
          }
        }
      ],
      shipping: [
        {
          delay: 12000, // 12 ثانية
          notification: {
            type: 'info',
            title: 'طلب توصيل عاجل! 🚨',
            message: 'طلب VIP في منطقة العليا - مكافأة إضافية 80 ريال',
            read: false,
            priority: 'urgent' as any,
            userType: 'shipping',
            actionButton: {
              label: 'قبول المهمة',
              action: () => showQuickAlert('success', 'تم قبول المهمة!', 'جاري تحضير تفاصيل التوصيل...')
            }
          }
        }
      ],
      customer: [
        {
          delay: 15000, // 15 ثانية
          notification: {
            type: 'shipping',
            title: 'طلبك قريب منك! 🚚',
            message: 'السائق على بُعد 5 دقائق من موقعك',
            read: false,
            priority: 'high',
            userType: 'customer',
            actionButton: {
              label: 'تتبع مباشر',
              action: () => showQuickAlert('info', 'تم فتح التتبع!', 'يمكنك مشاهدة موقع السائق الآن')
            }
          }
        }
      ]
    };

    const userNotifications = smartNotifications[userType] || [];
    
    const timeouts = userNotifications.map(({ delay, notification }) => 
      setTimeout(() => {
        addNotification(notification);
        // عرض توست أيضاً للإشعارات المهمة
        if (notification.priority === 'high' || notification.priority === 'urgent') {
          addToast({
            type: notification.type as Toast['type'],
            title: notification.title,
            message: notification.message,
            duration: 6000,
            action: notification.actionButton ? {
              label: notification.actionButton.label,
              onClick: notification.actionButton.action
            } : undefined
          });
        }
      }, delay)
    );

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [userType]);

  // إشعارات ترحيبية
  useEffect(() => {
    // إشعار ترحيب يظهر مرة واحدة فقط عند أول تحميل المزود
    const storageKey = 'hasWelcomed-' + userType;
    const hasWelcomed = sessionStorage.getItem(storageKey);

    const welcomeMessages: { [key: string]: Toast } = {
      merchant: {
        id: 'welcome',
        type: 'success',
        title: 'أهلاً بك في لوحة التاجر! 👋',
        message: 'جميع الإشعارات الذكية مفعلة لمساعدتك في إدارة متجرك',
        duration: 5000
      },
      supplier: {
        id: 'welcome',
        type: 'info',
        title: 'مرحباً بك في لوحة المورد! 📦',
        message: 'ستصلك تنبيهات فورية عن الطلبات والمخزون',
        duration: 5000
      },
      shipping: {
        id: 'welcome',
        type: 'order',
        title: 'أهلاً بك في لوحة الشحن! 🚚',
        message: 'جاهز لاستقبال طلبات التوصيل والمهام الجديدة',
        duration: 5000
      },
      customer: {
        id: 'welcome',
        type: 'success',
        title: 'أهلاً بك! 🛍️',
        message: 'ستحصل على تحديثات فورية عن طلباتك وحالة التسليم',
        duration: 5000
      }
    };

    const welcomeToast = welcomeMessages[userType];
    // don't show if session already flagged or a welcome toast is already present
    const alreadyPresent = toasts.some(t => t.id === (welcomeToast?.id) || t.title === welcomeToast?.title);
    if (!hasWelcomed && welcomeToast && !alreadyPresent) {
      const timer = setTimeout(() => {
        addToast(welcomeToast);
        sessionStorage.setItem(storageKey, 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [userType]);

  return (
    <NotificationContext.Provider
      value={{
        addNotification,
        addToast,
        showQuickAlert
      }}
    >
      {children}
      
      {/* نظام الإشعارات */}
      <NotificationSystem userType={userType} userName={userName} />
      
      {/* التوستات */}
      <NotificationToast toasts={toasts} onRemove={removeToast} />
    </NotificationContext.Provider>
  );
};

// Hook لاستخدام الإشعارات
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export default NotificationProvider;