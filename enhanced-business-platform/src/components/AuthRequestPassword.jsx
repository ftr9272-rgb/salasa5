import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { apiFetch } from '../lib/api';

export default function AuthRequestPassword({ onBack }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await apiFetch('/api/auth/request-password-reset', { method: 'POST', body: { email } });
      setMessage(res.message || 'تم إرسال التعليمات إذا كان البريد مسجلاً');
    } catch (err) {
      setMessage(err.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>طلب إعادة تعيين كلمة المرور</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">بريدك الإلكتروني</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              {message && <div className="text-sm text-gray-700">{message}</div>}
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>{loading ? 'جارٍ...' : 'أرسل'} </Button>
                <Button type="button" variant="secondary" onClick={onBack}>العودة</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
