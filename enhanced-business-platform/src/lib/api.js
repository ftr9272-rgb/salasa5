/* --- استبدال آمن لتعريف API_BASE وتهيئة resolvedPath --- */

/*
  DEFAULT_LOCAL: عنوان الـ backend عند التطوير المحلي
  المنطق:
   - إذا كانت متغيرات Vite متاحة واستخدمت VITE_API_BASE فنستخدمها (production / Vercel).
   - إن لم تكن VITE_API_BASE متاحة لكن بيئة التطوير DEV معرفة فنستخدم DEFAULT_LOCAL.
   - خلاف ذلك نترك API_BASE كسلسلة فارغة.
  نلتف على إمكانية توقف الوصول إلى import.meta عبر فحوصات آمنة و try/catch.
*/

const DEFAULT_LOCAL = 'http://127.0.0.1:5000';

let API_BASE = '';

try {
  // تحقق آمن من وجود import.meta و import.meta.env قبل الوصول للحقول
  if (typeof import.meta !== 'undefined' && import.meta && import.meta.env) {
    if (import.meta.env.VITE_API_BASE) {
      API_BASE = import.meta.env.VITE_API_BASE;
    } else if (import.meta.env.DEV) {
      API_BASE = DEFAULT_LOCAL;
    } else {
      API_BASE = '';
    }
  } else {
    // حالة عدم وجود import.meta (مثلاً عند بعض أدوات الـ SSR أو بيئات غير متوقعة)
    API_BASE = '';
  }
} catch (err) {
  // أي خطأ غير متوقع أثناء الوصول إلى import.meta -> احتياطياً اترك فارغاً لتجنب تعطل التطبيق
  // يمكن تسجيل الخطأ أثناء التطوير إذا رغبت:
  // console.warn('Could not read import.meta.env:', err);
  API_BASE = '';
}

/*
  resolvedPath: دالة تأخذ مساراً وترجع المسار كاملًا:
   - إذا بدأ المسار بـ "/api" نضيف بادئة API_BASE
   - وإلا نعيد المسار كما هو
  نعرّفها كدالة حتى لا يحصل ReferenceError إذا استُدعيت لاحقًا.
*/
const resolvedPath = (path) => {
  if (typeof path === 'string' && path.startsWith('/api')) {
    // تأكد من عدم وجود شرطة زائدة عند الدمج
    if (API_BASE.endsWith('/') && path.startsWith('/')) {
      return API_BASE.replace(/\/+$/, '') + path;
    }
    return API_BASE + path;
  }
  return path;
};

// نصدر القيم كي يستطيع باقي التطبيق استخدامها
export { API_BASE, resolvedPath };
export default { API_BASE, resolvedPath };
