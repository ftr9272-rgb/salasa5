import { motion, AnimatePresence } from 'framer-motion';
import { Package, TrendingUp, Users, Truck, Clock, Plus, Filter, Star, MapPin, Route, Send, Home, FileText, BarChart3, ShoppingCart, Settings, Bell, Handshake, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import MarketPredictions from '../components/MarketPredictions';
import MarketOpportunities from '../components/MarketOpportunities';
import { useAuth } from '../contexts/AuthContext';
import { NotificationProvider } from '../components/NotificationProvider';
import AddOrderModal from '../components/AddOrderModal';
import OrderDetailsModal from '../components/OrderDetailsModal';
import AddDriverModal from '../components/AddDriverModal';
import AddVehicleModal from '../components/AddVehicleModal';
import AddShippingServiceModal from '../components/AddShippingServiceModal';

function ShippingDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('الشهر');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [showAddShipmentModal, setShowAddShipmentModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userToggled, setUserToggled] = useState(false);
  const [partners, setPartners] = useState<any[]>([
    {
      id: '1',
      name: 'شركة النقل السريع',
      type: 'shipping',
      status: 'active',
      since: '2024-01-15',
      orders: 245,
      rating: 4.8,
      revenue: 125000,
      avatar: '🚛'
    },
    {
      id: '2',
      name: 'مجموعة التجارة الذكية',
      type: 'merchant',
      status: 'active',
      since: '2024-03-20',
      orders: 189,
      rating: 4.6,
      revenue: 98000,
      avatar: '🏪'
    },
    {
      id: '3',
      name: 'مورد المواد الغذائية',
      type: 'supplier',
      status: 'pending',
      since: '2024-09-01',
      orders: 45,
      rating: 4.5,
      revenue: 32000,
      avatar: '📦'
    }
  ]);
  const auth = useAuth();

  // Detect large screens to disable entrance animation for sidebar on desktop
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  useEffect(() => {
    const check = () => {
      const large = window.innerWidth >= 768;
      // compute target open state
      const targetOpen = large;
      // debug log to help trace behavior when using DevTools mobile emulation
      // eslint-disable-next-line no-console
      console.debug('[ShippingDashboard] resize check', { innerWidth: window.innerWidth, large, targetOpen, userToggled });
      setIsLargeScreen(large);
      // If the user manually toggled the sidebar, respect their choice and don't auto-open on resize
      if (large) {
        if (!userToggled) setSidebarOpen(true);
      } else {
        // always close on small screens
        setSidebarOpen(false);
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [userToggled]);

  const menuItems = [
    { id: 'overview', label: 'نظرة عامة', icon: '', gradient: 'from-blue-500 to-cyan-600' },
    { id: 'orders', label: 'الطلبات', icon: '', gradient: 'from-cyan-500 to-blue-600' },
    { id: 'drivers', label: 'السائقين', icon: '', gradient: 'from-indigo-500 to-blue-600' },
    { id: 'fleet', label: 'الأسطول', icon: '', gradient: 'from-sky-500 to-cyan-600' },
    { id: 'partners', label: 'الشركاء', icon: '', gradient: 'from-purple-500 to-pink-600' },
    { id: 'market', label: 'السوق', icon: '', gradient: 'from-blue-600 to-indigo-600' }
  ];

  const quickActions = [
    { icon: <Send className="w-5 h-5" />, label: 'خدمة شحن', action: () => setShowAddServiceModal(true), color: 'blue' },
    { icon: <Users className="w-5 h-5" />, label: 'سائق جديد', action: () => setShowAddDriverModal(true), color: 'cyan' },
    { icon: <Truck className="w-5 h-5" />, label: 'مركبة جديدة', action: () => setShowAddVehicleModal(true), color: 'indigo' },
    { icon: <Package className="w-5 h-5" />, label: 'شحنة جديدة', action: () => setShowAddShipmentModal(true), color: 'sky' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex h-screen overflow-hidden">
        {/* Mobile menu button */}
        <button
          onClick={() => {
            setUserToggled(true);
            setSidebarOpen(s => !s);
          }}
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
            onClick={() => {
              setUserToggled(true);
              setSidebarOpen(false);
            }}
          />
        )}

        {/* Sidebar */}
        <motion.div 
          initial={isLargeScreen || sidebarOpen ? { x: 0, opacity: 1 } : { x: '-100%', opacity: 0 }}
          animate={isLargeScreen || sidebarOpen ? { x: 0, opacity: 1 } : { x: '-100%', opacity: 0 }}
          transition={isLargeScreen ? { duration: 0 } : { duration: 0.25 }}
          className={`
            fixed md:sticky 
            top-0 left-0 h-full md:h-screen
            w-64 bg-white shadow-xl flex flex-col 
            z-40
          `}
          role="navigation"
          aria-label="قائمة الشريط الجانبي"
        >
          {/* Sidebar Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 opacity-10"></div>
            <div className="relative p-6 border-b border-blue-100">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                    لوحة الشحن
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mr-13">نظام إدارة التوصيل الذكي</p>
              </motion.div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105`
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 text-sm"
              aria-label="اختيار الفترة الزمنية"
            >
              <option value="اليوم">اليوم</option>
              <option value="الأسبوع">الأسبوع</option>
              <option value="الشهر">الشهر</option>
              <option value="السنة">السنة</option>
            </select>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.action}
                  className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-${action.color}-50 hover:bg-${action.color}-100 text-${action.color}-600 transition-colors`}
                  title={action.label}
                >
                  {action.icon}
                  <span className="text-xs font-medium">{action.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-8 pt-16 md:pt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && <OverviewContent />}
                {activeTab === 'orders' && <OrdersContent />}
                {activeTab === 'drivers' && <DriversContent />}
                {activeTab === 'fleet' && <FleetContent />}
                {activeTab === 'partners' && <PartnersContent onAddPartner={() => setShowAddPartnerModal(true)} partners={partners} setPartners={setPartners} />}
                {activeTab === 'market' && <MarketContent />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddOrderModal
        isOpen={showAddShipmentModal} 
        onClose={() => setShowAddShipmentModal(false)}
        onAdd={(order) => {
          toast.success('تم إضافة الشحنة بنجاح');
          setShowAddShipmentModal(false);
        }}
      />
      <OrderDetailsModal
        isOpen={showOrderDetailsModal}
        onClose={() => setShowOrderDetailsModal(false)}
        order={selectedOrder}
        onUpdate={(order) => {
          toast.success('تم تحديث الطلب بنجاح');
          setShowOrderDetailsModal(false);
        }}
      />
      <AddDriverModal 
        isOpen={showAddDriverModal} 
        onClose={() => setShowAddDriverModal(false)}
        onAdd={(driver) => {
          toast.success('تم إضافة السائق بنجاح');
          setShowAddDriverModal(false);
        }}
      />
      <AddVehicleModal
        isOpen={showAddVehicleModal} 
        onClose={() => setShowAddVehicleModal(false)}
        onAdd={(vehicle) => {
          toast.success('تم إضافة المركبة بنجاح');
          setShowAddVehicleModal(false);
        }}
      />
      <AddShippingServiceModal
        isOpen={showAddServiceModal} 
        onClose={() => setShowAddServiceModal(false)}
        onAdd={(service) => {
          toast.success('تم إضافة الخدمة بنجاح');
          setShowAddServiceModal(false);
        }}
        user={auth.user ? {
          id: auth.user.id,
          name: auth.user.companyName || auth.user.name,
          type: auth.user.role as 'merchant' | 'supplier' | 'shipping_company',
          rating: 4.8,
          verified: auth.user.isVerified
        } : undefined}
      />
      <AddPartnerModal
        isOpen={showAddPartnerModal}
        onClose={() => setShowAddPartnerModal(false)}
        onAdd={(partner) => {
          setPartners([...partners, partner]);
          toast.success('تم إضافة الشريك بنجاح');
          setShowAddPartnerModal(false);
        }}
      />
    </div>
  );
}

// Overview Component
function OverviewContent() {
  const stats = [
    { title: 'الطلبات النشطة', value: '156', change: '+12.3%', icon: <Truck className="w-6 h-6" />, gradient: 'from-blue-500 to-blue-600', trend: 'up' },
    { title: 'وقت التسليم', value: '45 دقيقة', change: '-8.5%', icon: <Clock className="w-6 h-6" />, gradient: 'from-cyan-500 to-cyan-600', trend: 'down' },
    { title: 'المسافة اليوم', value: '2,450 كم', change: '+15.2%', icon: <Route className="w-6 h-6" />, gradient: 'from-indigo-500 to-indigo-600', trend: 'up' },
    { title: 'تقييم العملاء', value: '4.8/5', change: '+0.2%', icon: <Star className="w-6 h-6" />, gradient: 'from-sky-500 to-sky-600', trend: 'up' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-gradient-to-br ${stat.gradient} text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-200' : 'text-red-200'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm opacity-90">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Active Deliveries */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">الشحنات النشطة</h3>
        <p className="text-gray-600">محتوى الشحنات النشطة هنا...</p>
      </div>
    </div>
  );
}

// Other tab components (simplified for now)
function OrdersContent() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">إدارة الطلبات</h2>
      <p className="text-gray-600">محتوى الطلبات هنا...</p>
    </div>
  );
}

function DriversContent() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">إدارة السائقين</h2>
      <p className="text-gray-600">محتوى السائقين هنا...</p>
    </div>
  );
}

function FleetContent() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">إدارة الأسطول</h2>
      <p className="text-gray-600">محتوى الأسطول هنا...</p>
    </div>
  );
}

interface PartnersContentProps {
  onAddPartner: () => void;
  partners: any[];
  setPartners: React.Dispatch<React.SetStateAction<any[]>>;
}

function PartnersContent({ onAddPartner, partners, setPartners }: PartnersContentProps) {

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return 'نشط';
      case 'pending': return 'قيد المراجعة';
      case 'inactive': return 'غير نشط';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'shipping': return 'شركة شحن';
      case 'merchant': return 'تاجر';
      case 'supplier': return 'مورد';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Handshake className="w-8 h-8 text-purple-600" />
            إدارة الشركاء
          </h2>
          <p className="text-gray-600 mt-1">شبكة شركائك من التجار والموردين وشركات الشحن</p>
        </div>
        <button 
          onClick={onAddPartner}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          إضافة شريك جديد
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-700 font-medium">شركاء نشطون</span>
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-900">{partners.filter(p => p.status === 'active').length}</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-700 font-medium">قيد المراجعة</span>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-yellow-900">{partners.filter(p => p.status === 'pending').length}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-700 font-medium">إجمالي الطلبات</span>
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-900">{partners.reduce((sum, p) => sum + p.orders, 0)}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-700 font-medium">الإيرادات</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-900">{(partners.reduce((sum, p) => sum + p.revenue, 0) / 1000).toFixed(0)}K</div>
        </div>
      </div>

      {/* Partners List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الشريك</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">النوع</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">تاريخ الشراكة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الطلبات</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">التقييم</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الإيرادات</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {partners.map((partner) => (
                <motion.tr
                  key={partner.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-2xl">
                        {partner.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{partner.name}</div>
                        <div className="text-sm text-gray-500">ID: {partner.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">{getTypeLabel(partner.type)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(partner.status)}`}>
                      {getStatusLabel(partner.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{partner.since}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{partner.orders}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">{partner.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-green-600">{partner.revenue.toLocaleString()} ر.س</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="عرض التفاصيل">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors" title="إرسال رسالة">
                        <Send className="w-4 h-4 text-purple-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="الإعدادات">
                        <Settings className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MarketContent() {
  const auth = useAuth();
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">الفرص السوقية</h2>
      <MarketOpportunities 
        userType="shipping"
        user={auth.user && auth.user.role !== 'admin' ? {
          id: auth.user.id,
          name: auth.user.companyName || auth.user.name,
          type: auth.user.role as 'merchant' | 'supplier' | 'shipping_company',
          rating: 4.8,
          verified: auth.user.isVerified
        } : undefined}
      />
    </div>
  );
}

// Add Partner Modal Component
interface AddPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (partner: any) => void;
}

function AddPartnerModal({ isOpen, onClose, onAdd }: AddPartnerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'merchant',
    email: '',
    phone: '',
    companyName: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPartner = {
      id: Date.now().toString(),
      name: formData.companyName || formData.name,
      type: formData.type,
      status: 'pending',
      since: new Date().toISOString().split('T')[0],
      orders: 0,
      rating: 0,
      revenue: 0,
      avatar: formData.type === 'merchant' ? '🏪' : formData.type === 'supplier' ? '📦' : '🚛',
      email: formData.email,
      phone: formData.phone,
      description: formData.description
    };

    onAdd(newPartner);
    
    // Reset form
    setFormData({
      name: '',
      type: 'merchant',
      email: '',
      phone: '',
      companyName: '',
      description: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Handshake className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">إضافة شريك جديد</h2>
                <p className="text-purple-100 text-sm">أضف شريك جديد إلى شبكة أعمالك</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Partner Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              نوع الشريك *
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'merchant' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.type === 'merchant'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-3xl mb-2">🏪</div>
                <div className="font-semibold">تاجر</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'supplier' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.type === 'supplier'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-3xl mb-2">📦</div>
                <div className="font-semibold">مورد</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'shipping' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.type === 'shipping'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-3xl mb-2">🚛</div>
                <div className="font-semibold">شحن</div>
              </button>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              اسم الشركة *
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="مثال: شركة النقل السريع"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              اسم الشخص المسؤول *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="مثال: أحمد محمد"
            />
          </div>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="example@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                رقم الهاتف *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="05xxxxxxxx"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              وصف الشراكة (اختياري)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
              placeholder="أضف تفاصيل عن الشراكة والخدمات المتوقعة..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              إضافة الشريك
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              إلغاء
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default ShippingDashboard;