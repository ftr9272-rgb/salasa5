import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Package, Users, DollarSign, Download, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';

interface SalesData {
  month: string;
  sales: number;
  orders: number;
  revenue: number;
}

interface TopMerchant {
  name: string;
  orders: number;
  revenue: number;
  growth: number;
  avatar: string;
}

function SupplierAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const salesData: SalesData[] = [
    { month: 'يناير', sales: 145, orders: 89, revenue: 35420 },
    { month: 'فبراير', sales: 189, orders: 112, revenue: 42580 },
    { month: 'مارس', sales: 234, orders: 145, revenue: 58930 },
    { month: 'أبريل', sales: 198, orders: 134, revenue: 49870 },
    { month: 'مايو', sales: 267, orders: 167, revenue: 67340 },
    { month: 'يونيو', sales: 324, orders: 201, revenue: 89250 },
  ];

  const topMerchants: TopMerchant[] = [
    {
      name: 'متجر الإلكترونيات الذكية',
      orders: 156,
      revenue: 45230,
      growth: 18.5,
      avatar: '🔌'
    },
    {
      name: 'متجر الأزياء العصرية',
      orders: 134,
      revenue: 38920,
      growth: 12.3,
      avatar: '👗'
    },
    {
      name: 'مكتبة المعرفة الثقافية',
      orders: 98,
      revenue: 28450,
      growth: 24.7,
      avatar: '📚'
    },
    {
      name: 'صيدلية النور الطبية',
      orders: 87,
      revenue: 25680,
      growth: -2.1,
      avatar: '💊'
    },
    {
      name: 'متجر الرياضة والصحة',
      orders: 72,
      revenue: 19850,
      growth: 15.2,
      avatar: '⚽'
    }
  ];

  const kpiData = [
    {
      title: 'إجمالي الإيرادات',
      value: '367,320 ريال',
      change: '+23.5%',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      trend: 'up'
    },
    {
      title: 'عدد الطلبات',
      value: '1,248',
      change: '+15.8%',
      icon: <Package className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      trend: 'up'
    },
    {
      title: 'التجار النشطون',
      value: '142',
      change: '+8.2%',
      icon: <Users className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      trend: 'up'
    },
    {
      title: 'متوسط قيمة الطلب',
      value: '294 ريال',
      change: '+5.4%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      trend: 'up'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-center lg:text-right mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              📈 تحليلات وإحصائيات المورد
            </h1>
            <p className="text-lg text-gray-600">
              تحليل شامل لأداء مبيعاتك وشراكاتك مع التجار
            </p>
          </div>

          {/* أدوات التحكم */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الفترة الزمنية
                  </label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    title="اختر الفترة الزمنية"
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="1month">الشهر الماضي</option>
                    <option value="3months">آخر 3 أشهر</option>
                    <option value="6months">آخر 6 أشهر</option>
                    <option value="1year">السنة الماضية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    المؤشر الرئيسي
                  </label>
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    title="اختر المؤشر"
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="revenue">الإيرادات</option>
                    <option value="orders">الطلبات</option>
                    <option value="sales">المبيعات</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  تصدير التقرير
                </button>
                <button className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  فلاتر متقدمة
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* المؤشرات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`${kpi.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${kpi.color} p-3 rounded-xl bg-white/40 shadow-inner`}>
                  {kpi.icon}
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                  kpi.trend === 'up' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {kpi.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {kpi.change}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {kpi.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {kpi.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* الرسوم البيانية والتحليلات */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* رسم بياني للمبيعات */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  📊 تطور المبيعات الشهرية
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  تتبع أداء المبيعات والإيرادات عبر الوقت
                </p>
              </div>
            </div>

            {/* مساحة الرسم البياني */}
            <div className="h-80 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-6">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>الرسم البياني سيتم تطبيقه هنا</p>
                <p className="text-sm mt-2">يمكن استخدام مكتبة Chart.js أو Recharts</p>
              </div>
            </div>

            {/* تفاصيل إضافية */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <div className="text-2xl font-bold text-emerald-600 mb-1">
                  {salesData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">إجمالي الإيرادات</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {salesData.reduce((sum, item) => sum + item.orders, 0)}
                </div>
                <div className="text-sm text-gray-600">إجمالي الطلبات</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {Math.round(salesData.reduce((sum, item) => sum + item.revenue, 0) / salesData.reduce((sum, item) => sum + item.orders, 0))}
                </div>
                <div className="text-sm text-gray-600">متوسط قيمة الطلب</div>
              </div>
            </div>
          </motion.div>

          {/* أفضل التجار */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                🏆 أفضل التجار الشركاء
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                التجار الأكثر طلباً لمنتجاتك
              </p>
            </div>

            <div className="space-y-4">
              {topMerchants.map((merchant, index) => (
                <motion.div
                  key={merchant.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-full flex items-center justify-center text-lg">
                      {merchant.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white text-sm leading-tight">
                        {merchant.name}
                      </h3>
                      <div className={`flex items-center gap-1 text-xs ${
                        merchant.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {merchant.growth > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {Math.abs(merchant.growth)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">الطلبات</span>
                      <div className="font-semibold text-emerald-600">{merchant.orders}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">الإيرادات</span>
                      <div className="font-semibold text-blue-600">{merchant.revenue.toLocaleString()} ريال</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* تحليلات إضافية */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* تحليل الفئات */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              📦 أداء الفئات
            </h3>
            <div className="space-y-4">
              {[
                { name: 'إلكترونيات', percentage: 35, color: 'bg-emerald-500' },
                { name: 'ملابس', percentage: 28, color: 'bg-blue-500' },
                { name: 'منزل وحديقة', percentage: 20, color: 'bg-purple-500' },
                { name: 'كتب', percentage: 17, color: 'bg-amber-500' }
              ].map((category, index) => (
                <div key={category.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category.name}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {category.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className={`h-2 rounded-full ${category.color}`}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* إحصائيات زمنية */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              ⏰ التوزيع الزمني للطلبات
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { time: 'الصباح', orders: 145, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                { time: 'الظهر', orders: 234, color: 'text-orange-600', bg: 'bg-orange-50' },
                { time: 'المساء', orders: 189, color: 'text-purple-600', bg: 'bg-purple-50' },
                { time: 'الليل', orders: 67, color: 'text-blue-600', bg: 'bg-blue-50' }
              ].map((period, index) => (
                <motion.div
                  key={period.time}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`${period.bg} rounded-xl p-4 text-center`}
                >
                  <div className={`text-2xl font-bold ${period.color} mb-1`}>
                    {period.orders}
                  </div>
                  <div className="text-sm text-gray-600">
                    {period.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SupplierAnalytics;