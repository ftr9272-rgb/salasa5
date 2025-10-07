import React, { useState } from 'react';
import { Package, MapPin, User, DollarSign, Clock, Truck, Phone, Plus, Minus, Trash2 } from 'lucide-react';
import Modal from './Modal';
import toast from 'react-hot-toast';
import { storage } from '../utils/localStorage';

import type { MarketItem } from '../utils/localStorage';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (order: any) => void;
  selectedItem?: MarketItem | null;
  defaultMode?: 'partner' | 'market';
  defaultItemType?: 'product' | 'service' | 'offer';
  userType?: 'merchant' | 'supplier' | 'shipping' | 'customer'; // Add userType prop
}

const AddOrderModal = ({ isOpen, onClose, onAdd, selectedItem, defaultMode, defaultItemType, userType }: AddOrderModalProps) => {
  // For shipping users, only allow 'partner' mode
  const isShippingUser = userType === 'shipping';
  const initialMode = isShippingUser ? 'partner' : (defaultMode || 'partner');
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    merchant: '',
    destination: '',
    pickupAddress: '',
    packageDescription: '',
    weight: '',
    dimensions: '',
    value: '',
    priority: 'متوسطة',
    vehicleType: '',
    specialInstructions: '',
    deliveryTime: '',
  cashOnDelivery: false,
  codAmount: '',
  marketTitle: '',
  marketCategory: '',
  marketQuantity: '',
  marketDetails: '',
  marketPublish: 'public' // 'public' | 'partners'
  });

  // For market mode: allow multiple product lines
  const [marketItems, setMarketItems] = useState<Array<{ name: string; quantity: string; price: string }>>(selectedItem ? [{ name: selectedItem.name || '', quantity: '1', price: String(selectedItem.price || '') }] : []);

  const addMarketItem = () => setMarketItems(prev => ([...prev, { name: '', quantity: '1', price: '' }]));
  const removeMarketItem = (idx: number) => setMarketItems(prev => prev.filter((_, i) => i !== idx));
  const updateMarketItem = (idx: number, key: 'name' | 'quantity' | 'price', value: string) => setMarketItems(prev => prev.map((it, i) => i === idx ? ({ ...it, [key]: value }) : it));

  // mode: 'partner' => assign to specific shipping partner; 'market' => publish to marketplace
  // For shipping users, only allow 'partner' mode
  const [mode, setMode] = useState<'partner' | 'market'>(initialMode);
  const [itemType, setItemType] = useState<'product' | 'service' | 'offer'>(defaultItemType || 'product');

  const [shippingServiceId, setShippingServiceId] = useState('');

  const shippingServices = storage.getShippingServices();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const priorities = ['منخفضة', 'متوسطة', 'عالية', 'عاجلة'];
  const vehicleTypes = ['دراجة نارية', 'سيارة', 'شاحنة صغيرة', 'شاحنة متوسطة'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, type, value, checked } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // محاكاة API call
      await new Promise(resolve => setTimeout(resolve, 800));

      if (mode === 'market') {
        // compute total quantity & value from items when provided
        const items = marketItems.filter(it => it.name && (it.quantity && Number(it.quantity) > 0));
        const computedQuantity = items.length > 0 ? items.reduce((s, it) => s + (Number(it.quantity) || 0), 0) : (formData.marketQuantity ? Number(formData.marketQuantity) : (formData.weight ? Number(formData.weight) : 1));
        const computedValue = formData.value ? Number(formData.value) : (items.length > 0 ? items.reduce((s, it) => s + ((Number(it.price) || 0) * (Number(it.quantity) || 1)), 0) : 0);

        const marketPayload: any = {
          title: formData.marketTitle || formData.packageDescription || '',
          category: formData.marketCategory || formData.merchant || 'عام',
          quantity: computedQuantity,
          details: formData.marketDetails || formData.specialInstructions || '',
          visibility: itemType || 'product',
          publishToMarketplace: true,
          publishScope: formData.marketPublish === 'public' ? 'عام' : 'خاص',
          value: computedValue,
          originalItemId: selectedItem?.id || null
        };

        if (items.length > 0) {
          marketPayload.products = items.map(it => ({ name: it.name, quantity: Number(it.quantity) || 1, price: it.price ? Number(it.price) : undefined }));
        }

        onAdd(marketPayload);
      } else {
        const payload = {
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          merchant: formData.merchant,
          packageDescription: formData.packageDescription,
          value: formData.value ? Number(formData.value) : 0,
          priority: formData.priority,
          vehicleType: formData.vehicleType,
          deliveryTime: formData.deliveryTime,
          specialInstructions: formData.specialInstructions,
          cashOnDelivery: formData.cashOnDelivery,
          codAmount: formData.codAmount ? Number(formData.codAmount) : 0,
          originalItemId: selectedItem?.id || null,
          shippingServiceId: shippingServiceId || null,
          publishToMarketplace: false,
          itemType: itemType
        };
        onAdd(payload);
      }

      toast.success('✅ تم إضافة الطلب بنجاح!');

      // Reset form (include market fields)
      setFormData({
        customerName: '',
        customerPhone: '',
        merchant: '',
        destination: '',
        pickupAddress: '',
        packageDescription: '',
        weight: '',
        dimensions: '',
        value: '',
        priority: 'متوسطة',
        vehicleType: '',
        specialInstructions: '',
        deliveryTime: '',
        cashOnDelivery: false,
        codAmount: '',
        marketTitle: '',
        marketCategory: '',
        marketQuantity: '',
        marketDetails: '',
        marketPublish: 'public'
      });
      setShippingServiceId('');
      // reset mode to default or partner
      setMode(initialMode);
      setItemType(defaultItemType || 'product');
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
      title={mode === 'market' ? '🛒 إنشاء طلب جديد للسوق' : '📦 إضافة طلب شحن جديد'}
      size="xl"
    >
      {/* رسالة توضيحية أعلى النموذج */}
      <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-4 text-blue-900 text-sm">
        افتح هذا النموذج لإنشاء طلب شحن جديد يمكنك إرساله إلى شريك شحن أو حفظه كطلب داخل النظام — خيار النشر للسوق يتم التحكم به لاحقًا من صفحة الطلبات.
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* وضع العرض: إرسال لشريك شحن أم نشر للسوق */}
        {/* For shipping users, hide the mode switcher */}
        {!isShippingUser && (
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => setMode('partner')}
              className={`px-3 py-2 rounded-md ${mode === 'partner' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}
            >مرسل لشريك</button>
            <button
              type="button"
              onClick={() => setMode('market')}
              className={`px-3 py-2 rounded-md ${mode === 'market' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}
            >نشر في السوق</button>
          </div>
        )}

        {mode === 'market' ? (
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">📝 نموذج طلب منتجات للسوق</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="marketTitle" className="text-sm font-medium text-gray-700 mb-2 block">عنوان الطلب *</label>
                <input
                  id="marketTitle"
                  name="marketTitle"
                  value={formData.marketTitle}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="مثل: شاشة هاتف ذكي 6.5 بوصة - 500 وحدة"
                />
              </div>
              <div>
                <label htmlFor="marketCategory" className="text-sm font-medium text-gray-700 mb-2 block">التصنيف</label>
                <input
                  id="marketCategory"
                  name="marketCategory"
                  value={formData.marketCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="إلكترونيات، ملابس، إكسسوارات..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="marketQuantity" className="text-sm font-medium text-gray-700 mb-2 block">الكمية *</label>
                <input
                  id="marketQuantity"
                  name="marketQuantity"
                  type="number"
                  min={1}
                  value={formData.marketQuantity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="500"
                />
              </div>
              <div>
                <label htmlFor="itemType" className="text-sm font-medium text-gray-700 mb-2 block">نوع البند</label>
                <select
                  id="itemType"
                  name="itemType"
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="product">منتج</option>
                  <option value="service">خدمة</option>
                  <option value="offer">عرض</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              {/* Multi-item editor for market mode */}
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">عناصر متعددة (اختياري)</h4>
                <button type="button" onClick={addMarketItem} className="text-sm text-emerald-600 flex items-center gap-2"><Plus className="w-4 h-4" /> إضافة عنصر</button>
              </div>

              {marketItems.length === 0 && (
                <div className="text-sm text-gray-500 mb-3">لم تضف عناصر بعد. يمكنك ترك حقول القيمة والكمية عامة بدلاً من ذلك.</div>
              )}

              <div className="space-y-3">
                {marketItems.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <input value={it.name} onChange={(e) => updateMarketItem(idx, 'name', e.target.value)} placeholder="اسم العنصر" className="col-span-6 px-3 py-2 border rounded-lg" />
                    <input value={it.quantity} onChange={(e) => updateMarketItem(idx, 'quantity', e.target.value)} type="number" min={1} placeholder="الكمية" className="col-span-3 px-3 py-2 border rounded-lg text-center" />
                    <input value={it.price} onChange={(e) => updateMarketItem(idx, 'price', e.target.value)} type="number" min="0" step="0.01" placeholder="السعر (اختياري)" className="col-span-2 px-3 py-2 border rounded-lg text-center" />
                    <button type="button" onClick={() => removeMarketItem(idx)} className="col-span-1 text-red-600 p-2 rounded hover:bg-red-50" title="إزالة العنصر"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>

              <label htmlFor="marketDetails" className="text-sm font-medium text-gray-700 mb-2 block">التفاصيل (اختياري)</label>
              <textarea
                id="marketDetails"
                name="marketDetails"
                value={formData.marketDetails}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="وصف إضافي، مواصفات، تواريخ تسليم مفضلة..."
              />
            </div>

            <div className="mt-4">
              <label htmlFor="marketPublish" className="text-sm font-medium text-gray-700 mb-2 block">حالة النشر</label>
              <select
                id="marketPublish"
                name="marketPublish"
                value={formData.marketPublish}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="public">عام (لكل الموردين)</option>
                <option value="partners">خاص (للشركاء فقط)</option>
              </select>
            </div>
          </div>
        ) : (
          <>
        {/* معلومات العميل */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">👤 معلومات العميل</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                اسم العميل *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أحمد محمد"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                رقم هاتف العميل *
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+966501234567"
              />
            </div>
          </div>
        </div>

        {/* معلومات التاجر والطرود */}
        <div className="bg-emerald-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-emerald-800 mb-4">🏪 معلومات الشحنة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4" />
                اسم التاجر/المتجر *
              </label>
              <input
                type="text"
                name="merchant"
                value={formData.merchant}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="متجر الإلكترونيات"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4" />
                قيمة الشحنة (ريال) *
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="150.00"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4" />
              وصف الطرد *
            </label>
            <textarea
              name="packageDescription"
              value={formData.packageDescription}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="هاتف ذكي مع الاكسسوارات"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                الوزن (كجم)
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="0.5"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                الأبعاد (سم)
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="20 × 15 × 5"
              />
            </div>
          </div>
        </div>

        {/* معلومات التوصيل */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800 mb-4">🚛 معلومات التوصيل</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                عنوان الاستلام *
              </label>
              <input
                type="text"
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="الرياض - حي العليا"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                عنوان التوصيل *
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="الرياض - حي الملز"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label htmlFor="priority" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                الأولوية
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="vehicleType" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Truck className="w-4 h-4" />
                نوع المركبة المطلوبة
              </label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">اختيار تلقائي</option>
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                وقت التوصيل المطلوب
              </label>
              <input
                type="text"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="خلال ساعة واحدة"
              />
            </div>
          </div>
        </div>

        {/* الدفع عند الاستلام */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <input
              id="cashOnDelivery"
              type="checkbox"
              name="cashOnDelivery"
              checked={formData.cashOnDelivery}
              onChange={handleChange}
              className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500"
            />
            <label htmlFor="cashOnDelivery" className="text-lg font-semibold text-yellow-800">
              💰 الدفع عند الاستلام (COD)
            </label>
          </div>
          
          {formData.cashOnDelivery && (
            <div>
              <label htmlFor="codAmount" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4" />
                المبلغ المطلوب تحصيله (ريال)
              </label>
              <input
                id="codAmount"
                type="number"
                name="codAmount"
                value={formData.codAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="150.00"
              />
            </div>
          )}
        </div>

        {/* ملاحظات خاصة */}
        <div>
          <label htmlFor="specialInstructions" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            ملاحظات وتعليمات خاصة
          </label>
          <textarea
            id="specialInstructions"
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أي تعليمات خاصة للسائق أو العميل..."
          />
        </div>

        {/* اختيار خدمة شحن لإرسال الطلب مباشرة */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label htmlFor="shippingService" className="text-sm font-medium mb-2 block">اختيار خدمة شحن لإرسال الطلب مباشرة (اختياري)</label>
          <select
            id="shippingService"
            aria-label="اختيار خدمة الشحن"
            value={shippingServiceId}
            onChange={(e) => setShippingServiceId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="">-- إرسال لشريك شحن (اختياري) --</option>
            {shippingServices.map(s => (
              <option key={s.id} value={s.id}>{s.name} • {s.provider?.name || 'مزود'}</option>
            ))}
          </select>
        </div>

  </>
  )}

  {/* أزرار الإجراءات */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'px-6 py-3 rounded-full bg-gray-400 cursor-not-allowed text-white'
                : 'p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all'
            } font-semibold`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                جاري الإضافة...
              </>
            ) : (
              <>
            <Package className="w-5 h-5" />
            {mode === 'market' ? 'إضافة طلب للسوق' : 'إضافة الطلب'}
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddOrderModal;