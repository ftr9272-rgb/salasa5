import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, TrendingUp, Users, ShoppingCart, Eye, Edit, Bell, 
  AlertCircle, CheckCircle, Clock, Filter, Search, Plus,
  BarChart3, PieChart, Activity, Zap, Star, ArrowUp, ArrowDown
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import AddPartnerModal from '../../components/supplier/AddPartnerModal';
import { storage, Partner } from '../../utils/localStorage';
import { useNotifications } from '../../components/NotificationProvider';

function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('الشهر');
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'urgent',
      title: 'مخزون منخفض - هواتف ذكية',
      message: 'كمية المخزون أقل من الحد الأدنى (15 قطعة متبقية)',
      time: '5 دقائق',
      action: 'إعادة تخزين',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'طلب جديد من متجر الإلكترونيات',
      message: 'طلب بقيمة 12,500 ريال - 50 هاتف ذكي',
      time: '15 دقيقة',
      action: 'مراجعة الطلب',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'تأخير في التسليم المتوقع',
      message: 'طلب SUP-001 قد يتأخر يومين عن الموعد المحدد',
      time: 'ساعة واحدة',
      action: 'تحديث التاريخ',
      read: true
    }
  ]);
  
  const [quickActions] = useState([
    { id: 1, title: 'إضافة منتج جديد', icon: Package, color: 'emerald', route: '/supplier/products' },
    { id: 2, title: 'مراجعة الطلبات المعلقة', icon: Clock, color: 'blue', count: 8 },
    { id: 3, title: 'تحديث أسعار المنتجات', icon: TrendingUp, color: 'purple' },
    { id: 4, title: 'إدارة المخزون', icon: Package, color: 'amber', alert: true },
    { id: 5, title: 'تقارير المبيعات', icon: BarChart3, color: 'rose' },
    { id: 6, title: 'التجار الجدد', icon: Users, color: 'indigo', count: 3 }
  ]);

  const [lowStockProducts] = useState([
    { name: 'هواتف ذكية iPhone 15', current: 15, min: 50, status: 'critical' },
    { name: 'أجهزة لابتوب Dell', current: 8, min: 25, status: 'critical' },
    { name: 'ساعات ذكية Samsung', current: 22, min: 30, status: 'warning' },
    { name: 'سماعات بلوتوث', current: 45, min: 60, status: 'warning' }
  ]);

  // Dashboard display settings persisted in localStorage
  type Settings = {
    showQuickActions: boolean;
    showStats: boolean;
    showNotificationsBanner: boolean;
    showLowStock: boolean;
    showRecentOrders: boolean;
    showTopProducts: boolean;
  };

  const defaultSettings: Settings = {
    showQuickActions: true,
    showStats: true,
    showNotificationsBanner: true,
    showLowStock: true,
    showRecentOrders: true,
    showTopProducts: true
  };
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem('supplier_dashboard_settings');
      return raw ? JSON.parse(raw) : defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('supplier_dashboard_settings', JSON.stringify(settings));
    } catch (e) {
      // ignore
    }
  }, [settings]);
  
  const stats = [
    {
      title: 'إجمالي المبيعات',
      value: '89,250 ريال',
      change: '+18.7%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      trend: 'up'
    },
    {
      title: 'طلبات التجار',
      value: '324',
      change: '+12.4%',
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      trend: 'up'
    },
    {
      title: 'المنتجات المتاحة',
      value: '1,847',
      change: '+5.2%',
      icon: <Package className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      trend: 'up'
    },
    {
      title: 'التجار الشركاء',
      value: '142',
      change: '+22.1%',
      icon: <Users className="w-6 h-6" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      trend: 'up'
    }
  ];

  const recentOrders = [
    {
      id: 'SUP-001',
      merchant: 'متجر الإلكترونيات الذكية',
      product: 'هواتف ذكية متنوعة',
      quantity: 50,
      status: 'completed',
      date: '2024-01-15',
      value: '12,500 ريال'
    },
    {
      id: 'SUP-002',
      merchant: 'متجر الأزياء العصرية',
      product: 'ملابس نسائية وأطفال',
      quantity: 200,
      status: 'processing',
      date: '2024-01-14',
      value: '8,750 ريال'
    },
    {
      id: 'SUP-003',
      merchant: 'مكتبة المعرفة',
      product: 'كتب ومستلزمات مكتبية',
      quantity: 75,
      status: 'shipped',
      date: '2024-01-13',
      value: '3,650 ريال'
    },
    {
      id: 'SUP-004',
      merchant: 'صيدلية النور الطبية',
      product: 'مكملات غذائية وعناية',
      quantity: 30,
      status: 'pending',
      date: '2024-01-12',
      value: '2,240 ريال'
    }
  ];

  const topProducts = [
    { name: 'هواتف ذكية iPhone 15', orders: 120, revenue: '٣٠٠,٠٠٠ ر.س', stock: 45 },
    { name: 'سماعات بلوتوث', orders: 98, revenue: '٧٥,٠٠٠ ر.س', stock: 120 },
    { name: 'ساعات ذكية Samsung', orders: 76, revenue: '٥٠,٠٠٠ ر.س', stock: 22 }
  ];

  // partners state
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const load = () => setPartners(storage.getPartners());
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  // attempt to get notifications API; if NotificationProvider not present this will be caught
  let notificationsApi: any = null;
  try {
    notificationsApi = useNotifications();
  } catch (e) {
    notificationsApi = null;
  }

  const handleAddPartner = (pd: any) => {
    const payload: Omit<Partner, 'id' | 'createdAt'> = {
      name: (pd.businessName || pd.contactPerson || 'شريك جديد').trim(),
      email: (pd.email || '').trim(),
      phone: (pd.phone || '').trim(),
      type: (pd.partnerType || '').trim(),
      city: (pd.city || '').trim(),
      category: (pd.category || '').trim()
    };

    // idempotency check: avoid adding duplicate partners by email or phone or exact name
    const existing = storage.getPartners();
    const dup = existing.find(p => {
      const sameEmail = payload.email && p.email && p.email.toLowerCase() === payload.email.toLowerCase();
      const samePhone = payload.phone && p.phone && p.phone === payload.phone;
      const sameName = payload.name && p.name && p.name.toLowerCase() === payload.name.toLowerCase();
      return sameEmail || samePhone || sameName;
    });

    if (dup) {
      // show an informative toast and skip adding again
      if (notificationsApi && typeof notificationsApi.addToast === 'function') {
        notificationsApi.addToast({ type: 'info', title: 'الشريك موجود', message: `${dup.name} موجود بالفعل ولن يتم تكراره.`, duration: 4000 });
      } else {
        console.log('Duplicate partner detected, skipping add:', dup);
      }
      return;
    }

    try {
      const added = storage.addPartner(payload);
      setPartners(prev => [added, ...prev]);
      if (notificationsApi && typeof notificationsApi.addToast === 'function') {
        notificationsApi.addToast({ type: 'success', title: 'تم إضافة شريك', message: `${added.name} تمت إضافته بنجاح`, duration: 4000 });
      } else {
        console.log('Partner added:', added);
      }
    } catch (err) {
      console.error('Failed to add partner', err);
      if (notificationsApi && typeof notificationsApi.addToast === 'function') {
        notificationsApi.addToast({ type: 'error', title: 'فشل الإضافة', message: 'حدث خطأ أثناء حفظ الشريك', duration: 4000 });
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">لوحة تحكم المورد</h1>
        <div className="flex items-center gap-2">
          <select aria-label="فترة" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-3 py-1 border rounded">
            <option>اليوم</option>
            <option>الأسبوع</option>
            <option>الشهر</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      {settings.showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className={`${stat.bgColor} rounded-2xl p-6 shadow-sm` }>
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl bg-white/30`}>{stat.icon}</div>
                <div className="text-sm font-bold px-3 py-1 rounded-full">{stat.change}</div>
              </div>
              <h3 className="text-lg font-semibold mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Notifications banner */}
      {settings.showNotificationsBanner && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">🌟 مرحباً بك في لوحة تحكم المورد</h2>
              <p className="text-sm text-emerald-100">نظام متقدم لإدارة منتجاتك والتعامل مع التجار بكفاءة</p>
            </div>
            <div className="text-right text-sm">آخر تحديث: {new Date().toLocaleString()}</div>
          </div>
        </motion.div>
      )}

      {/* Quick actions */}
      {settings.showQuickActions && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {quickActions.map((action, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
              <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">{React.createElement(action.icon as any, { className: 'w-5 h-5' })}</div>
              <div>
                <div className="text-sm font-semibold">{(action as any).title}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main grid: low stock + recent orders/top products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {settings.showLowStock && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-lg font-bold mb-4">⚠️ تحذيرات المخزون المنخفض</h3>
            <div className="space-y-3">
              {lowStockProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-gray-500">المتبقي: {p.current} • الحد الأدنى: {p.min}</div>
                  </div>
                  <div className={`text-sm font-medium ${p.status === 'critical' ? 'text-red-600' : 'text-yellow-600'}`}>{p.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="lg:col-span-2 space-y-6">
          {settings.showRecentOrders && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-lg font-bold mb-4">📋 الطلبات الحديثة</h3>
              <div className="space-y-3">
                {recentOrders.map((order, idx) => (
                  <motion.div key={order.id || idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                    <div>
                      <div className="font-semibold">{order.merchant}</div>
                      <div className="text-sm text-gray-600">{order.product} • {order.quantity} قطع</div>
                    </div>
                    <div className="text-sm text-gray-500">{order.date} • {order.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {settings.showTopProducts && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-lg font-bold mb-4">⭐ أفضل المنتجات مبيعًا</h3>
              <div className="space-y-3">
                {topProducts.map((product, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">{product.name.charAt(0)}</div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">طلبات: {product.orders} • إيرادات: {product.revenue}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">متوفر: {product.stock ?? '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Partners panel */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">الشركاء</h2>
          <button onClick={() => setShowAddPartnerModal(true)} className="px-3 py-1 bg-emerald-600 text-white rounded">إضافة شريك</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {partners.length === 0 ? (
            <div className="text-sm text-gray-500">لم يتم إضافة شركاء بعد.</div>
          ) : (
            partners.map(p => (
              <div key={p.id} className="p-4 bg-white rounded shadow-sm relative">
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-gray-500">{p.type}</div>
                <div className="text-xs text-gray-400">{p.city} • {p.category}</div>
                <button
                  onClick={() => {
                    const ok = storage.deletePartner(p.id);
                    if (ok) {
                      setPartners(prev => prev.filter(x => x.id !== p.id));
                      if (notificationsApi && typeof notificationsApi.addToast === 'function') {
                        notificationsApi.addToast({ type: 'success', title: 'تم الحذف', message: `${p.name} حُذف.`, duration: 3000 });
                      }
                    }
                  }}
                  className="absolute top-3 left-3 text-red-500 text-xs hover:underline"
                >حذف</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AddPartnerModal mounted here */}
      <AddPartnerModal isOpen={showAddPartnerModal} onClose={() => setShowAddPartnerModal(false)} onSubmit={(pd) => { handleAddPartner(pd); setShowAddPartnerModal(false); }} />
    </div>
  );
}

export default Dashboard;