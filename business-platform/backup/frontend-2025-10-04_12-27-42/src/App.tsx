import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// صفحات عامة
import LandingPage from './pages/LandingPage';
import UnifiedLoginPage from './pages/UnifiedLoginPage';
import UnifiedRegisterPage from './pages/UnifiedRegisterPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import UnifiedMarketplace from './pages/UnifiedMarketplace';

import RedesignedUnifiedMarketplace from './pages/RedesignedUnifiedMarketplace';
import SharedMarketplace from './pages/SharedMarketplace';
import CleanExhibitionMarketplace from './pages/CleanExhibitionMarketplace';
import MarketplaceComparison from './pages/MarketplaceComparison';

// لوحات التحكم
import MerchantDashboard from './pages/MerchantDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import ShippingDashboard from './pages/ShippingDashboard';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import UltraStableTest from './pages/UltraStableTest';
import SmartChatTest from './pages/SmartChatTest';
import NotificationTestPage from './pages/NotificationTestPage';
import FunctionTestPage from './pages/FunctionTestPage';

// مكونات التخطيط
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import SmartChatWindow from './components/SmartChatWindow';
import { seedData } from './utils/localStorage';

function App() {
  const { isLoading } = useAuth();
  const location = useLocation();

  // Seed initial data
  useEffect(() => {
    seedData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground w-full">
        <Header />
        {/* Global chat system: listens for 'open-chat' events dispatched from header */}
        <ChatController />
        
        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 w-full"
          >
            <Routes>
              {/* الصفحات العامة */}
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <LandingPage />
                  </PublicRoute>
                } 
              />

              {/* Direct landing route so authenticated users can still reach the public landing page */}
              <Route 
                path="/landing" 
                element={<LandingPage />} 
              />
              
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <UnifiedLoginPage />
                  </PublicRoute>
                } 
              />
              
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <UnifiedRegisterPage />
                  </PublicRoute>
                } 
              />
              
              <Route 
                path="/about" 
                element={
                  <PublicRoute>
                    <AboutPage />
                  </PublicRoute>
                } 
              />
              
              <Route 
                path="/services" 
                element={
                  <PublicRoute>
                    <ServicesPage />
                  </PublicRoute>
                } 
              />
              
              <Route 
                path="/contact" 
                element={
                  <PublicRoute>
                    <ContactPage />
                  </PublicRoute>
                } 
              />
              
              <Route
                path="/marketplace"
                element={<Navigate replace to="/enhanced-marketplace" />}
              />
              
              <Route 
                path="/redesigned-marketplace" 
                element={
                  <PublicRoute>
                    <RedesignedUnifiedMarketplace />
                  </PublicRoute>
                } 
              />
              
              <Route 
                path="/enhanced-marketplace" 
                element={
                  <PublicRoute>
                    <SharedMarketplace />
                  </PublicRoute>
                } 
              />
              
              <Route 
                path="/exhibitions" 
                element={
                  <PublicRoute>
                    <CleanExhibitionMarketplace />
                  </PublicRoute>
                } 
              />
              
              <Route 
                path="/marketplace-comparison" 
                element={
                  <PublicRoute>
                    <MarketplaceComparison />
                  </PublicRoute>
                } 
              />
              
              <Route 
                path="/ultra-stable-test" 
                element={
                  <PublicRoute>
                    <UltraStableTest />
                  </PublicRoute>
                } 
              />
              
              <Route 
                path="/smart-chat-test" 
                element={
                  <PublicRoute>
                    <SmartChatTest />
                  </PublicRoute>
                } 
              />
              
              <Route 
                path="/notification-test" 
                element={
                  <PublicRoute>
                    <NotificationTestPage />
                  </PublicRoute>
                } 
              />
              
              <Route 
                path="/function-test" 
                element={
                  <PublicRoute>
                    <FunctionTestPage />
                  </PublicRoute>
                } 
              />

              {/* لوحات التحكم المحمية */}
              <Route 
                path="/merchant/*" 
                element={
                  <ProtectedRoute allowedRoles={['merchant']}>
                    <MerchantDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* مسار مباشر للوحة تحكم التاجر */}
              <Route 
                path="/merchant-dashboard" 
                element={
                    <MerchantDashboard />
                } 
              />

              <Route 
                path="/supplier/*" 
                element={
                  <ProtectedRoute allowedRoles={['supplier']}>
                    <SupplierDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* مسار مباشر للوحة تحكم المورد */}
              <Route 
                path="/supplier-dashboard" 
                element={
                    <SupplierDashboard />
                } 
              />

              {/* مسارات لوحة تحكم الشحن */}
              <Route 
                path="/shipping" 
                element={
                  <ProtectedRoute allowedRoles={['shipping_company']}>
                    <ShippingDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/shipping_company" 
                element={
                  <ProtectedRoute allowedRoles={['shipping_company']}>
                    <ShippingDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* صفحات محمية عامة */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/products" 
                element={
                  <ProtectedRoute>
                    <ProductsPage />
                  </ProtectedRoute>
                } 
              />

              {/* صفحة 404 */}
              <Route 
                path="*" 
                element={
                  <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                      <p className="text-xl text-muted-foreground mb-8">
                        عذراً، الصفحة غير موجودة
                      </p>
                      <a 
                        href="/" 
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        العودة للصفحة الرئيسية
                      </a>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </motion.main>
        </AnimatePresence>
      </div>
  );
}

export default App;

function ChatController() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContact, setChatContact] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const onOpen = () => setIsChatOpen(true);
    const onClose = () => setIsChatOpen(false);
    
    // New event listener for opening chat with specific contact
    const onOpenWithContact = (event: CustomEvent) => {
      const contact = event.detail.contact;
      // debug: log incoming contact payload to help trace unexpected names
      // eslint-disable-next-line no-console
      console.debug('[open-chat-with-contact] payload:', contact);
      setChatContact(contact);
      setIsChatOpen(true);
    };
    
    window.addEventListener('open-chat', onOpen as EventListener);
    window.addEventListener('close-chat', onClose as EventListener);
    window.addEventListener('open-chat-with-contact', onOpenWithContact as EventListener);
    
    return () => {
      window.removeEventListener('open-chat', onOpen as EventListener);
      window.removeEventListener('close-chat', onClose as EventListener);
      window.removeEventListener('open-chat-with-contact', onOpenWithContact as EventListener);
    };
  }, []);

  const mapUserRoleToType = (role?: string) => {
    if (!role) return 'customer';
    if (role === 'merchant') return 'merchant';
    if (role === 'supplier') return 'supplier';
    if (role === 'shipping_company') return 'shipping';
    return 'customer';
  };

  if (!isChatOpen) return null;

  return (
    <SmartChatWindow
      onClose={() => {
        setIsChatOpen(false);
        setChatContact(null);
      }}
      userType={chatContact ? mapUserRoleToType(chatContact.type) : mapUserRoleToType(user?.role)}
      userName={user?.name}
      userRole={user?.role}
      initialContact={chatContact}
    />
  );
}