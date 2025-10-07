import { motion } from 'framer-motion';

const ServicesPage = () => {
  const services = [
    {
      title: 'إدارة المخزون',
      description: 'تتبع دقيق للمخزون وتحديث آلي لمستويات المواد مع تنبيهات ذكية عند الحاجة لإعادة التزود',
      icon: '📦',
      features: ['تتبع الوقت الحقيقي', 'تنبيهات تلقائية', 'تقارير تحليلية']
    },
    {
      title: 'إدارة الطلبات',
      description: 'أتمتة كاملة لمعالجة الطلبات من الاستلام إلى التسليم مع تتبع شامل لكل مرحلة',
      icon: '🛒',
      features: ['معالجة تلقائية', 'تتبع الشحن', 'إدارة المرتجعات']
    },
    {
      title: 'التحليلات والبيانات',
      description: 'تقارير مفصلة وأدوات تحليلية لاتخاذ قرارات مدروسة لتحسين الأداء التجاري',
      icon: '📊',
      features: ['تقارير مخصصة', 'تحليلات متقدمة', 'تنبيهات ذكية']
    },
    {
      title: 'إدارة العملاء',
      description: 'قاعدة بيانات موحدة للعملاء مع تاريخ التفاعلات وتفضيلات الشراء',
      icon: '👥',
      features: ['سجل العملاء', 'تقسيم العملاء', 'برامج الولاء']
    },
    {
      title: 'إدارة الموردين',
      description: 'تقييم شامل للموردين ومقارنة الأسعار وتحليل أداء الموردين',
      icon: '🚚',
      features: ['تقييم الموردين', 'مقارنة الأسعار', 'عقود ذكية']
    },
    {
      title: 'إدارة المالية',
      description: 'مراقبة دقيقة للمدفوعات والمستحقات مع تقارير مالية شاملة',
      icon: '💰',
      features: ['تتبع المدفوعات', 'تقارير مالية', 'إدارة الضرائب']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            خدماتنا الشاملة
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            مجموعة متكاملة من الحلول التي تغطي جميع جوانب إدارة الأعمال التجارية والتجارة الإلكترونية
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-4xl mb-6 text-center">{service.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">{service.title}</h3>
              <p className="text-gray-600 mb-6 text-center">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-600">
                    <span className="text-green-500 ml-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">لماذا تختار منصة تجارتنا؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="p-4">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-gray-800 mb-2">سهولة الاستخدام</h3>
              <p className="text-gray-600 text-sm">واجهة بديهية وسهلة التعلم</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-bold text-gray-800 mb-2">أمان عالي</h3>
              <p className="text-gray-600 text-sm">حماية متقدمة للبيانات</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="font-bold text-gray-800 mb-2">تحديثات مستمرة</h3>
              <p className="text-gray-600 text-sm">تطوير دائم للميزات الجديدة</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="font-bold text-gray-800 mb-2">دعم فني</h3>
              <p className="text-gray-600 text-sm">فريق دعم متاح على مدار الساعة</p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all">
            ابدأ الآن مجاناً
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesPage;