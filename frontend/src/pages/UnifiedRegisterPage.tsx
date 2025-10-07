import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Shield, Check } from 'lucide-react';

const UnifiedRegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('merchant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setShowRoleSelection(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('كلمات المرور غير متطابقة');
    }
    
    if (password.length < 6) {
      return setError('كلمة المرور يجب أن تكون على الأقل 6 أحرف');
    }
    
    setLoading(true);
    setError('');

    try {
      await register({
        name,
        email,
        password,
        role: role as 'merchant' | 'supplier' | 'shipping_company'
      });
      // Navigate to the appropriate dashboard based on role
      navigate(`/${role}`);
    } catch (err) {
      setError('فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const roleData = {
    merchant: {
      title: 'تاجر',
      description: 'أنشئ حسابك كتاجر لبدء بيع منتجاتك',
      icon: '🛒',
      color: 'from-purple-500 to-blue-600',
      features: ['إدارة المنتجات', 'تتبع الطلبات', 'التواصل مع الموردين']
    },
    supplier: {
      title: 'مورد',
      description: 'أنشئ حسابك كمورد لتقديم منتجاتك',
      icon: '📦',
      color: 'from-emerald-500 to-teal-600',
      features: ['عرض المنتجات', 'إدارة المخزون', 'تتبع المبيعات']
    },
    shipping_company: {
      title: 'شركة شحن',
      description: 'أنشئ حسابك كشركة شحن لإدارة التوصيلات',
      icon: '🚚',
      color: 'from-amber-500 to-orange-600',
      features: ['تتبع الشحنات', 'إدارة التوصيلات', 'تقارير الأداء']
    }
  };

  const passwordRequirements = [
    { text: 'على الأقل 6 أحرف', test: (pwd: string) => pwd.length >= 6 },
    { text: 'يحتوي على حرف كبير', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { text: 'يحتوي على رقم', test: (pwd: string) => /\d/.test(pwd) },
    { text: 'يحتوي على رمز خاص', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ];

  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">مرحباً بك في منصة تجارتنا</h1>
            <p className="text-gray-600 text-lg">يرجى اختيار نوع الحساب الذي ترغب في إنشائه</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {Object.entries(roleData).map(([roleKey, roleInfo]) => (
              <motion.div
                key={roleKey}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelect(roleKey)}
                className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer border-2 border-gray-100 hover:border-blue-300 transition-all"
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${roleInfo.color} flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                    {roleInfo.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{roleInfo.title}</h3>
                  <p className="text-gray-600">{roleInfo.description}</p>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {roleInfo.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${roleInfo.color} flex items-center justify-center mr-2`}>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:from-gray-200 hover:to-gray-300 transition-all">
                  اختيار هذا الدور
                </button>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                تسجيل الدخول
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${roleData[role as keyof typeof roleData].color} flex items-center justify-center text-white text-2xl`}>
                {roleData[role as keyof typeof roleData].icon}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              إنشاء حساب - {roleData[role as keyof typeof roleData].title}
            </h1>
            <p className="text-gray-600 mt-2">
              {roleData[role as keyof typeof roleData].description}
            </p>
            <button 
              onClick={() => setShowRoleSelection(true)}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              تغيير نوع الحساب
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-center"
            >
              <Shield className="w-5 h-5 mr-2 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="الاسم الكامل"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">متطلبات كلمة المرور:</p>
                  <ul className="grid grid-cols-2 gap-1">
                    {passwordRequirements.map((req, index) => (
                      <li key={index} className="flex items-center text-xs">
                        {req.test(password) ? (
                          <Check className="w-3 h-3 text-green-500 mr-1" />
                        ) : (
                          <div className="w-3 h-3 border border-gray-300 rounded-full mr-1"></div>
                        )}
                        <span className={req.test(password) ? "text-green-600" : "text-gray-500"}>
                          {req.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r ${roleData[role as keyof typeof roleData].color} text-white py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  <>
                    إنشاء حساب
                    <ArrowRight className="mr-2 w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UnifiedRegisterPage;