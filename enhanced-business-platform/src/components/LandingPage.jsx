import React, { useState } from 'react';
// motion is used via JSX tags (e.g. <motion.div />); ESLint's no-unused-vars may false-positive here
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  Store, 
  Factory, 
  Truck, 
  ArrowLeft, 
  Star, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe,
  CheckCircle,
  PlayCircle,
  ChevronDown,
  Camera
} from 'lucide-react';

const LandingPage = ({ onGetStarted, onGoToMarketplace, onGoToImageDescriber }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  const stats = [
    { value: "500+", label: "مورد معتمد", icon: <Factory className="h-6 w-6" /> },
    { value: "1000+", label: "تاجر نشط", icon: <Store className="h-6 w-6" /> },
    { value: "50+", label: "شركة شحن", icon: <Truck className="h-6 w-6" /> },
    { value: "10K+", label: "معاملة يومية", icon: <TrendingUp className="h-6 w-6" /> }
  ];

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "أمان متقدم",
      description: "حماية شاملة لجميع المعاملات والبيانات مع تشفير من الدرجة المصرفية"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "سرعة فائقة",
      description: "معالجة فورية للطلبات والمدفوعات مع استجابة في الوقت الفعلي"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "تغطية شاملة",
      description: "خدمات متاحة في جميع أنحاء المنطقة مع شبكة واسعة من الشركاء"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "دعم متميز",
      description: "فريق دعم متخصص متاح 24/7 لمساعدتك في جميع احتياجاتك"
    }
  ];

  const userTypes = [
    {
      icon: <Store className="h-12 w-12" />,
      title: "أنا تاجر",
      description: "تواصل مع الموردين، وقم بإدارة طلباتك ومخزونك بسهولة",
      benefits: ["البحث عن أفضل الموردين", "مقارنة الأسعار", "إدارة الطلبات", "تتبع الشحنات"],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Factory className="h-12 w-12" />,
      title: "أنا مورد",
      description: "إدارة منتجاتك، عروض الأسعار، والطلبات الواردة بكفاءة عالية",
      benefits: ["عرض منتجاتك", "إدارة المخزون", "تلقي الطلبات", "تحليل المبيعات"],
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <Truck className="h-12 w-12" />,
      title: "أنا شركة شحن",
      description: "تتبع الشحنات، إدارة السائقين، وقدم عروض أسعار تنافسية",
      benefits: ["إدارة الأسطول", "تتبع الشحنات", "عروض الأسعار", "تحسين الطرق"],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-cairo overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-green-600/10"></div>

        {/* decorative blobs */}
        <div className="absolute -left-24 -top-24 w-96 h-96 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full opacity-30 blur-3xl animate-blob"></div>
        <div className="absolute -right-24 top-56 w-72 h-72 bg-gradient-to-br from-indigo-400 to-teal-400 rounded-full opacity-25 blur-3xl animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                منصة أعمالي
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              المنصة الذكية التي تربط الموردين والتجار وشركات الشحن في مكان واحد لتحقيق نمو غير مسبوق
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>ابدأ رحلتك الآن</span>
                <ArrowLeft className="h-5 w-5" />
              </motion.button>
              <motion.button
                onClick={onGoToMarketplace}
                className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold text-md shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>اذهب إلى السوق الذكي</span>
                <Store className="h-4 w-4" />
              </motion.button>

              <motion.button
                onClick={onGoToImageDescriber}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-full font-semibold text-md shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>وصف الصور الذكي</span>
                <Camera className="h-4 w-4" />
              </motion.button>

              <motion.button
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-bold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayCircle className="h-5 w-5" />
                <span>شاهد العرض التوضيحي</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="text-blue-600 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* Testimonial card overlay */}
      <div className="testimonial-overlay fixed right-8 top-40 z-40">
        <div className="bg-white rounded-2xl p-4 shadow-2xl glass-effect w-80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center text-white font-bold">ع</div>
            <div>
              <div className="font-semibold">علي الحربي</div>
              <div className="text-xs text-gray-500">مدير مشتريات - شركة النور</div>
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-3">"منصة أعمالي حسّنت عمليات الشراء لدينا وقلّلت تكلفة الشحن بنسبة 18% خلال الشهر الأول"</p>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              لماذا تختار <span className="text-blue-600">منصة أعمالي</span>؟
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نوفر لك جميع الأدوات والخدمات التي تحتاجها لتنمية أعمالك وتحقيق النجاح
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onHoverStart={() => setActiveFeature(index)}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-all duration-300 ${
                  activeFeature === index 
                    ? 'bg-blue-600 text-white shadow-xl' 
                    : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              اختر <span className="text-blue-600">دورك</span> وابدأ النجاح
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              مهما كان نوع عملك، لدينا الحلول المناسبة لك
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <motion.div
                key={index}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 bg-gradient-to-r ${type.color} text-white`}>
                    {type.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{type.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{type.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {type.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <motion.button
                    onClick={onGetStarted}
                    className={`w-full bg-gradient-to-r ${type.color} text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>ابدأ الآن</span>
                    <ArrowLeft className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              جاهز لتحويل أعمالك؟
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف الشركات التي تثق في منصة أعمالي لتنمية أعمالها
            </p>
            
            <div className="flex justify-center gap-4">
              <motion.button
                onClick={onGetStarted}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>ابدأ مجاناً الآن</span>
                <ArrowLeft className="h-5 w-5" />
              </motion.button>

              <motion.button
                onClick={onGoToMarketplace}
                className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold text-md shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>اذهب إلى السوق الذكي</span>
                <Store className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">منصة أعمالي</h3>
            <p className="text-gray-400 mb-6">المنصة الذكية للأعمال الحديثة</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">الشروط والأحكام</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">سياسة الخصوصية</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">اتصل بنا</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

