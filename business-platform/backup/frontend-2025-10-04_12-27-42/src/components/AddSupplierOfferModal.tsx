import { useState } from 'react';
import { X, Upload, Plus, Minus, Package, Shield, DollarSign, Clock, MapPin, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { marketplaceManager } from '../utils/marketplaceManager';
import type { SupplierOffer } from '../types/marketplace';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface AddSupplierOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (offer: SupplierOffer) => void;
}

const AddSupplierOfferModal: React.FC<AddSupplierOfferModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    offerType: 'product' as 'product' | 'service' | 'bundle',
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    currency: 'SAR' as 'SAR' | 'USD' | 'EUR',
    minimumQuantity: '',
    availableQuantity: '',
    quality: 'standard' as 'premium' | 'standard' | 'economy',
    shippingIncluded: false,
    deliveryOptions: [
      { type: 'pickup', price: 0, estimatedTime: 'فوري', description: 'استلام من المستودع' }
    ],
    certifications: [] as string[],
    specifications: {} as { [key: string]: string },
    paymentMethods: [] as string[],
    returnPolicy: '',
    warrantyPeriod: '',
    bulkDiscounts: [] as Array<{ minQuantity: number; discountPercentage: number }>
  });

  const [newSpec, setNewSpec] = useState({ key: '', value: '' });
  const [newCertification, setNewCertification] = useState('');

  const categories = [
    'المواد الغذائية',
    'الإلكترونيات',
    'الملابس والأزياء',
    'المنزل والحديقة',
    'الصحة والجمال',
    'الرياضة واللياقة',
    'السيارات والمركبات',
    'الكتب والوسائط',
    'الألعاب والهوايات',
    'المكتب والأعمال'
  ];

  const paymentMethodOptions = ['كاش', 'تحويل بنكي', 'شيك', 'بطاقة ائتمان', 'دفع إلكتروني'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addSpecification = () => {
    if (newSpec.key && newSpec.value) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpec.key]: newSpec.value
        }
      }));
      setNewSpec({ key: '', value: '' });
    }
  };

  const removeSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const addCertification = () => {
    if (newCertification && !formData.certifications.includes(newCertification)) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }));
  };

  const addBulkDiscount = () => {
    setFormData(prev => ({
      ...prev,
      bulkDiscounts: [...prev.bulkDiscounts, { minQuantity: 0, discountPercentage: 0 }]
    }));
  };

  const updateBulkDiscount = (index: number, field: 'minQuantity' | 'discountPercentage', value: number) => {
    setFormData(prev => ({
      ...prev,
      bulkDiscounts: prev.bulkDiscounts.map((discount, i) => 
        i === index ? { ...discount, [field]: value } : discount
      )
    }));
  };

  const removeBulkDiscount = (index: number) => {
    setFormData(prev => ({
      ...prev,
      bulkDiscounts: prev.bulkDiscounts.filter((_, i) => i !== index)
    }));
  };

  const handlePaymentMethodToggle = (method: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter(m => m !== method)
        : [...prev.paymentMethods, method]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);

    try {
      const offerData = {
        type: 'supplier_offer' as const,
        status: 'active' as const,
        offerType: formData.offerType,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        price: Number(formData.price),
        currency: formData.currency,
        minimumQuantity: Number(formData.minimumQuantity) || 1,
        availableQuantity: Number(formData.availableQuantity) || 1,
        deliveryOptions: formData.deliveryOptions.map(option => ({
          type: option.type as 'shipping' | 'pickup' | 'delivery',
          price: option.price,
          estimatedTime: option.estimatedTime,
          description: option.description
        })),
        shippingIncluded: formData.shippingIncluded,
        quality: formData.quality,
        certifications: formData.certifications,
        specifications: formData.specifications,
        supplier: {
          id: user.id,
          name: user.name || 'مورد',
          rating: 4.5,
          verified: user.isVerified || false,
          responseTime: 'خلال ساعة',
          location: 'السعودية'
        },
        terms: {
          paymentMethods: formData.paymentMethods.length > 0 ? formData.paymentMethods : ['كاش'],
          returnPolicy: formData.returnPolicy || 'حسب الاتفاق',
          warrantyPeriod: formData.warrantyPeriod || undefined,
          bulkDiscounts: formData.bulkDiscounts.length > 0 ? formData.bulkDiscounts : undefined
        }
      };

      const newOffer = marketplaceManager.addSupplierOffer(offerData);
      
      toast.success('تم إضافة العرض بنجاح! 🎉');
      onSuccess?.(newOffer);
      onClose();
      
      // إعادة تعيين النموذج
      setFormData({
        offerType: 'product',
        title: '',
        description: '',
        category: '',
        subcategory: '',
        price: '',
        currency: 'SAR',
        minimumQuantity: '',
        availableQuantity: '',
        quality: 'standard',
        shippingIncluded: false,
        deliveryOptions: [
          { type: 'pickup', price: 0, estimatedTime: 'فوري', description: 'استلام من المستودع' }
        ],
        certifications: [],
        specifications: {},
        paymentMethods: [],
        returnPolicy: '',
        warrantyPeriod: '',
        bulkDiscounts: []
      });
      
    } catch (error) {
      console.error('خطأ في إضافة العرض:', error);
      toast.error('حدث خطأ أثناء إضافة العرض');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* رأس النافذة */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">إضافة عرض جديد</h2>
              <p className="text-gray-600">قم بإضافة منتج أو خدمة للسوق</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* معلومات أساسية */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              المعلومات الأساسية
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع العرض</label>
                <select
                  name="offerType"
                  value={formData.offerType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="product">منتج</option>
                  <option value="service">خدمة</option>
                  <option value="bundle">باقة</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الجودة</label>
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="economy">اقتصادي</option>
                  <option value="standard">عادي</option>
                  <option value="premium">مميز</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العنوان *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="عنوان واضح وجذاب للعرض"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="وصف تفصيلي للمنتج أو الخدمة"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* التسعير والكمية */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              التسعير والكمية
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">السعر *</label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">ر.س</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأدنى للطلب</label>
                <input
                  type="number"
                  name="minimumQuantity"
                  value={formData.minimumQuantity}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الكمية المتاحة</label>
                <input
                  type="number"
                  name="availableQuantity"
                  value={formData.availableQuantity}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* خصومات الكمية */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">خصومات الكمية</label>
                <button
                  type="button"
                  onClick={addBulkDiscount}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  إضافة خصم
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.bulkDiscounts.map((discount, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">الحد الأدنى</label>
                      <input
                        type="number"
                        value={discount.minQuantity}
                        onChange={(e) => updateBulkDiscount(index, 'minQuantity', Number(e.target.value))}
                        min="1"
                        placeholder="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">نسبة الخصم (%)</label>
                      <input
                        type="number"
                        value={discount.discountPercentage}
                        onChange={(e) => updateBulkDiscount(index, 'discountPercentage', Number(e.target.value))}
                        min="0"
                        max="100"
                        placeholder="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBulkDiscount(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* المواصفات والشهادات */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              المواصفات والشهادات
            </h3>

            {/* المواصفات */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">المواصفات التقنية</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSpec.key}
                    onChange={(e) => setNewSpec(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="اسم المواصفة"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={newSpec.value}
                    onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="القيمة"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm"><strong>{key}:</strong> {value}</span>
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* الشهادات */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">شهادات الجودة</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="اسم الشهادة"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={addCertification}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {cert}
                    <button
                      type="button"
                      onClick={() => removeCertification(cert)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* الشروط والأحكام */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              الشروط والأحكام
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">طرق الدفع</label>
                <div className="space-y-2">
                  {paymentMethodOptions.map(method => (
                    <label key={method} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.includes(method)}
                        onChange={() => handlePaymentMethodToggle(method)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">فترة الضمان</label>
                <input
                  type="text"
                  name="warrantyPeriod"
                  value={formData.warrantyPeriod}
                  onChange={handleInputChange}
                  placeholder="6 أشهر"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">سياسة الاسترداد</label>
              <textarea
                name="returnPolicy"
                value={formData.returnPolicy}
                onChange={handleInputChange}
                rows={3}
                placeholder="شروط وأحكام الاسترداد..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="shippingIncluded"
                  checked={formData.shippingIncluded}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">الشحن مجاني ومشمول في السعر</span>
              </label>
            </div>
          </div>

          {/* أزرار العمل */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Package className="w-5 h-5" />
                  إضافة العرض
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddSupplierOfferModal;