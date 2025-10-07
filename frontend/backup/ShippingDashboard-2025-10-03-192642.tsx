import React, { useState } from 'react';import { motion } from 'framer-motion';

import { motion } from 'framer-motion';import { Package, TrendingUp, Users, ShoppingCart, Truck, AlertCircle, CheckCircle, Clock, Plus, Filter, Search, BarChart3, Eye, Edit, Star, MapPin, Phone, Route, Send } from 'lucide-react';

import { Truck, Users, Package, TrendingUp, Plus, Search, Bell, Settings, import { useState } from 'react';

         Home, BarChart, Calendar, MessageSquare, HelpCircle, LogOut,import toast from 'react-hot-toast';

         Menu, X } from 'lucide-react';import MarketPredictions from '../components/MarketPredictions';

import { NotificationProvider } from '../contexts/NotificationContext';import MarketOpportunities from '../components/MarketOpportunities';

import { NotificationToast } from '../components/NotificationToast';import { useAuth } from '../contexts/AuthContext';

// Chat handled globally via header + ChatController

interface Driver {import { NotificationProvider } from '../components/NotificationProvider';

  id: number;import AddOrderModal from '../components/AddOrderModal';

  name: string;import OrderDetailsModal from '../components/OrderDetailsModal';

  status: string;import AddDriverModal from '../components/AddDriverModal';

  vehicle: string;import AddVehicleModal from '../components/AddVehicleModal';

  location: string;import AddShippingServiceModal from '../components/AddShippingServiceModal';

}import useResponsive from '../components/ResponsiveUtils';



interface Vehicle {function ShippingDashboard() {

  id: number;  const [selectedPeriod, setSelectedPeriod] = useState('الشهر');

  plate: string;  const [activeTab, setActiveTab] = useState('overview');

  type: string;  const [selectedDriver, setSelectedDriver] = useState('');

  status: string;  // chat state moved to global ChatController

  driver?: string;  const [showAddOrderModal, setShowAddOrderModal] = useState(false);

}  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);

  const [showAddDriverModal, setShowAddDriverModal] = useState(false);

interface Order {  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  id: number;  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  customer: string;  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  destination: string;  const auth = useAuth();

  status: string;  const responsive = useResponsive();

  value: string;

}  const stats = [

    {

const ShippingDashboard: React.FC = () => {      title: 'الطلبات النشطة',

  const [activeTab, setActiveTab] = useState('dashboard');      value: '156',

  const [sidebarOpen, setSidebarOpen] = useState(false);      change: '+12.3%',

        icon: <Truck className="w-6 h-6" />,

  // Sample data      color: 'text-blue-600',

  const [drivers] = useState<Driver[]>([      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',

    { id: 1, name: 'أحمد محمد', status: 'متاح', vehicle: 'شاحنة 123', location: 'الرياض' },      trend: 'up'

    { id: 2, name: 'محمد علي', status: 'مشغول', vehicle: 'شاحنة 456', location: 'جدة' },    },

    { id: 3, name: 'خالد أحمد', status: 'متاح', vehicle: 'شاحنة 789', location: 'الدمام' }    {

  ]);      title: 'متوسط وقت التسليم',

      value: '45 دقيقة',

  const [vehicles] = useState<Vehicle[]>([      change: '-8.5%',

    { id: 1, plate: 'أ ب ج 123', type: 'شاحنة كبيرة', status: 'متاح', driver: 'أحمد محمد' },      icon: <Clock className="w-6 h-6" />,

    { id: 2, plate: 'د هـ و 456', type: 'شاحنة متوسطة', status: 'في الطريق', driver: 'محمد علي' },      color: 'text-emerald-600',

    { id: 3, plate: 'ز ح ط 789', type: 'شاحنة صغيرة', status: 'قيد الصيانة' }      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',

  ]);      trend: 'down'

    },

  const [orders] = useState<Order[]>([    {

    { id: 1, customer: 'شركة النقل السريع', destination: 'الرياض - جدة', status: 'جاري التحميل', value: '5,000 ريال' },      title: 'المسافة المقطوعة اليوم',

    { id: 2, customer: 'مؤسسة التجارة الحديثة', destination: 'الدمام - الرياض', status: 'في الطريق', value: '8,500 ريال' },      value: '2,450 كم',

    { id: 3, customer: 'شركة اللوجستيات المتقدمة', destination: 'جدة - مكة', status: 'تم التسليم', value: '3,200 ريال' }      change: '+15.2%',

  ]);      icon: <Route className="w-6 h-6" />,

      color: 'text-purple-600',

  const sidebarItems = [      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',

    { id: 'dashboard', label: 'الرئيسية', icon: Home },      trend: 'up'

    { id: 'drivers', label: 'السائقين', icon: Users },    },

    { id: 'vehicles', label: 'المركبات', icon: Truck },    {

    { id: 'orders', label: 'الطلبات', icon: Package },      title: 'تقييم العملاء',

    { id: 'analytics', label: 'التحليلات', icon: BarChart },      value: '4.8/5',

    { id: 'calendar', label: 'التقويم', icon: Calendar },      change: '+0.2%',

    { id: 'messages', label: 'الرسائل', icon: MessageSquare },      icon: <Star className="w-6 h-6" />,

    { id: 'help', label: 'المساعدة', icon: HelpCircle },      color: 'text-amber-600',

    { id: 'settings', label: 'الإعدادات', icon: Settings },      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',

  ];      trend: 'up'

    }

  const renderDashboard = () => (  ];

    <div className="space-y-6">

      {/* Stats Cards */}  const activeDeliveries = [

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">    {

        <motion.div      id: 'DEL-001',

          initial={{ opacity: 0, y: 20 }}      customer: 'أحمد محمد',

          animate={{ opacity: 1, y: 0 }}      merchant: 'متجر الإلكترونيات الذكية 🔌',

          className="bg-white p-6 rounded-lg shadow-sm border"      destination: 'الرياض - حي الملز',

        >      estimatedTime: '45 دقيقة',

          <div className="flex items-center justify-between">      status: 'في الطريق',

            <div>      driver: 'محمد الأحمد',

              <p className="text-sm text-gray-600">إجمالي السائقين</p>      driverPhone: '+966501234567',

              <p className="text-2xl font-semibold text-gray-900">{drivers.length}</p>      progress: 75,

            </div>      priority: 'عالية',

            <Users className="h-8 w-8 text-blue-600" />      value: '2,500 ريال',

          </div>      distance: '15 كم',

        </motion.div>      vehicleType: 'شاحنة صغيرة'

    },

        <motion.div    {

          initial={{ opacity: 0, y: 20 }}      id: 'DEL-002',

          animate={{ opacity: 1, y: 0 }}      customer: 'سارة حسن',

          transition={{ delay: 0.1 }}      merchant: 'متجر الأزياء العصرية 👗',

          className="bg-white p-6 rounded-lg shadow-sm border"      destination: 'جدة - حي الروضة',

        >      estimatedTime: '1.5 ساعة',

          <div className="flex items-center justify-between">      status: 'تم الاستلام',

            <div>      driver: 'عبدالله السعد',

              <p className="text-sm text-gray-600">إجمالي المركبات</p>      driverPhone: '+966507654321',

              <p className="text-2xl font-semibold text-gray-900">{vehicles.length}</p>      progress: 25,

            </div>      priority: 'متوسطة',

            <Truck className="h-8 w-8 text-green-600" />      value: '850 ريال',

          </div>      distance: '25 كم',

        </motion.div>      vehicleType: 'دراجة نارية'

    },

        <motion.div    {

          initial={{ opacity: 0, y: 20 }}      id: 'DEL-003',

          animate={{ opacity: 1, y: 0 }}      customer: 'محمد علي',

          transition={{ delay: 0.2 }}      merchant: 'مكتبة المعرفة 📚',

          className="bg-white p-6 rounded-lg shadow-sm border"      destination: 'الدمام - الكورنيش',

        >      estimatedTime: '2 ساعة',

          <div className="flex items-center justify-between">      status: 'جاهز للشحن',

            <div>      driver: 'خالد المطيري',

              <p className="text-sm text-gray-600">الطلبات النشطة</p>      driverPhone: '+966509876543',

              <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>      progress: 10,

            </div>      priority: 'منخفضة',

            <Package className="h-8 w-8 text-orange-600" />      value: '320 ريال',

          </div>      distance: '8 كم',

        </motion.div>      vehicleType: 'سيارة'

    },

        <motion.div    {

          initial={{ opacity: 0, y: 20 }}      id: 'DEL-004',

          animate={{ opacity: 1, y: 0 }}      customer: 'فاطمة أحمد',

          transition={{ delay: 0.3 }}      merchant: 'صيدلية النور الطبية 💊',

          className="bg-white p-6 rounded-lg shadow-sm border"      destination: 'مكة - العزيزية',

        >      estimatedTime: '30 دقيقة',

          <div className="flex items-center justify-between">      status: 'وصل للعميل',

            <div>      driver: 'سعد الغامدي',

              <p className="text-sm text-gray-600">الإيرادات اليومية</p>      driverPhone: '+966502468135',

              <p className="text-2xl font-semibold text-gray-900">16,700 ريال</p>      progress: 95,

            </div>      priority: 'عاجلة',

            <TrendingUp className="h-8 w-8 text-purple-600" />      value: '150 ريال',

          </div>      distance: '5 كم',

        </motion.div>      vehicleType: 'دراجة نارية'

      </div>    },

    {

      {/* Recent Activity */}      id: 'DEL-005',

      <div className="bg-white rounded-lg shadow-sm border">      customer: 'خالد محمود',

        <div className="p-6 border-b">      merchant: 'عالم الرياضة 🏀',

          <h3 className="text-lg font-semibold text-gray-900">النشاط الأخير</h3>      destination: 'الطائف - الشفا',

        </div>      estimatedTime: '3 ساعات',

        <div className="p-6">      status: 'تأخير',

          <div className="space-y-4">      driver: 'أحمد الزهراني',

            <div className="flex items-center space-x-3 space-x-reverse">      driverPhone: '+966503691470',

              <div className="flex-shrink-0">      progress: 60,

                <Truck className="h-5 w-5 text-green-600" />      priority: 'متوسطة',

              </div>      value: '1,200 ريال',

              <div className="flex-1">      distance: '85 كم',

                <p className="text-sm text-gray-900">تم تحديث حالة الشاحنة أ ب ج 123</p>      vehicleType: 'شاحنة متوسطة'

                <p className="text-xs text-gray-500">منذ 5 دقائق</p>    }

              </div>  ];

            </div>

            <div className="flex items-center space-x-3 space-x-reverse">  const drivers = [

              <div className="flex-shrink-0">    { name: 'محمد الأحمد', status: 'نشط', deliveries: 12, rating: 4.8, vehicle: 'ش-123', todayEarnings: '450 ريال' },

                <Package className="h-5 w-5 text-blue-600" />    { name: 'عبدالله السعد', status: 'نشط', deliveries: 8, rating: 4.9, vehicle: 'د-456', todayEarnings: '320 ريال' },

              </div>    { name: 'خالد المطيري', status: 'متاح', deliveries: 15, rating: 4.7, vehicle: 'س-789', todayEarnings: '580 ريال' },

              <div className="flex-1">    { name: 'سعد الغامدي', status: 'نشط', deliveries: 6, rating: 4.6, vehicle: 'د-321', todayEarnings: '280 ريال' },

                <p className="text-sm text-gray-900">طلب جديد من شركة النقل السريع</p>    { name: 'أحمد الزهراني', status: 'مشغول', deliveries: 3, rating: 4.5, vehicle: 'ش-654', todayEarnings: '180 ريال' }

                <p className="text-xs text-gray-500">منذ 15 دقيقة</p>  ];

              </div>

            </div>  const fleetData = {

            <div className="flex items-center space-x-3 space-x-reverse">    total: 25,

              <div className="flex-shrink-0">    active: 18,

                <Users className="h-5 w-5 text-orange-600" />    maintenance: 3,

              </div>    available: 4

              <div className="flex-1">  };

                <p className="text-sm text-gray-900">السائق محمد علي وصل إلى الوجهة</p>

                <p className="text-xs text-gray-500">منذ 30 دقيقة</p>  const getStatusColor = (status: string) => {

              </div>    switch (status) {

            </div>      case 'في الطريق':

          </div>        return 'bg-blue-100 text-blue-800';

        </div>      case 'تم الاستلام':

      </div>        return 'bg-yellow-100 text-yellow-800';

    </div>      case 'جاهز للشحن':

  );        return 'bg-cyan-100 text-cyan-800';

      case 'وصل للعميل':

  const renderDrivers = () => (        return 'bg-emerald-100 text-emerald-800';

    <div className="space-y-6">      case 'تأخير':

      <div className="flex justify-between items-center">        return 'bg-red-100 text-red-800';

        <h2 className="text-2xl font-bold text-gray-900">إدارة السائقين</h2>      default:

        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">        return 'bg-gray-100 text-gray-800';

          <Plus className="h-4 w-4" />    }

          إضافة سائق جديد  };

        </button>

      </div>  const getPriorityColor = (priority: string) => {

    switch (priority) {

      <div className="bg-white rounded-lg shadow-sm border">      case 'عاجلة':

        <div className="overflow-x-auto">        return 'bg-red-100 text-red-800 border-red-200';

          <table className="min-w-full">      case 'عالية':

            <thead>        return 'bg-orange-100 text-orange-800 border-orange-200';

              <tr className="border-b">      case 'متوسطة':

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">        return 'bg-yellow-100 text-yellow-800 border-yellow-200';

                  الاسم      case 'منخفضة':

                </th>        return 'bg-green-100 text-green-800 border-green-200';

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">      default:

                  الحالة        return 'bg-gray-100 text-gray-800 border-gray-200';

                </th>    }

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">  };

                  المركبة

                </th>  const handleViewOrder = (order: any) => {

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">    setSelectedOrder(order);

                  الموقع    setShowOrderDetailsModal(true);

                </th>  };

              </tr>

            </thead>  const handleEditOrder = (order: any) => {

            <tbody className="divide-y divide-gray-200">    toast.success('تعديل الطلب قيد التنفيذ');

              {drivers.map((driver) => (  };

                <tr key={driver.id}>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">  const handleAddOrder = (order: any) => {

                    {driver.name}    console.log('Adding order:', order);

                  </td>    toast.success('تم إضافة الطلب بنجاح!');

                  <td className="px-6 py-4 whitespace-nowrap">    setShowAddOrderModal(false);

                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${  };

                      driver.status === 'متاح' 

                        ? 'bg-green-100 text-green-800'   const handleUpdateOrder = (orderId: string, updates: any) => {

                        : 'bg-red-100 text-red-800'    console.log('Updating order:', orderId, updates);

                    }`}>    toast.success('تم تحديث حالة الطلب بنجاح!');

                      {driver.status}  };

                    </span>

                  </td>  const handleAddDriver = (driver: any) => {

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">    console.log('Adding driver:', driver);

                    {driver.vehicle}    toast.success('تم إضافة السائق بنجاح!');

                  </td>    setShowAddDriverModal(false);

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">  };

                    {driver.location}

                  </td>  const handleAddVehicle = (vehicle: any) => {

                </tr>    console.log('Adding vehicle:', vehicle);

              ))}    toast.success('تم إضافة المركبة بنجاح!');

            </tbody>    setShowAddVehicleModal(false);

          </table>  };

        </div>

      </div>  const handleAddService = (service: any) => {

    </div>    console.log('Adding service:', service);

  );    toast.success('تم إضافة الخدمة بنجاح إلى السوق!');

    setShowAddServiceModal(false);

  const renderVehicles = () => (  };

    <div className="space-y-6">

      <div className="flex justify-between items-center">  const filteredDeliveries = activeDeliveries.filter(delivery => 

        <h2 className="text-2xl font-bold text-gray-900">إدارة المركبات</h2>    selectedDriver === '' || delivery.driver === selectedDriver

        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">  );

          <Plus className="h-4 w-4" />

          إضافة مركبة جديدة  return (

        </button>    <NotificationProvider userType="shipping">

      </div>      <div className="min-h-screen bg-gray-50" dir="rtl">

        {/* Modals */}

      <div className="bg-white rounded-lg shadow-sm border">        <AddOrderModal 

        <div className="overflow-x-auto">          isOpen={showAddOrderModal} 

          <table className="min-w-full">          onClose={() => setShowAddOrderModal(false)} 

            <thead>          onAdd={handleAddOrder}

              <tr className="border-b">          userType="shipping"

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">        />

                  رقم اللوحة        <OrderDetailsModal 

                </th>          isOpen={showOrderDetailsModal} 

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">          onClose={() => setShowOrderDetailsModal(false)} 

                  النوع          order={selectedOrder}

                </th>          onUpdate={handleUpdateOrder}

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">        />

                  الحالة        <AddDriverModal 

                </th>          isOpen={showAddDriverModal} 

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">          onClose={() => setShowAddDriverModal(false)} 

                  السائق          onAdd={handleAddDriver}

                </th>        />

              </tr>        <AddVehicleModal 

            </thead>          isOpen={showAddVehicleModal} 

            <tbody className="divide-y divide-gray-200">          onClose={() => setShowAddVehicleModal(false)} 

              {vehicles.map((vehicle) => (          onAdd={handleAddVehicle}

                <tr key={vehicle.id}>        />

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">        <AddShippingServiceModal 

                    {vehicle.plate}          isOpen={showAddServiceModal} 

                  </td>          onClose={() => setShowAddServiceModal(false)} 

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">          onAdd={handleAddService}

                    {vehicle.type}          user={auth.user ? {

                  </td>            id: auth.user.id,

                  <td className="px-6 py-4 whitespace-nowrap">            name: auth.user.companyName || auth.user.name,

                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${            type: auth.user.role as 'merchant' | 'supplier' | 'shipping_company',

                      vehicle.status === 'متاح'             rating: 4.8, // Mock rating for now

                        ? 'bg-green-100 text-green-800'             verified: auth.user.isVerified

                        : vehicle.status === 'في الطريق'          } : undefined}

                        ? 'bg-blue-100 text-blue-800'        />

                        : 'bg-red-100 text-red-800'

                    }`}>        <div className="p-6">

                      {vehicle.status}          {/* Header */}

                    </span>          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                  </td>            <div>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">لوحة تحكم الشحن</h1>

                    {vehicle.driver || 'غير محدد'}              <p className="text-gray-600 mt-2 text-sm sm:text-base">مرحباً بك في نظام إدارة الشحن والتوصيل</p>

                  </td>            </div>

                </tr>            

              ))}            <div className="flex flex-wrap items-center gap-2 sm:gap-3">

            </tbody>              <select 

          </table>                value={selectedPeriod}

        </div>                onChange={(e) => setSelectedPeriod(e.target.value)}

      </div>                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"

    </div>              >

  );                <option value="اليوم">اليوم</option>

                <option value="الأسبوع">الأسبوع</option>

  const renderOrders = () => (                <option value="الشهر">الشهر</option>

    <div className="space-y-6">                <option value="السنة">السنة</option>

      <div className="flex justify-between items-center">              </select>

        <h2 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h2>              

        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">              <button 

          <Plus className="h-4 w-4" />                onClick={() => setShowAddServiceModal(true)}

          طلب جديد                className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"

        </button>              >

      </div>                <Send className="w-4 h-4 sm:w-5 sm:h-5" />

                <span className="hidden xs:inline">إضافة خدمة</span>

      <div className="bg-white rounded-lg shadow-sm border">              </button>

        <div className="overflow-x-auto">              

          <table className="min-w-full">              <button 

            <thead>                onClick={() => setShowAddOrderModal(true)}

              <tr className="border-b">                className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">              >

                  العميل                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />

                </th>                <span className="hidden xs:inline">إضافة طلب</span>

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">              </button>

                  الوجهة            </div>

                </th>          </div>

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">

                  الحالة          {/* Stats Cards */}

                </th>          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">            {stats.map((stat, index) => (

                  القيمة              <motion.div

                </th>                key={index}

              </tr>                initial={{ opacity: 0, y: 20 }}

            </thead>                animate={{ opacity: 1, y: 0 }}

            <tbody className="divide-y divide-gray-200">                transition={{ delay: index * 0.1 }}

              {orders.map((order) => (                className={`${stat.bgColor} rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100`}

                <tr key={order.id}>              >

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">                <div className="flex items-center justify-between">

                    {order.customer}                  <div>

                  </td>                    <p className="text-gray-600 text-xs sm:text-sm">{stat.title}</p>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">{stat.value}</p>

                    {order.destination}                    <div className={`flex items-center mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>

                  </td>                      {stat.trend === 'up' ? (

                  <td className="px-6 py-4 whitespace-nowrap">                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />

                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${                      ) : (

                      order.status === 'تم التسليم'                         <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 ml-1 transform rotate-180" />

                        ? 'bg-green-100 text-green-800'                       )}

                        : order.status === 'في الطريق'                      <span className="text-xs sm:text-sm">{stat.change}</span>

                        ? 'bg-blue-100 text-blue-800'                    </div>

                        : 'bg-yellow-100 text-yellow-800'                  </div>

                    }`}>                  <div className={`${stat.color} p-2 sm:p-3 rounded-lg bg-white bg-opacity-50`}>

                      {order.status}                    {stat.icon}

                    </span>                  </div>

                  </td>                </div>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">              </motion.div>

                    {order.value}            ))}

                  </td>          </div>

                </tr>

              ))}          {/* Tabs */}

            </tbody>          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">

          </table>            <div className="border-b border-gray-200 overflow-x-auto">

        </div>              <nav className="flex space-x-reverse px-4 sm:px-6 min-w-max">

      </div>                {[

    </div>                  { id: 'overview', label: 'نظرة عامة', icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" /> },

  );                  { id: 'orders', label: 'الطلبات', icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" /> },

                  { id: 'drivers', label: 'السائقين', icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },

  const renderContent = () => {                  { id: 'fleet', label: 'الأسطول', icon: <Truck className="w-4 h-4 sm:w-5 sm:h-5" /> },

    switch (activeTab) {                  { id: 'market', label: 'الفرص السوقية', icon: <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" /> }

      case 'dashboard':                ].map((tab) => (

        return renderDashboard();                  <button

      case 'drivers':                    key={tab.id}

        return renderDrivers();                    onClick={() => setActiveTab(tab.id)}

      case 'vehicles':                    className={`flex items-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${

        return renderVehicles();                      activeTab === tab.id

      case 'orders':                        ? 'border-blue-500 text-blue-600'

        return renderOrders();                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'

      case 'analytics':                    }`}

        return <div className="text-center py-12 text-gray-500">قريباً - صفحة التحليلات</div>;                  >

      case 'calendar':                    {tab.icon}

        return <div className="text-center py-12 text-gray-500">قريباً - صفحة التقويم</div>;                    <span className="hidden sm:inline">{tab.label}</span>

      case 'messages':                    <span className="sm:hidden">{tab.label.charAt(0)}</span>

        return <div className="text-center py-12 text-gray-500">قريباً - صفحة الرسائل</div>;                  </button>

      case 'help':                ))}

        return <div className="text-center py-12 text-gray-500">قريباً - صفحة المساعدة</div>;              </nav>

      case 'settings':            </div>

        return <div className="text-center py-12 text-gray-500">قريباً - صفحة الإعدادات</div>;

      default:            <div className="p-6">

        return renderDashboard();              {/* Overview Tab */}

    }              {activeTab === 'overview' && (

  };                <div className="space-y-8">

                  {/* Active Deliveries */}

  return (                  <div>

    <NotificationProvider>                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

      <div className="min-h-screen bg-gray-50 flex" dir="rtl">                      <h2 className="text-xl font-bold text-gray-900">الشحنات النشطة</h2>

        {/* Mobile Overlay */}                      

        {sidebarOpen && (                      <div className="flex items-center gap-3">

          <div                         <select 

            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"                          value={selectedDriver}

            onClick={() => setSidebarOpen(false)}                          onChange={(e) => setSelectedDriver(e.target.value)}

          />                          className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"

        )}                        >

                          <option value="">جميع السائقين</option>

        {/* Sidebar */}                          {drivers.map((driver, index) => (

        <motion.div                            <option key={index} value={driver.name}>{driver.name}</option>

          initial={false}                          ))}

          animate={{ x: sidebarOpen ? 0 : -280 }}                        </select>

          className="fixed right-0 top-0 h-full w-70 bg-white shadow-lg z-50 lg:static lg:translate-x-0 lg:shadow-none lg:z-auto"                        

        >                        <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">

          <div className="flex items-center justify-between p-6 border-b">                          <Filter className="w-4 h-4" />

            <h1 className="text-xl font-bold text-gray-900">نظام الشحن</h1>                          تصفية

            <button                        </button>

              onClick={() => setSidebarOpen(false)}                      </div>

              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"                    </div>

            >

              <X className="h-6 w-6" />                    <div className="grid grid-cols-1 gap-4 sm:gap-6">

            </button>                      {filteredDeliveries.map((delivery, index) => (

          </div>                        <motion.div

                          key={delivery.id}

          <nav className="mt-6">                          initial={{ opacity: 0, x: 20 }}

            {sidebarItems.map((item) => {                          animate={{ opacity: 1, x: 0 }}

              const Icon = item.icon;                          transition={{ delay: index * 0.1 }}

              return (                          className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"

                <button                        >

                  key={item.id}                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">

                  onClick={() => {                            <div className="flex-1">

                    setActiveTab(item.id);                              <div className="flex flex-wrap items-center gap-2 mb-2">

                    setSidebarOpen(false);                                <span className="font-semibold text-gray-900 text-sm sm:text-base">{delivery.id}</span>

                  }}                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(delivery.priority)}`}>

                  className={`w-full flex items-center gap-3 px-6 py-3 text-right transition-colors ${                                  {delivery.priority}

                    activeTab === item.id                                </span>

                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'                              </div>

                      : 'text-gray-700 hover:bg-gray-50'                              <p className="text-gray-600 text-sm mb-1">{delivery.customer}</p>

                  }`}                              <p className="text-gray-500 text-xs sm:text-sm">{delivery.merchant}</p>

                >                            </div>

                  <Icon className="h-5 w-5" />                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>

                  <span>{item.label}</span>                              {delivery.status}

                </button>                            </span>

              );                          </div>

            })}

          </nav>                          <div className="space-y-3 mb-4">

                            <div className="flex items-center gap-2 text-sm text-gray-600">

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t">                              <MapPin className="w-4 h-4" />

            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">                              <span className="text-xs sm:text-sm">{delivery.destination}</span>

              <LogOut className="h-5 w-5" />                            </div>

              <span>تسجيل الخروج</span>                            

            </button>                            <div className="grid grid-cols-2 gap-3 text-sm">

          </div>                              <div>

        </motion.div>                                <span className="text-gray-600 text-xs">السائق:</span>

                                <p className="font-medium text-xs sm:text-sm">{delivery.driver}</p>

        {/* Main Content */}                              </div>

        <div className="flex-1 lg:mr-70">                              <div>

          {/* Header */}                                <span className="text-gray-600 text-xs">القيمة:</span>

          <header className="bg-white border-b px-6 py-4">                                <p className="font-medium text-xs sm:text-sm">{delivery.value}</p>

            <div className="flex items-center justify-between">                              </div>

              <div className="flex items-center gap-4">                              <div>

                <button                                <span className="text-gray-600 text-xs">المركبة:</span>

                  onClick={() => setSidebarOpen(true)}                                <p className="font-medium text-xs sm:text-sm">{delivery.vehicleType}</p>

                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"                              </div>

                >                              <div>

                  <Menu className="h-6 w-6" />                                <span className="text-gray-600 text-xs">المسافة:</span>

                </button>                                <p className="font-medium text-xs sm:text-sm">{delivery.distance}</p>

                                              </div>

                <div className="relative">                            </div>

                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />                            

                  <input                            <div className="pt-2">

                    type="text"                              <div className="flex items-center justify-between mb-1">

                    placeholder="البحث..."                                <span className="text-xs text-gray-600">التقدم</span>

                    className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"                                <span className="text-xs font-medium">{delivery.progress}%</span>

                  />                              </div>

                </div>                              <div className="w-full bg-gray-200 rounded-full h-2">

              </div>                                <div 

                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 

              <div className="flex items-center gap-4">                                  style={{ width: `${delivery.progress}%` }}

                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">                                ></div>

                  <Bell className="h-6 w-6" />                              </div>

                </button>                            </div>

                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">                          </div>

                  <Settings className="h-6 w-6" />

                </button>                          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-100 gap-2">

              </div>                            <span className="text-xs text-gray-500">الوقت المقدر: {delivery.estimatedTime}</span>

            </div>                            <div className="flex items-center gap-1 sm:gap-2">

          </header>                              <button 

                                onClick={() => handleViewOrder(delivery)}

          {/* Page Content */}                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"

          <main className="p-6">                                title="عرض التفاصيل"

            {renderContent()}                              >

          </main>                                <Eye className="w-4 h-4" />

        </div>                              </button>

      </div>                              <button 

      <NotificationToast />                                onClick={() => handleEditOrder(delivery)}

    </NotificationProvider>                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"

  );                                title="تعديل الطلب"

};                              >

                                <Edit className="w-4 h-4" />

export default ShippingDashboard;                              </button>
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