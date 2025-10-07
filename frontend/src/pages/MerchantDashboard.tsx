import { useState, useEffect } from 'react';
import NotificationProvider from '../components/NotificationProvider';
import MarketPredictions from '../components/MarketPredictions';
import MarketOpportunities from '../components/MarketOpportunities';
// Chat is handled globally via header + ChatController in App.tsx
// Floating chat button removed to avoid duplicate chat instances
import AddOrderWizard from '../components/AddOrderWizard';
import AddPartnerModal from '../components/supplier/AddPartnerModal';
import AssignOrderModal from '../components/AssignOrderModal';
import { storage } from '../utils/localStorage';
import { useAuth } from '../contexts/AuthContext';
import type { MarketItem, MerchantOrder, ShippingService, Partner } from '../utils/localStorage';
import { motion } from 'framer-motion';
import { Package, Target, Truck, Heart, Plus, Users, ShoppingCart, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';

function MerchantDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  // chat state moved to global ChatController
  const [selectedPeriod, setSelectedPeriod] = useState('الشهر');
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [merchantOrders, setMerchantOrders] = useState<MerchantOrder[]>([]);
  const [shippingServices, setShippingServices] = useState<ShippingService[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [showAssignOrderModal, setShowAssignOrderModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const auth = useAuth();

  // بيانات تجريبية للمنتجات الأكثر طلباً
  const topProducts = [
    {
      name: 'هواتف ذكية عالية الأداء',
      sales: 145,
      revenue: '1,234,500 ريال',
      rating: 4.8,
      stock: 23
    },
    {
      name: 'ملابس رياضية متنوعة',
      sales: 89,
      revenue: '311,500 ريال',
      rating: 4.6,
      stock: 12
    },
    {
      name: 'أجهزة إلكترونية منزلية',
      sales: 234,
      revenue: '105,300 ريال',
      rating: 4.9,
      stock: 75
    }
  ];

  // تحميل البيانات من localStorage
  useEffect(() => {
    const items = storage.getMarketItems();
    const orders = storage.getMerchantOrders();
    const services = storage.getShippingServices();
    const partners = storage.getPartners();
    const savedFavorites = localStorage.getItem('merchantFavorites');

    setMarketItems(items);
    setMerchantOrders(orders);
    setShippingServices(services);
    setPartners(partners);

    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // حفظ المفضلة في localStorage
  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('merchantFavorites', JSON.stringify([...newFavorites]));
  };

  // إنشاء طلب من منتج في السوق
  const createOrderFromItem = (item: MarketItem) => {
    setSelectedItem(item);
    setSelectedItem(item);
    setShowOrderModal(true);
  };

  // معالج إضافة طلب جديد من النموذج
  const handleAddOrder = (orderData: any) => {
    // Normalize fields coming from AddOrderModal
    console.log('تم إضافة طلب جديد (raw):', orderData);

    // Support both 'partner' (shipping) payload and 'market' payload emitted by AddOrderModal.
    const isMarket = Boolean(orderData.publishToMarketplace);

    // Normalize core fields with fallbacks from either payload shape
    const title = (orderData.title || orderData.marketTitle || orderData.packageDescription) || `طلب من ${orderData.merchant || 'التاجر'}`;
    const description = isMarket
      ? (orderData.details || orderData.marketDetails || `كمية: ${orderData.marketQuantity || 1}`)
      : `العميل: ${orderData.customerName || ''} • ${orderData.customerPhone || ''}`;
    const category = orderData.category || orderData.marketCategory || orderData.merchant || 'عام';
    // If caller provided products (multi-item), use them; otherwise fallback to single inferred item or value
    const products = orderData.products && Array.isArray(orderData.products) ? orderData.products.map((p: any) => ({
      productId: p.productId || '',
      name: p.name || 'منتج',
      price: Number(p.price) || 0,
      quantity: Number(p.quantity) || 1
    })) : (orderData.originalItemId ? [
      {
        productId: orderData.originalItemId,
        name: selectedItem?.name || orderData.packageDescription || orderData.title || 'منتج',
        price: Number(orderData.value) || 0,
        quantity: Number(orderData.quantity || 1)
      }
    ] : undefined);

  const budget = products && products.length > 0 ? products.reduce((s: number, p: any) => s + (Number(p.price) || 0) * (Number(p.quantity) || 1), 0) : (Number(orderData.value || 0) || 0);

    const newOrder: Omit<MerchantOrder, 'id' | 'createdAt'> = {
      title,
      description,
      category,
      budget,
      deadline: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
      status: 'open',
      merchant: { id: 'current-merchant', name: orderData.merchant || 'التاجر' },
      products,
      shippingServiceId: orderData.shippingServiceId || null,
      publishedAt: null
    };

    // If modal requested publishing to marketplace, save and publish immediately
    if (isMarket) {
      const saved = storage.addMerchantOrder(newOrder);
      publishOrderToMarketplace({ ...saved });
      setMerchantOrders(prev => [...prev, saved]);
      toast.success('✅ تم إنشاء ونشر الطلب في السوق');
      return;
    }

    const saved = storage.addMerchantOrder(newOrder);
    setMerchantOrders(prev => [...prev, saved]);
    toast.success('✅ تم إنشاء الطلب بنجاح');

    // If shipping service selected, we can attach a simple note to localStorage (shipping jobs not modeled fully)
    if (orderData.shippingServiceId) {
      const svc = storage.getShippingServices().find(s => s.id === orderData.shippingServiceId);
      console.log('سيتم إرسال الطلب عبر خدمة الشحن:', svc?.name || orderData.shippingServiceId);
      // store a lightweight mapping for visibility
      const jobs = JSON.parse(localStorage.getItem('business_shipping_jobs') || '[]');
      jobs.push({ orderId: saved.id, serviceId: orderData.shippingServiceId, createdAt: new Date().toISOString() });
      localStorage.setItem('business_shipping_jobs', JSON.stringify(jobs));
      
      // إشعار المستخدم بأن الطلب تم تعيينه لشريك شحن
      toast.success(`🚚 تم تعيين الطلب لشريك الشحن: ${svc?.name || 'غير محدد'}`);
    }

    setShowOrderModal(false);
    // update local storage mirror used elsewhere
    localStorage.setItem('merchantOrders', JSON.stringify(storage.getMerchantOrders()));
  };

  // إحصائيات محسنة
  const stats = [
    {
      label: 'منتجات متاحة',
      value: marketItems.length,
      icon: <Package className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-100',
      trend: 'up',
      change: '+10%',
      description: 'منتجات الموردين في السوق'
    },
    {
      label: 'طلبات نشطة',
      value: merchantOrders.filter(o => o.status === 'open').length,
      icon: <Target className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-green-100',
      trend: 'up',
      change: '+8%',
      description: 'طلباتك المفتوحة'
    },
    {
      label: 'خدمات الشحن',
      value: shippingServices.length,
      icon: <Truck className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600',
      bgColor: 'bg-purple-100',
      trend: 'up',
      change: '+12%',
      description: 'خدمات الشحن المتاحة'
    },
    {
      label: 'المفضلة',
      value: favorites.size,
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-red-100 text-red-600',
      bgColor: 'bg-red-100',
      trend: 'up',
      change: '+5%',
      description: 'المنتجات المفضلة لديك'
    }
  ];

  // نشر طلب التاجر كسجل في السوق
  const publishOrderToMarketplace = (order: MerchantOrder) => {
    // Avoid republishing the same order
    const published = JSON.parse(localStorage.getItem('merchant_published_orders') || '[]');
    if (published.find((p: any) => p.orderId === order.id)) {
      toast('هذا الطلب منشور بالفعل', { icon: 'ℹ️' });
      return;
    }

    const marketItem = storage.addMarketItem({
      name: order.title,
      price: order.budget,
      stock: 1,
      category: order.category,
      description: order.description,
      images: [],
      sku: `MKT-${order.id}`,
      weight: '',
      dimensions: '',
      status: 'active',
      type: 'product',
      provider: {
        id: order.merchant.id,
        name: order.merchant.name,
        type: 'merchant'
      }
    });
    // ضع علامة في localStorage أن هذا الطلب نُشر
    published.push({ orderId: order.id, marketItemId: marketItem.id, publishedAt: new Date().toISOString() });
    localStorage.setItem('merchant_published_orders', JSON.stringify(published));
    toast.success('✅ تم نشر الطلب في السوق');

    // تحديث سجل الطلب نفسه مع publishedAt
    const updated = storage.updateMerchantOrder(order.id, { publishedAt: new Date().toISOString() });
    if (updated) {
      setMerchantOrders(prev => prev.map(o => o.id === order.id ? updated : o));
    } else {
      // fallback: trigger a refresh
      setMerchantOrders(storage.getMerchantOrders());
    }
  };

  // دوال مساعدة للحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'مفتوح';
      case 'in_progress': return 'قيد التنفيذ';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return 'غير محدد';
    }
  };

  // دالة لتعيين طلب لشريك شحن
  const assignOrderToPartner = (orderId: string, partnerId: string) => {
    try {
      // تحديث الطلب بإضافة معرف خدمة الشحن
      const updated = storage.updateMerchantOrder(orderId, { shippingServiceId: partnerId });
      if (updated) {
        setMerchantOrders(prev => prev.map(order => order.id === orderId ? updated : order));
        
        // تسجيل مهمة الشحن في localStorage
        const jobs = JSON.parse(localStorage.getItem('business_shipping_jobs') || '[]');
        jobs.push({ orderId, serviceId: partnerId, createdAt: new Date().toISOString() });
        localStorage.setItem('business_shipping_jobs', JSON.stringify(jobs));
        
        // إشعار المستخدم
        const partner = shippingServices.find(s => s.id === partnerId);
        toast.success(`🚚 تم تعيين الطلب لشريك الشحن: ${partner?.name || 'غير محدد'}`);
      }
    } catch (error) {
      console.error('فشل في تعيين الطلب لشريك الشحن:', error);
      toast.error('حدث خطأ أثناء تعيين الطلب لشريك الشحن');
    }
  };

  // دالة لفتح نافذة تعيين الطلب
  const openAssignOrderModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowAssignOrderModal(true);
  };

  // دالة لإلغاء طلب
  const cancelOrder = (orderId: string) => {
    try {
      const updated = storage.updateMerchantOrder(orderId, { status: 'cancelled' });
      if (updated) {
        setMerchantOrders(prev => prev.map(order => order.id === orderId ? updated : order));
        toast.success('✅ تم إلغاء الطلب بنجاح');
      }
    } catch (error) {
      console.error('فشل في إلغاء الطلب:', error);
      toast.error('حدث خطأ أثناء إلغاء الطلب');
    }
  };

  // دوال مساعدة للشركاء
  const handleAddPartner = (partnerData: any) => {
    const payload: Omit<Partner, 'id' | 'createdAt'> = {
      name: (partnerData.businessName || partnerData.contactPerson || 'شريك جديد').trim(),
      email: (partnerData.email || '').trim(),
      phone: (partnerData.phone || '').trim(),
      type: (partnerData.partnerType || '').trim(),
      city: (partnerData.city || '').trim(),
      category: (partnerData.category || '').trim()
    };

    // تحقق من عدم وجود شريك مكرر
    const existing = storage.getPartners();
    const dup = existing.find(p => {
      const sameEmail = payload.email && p.email && p.email.toLowerCase() === payload.email.toLowerCase();
      const samePhone = payload.phone && p.phone && p.phone === payload.phone;
      const sameName = payload.name && p.name && p.name.toLowerCase() === payload.name.toLowerCase();
      return sameEmail || samePhone || sameName;
    });

    if (dup) {
      toast.error('الشريك موجود بالفعل');
      return;
    }

    try {
      const added = storage.addPartner(payload);
      setPartners(prev => [added, ...prev]);
      toast.success('تم إضافة الشريك بنجاح');
    } catch (err) {
      console.error('فشل في إضافة الشريك', err);
      toast.error('حدث خطأ أثناء إضافة الشريك');
    }
  };

  const handleDeletePartner = (partnerId: string) => {
    const ok = storage.deletePartner(partnerId);
    if (ok) {
      setPartners(prev => prev.filter(p => p.id !== partnerId));
      toast.success('تم حذف الشريك');
    }
  };

  return (
      <NotificationProvider userType="merchant" userName="التاجر المميز">
        <div className="min-h-screen bg-gray-50 flex">
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
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-emerald-600 opacity-10"></div>
              <div className="relative p-6 border-b border-purple-100">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                      لوحة تحكم التاجر
                    </h1>
                  </div>
                  <p className="text-sm text-gray-600 mr-13">
                  إدارة متجرك وطلباتك 📊
                </p>
              </motion.div>
            </div>
          </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {[ 
                  { id: 'overview', label: 'نظرة عامة', icon: '📊' },
                  { id: 'orders', label: 'الطلبات والشحنات', icon: '📦' },
                  { id: 'partners', label: 'الشركاء', icon: '🤝' },
                  { id: 'predictions', label: 'توقعات السوق', icon: '🔮' },
                  { id: 'opportunities', label: 'الفرص المتاحة', icon: '🎯' },
                  { id: 'analytics', label: 'التحليلات', icon: '📈' }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-right ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-emerald-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="flex-1 text-right">{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </nav>

            {/* Period Selector in Sidebar */}
            <div className="p-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">الفترة الزمنية</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                aria-label="اختر الفترة"
              >
                <option value="اليوم">اليوم</option>
                <option value="الأسبوع">الأسبوع</option>
                <option value="الشهر">الشهر</option>
                <option value="السنة">السنة</option>
              </select>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 pt-16 md:pt-6 overflow-auto">
            <div className="max-w-6xl mx-auto">

          {/* Stats Cards مع تحسينات بصرية */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${stat.bgColor} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-opacity-20 hover:scale-105 cursor-pointer group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-sm font-semibold ${stat.color} flex items-center gap-1`}>
                        {stat.trend === 'up' ? '📈' : '📉'} {stat.change}
                      </span>
                      <span className="text-xs text-gray-500">من {selectedPeriod} الماضي</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl bg-white bg-opacity-70 group-hover:scale-110 transition-transform ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* محتوى التبويبات */}
          {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2 bg-card rounded-xl p-6 card-shadow"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground font-heading">
                  الطلبات الأخيرة
                </h2>
                <button className="text-primary hover:text-primary/80 transition-colors font-arabic text-sm">
                  عرض جميع الطلبات
                </button>
              </div>
              <div className="space-y-4">
                {merchantOrders.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">لا توجد طلبات حتى الآن.</div>
                ) : (
                  merchantOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-foreground font-arabic">
                              {order.title}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              #{order.id}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground font-arabic mb-1">
                            {order.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="font-arabic">الميزانية: {order.budget} ريال</span>
                            <span className="font-arabic">الموعد النهائي: {new Date(order.deadline).toLocaleDateString('ar-SA')}</span>
                          </div>
                          <div className="text-xs text-blue-600 mt-1">الفئة: {order.category}</div>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-foreground font-heading mb-2">
                            {order.status === 'open' ? 'مفتوح' : order.status === 'in_progress' ? 'قيد التنفيذ' : order.status === 'completed' ? 'مكتمل' : 'ملغي'}
                          </p>
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-arabic ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          <div className="mt-3 flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => publishOrderToMarketplace(order)}
                              className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg hover:opacity-90"
                            >
                              نشر في السوق
                            </button>
                            <button
                              type="button"
                              onClick={() => { setSelectedItem(null); setShowOrderModal(true); /* فتح نافذة التعديل/نسخ الطلب */ }}
                              className="text-sm border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50"
                            >
                              تعديل/إرسال
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Top Products & Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              {/* Top Products */}
              <div className="bg-card rounded-xl p-6 card-shadow">
                <h3 className="text-lg font-semibold text-foreground font-heading mb-4">
                  أفضل المنتجات مبيعًا
                </h3>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 hover:bg-muted/30 rounded-lg transition-colors">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{product.sales} مبيعات</span>
                          <span>⭐ {product.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          {product.revenue}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.stock} في المخزون
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card rounded-xl p-6 card-shadow">
                <h3 className="text-lg font-semibold text-foreground font-heading mb-4">
                  إجراءات سريعة
                </h3>
                <div className="space-y-3">
                  <button className="w-full bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 transition-colors text-right font-arabic">
                    إضافة منتج جديد
                  </button>
                  <button className="w-full bg-secondary text-secondary-foreground p-3 rounded-lg hover:bg-secondary/80 transition-colors text-right font-arabic">
                    عرض الطلبات الجديدة
                  </button>
                  <button className="w-full bg-muted text-muted-foreground p-3 rounded-lg hover:bg-muted/80 transition-colors text-right font-arabic">
                    تقرير المبيعات
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          )}

          {activeTab === 'marketplace' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground font-heading">
                  🛒 سوق المنتجات
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowOrderModal(true)}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    إضافة طلب جديد
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-card rounded-xl p-6 card-shadow hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <span>🏷️ {item.category}</span>
                          <span>⭐ {item.provider.rating || 4.5}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className={`p-2 rounded-full transition-colors ${
                          favorites.has(item.id)
                            ? 'text-red-500 bg-red-50'
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                        title={favorites.has(item.id) ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                      >
                        <Heart className={`w-5 h-5 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-primary">
                        {item.price} ريال
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.stock} متوفر
                      </div>
                    </div>

                    <button
                      onClick={() => createOrderFromItem(item)}
                      className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                    >
                      اطلب الآن
                    </button>
                  </motion.div>
                ))}
              </div>

              {marketItems.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    لا توجد منتجات متاحة حالياً
                  </h3>
                  <p className="text-muted-foreground">
                    ستظهر المنتجات المتاحة من الموردين هنا قريباً
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span>📦</span> إدارة الطلبات والشحنات
                </h2>
                <div className="flex gap-2">
                  <button
                    className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
                    title="إضافة طلب جديد"
                    onClick={() => setShowOrderModal(true)}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* علامات التبويب الفرعية للطلبات */}
              <div className="flex gap-2 mb-6 border-b">
                <button className="px-4 py-2 font-medium text-emerald-600 border-b-2 border-emerald-600">جميع الطلبات</button>
                <button className="px-4 py-2 font-medium text-gray-500 hover:text-gray-700">قيد التنفيذ</button>
                <button className="px-4 py-2 font-medium text-gray-500 hover:text-gray-700">مكتملة</button>
                <button className="px-4 py-2 font-medium text-gray-500 hover:text-gray-700">ملغاة</button>
              </div>
              
              <div className="space-y-4">
                {merchantOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد طلبات حالياً</h3>
                    <p className="text-gray-500">اضغط على زر "إضافة طلب جديد" لإنشاء طلب أولى</p>
                  </div>
                ) : (
                  merchantOrders.map((order) => {
                    const publishedList = JSON.parse(localStorage.getItem('merchant_published_orders') || '[]') as {orderId: string; marketItemId: string; publishedAt: string}[];
                    const isPublished = publishedList.some(p => p.orderId === order.id);
                    
                    // البحث عن شريك الشحن إذا تم تعيينه
                    const assignedShippingService = order.shippingServiceId 
                      ? shippingServices.find(s => s.id === order.shippingServiceId)
                      : null;
                    
                    return (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-bold text-gray-800">{order.title}</h3>
                                <div className="text-sm text-gray-600 mt-1">
                                  <span className="font-medium">الفئة:</span> {order.category}
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">الميزانية:</span>
                                <span className="font-medium">{order.budget} ريال</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">تاريخ الإنشاء:</span>
                                <span>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">الموعد النهائي:</span>
                                <span>{new Date(order.deadline).toLocaleDateString('ar-SA')}</span>
                              </div>
                            </div>
                            
                            {order.description && (
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">الوصف:</span> {order.description}
                              </div>
                            )}
                            {/* Show products list if present */}
                            {order.products && order.products.length > 0 && (
                              <div className="mt-3 bg-gray-50 p-3 rounded">
                                <h4 className="text-sm font-medium mb-2">عناصر الطلب</h4>
                                <ul className="text-sm text-gray-700 space-y-1">
                                  {order.products.map((p) => (
                                    <li key={p.productId + p.name} className="flex justify-between">
                                      <span>{p.name} x{p.quantity}</span>
                                      <span className="font-semibold">{(p.price * p.quantity).toFixed(2)} ريال</span>
                                    </li>
                                  ))}
                                </ul>
                                <div className="mt-2 text-sm text-gray-800 font-semibold">المجموع: {order.budget || order.products.reduce((s, x) => s + (Number(x.price) || 0) * (Number(x.quantity) || 1), 0)} ريال</div>
                              </div>
                            )}
                            
                            {assignedShippingService && (
                              <div className="mt-2 flex items-center gap-2 text-sm">
                                <span className="text-gray-500">خدمة الشحن:</span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                                  {assignedShippingService.name}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-2 md:items-end">
                            <div className="flex gap-2">
                              {isPublished ? (
                                <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-md">منشور في السوق</span>
                              ) : (
                                <button
                                  className="px-3 py-1 text-xs bg-yellow-50 text-yellow-800 rounded-md hover:bg-yellow-100 flex items-center gap-1"
                                  onClick={() => publishOrderToMarketplace(order)}
                                >
                                  <span>نشر في السوق</span>
                                </button>
                              )}
                              
                              <button className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
                                تفاصيل
                              </button>
                            </div>
                            
                            <div className="flex gap-1 mt-2">
                              <button 
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                                title="تعديل الطلب"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button 
                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md"
                                title="تعيين لشريك شحن"
                                onClick={() => openAssignOrderModal(order.id)}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </button>
                              <button 
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md"
                                title="إلغاء الطلب"
                                onClick={() => {
                                  if (window.confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) {
                                    cancelOrder(order.id);
                                  }
                                }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'partners' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span>🤝</span> إدارة الشركاء
                </h2>
                <button
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  onClick={() => setShowAddPartnerModal(true)}
                >
                  <Plus className="w-5 h-5" />
                  إضافة شريك جديد
                </button>
              </div>
              
              {partners.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد شركاء حالياً</h3>
                  <p className="text-gray-500">اضغط على زر "إضافة شريك جديد" لإضافة شريك تجاري</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partners.map((partner) => (
                    <div key={partner.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-800">{partner.name}</h3>
                          <p className="text-sm text-gray-600">{partner.category}</p>
                        </div>
                        <button
                          onClick={() => handleDeletePartner(partner.id)}
                          className="text-red-500 hover:text-red-700"
                          title="حذف الشريك"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span>🏢</span>
                          <span>{partner.type === 'supplier' ? 'مورد' : partner.type === 'shipping_company' ? 'شركة شحن' : partner.type || 'شريك'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span>{partner.city || 'غير محدد'}</span>
                        </div>
                        {partner.email && (
                          <div className="flex items-center gap-2">
                            <span>✉️</span>
                            <span>{partner.email}</span>
                          </div>
                        )}
                        {partner.phone && (
                          <div className="flex items-center gap-2">
                            <span>📞</span>
                            <span>{partner.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          مضاف: {new Date(partner.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                        <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200">
                          تفاصيل
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span>📈</span> تحليلات الأداء
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                  <h3 className="text-lg font-bold text-purple-800 mb-4">💰 تحليل الإيرادات</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>إيرادات الشهر:</span>
                      <span className="font-bold text-purple-600">125,400 ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span>متوسط الطلب:</span>
                      <span className="font-bold text-purple-600">4,865 ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الهامش الربحي:</span>
                      <span className="font-bold text-purple-600">28.5%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <h3 className="text-lg font-bold text-blue-800 mb-4">📊 تحليل المبيعات</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>أفضل منتج:</span>
                      <span className="font-bold text-blue-600">آيفون 15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>أفضل فئة:</span>
                      <span className="font-bold text-blue-600">إلكترونيات</span>
                    </div>
                    <div className="flex justify-between">
                      <span>معدل النمو:</span>
                      <span className="font-bold text-blue-600">+15.2%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 p-6 rounded-2xl border border-emerald-200">
                <h3 className="text-lg font-bold text-emerald-800 mb-4">🎯 توصيات لتحسين الأداء</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-bold text-emerald-700 mb-2">📈 زيادة المبيعات</h4>
                    <p className="text-sm text-gray-600">اضف منتجات جديدة في فئة الأزياء لزيادة المبيعات بنسبة 20%</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-bold text-emerald-700 mb-2">🎨 تحسين العرض</h4>
                    <p className="text-sm text-gray-600">حسن من جودة صور المنتجات وأوصافها لزيادة معدل التحويل</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-bold text-emerald-700 mb-2">📦 إدارة المخزون</h4>
                    <p className="text-sm text-gray-600">12 منتج نفذ مخزونه، قم بإعادة التجهيز قريباً</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-bold text-emerald-700 mb-2">⭐ تحسين التقييم</h4>
                    <p className="text-sm text-gray-600">تابع مع العملاء لتحسين تقييمات المنتجات والوصول لـ 4.9/5</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-6">
              <MarketPredictions userType="merchant" />
            </div>
          )}

          {activeTab === 'opportunities' && (
            <div className="space-y-6">
              <MarketOpportunities 
                userType="merchant" 
                user={auth?.user ? {
                  id: auth.user.id,
                  name: auth.user.companyName || auth.user.name || 'تاجر غير محدد',
                  type: 'merchant',
                  rating: 4.5, // This would typically come from the user profile
                  verified: true // This would typically come from the user profile
                } : undefined}
              />
            </div>
          )}
            </div>
          </div>

          {/* Chat is available in the header — floating instance removed */}

          {/* نموذج إضافة الطلب */}
          <AddOrderWizard
            isOpen={showOrderModal}
            onClose={() => { setShowOrderModal(false); setSelectedItem(null); }}
            onAdd={handleAddOrder}
            selectedItem={selectedItem}
            defaultMode={selectedItem ? 'partner' : 'market'}
          />
          
          {/* نموذج إضافة الشريك */}
          <AddPartnerModal
            isOpen={showAddPartnerModal}
            onClose={() => setShowAddPartnerModal(false)}
            onSubmit={handleAddPartner}
          />
          
          {/* نموذج تعيين الطلب لشريك شحن */}
          <AssignOrderModal
            isOpen={showAssignOrderModal}
            onClose={() => setShowAssignOrderModal(false)}
            orderId={selectedOrderId}
            onAssign={assignOrderToPartner}
          />
        </div>
      </NotificationProvider>
  );
}

export default MerchantDashboard;