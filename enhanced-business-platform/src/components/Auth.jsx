import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Factory, Truck, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';

const Auth = ({ onLogin, onShowRequestReset, onShowReset }) => {
  const [userType, setUserType] = useState('merchant');

  const handleLogin = (e) => {
    e.preventDefault();
    // دخول تجريبي بدون أي بيانات
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userType', userType);
    onLogin && onLogin();
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
            <CardTitle className="text-2xl font-bold text-gray-900">تسجيل دخول تجريبي</CardTitle>
            <p className="text-gray-600">اختر نوع الحساب واضغط دخول مباشرة</p>
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
            <div className="flex items-center justify-between">
              <Button type="submit" className="w-full">
                دخول تجريبي
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default Auth;
