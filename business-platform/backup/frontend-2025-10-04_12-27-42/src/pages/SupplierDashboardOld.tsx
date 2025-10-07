import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, TrendingUp, Users, ShoppingCart, Eye, Edit, Bell, 
  AlertCircle, CheckCircle, Clock, Filter, Search, Plus,
  BarChart3, PieChart, Activity, Zap, Star, ArrowUp, ArrowDown
} from 'lucide-react';
import { useState, useEffect } from 'react';

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
  
  const stats = [
    {
      title: 'إجمالي المبيعات',
      value: '89,250 ريال',
      change: '+18.7%',
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: 'text-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600',
      iconBg: 'bg-emerald-600',
      trend: 'up'
    },
    {
      title: 'طلبات التجار',
      value: '324',
      change: '+12.4%',
      icon: <ShoppingCart className="w-6 h-6 text-white" />,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
      iconBg: 'bg-blue-600',
      trend: 'up'
    },
    {
      title: 'المنتجات المتاحة',
      value: '1,847',
      change: '+5.2%',
      icon: <Package className="w-6 h-6 text-white" />,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600',
      iconBg: 'bg-purple-600',
      trend: 'up'
    },
    {
      title: 'التجار الشركاء',
      value: '142',
      change: '+22.1%',
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600',
      iconBg: 'bg-orange-600',
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
      revenue: '87,500 ريال',
      stock: 1200,
      merchants: 78
    },
    {
      name: 'أجهزة منزلية وإلكترونيات',
      orders: 167,
      revenue: '65,300 ريال',
      stock: 320,
      merchants: 23
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار';
      case 'processing':
        return 'قيد التجهيز';
      case 'completed':
        return 'مكتمل';
      case 'shipped':
        return 'تم الشحن';
      default:
        return 'غير محدد';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-right"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              🏭 لوحة تحكم المورد
            </h1>
            <p className="text-lg text-gray-600">
              إدارة منتجاتك وطلبات التجار مع تتبع شامل للمخزون والأداء 📦
            </p>
          </motion.div>
        </div>

        {/* محدد الفترة مع قائمة منسدلة */}
        <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-semibold text-lg">فترة العرض:</label>
            <select
              title="اختيار فترة العرض"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-6 py-3 rounded-xl border-2 border-gradient-to-r from-emerald-200 to-blue-200 bg-gradient-to-r from-white to-gray-50 text-gray-700 font-semibold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/50 focus:bg-gradient-to-r focus:from-emerald-50 focus:to-blue-50 outline-none transition-all duration-300 hover:shadow-xl hover:border-emerald-300 cursor-pointer min-w-[160px] shadow-md"
            >
              <option value="اليوم">📅 اليوم</option>
              <option value="الأسبوع">📊 الأسبوع</option>
              <option value="الشهر">🗓️ الشهر</option>
              <option value="السنة">📈 السنة</option>
            </select>
          </div>
          
          {/* التبويبات مع تحسينات */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: '📊' },
              { id: 'orders', label: 'الطلبات', icon: '📋' },
              { id: 'inventory', label: 'المخزون', icon: '📦' },
              { id: 'merchants', label: 'التجار', icon: '🏪' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 text-white shadow-xl scale-105 border border-white/30'
                    : 'bg-gradient-to-r from-white to-gray-50 text-gray-600 hover:from-emerald-50 hover:to-blue-50 border border-gray-200 hover:shadow-lg hover:scale-102 hover:border-emerald-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* الإحصائيات الرئيسية */}
        {(activeTab === 'overview' || activeTab === 'orders' || activeTab === 'inventory' || activeTab === 'merchants') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${stat.bgColor} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/30 text-white relative overflow-hidden`}
              >
                {/* خلفية ديكوريف */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`${stat.iconBg} p-3 rounded-xl shadow-lg backdrop-blur-sm bg-white/20`}>
                    {stat.icon}
                  </div>
                  <span className="text-sm font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 relative z-10">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-white relative z-10">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* المحتوى الرئيسي حسب التبويب النشط */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* الطلبات الحديثة */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    📋 الطلبات الحديثة
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    طلبات التجار الأحدث والأكثر أهمية
                  </p>
                </div>
                <button className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 text-white rounded-xl hover:shadow-xl hover:from-emerald-600 hover:via-blue-500 hover:to-purple-600 transition-all duration-300 hover:scale-105 font-semibold shadow-lg border border-white/20">
                  عرض الكل
                </button>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-bold text-emerald-600">
                            {order.id}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                          🏪 {order.merchant}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          📦 {order.product}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>الكمية: {order.quantity}</span>
                          <span>التاريخ: {order.date}</span>
                          <span className="font-semibold text-emerald-600">{order.value}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          title="عرض تفاصيل الطلب"
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          title="تعديل الطلب"
                          className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* أفضل المنتجات */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
            >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                🏆 أفضل المنتجات
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                المنتجات الأكثر طلباً من التجار
              </p>
            </div>

            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm leading-tight">
                      {product.name}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">الطلبات</span>
                      <span className="font-semibold text-emerald-600">{product.orders}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">الإيرادات</span>
                      <span className="font-semibold text-blue-600">{product.revenue}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">المخزون</span>
                      <span className="font-semibold text-purple-600">{product.stock}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">التجار</span>
                      <span className="font-semibold text-amber-600">{product.merchants}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        )}

        {/* لوحة الإشعارات والتنبيهات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* الإشعارات */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">الإشعارات العاجلة</h2>
                  <p className="text-sm text-gray-600">مهام تحتاج انتباهك الفوري</p>
                </div>
              </div>
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                {notifications.filter(n => !n.read).length} جديد
              </span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`border-r-4 p-4 rounded-lg transition-all duration-300 cursor-pointer hover:shadow-md ${
                    notification.type === 'urgent' 
                      ? 'bg-red-50 border-red-500' 
                      : notification.type === 'success'
                      ? 'bg-green-50 border-green-500'
                      : 'bg-yellow-50 border-yellow-500'
                  } ${!notification.read ? 'shadow-md' : 'opacity-75'}`}
                  onClick={() => {
                    setNotifications(prev => prev.map(n => 
                      n.id === notification.id ? {...n, read: true} : n
                    ));
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {notification.type === 'urgent' && <AlertCircle className="w-4 h-4 text-red-600" />}
                        {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                        {notification.type === 'warning' && <Clock className="w-4 h-4 text-yellow-600" />}
                        <h3 className="font-semibold text-gray-800 text-sm">{notification.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{notification.time}</span>
                        <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                          {notification.action}
                        </button>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full ml-2 mt-1"></div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* الإجراءات السريعة */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
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
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-4 rounded-xl border-2 border-dashed transition-all duration-300 hover:shadow-lg group ${
                    action.color === 'emerald' ? 'border-emerald-300 hover:bg-emerald-50' :
                    action.color === 'blue' ? 'border-blue-300 hover:bg-blue-50' :
                    action.color === 'purple' ? 'border-purple-300 hover:bg-purple-50' :
                    action.color === 'amber' ? 'border-amber-300 hover:bg-amber-50' :
                    action.color === 'rose' ? 'border-rose-300 hover:bg-rose-50' :
                    'border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center ${
                      action.color === 'emerald' ? 'bg-emerald-100' :
                      action.color === 'blue' ? 'bg-blue-100' :
                      action.color === 'purple' ? 'bg-purple-100' :
                      action.color === 'amber' ? 'bg-amber-100' :
                      action.color === 'rose' ? 'bg-rose-100' :
                      'bg-indigo-100'
                    }`}>
                      <action.icon className={`w-6 h-6 ${
                        action.color === 'emerald' ? 'text-emerald-600' :
                        action.color === 'blue' ? 'text-blue-600' :
                        action.color === 'purple' ? 'text-purple-600' :
                        action.color === 'amber' ? 'text-amber-600' :
                        action.color === 'rose' ? 'text-rose-600' :
                        'text-indigo-600'
                      }`} />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">{action.title}</h3>
                    {action.count && (
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                        {action.count}
                      </span>
                    )}
                    {action.alert && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* تحليل المخزون المنخفض */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">تنبيهات المخزون</h2>
                <p className="text-sm text-gray-600">منتجات تحتاج إعادة تخزين عاجل</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105">
              إعادة تخزين الكل
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lowStockProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 ${
                  product.status === 'critical' 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-yellow-300 bg-yellow-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 text-sm">{product.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'critical' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {product.status === 'critical' ? 'حرج' : 'تحذير'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">المخزون الحالي:</span>
                    <span className="font-semibold text-gray-800">{product.current} قطعة</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">الحد الأدنى:</span>
                    <span className="font-semibold text-gray-800">{product.min} قطعة</span>
                  </div>
                  
                  {/* شريط التقدم */}
                  <div className="mt-3">
                    <div className={`w-full bg-gray-200 rounded-full h-2 ${
                      product.status === 'critical' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          product.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                        } ${
                          product.current / product.min < 0.3 ? 'w-[30%]' : 
                          product.current / product.min < 0.5 ? 'w-[50%]' : 
                          product.current / product.min < 0.7 ? 'w-[70%]' : 'w-[90%]'
                        }`}
                      ></div>
                    </div>
                  </div>
                  
                  <button className="w-full mt-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-purple-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105">
                    طلب إعادة تخزين
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* إحصائيات إضافية */}
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
      </div>
    </div>
  );
}

export default SupplierDashboard;