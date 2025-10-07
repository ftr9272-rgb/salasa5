import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/merchant');
    } catch (err) {
      setError('فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">تسجيل الدخول</h1>
          <p className="text-gray-600 mt-2">مرحبًا بعودتك! يرجى تسجيل الدخول إلى حسابك</p>
          
          {/* Demo Credentials Section */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-3">🚀 المنصة في الوضع التجريبي</h3>
            <div className="text-xs text-blue-700 space-y-2">
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-white/70 p-2 rounded">
                  <div className="font-medium">تاجر تجريبي:</div>
                  <div>merchant@demo.com | password123</div>
                </div>
                <div className="bg-white/70 p-2 rounded">
                  <div className="font-medium">مورد تجريبي:</div>
                  <div>supplier@demo.com | password123</div>
                </div>
                <div className="bg-white/70 p-2 rounded">
                  <div className="font-medium">شركة شحن تجريبية:</div>
                  <div>shipping@demo.com | password123</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-700">
                تذكرني
              </label>
            </div>

            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
              نسيت كلمة المرور؟
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
              إنشاء حساب
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;