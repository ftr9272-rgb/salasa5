/* --- ضع هذا المقتطع مكان تعريف API_BASE القديم --- */

const DEFAULT_LOCAL = 'http://127.0.0.1:5000';

// Use VITE_API_BASE when provided (Vercel / production). In dev use localhost.
const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
  ? import.meta.env.VITE_API_BASE
  : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV ? DEFAULT_LOCAL : '');

/* --- لاحظ: دالة resolvedPath مستخدمة لاحقاً في الملف، احرص أن تبقى:
   const resolvedPath = (typeof path === 'string' && path.startsWith('/api')) ? API_BASE + path : path;
   --- */
