import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, Bell, Store, Truck, Box, Shield, Home } from 'lucide-react';
import ChatButton from './ChatButton';

import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  // Function to get role display name
  const getRoleDisplayName = () => {
    if (!user) return '';
    switch (user.role) {
      case 'merchant':
        return 'تاجر';
      case 'supplier':
        return 'مورد';
      case 'shipping_company':
        return 'شركة شحن';
      case 'admin':
        return 'مدير النظام';
      default:
        return '';
    }
  };

  // notification badge count
  const [headerNotifCount, setHeaderNotifCount] = useState<number>(0);
  useEffect(() => {
    const onUpdate = (e: Event) => {
      try {
        // @ts-ignore
        const detail = (e as CustomEvent).detail || {};
        const count = typeof detail.unreadCount === 'number' ? detail.unreadCount : 0;
        setHeaderNotifCount(count);
      } catch (err) { /* ignore */ }
    };
    window.addEventListener('notifications-updated', onUpdate as EventListener);
    return () => window.removeEventListener('notifications-updated', onUpdate as EventListener);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-2 sm:px-4">
  <div className="flex items-center justify-between h-12 sm:h-14 relative">
          {/* الشعار */}
          <div className="flex items-center gap-3 pr-6 sm:pr-6">
            {/* Slogan: show only on the landing page */}
            {/* no slogan here; shown on landing hero image only */}
            <Link to="/landing" className="flex items-center space-x-2 space-x-reverse">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                <path 
                  fill="currentColor" 
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                />
              </svg>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-foreground font-heading">تجارتنا</span>
            </div>
            </Link>
            <Link to="/landing" title="العودة إلى الصفحة الرئيسية" aria-label="العودة إلى الصفحة الرئيسية" className="p-1 rounded hover:bg-gray-100 ml-2">
              <Home className="w-5 h-5 text-gray-700" />
            </Link>
          </div>

          {/* قائمة التنقل للشاشات الكبيرة */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse pl-6 sm:pl-6">
            {!isAuthenticated ? (
              <>
                <Link to="/" className="text-foreground hover:text-primary transition-colors font-arabic">الرئيسية</Link>
                <Link to="/enhanced-marketplace" className="flex items-center gap-2 hover:text-primary transition-colors font-arabic bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent font-bold">
                  <Store className="w-4 h-4" />
                  <span className="font-medium">السوق المشترك</span>
                </Link>
                <Link to="/exhibitions" className="hover:text-primary transition-colors font-arabic bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent font-medium">المعارض</Link>
                <Link to="/contact" className="text-foreground hover:text-primary transition-colors font-arabic">اتصل بنا</Link>
              </>
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/enhanced-marketplace" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-600/10 hover:from-blue-500/20 hover:to-purple-600/20 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 font-arabic text-foreground hover:text-blue-600 shadow-sm hover:shadow-sm">
                    <Store className="w-4 h-4" />
                    <span className="font-medium text-sm">السوق المشترك</span>
                  </Link>
                </motion.div>

                {/* أيقونة الإشعارات بجوار السوق */}
                <div className="relative flex items-center gap-2">
                  <button onClick={() => window.dispatchEvent(new Event('open-notifications'))} aria-label="فتح الإشعارات" className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                    <Bell className="w-5 h-5 text-gray-700" />
                    <span id="header-notif-badge" className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{headerNotifCount > 99 ? '99+' : headerNotifCount}</span>
                  </button>

                  {/* Chat button (inline in header, uses shared ChatButton styling) */}
                  <ChatButton
                    variant="inline"
                    ariaLabel="فتح المحادثات"
                    className="p-0"
                    onClick={() => window.dispatchEvent(new Event('open-chat'))}
                    hasNotifications={false}
                    notificationCount={0}
                  />
                </div>
                
                {/* رابط لوحة التحكم للشركات الناقلة */}
                {user?.role === 'shipping_company' && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/shipping" className="flex items-center space-x-2 space-x-reverse px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-blue-500/5 hover:from-blue-500/20 hover:to-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 font-arabic text-foreground hover:text-blue-600 shadow-sm hover:shadow-sm">
                      <Truck className="w-4 h-4" />
                      <span className="font-medium text-sm">لوحة التحكم</span>
                    </Link>
                  </motion.div>
                )}
                
                {/* رابط لوحة التحكم للتُجّار */}
                {user?.role === 'merchant' && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/merchant" className="flex items-center space-x-2 space-x-reverse px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/10 to-green-500/5 hover:from-green-500/20 hover:to-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 font-arabic text-foreground hover:text-green-600 shadow-sm hover:shadow-sm">
                      <Store className="w-4 h-4" />
                      <span className="font-medium text-sm">لوحة التحكم</span>
                    </Link>
                  </motion.div>
                )}
                
                {/* رابط لوحة التحكم للموردين */}
                {user?.role === 'supplier' && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/supplier" className="flex items-center space-x-2 space-x-reverse px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-purple-500/5 hover:from-purple-500/20 hover:to-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 font-arabic text-foreground hover:text-purple-600 shadow-sm hover:shadow-sm">
                      <Box className="w-4 h-4" />
                      <span className="font-medium text-sm">لوحة التحكم</span>
                    </Link>
                  </motion.div>
                )}
                
                {/* رابط لوحة التحكم الإدارية */}
                {user?.role === 'admin' && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/admin" className="flex items-center space-x-2 space-x-reverse px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500/10 to-red-500/5 hover:from-red-500/20 hover:to-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 font-arabic text-foreground hover:text-red-600 shadow-sm hover:shadow-sm">
                      <Shield className="w-4 h-4" />
                      <span className="font-medium text-sm">لوحة التحكم</span>
                    </Link>
                  </motion.div>
                )}
              </div>
            )}
          </nav>

          {/* أدوات الهيدر */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {isAuthenticated ? (
              <div className="relative flex items-center gap-2">
                <div className="relative">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleProfile} className="flex items-center space-x-2 space-x-reverse p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                    <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center"><User className="w-3.5 h-3.5 text-white" /></div>
                    <span className="hidden sm:block text-xs font-arabic text-foreground">{user?.name}</span>
                  </motion.button>

                  {isProfileOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-arabic text-foreground font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        {user?.role && <p className="text-xs text-muted-foreground mt-1">{getRoleDisplayName()}</p>}
                      </div>

                      <Link to="/profile" className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors font-arabic" onClick={() => setIsProfileOpen(false)}>
                        <User className="w-4 h-4" />
                        <span>الملف الشخصي</span>
                      </Link>

                      <button onClick={handleLogout} className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-sm text-red-600 hover:bg-secondary transition-colors w-full font-arabic">
                        <LogOut className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link to="/contact" className="text-foreground hover:text-primary transition-colors font-arabic">تسجيل الدخول</Link>
                <Link to="/contact" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-arabic">إنشاء حساب</Link>
              </>
            )}

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleMenu} className="md:hidden p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors" aria-label="قائمة التنقل">
              {isMenuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
            </motion.button>
          </div>
        </div>

        {/* قائمة التنقل للموبايل */}
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/" className="text-foreground hover:text-primary transition-colors font-arabic py-1.5" onClick={toggleMenu}>الرئيسية</Link>
                  <Link to="/enhanced-marketplace" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-arabic py-1.5" onClick={toggleMenu}>
                    <Store className="w-4 h-4 text-primary" />
                    <span className="font-medium">السوق المشترك</span>
                  </Link>
                  <Link to="/about" className="text-foreground hover:text-primary transition-colors font-arabic py-1.5" onClick={toggleMenu}>حول المنصة</Link>
                  <Link to="/services" className="text-foreground hover:text-primary transition-colors font-arabic py-1.5" onClick={toggleMenu}>الخدمات</Link>
                  <Link to="/contact" className="text-foreground hover:text-primary transition-colors font-arabic py-1.5" onClick={toggleMenu}>اتصل بنا</Link>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/enhanced-marketplace" className="flex items-center space-x-3 space-x-reverse px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20 hover:border-primary/40 transition-all duration-300 font-arabic text-foreground hover:text-primary shadow-sm hover:shadow-sm mx-2" onClick={toggleMenu}>
                    <div>
                      <span className="font-medium">السوق</span>
                      <p className="text-xs text-muted-foreground">تسوق من أفضل المتاجر</p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/20"><Store className="w-4 h-4 text-primary" /></div>
                  </Link>
                </motion.div>
              )}
              
              {/* روابط لوحة التحكم حسب نوع المستخدم في النسخة المحمولة */}
              {user?.role === 'merchant' && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/merchant" className="flex items-center space-x-3 space-x-reverse px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500/10 to-green-500/5 hover:from-green-500/20 hover:to-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 font-arabic text-foreground hover:text-green-600 shadow-sm hover:shadow-sm mx-2" onClick={toggleMenu}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20"><Store className="w-4 h-4 text-green-600" /></div>
                    <div>
                      <span className="font-medium">لوحة التحكم</span>
                      <p className="text-xs text-muted-foreground">إدارة متجرك</p>
                    </div>
                  </Link>
                </motion.div>
              )}
              
              {user?.role === 'supplier' && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/supplier" className="flex items-center space-x-3 space-x-reverse px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-500/5 hover:from-purple-500/20 hover:to-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 font-arabic text-foreground hover:text-purple-600 shadow-sm hover:shadow-sm mx-2" onClick={toggleMenu}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20"><Box className="w-4 h-4 text-purple-600" /></div>
                    <div>
                      <span className="font-medium">لوحة التحكم</span>
                      <p className="text-xs text-muted-foreground">إدارة المنتجات</p>
                    </div>
                  </Link>
                </motion.div>
              )}
              
              {user?.role === 'shipping_company' && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/shipping" className="flex items-center space-x-3 space-x-reverse px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-500/5 hover:from-blue-500/20 hover:to-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 font-arabic text-foreground hover:text-blue-600 shadow-sm hover:shadow-sm mx-2" onClick={toggleMenu}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20"><Truck className="w-4 h-4 text-blue-600" /></div>
                    <div>
                      <span className="font-medium">لوحة التحكم</span>
                      <p className="text-xs text-muted-foreground">إدارة عمليات الشحن</p>
                    </div>
                  </Link>
                </motion.div>
              )}
              
              {user?.role === 'admin' && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/admin" className="flex items-center space-x-3 space-x-reverse px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500/10 to-red-500/5 hover:from-red-500/20 hover:to-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 font-arabic text-foreground hover:text-red-600 shadow-sm hover:shadow-sm mx-2" onClick={toggleMenu}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20"><Shield className="w-4 h-4 text-red-600" /></div>
                    <div>
                      <span className="font-medium">لوحة التحكم</span>
                      <p className="text-xs text-muted-foreground">إدارة المنصة</p>
                    </div>
                  </Link>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </div>

      {/* خلفية للإغلاق عند النقر خارج القوائم */}
      {(isMenuOpen || isProfileOpen) && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => { setIsMenuOpen(false); setIsProfileOpen(false); }} />
      )}
    </header>
  );
}

export default Header;