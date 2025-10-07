import { motion } from 'framer-motion';
import { Users, Star, TrendingUp, MessageSquare, Phone, Mail, MapPin, Calendar, Filter, Search, Plus, Eye, Edit } from 'lucide-react';
import { useState } from 'react';

interface Merchant {
  id: string;
  name: string;
  category: string;
  location: string;
  totalOrders: number;
  totalRevenue: number;
  rating: number;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastOrder: string;
  phone: string;
  email: string;
  avatar: string;
  growth: number;
}

function MerchantPartnership() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  
  const statuses = ['الكل', 'نشط', 'غير نشط', 'في الانتظار'];
  const categories = ['الكل', 'إلكترونيات', 'ملابس', 'منزل وحديقة', 'كتب', 'صحة وجمال', 'رياضة', 'طعام ومشروبات'];

  const merchants: Merchant[] = [
    {
      id: 'MER-001',
      name: 'متجر الإلكترونيات الذكية',
      category: 'إلكترونيات',
      location: 'الرياض - حي الملز',
      totalOrders: 156,
      totalRevenue: 45230,
      rating: 4.8,
      status: 'active',
      joinDate: '2023-05-15',
      lastOrder: '2024-01-15',
      phone: '+966501234567',
      email: 'smart.electronics@email.com',
      avatar: '🔌',
      growth: 18.5
    },
    {
      id: 'MER-002',
      name: 'متجر الأزياء العصرية',
      category: 'ملابس',
      location: 'جدة - حي الروضة',
      totalOrders: 134,
      totalRevenue: 38920,
      rating: 4.6,
      status: 'active',
      joinDate: '2023-08-22',
      lastOrder: '2024-01-14',
      phone: '+966507654321',
      email: 'fashion.store@email.com',
      avatar: '👗',
      growth: 12.3
    },
    {
      id: 'MER-003',
      name: 'مكتبة المعرفة الثقافية',
      category: 'كتب',
      location: 'الدمام - الكورنيش',
      totalOrders: 98,
      totalRevenue: 28450,
      rating: 4.9,
      status: 'active',
      joinDate: '2023-03-10',
      lastOrder: '2024-01-13',
      phone: '+966509876543',
      email: 'knowledge.library@email.com',
      avatar: '📚',
      growth: 24.7
    },
    {
      id: 'MER-004',
      name: 'صيدلية النور الطبية',
      category: 'صحة وجمال',
      location: 'مكة - العزيزية',
      totalOrders: 87,
      totalRevenue: 25680,
      rating: 4.7,
      status: 'inactive',
      joinDate: '2023-06-18',
      lastOrder: '2023-12-20',
      phone: '+966512345678',
      email: 'noor.pharmacy@email.com',
      avatar: '💊',
      growth: -2.1
    },
    {
      id: 'MER-005',
      name: 'متجر الرياضة والصحة',
      category: 'رياضة',
      location: 'المدينة المنورة',
      totalOrders: 72,
      totalRevenue: 19850,
      rating: 4.5,
      status: 'pending',
      joinDate: '2024-01-05',
      lastOrder: 'لا يوجد',
      phone: '+966515678901',
      email: 'sports.health@email.com',
      avatar: '⚽',
      growth: 0
    },
    {
      id: 'MER-006',
      name: 'متجر الأثاث المنزلي',
      category: 'منزل وحديقة',
      location: 'الخبر - الكورنيش',
      totalOrders: 45,
      totalRevenue: 15240,
      rating: 4.4,
      status: 'active',
      joinDate: '2023-11-12',
      lastOrder: '2024-01-12',
      phone: '+966518765432',
      email: 'home.furniture@email.com',
      avatar: '🛋️',
      growth: 8.9
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'inactive':
        return 'غير نشط';
      case 'pending':
        return 'في الانتظار';
      default:
        return 'غير محدد';
    }
  };

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'الكل' || getStatusText(merchant.status) === selectedStatus;
    const matchesCategory = selectedCategory === 'الكل' || merchant.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalStats = {
    totalMerchants: merchants.length,
    activeMerchants: merchants.filter(m => m.status === 'active').length,
    totalRevenue: merchants.reduce((sum, m) => sum + m.totalRevenue, 0),
    averageRating: merchants.reduce((sum, m) => sum + m.rating, 0) / merchants.length
  };

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
              🤝 إدارة الشراكات مع التجار
            </h1>
            <p className="text-lg text-gray-600">
              إدارة علاقاتك التجارية وتتبع أداء شركائك من التجار
            </p>
          </div>

          {/* شريط الأدوات */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              {/* البحث والفلترة */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ابحث عن تاجر..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    title="فلتر حسب الحالة"
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    title="فلتر حسب الفئة"
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex gap-2">
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  إضافة تاجر جديد
                </button>
                <button className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  فلاتر متقدمة
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* إحصائيات عامة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-600">
                {totalStats.totalMerchants}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">إجمالي التجار</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                {totalStats.activeMerchants}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">تجار نشطون</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">💰</span>
              <span className="text-2xl font-bold text-purple-600">
                {totalStats.totalRevenue.toLocaleString()}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">إجمالي الإيرادات</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">
                {totalStats.averageRating.toFixed(1)}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">متوسط التقييم</h3>
          </motion.div>
        </div>

        {/* قائمة التجار */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              📋 قائمة التجار الشركاء ({filteredMerchants.length})
            </h2>
          </div>

          <div className="grid gap-6 p-6">
            {filteredMerchants.map((merchant, index) => (
              <motion.div
                key={merchant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-gray-200 dark:border-gray-600"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  {/* معلومات التاجر الأساسية */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                      {merchant.avatar}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                          {merchant.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(merchant.status)}`}>
                          {getStatusText(merchant.status)}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 rounded-md text-xs font-medium">
                            {merchant.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {merchant.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          انضم في {merchant.joinDate}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900 dark:text-white mr-1">
                          {merchant.rating}
                        </span>
                        <span className={`text-sm ${
                          merchant.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ({merchant.growth > 0 ? '+' : ''}{merchant.growth}% نمو)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* الإحصائيات */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">
                        {merchant.totalOrders}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">الطلبات</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {merchant.totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">الإيرادات</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600 mb-1">
                        {merchant.lastOrder !== 'لا يوجد' ? merchant.lastOrder : 'لا يوجد'}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">آخر طلب</div>
                    </div>
                    
                    <div className="flex lg:flex-col gap-2 lg:gap-1">
                      <button 
                        title={`الاتصال بـ ${merchant.name}`}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-200"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button 
                        title={`إرسال بريد إلكتروني إلى ${merchant.name}`}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        title={`محادثة مع ${merchant.name}`}
                        className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors duration-200"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* أزرار الإجراءات */}
                  <div className="flex gap-2">
                    <button 
                      title="عرض تفاصيل التاجر"
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      title="تعديل بيانات التاجر"
                      className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredMerchants.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                لا توجد تجار
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                لم يتم العثور على تجار يطابقون معايير البحث المحددة
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default MerchantPartnership;