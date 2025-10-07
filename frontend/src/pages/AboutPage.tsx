import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            عن منصة تجارتنا
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            حلول متكاملة لإدارة الأعمال التجارية والتجارة الإلكترونية B2B
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">مهمتنا</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            نهدف إلى تمكين الشركات من إدارة عملياتها التجارية بكفاءة عالية من خلال منصة متكاملة 
            تجمع بين جميع الأدوات والخدمات اللازمة لتسهيل التجارة الإلكترونية بين الشركات.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            نؤمن أن التكنولوجيا يمكن أن تكون محركاً رئيسياً للنمو والتطوير في عالم الأعمال، 
            ولذلك نسعى جاهدين لتوفير حلول مبتكرة وسهلة الاستخدام تلبي احتياجات جميع الأطراف 
            المشاركة في سلسلة القيمة التجارية.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">الابتكار</h3>
            <p className="text-gray-600">
              نقدم حلولاً مبتكرة تسهل على الشركات إدارة عملياتها التجارية بكفاءة
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">الثقة</h3>
            <p className="text-gray-600">
              نبني علاقات قوية مع عملائنا من خلال الشفافية والاحترافية
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">التميز</h3>
            <p className="text-gray-600">
              نسعى دائماً لتحقيق أعلى معايير الجودة في جميع خدماتنا
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">انضم إلينا اليوم</h2>
          <p className="text-lg mb-6 opacity-90">
            ابدأ رحلتك مع منصة تجارتنا واحتضن مستقبل التجارة الإلكترونية
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            إنشاء حساب مجاني
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;