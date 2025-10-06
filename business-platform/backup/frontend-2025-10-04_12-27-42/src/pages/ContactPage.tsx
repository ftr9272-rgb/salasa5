import { motion } from 'framer-motion';

const ContactPage = () => {
  const adminEmail = 'ftr9272@gmail.com';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            تواصل معنا
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            تم إزالة نموذج الاتصال — لإرسال رسالة، الرجاء التواصل عبر البريد الإلكتروني التالي. سنقوم بالرد في أقرب وقت ممكن.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mx-auto mb-4">
              <span className="text-2xl">✉️</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">البريد الإلكتروني للتواصل</h2>
            <p className="text-gray-700 mb-4">لأي استفسار، اقتراح أو دعم فني، راسلنا على العنوان التالي:</p>
            <a href={`mailto:${adminEmail}`} className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all">
              {adminEmail}
            </a>
          </div>
          <div className="mt-6 text-sm text-muted-foreground">
            <p>ملاحظة: تم تعطيل إرسال الرسائل عبر النموذج. استخدام البريد يضمن وصول رسالتك مباشرة إلى صندوقنا الوارد.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;