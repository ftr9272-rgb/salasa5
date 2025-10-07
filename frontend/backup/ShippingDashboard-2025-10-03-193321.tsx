import { motion } from 'framer-motion';
import { Package, TrendingUp, Users, ShoppingCart, Truck, AlertCircle, CheckCircle, Clock, Plus, Filter, Search, BarChart3, Eye, Edit, Star, MapPin, Phone, Route, Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import MarketPredictions from '../components/MarketPredictions';
import MarketOpportunities from '../components/MarketOpportunities';
import { useAuth } from '../contexts/AuthContext';
// Chat handled globally via header + ChatController
import { NotificationProvider } from '../components/NotificationProvider';
import AddOrderModal from '../components/AddOrderModal';
import OrderDetailsModal from '../components/OrderDetailsModal';
import AddDriverModal from '../components/AddDriverModal';
import AddVehicleModal from '../components/AddVehicleModal';
import AddShippingServiceModal from '../components/AddShippingServiceModal';
import useResponsive from '../components/ResponsiveUtils';

function ShippingDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('الشهر');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDriver, setSelectedDriver] = useState('');
  // chat state moved to global ChatController
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const auth = useAuth();
  const responsive = useResponsive();

  const stats = [
    {
      title: 'الطلبات النشطة',
      value: '156',
      change: '+12.3%',
      icon: <Truck className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      trend: 'up'
    },
    {
      title: 'متوسط وقت التسليم',
      value: '45 دقيقة',
      change: '-8.5%',
      icon: <Clock className="w-6 h-6" />,
      color: 'text-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      trend: 'down'
    },
    {
      title: 'المسافة المقطوعة اليوم',
      value: '2,450 كم',
      change: '+15.2%',
      icon: <Route className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      trend: 'up'
    },
    {
      title: 'تقييم العملاء',
      value: '4.8/5',
      change: '+0.2%',
      icon: <Star className="w-6 h-6" />,
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      trend: 'up'
    }
  ];

  const activeDeliveries = [
    {
      id: 'DEL-001',
      customer: 'أحمد محمد',
      merchant: 'متجر الإلكترونيات الذكية 🔌',
      destination: 'الرياض - حي الملز',
      estimatedTime: '45 دقيقة',
      status: 'في الطريق',
      driver: 'محمد الأحمد',
      driverPhone: '+966501234567',
      progress: 75,
      priority: 'عالية',
      value: '2,500 ريال',
      distance: '15 كم',
      vehicleType: 'شاحنة صغيرة'
    },
    {
      id: 'DEL-002',
      customer: 'سارة حسن',
      merchant: 'متجر الأزياء العصرية 👗',
      destination: 'جدة - حي الروضة',
      estimatedTime: '1.5 ساعة',
      status: 'تم الاستلام',
      driver: 'عبدالله السعد',
      driverPhone: '+966507654321',
      progress: 25,
      priority: 'متوسطة',
      value: '850 ريال',
      distance: '25 كم',
      vehicleType: 'دراجة نارية'
    },
    {
      id: 'DEL-003',
      customer: 'محمد علي',
      merchant: 'مكتبة المعرفة 📚',
      destination: 'الدمام - الكورنيش',
      estimatedTime: '2 ساعة',
      status: 'جاهز للشحن',
      driver: 'خالد المطيري',
      driverPhone: '+966509876543',
      progress: 10,
      priority: 'منخفضة',
      value: '320 ريال',
      distance: '8 كم',
      vehicleType: 'سيارة'
    },
    {
      id: 'DEL-004',
      customer: 'فاطمة أحمد',
      merchant: 'صيدلية النور الطبية 💊',
      destination: 'مكة - العزيزية',
      estimatedTime: '30 دقيقة',
      status: 'وصل للعميل',
      driver: 'سعد الغامدي',
      driverPhone: '+966502468135',
      progress: 95,
      priority: 'عاجلة',
      value: '150 ريال',
      distance: '5 كم',
      vehicleType: 'دراجة نارية'
    },
    {
      id: 'DEL-005',
      customer: 'خالد محمود',
      merchant: 'عالم الرياضة 🏀',
      destination: 'الطائف - الشفا',
      estimatedTime: '3 ساعات',
      status: 'تأخير',
      driver: 'أحمد الزهراني',
      driverPhone: '+966503691470',
      progress: 60,
      priority: 'متوسطة',
      value: '1,200 ريال',
      distance: '85 كم',
      vehicleType: 'شاحنة متوسطة'
    }
  ];

  const drivers = [
    { name: 'محمد الأحمد', status: 'نشط', deliveries: 12, rating: 4.8, vehicle: 'ش-123', todayEarnings: '450 ريال' },
    { name: 'عبدالله السعد', status: 'نشط', deliveries: 8, rating: 4.9, vehicle: 'د-456', todayEarnings: '320 ريال' },
    { name: 'خالد المطيري', status: 'متاح', deliveries: 15, rating: 4.7, vehicle: 'س-789', todayEarnings: '580 ريال' },
    { name: 'سعد الغامدي', status: 'نشط', deliveries: 6, rating: 4.6, vehicle: 'د-321', todayEarnings: '280 ريال' },
    { name: 'أحمد الزهراني', status: 'مشغول', deliveries: 3, rating: 4.5, vehicle: 'ش-654', todayEarnings: '180 ريال' }
  ];

  const fleetData = {
    total: 25,
    active: 18,
    maintenance: 3,
    available: 4
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'في الطريق':
        return 'bg-blue-100 text-blue-800';
      case 'تم الاستلام':
        return 'bg-yellow-100 text-yellow-800';
      case 'جاهز للشحن':
        return 'bg-cyan-100 text-cyan-800';
      case 'وصل للعميل':
        return 'bg-emerald-100 text-emerald-800';
      case 'تأخير':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عاجلة':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'عالية':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'متوسطة':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'منخفضة':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  const handleEditOrder = (order: any) => {
    toast.success('تعديل الطلب قيد التنفيذ');
  };

  const handleAddOrder = (order: any) => {
    console.log('Adding order:', order);
    toast.success('تم إضافة الطلب بنجاح!');
    setShowAddOrderModal(false);
  };

  const handleUpdateOrder = (orderId: string, updates: any) => {
    console.log('Updating order:', orderId, updates);
    toast.success('تم تحديث حالة الطلب بنجاح!');
  };

  const handleAddDriver = (driver: any) => {
    console.log('Adding driver:', driver);
    toast.success('تم إضافة السائق بنجاح!');
    setShowAddDriverModal(false);
  };

  const handleAddVehicle = (vehicle: any) => {
    console.log('Adding vehicle:', vehicle);
    toast.success('تم إضافة المركبة بنجاح!');
    setShowAddVehicleModal(false);
  };

  const handleAddService = (service: any) => {
    console.log('Adding service:', service);
    toast.success('تم إضافة الخدمة بنجاح إلى السوق!');
    setShowAddServiceModal(false);
  };

  const filteredDeliveries = activeDeliveries.filter(delivery => 
    selectedDriver === '' || delivery.driver === selectedDriver
  );

  return (
    <NotificationProvider userType="shipping">
      <div className="min-h-screen bg-gray-50" dir="rtl">
        {/* Modals */}
        <AddOrderModal 
          isOpen={showAddOrderModal} 
          onClose={() => setShowAddOrderModal(false)} 
          onAdd={handleAddOrder}
          userType="shipping"
        />
        <OrderDetailsModal 
          isOpen={showOrderDetailsModal} 
          onClose={() => setShowOrderDetailsModal(false)} 
          order={selectedOrder}
          onUpdate={handleUpdateOrder}
        />
        <AddDriverModal 
          isOpen={showAddDriverModal} 
          onClose={() => setShowAddDriverModal(false)} 
          onAdd={handleAddDriver}
        />
        <AddVehicleModal 
          isOpen={showAddVehicleModal} 
          onClose={() => setShowAddVehicleModal(false)} 
          onAdd={handleAddVehicle}
        />
        <AddShippingServiceModal 
          isOpen={showAddServiceModal} 
          onClose={() => setShowAddServiceModal(false)} 
          onAdd={handleAddService}
          user={auth.user ? {
            id: auth.user.id,
            name: auth.user.companyName || auth.user.name,
            type: auth.user.role as 'merchant' | 'supplier' | 'shipping_company',
            rating: 4.8, // Mock rating for now
            verified: auth.user.isVerified
          } : undefined}
        />

        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">لوحة تحكم الشحن</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">مرحباً بك في نظام إدارة الشحن والتوصيل</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="اليوم">اليوم</option>
                <option value="الأسبوع">الأسبوع</option>
                <option value="الشهر">الشهر</option>
                <option value="السنة">السنة</option>
              </select>
              
              <button 
                onClick={() => setShowAddServiceModal(true)}
                className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">إضافة خدمة</span>
              </button>
              
              <button 
                onClick={() => setShowAddOrderModal(true)}
                className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">إضافة طلب</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bgColor} rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">{stat.value}</p>
                    <div className={`flex items-center mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                      ) : (
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 ml-1 transform rotate-180" />
                      )}
                      <span className="text-xs sm:text-sm">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-2 sm:p-3 rounded-lg bg-white bg-opacity-50`}>
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200 overflow-x-auto">
              <nav className="flex space-x-reverse px-4 sm:px-6 min-w-max">
                {[
                  { id: 'overview', label: 'نظرة عامة', icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" /> },
                  { id: 'orders', label: 'الطلبات', icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" /> },
                  { id: 'drivers', label: 'السائقين', icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },
                  { id: 'fleet', label: 'الأسطول', icon: <Truck className="w-4 h-4 sm:w-5 sm:h-5" /> },
                  { id: 'market', label: 'الفرص السوقية', icon: <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.charAt(0)}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Active Deliveries */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <h2 className="text-xl font-bold text-gray-900">الشحنات النشطة</h2>
                      
                      <div className="flex items-center gap-3">
                        <select 
                          value={selectedDriver}
                          onChange={(e) => setSelectedDriver(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">جميع السائقين</option>
                          {drivers.map((driver, index) => (
                            <option key={index} value={driver.name}>{driver.name}</option>
                          ))}
                        </select>
                        
                        <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          <Filter className="w-4 h-4" />
                          تصفية
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                      {filteredDeliveries.map((delivery, index) => (
                        <motion.div
                          key={delivery.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="font-semibold text-gray-900 text-sm sm:text-base">{delivery.id}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(delivery.priority)}`}>
                                  {delivery.priority}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-1">{delivery.customer}</p>
                              <p className="text-gray-500 text-xs sm:text-sm">{delivery.merchant}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                              {delivery.status}
                            </span>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span className="text-xs sm:text-sm">{delivery.destination}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-gray-600 text-xs">السائق:</span>
                                <p className="font-medium text-xs sm:text-sm">{delivery.driver}</p>
                              </div>
                              <div>
                                <span className="text-gray-600 text-xs">القيمة:</span>
                                <p className="font-medium text-xs sm:text-sm">{delivery.value}</p>
                              </div>
                              <div>
                                <span className="text-gray-600 text-xs">المركبة:</span>
                                <p className="font-medium text-xs sm:text-sm">{delivery.vehicleType}</p>
                              </div>
                              <div>
                                <span className="text-gray-600 text-xs">المسافة:</span>
                                <p className="font-medium text-xs sm:text-sm">{delivery.distance}</p>
                              </div>
                            </div>
                            
                            <div className="pt-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">التقدم</span>
                                <span className="text-xs font-medium">{delivery.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${delivery.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-100 gap-2">
                            <span className="text-xs text-gray-500">الوقت المقدر: {delivery.estimatedTime}</span>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <button 
                                onClick={() => handleViewOrder(delivery)}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="عرض التفاصيل"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleEditOrder(delivery)}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="تعديل الطلب"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <a 
                                href={`tel:${delivery.driverPhone}`} 
                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="الاتصال بالسائق"
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Market Predictions */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">التنبؤات السوقية</h2>
                    <MarketPredictions />
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">إدارة الطلبات</h2>
                    
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="البحث عن طلبات..."
                          className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                        />
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="w-5 h-5" />
                        تصفية
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">رقم الطلب</th>
                          <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">العميل</th>
                          <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm hidden md:table-cell">المتجر</th>
                          <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">الحالة</th>
                          <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm hidden sm:table-cell">السائق</th>
                          <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">القيمة</th>
                          <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeDeliveries.map((delivery) => (
                          <tr key={delivery.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-xs sm:text-sm">{delivery.id}</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm">
                              <div>
                                <div>{delivery.customer}</div>
                                <div className="text-gray-500 text-xs sm:hidden">{delivery.merchant}</div>
                              </div>
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 text-gray-600 text-xs sm:text-sm hidden md:table-cell">{delivery.merchant}</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4">
                              <span className={`px-1 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                                {delivery.status}
                              </span>
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm hidden sm:table-cell">{delivery.driver}</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-xs sm:text-sm">{delivery.value}</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4">
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => handleViewOrder(delivery)}
                                  className="p-1 sm:p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="عرض التفاصيل"
                                >
                                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button 
                                  onClick={() => handleEditOrder(delivery)}
                                  className="p-1 sm:p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="تعديل الطلب"
                                >
                                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Drivers Tab */}
              {activeTab === 'drivers' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">إدارة السائقين</h2>
                    <button 
                      onClick={() => setShowAddDriverModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      إضافة سائق
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {drivers.map((driver, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 mb-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                            {driver.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">{driver.name}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">{driver.vehicle}</p>
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-xs sm:text-sm">التسليمات اليوم:</span>
                            <span className="font-medium text-xs sm:text-sm">{driver.deliveries}</span>
                          </div>
                        
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-xs sm:text-sm">التقييم:</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                              <span className="font-medium text-xs sm:text-sm">{driver.rating}</span>
                            </div>
                          </div>
                        
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-xs sm:text-sm">الأرباح اليوم:</span>
                            <span className="font-medium text-green-600 text-xs sm:text-sm">{driver.todayEarnings}</span>
                          </div>
                        
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-xs sm:text-sm">الحالة:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              driver.status === 'نشط' ? 'bg-green-100 text-green-800' :
                              driver.status === 'متاح' ? 'bg-blue-100 text-blue-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {driver.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                          <button className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm font-medium">
                            عرض التفاصيل
                          </button>
                          <button className="flex-1 py-2 px-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-xs sm:text-sm font-medium">
                            تعديل
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fleet Tab */}
              {activeTab === 'fleet' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">إدارة الأسطول</h2>
                    <button 
                      onClick={() => setShowAddVehicleModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      إضافة مركبة
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-6 text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg sm:text-xl">{fleetData.total}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">إجمالي المركبات</p>
                    </div>
                  
                    <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-6 text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg sm:text-xl">{fleetData.active}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">نشطة</p>
                    </div>
                  
                    <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-6 text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg sm:text-xl">{fleetData.maintenance}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">تحت الصيانة</p>
                    </div>
                  
                    <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-6 text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg sm:text-xl">{fleetData.available}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">متاحة</p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm sm:text-base">تفاصيل الأسطول</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">رقم اللوحة</th>
                            <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm hidden sm:table-cell">النوع</th>
                            <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">السائق</th>
                            <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">الحالة</th>
                            <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm hidden md:table-cell">الصيانة القادمة</th>
                            <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100">
                            <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-xs sm:text-sm">ش-123</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm hidden sm:table-cell">شاحنة صغيرة</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm">محمد الأحمد</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4">
                              <span className="px-1 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                نشطة
                              </span>
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm hidden md:table-cell">15/10/2025</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4">
                              <button className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium">
                                عرض التفاصيل
                              </button>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-xs sm:text-sm">د-456</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm hidden sm:table-cell">دراجة نارية</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm">عبدالله السعد</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4">
                              <span className="px-1 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                نشطة
                              </span>
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm hidden md:table-cell">22/10/2025</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4">
                              <button className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium">
                                عرض التفاصيل
                              </button>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-xs sm:text-sm">س-789</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm hidden sm:table-cell">سيارة</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm">خالد المطيري</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4">
                              <span className="px-1 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                تحت الصيانة
                              </span>
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm hidden md:table-cell">-</td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4">
                              <button className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium">
                                عرض التفاصيل
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Market Opportunities Tab */}
              {activeTab === 'market' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">الفرص السوقية</h2>
                  <MarketOpportunities 
                    userType="shipping"
                    user={auth.user && auth.user.role !== 'admin' ? {
                      id: auth.user.id,
                      name: auth.user.companyName || auth.user.name,
                      type: auth.user.role as 'merchant' | 'supplier' | 'shipping_company',
                      rating: 4.8, // Mock rating for now
                      verified: auth.user.isVerified
                    } : undefined}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
}

export default ShippingDashboard;