import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { apiFetch } from '../lib/api';

export default function AuthResetPassword({ onBack }) {
  // Try to read token from query param ?token=...
  const getQueryToken = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('token') || '';
    } catch (e) {
      return '';
    }
  };

  const [token, setToken] = useState(getQueryToken());
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If the token appears later (e.g., SPA routing), update it from the URL
    const handlePop = () => setToken(getQueryToken());
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await apiFetch('/api/auth/reset-password', { method: 'POST', body: { token, new_password: newPassword } });
      setMessage(res.message || 'تمت العملية');
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
            <CardTitle>إعادة تعيين كلمة المرور</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="token">الرمز (Token)</Label>
                <Input id="token" value={token} onChange={(e) => setToken(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              {message && <div className="text-sm text-gray-700">{message}</div>}
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>{loading ? 'جارٍ...' : 'إعادة التعيين'}</Button>
                <Button type="button" variant="secondary" onClick={onBack}>العودة</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
