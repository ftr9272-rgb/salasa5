import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// أنواع البيانات
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'merchant' | 'supplier' | 'shipping_company' | 'admin';
  avatar?: string;
  phone?: string;
  companyName?: string;
  isVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshToken: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'merchant' | 'supplier' | 'shipping_company';
  companyName?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// مفاتيح التخزين المحلي
const TOKEN_KEY = 'business_platform_token';
const USER_KEY = 'business_platform_user';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // التحقق من صحة الرمز المميز عند بدء التطبيق
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // التحقق من صحة الرمز المميز
          await validateToken(storedToken);
        }
      } catch (error) {
        console.error('خطأ في تهيئة المصادقة:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // تسجيل الدخول
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // محاكاة استدعاء API
      const response = await mockLoginAPI(email, password);
      
      const { user: userData, token: userToken } = response;
      
      setUser(userData);
      setToken(userToken);
      
      localStorage.setItem(TOKEN_KEY, userToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // التسجيل
  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      // محاكاة استدعاء API
      const response = await mockRegisterAPI(userData);
      
      const { user: newUser, token: userToken } = response;
      
      setUser(newUser);
      setToken(userToken);
      
      localStorage.setItem(TOKEN_KEY, userToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل الخروج
  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Redirect to public landing page after logout
    try {
      navigate('/landing');
    } catch (err) {
      // ignore navigation errors
    }
  };

  // تحديث بيانات المستخدم
  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  };

  // تجديد الرمز المميز
  const refreshToken = async (): Promise<void> => {
    try {
      if (token) {
        // محاكاة تجديد الرمز المميز
        const newToken = await mockRefreshTokenAPI(token);
        setToken(newToken);
        localStorage.setItem(TOKEN_KEY, newToken);
      }
    } catch (error) {
      console.error('خطأ في تجديد الرمز المميز:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    updateUser,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook لاستخدام السياق
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth يجب استخدامه داخل AuthProvider');
  }
  return context;
}

// دوال محاكاة API (ستستبدل بالدوال الحقيقية لاحقاً)
async function mockLoginAPI(email: string, password: string) {
  // محاكاة تأخير الشبكة
  await new Promise(resolve => setTimeout(resolve, 1000));

  // التحقق من بيانات الاعتماد الوهمية
  const mockUsers: Record<string, { password: string; user: User }> = {
    'merchant@example.com': {
      password: 'password123',
      user: {
        id: '1',
        email: 'merchant@example.com',
        name: 'أحمد محمد',
        role: 'merchant',
        companyName: 'شركة التجارة المتقدمة',
        phone: '+966501234567',
        isVerified: true,
        createdAt: new Date().toISOString(),
      }
    },
    'merchant@demo.com': {
      password: 'password123',
      user: {
        id: 'demo_merchant',
        email: 'merchant@demo.com',
        name: 'تاجر تجريبي',
        role: 'merchant',
        companyName: 'متجر التجارة التجريبي',
        phone: '+966501111111',
        isVerified: true,
        createdAt: new Date().toISOString(),
      }
    },
    'supplier@example.com': {
      password: 'password123',
      user: {
        id: '2',
        email: 'supplier@example.com',
        name: 'سارة أحمد',
        role: 'supplier',
        companyName: 'مورد الجودة العالية',
        phone: '+966507654321',
        isVerified: true,
        createdAt: new Date().toISOString(),
      }
    },
    'supplier@demo.com': {
      password: 'password123',
      user: {
        id: 'demo_supplier',
        email: 'supplier@demo.com',
        name: 'مورد تجريبي',
        role: 'supplier',
        companyName: 'شركة الإمداد التجريبية',
        phone: '+966502222222',
        isVerified: true,
        createdAt: new Date().toISOString(),
      }
    },
    'shipping@example.com': {
      password: 'password123',
      user: {
        id: '3',
        email: 'shipping@example.com',
        name: 'خالد الشحن',
        role: 'shipping_company',
        companyName: 'شركة الشحن السريع 🚛',
        phone: '+966509876543',
        isVerified: true,
        createdAt: new Date().toISOString(),
      }
    },
    'shipping@demo.com': {
      password: 'password123',
      user: {
        id: 'demo_shipping',
        email: 'shipping@demo.com',
        name: 'شركة شحن تجريبية',
        role: 'shipping_company',
        companyName: 'الشحن السريع التجريبي 🚛',
        phone: '+966503333333',
        isVerified: true,
        createdAt: new Date().toISOString(),
      }
    },
    'admin@example.com': {
      password: 'password123',
      user: {
        id: '4',
        email: 'admin@example.com',
        name: 'مدير النظام',
        role: 'admin',
        isVerified: true,
        createdAt: new Date().toISOString(),
      }
    }
  };

  const mockUser = mockUsers[email];
  if (!mockUser || mockUser.password !== password) {
    throw new Error('بيانات الاعتماد غير صحيحة');
  }

  return {
    user: mockUser.user,
    token: `mock_token_${Date.now()}`
  };
}

async function mockRegisterAPI(userData: RegisterData) {
  // محاكاة تأخير الشبكة
  await new Promise(resolve => setTimeout(resolve, 1500));

  // التحقق من وجود البريد الإلكتروني
  if (userData.email === 'existing@example.com') {
    throw new Error('هذا البريد الإلكتروني مُستخدم بالفعل');
  }

  const newUser: User = {
    id: `user_${Date.now()}`,
    email: userData.email,
    name: userData.name,
    role: userData.role,
    companyName: userData.companyName,
    phone: userData.phone,
    isVerified: false,
    createdAt: new Date().toISOString(),
  };

  return {
    user: newUser,
    token: `mock_token_${Date.now()}`
  };
}

async function validateToken(token: string): Promise<boolean> {
  // محاكاة التحقق من الرمز المميز
  await new Promise(resolve => setTimeout(resolve, 500));
  return token.startsWith('mock_token_');
}

async function mockRefreshTokenAPI(oldToken: string): Promise<string> {
  // محاكاة تجديد الرمز المميز
  await new Promise(resolve => setTimeout(resolve, 500));
  return `refreshed_token_${Date.now()}`;
}