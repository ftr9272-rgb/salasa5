import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { motion as Motion } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign, 
  ShoppingBag,
  UserPlus,
  MessageCircle,
  Star,
  ChevronDown,
  BarChart3,
  Truck,
  Eye,
  Plus,
  FileText
} from 'lucide-react';

const MerchantDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [statsCards, setStatsCards] = useState([]);
  const [recentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginTestResult, setLoginTestResult] = useState(null);
  
  // استخدام البيانات المحملة من الخادم أو البيانات الافتراضية إذا لم تكن متوفرة
  const displayRecentActivities = recentActivities.length > 0 ? recentActivities : [
    {
      id: 1,
      type: 'order',
      title: 'لا توجد نشاطات حديثة',
      time: '',
      icon: ShoppingBag,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600'
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // تحميل بيانات لوحة التحكم من الخادم
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // تحميل بيانات لوحة التحكم
        const dashboardData = await apiFetch('/api/merchant/dashboard');
        
        // تحويل بيانات لوحة التحكم إلى تنسيق مطلوب
        setStatsCards([
          {
            title: 'إجمالي المبيعات',
            value: dashboardData.stats.total_spent ? dashboardData.stats.total_spent.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0',
            unit: 'ر.س',
            change: '+12.5%',
            changeType: 'positive',
            icon: DollarSign,
            color: 'from-emerald-500 to-teal-400',
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600'
          },
          {
            title: 'الطلبات الجديدة',
            value: dashboardData.stats.total_orders ? dashboardData.stats.total_orders : '0',
            unit: 'طلب',
            change: '+8.2%',
            changeType: 'positive',
            icon: ShoppingBag,
            color: 'from-blue-500 to-indigo-400',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
          },
          {
            title: 'الموردين النشطين',
            value: dashboardData.stats.favorite_suppliers ? dashboardData.stats.favorite_suppliers : '0',
            unit: 'مورد',
            change: '+3.1%',
            changeType: 'positive',
            icon: Users,
            color: 'from-purple-500 to-pink-400',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600'
          },
          {
            title: 'المنتجات المتاحة',
            value: '1,240',
            unit: 'منتج',
            change: '+15.3%',
            changeType: 'positive',
            icon: Package,
            color: 'from-amber-500 to-orange-400',
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600'
          },
        ]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // اختبار سريع للمصادقة لعرض نتيجة مباشرة داخل الواجهة (مفيد عندما لا يمكن لصق أو رؤية Console)
  useEffect(() => {
    let cancelled = false;
    const runLoginTest = async () => {
      try {
        // Use apiFetch so Authorization header and error handling are consistent
        const data = await apiFetch('/api/auth/login', { method: 'POST', body: { username: 'supplier_demo', password: '123456' } });
        if (!cancelled) setLoginTestResult({ status: 200, ok: true, body: data });
      } catch (err) {
        // apiFetch throws Error with message containing status + body when non-2xx
        if (!cancelled) {
          const msg = err && err.message ? err.message : String(err);
          setLoginTestResult({ error: msg });
        }
      }
    };
    runLoginTest();
    return () => { cancelled = true; };
  }, []);

  // استخدام البيانات الافتراضية مؤقتاً حتى يتم تحميل المنتجات من الخادم
  const featuredProducts = [
    {
      id: 1,
      name: 'حاسوب محمول للأعمال',
      supplier: 'شركة النور للإلكترونيات',
      price: 3500,
      originalPrice: null,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      badge: { text: 'جديد', color: 'bg-emerald-500' }
    },
    {
      id: 2,
      name: 'أثاث مكتبي فاخر',
      supplier: 'مصنع الأخشاب الذهبية',
      price: 1200,
      originalPrice: null,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      badge: { text: 'الأكثر مبيعاً', color: 'bg-blue-500' }
    },
    {
      id: 3,
      name: 'كاميرات مراقبة HD',
      supplier: 'شركة التقنية الآمنة',
      price: 450,
      originalPrice: null,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      badge: { text: 'مخزون محدود', color: 'bg-amber-500' }
    },
    {
      id: 4,
      name: 'طابعة ليزر متعددة الوظائف',
      supplier: 'شركة الطباعة الحديثة',
      price: 850,
      originalPrice: 1200,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      badge: { text: 'عرض خاص', color: 'bg-rose-500' }
    }
  ];

  // عرض رسائل التحميل أو الخطأ
  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md border border-red-200">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">خطأ في تحميل البيانات</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {loginTestResult && (
        <div className="mb-4 p-3 rounded-lg text-sm">
          {loginTestResult.error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded">فشل اختبار الدخول: {String(loginTestResult.error)}</div>
          ) : (
            <div className="bg-green-50 border border-green-200 text-green-700 p-2 rounded">
              اختبار الدخول: الحالة {loginTestResult.status} — مُنجز بنجاح
            </div>
          )}
        </div>
      )}
      {/* Hero Section */}
  <Motion.div 
        className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-10 text-white shadow-2xl mb-8"
        {...fadeInUp}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="mb-8 lg:mb-0">
            <h2 className="text-4xl font-bold mb-3">مرحباً بك في منصة أعمالي!</h2>
            <p className="text-emerald-100 text-lg max-w-2xl">
              هنا يمكنك إدارة جميع عملياتك التجارية بسلاسة، من الموردين إلى العملاء، كل ذلك في مكان واحد.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="bg-white text-emerald-600 px-6 py-2 rounded-full font-bold hover:bg-emerald-50 transition-colors">
                ابدأ الآن
              </button>
              <button className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-full font-bold hover:bg-white/10 transition-colors">
                عرض الدليل
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
            <div className="text-center">
              <p className="text-4xl font-bold">120</p>
              <p className="text-emerald-200">مورد نشط</p>
            </div>
            <div className="w-px h-12 bg-emerald-400 hidden sm:block"></div>
            <div className="text-center">
              <p className="text-4xl font-bold">350</p>
              <p className="text-emerald-200">تاجر معتمد</p>
            </div>
            <div className="w-px h-12 bg-emerald-400 hidden sm:block"></div>
            <div className="text-center">
              <p className="text-4xl font-bold">1,240</p>
              <p className="text-emerald-200">منتج متاح</p>
            </div>
          </div>
        </div>
  </Motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <Motion.div
            key={stat.title}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            {/* Background gradient effect */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-10 rounded-full -translate-y-4 translate-x-4" 
                 style={{ background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }}></div>
            
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center transition-transform duration-300 hover:rotate-12 hover:scale-110`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'positive' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.title}</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
              <span className="text-gray-500 text-sm mr-2">{stat.unit}</span>
            </div>
          </Motion.div>
        ))}
      </div>

      {/* Recent Activity & Featured Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Activity */}
  <Motion.div 
          className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">آخر النشاطات</h3>
          <div className="space-y-4">
            {displayRecentActivities.map((activity, index) => (
              <Motion.div 
                key={activity.id}
                className="flex items-start hover:bg-gray-50 p-3 rounded-lg transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <div className={`w-10 h-10 ${activity.iconBg} rounded-full flex items-center justify-center flex-shrink-0 ml-3`}>
                  <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </Motion.div>
            ))}
          </div>
          <button className="w-full mt-6 text-center text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
            عرض كل النشاطات
          </button>
  </Motion.div>

        {/* Featured Products */}
  <Motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">أحدث المنتجات المضافة</h3>
            <button className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center transition-colors">
              <span>عرض الكل</span>
              <ChevronDown className="w-4 h-4 mr-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProducts.map((product, index) => (
              <Motion.div 
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className={`absolute top-3 left-3 ${product.badge.color} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                    {product.badge.text}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-amber-400 fill-current" />
                      <span className="text-sm text-gray-600 mr-1">{product.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 mb-4 text-sm">{product.supplier}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xl text-emerald-600">
                        {product.price.toLocaleString()} <span className="text-sm">ر.س</span>
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through mr-2">
                          {product.originalPrice.toLocaleString()} ر.س
                        </span>
                      )}
                    </div>
                    <button className="bg-emerald-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-emerald-600 transition-colors text-sm">
                      تفاصيل
                    </button>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
  </Motion.div>
      </div>

      {/* Performance Chart Section */}
  <Motion.div 
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">أداء المبيعات</h3>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSelectedPeriod('daily')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedPeriod === 'daily' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              يومي
            </button>
            <button 
              onClick={() => setSelectedPeriod('weekly')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedPeriod === 'weekly' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              أسبوعي
            </button>
            <button 
              onClick={() => setSelectedPeriod('monthly')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedPeriod === 'monthly' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              شهري
            </button>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">سيتم عرض الرسم البياني هنا</p>
            <p className="text-sm text-gray-400">البيانات للفترة: {selectedPeriod === 'daily' ? 'يومي' : selectedPeriod === 'weekly' ? 'أسبوعي' : 'شهري'}</p>
          </div>
        </div>
  </Motion.div>

      {/* Quick Actions */}
  <Motion.div 
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">إضافة طلب</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">إدارة الموردين</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">تتبع الشحنات</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors group">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">عرض التقارير</span>
          </button>
        </div>
  </Motion.div>
    </div>
  );
};

export default MerchantDashboard;

