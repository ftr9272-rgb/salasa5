import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Users, TrendingUp, Shield, BarChart3, Globe, Zap, Truck, ShoppingCart, Package, Award, Clock, Headphones, LogIn, Phone } from 'lucide-react';
import { useState } from 'react';

const LandingPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDemoLogin = async (email: string, password: string, role: string) => {
    setIsLoading(role);
    try {
      await login(email, password);
      // التوجيه حسب الدور الصحيح
      const routeMap: Record<string, string> = {
        'merchant': '/merchant',
        'supplier': '/supplier', 
        'shipping': '/shipping'
      };
      navigate(routeMap[role] || '/merchant');
    } catch (error) {
      console.error('Demo login failed:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const features = [
    {
      title: 'للموردين',
      description: 'إدارة المنتجات والطلبات والتواصل مع العملاء بسهولة',
      icon: Package,
      color: 'from-emerald-500 to-teal-600',
      features: ['عرض المنتجات', 'إدارة المخزون', 'تتبع الطلبات', 'تحليل المبيعات']
    },
    {
      title: 'للتجار',
      description: 'تصفح المنتجات وإدارة الطلبات والمدفوعات في مكان واحد',
      icon: ShoppingCart,
      color: 'from-blue-500 to-purple-600',
      features: ['تصفح المنتجات', 'اختيار المورد الأفضل', 'إدارة الطلبات', 'متابعة الشحنات']
    },
    {
      title: 'لشركات الشحن',
      description: 'خدمات لوجستية متطورة وحلول شحن مبتكرة',
      icon: Truck,
      color: 'from-orange-500 to-red-600',
      features: ['إدارة الشحنات', 'تتبع مباشر', 'تحسين المسارات', 'تقارير الأداء']
    }
  ];

  const benefits = [
    {
      title: 'أمان وموثوقية',
      description: 'حماية متقدمة للبيانات مع ضمان سرية المعاملات',
      icon: Shield,
      color: 'bg-green-500'
    },
    {
      title: 'نمو الأعمال',
      description: 'زيادة فرص البيع والوصول لأسواق جديدة',
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    {
      title: 'توفير الوقت',
      description: 'أتمتة العمليات وتسريع إنجاز المهام',
      icon: Clock,
      color: 'bg-purple-500'
    },
    {
      title: 'دعم متواصل',
      description: 'فريق دعم فني متخصص على مدار الساعة',
      icon: Headphones,
      color: 'bg-orange-500'
    }
  ];

  const pricingPlans = [
    {
      name: 'العضوية الحصرية',
      price: 'عضوية مدعوة',
      description: 'منصة حصرية للشركاء المعتمدين فقط',
      features: [
        'تحقق من الهوية والترخيص',
        'شبكة تجارية موثوقة',
        'أولوية في الدعم الفني',
        'أدوات تحليل متقدمة',
        'عمولة تنافسية على المبيعات'
      ],
      cta: 'طلب الانضمام كشريك',
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background with navy blue gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-blue-900 to-navy-800"></div>
        
        {/* Animated glowing blobs for depth */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/5 left-1/6 w-72 h-72 bg-cyan-500 rounded-full mix-blend-screen filter blur-4xl animate-animate-blob"></div>
          <div className="absolute top-1/3 right-1/6 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-4xl animate-animate-blob"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-4xl animate-animate-blob"></div>
        </div>
        
        <div className="container mx-auto px-6 py-28 md:py-36 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              {/* Platform purpose (no demo/fake info) */}
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-cyan-300 rounded-full text-sm font-medium mb-6">
                <Award className="w-4 h-4 ml-2" />
                منصة تجارية مخصصة للموردين، التجار، وشركات الشحن
              </div>
              
              {/* Main heading */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                منصة <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">تجارتنا</span>
              </h1>
              
              {/* Slogan placed above the subtitle in the hero image (Landing only) */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-4">
                {/* Larger, high-contrast slogan for sm+ screens; compact for xs */}
                <p className="hidden sm:block text-3xl md:text-4xl lg:text-5xl font-light text-white/95 mb-2 tracking-tight drop-shadow-md">
                  نحن نربطكم ونمكّنكم، لا نتحكم بكم.
                </p>
                <p className="sm:hidden text-xl font-light text-white/95 mb-2 tracking-tight drop-shadow">
                  نحن نربطكم ونمكّنكم، لا نتحكم بكم.
                </p>
              </motion.div>

              {/* Subtitle */}
              <p className="text-2xl md:text-3xl lg:text-4xl font-light text-blue-100 mb-6">
                ربط الموردين والتجار وشركات الشحن في نظام موثوق وآمن
              </p>

              {/* Description (platform goals) */}
              <p className="text-lg md:text-xl text-blue-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                منصة متخصصة تربط الأطراف الثلاثة: الموردون، التجار، وشركات الشحن. هدفنا تحسين كفاءة سلسلة التوريد، تعزيز الشفافية، وتسهيل التعاون بين الشركاء ضمن بيئة مُحققة وموثوقة.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                {user ? (
                  <Link 
                    to={`/${user.role}`}
                    className="group bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all font-bold shadow-2xl hover:shadow-cyan-500/25 flex items-center justify-center transform hover:-translate-y-1 duration-300"
                  >
                    الذهاب إلى لوحة التحكم
                    <ArrowRight className="mr-2 w-5 h-5 group-hover:mr-3 transition-all" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/contact"
                      className="group bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all font-bold shadow-2xl hover:shadow-cyan-500/25 flex items-center justify-center transform hover:-translate-y-1 duration-300"
                    >
                      إنشاء حساب مجاني
                      <ArrowRight className="mr-2 w-5 h-5 group-hover:mr-3 transition-all" />
                    </Link>
                    <Link 
                      to="/contact"
                      className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl hover:bg-white/20 transition-all font-bold flex items-center justify-center transform hover:-translate-y-1 duration-300"
                    >
                      تسجيل الدخول
                      <LogIn className="mr-2 w-5 h-5 group-hover:mr-3 transition-all" />
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="fill-white">
            <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Benefits (moved up) */}
      <div className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">لماذا تختار منصة تجارتنا؟</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              مميزات فريدة تضعك في المقدمة وتضمن نجاح أعمالك التجارية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100 text-center"
              >
                <div className={`${benefit.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-700 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">حلول متكاملة لجميع أطراف التجارة</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              منصة شاملة تلبي احتياجات الموردين والتجار وشركات الشحن في مكان واحد
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 overflow-hidden group"
              >
                <div className={`h-2 ${feature.color.replace('from-', 'bg-gradient-to-r from-')}`}></div>
                <div className="p-8">
                  <div className={`w-16 h-16 rounded-xl ${feature.color} flex items-center justify-center text-white mb-6`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-700 text-lg mb-6">{feature.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {feature.features.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-gray-800 text-base">
                        <CheckCircle className="w-5 h-5 text-green-500 ml-3 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    to="/register" 
                    className="text-blue-600 hover:text-blue-800 font-bold flex items-center text-lg"
                  >
                    تعرف على المزيد
                    <ArrowRight className="mr-2 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* (Duplicate benefits block removed) */}

      {/* Demo Section */}
      <div className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">ابدأ الآن</h2>
                <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto">
                  ادخل الآن لتجربة لوحات التحكم
                </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Merchant Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 h-full shadow-xl">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl">
                      🛒
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-3">لوحة التاجر</h4>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      البحث عن المنتجات والموردين المناسبين مع إدارة الطلبات والمشتريات بكفاءة عالية
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">🔍 بحث</span>
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full mx-2">🛒 مشتريات</span>
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">🤝 موردين</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDemoLogin('merchant@demo.com', 'password123', 'merchant')}
                      disabled={isLoading === 'merchant'}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-purple-400 disabled:to-pink-400 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
                    >
                      {isLoading === 'merchant' ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          جاري تسجيل الدخول...
                        </div>
                      ) : (
                        'ادخل كتاجر 🚀'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Supplier Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 h-full shadow-xl">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-3xl">
                      📦
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-3">لوحة المورد</h4>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      عرض وتقديم المنتجات بطريقة احترافية مع إدارة المخزون وتلقي طلبات التجار
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">🏷️ عرض</span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full mx-2">📦 مخزون</span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">📋 طلبات</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDemoLogin('supplier@demo.com', 'password123', 'supplier')}
                      disabled={isLoading === 'supplier'}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-green-400 disabled:to-emerald-400 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
                    >
                      {isLoading === 'supplier' ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          جاري تسجيل الدخول...
                        </div>
                      ) : (
                        'ادخل كمورد 🚀'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 h-full shadow-xl">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-3xl">
                      🚚
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-3">لوحة الشحن</h4>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      عرض خدمات وعروض الشحن المتنوعة مع إدارة الشحنات وتقديم حلول لوجستية متقدمة
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">🚛 خدمات</span>
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full mx-2">🏷️ عروض</span>
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">🚚 شحنات</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDemoLogin('shipping@demo.com', 'password123', 'shipping')}
                      disabled={isLoading === 'shipping'}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-orange-400 disabled:to-red-400 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
                    >
                      {isLoading === 'shipping' ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          جاري تسجيل الدخول...
                        </div>
                      ) : (
                        'ادخل كشركة شحن 🚀'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Marketplace & Exhibitions promo (placeholder images + guidance) */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Marketplace promo */}
              <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center text-center">
                <div className="w-full h-40 mb-4 rounded-lg bg-gray-100 flex items-center justify-center">
                  <ShoppingCart className="w-16 h-16 text-gray-400" />
                </div>
                <h5 className="text-xl font-bold mb-2">السوق المشترك</h5>
                <p className="text-gray-600 mb-4">استعرض المنتجات، قارن العروض، وتواصل مع الموردين لطلب عرض الأسعار بطريقة منظمة وآمنة.</p>
                <Link to="/enhanced-marketplace" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold">دخول السوق المشترك</Link>
              </div>

              {/* Exhibitions promo */}
              <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center text-center">
                <div className="w-full h-40 mb-4 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Globe className="w-16 h-16 text-gray-400" />
                </div>
                <h5 className="text-xl font-bold mb-2">المعارض</h5>
                <p className="text-gray-600 mb-4">شاهد المعارض الافتراضية والتواصل المباشر مع العارضين لاكتشاف فرص تجارية جديدة.</p>
                <Link to="/exhibitions" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold">دخول المعارض</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Removed pricing/membership section per request - keep messaging about partner network without prices */}

      {/* Final CTA Section */}
      <div className="py-20 bg-gradient-to-r from-slate-900 via-violet-800 to-cyan-700">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">هل أنت مستعد لتطوير أعمالك؟</h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              انضم إلى شبكة من الشركات الموثوقة وابدأ بتحسين عملياتك التجارية اليوم — بدون أي معلومات عن الأسعار هنا.
            </p>
            
            {user ? (
              <Link 
                to={`/${user.role}`}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg transform hover:scale-105 inline-flex items-center justify-center"
              >
                الذهاب إلى لوحة التحكم
                <ArrowRight className="mr-3 w-5 h-5" />
              </Link>
            ) : (
              <Link 
                to="/enhanced-marketplace"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg transform hover:scale-105 inline-flex items-center justify-center"
              >
                استعرض السوق المشترك
                <ArrowRight className="mr-3 w-5 h-5" />
              </Link>
            )}
          </motion.div>
        </div>
      </div>
      {/* WhatsApp floating contact button - opens wa.me to the admin number */}
      {/* Note: user provided local number 0505717003 — we assume Saudi country code +966 for wa.me (remove leading 0) -> 966505717003. If you want a different country code, tell me and I'll adjust the link. */}
      {
        (() => {
          const whatsappNumber = '966505717003'; // assumed +966 (KSA). Remove the leading zero from local number.
          const presetText = encodeURIComponent('اتواصل بخصوص منصة تجارتنا');
          const href = `https://wa.me/${whatsappNumber}?text=${presetText}`;
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="اتصل بنا عبر واتساب"
              title="التواصل عبر واتساب"
              className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg"
            >
              <Phone className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">واتساب</span>
            </a>
          );
        })()
      }
    </div>
  );
};

export default LandingPage;