import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

function PublicRoute({ children, redirectTo }: PublicRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // إظهار مؤشر التحميل أثناء التحقق من حالة المصادقة
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Allow access to marketplace for both authenticated and unauthenticated users
  const isMarketplace = location.pathname === '/enhanced-marketplace' || location.pathname === '/marketplace';
  
  // إعادة توجيه المستخدمين المصادق عليهم إلى لوحة التحكم المناسبة
  if (isAuthenticated && user && !isMarketplace) {
    // تحديد وجهة إعادة التوجيه إذا لم تكن محددة
    if (!redirectTo) {
      const roleRedirects: Record<string, string> = {
        merchant: '/merchant',
        supplier: '/supplier',
        shipping_company: '/shipping',
        admin: '/admin'
      };
      
      redirectTo = roleRedirects[user.role] || '/';
    }
    
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;