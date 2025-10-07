import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Box, MapPin, Plus, Minus, Truck, Clock, User } from 'lucide-react';
import Modal from './Modal';
import toast from 'react-hot-toast';
import { storage } from '../utils/localStorage';

import type { MarketItem } from '../utils/localStorage';

interface AddOrderWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (order: any) => void;
  selectedItem?: MarketItem | null;
  defaultMode?: 'partner' | 'market';
}

const AddOrderWizard: React.FC<AddOrderWizardProps> = ({ isOpen, onClose, onAdd, selectedItem, defaultMode }) => {
  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState<'partner' | 'market'>(defaultMode || 'partner');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<any>({
    customerName: '', customerPhone: '', merchant: '', packageDescription: '', value: '',
    weight: '', dimensions: '', pickupAddress: '', destination: '', priority: 'متوسطة', deliveryTime: '',
    cashOnDelivery: false, codAmount: '', marketTitle: '', marketCategory: '', marketQuantity: '', marketDetails: '', marketPublish: 'public'
  });

  const [orderItems, setOrderItems] = useState<Array<{ productId?: string; name: string; price: string; quantity: string }>>(
    selectedItem ? [{ productId: selectedItem.id, name: selectedItem.name, price: String(selectedItem.price || 0), quantity: '1' }] : []
  );

  const [shippingServiceId, setShippingServiceId] = useState('');

  const shippingServices = storage.getShippingServices();
  const priorities = ['منخفضة', 'متوسطة', 'عالية', 'عاجلة'];

  useEffect(() => {
    setOrderItems(selectedItem ? [{ productId: selectedItem.id, name: selectedItem.name, price: String(selectedItem.price || 0), quantity: '1' }] : []);
  }, [selectedItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const t = e.target as HTMLInputElement;
    const { name, type, value, checked } = t;
    setFormData((p: any) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const addEmptyItem = () => setOrderItems(prev => ([...prev, { name: '', price: '', quantity: '1' }]));
  const removeItem = (idx: number) => setOrderItems(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, key: 'name' | 'price' | 'quantity', value: string) => setOrderItems(prev => prev.map((it, i) => i === idx ? ({ ...it, [key]: value }) : it));

  const nextStep = () => {
    if (step === 1) return setStep(2);
    if (step === 2) {
      if (orderType === 'partner') {
        if (!formData.customerName || !formData.customerPhone || !formData.merchant || !formData.packageDescription || !formData.pickupAddress || !formData.destination) {
          toast.error('الرجاء ملء جميع الحقول المطلوبة'); return;
        }
        if (!orderItems || orderItems.length === 0) { toast.error('الرجاء إضافة عنصر واحد على الأقل إلى الطلب'); return; }
      } else {
        if (!formData.marketTitle || !formData.marketQuantity) { toast.error('الرجاء ملء جميع الحقول المطلوبة'); return; }
      }
      return setStep(3);
    }
    setStep(s => Math.min(4, s + 1));
  };
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      if (orderType === 'market') {
        onAdd({
          title: formData.marketTitle || formData.packageDescription || '',
          category: formData.marketCategory || 'عام',
          quantity: Number(formData.marketQuantity) || 1,
          details: formData.marketDetails || '',
          publishScope: formData.marketPublish === 'public' ? 'عام' : 'خاص',
          value: Number(formData.value) || 0,
          originalItemId: selectedItem?.id || null
        });
      } else {
        onAdd({
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          merchant: formData.merchant,
          packageDescription: formData.packageDescription,
          value: Number(formData.value) || 0,
          priority: formData.priority,
          deliveryTime: formData.deliveryTime,
          cashOnDelivery: formData.cashOnDelivery,
          codAmount: Number(formData.codAmount) || 0,
          shippingServiceId: shippingServiceId || null,
          products: orderItems && orderItems.length ? orderItems.map(i => ({ productId: i.productId || '', name: i.name, price: Number(i.price) || 0, quantity: Number(i.quantity) || 1 })) : undefined
        });
      }
      toast.success('✅ تم إضافة الطلب بنجاح!');
      setStep(1);
      setFormData({ customerName: '', customerPhone: '', merchant: '', packageDescription: '', value: '', weight: '', dimensions: '', pickupAddress: '', destination: '', priority: 'متوسطة', deliveryTime: '', cashOnDelivery: false, codAmount: '', marketTitle: '', marketCategory: '', marketQuantity: '', marketDetails: '', marketPublish: 'public' });
      setShippingServiceId('');
      onClose();
    } catch (err) { console.error(err); toast.error('حدث خطأ أثناء إضافة الطلب. حاول مرة أخرى.'); }
    finally { setIsSubmitting(false); }
  };

  const getStepTitle = () => {
    if (step === 1) return 'اختر نوع الطلب';
    if (step === 2) return orderType === 'partner' ? 'تفاصيل الطلب' : 'تفاصيل الطلب في السوق';
    if (step === 3) return 'معلومات إضافية';
    return 'مراجعة الطلب';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getStepTitle()} size="md">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{getStepTitle()}</h2>
          <button onClick={onClose} aria-label="إغلاق" className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence initial={false} mode="wait">
            {step === 1 && (
              <motion.div key="step-1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">ما نوع الطلب الذي ترغب في إنشائه؟</h3>
                  <p className="text-gray-600 text-sm">اختر من بين الخيارات التالية</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${orderType === 'partner' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'}`} onClick={() => setOrderType('partner')}>
                    <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-emerald-100 rounded-lg"><Truck className="w-6 h-6 text-emerald-600" /></div><h3 className="text-lg font-semibold">طلب شحن لشريك</h3></div>
                    <p className="text-gray-600 text-sm mb-4">إنشاء طلب شحن وتوصيله عبر أحد شركائنا في الشحن</p>
                  </div>

                  <div className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${orderType === 'market' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`} onClick={() => setOrderType('market')}>
                    <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-blue-100 rounded-lg"><ShoppingCart className="w-6 h-6 text-blue-600" /></div><h3 className="text-lg font-semibold">طلب في السوق المشترك</h3></div>
                    <p className="text-gray-600 text-sm mb-4">نشر طلب في السوق المشترك ليقوم الموردين برؤيته وتقديم عروض</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && orderType === 'partner' && (
              <motion.div key="step-2-partner" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.22 }}>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2"><User className="w-5 h-5" />معلومات العميل</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">اسم العميل *</label>
                      <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="أحمد محمد" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">رقم هاتف العميل *</label>
                      <input type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="+966501234567" />
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2"><Box className="w-5 h-5" />معلومات الشحنة</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">اسم التاجر/المتجر *</label>
                      <input type="text" name="merchant" value={formData.merchant} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="متجر الإلكترونيات" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">قيمة الشحنة (ريال) *</label>
                      <input type="number" name="value" value={formData.value} onChange={handleChange} required min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="150.00" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">وصف الطرد *</label>
                    <textarea name="packageDescription" value={formData.packageDescription} onChange={handleChange} required rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="هاتف ذكي مع الاكسسوارات" />
                  </div>

                  <div className="mt-4 bg-white p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">عناصر الطلب</h4>
                      <button type="button" onClick={addEmptyItem} className="text-xs text-emerald-600 px-2 py-1 rounded hover:bg-emerald-50 transition">+ إضافة عنصر</button>
                    </div>

                    {orderItems.length === 0 && <div className="text-sm text-gray-500 py-4">لم تضف أي عنصر بعد. اضغط "+ إضافة عنصر" لإضافة واحد.</div>}

                    <div className="space-y-3">
                      <AnimatePresence initial={false} mode="popLayout">
                        {orderItems.map((it, idx) => (
                          <motion.div key={idx} layout initial={{ opacity: 0, scale: 0.98, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -6 }} transition={{ duration: 0.18 }} className="grid grid-cols-12 gap-2 items-center p-2 border rounded-lg">
                            <input className="col-span-5 px-2 py-2 border rounded focus:ring-2 focus:ring-emerald-200" placeholder="اسم العنصر" value={it.name} onChange={(e) => updateItem(idx, 'name', e.target.value)} />
                            <input className="col-span-3 px-2 py-2 border rounded focus:ring-2 focus:ring-emerald-200" placeholder="السعر" type="number" min="0" value={it.price} onChange={(e) => updateItem(idx, 'price', e.target.value)} />
                            <div className="col-span-2 flex items-center gap-2">
                              <button type="button" aria-label="تقليل الكمية" title="تقليل الكمية" onClick={() => updateItem(idx, 'quantity', String(Math.max(1, Number(it.quantity || 1) - 1)))} className="p-1 bg-gray-100 rounded hover:bg-gray-200"><Minus className="w-4 h-4" /></button>
                              <input className="w-14 text-center px-2 py-2 border rounded" placeholder="الكمية" type="number" min="1" value={it.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)} />
                              <button type="button" aria-label="زيادة الكمية" title="زيادة الكمية" onClick={() => updateItem(idx, 'quantity', String(Number(it.quantity || 1) + 1))} className="p-1 bg-gray-100 rounded hover:bg-gray-200"><Plus className="w-4 h-4" /></button>
                            </div>
                            <div className="col-span-2 text-left"><button type="button" onClick={() => removeItem(idx)} className="text-red-600 text-sm px-2 py-1 rounded hover:bg-red-50">إزالة</button></div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الوزن (كجم)</label>
                      <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="0.5" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الأبعاد (سم)</label>
                      <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="20 × 15 × 5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && orderType === 'market' && (
              <motion.div key="step-2-market" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.22 }}>
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-blue-600" />تفاصيل الطلب في السوق</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الطلب *</label>
                      <input name="marketTitle" value={formData.marketTitle} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="مثل: شاشة هاتف ذكي 6.5 بوصة - 500 وحدة" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">التصنيف</label>
                      <input name="marketCategory" value={formData.marketCategory} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="إلكترونيات، ملابس، إكسسوارات..." />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الكمية *</label>
                      <input name="marketQuantity" type="number" min={1} value={formData.marketQuantity} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">قيمة الطلب (ريال)</label>
                      <input type="number" name="value" value={formData.value} onChange={handleChange} min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="150000" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">التفاصيل (اختياري)</label>
                    <textarea name="marketDetails" value={formData.marketDetails} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="وصف إضافي، مواصفات، تواريخ تسليم مفضلة..." />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">حالة النشر</label>
                    <select name="marketPublish" aria-label="حالة النشر" value={formData.marketPublish} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                      <option value="public">عام (لكل الموردين)</option>
                      <option value="partners">خاص (للشركاء فقط)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && orderType === 'partner' && (
              <motion.div key="step-3" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.22 }}>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2"><Clock className="w-5 h-5" />تفضيلات التوصيل</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الأولوية</label>
                      <select name="priority" aria-label="الأولوية" value={formData.priority} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm">
                        {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">وقت التوصيل المطلوب</label>
                      <input type="text" name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm" placeholder="خلال ساعة واحدة" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center gap-2"><input type="checkbox" name="cashOnDelivery" checked={formData.cashOnDelivery} onChange={handleChange} className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500" /> <span className="text-sm font-medium text-gray-700">الدفع عند الاستلام (COD)</span></label>
                    {formData.cashOnDelivery && (<div className="mt-3 ml-6"><label className="block text-sm font-medium text-gray-700 mb-2">المبلغ المطلوب تحصيله (ريال)</label><input type="number" name="codAmount" value={formData.codAmount} onChange={handleChange} min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm" placeholder="150.00" /></div>)}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">اختيار خدمة شحن (اختياري)</h3>
                    <select aria-label="اختيار خدمة الشحن" value={shippingServiceId} onChange={(e) => setShippingServiceId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-sm">
                      <option value="">-- اختيار خدمة الشحن (اختياري) --</option>
                      {shippingServices.map(s => <option key={s.id} value={s.id}>{s.name} • {s.provider?.name || 'مزود'}</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">مراجعة الطلب</h3>
                  {orderType === 'partner' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700">معلومات العميل</h4>
                          <p className="text-sm text-gray-600">الاسم: {formData.customerName || '-'}</p>
                          <p className="text-sm text-gray-600">الهاتف: {formData.customerPhone || '-'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">معلومات التاجر</h4>
                          <p className="text-sm text-gray-600">الاسم: {formData.merchant || '-'}</p>
                          <p className="text-sm text-gray-600">القيمة: {formData.value || '0'} ريال</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700">وصف الطرد</h4>
                        <p className="text-sm text-gray-600">{formData.packageDescription || '-'}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700">عنوان الاستلام</h4>
                          <p className="text-sm text-gray-600">{formData.pickupAddress || '-'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">عنوان التوصيل</h4>
                          <p className="text-sm text-gray-600">{formData.destination || '-'}</p>
                        </div>
                      </div>

                      {orderItems && orderItems.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700">عناصر الطلب</h4>
                          <ul className="text-sm text-gray-600 space-y-1 mt-2">
                            {orderItems.map((it, i) => (
                              <li key={i} className="flex justify-between">
                                <span>{it.name || '-'} x{it.quantity || 1}</span>
                                <span className="font-semibold">{((Number(it.price) || 0) * (Number(it.quantity) || 1)).toFixed(2)} ريال</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {shippingServiceId && (
                        <div>
                          <h4 className="font-medium text-gray-700">خدمة الشحن</h4>
                          <p className="text-sm text-gray-600">{shippingServices.find(s => s.id === shippingServiceId)?.name || '-'}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700">عنوان الطلب</h4>
                        <p className="text-sm text-gray-600">{formData.marketTitle || '-'}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700">التصنيف</h4>
                          <p className="text-sm text-gray-600">{formData.marketCategory || '-'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">الكمية</h4>
                          <p className="text-sm text-gray-600">{formData.marketQuantity || '0'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">القيمة</h4>
                          <p className="text-sm text-gray-600">{formData.value || '0'} ريال</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700">التفاصيل</h4>
                        <p className="text-sm text-gray-600">{formData.marketDetails || '-'}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700">حالة النشر</h4>
                        <p className="text-sm text-gray-600">{formData.marketPublish === 'public' ? 'عام (لكل الموردين)' : 'خاص (للشركاء فقط)'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 pt-4">
            {step > 1 && (<button type="button" onClick={prevStep} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">السابق</button>)}
            {step < 4 ? (
              <button type="button" onClick={nextStep} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm">التالي</button>
            ) : (
              <button type="submit" disabled={isSubmitting} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm ${isSubmitting ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                {isSubmitting ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>جاري الإضافة...</>) : (<><Box className="w-4 h-4" />تأكيد وإضافة الطلب</>)}
              </button>
            )}
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">إلغاء</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddOrderWizard;