import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Package, BarChart3, ShoppingCart, Users, Settings,
  Bell, Search, Menu, X 
} from 'lucide-react';
import { useState } from 'react';

// Import supplier pages
import Dashboard from './supplier/Dashboard';
import ProductManagement from './supplier/ProductManagement';
import SupplierAnalytics from './supplier/SupplierAnalytics';
import SupplierOrdersManagement from './supplier/SupplierOrdersManagement';

const SupplierLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'لوحة القيادة', 
      icon: Home, 
      path: '/supplier/dashboard',
      color: 'emerald'
    },
    { 
      id: 'products', 
      label: 'إدارة المنتجات', 
      icon: Package, 
      path: '/supplier/products',
      color: 'blue'
    },
    { 
      id: 'orders', 
      label: 'إدارة الطلبات', 
      icon: ShoppingCart, 
      path: '/supplier/orders',
      color: 'purple'
    },
    { 
      id: 'analytics', 
      label: 'التحليلات والتقارير', 
      icon: BarChart3, 
      path: '/supplier/analytics',
      color: 'amber'
    },
    { 
      id: 'merchants', 
      label: 'التجار الشركاء', 
      icon: Users, 
      path: '/supplier/merchants',
      color: 'rose'
    },
    { 
      id: 'settings', 
      label: 'الإعدادات', 
      icon: Settings, 
      path: '/supplier/settings',
      color: 'gray'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">لوحة المورد</h1>
                <p className="text-sm text-gray-600">إدارة متقدمة</p>
              </div>
            </div>
            <button
              title="إغلاق القائمة"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group hover:shadow-md ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`w-5 h-5 ${
                  location.pathname === item.path ? 'text-white' : 'text-emerald-500'
                }`} />
                <span className="font-medium">{item.label}</span>
                {item.id === 'orders' && (
                  <span className="mr-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    8
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:mr-80">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                title="فتح القائمة"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="hidden md:flex items-center gap-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث السريع..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none w-64"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button title="الإشعارات" className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">م</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-800">محمد أحمد</p>
                  <p className="text-xs text-gray-600">مورد معتمد</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          <Routes>
            <Route path="/" element={<Navigate to="/supplier/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/orders" element={<SupplierOrdersManagement />} />
            <Route path="/analytics" element={<SupplierAnalytics />} />
            <Route path="/merchants" element={<Dashboard />} />
            <Route path="/settings" element={<Dashboard />} />
          </Routes>
        </motion.div>
      </div>
    </div>
  );
};

export default SupplierLayout;