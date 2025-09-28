import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Factory, Truck, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const Auth = ({ onLogin, onShowRequestReset, onShowReset }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('merchant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // تحقق وهمي: اسم المستخدم وكلمة المرور ثابتة لكل نوع حساب
    if (
      (userType === 'merchant' && username === 'merchant' && password === '1234') ||
      (userType === 'supplier' && username === 'supplier' && password === '1234') ||
      (userType === 'shipping' && username === 'shipping' && password === '1234')
    ) {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('userType', userType);
      setLoading(false);
      onLogin && onLogin();
    } else {
      setError('اسم المستخدم أو كلمة المرور أو نوع الحساب غير صحيح');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleLogin} className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
            >
              <User className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-900">تسجيل الدخول</CardTitle>
            <p className="text-gray-600">اختر نوع حسابك وادخل بياناتك</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">نوع الحساب</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={userType === 'merchant' ? 'default' : 'outline'}
                  onClick={() => setUserType('merchant')}
                  className="flex items-center gap-1"
                >
                  <Store className="h-4 w-4" />
                  تاجر
                </Button>
                <Button
                  type="button"
                  variant={userType === 'supplier' ? 'default' : 'outline'}
                  onClick={() => setUserType('supplier')}
                  className="flex items-center gap-1"
                >
                  <Factory className="h-4 w-4" />
                  مورد
                </Button>
                <Button
                  type="button"
                  variant={userType === 'shipping' ? 'default' : 'outline'}
                  onClick={() => setUserType('shipping')}
                  className="flex items-center gap-1"
                >
                  <Truck className="h-4 w-4" />
                  شحن
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="mt-1"
              />
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}
            <div className="flex items-center justify-between">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'جارٍ...' : 'تسجيل الدخول'}
              </Button>
            </div>
            <div className="mt-2 text-sm text-center">
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => onShowRequestReset && onShowRequestReset()}
              >
                نسيت كلمة المرور؟
              </button>
              <span className="mx-2">|</span>
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => onShowReset && onShowReset()}
              >
                إعادة تعيين كلمة المرور
              </button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default Auth;
