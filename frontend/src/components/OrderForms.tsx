import { useState } from 'react';
import { ShippingOrderIcon, ProductOrderIcon } from './OrderIcons';

export const ShippingOrderForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [form, setForm] = useState({
    customer: '',
    customerPhone: '',
    destination: '',
    packageDescription: '',
    weight: '',
    dimensions: '',
    priority: 'عادي',
  });

  return (
    <form
      className="space-y-4 p-4 bg-blue-50 rounded-lg"
      onSubmit={e => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <ShippingOrderIcon />
        <h2 className="font-bold text-blue-700">طلب شحن جديد</h2>
      </div>
      <input className="input" placeholder="اسم العميل" value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} required />
      <input className="input" placeholder="رقم جوال العميل" value={form.customerPhone} onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))} required />
      <input className="input" placeholder="العنوان النهائي (الوجهة)" value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} required />
      <input className="input" placeholder="وصف الطرد" value={form.packageDescription} onChange={e => setForm(f => ({ ...f, packageDescription: e.target.value }))} required />
      <input className="input" placeholder="الوزن (اختياري)" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} />
      <input className="input" placeholder="الأبعاد (اختياري)" value={form.dimensions} onChange={e => setForm(f => ({ ...f, dimensions: e.target.value }))} />
      <select className="input" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
        <option value="عادي">عادي</option>
        <option value="عاجل">عاجل</option>
      </select>
      <button className="btn-primary w-full mt-2" type="submit">إرسال الطلب</button>
    </form>
  );
};

export const ProductOrderForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [form, setForm] = useState({
    merchant: '',
    products: '',
    pickupAddress: '',
    value: '',
    notes: '',
  });

  return (
    <form
      className="space-y-4 p-4 bg-green-50 rounded-lg"
      onSubmit={e => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <ProductOrderIcon />
        <h2 className="font-bold text-green-700">طلب منتجات جديد</h2>
      </div>
      <input className="input" placeholder="اسم التاجر/المتجر" value={form.merchant} onChange={e => setForm(f => ({ ...f, merchant: e.target.value }))} required />
      <input className="input" placeholder="المنتجات المطلوبة (افصل بينها بفاصلة)" value={form.products} onChange={e => setForm(f => ({ ...f, products: e.target.value }))} required />
      <input className="input" placeholder="عنوان الاستلام" value={form.pickupAddress} onChange={e => setForm(f => ({ ...f, pickupAddress: e.target.value }))} required />
      <input className="input" placeholder="قيمة الطلب (اختياري)" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
      <textarea className="input" placeholder="ملاحظات إضافية (اختياري)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      <button className="btn-primary w-full mt-2" type="submit">إرسال الطلب</button>
    </form>
  );
};
