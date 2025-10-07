import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus } from 'lucide-react';
import Modal from './Modal';
import toast from 'react-hot-toast';
import type { MarketItem } from '../utils/localStorage';

interface AddMarketOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (order: any) => void;
  selectedItem?: MarketItem | null;
}

const AddMarketOrderModal: React.FC<AddMarketOrderModalProps> = ({ isOpen, onClose, onAdd, selectedItem }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<any>({
    marketTitle: '',
    marketCategory: '',
    marketQuantity: '',
    marketDetails: '',
    marketPublish: 'public',
    value: ''
  });

  const [orderItems, setOrderItems] = useState<Array<{ productId?: string; name: string; price: string; quantity: string }>>(
    selectedItem ? [{ productId: selectedItem.id, name: selectedItem.name, price: String(selectedItem.price || 0), quantity: '1' }] : []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const t = e.target as HTMLInputElement;
    const { name, type, value, checked } = t;
    setFormData((p: any) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const addEmptyItem = () => setOrderItems(prev => ([...prev, { name: '', price: '', quantity: '1' }]));
  const removeItem = (idx: number) => setOrderItems(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, key: 'name' | 'price' | 'quantity', value: string) => 
    setOrderItems(prev => prev.map((it, i) => i === idx ? ({ ...it, [key]: value }) : it));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.marketTitle || !formData.marketQuantity) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 300));
      
      onAdd({
        title: formData.marketTitle,
        category: formData.marketCategory || 'عام',
        quantity: Number(formData.marketQuantity) || 1,
        details: formData.marketDetails || '',
        publishScope: formData.marketPublish === 'public' ? 'عام' : 'خاص',
        value: Number(formData.value) || 0,
        originalItemId: selectedItem?.id || null,
        products: orderItems && orderItems.length ? orderItems.map(i => ({ 
          productId: i.productId || '', 
          name: i.name, 
          price: Number(i.price) || 0, 
          quantity: Number(i.quantity) || 1 
        })) : undefined
      });

      toast.success('✅ تم إضافة الطلب للسوق بنجاح!');
      
      // Reset form
      setFormData({
        marketTitle: '',
        marketCategory: '',
        marketQuantity: '',
        marketDetails: '',
        marketPublish: 'public',
        value: ''
      });
      setOrderItems([]);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء إضافة الطلب. حاول مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🛒 طلب منتجات من السوق المشترك"
      size="lg"
    >
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-blue-900 text-sm">
        <p className="font-medium mb-1">📝 نموذج طلب منتجات من الموردين</p>
        <p className="text-xs text-blue-700">أنشئ طلباً في السوق المشترك ليتمكن الموردون من رؤيته وتقديم عروضهم</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            تفاصيل الطلب
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان الطلب *
              </label>
              <input
                name="marketTitle"
                value={formData.marketTitle}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="مثال: شاشة هاتف ذكي 6.5 بوصة - 500 وحدة"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التصنيف
              </label>
              <input
                name="marketCategory"
                value={formData.marketCategory}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="إلكترونيات، ملابس، إكسسوارات..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الكمية الإجمالية *
              </label>
              <input
                name="marketQuantity"
                type="number"
                min={1}
                value={formData.marketQuantity}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                قيمة الطلب التقديرية (ريال)
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="150000"
              />
            </div>
          </div>

          {/* قسم المنتجات المتعددة */}
          <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-blue-900">منتجات الطلب (اختياري)</h4>
              <button
                type="button"
                onClick={addEmptyItem}
                className="text-xs text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-100 transition flex items-center gap-1 border border-blue-300"
              >
                <Plus className="w-3 h-3" /> إضافة منتج
              </button>
            </div>

            {orderItems.length === 0 && (
              <div className="text-sm text-gray-600 py-4 text-center bg-white rounded border border-dashed border-blue-300">
                💡 لم تضف أي منتج بعد. يمكنك إضافة منتجات متعددة في طلب واحد
              </div>
            )}

            <div className="space-y-3">
              <AnimatePresence initial={false} mode="popLayout">
                {orderItems.map((it, idx) => (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ opacity: 0, scale: 0.98, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="grid grid-cols-12 gap-2 items-center p-2 bg-white border border-blue-200 rounded-lg"
                  >
                    <input
                      className="col-span-5 px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 text-sm"
                      placeholder="اسم المنتج"
                      value={it.name}
                      onChange={(e) => updateItem(idx, 'name', e.target.value)}
                    />
                    <input
                      className="col-span-3 px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 text-sm"
                      placeholder="السعر"
                      type="number"
                      min="0"
                      value={it.price}
                      onChange={(e) => updateItem(idx, 'price', e.target.value)}
                    />
                    <div className="col-span-2 flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="تقليل الكمية"
                        title="تقليل الكمية"
                        onClick={() => updateItem(idx, 'quantity', String(Math.max(1, Number(it.quantity || 1) - 1)))}
                        className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        className="w-12 text-center px-1 py-2 border border-gray-300 rounded text-sm"
                        placeholder="1"
                        type="number"
                        min="1"
                        value={it.quantity}
                        onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                      />
                      <button
                        type="button"
                        aria-label="زيادة الكمية"
                        title="زيادة الكمية"
                        onClick={() => updateItem(idx, 'quantity', String(Number(it.quantity || 1) + 1))}
                        className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="col-span-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50 w-full"
                      >
                        إزالة
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {orderItems.length > 0 && (
              <div className="mt-3 p-3 bg-white rounded border border-blue-200 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>إجمالي المنتجات:</span>
                  <span className="font-semibold">{orderItems.length} منتج</span>
                </div>
                <div className="flex justify-between text-gray-700 mt-1">
                  <span>إجمالي الكمية:</span>
                  <span className="font-semibold">
                    {orderItems.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0)} وحدة
                  </span>
                </div>
                {orderItems.some(it => it.price) && (
                  <div className="flex justify-between text-blue-700 mt-1 pt-2 border-t border-blue-200">
                    <span>إجمالي القيمة المتوقعة:</span>
                    <span className="font-bold">
                      {orderItems.reduce((sum, it) => sum + ((Number(it.price) || 0) * (Number(it.quantity) || 0)), 0).toFixed(2)} ريال
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التفاصيل والملاحظات (اختياري)
            </label>
            <textarea
              name="marketDetails"
              value={formData.marketDetails}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="وصف إضافي، مواصفات، تواريخ تسليم مفضلة..."
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حالة النشر
            </label>
            <select
              name="marketPublish"
              aria-label="حالة النشر"
              value={formData.marketPublish}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="public">عام (لكل الموردين)</option>
              <option value="partners">خاص (للشركاء فقط)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري النشر...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                نشر الطلب في السوق
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMarketOrderModal;
