import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart, Calendar } from 'lucide-react';
import { useState } from 'react';

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const AnalyticsCard = ({ title, value, change, trend, icon, color, bgColor }: AnalyticsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    className={`${bgColor} p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${color.replace('text-', 'bg-').replace('-600', '-100')} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
        trend === 'up' 
          ? 'bg-green-100 text-green-600' 
          : 'bg-red-100 text-red-600'
      }`}>
        {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {change}
      </div>
    </div>
    
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  </motion.div>
);

interface SalesChartData {
  month: string;
  sales: number;
  orders: number;
}

function SupplierAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('شهري');
  
  const analyticsData = [
    {
      title: 'إجمالي الإيرادات',
      value: '284,650 ريال',
      change: '+24.5%',
      trend: 'up' as const,
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'عدد الطلبات',
      value: '1,847',
      change: '+18.2%',
      trend: 'up' as const,
      icon: <ShoppingCart className="w-6 h-6 text-blue-600" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'منتجات جديدة',
      value: '124',
      change: '+31.7%',
      trend: 'up' as const,
      icon: <Package className="w-6 h-6 text-purple-600" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'تجار جدد',
      value: '89',
      change: '-5.3%',
      trend: 'down' as const,
      icon: <Users className="w-6 h-6 text-amber-600" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  const salesData: SalesChartData[] = [
    { month: 'يناير', sales: 45000, orders: 234 },
    { month: 'فبراير', sales: 52000, orders: 267 },
    { month: 'مارس', sales: 48000, orders: 245 },
    { month: 'أبريل', sales: 61000, orders: 312 },
    { month: 'مايو', sales: 58000, orders: 298 },
    { month: 'يونيو', sales: 67000, orders: 345 }
  ];

  const topMerchants = [
    { name: 'متجر الإلكترونيات الذكية', orders: 156, revenue: '45,200 ريال', growth: '+23%' },
    { name: 'متجر الأزياء العصرية', orders: 134, revenue: '38,750 ريال', growth: '+18%' },
    { name: 'مكتبة المعرفة الشاملة', orders: 98, revenue: '28,500 ريال', growth: '+15%' },
    { name: 'صيدلية النور الطبية', orders: 87, revenue: '24,300 ريال', growth: '+12%' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            📊 التحليلات والتقارير
          </h1>
          <p className="text-gray-600 mt-1">تحليل شامل لأداء أعمالك كمورد</p>
        </div>
        
        {/* Period Selector */}
        <div className="flex gap-2">
          {['أسبوعي', 'شهري', 'سنوي'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((item, index) => (
          <AnalyticsCard key={index} {...item} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">مخطط المبيعات</h2>
              <p className="text-gray-600 text-sm">تطور المبيعات والطلبات خلال الأشهر الماضية</p>
            </div>
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {salesData.map((item, index) => (
              <motion.div
                key={item.month}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-16 text-sm font-medium text-gray-600">{item.month}</div>
                
                {/* Sales Bar */}
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">المبيعات</span>
                    <span className="font-semibold text-emerald-600">{item.sales.toLocaleString()} ريال</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-1000 ${
                      item.sales >= 60000 ? 'w-full' :
                      item.sales >= 50000 ? 'w-5/6' :
                      item.sales >= 40000 ? 'w-3/4' :
                      'w-2/3'
                    }`}></div>
                  </div>
                </div>
                
                {/* Orders Bar */}
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">الطلبات</span>
                    <span className="font-semibold text-blue-600">{item.orders}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-1000 ${
                      item.orders >= 300 ? 'w-full' :
                      item.orders >= 250 ? 'w-5/6' :
                      item.orders >= 200 ? 'w-2/3' :
                      'w-1/2'
                    }`}></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Merchants */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">أفضل التجار</h2>
              <p className="text-gray-600 text-sm">الشركاء الأكثر تفاعلاً</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {topMerchants.map((merchant, index) => (
              <motion.div
                key={merchant.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm flex-1">{merchant.name}</h3>
                </div>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الطلبات:</span>
                    <span className="font-semibold text-blue-600">{merchant.orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الإيرادات:</span>
                    <span className="font-semibold text-emerald-600">{merchant.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">النمو:</span>
                    <span className="font-semibold text-green-600">{merchant.growth}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">🎯 رؤى الأداء</h2>
          <p className="text-emerald-100">تحليل ذكي لنقاط القوة والتحسين</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <Calendar className="w-8 h-8 mx-auto mb-3 text-emerald-200" />
            <div className="text-2xl font-bold mb-2">2.3 يوم</div>
            <div className="text-emerald-100 text-sm">متوسط وقت معالجة الطلب</div>
          </div>
          
          <div className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <TrendingUp className="w-8 h-8 mx-auto mb-3 text-blue-200" />
            <div className="text-2xl font-bold mb-2">94.7%</div>
            <div className="text-blue-100 text-sm">معدل إتمام الطلبات في الوقت</div>
          </div>
          
          <div className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <BarChart3 className="w-8 h-8 mx-auto mb-3 text-purple-200" />
            <div className="text-2xl font-bold mb-2">4.8/5</div>
            <div className="text-purple-100 text-sm">متوسط تقييم التجار</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupplierAnalytics;