import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Star,
  Bell,
  Plus,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ArrowRight,
  X,
  Menu,
  Truck
} from 'lucide-react';
// Chat handled globally via header + ChatController
import { NotificationProvider, useNotifications } from '../components/NotificationProvider';
import toast from 'react-hot-toast';
import { storage } from '../utils/localStorage';

// استيراد النوافذ المنبثقة
import AddProductModal from '../components/AddProductModal';
import { useAuth } from '../contexts/AuthContext';
import AddOrderModal from '../components/AddOrderModal';
import AddShippingOrderModal from '../components/AddShippingOrderModal';
import AddPartnerModal from '../components/AddPartnerModalSimple';
import MarketPredictions from '../components/MarketPredictions';
import MarketOpportunities from '../components/MarketOpportunities';

const SupplierDashboard = () => {
  // chat state moved to global ChatController
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('الشهر');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // حالات النوافذ المنبثقة
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerEmail, setNewPartnerEmail] = useState('');
  const [newPartnerPhone, setNewPartnerPhone] = useState('');
  const [newPartnerType, setNewPartnerType] = useState('retailer');
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showShippingOrderModal, setShowShippingOrderModal] = useState(false);
  const [shippingOrders, setShippingOrders] = useState<any[]>([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  // شركاء وإدارة القائمة (تعتمد على localStorage)
  const [partners, setPartners] = React.useState<any[] | null>(null);
  // فريق العمل محلياً
  const [teamMembers, setTeamMembers] = useState<any[]>([
    { id: 'tm1', name: 'أحمد محمد', role: 'مدير المبيعات', email: 'ahmed@company.com' },
    { id: 'tm2', name: 'فاطمة علي', role: 'محاسبة', email: 'fatima@company.com' },
    { id: 'tm3', name: 'محمد خالد', role: 'مشرف المخزن', email: 'mohamed@company.com' }
  ]);

  // Note: we call useNotifications() inside handlers in try/catch to avoid calling hooks

  // بيانات وهمية للطلبات الحديثة
  // جلب الطلبات المشتركة من localStorage
  const [marketOrders, setMarketOrders] = useState<any[]>([]);
  React.useEffect(() => {
    const updateOrders = () => {
      const stored = localStorage.getItem('marketOrders');
      if (stored) {
        setMarketOrders(JSON.parse(stored));
      } else {
        setMarketOrders([]);
      }
    };
    updateOrders();
    window.addEventListener('storage', updateOrders);
    return () => window.removeEventListener('storage', updateOrders);
  }, []);

  // تحميل طلبات الشحن للمورد
  React.useEffect(() => {
    const loadShippingOrders = () => {
      const orders = storage.getShippingOrders();
      setShippingOrders(orders);
    };
    loadShippingOrders();
    const handleStorageUpdate = () => loadShippingOrders();
    window.addEventListener('storage-updated', handleStorageUpdate);
    return () => window.removeEventListener('storage-updated', handleStorageUpdate);
  }, []);

  // Load partners from storage (seed with defaults if empty)
  React.useEffect(() => {
    const loadPartners = () => {
      const list = storage.getPartners();
      if (!list || list.length === 0) {
        // seed defaults so UI actions operate on persistent items
        const samples = [
          { name: 'متجر النخبة', type: 'retailer', email: '', phone: '' },
          { name: 'سوبر ماركت الحي', type: 'retailer', email: '', phone: '' },
          { name: 'متجر الأسرة', type: 'retailer', email: '', phone: '' },
          { name: 'البقالة المركزية', type: 'retailer', email: '', phone: '' }
        ];
        samples.forEach(s => storage.addPartner(s));
        setPartners(storage.getPartners());
      } else {
        setPartners(list);
      }
    };
    loadPartners();
  }, []);
  
  // عداد الإشعارات الخاص بتوقعات السوق (React-driven عوض DOM mutation)
  const [marketUnreadCount, setMarketUnreadCount] = React.useState<number>(() => {
    try {
      return storage.getMarketItems().length || 0;
    } catch (e) { return 0; }
  });

  // current authenticated user (provider info)
  const auth = useAuth();

  React.useEffect(() => {
    const onUpdate = (e: Event) => {
      try {
        // @ts-ignore
        const detail = (e as CustomEvent).detail || {};
        const count = typeof detail.unreadCount === 'number' ? detail.unreadCount : 0;
        setMarketUnreadCount(count);
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('notifications-updated', onUpdate as EventListener);
    return () => window.removeEventListener('notifications-updated', onUpdate as EventListener);
  }, []);

  // Helpers: delete partner
  const handleDeletePartner = (id: string) => {
    const ok = storage.deletePartner(id);
    if (ok) {
      setPartners(storage.getPartners());
      try {
        // @ts-ignore
        const { addToast } = useNotifications() as any;
        addToast({ type: 'success', title: 'تم الحذف', message: 'تم حذف الشريك', duration: 2500 });
      } catch(e) { console.log('شريك محذوف'); }
    } else {
      try {
        // @ts-ignore
        const { addToast } = useNotifications() as any;
        addToast({ type: 'warning', title: 'لم يتم الحذف', message: 'الشريك غير موجود', duration: 2500 });
      } catch(e) { console.log('لم يتم الحذف'); }
    }
  };

  // Helpers: delete team member (local)
  const handleDeleteTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    try {
      // @ts-ignore
      const { addToast } = useNotifications() as any;
      addToast({ type: 'success', title: 'تم الحذف', message: 'تم إزالة العضو من الفريق', duration: 2000 });
    } catch(e) { console.log('تم حذف عضو فريق'); }
  };

  // Helpers: delete order (if it's from marketOrders persisted list)
  const handleDeleteOrder = (orderId: string) => {
    const stored = localStorage.getItem('marketOrders');
    if (stored) {
      const arr = JSON.parse(stored) as any[];
      const filtered = arr.filter(o => (o.id || o.orderId) !== orderId);
      if (filtered.length !== arr.length) {
        localStorage.setItem('marketOrders', JSON.stringify(filtered));
        setMarketOrders(filtered);
        try {
          // @ts-ignore
          const { addToast } = useNotifications() as any;
          addToast({ type: 'success', title: 'تم الحذف', message: 'تم حذف الطلب', duration: 2000 });
        } catch(e){ console.log('تم حذف طلب'); }
        return;
      }
    }
    // fallback: simulated deletion for static recentOrders
    try {
      // @ts-ignore
      const { addToast } = useNotifications() as any;
      addToast({ type: 'info', title: 'محاكاة الحذف', message: 'الطلب محليّ وغير مُخزّن - تم محاكاة الحذف', duration: 2000 });
    } catch(e){ console.log('محاكاة حذف الطلب'); }
  };

  // معالج إضافة طلب جديد من النموذج (يدعم وضع السوق ووضع الشريك)
  const handleAddOrder = (orderData: any) => {
    try {
      console.log('تم إضافة طلب جديد (raw):', orderData);
      const isMarket = Boolean(orderData.publishToMarketplace);

      if (isMarket) {
        const stored = JSON.parse(localStorage.getItem('marketOrders') || '[]');
        const item = {
          id: `MKT-${Date.now()}`,
          title: orderData.title || orderData.marketTitle || orderData.packageDescription || 'طلب سوق',
          category: orderData.category || orderData.marketCategory || orderData.merchant || 'عام',
          quantity: Number(orderData.quantity || orderData.marketQuantity || 1),
          details: orderData.details || orderData.marketDetails || orderData.specialInstructions || '',
          provider: { id: auth?.user?.id || 'supplier', name: auth?.user?.name || 'المورد' },
          createdAt: new Date().toISOString()
        };
        stored.unshift(item);
        localStorage.setItem('marketOrders', JSON.stringify(stored));
        setMarketOrders(stored);
        toast.success('✅ تم إضافة الطلب إلى السوق');
      } else {
        // partner/shipping local order
        const arr = JSON.parse(localStorage.getItem('supplier_local_orders') || '[]');
        const orderRec = {
          id: `SORD-${Date.now()}`,
          customerName: orderData.customerName || '',
          customerPhone: orderData.customerPhone || '',
          merchant: orderData.merchant || '',
          packageDescription: orderData.packageDescription || orderData.title || '',
          value: Number(orderData.value || 0),
          priority: orderData.priority || 'متوسطة',
          shippingServiceId: orderData.shippingServiceId || null,
          createdAt: new Date().toISOString()
        };
        arr.unshift(orderRec);
        localStorage.setItem('supplier_local_orders', JSON.stringify(arr));
        toast.success('✅ تم تسجيل طلب التوريد محلياً');
      }

    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء إضافة الطلب');
    } finally {
      setShowAddOrderModal(false);
    }
  };

  const recentOrders = [
    {
      id: 'ORD001',
      merchant: 'متجر النخبة',
      products: ['أرز بسمتي', 'زيت زيتون'],
      status: 'pending',
      amount: '٢٥٠ ر.س',
      date: '٢٠٢٤/١٢/١٥'
    },
    {
      id: 'ORD002', 
      merchant: 'سوبر ماركت الحي',
      products: ['سكر', 'دقيق'],
      status: 'processing',
      amount: '٤٨٠ ر.س',
      date: '٢٠٢٤/١٢/١٤'
    },
    {
      id: 'ORD003',
      merchant: 'متجر الأسرة',
      products: ['حليب', 'جبن'],
      status: 'completed',
      amount: '٣٢٠ ر.س',
      date: '٢٠٢٤/١٢/١٣'
    },
    {
      id: 'ORD004',
      merchant: 'البقالة المركزية',
      products: ['شاي', 'قهوة'],
      status: 'cancelled',
      amount: '١٥٠ ر.س',
      date: '٢٠٢٤/١٢/١٢'
    }
  ];

  // بيانات وهمية للمنتجات الأكثر مبيعاً
  const topProducts = [
    { name: 'أرز بسمتي فاخر', orders: 45, revenue: '٢٢,٥٠٠ ر.س', merchants: 12 },
    { name: 'زيت زيتون إيطالي', orders: 38, revenue: '١٩,٠٠٠ ر.س', merchants: 10 },
    { name: 'عسل طبيعي', orders: 32, revenue: '١٦,٠٠٠ ر.س', merchants: 8 },
    { name: 'تمر المدينة', orders: 28, revenue: '١٤,٠٠٠ ر.س', merchants: 7 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد المراجعة';
      case 'processing': return 'قيد التحضير';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return 'غير محدد';
    }
  };

  // أزرار الإجراءات السريعة
  const quickActions = [
    { 
      label: 'إضافة منتج جديد', 
      icon: <Package className="w-5 h-5" />, 
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => setShowAddProductModal(true)
    },
    { 
      label: 'إضافة شريك تجاري', 
      icon: <Users className="w-5 h-5" />, 
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => setShowAddPartnerModal(true)
    },
    { 
      label: 'تسجيل عملية توريد', 
      icon: <ShoppingCart className="w-5 h-5" />, 
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => setShowAddOrderModal(true)
    },
    { 
      label: 'طلب خدمة شحن', 
      icon: <Truck className="w-5 h-5" />, 
      color: 'bg-emerald-600 hover:bg-emerald-700',
      onClick: () => setShowShippingOrderModal(true)
    },
    { 
      label: 'إضافة فئة منتجات', 
      icon: <Plus className="w-5 h-5" />, 
      color: 'bg-orange-600 hover:bg-orange-700',
      onClick: () => setShowAddCategoryModal(true)
    },
    { 
      label: 'إدارة الفريق', 
      icon: <Users className="w-5 h-5" />, 
      color: 'bg-indigo-600 hover:bg-indigo-700',
      onClick: () => setShowTeamModal(true)
    },
    { 
      label: 'الإعدادات', 
      icon: <Plus className="w-5 h-5" />, 
      color: 'bg-gray-600 hover:bg-gray-700',
      onClick: () => setShowSettingsModal(true)
    }
  ];

  // محتوى نظرة عامة
  const renderOverviewContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">الطلبات الجديدة</p>
              <p className="text-3xl font-bold">٢٤</p>
              <p className="text-blue-100 text-xs">+٢٪ من الأسبوع الماضي</p>
            </div>
            <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">إيرادات اليوم</p>
              <p className="text-3xl font-bold">٨,٤٢٠ ر.س</p>
              <p className="text-green-100 text-xs">+٨٪ من أمس</p>
            </div>
            <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">قيد التحضير</p>
              <p className="text-3xl font-bold">١٥</p>
              <p className="text-purple-100 text-xs">-٣ عن الأمس</p>
            </div>
            <div className="w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">معدل النمو</p>
              <p className="text-3xl font-bold">+٢٥٪</p>
              <p className="text-orange-100 text-xs">هذا الشهر</p>
            </div>
            <div className="w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ملخص الطلبات الحديثة */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span>📋</span> الطلبات الحديثة - ملخص فوري
          </h2>

          <div className="space-y-4">
            {/* عرض جميع الطلبات (الوهمية والمشتركة) */}
            {[...marketOrders, ...recentOrders].map((order: any, index: number) => (
              <motion.div 
                key={order.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-purple-100 rounded-xl hover:shadow-md transition-all duration-200 bg-purple-50"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full bg-purple-500`}></div>
                  <div>
                    <p className="font-bold text-gray-900">{order.customer || order.merchant}</p>
                    <p className="text-sm text-gray-600">{order.product || (order.products && order.products.join(', '))}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{order.value || order.amount}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* المنتجات الأكثر مبيعاً */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>⭐</span> المنتجات الأكثر طلباً
          </h2>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {product.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-xs">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.orders} طلب</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-xs">{product.revenue}</p>
                  <p className="text-xs text-gray-500">{product.merchants} تاجر</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // محتوى الطلبات
  const renderOrdersContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span>📋</span> الطلبات الواردة
            </h2>
            <p className="text-sm text-gray-600 mt-1">تتبع ومعالجة طلبات التجار لزيادة الكفاءة والأرباح</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              title="فلتر الطلبات"
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              onChange={(e) => {
                toast.success(`تم تطبيق فلتر: ${e.target.value}`);
                // يمكن هنا إضافة منطق الفلترة الفعلي
              }}
            >
              <option>جميع الطلبات</option>
              <option>قيد المراجعة</option>
              <option>قيد التحضير</option>
              <option>مكتملة</option>
              <option>ملغية</option>
            </select>
            <button 
              onClick={() => {
                toast.success('تم تطبيق الفلترة بنجاح!');
                // يمكن هنا إضافة منطق الفلترة المتقدمة
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors hover:scale-105"
            >
              <Filter className="w-4 h-4" />
              فلترة
            </button>
          </div>
        </div>

        {/* جدول الطلبات */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">رقم الطلب</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">التاجر</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">المنتجات</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">الحالة</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">المبلغ</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">التاريخ</th>
                <th className="text-center py-3 px-4 text-gray-600 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <motion.tr 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm text-blue-600 font-semibold">{order.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-900">{order.merchant}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{order.products.join(', ')}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-gray-900">{order.amount}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{order.date}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        title="عرض التفاصيل"
                        onClick={() => {
                          toast.success(`عرض تفاصيل الطلب: ${order.id}`);
                          // يمكن هنا فتح نافذة منبثقة لعرض التفاصيل
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:scale-110"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        title="تعديل الطلب"
                        onClick={() => {
                          toast.success(`تعديل الطلب: ${order.id}`);
                          // يمكن هنا فتح نافذة منبثقة للتعديل
                        }}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors hover:scale-110"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        title="حذف الطلب"
                        onClick={() => {
                          if (window.confirm(`هل أنت متأكد من حذف الطلب: ${order.id}؟`)) {
                            handleDeleteOrder(order.id);
                            toast.success(`تم حذف الطلب: ${order.id}`);
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        title="المزيد"
                        onClick={() => {
                          const actions = [
                            'تغيير حالة الطلب',
                            'مشاركة الطلب',
                            'طباعة الطلب',
                            'إرسال اشعار'
                          ];
                          const action = actions[Math.floor(Math.random() * actions.length)];
                          toast.success(`${action}: ${order.id}`);
                        }}
                        className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors hover:scale-110"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  // محتوى المخزون
  const renderInventoryContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Package className="w-6 h-6" />
        إدارة المخزون
      </h2>
      <div className="text-center py-20">
        <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">سيتم إضافة إدارة المخزون قريباً</p>
      </div>
    </motion.div>
  );

  // محتوى المنتجات
  const renderProductsContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* رأس القسم مع الإحصائيات السريعة */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🏷️ إدارة المنتجات</h1>
            <p className="text-purple-100">كتالوج شامل لجميع منتجاتك مع إدارة متقدمة</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{topProducts.length}</div>
            <div className="text-sm text-purple-100">منتج نشط</div>
          </div>
        </div>
      </div>

      {/* إحصائيات المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">إجمالي المنتجات</p>
              <p className="text-2xl font-bold">{topProducts.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">📦</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">الأكثر مبيعاً</p>
              <p className="text-2xl font-bold">{topProducts[0]?.name.substring(0, 8) || 'لا يوجد'}</p>
            </div>
            <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">⭐</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">إجمالي الطلبات</p>
              <p className="text-2xl font-bold">{topProducts.reduce((sum, p) => sum + Number(p.orders), 0)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">🛒</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold">٢٨٥ك ر.س</p>
            </div>
            <div className="w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* أدوات التحكم والفلترة */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Package className="w-6 h-6" />
              كتالوج المنتجات
            </h2>
            <p className="text-sm text-gray-600 mt-1">إدارة شاملة لجميع منتجاتك مع التتبع والتحليلات</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              title="فلتر حسب الفئة"
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option>جميع الفئات</option>
              <option>مواد غذائية</option>
              <option>مشروبات</option>
              <option>منظفات</option>
              <option>مستلزمات منزلية</option>
            </select>
            <select 
              title="ترتيب حسب"
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option>الأحدث أولاً</option>
              <option>الأكثر مبيعاً</option>
              <option>الأعلى سعراً</option>
              <option>الأقل سعراً</option>
            </select>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
            >
              <Plus className="w-4 h-4" />
              إضافة منتج جديد
            </button>
          </div>
        </div>

        {/* شبكة المنتجات المحسنة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topProducts.map((product, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
            >
              {/* رأس البطاقة */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {product.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-600">كود: PRD-{String(index + 1).padStart(3, '0')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button title="تعديل" className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button title="حذف" className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* تفاصيل المنتج */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">السعر:</span>
                  <span className="font-bold text-green-600 text-lg">{product.revenue}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">عدد الطلبات:</span>
                  <span className="font-semibold text-blue-600">{product.orders} طلب</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">عدد التجار:</span>
                  <span className="font-semibold text-purple-600">{product.merchants} تاجر</span>
                </div>

                {/* شريط الشعبية */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">مستوى الشعبية</span>
                    <span className="text-xs font-semibold text-purple-600">
                      {Math.min(Math.round((Number(product.orders) / 50) * 100), 100)}%
                    </span>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ${
                        Number(product.orders) > 40 ? 'w-full' :
                        Number(product.orders) > 30 ? 'w-4/5' :
                        Number(product.orders) > 20 ? 'w-3/5' :
                        Number(product.orders) > 10 ? 'w-2/5' : 'w-1/5'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* حالة المخزون */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">حالة المخزون:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    Number(product.orders) > 30 
                      ? 'bg-green-100 text-green-800' 
                      : Number(product.orders) > 15 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {Number(product.orders) > 30 ? 'متوفر' : Number(product.orders) > 15 ? 'قليل' : 'منخفض'}
                  </span>
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-2 px-4 rounded-lg hover:shadow-md transition-all duration-300 text-sm font-semibold">
                  عرض التفاصيل
                </button>
                <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg hover:shadow-md transition-all duration-300 text-sm font-semibold">
                  تحديث السعر
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* إضافة منتجات جديدة - بطاقة دعوة للإجراء */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: topProducts.length * 0.1 + 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:bg-gradient-to-br hover:from-purple-100 hover:to-pink-100 transition-all duration-300 cursor-pointer"
          onClick={() => setShowAddProductModal(true)}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">إضافة منتج جديد</h3>
          <p className="text-gray-600 mb-4">وسع كتالوج منتجاتك وزيد من فرص البيع</p>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
            ابدأ الآن
          </button>
        </motion.div>

        {/* إحصائيات سريعة */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>📊</span> أداء المنتجات
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">متوسط الطلبات:</span>
                <span className="font-semibold">{Math.round(topProducts.reduce((sum, p) => sum + Number(p.orders), 0) / topProducts.length)} طلب</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">معدل النمو:</span>
                <span className="font-semibold text-green-600">+١٨٪</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>🎯</span> التوصيات
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">أضف منتجات موسمية</p>
              <p className="text-sm text-gray-600">حدث أسعار المنتجات القديمة</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>⚠️</span> تنبيهات
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">٣ منتجات بمخزون منخفض</p>
              <p className="text-sm text-gray-600">تحديث الأسعار مطلوب</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // محتوى الشركاء المحسن
  const renderPartnersContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* رأس قسم الشركاء */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🤝 إدارة الشركاء التجاريين</h1>
            <p className="text-green-100">شبكة قوية من الشراكات الاستراتيجية</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{(partners || []).length}</div>
            <div className="text-sm text-green-100">شريك نشط</div>
          </div>
        </div>
      </div>

      {/* إحصائيات الشراكات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">إجمالي الشركاء</p>
              <p className="text-2xl font-bold">{(partners || []).length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">الشراكات النشطة</p>
              <p className="text-2xl font-bold">{Math.max((partners || []).length - 2, 0)}</p>
            </div>
            <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">إيرادات الشراكات</p>
              <p className="text-2xl font-bold">١٢٥ك ر.س</p>
            </div>
            <div className="w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">معدل النمو</p>
              <p className="text-2xl font-bold">+٢٢٪</p>
            </div>
            <div className="w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* أدوات إدارة الشركاء */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Users className="w-6 h-6" />
              دليل الشركاء
            </h2>
            <p className="text-sm text-gray-600 mt-1">إدارة شاملة لجميع شراكاتك التجارية</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              title="فلتر حسب النوع"
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            >
              <option>جميع الأنواع</option>
              <option>تجار تجزئة</option>
              <option>موردين</option>
              <option>شركات شحن</option>
            </select>
            <select 
              title="ترتيب حسب"
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            >
              <option>الأحدث أولاً</option>
              <option>الأعلى إيراداً</option>
              <option>الأكثر نشاطاً</option>
            </select>
            <button
              onClick={() => setShowAddPartnerModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
            >
              <Plus className="w-4 h-4" />
              إضافة شريك جديد
            </button>
          </div>
        </div>

        {/* شبكة الشركاء */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(partners || []).map((partner: any, index: number) => (
            <motion.div 
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
            >
              {/* رأس بطاقة الشريك */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {partner.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{partner.name}</h3>
                    <p className="text-sm text-gray-600">شريك رقم: #{String(index + 1).padStart(3, '0')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button title="تعديل" className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button title="حذف" onClick={() => handleDeletePartner(partner.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* معلومات الشريك */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">النوع:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    partner.type === 'retailer' ? 'bg-blue-100 text-blue-800' :
                    partner.type === 'supplier' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {(function(t){
                      if(!t) return 'غير محدد';
                      switch(t){
                        case 'retailer': return 'تاجر تجزئة';
                        case 'supplier': return 'مورد';
                        case 'shipping_company': return 'شركة شحن';
                        default: return t;
                      }
                    })(partner.type)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">الإيرادات:</span>
                  <span className="font-bold text-green-600 text-lg">{partner.revenue || '—'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">التقييم:</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-300'}>⭐</span>
                    ))}
                    <span className="text-sm text-gray-600 ml-1">4.0</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">الحالة:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    نشط
                  </span>
                </div>

                {/* شريط أداء الشراكة */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">أداء الشراكة</span>
                    <span className="text-xs font-semibold text-green-600">85%</span>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-4/5 transition-all duration-500"></div>
                  </div>
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-2 px-4 rounded-lg hover:shadow-md transition-all duration-300 text-sm font-semibold">
                  عرض التفاصيل
                </button>
                <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg hover:shadow-md transition-all duration-300 text-sm font-semibold">
                  إرسال رسالة
                </button>
              </div>
            </motion.div>
          ))}

          {/* بطاقة إضافة شريك جديد */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (partners || []).length * 0.1 + 0.3 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-dashed border-green-300 rounded-xl p-8 text-center hover:bg-gradient-to-br hover:from-green-100 hover:to-emerald-100 transition-all duration-300 cursor-pointer"
            onClick={() => setShowAddPartnerModal(true)}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">إضافة شريك جديد</h3>
            <p className="text-gray-600 mb-4">وسع شبكة شراكاتك التجارية</p>
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
              ابدأ الآن
            </button>
          </motion.div>
        </div>

        {/* إحصائيات وتوصيات */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>📊</span> إحصائيات الشراكات
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">متوسط الإيرادات:</span>
                <span className="font-semibold">٤٢ك ر.س</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">معدل النجاح:</span>
                <span className="font-semibold text-green-600">٨٥٪</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>🎯</span> التوصيات
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">استكشف شراكات في مناطق جديدة</p>
              <p className="text-sm text-gray-600">راجع عقود الشراكة المنتهية</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>⚠️</span> تنبيهات
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">٢ عقود تحتاج تجديد</p>
              <p className="text-sm text-gray-600">مراجعة شراكة غير نشطة</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // محتوى التحليلات
  const renderAnalyticsContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <TrendingUp className="w-6 h-6" />
        التحليلات المتقدمة
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">نمو المبيعات</h3>
          <p className="text-3xl font-bold">+٢٥٪</p>
          <p className="text-sm opacity-80">هذا الشهر</p>
        </div>
        
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">رضا الشركاء</h3>
          <p className="text-3xl font-bold">٩٢٪</p>
          <p className="text-sm opacity-80">معدل الرضا</p>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">كفاءة التوريد</h3>
          <p className="text-3xl font-bold">٩٨٪</p>
          <p className="text-sm opacity-80">في الوقت المحدد</p>
        </div>
      </div>
      
      <div className="text-center py-10">
        <TrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">المزيد من التحليلات المتقدمة قادمة قريباً</p>
      </div>
    </motion.div>
  );

  // محتوى التقارير
  // محتوى التقارير المحسن
  const renderReportsContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* رأس قسم التقارير */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📋 التقارير والتحليلات</h1>
            <p className="text-blue-100">تقارير شاملة ومفصلة لجميع عمليات التوريد</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">١٢</div>
            <div className="text-sm text-blue-100">تقرير متاح</div>
          </div>
        </div>
      </div>

      {/* إحصائيات التقارير */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">تقارير هذا الشهر</p>
              <p className="text-2xl font-bold">٨</p>
            </div>
            <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">تقارير مجدولة</p>
              <p className="text-2xl font-bold">٤</p>
            </div>
            <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">⏰</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">تقارير مخصصة</p>
              <p className="text-2xl font-bold">٣</p>
            </div>
            <div className="w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">🎯</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">تقارير سنوية</p>
              <p className="text-2xl font-bold">٢</p>
            </div>
            <div className="w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">📅</span>
            </div>
          </div>
        </div>
      </div>

      {/* مجموعات التقارير */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <TrendingUp className="w-6 h-6" />
              مكتبة التقارير
            </h2>
            <p className="text-sm text-gray-600 mt-1">تقارير شاملة لجميع جوانب عملك</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              title="فلتر حسب النوع"
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option>جميع التقارير</option>
              <option>المالية</option>
              <option>المبيعات</option>
              <option>الشراكات</option>
              <option>الأداء</option>
            </select>
            <select 
              title="الفترة الزمنية"
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option>هذا الشهر</option>
              <option>آخر 3 شهور</option>
              <option>هذا العام</option>
              <option>مخصص</option>
            </select>
            <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold">
              <Plus className="w-4 h-4" />
              تقرير جديد
            </button>
          </div>
        </div>

        {/* شبكة التقارير */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* تقرير المبيعات */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white text-xl">
                📊
              </div>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">جديد</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">تقرير المبيعات الشهري</h3>
            <p className="text-sm text-gray-600 mb-4">تحليل شامل لجميع المبيعات والأرباح خلال الشهر الحالي</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">آخر تحديث:</span>
              <span className="text-sm font-semibold">اليوم</span>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-lg hover:shadow-md transition-all duration-300 font-semibold">
              عرض التقرير
            </button>
          </motion.div>

          {/* تقرير الشركاء */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-xl">
                🤝
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">أسبوعي</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">تقرير الشراكات</h3>
            <p className="text-sm text-gray-600 mb-4">أداء الشراكات التجارية ومعدلات النجاح والإيرادات</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">آخر تحديث:</span>
              <span className="text-sm font-semibold">أمس</span>
            </div>
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:shadow-md transition-all duration-300 font-semibold">
              عرض التقرير
            </button>
          </motion.div>

          {/* تقرير الأرباح */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-xl">
                💰
              </div>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold">شهري</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">تقرير الأرباح والخسائر</h3>
            <p className="text-sm text-gray-600 mb-4">تحليل مالي مفصل للأرباح والتكاليف والهوامش الربحية</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">آخر تحديث:</span>
              <span className="text-sm font-semibold">٣ أيام</span>
            </div>
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg hover:shadow-md transition-all duration-300 font-semibold">
              عرض التقرير
            </button>
          </motion.div>

          {/* تقرير الأداء */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-xl">
                📈
              </div>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold">ربعي</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">تقرير الأداء الشامل</h3>
            <p className="text-sm text-gray-600 mb-4">مؤشرات الأداء الرئيسية ومقارنات دورية شاملة</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">آخر تحديث:</span>
              <span className="text-sm font-semibold">أسبوع</span>
            </div>
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg hover:shadow-md transition-all duration-300 font-semibold">
              عرض التقرير
            </button>
          </motion.div>

          {/* تقرير الطلبات */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
                🛒
              </div>
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-semibold">يومي</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">تقرير الطلبات اليومي</h3>
            <p className="text-sm text-gray-600 mb-4">إحصائيات الطلبات وحالات التنفيذ والتسليم</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">آخر تحديث:</span>
              <span className="text-sm font-semibold">الآن</span>
            </div>
            <button className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-md transition-all duration-300 font-semibold">
              عرض التقرير
            </button>
          </motion.div>

          {/* تقرير مخصص جديد */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 transition-all duration-300 cursor-pointer"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">إنشاء تقرير مخصص</h3>
            <p className="text-gray-600 mb-4">أنشئ تقريراً حسب احتياجاتك الخاصة</p>
            <button className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
              ابدأ الإنشاء
            </button>
          </motion.div>
        </div>

        {/* إحصائيات سريعة وتوصيات */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>📊</span> إحصائيات التقارير
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">تقارير هذا الشهر:</span>
                <span className="font-semibold">٨ تقرير</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">متوسط الاستخدام:</span>
                <span className="font-semibold text-green-600">٨٥٪</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>🎯</span> التوصيات
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">جدولة تقارير آلية</p>
              <p className="text-sm text-gray-600">إنشاء تقارير مقارنة سنوية</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>⚠️</span> تنبيهات
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">تقرير مستحق التجديد</p>
              <p className="text-sm text-gray-600">تحديث بيانات مطلوب</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // محتوى الإعدادات
  // محتوى الإعدادات المحسن
  const renderSettingsContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* رأس قسم الإعدادات */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">⚙️ إعدادات النظام</h1>
            <p className="text-gray-100">تخصيص وإدارة جميع إعدادات لوحة التحكم</p>
          </div>
          <div className="text-right">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300"
            >
              إعدادات متقدمة
            </button>
          </div>
        </div>
      </div>

      {/* تبويبات الإعدادات */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-wrap gap-4 p-6 border-b border-gray-200">
          <button className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg font-semibold shadow-lg">
            ⚙️ عام
          </button>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            📧 الإشعارات
          </button>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            🔒 الأمان
          </button>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            📊 التفضيلات
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* الإعدادات العامة */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🔧</span> الإعدادات العامة
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-blue-200">
                    <div>
                      <span className="font-semibold text-gray-800">الإشعارات المباشرة</span>
                      <p className="text-sm text-gray-600">تلقي الإشعارات فور حدوث الأحداث</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" defaultChecked className="sr-only" />
                      <div className="w-12 h-6 bg-green-400 rounded-full shadow-inner cursor-pointer">
                        <div className="w-6 h-6 bg-white rounded-full shadow transform translate-x-6 transition-transform"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-blue-200">
                    <div>
                      <span className="font-semibold text-gray-800">التنبيهات الصوتية</span>
                      <p className="text-sm text-gray-600">تشغيل الأصوات للتنبيهات المهمة</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="w-12 h-6 bg-gray-300 rounded-full shadow-inner cursor-pointer">
                        <div className="w-6 h-6 bg-white rounded-full shadow transition-transform"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <span className="font-semibold text-gray-800">الوضع المظلم</span>
                      <p className="text-sm text-gray-600">تفعيل الثيم المظلم للواجهة</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="w-12 h-6 bg-gray-300 rounded-full shadow-inner cursor-pointer">
                        <div className="w-6 h-6 bg-white rounded-full shadow transition-transform"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📦</span> إعدادات التوريد
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">الحد الأدنى للطلب (ريال)</label>
                    <input 
                      type="number" 
                      className="w-full border border-green-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                      defaultValue="100"
                      placeholder="أدخل الحد الأدنى"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">مدة التسليم (أيام)</label>
                    <input 
                      type="number" 
                      className="w-full border border-green-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                      defaultValue="3"
                      placeholder="أدخل مدة التسليم"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">مناطق التوريد</label>
                    <select className="w-full border border-green-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white">
                      <option>جميع المناطق</option>
                      <option>الرياض فقط</option>
                      <option>المنطقة الوسطى</option>
                      <option>مخصص</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* معلومات الشركة والتفضيلات */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🏢</span> معلومات الشركة
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">اسم الشركة</label>
                    <input 
                      type="text" 
                      className="w-full border border-purple-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      defaultValue="شركة التوريد المتقدمة"
                      placeholder="أدخل اسم الشركة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">رقم الهاتف</label>
                    <input 
                      type="tel" 
                      className="w-full border border-purple-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      defaultValue="966512345678+"
                      placeholder="أدخل رقم الهاتف"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      className="w-full border border-purple-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      defaultValue="info@supplier.com"
                      placeholder="أدخل البريد الإلكتروني"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">العنوان</label>
                    <textarea 
                      className="w-full border border-purple-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      rows={3}
                      defaultValue="الرياض، المملكة العربية السعودية"
                      placeholder="أدخل العنوان الكامل"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🎨</span> تفضيلات العرض
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">لغة الواجهة</label>
                    <select className="w-full border border-orange-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white">
                      <option>العربية</option>
                      <option>English</option>
                      <option>Français</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">المنطقة الزمنية</label>
                    <select className="w-full border border-orange-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white">
                      <option>توقيت الرياض (GMT+3)</option>
                      <option>توقيت جرينتش (GMT)</option>
                      <option>توقيت نيويورك (GMT-5)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">تنسيق التاريخ</label>
                    <select className="w-full border border-orange-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">عملة العرض</label>
                    <select className="w-full border border-orange-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white">
                      <option>ريال سعودي (SAR)</option>
                      <option>دولار أمريكي (USD)</option>
                      <option>يورو (EUR)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* أزرار الحفظ والإعدادات المتقدمة */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
              <span>💾</span> حفظ الإعدادات
            </button>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
              <span>🔄</span> استعادة الافتراضية
            </button>
            <button className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
              <span>📤</span> تصدير الإعدادات
            </button>
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
              <span>📥</span> استيراد الإعدادات
            </button>
          </div>
        </div>
      </div>

      {/* إحصائيات النظام */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>📊</span> إحصائيات النظام
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">وقت التشغيل:</span>
              <span className="font-semibold">٩٩.٨٪</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">آخر تحديث:</span>
              <span className="font-semibold">اليوم</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>🔒</span> الأمان والخصوصية
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">المصادقة الثنائية:</span>
              <span className="font-semibold text-green-600">مفعلة</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">التشفير:</span>
              <span className="font-semibold text-green-600">SSL/TLS</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>⚠️</span> تنبيهات النظام
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">نسخ احتياطي مجدول</p>
            <p className="text-sm text-gray-600">تحديث الأمان متاح</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // محتوى طلبات الشحن
  const renderShippingContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span>🚚</span> طلبات الشحن - المورد
          </h2>
          <button
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 transition-all flex items-center gap-2"
            title="إضافة طلب شحن جديد"
            onClick={() => setShowShippingOrderModal(true)}
          >
            <Truck className="w-5 h-5" />
            طلب شحن جديد
          </button>
        </div>

        <div className="space-y-4">
          {shippingOrders.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد طلبات شحن حالياً</h3>
              <p className="text-gray-500">اضغط على زر "طلب شحن جديد" لإنشاء أول طلب شحن</p>
            </div>
          ) : (
            shippingOrders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800">{order.customerName || 'طلب شحن'}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">الهاتف:</span> {order.customerPhone || order.contactPhone || 'غير محدد'}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'picked_up' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'in_transit' ? 'bg-orange-100 text-orange-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status === 'pending' ? 'قيد الانتظار' :
                         order.status === 'assigned' ? 'تم التعيين' :
                         order.status === 'picked_up' ? 'تم الاستلام' :
                         order.status === 'in_transit' ? 'في الطريق' :
                         order.status === 'delivered' ? 'تم التوصيل' :
                         'ملغي'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mt-2">
                      <p><span className="font-medium">الوصف:</span> {order.packageDescription}</p>
                      <p><span className="font-medium">من:</span> {order.pickupAddress || 'غير محدد'}</p>
                      <p><span className="font-medium">إلى:</span> {order.destination}</p>
                      <p><span className="font-medium">القيمة:</span> {order.value} ريال</p>
                      {order.cashOnDelivery && (
                        <p><span className="font-medium">💰 الدفع عند الاستلام:</span> {order.codAmount} ريال</p>
                      )}
                      {order.notes && (
                        <p><span className="font-medium">ملاحظات:</span> {order.notes}</p>
                      )}
                    </div>

                    {order.publishToMarketplace && (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                          منشور في السوق ({order.publishScope})
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-1">
                      <button 
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                        title="تعديل الطلب"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md"
                        title="إلغاء الطلب"
                        onClick={() => {
                          if (window.confirm('هل أنت متأكد من إلغاء طلب الشحن؟')) {
                            storage.deleteShippingOrder(order.id);
                            setShippingOrders(storage.getShippingOrders());
                            toast.success('تم إلغاء طلب الشحن');
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );

  // محتوى التحليلات المتقدمة - يدمج التوقعات والفرص والتحليلات
  const renderAdvancedAnalyticsContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* رأس القسم */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📊 التحليلات المتقدمة</h1>
            <p className="text-blue-100">توقعات السوق، الفرص المتاحة، والتحليلات الذكية</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">+٢٥٪</div>
            <div className="text-sm text-blue-100">نمو متوقع</div>
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">دقة التوقعات</p>
              <p className="text-2xl font-bold">٩٢٪</p>
            </div>
            <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">🎯</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">الفرص النشطة</p>
              <p className="text-2xl font-bold">١٥</p>
            </div>
            <div className="w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">🚀</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">العائد المتوقع</p>
              <p className="text-2xl font-bold">٨٥ك ر.س</p>
            </div>
            <div className="w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm">مؤشر النمو</p>
              <p className="text-2xl font-bold">+١٨٪</p>
            </div>
            <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* التبويبات الفرعية */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex flex-wrap gap-4 mb-6 border-b border-gray-200 pb-4">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg">
            📊 نظرة شاملة
          </button>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            🔮 توقعات السوق
          </button>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            🎯 الفرص المتاحة
          </button>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            📈 تحليلات الأداء
          </button>
        </div>

        {/* المحتوى المدمج */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* توقعات السوق */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🔮</span> توقعات السوق
            </h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">المواد الغذائية الأساسية</h4>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">+١٥٪</span>
                </div>
                <p className="text-sm text-gray-600">ازدياد الطلب متوقع الشهر القادم</p>
                <div className="mt-2 bg-green-100 h-2 rounded-full">
                  <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">المنتجات الموسمية</h4>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">+٢٥٪</span>
                </div>
                <p className="text-sm text-gray-600">موسم الأعياد يزيد الطلب</p>
                <div className="mt-2 bg-green-100 h-2 rounded-full">
                  <div className="bg-green-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* الفرص المتاحة */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🎯</span> الفرص المتاحة
            </h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">شراكة مع موردين محليين</h4>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">عالية</span>
                </div>
                <p className="text-sm text-gray-600">عائد متوقع: ٤٥,٠٠٠ ريال</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-500">معدل النجاح:</span>
                  <div className="bg-purple-100 h-2 rounded-full flex-1">
                    <div className="bg-purple-500 h-2 rounded-full w-4/5"></div>
                  </div>
                  <span className="text-xs font-semibold text-purple-600">٨٥٪</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">توسع جغرافي جديد</h4>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">متوسطة</span>
                </div>
                <p className="text-sm text-gray-600">عائد متوقع: ٣٢,٠٠٠ ريال</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-500">معدل النجاح:</span>
                  <div className="bg-purple-100 h-2 rounded-full flex-1">
                    <div className="bg-purple-500 h-2 rounded-full w-3/5"></div>
                  </div>
                  <span className="text-xs font-semibold text-purple-600">٧٢٪</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* مخططات التحليلات */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📊</span> نمو المبيعات
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">+٢٥٪</div>
              <p className="text-sm text-gray-600">مقارنة بالشهر الماضي</p>
              <div className="mt-4 bg-green-100 h-2 rounded-full">
                <div className="bg-green-500 h-2 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🤝</span> رضا الشركاء
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">٩٢٪</div>
              <p className="text-sm text-gray-600">معدل الرضا العام</p>
              <div className="mt-4 bg-blue-100 h-2 rounded-full">
                <div className="bg-blue-500 h-2 rounded-full w-5/6 animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>⚡</span> كفاءة التوريد
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">٩٨٪</div>
              <p className="text-sm text-gray-600">في الوقت المحدد</p>
              <div className="mt-4 bg-orange-100 h-2 rounded-full">
                <div className="bg-orange-500 h-2 rounded-full w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* توصيات ذكية */}
        <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🤖</span> التوصيات الذكية
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">١</div>
                <div>
                  <h4 className="font-semibold text-gray-800">زيادة مخزون المواد الغذائية</h4>
                  <p className="text-sm text-gray-600 mt-1">بناءً على توقعات الطلب المتزايد</p>
                  <span className="inline-block mt-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">أولوية عالية</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">٢</div>
                <div>
                  <h4 className="font-semibold text-gray-800">استكشاف شراكات جديدة</h4>
                  <p className="text-sm text-gray-600 mt-1">فرص متاحة للتوسع في السوق المحلي</p>
                  <span className="inline-block mt-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">أولوية متوسطة</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
            <span>📊</span> عرض التقرير الكامل
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
            <span>⬇️</span> تصدير البيانات
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
            <span>🔔</span> إعداد تنبيهات
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <NotificationProvider userType="supplier" userName="المورد الموثوق">
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 flex">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed md:relative 
          top-0 left-0 h-full 
          w-64 bg-white shadow-lg flex flex-col 
          transform transition-transform duration-300 ease-in-out z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 opacity-10"></div>
            <div className="relative p-6 border-b border-green-100">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    لوحة تحكم المورد
                  </h1>
                </div>
                <p className="text-sm text-gray-600 mr-13">
                إدارة التوريد والشراكات 🤝
              </p>
            </motion.div>
          </div>
        </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {[
                { key: 'overview', label: 'نظرة عامة', icon: '📊' },
                { key: 'orders', label: 'الطلبات الواردة', icon: '🛒' },
                { key: 'shipping', label: 'طلبات الشحن', icon: '🚚' },
                { key: 'products', label: 'المنتجات', icon: '🏷️' },
                { key: 'analytics', label: 'التحليلات المتقدمة', icon: '📈' },
                { key: 'partners', label: 'الشركاء', icon: '🤝' },
                { key: 'reports', label: 'التقارير', icon: '📋' },
                { key: 'settings', label: 'الإعدادات', icon: '⚙️' }
              ].map((tab) => (
                <motion.button
                  key={tab.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-right ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="flex-1 text-right">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </nav>

          {/* Period Selector and Quick Actions in Sidebar */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الفترة الزمنية</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                aria-label="اختر الفترة"
                title="اختيار الفترة"
              >
                <option value="اليوم">اليوم</option>
                <option value="الأسبوع">الأسبوع</option>
                <option value="الشهر">الشهر</option>
                <option value="السنة">السنة</option>
              </select>
            </div>
            
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={action.onClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 ${action.color} text-white rounded-lg font-semibold transition-all duration-200 text-sm`}
                >
                  {action.icon}
                  <span className="text-xs">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 pt-16 md:pt-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && renderOverviewContent()}
              {activeTab === 'orders' && renderOrdersContent()}
              {activeTab === 'shipping' && renderShippingContent()}
              {activeTab === 'products' && renderProductsContent()}
              {activeTab === 'analytics' && renderAdvancedAnalyticsContent()}
              {activeTab === 'partners' && renderPartnersContent()}
              {activeTab === 'reports' && renderReportsContent()}
              {activeTab === 'settings' && renderSettingsContent()}
            </AnimatePresence>
          </div>
        </div>

        {/* النوافذ المنبثقة */}
        <AnimatePresence>
          {showAddProductModal && (
            <AddProductModal
              isOpen={showAddProductModal}
              onClose={() => setShowAddProductModal(false)}
              onAdd={(product) => {
                try {
                  const saved = storage.addProduct({
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    category: product.category,
                    description: product.description,
                    images: product.images || [],
                    sku: product.sku || '',
                    weight: product.weight || '',
                    dimensions: product.dimensions || '',
                    status: product.status || 'active'
                  });
                  const user = auth?.user;
                  storage.addMarketItem({
                    name: saved.name,
                    price: saved.price,
                    stock: saved.stock,
                    category: saved.category,
                    description: saved.description,
                    images: saved.images || [],
                    sku: saved.sku || '',
                    weight: saved.weight || '',
                    dimensions: saved.dimensions || '',
                    status: saved.status,
                    type: 'product',
                    provider: {
                      id: user?.id || 'unknown_provider',
                      name: user?.companyName || user?.name || 'مزود غير معروف',
                      type: user?.role === 'shipping_company' ? 'shipping_company' : (user?.role === 'supplier' ? 'supplier' : 'merchant')
                    }
                  });
                } catch (err) {
                  console.error('خطأ في حفظ المنتج:', err);
                } finally {
                  setShowAddProductModal(false);
                }
              }}
            />
          )}

          {showAddPartnerModal && (
            <AddPartnerModal
              isOpen={showAddPartnerModal}
              onClose={() => setShowAddPartnerModal(false)}
              onSubmit={(partnerData) => {
                try {
                  storage.addPartner(partnerData);
                  setPartners(storage.getPartners());
                  toast.success('✅ تم إضافة الشريك بنجاح');
                } catch (error) {
                  console.error('خطأ في إضافة الشريك:', error);
                  toast.error('حدث خطأ أثناء إضافة الشريك');
                } finally {
                  setShowAddPartnerModal(false);
                }
              }}
            />
          )}

          {showAddOrderModal && (
            <AddOrderModal isOpen={showAddOrderModal} onClose={() => setShowAddOrderModal(false)} onAdd={(order) => { console.log('تم تسجيل عملية توريد جديدة:', order); setShowAddOrderModal(false); }} />
          )}

          {showAddCategoryModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-bold mb-4">إضافة فئة جديدة</h2>
                <div className="space-y-4">
                  <input type="text" placeholder="اسم الفئة" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  <textarea placeholder="وصف الفئة" className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20" />
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowAddCategoryModal(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg">إلغاء</button>
                  <button onClick={() => { setShowAddCategoryModal(false); }} className="flex-1 bg-orange-600 text-white py-2 rounded-lg">إضافة</button>
                </div>
              </motion.div>
            </div>
          )}

          {showTeamModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
                <h2 className="text-xl font-bold mb-4">إدارة الفريق</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <button title="تعديل" className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit className="w-4 h-4" /></button>
                        <button title="حذف" onClick={() => handleDeleteTeamMember(member.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowTeamModal(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg">إغلاق</button>
                  <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg">إضافة عضو جديد</button>
                </div>
              </motion.div>
            </div>
          )}

          {showSettingsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">الإعدادات المتقدمة</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">إعدادات الأمان</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /><span className="text-sm">تفعيل المصادقة الثنائية</span></label>
                      <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /><span className="text-sm">تسجيل جميع العمليات</span></label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">إعدادات النسخ الاحتياطي</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="rounded" /><span className="text-sm">نسخ احتياطي يومي</span></label>
                      <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /><span className="text-sm">نسخ احتياطي تلقائي</span></label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowSettingsModal(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg">إلغاء</button>
                  <button onClick={() => { setShowSettingsModal(false); console.log('تم حفظ الإعدادات'); }} className="flex-1 bg-gray-600 text-white py-2 rounded-lg">حفظ الإعدادات</button>
                </div>
              </motion.div>
            </div>
          )}

          {showShippingOrderModal && (
            <AddShippingOrderModal
              isOpen={showShippingOrderModal}
              onClose={() => setShowShippingOrderModal(false)}
              onAdd={(orderData) => {
                try {
                  storage.addShippingOrder({
                    ...orderData,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                  });
                  setShippingOrders(storage.getShippingOrders());
                  toast.success('✅ تم إضافة طلب الشحن بنجاح');
                } catch (error) {
                  console.error('خطأ في إضافة طلب الشحن:', error);
                  toast.error('حدث خطأ أثناء إضافة طلب الشحن');
                } finally {
                  setShowShippingOrderModal(false);
                }
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </NotificationProvider>
  );
};

export default SupplierDashboard;