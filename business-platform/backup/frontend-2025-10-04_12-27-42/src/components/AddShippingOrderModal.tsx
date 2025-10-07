import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, Plus, Minus, User, Phone, Package, DollarSign, MapPin, Clock, ShoppingCart } from 'lucide-react';
import Modal from './Modal';
import toast from 'react-hot-toast';
import { storage } from '../utils/localStorage';

interface AddShippingOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (order: any) => void;
}

const AddShippingOrderModal: React.FC<AddShippingOrderModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<any>({
    pickupAddress: '',
    destination: '',
    contactPhone: '',
    notes: '',
    cashOnDelivery: false,
    codAmount: ''
  });

  const [orderItems, setOrderItems] = useState<Array<{ name: string; price: string; quantity: string }>>([
    { name: '', price: '', quantity: '1' }
  ]);
  const [publishToMarketplace, setPublishToMarketplace] = useState(true); // افتراضيًا منشور في السوق
  const [publishScope, setPublishScope] = useState<'عام' | 'خاص'>('عام');

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

    // التحقق من المدخلات الأساسية
    if (!formData.pickupAddress || !formData.destination) {
      toast.error('الرجاء ملء عنوان الاستلام وعنوان التوصيل');
      return;
    }

    // التحقق من وجود منتج واحد على الأقل
    const validItems = orderItems.filter(item => item.name.trim() && item.price && Number(item.price) > 0);
    if (validItems.length === 0) {
      toast.error('الرجاء إضافة منتج واحد على الأقل');
      return;
    }

    // التحقق من COD
    if (formData.cashOnDelivery && (!formData.codAmount || Number(formData.codAmount) <= 0)) {
      toast.error('الرجاء إدخال مبلغ الدفع عند الاستلام');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 300));

      // حساب القيمة الإجمالية من المنتجات
      const totalValue = validItems.reduce((sum, item) => 
        sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0
      );

      const productsDescription = validItems.map(item => 
        `${item.name} (×${item.quantity})`
      ).join('، ');

      onAdd({
        customerName: '', // لن يُستخدم - الطلب من التاجر نفسه
        customerPhone: formData.contactPhone || '', // رقم للتواصل فقط
        merchant: '', // سيتم ملؤه من معلومات المستخدم الحالي
        packageDescription: productsDescription,
        value: totalValue,
        priority: 'متوسطة', // افتراضي
        deliveryTime: '',
        vehicleType: '',
        specialInstructions: formData.notes || '',
        cashOnDelivery: formData.cashOnDelivery,
        codAmount: Number(formData.codAmount) || 0,
        pickupAddress: formData.pickupAddress,
        destination: formData.destination,
        weight: '',
        dimensions: '',
        publishToMarketplace: publishToMarketplace,
        publishScope: publishScope,
        products: validItems.map(i => ({
          name: i.name,
          price: Number(i.price) || 0,
          quantity: Number(i.quantity) || 1
        }))
      });

      if (publishToMarketplace) {
        toast.success('✅ تم نشر طلب الشحن في السوق المشترك!');
      } else {
        toast.success('✅ تم حفظ طلب الشحن بنجاح!');
      }

      // Reset form
      setFormData({
        pickupAddress: '',
        destination: '',
        contactPhone: '',
        notes: '',
        cashOnDelivery: false,
        codAmount: ''
      });
      setOrderItems([{ name: '', price: '', quantity: '1' }]);
      setPublishToMarketplace(true);
      setPublishScope('عام');
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
      title="🚚 إضافة طلب شحن جديد"
      size="xl"
    >
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 text-emerald-900 text-sm">
        <p className="font-medium mb-1">📦 طلب شحن بضاعة</p>
        <p className="text-xs text-emerald-700">أدخل تفاصيل البضاعة المشتراة وعناوين الاستلام والتوصيل</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* عناوين الشحن */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-base font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            عناوين الشحن
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                عنوان الاستلام (من أين؟) *
              </label>
              <textarea
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: الرياض، حي العليا، مستودع المورد، شارع التخصصي، بجوار برج المملكة"
              />
              <p className="text-xs text-gray-500 mt-1">📍 عنوان المورد أو المكان الذي سيتم استلام البضاعة منه</p>
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 text-green-600" />
                عنوان التوصيل (إلى أين؟) *
              </label>
              <textarea
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: جدة، حي الروضة، مستودعي، شارع الأمير سلطان، عمارة رقم 123"
              />
              <p className="text-xs text-gray-500 mt-1">📍 عنوان مقرك أو مستودعك الذي ستستلم فيه البضاعة</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                رقم تواصل (اختياري)
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+966501234567"
              />
              <p className="text-xs text-gray-500 mt-1">� رقم للتواصل في حالة الطوارئ أو الاستفسارات</p>
            </div>
          </div>
        </div>

        {/* البضاعة المشتراة */}
        <div className="bg-emerald-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-emerald-800 flex items-center gap-2">
              <Package className="w-5 h-5" />
              البضاعة المشتراة *
            </h3>
            <button
              type="button"
              onClick={addEmptyItem}
              className="text-sm text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition font-medium"
            >
              + إضافة صنف
            </button>
          </div>
          
          <p className="text-xs text-gray-600 mb-3">📦 أدخل تفاصيل البضاعة التي اشتريتها من المورد</p>

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
                  className="bg-white p-3 rounded-lg border border-emerald-200"
                >
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-12 md:col-span-5">
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="اسم المنتج"
                        value={it.name}
                        onChange={(e) => updateItem(idx, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="السعر (ريال)"
                        type="number"
                        min="0"
                        step="0.01"
                        value={it.price}
                        onChange={(e) => updateItem(idx, 'price', e.target.value)}
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="تقليل الكمية"
                          onClick={() => updateItem(idx, 'quantity', String(Math.max(1, Number(it.quantity || 1) - 1)))}
                          className="p-1.5 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          className="w-full text-center px-2 py-2 border border-gray-300 rounded-lg"
                          type="number"
                          min="1"
                          value={it.quantity}
                          onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                          placeholder="الكمية"
                          aria-label="الكمية"
                        />
                        <button
                          type="button"
                          aria-label="زيادة الكمية"
                          onClick={() => updateItem(idx, 'quantity', String(Number(it.quantity || 1) + 1))}
                          className="p-1.5 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-2">
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="w-full text-red-600 text-sm px-2 py-2 rounded-lg hover:bg-red-50 font-medium"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ملخص المنتجات */}
          {orderItems.some(item => item.name && item.price) && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-emerald-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">إجمالي القيمة:</span>
                <span className="font-bold text-emerald-700">
                  {orderItems.reduce((sum, item) => 
                    sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0
                  ).toFixed(2)} ريال
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ملاحظات إضافية */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ملاحظات أو تعليمات خاصة (اختياري)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
            placeholder="مثال: البضاعة هشة - يرجى التعامل بحذر، أو أي ملاحظات أخرى لشركة الشحن..."
          />
        </div>

        {/* الدفع عند الاستلام */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="cashOnDelivery"
              checked={formData.cashOnDelivery}
              onChange={handleChange}
              className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
            />
            <span className="text-sm font-medium text-gray-700">الدفع نقداً عند التسليم (COD)</span>
          </label>
          <p className="text-xs text-gray-500 mt-1 mr-6">💰 سيدفع السائق لك المبلغ عند تسليم البضاعة</p>
          {formData.cashOnDelivery && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ المطلوب تحصيله من المورد (ريال) *</label>
              <input
                type="number"
                name="codAmount"
                value={formData.codAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="150.00"
              />
              <p className="text-xs text-gray-500 mt-1">المبلغ الذي ستدفعه لشركة الشحن لتسليمه للمورد</p>
            </motion.div>
          )}
        </div>

        {/* خيارات النشر */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="publishToMarketplace"
              checked={publishToMarketplace}
              onChange={(e) => setPublishToMarketplace(e.target.checked)}
              className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="publishToMarketplace" className="flex-1 cursor-pointer">
              <span className="text-sm font-medium text-gray-700">نشر في السوق المشترك</span>
              <p className="text-xs text-gray-500 mt-1">
                🌐 نشر طلب الشحن ليراه جميع شركات الشحن ويقدموا عروضهم وأسعارهم
              </p>
            </label>
          </div>

          {publishToMarketplace && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 ml-7"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">نطاق النشر</label>
              <select
                aria-label="نطاق النشر"
                value={publishScope}
                onChange={(e) => setPublishScope(e.target.value as 'عام' | 'خاص')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="عام">عام - لكل شركات الشحن</option>
                <option value="خاص">خاص - للشركاء فقط</option>
              </select>
            </motion.div>
          )}
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
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري الإضافة...
              </>
            ) : (
              <>
                <Truck className="w-4 h-4" />
                إضافة طلب الشحن
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddShippingOrderModal;
