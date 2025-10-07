import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Zap, Shield, Heart, Eye, MessageSquare, TrendingUp, Award, Users, Clock, Package, ShoppingCart, Truck, Store, Sparkles, Crown, Verified, BarChart3, Filter, Search, Grid, List, Plus, Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const MarketplaceComparison = () => {
  const [activeTab, setActiveTab] = useState('features');

  const marketplaces = [
    {
      id: 'original',
      name: 'السوق الأصلي',
  url: '/enhanced-marketplace',
      description: 'النسخة الأساسية مع الوظائف الأساسية',
      color: 'blue',
      features: [
        'عرض المنتجات الأساسي',
        'بحث بسيط',
        'فلترة محدودة',
        'تصميم كلاسيكي',
        'عرض قائمة أساسي'
      ],
      pros: [
        'بساطة الاستخدام',
        'سرعة التحميل',
        'مناسب للمبتدئين',
        'واجهة مألوفة'
      ],
      cons: [
        'وظائف محدودة',
        'لا يوجد نظام توصيات',
        'تصميم أساسي',
        'قلة خيارات التفاعل'
      ]
    },
    {
      id: 'redesigned',
      name: 'السوق المُعاد تصميمه',
      url: '/redesigned-marketplace',
      description: 'نسخة محسنة بتصميم أفضل ومميزات إضافية',
      color: 'purple',
      features: [
        'تصميم محدث وجذاب',
        'بطاقات تفاعلية',
        'حركات ناعمة',
        'عرض محسن للمعارض',
        'نظام مفضلة محسن'
      ],
      pros: [
        'تصميم عصري',
        'تحسينات بصرية',
        'تفاعل محسن',
        'أداء أفضل'
      ],
      cons: [
        'تعقيد متوسط',
        'وقت تحميل أطول قليلاً',
        'يحتاج تعود',
        'استهلاك ذاكرة أكثر'
      ]
    },
    {
      id: 'enhanced',
      name: 'السوق المطور',
      url: '/enhanced-marketplace',
      description: 'النسخة الأكثر تطوراً مع ذكاء اصطناعي وتوصيات ذكية',
      color: 'emerald',
      features: [
        'توصيات ذكية مخصصة',
        'نظام بحث متقدم',
        'فلاتر شاملة',
        'إحصائيات تفاعلية',
        'نظام مفضلة متقدم',
        'واجهة عصرية بالكامل',
        'دعم المعارض التفاعلية',
        'نوافذ تفاصيل منبثقة'
      ],
      pros: [
        'أحدث التقنيات',
        'تجربة مستخدم متقدمة',
        'نظام توصيات ذكي',
        'تصميم متطور',
        'وظائف شاملة',
        'أداء محسن',
        'مزايا تفاعلية',
        'دعم مستقبلي'
      ],
      cons: [
        'يحتاج خبرة أكثر',
        'استهلاك موارد أعلى',
        'تعقيد في البداية'
      ]
    }
  ];

  const comparisonFeatures = [
    {
      feature: 'البحث والفلترة',
      original: 'بحث أساسي',
      redesigned: 'بحث محسن',
      enhanced: 'بحث ذكي متقدم'
    },
    {
      feature: 'التصميم',
      original: 'كلاسيكي',
      redesigned: 'عصري',
      enhanced: 'متطور بالكامل'
    },
    {
      feature: 'نظام التوصيات',
      original: 'غير متوفر',
      redesigned: 'محدود',
      enhanced: 'ذكي ومتقدم'
    },
    {
      feature: 'المفضلة',
      original: 'بسيط',
      redesigned: 'محسن',
      enhanced: 'متقدم مع مزامنة'
    },
    {
      feature: 'الإحصائيات',
      original: 'غير متوفرة',
      redesigned: 'أساسية',
      enhanced: 'شاملة وتفاعلية'
    },
    {
      feature: 'المعارض',
      original: 'عرض بسيط',
      redesigned: 'عرض محسن',
      enhanced: 'تفاعلية بالكامل'
    },
    {
      feature: 'الأداء',
      original: 'سريع',
      redesigned: 'جيد',
      enhanced: 'محسن ومحسن'
    },
    {
      feature: 'سهولة الاستخدام',
      original: 'بسيط جداً',
      redesigned: 'متوسط',
      enhanced: 'متقدم وسهل'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'from-blue-500 to-indigo-600',
          border: 'border-blue-200',
          text: 'text-blue-600',
          button: 'bg-blue-500 hover:bg-blue-600'
        };
      case 'purple':
        return {
          bg: 'from-purple-500 to-pink-600',
          border: 'border-purple-200',
          text: 'text-purple-600',
          button: 'bg-purple-500 hover:bg-purple-600'
        };
      case 'emerald':
        return {
          bg: 'from-emerald-500 to-teal-600',
          border: 'border-emerald-200',
          text: 'text-emerald-600',
          button: 'bg-emerald-500 hover:bg-emerald-600'
        };
      default:
        return {
          bg: 'from-gray-500 to-gray-600',
          border: 'border-gray-200',
          text: 'text-gray-600',
          button: 'bg-gray-500 hover:bg-gray-600'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              مقارنة الأسواق المختلفة
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              اكتشف الاختلافات بين إصدارات السوق الموحد واختر الأنسب لاحتياجاتك
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('features')}
                className={`px-6 py-2 rounded-md transition-all ${
                  activeTab === 'features'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                المميزات
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`px-6 py-2 rounded-md transition-all ${
                  activeTab === 'comparison'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                المقارنة التفصيلية
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'features' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {marketplaces.map((marketplace, index) => {
              const colors = getColorClasses(marketplace.color);
              return (
                <motion.div
                  key={marketplace.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  className={`bg-white rounded-2xl shadow-lg border-2 ${colors.border} overflow-hidden hover:shadow-xl transition-all duration-300`}
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${colors.bg} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold">{marketplace.name}</h3>
                      {marketplace.id === 'enhanced' && (
                        <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                          <Crown className="w-4 h-4" />
                          <span className="text-sm font-medium">الأحدث</span>
                        </div>
                      )}
                    </div>
                    <p className="text-white/90">{marketplace.description}</p>
                  </div>

                  {/* Features */}
                  <div className="p-6">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      المميزات الرئيسية
                    </h4>
                    <ul className="space-y-3 mb-6">
                      {marketplace.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className={`w-5 h-5 ${colors.text}`} />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Pros */}
                    <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      النقاط الإيجابية
                    </h5>
                    <ul className="space-y-2 mb-4">
                      {marketplace.pros.map((pro, proIndex) => (
                        <li key={proIndex} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-gray-600">{pro}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Cons */}
                    <h5 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      نقاط التحسين
                    </h5>
                    <ul className="space-y-2 mb-6">
                      {marketplace.cons.map((con, conIndex) => (
                        <li key={conIndex} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                          <span className="text-gray-600">{con}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
                    <Link
                      to={marketplace.url}
                      className={`w-full ${colors.button} text-white py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 hover:shadow-lg`}
                    >
                      <Eye className="w-5 h-5" />
                      جرب الآن
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {activeTab === 'comparison' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                المقارنة التفصيلية
              </h3>
              <p className="text-gray-600">مقارنة شاملة بين جميع إصدارات السوق</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-right p-4 font-bold text-gray-800">الميزة</th>
                    <th className="text-center p-4 font-bold text-blue-600">السوق الأصلي</th>
                    <th className="text-center p-4 font-bold text-purple-600">السوق المُعاد تصميمه</th>
                    <th className="text-center p-4 font-bold text-emerald-600">السوق المطور</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-4 font-medium text-gray-800">{item.feature}</td>
                      <td className="p-4 text-center text-gray-600">{item.original}</td>
                      <td className="p-4 text-center text-gray-600">{item.redesigned}</td>
                      <td className="p-4 text-center text-gray-600 font-medium">{item.enhanced}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">التوصية</h4>
                  <p className="text-gray-600">
                    للحصول على أفضل تجربة وأحدث المميزات، ننصح باستخدام <strong>السوق المطور</strong>
                  </p>
                </div>
                <Link
                  to="/enhanced-marketplace"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Crown className="w-5 h-5" />
                  جرب السوق المطور
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Access Links */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">الوصول السريع</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {marketplaces.map((marketplace) => {
              const colors = getColorClasses(marketplace.color);
              return (
                <Link
                  key={marketplace.id}
                  to={marketplace.url}
                  className={`${colors.button} text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg flex items-center gap-2`}
                >
                  <Eye className="w-4 h-4" />
                  {marketplace.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceComparison;