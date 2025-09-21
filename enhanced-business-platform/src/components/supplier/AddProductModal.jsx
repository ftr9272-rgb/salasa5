import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function AddProductModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    const payload = { name, price: parseFloat(price || 0), category };
    await onCreate(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">إضافة منتج جديد</h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">اسم المنتج</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">السعر</label>
            <Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" required />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">الفئة</label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" type="button" onClick={onClose}>إلغاء</Button>
            <Button type="submit">إضافة</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
