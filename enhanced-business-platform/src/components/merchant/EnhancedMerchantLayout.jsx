import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  Star, 
  DollarSign, 
  Truck, 
  FileText, 
  Settings, 
  User, 
  Bell,
  Menu,
  X,
  LogOut,
  Store,
  TrendingUp,
  BarChart3,
  Calendar,
  MessageSquare,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const EnhancedMerchantLayout = ({ children, activeTab, setActiveTab, onLogout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', name: 'لوحة التحكم', icon: Home, color: 'from-blue-500 to-indigo-600' },
    { id: 'partners', name: 'الشركاء', icon: Users, color: 'from-green-500 to-emerald-600', badge: '12' },
    { id: 'quotation-requests', name: 'طلبات عروض الأسعار', icon: FileText, color: 'from-orange-500 to-red-600', badge: '5' },
    { id: 'received-quotations', name: 'عروض الأسعار المستلمة', icon: DollarSign, color: 'from-purple-500 to-pink-600' },
    { id: 'purchase-orders', name: 'طلبات الشراء', icon: ShoppingCart, color: 'from-cyan-500 to-blue-600', badge: '3' },
    { id: 'payments', name: 'المدفوعات', icon: DollarSign, color: 'from-yellow-500 to-orange-600' },
    { id: 'analytics', name: 'التحليلات', icon: BarChart3, color: 'from-teal-500 to-green-600' },
    { id: 'reports', name: 'التقارير', icon: TrendingUp, color: 'from-indigo-500 to-purple-600' },
    { id: 'calendar', name: 'التقويم', icon: Calendar, color: 'from-rose-500 to-pink-600' },
    { id: 'messages', name: 'الرسائل', icon: MessageSquare, color: 'from-violet-500 to-purple-600', badge: '8' },
    { id: 'profile', name: 'الملف الشخصي', icon: User, color: 'from-gray-500 to-slate-600' },
    { id: 'settings', name: 'الإعدادات', icon: Settings, color: 'from-stone-500 to-gray-600' },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
  };

  const sidebarVariants = {
    expanded: { width: '280px' },
    collapsed: { width: '80px' }
  };

  const contentVariants = {
    expanded: { marginRight: '280px' },
    collapsed: { marginRight: '80px' }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced Sidebar */}
      <motion.aside 
        className="fixed inset-y-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-2xl border-l border-white/20 dark:bg-slate-900/80 dark:border-slate-700/50"
        variants={sidebarVariants}
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Store className="h-7 w-7 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                      لوحة التاجر الذكية
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">مرحباً بك، أحمد</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Enhanced Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-auto">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-right transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-blue-500/25`
                        : 'text-slate-700 hover:bg-white/60 hover:shadow-md dark:text-slate-300 dark:hover:bg-slate-800/60'
                    }`}
                    whileHover={{ scale: 1.02, x: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Background animation */}
                    {!isActive && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 rounded-2xl`}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    <div className="relative flex items-center gap-4 w-full">
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-white'} transition-colors`}>
                        <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
                      </div>
                      
                      <AnimatePresence mode="wait">
                        {!sidebarCollapsed && (
                          <motion.div
                            className="flex items-center justify-between w-full"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span className="font-medium text-sm">{item.name}</span>
                            {item.badge && (
                              <Badge 
                                variant={isActive ? "secondary" : "default"}
                                className={`text-xs ${isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'} animate-pulse`}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                </motion.div>
              );
            })}
          </nav>

          {/* Enhanced Logout Button */}
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <motion.button
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group"
              whileHover={{ scale: 1.02, x: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 transition-colors">
                <LogOut className="h-5 w-5" />
              </div>
              <AnimatePresence mode="wait">
                {!sidebarCollapsed && (
                  <motion.span 
                    className="font-medium text-sm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    تسجيل الخروج
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Enhanced Main Content */}
      <motion.div 
        className="flex-1 flex flex-col"
        variants={contentVariants}
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Enhanced Top Bar */}
        <header className="bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/20 px-6 py-4 dark:bg-slate-900/70 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <motion.h1 
                className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-purple-400"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {navItems.find(item => item.id === activeTab)?.name || 'لوحة التحكم'}
              </motion.h1>
              
              <motion.div
                className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700 dark:text-green-400">متصل</span>
              </motion.div>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setActiveTab('marketplace')}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  <Zap className="h-5 w-5" />
                  <span className="font-medium">السوق الذكي</span>
                </Button>
              </motion.div>
              
              <motion.button
                className="relative p-3 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="h-6 w-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600" />
                <motion.span 
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-bold"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  3
                </motion.span>
              </motion.button>
              
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Enhanced Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
};

export default EnhancedMerchantLayout;
