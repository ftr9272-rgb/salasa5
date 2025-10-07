import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, TrendingUp, Users, ShoppingCart, Eye, Edit, Bell, 
  AlertCircle, CheckCircle, Clock, Search, Plus,
  Zap, Star, Settings, UserPlus, FolderPlus
} from 'lucide-react';
import { useState } from 'react';
import AddProductModal from '../components/supplier/AddProductModal';
import AddPartnerModal from '../components/AddPartnerModalSimple';
import AddOrderModal from '../components/supplier/AddOrderModal';
import AddCategoryModal from '../components/supplier/AddCategoryModal';
import TeamModal from '../components/supplier/TeamModal';
import SettingsModal from '../components/supplier/SettingsModal';

function SupplierDashboard() {
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

  // Modal states
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Handler functions for modals
  const handleProductSave = (productData: any) => {
    console.log('Product saved:', productData);
    // Here you would typically save to your backend
  };

  const handlePartnerSave = (partnerData: any) => {
    console.log('Partner saved:', partnerData);
    // Here you would typically save to your backend
  };

  const handleOrderSave = (orderData: any) => {
    console.log('Order saved:', orderData);
    // Here you would typically save to your backend
  };

  const handleCategorySave = (categoryData: any) => {
    console.log('Category saved:', categoryData);
    // Here you would typically save to your backend
  };

  const handleTeamSave = (teamData: any) => {
    console.log('Team saved:', teamData);
    // Here you would typically save to your backend
  };

  const handleSettingsSave = (settingsData: any) => {
    console.log('Settings saved:', settingsData);
    // Here you would typically save to your backend
  };
  
  const [quickActions] = useState([
    { 
      id: 1, 
      title: 'إضافة منتج جديد', 
      icon: Package, 
      color: 'emerald', 
      onClick: () => setShowAddProductModal(true)
    },
    { 
      id: 2, 
      title: 'طلب مواد خام', 
      icon: Package, 
      color: 'blue', 
      onClick: () => alert('طلب مواد خام من الموردين:\n\n🏭 اختيار المورد\n📦 تحديد المواد المطلوبة\n📊 مقارنة الأسعار\n📅 جدولة التسليم\n💰 شروط الدفع')
    },
    { 
      id: 3, 
      title: 'طلب خدمة شحن', 
      icon: Package, 
      color: 'purple',
      onClick: () => alert('سيتم توجيهك لطلب خدمة شحن من شركة النقل:\n\n🚚 اختيار شركة الشحن\n📦 تحديد نوع الخدمة\n📅 جدولة موعد الاستلام\n💰 مقارنة الأسعار')
    },
    { 
      id: 4, 
      title: 'إدارة طلبات التجار', 
      icon: ShoppingCart, 
      color: 'amber',
      onClick: () => setActiveTab('orders')
    },
    { 
      id: 5, 
      title: 'إضافة فئة منتجات', 
      icon: FolderPlus, 
      color: 'rose',
      onClick: () => setShowAddCategoryModal(true)
    },
    { 
      id: 6, 
      title: 'إضافة تاجر جديد', 
      icon: UserPlus, 
      color: 'indigo',
      onClick: () => setShowAddPartnerModal(true)
    },
    { 
      id: 7, 
      title: 'إدارة الفريق', 
      icon: Users, 
      color: 'teal',
      onClick: () => setShowTeamModal(true)
    },
    { 
      id: 8, 
      title: 'إعدادات النظام', 
      icon: Settings, 
      color: 'gray',
      onClick: () => setShowSettingsModal(true)
    }
  ]);

  const [lowStockProducts] = useState([
    { name: 'ملابس رياضية متنوعة', current: 75, min: 50, status: 'active' },
    { name: 'أجهزة كمبيوتر محمولة', current: 12, min: 25, status: 'active' },
    { name: 'هواتف ذكية - آيفون 15', current: 25, min: 30, status: 'active' }
  ]);
  
  const stats = [
    {
      title: 'إجمالي المبيعات',
      value: '89,250 ريال',
      change: '+18.7%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      trend: 'up'
    },
    {
      title: 'طلبات التجار',
      value: '324',
      change: '+12.4%',
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      trend: 'up'
    },
    {
      title: 'المنتجات المتاحة',
      value: '1,847',
      change: '+5.2%',
      icon: <Package className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      trend: 'up'
    },
    {
      title: 'التجار الشركاء',
      value: '142',
      change: '+22.1%',
      icon: <Users className="w-6 h-6" />,
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
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
    {
      name: 'هواتف ذكية وإكسسواراتها',
      orders: 456,
      revenue: '125,000 ريال',
      stock: 850,
      merchants: 45
    },
    {
      name: 'ملابس وأزياء متنوعة',
      orders: 289,
      revenue: '78,500 ريال',
      stock: 1250,
      merchants: 32
    },
    {
      name: 'مستحضرات التجميل والعناية',
      orders: 234,
      revenue: '65,200 ريال',
      stock: 680,
      merchants: 28
    },
    {
      name: 'الكتب والمواد التعليمية',
      orders: 198,
      revenue: '42,800 ريال',
      stock: 920,
      merchants: 18
    }
  ];

  const merchants = [
    {
      id: 1,
      name: 'متجر الإلكترونيات الذكية',
      category: 'إلكترونيات',
      orders: 45,
      revenue: '125,000 ريال',
      rating: 4.8,
      status: 'نشط'
    },
    {
      id: 2,
      name: 'متجر الأزياء العصرية',
      category: 'أزياء',
      orders: 32,
      revenue: '78,500 ريال',
      rating: 4.6,
      status: 'نشط'
    },
    {
      id: 3,
      name: 'صيدلية النور الطبية',
      category: 'صحة',
      orders: 28,
      revenue: '65,200 ريال',
      rating: 4.9,
      status: 'نشط'
    }
  ];

  // وظائف مساعدة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'processing': return 'قيد المعالجة';
      case 'shipped': return 'تم الشحن';
      case 'pending': return 'معلق';
      default: return status;
    }
  };

  // تقديم المحتوى حسب التبويب النشط
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'orders':
        return renderOrdersContent();
      case 'inventory':
        return renderInventoryContent();
      case 'merchants':
        return renderMerchantsContent();
      default:
        return renderOverviewContent();
    }
  };

  // محتوى النظرة العامة
  const renderOverviewContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* الإحصائيات الشاملة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">طلبات جديدة</p>
              <p className="text-2xl font-bold text-blue-800">8</p>
              <p className="text-xs text-blue-600">تحتاج مراجعة</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-700 font-medium">إيرادات اليوم</p>
              <p className="text-2xl font-bold text-emerald-800">24,750 ر.س</p>
              <p className="text-xs text-emerald-600">من 15 طلب</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">قيد التجهيز</p>
              <p className="text-2xl font-bold text-purple-800">12</p>
              <p className="text-xs text-purple-600">يجب شحنها</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700 font-medium">معدل النمو</p>
              <p className="text-2xl font-bold text-amber-800">+18.5%</p>
              <p className="text-xs text-amber-600">مقارنة بالأسبوع الماضي</p>
            </div>
            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
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
          {recentOrders.slice(0, 4).map((order, index) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-blue-200"
            >
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full shadow-lg ${
                  order.status === 'completed' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                  order.status === 'processing' ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 
                  order.status === 'shipped' ? 'bg-gradient-to-r from-purple-400 to-purple-600' : 
                  'bg-gradient-to-r from-yellow-400 to-yellow-600'
                }`}></div>
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{order.merchant}</p>
                  <p className="text-sm text-gray-600">{order.product}</p>
                  <p className="text-xs text-gray-500">رقم الطلب: {order.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">الكمية: {order.quantity}</p>
                <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
                <p className="text-xs text-gray-500 mt-1">💰 {order.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* حالة المخزون والإحصائيات السريعة */}
      <div className="space-y-6">
        {/* حالة المخزون */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>📦</span> حالة المخزون
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="text-gray-700 font-medium text-sm">🟢 منتجات متاحة</span>
              <span className="font-bold text-emerald-700 text-lg">1,847</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="text-gray-700 font-medium text-sm">🟡 مخزون منخفض</span>
              <span className="font-bold text-yellow-700 text-lg">4</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg border border-red-200">
              <span className="text-gray-700 font-medium text-sm">🔴 نفد المخزون</span>
              <span className="font-bold text-red-700 text-lg">2</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-gray-700 font-medium text-sm">📊 إجمالي المنتجات</span>
              <span className="font-bold text-gray-800 text-lg">1,853</span>
            </div>
          </div>
        </div>

        {/* أفضل المنتجات */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>🏆</span> أفضل المنتجات
          </h3>
          <div className="space-y-2">
            {topProducts.slice(0, 3).map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border border-gray-100 hover:border-purple-200 transition-all">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
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
              <span>📋</span> إدارة الطلبات النشطة
            </h2>
            <p className="text-sm text-gray-600 mt-1">تتبع ومعالجة طلبات التجار لزيادة الكفاءة والأرباح</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              title="فلتر الطلبات"
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option>جميع الحالات</option>
              <option>جديد - يحتاج مراجعة</option>
              <option>مؤكد - جاهز للتجهيز</option>
              <option>قيد التجهيز</option>
              <option>تم الشحن</option>
              <option>مكتمل</option>
              <option>مرفوض</option>
            </select>
            <button 
              onClick={() => alert('عرض تقرير شامل للطلبات')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              📊 تقرير شامل
            </button>
            <button 
              onClick={() => alert('إضافة طلب مباشر من تاجر:\n\n📞 طلب هاتفي من التاجر\n💬 طلب عبر WhatsApp\n📧 طلب عبر البريد الإلكتروني\n🤝 طلب شخصي من المعرض')}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 inline ml-2" />
              إضافة طلب يدوي
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {recentOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg font-bold text-emerald-600">{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    {order.status === 'pending' && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        🔔 يحتاج موافقة
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">🏪 معلومات التاجر</h3>
                      <p className="text-gray-700 font-medium">{order.merchant}</p>
                      <p className="text-sm text-gray-500">⭐ تقييم: 4.8/5 | 📞 966501234567</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">📦 تفاصيل المنتج</h3>
                      <p className="text-gray-700">{order.product}</p>
                      <p className="text-sm text-gray-500">الكمية: {order.quantity} قطعة</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-blue-700 font-medium">💰 قيمة الطلب</p>
                      <p className="text-blue-900 font-bold text-lg">{order.value}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-emerald-700 font-medium">📈 هامش الربح</p>
                      <p className="text-emerald-900 font-bold">
                        {order.quantity === 50 ? '35%' : order.quantity === 25 ? '28%' : '42%'}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-purple-700 font-medium">📅 موعد التسليم</p>
                      <p className="text-purple-900 font-bold">{order.date}</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-amber-700 font-medium">⚡ الأولوية</p>
                      <p className="text-amber-900 font-bold">
                        {index % 2 === 0 ? 'عالية' : 'متوسطة'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <button 
                    onClick={() => alert(`عرض تفاصيل الطلب: ${order.id}\n\nسيتم عرض:\n- تاريخ تفصيلي للطلب\n- معلومات الشحن\n- حالة الدفع\n- سجل التواصل مع التاجر`)}
                    title="عرض تفاصيل الطلب" 
                    className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => alert(`موافقة على الطلب: ${order.id}\n\nسيتم:\n- تأكيد الطلب\n- خصم الكمية من المخزون\n- إرسال إشعار للتاجر\n- بدء عملية التجهيز`)}
                      title="موافقة على الطلب" 
                      className="p-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  
                  <button 
                    onClick={() => alert(`تعديل الطلب: ${order.id}\n\nيمكنك:\n- تعديل الكمية\n- تغيير موعد التسليم\n- إضافة ملاحظات\n- تحديث السعر`)}
                    title="تعديل الطلب" 
                    className="p-3 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>

                  <button 
                    onClick={() => alert(`طباعة فاتورة: ${order.id}\n\nسيتم إنشاء:\n- فاتورة رسمية\n- قائمة تجهيز\n- ملصقات الشحن`)}
                    title="طباعة الفاتورة" 
                    className="p-3 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    🖨️
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ملخص إضافي */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-bold text-gray-800 mb-2">💡 نصائح لتحسين إدارة الطلبات:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-700">⚡ الاستجابة السريعة</p>
              <p className="text-gray-600">الرد على الطلبات خلال ساعتين يزيد رضا التجار بنسبة 40%</p>
            </div>
            <div>
              <p className="font-medium text-emerald-700">📦 إدارة المخزون</p>
              <p className="text-gray-600">تتبع المخزون في الوقت الفعلي يقلل فقدان المبيعات</p>
            </div>
            <div>
              <p className="font-medium text-purple-700">🤝 بناء العلاقات</p>
              <p className="text-gray-600">التواصل المنتظم مع التجار يؤدي لطلبات أكبر</p>
            </div>
          </div>
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
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span>📦</span> إدارة المخزون والمنتجات
          </h2>
          <div className="flex flex-wrap gap-3">
            <motion.div 
              className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
            >
              <motion.div
                animate={{ rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Search className="w-4 h-4 text-gray-500" />
              </motion.div>
              <input 
                type="text"
                placeholder="البحث في المنتجات..."
                className="bg-transparent outline-none text-sm w-32 md:w-40 placeholder:text-gray-400"
              />
            </motion.div>
            
            <motion.button 
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center gap-2 px-4 md:px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Plus className="w-4 h-4" />
              </motion.div>
              <span className="text-sm md:text-base">منتج جديد</span>
            </motion.button>
            
            <motion.button 
              onClick={() => {
                alert('تم تحديث بيانات المخزون بنجاح!');
                window.location.reload();
              }}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">🔄</span>
              <span className="text-sm">تحديث</span>
            </motion.button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📦 المنتجات المميزة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((product, index) => {
              // ألوان مختلفة لكل بطاقة
              const cardColors = [
                'bg-gradient-to-br from-blue-50 to-blue-100',
                'bg-gradient-to-br from-purple-50 to-purple-100', 
                'bg-gradient-to-br from-green-50 to-green-100',
                'bg-gradient-to-br from-orange-50 to-orange-100'
              ];
              const borderColors = [
                'border-blue-200',
                'border-purple-200',
                'border-green-200', 
                'border-orange-200'
              ];
              const textColors = [
                'text-blue-600',
                'text-purple-600',
                'text-green-600',
                'text-orange-600'
              ];
              const iconColors = [
                'bg-blue-500',
                'bg-purple-500',
                'bg-green-500',
                'bg-orange-500'
              ];
              
              const colorIndex = index % 4;
              
              return (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`${cardColors[colorIndex]} ${borderColors[colorIndex]} border-2 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-sm mb-1">{product.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 ${iconColors[colorIndex]} text-white rounded-full text-xs font-semibold`}>
                          نشط
                        </span>
                      </div>
                    </div>
                    <div className={`w-3 h-3 ${iconColors[colorIndex]} rounded-full`}></div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm flex items-center gap-1">
                        💰 السعر:
                      </span>
                      <span className={`font-bold ${textColors[colorIndex]} text-lg`}>
                        {product.current === 75 ? '450' : product.current === 12 ? '3,500' : '2,500'} ريال
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm flex items-center gap-1">
                        📦 المخزون:
                      </span>
                      <span className="font-bold text-gray-800">{product.current}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm flex items-center gap-1">
                        📊 المبيعات:
                      </span>
                      <span className="font-bold text-gray-800">
                        {product.current === 75 ? '234' : product.current === 12 ? '89' : '156'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button 
                      className="flex-1 bg-purple-100 text-purple-700 px-3 py-2 rounded-xl hover:bg-purple-200 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-1 hover:shadow-md transform"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      📊 الإحصائيات
                    </motion.button>
                    <motion.button 
                      className={`flex-1 ${iconColors[colorIndex]} text-white px-3 py-2 rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-medium flex items-center justify-center gap-1 transform hover:brightness-110`}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      ✏️ تعديل
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 نظرة عامة على المخزون</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-2 border border-gray-200"
              >
                <h4 className="font-semibold text-gray-800 mb-1 text-xs leading-tight">{product.name}</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">المخزون:</span>
                    <span className="font-semibold text-green-600">{product.stock}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">الطلبات:</span>
                    <span className="font-semibold text-blue-600">{product.orders}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // محتوى التجار
  const renderMerchantsContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span>🏪</span> إدارة التجار الشركاء
          </h2>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
              <Search className="w-4 h-4 text-gray-500" />
              <input 
                type="text"
                placeholder="البحث عن تاجر..."
                className="bg-transparent outline-none text-sm w-48"
              />
            </div>
            <button 
              onClick={() => setShowAddPartnerModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 inline ml-2" />
              تاجر جديد
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {merchants.map((merchant, index) => (
            <motion.div
              key={merchant.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{merchant.name}</h3>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                      {merchant.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">📂 {merchant.category}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>الطلبات: {merchant.orders}</span>
                    <span>الإيرادات: {merchant.revenue}</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {merchant.rating}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => alert(`عرض تفاصيل التاجر: ${merchant.name}`)}
                    title="عرض تفاصيل التاجر" 
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => alert(`تعديل بيانات التاجر: ${merchant.name}`)}
                    title="تعديل بيانات التاجر" 
                    className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header مع تحسينات بصرية */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-right"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              🏭 لوحة تحكم المورد
            </h1>
            <p className="text-lg text-gray-600">
              إدارة منتجاتك وطلبات التجار مع تتبع شامل للمخزون والأداء 📦
            </p>
          </motion.div>
        </div>

        {/* محدد الفترة المتفاعل */}
        <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'اليوم', icon: '📅' },
              { name: 'الأسبوع', icon: '📊' },
              { name: 'الشهر', icon: '🗓️' },
              { name: 'السنة', icon: '📈' }
            ].map((period) => (
              <motion.button
                key={period.name}
                onClick={() => setSelectedPeriod(period.name)}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 font-semibold ${
                  selectedPeriod === period.name
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl ring-4 ring-purple-200 ring-opacity-50 transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:text-blue-700'
                } group`}
              >
                <motion.span 
                  className="text-base md:text-lg"
                  animate={selectedPeriod === period.name ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {period.icon}
                </motion.span>
                <span className="text-sm md:text-base">{period.name}</span>
                {selectedPeriod === period.name && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
          
          {/* التبويبات المتفاعلة والمتجاوبة */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: '📊', count: null },
              { id: 'orders', label: 'الطلبات', icon: '📋', count: 8 },
              { id: 'inventory', label: 'المخزون', icon: '📦', count: 4 },
              { id: 'merchants', label: 'التجار', icon: '🏪', count: 3 }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 font-semibold transform ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-2xl ring-4 ring-blue-200 ring-opacity-50'
                    : 'bg-white text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border border-gray-200 hover:border-blue-300 hover:shadow-xl hover:text-blue-700'
                } group active:scale-95`}
              >
                <motion.span 
                  className="text-lg md:text-xl"
                  animate={activeTab === tab.id ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {tab.icon}
                </motion.span>
                <span className="text-sm md:text-base">{tab.label}</span>
                {tab.count && (
                  <motion.span 
                    className={`absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 text-xs font-bold rounded-full flex items-center justify-center ${
                      activeTab === tab.id 
                        ? 'bg-white text-blue-600' 
                        : 'bg-red-500 text-white animate-pulse'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    {tab.count}
                  </motion.span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* بطاقات الإحصائيات المتفاعلة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                rotateY: 5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-opacity-20 cursor-pointer group relative overflow-hidden`}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: -100 }}
                whileHover={{ x: 100 }}
                transition={{ duration: 0.6 }}
              />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                  <motion.p 
                    className="text-sm font-medium text-gray-700 mb-2"
                    whileHover={{ x: 2 }}
                  >
                    {stat.title}
                  </motion.p>
                  <motion.p 
                    className="text-3xl font-bold text-gray-900"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {stat.value}
                  </motion.p>
                  <div className="flex items-center gap-2 mt-2">
                    <motion.span 
                      className={`text-sm font-semibold ${stat.color} flex items-center gap-1`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.span
                        animate={{ rotate: stat.trend === 'up' ? [0, 10, -10, 0] : [0, -10, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {stat.trend === 'up' ? '📈' : '📉'}
                      </motion.span>
                      {stat.change}
                    </motion.span>
                    <span className="text-xs text-gray-500">من {selectedPeriod} الماضي</span>
                  </div>
                </div>
                <motion.div 
                  className={`p-4 rounded-xl bg-white bg-opacity-70 ${stat.color}`}
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: 5,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {stat.icon}
                </motion.div>
              </div>
              
              {/* مؤشر التحميل للتفاعل */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* المحتوى حسب التبويب النشط */}
        <AnimatePresence mode="wait">
          {renderActiveTabContent()}
        </AnimatePresence>

        {/* الإجراءات السريعة والإشعارات - نظرة عامة فقط */}
        {activeTab === 'overview' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* لوحة الإشعارات */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">الإشعارات والتنبيهات</h2>
                    <p className="text-sm text-gray-600">تحديثات مهمة تحتاج لانتباهك</p>
                  </div>
                </div>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {notifications.filter(n => !n.read).length} جديد
                </span>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ 
                      scale: 1.02, 
                      x: 5,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`border-r-4 p-4 rounded-lg transition-all duration-300 cursor-pointer relative overflow-hidden ${
                      notification.type === 'urgent' 
                        ? 'bg-red-50 border-red-500 hover:bg-red-100' 
                        : notification.type === 'success'
                        ? 'bg-green-50 border-green-500 hover:bg-green-100'
                        : 'bg-yellow-50 border-yellow-500 hover:bg-yellow-100'
                    } ${!notification.read ? 'shadow-md' : 'opacity-75'}`}
                    onClick={() => {
                      setNotifications(prev => prev.map(n => 
                        n.id === notification.id ? {...n, read: true} : n
                      ));
                    }}
                  >
                    {/* تأثير التمرير */}
                    <motion.div
                      className="absolute inset-0 bg-white/20 opacity-0"
                      whileHover={{ opacity: 1, x: [0, 100, -100, 0] }}
                      transition={{ duration: 0.6 }}
                    />
                    
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.2 }}
                            transition={{ duration: 0.3 }}
                          >
                            {notification.type === 'urgent' && <AlertCircle className="w-4 h-4 text-red-600" />}
                            {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                            {notification.type === 'warning' && <Clock className="w-4 h-4 text-yellow-600" />}
                          </motion.div>
                          <motion.h3 
                            className="font-semibold text-gray-800 text-sm"
                            whileHover={{ x: 2 }}
                          >
                            {notification.title}
                          </motion.h3>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          <motion.button 
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 hover:shadow-md"
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {notification.action}
                          </motion.button>
                        </div>
                      </div>
                      {!notification.read && (
                        <motion.div 
                          className="w-3 h-3 bg-blue-500 rounded-full ml-2 mt-1"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.7)", "0 0 0 8px rgba(59, 130, 246, 0)", "0 0 0 0 rgba(59, 130, 246, 0)"]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* الإجراءات السريعة */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">الإجراءات السريعة</h2>
                  <p className="text-sm text-gray-600">مهام يمكن إنجازها بضغطة واحدة</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <motion.button
                      key={action.id}
                      onClick={action.onClick}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ 
                        scale: 1.08, 
                        y: -3,
                        boxShadow: "0 20px 30px rgba(0,0,0,0.15)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative p-4 bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 border-2 border-${action.color}-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-right group overflow-hidden`}
                    >
                      {/* تأثير الخلفية المتحركة */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r from-${action.color}-200/30 to-${action.color}-300/30 opacity-0 group-hover:opacity-100`}
                        initial={{ x: -100, opacity: 0 }}
                        whileHover={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <div className="relative z-10">
                        <motion.div 
                          className={`w-8 h-8 bg-${action.color}-500 text-white rounded-lg flex items-center justify-center mb-3`}
                          whileHover={{ 
                            scale: 1.2, 
                            rotate: 10,
                            boxShadow: `0 8px 16px rgba(0,0,0,0.2)`
                          }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <IconComponent className="w-4 h-4" />
                          </motion.div>
                        </motion.div>
                        
                        <motion.h3 
                          className={`font-semibold text-${action.color}-800 text-sm leading-tight`}
                          whileHover={{ x: 2 }}
                        >
                          {action.title}
                        </motion.h3>
                      </div>
                      

                      
                      {/* مؤشر التفاعل */}
                      <motion.div
                        className={`absolute bottom-0 left-0 h-1 bg-${action.color}-500 opacity-0 group-hover:opacity-100`}
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}

        {/* إحصائيات إضافية */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 rounded-2xl p-8 text-white"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">📈 نظرة سريعة على الأداء</h2>
              <p className="text-emerald-100">ملخص شامل لنشاطك كمورد في المنصة</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">98.5%</div>
                <div className="text-emerald-100">معدل الرضا</div>
              </div>
              
              <div className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">24 ساعة</div>
                <div className="text-emerald-100">متوسط وقت التسليم</div>
              </div>
              
              <div className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">15.8%</div>
                <div className="text-emerald-100">نمو المبيعات الشهرية</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal Components */}
      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onSave={handleProductSave}
      />
      
      <AddPartnerModal
        isOpen={showAddPartnerModal}
        onClose={() => setShowAddPartnerModal(false)}
        onSubmit={handlePartnerSave}
      />
      
      <AddOrderModal
        isOpen={showAddOrderModal}
        onClose={() => setShowAddOrderModal(false)}
        onSubmit={handleOrderSave}
      />
      
      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onSubmit={handleCategorySave}
      />
      
      <TeamModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        onSave={handleTeamSave}
      />
      
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onSave={handleSettingsSave}
      />
    </div>
  );
}

export default SupplierDashboard;