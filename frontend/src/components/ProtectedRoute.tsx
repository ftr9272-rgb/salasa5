import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
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

  // إعادة توجيه إلى صفحة تسجيل الدخول إذا لم يكن مصادق عليه
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // التحقق من الأدوار المسموحة
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // إعادة توجيه إلى الصفحة المناسبة حسب الدور
    const roleRedirects: Record<string, string> = {
      merchant: '/merchant',
      supplier: '/supplier',
      shipping_company: '/shipping',
      admin: '/admin'
    };
    
    const redirectPath = roleRedirects[user.role] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  // التحقق من التحقق من الهوية
  if (user && !user.isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-8 bg-card rounded-lg shadow-lg max-w-md">
          <div className="mb-6">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-card-foreground mb-4">
            التحقق من الحساب مطلوب
          </h2>
          <p className="text-muted-foreground mb-6">
            يرجى التحقق من بريدك الإلكتروني والنقر على رابط التفعيل لإكمال إعداد حسابك.
          </p>
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
            إعادة إرسال رابط التفعيل
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;