import { useState } from 'react';
import { X, Clipboard, DollarSign, Calendar, MapPin, Target, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { marketplaceManager } from '../utils/marketplaceManager';
import type { MerchantRequest } from '../types/marketplace';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface AddMerchantRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (request: MerchantRequest) => void;
}

const AddMerchantRequestModal: React.FC<AddMerchantRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    requestType: 'product' as 'product' | 'service' | 'custom',
    title: '',
    description: '',
    category: '',
    subcategory: '',
    quantity: '',
    budgetMin: '',
    budgetMax: '',
    currency: 'SAR' as 'SAR' | 'USD' | 'EUR',
    deliveryDate: '',
    location: '',
    specifications: {} as { [key: string]: string },
    prioritizePrice: false,
    prioritizeQuality: true,
    prioritizeSpeed: false,
    requireCertification: false
  });

  const [newSpec, setNewSpec] = useState({ key: '', value: '' });

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

  const businessTypes = [
    'سوبر ماركت',
    'مطعم',
    'صيدلية',
    'متجر إلكترونيات',
    'متجر ملابس',
    'محل تجاري',
    'مكتب',
    'شركة',
    'أخرى'
  ];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    if (!formData.title || !formData.description || !formData.category || !formData.quantity) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (Number(formData.budgetMin) >= Number(formData.budgetMax)) {
      toast.error('الحد الأدنى للميزانية يجب أن يكون أقل من الحد الأقصى');
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        type: 'merchant_request' as const,
        status: 'active' as const,
        requestType: formData.requestType,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        requirements: {
          quantity: Number(formData.quantity),
          budget: {
            min: Number(formData.budgetMin),
            max: Number(formData.budgetMax),
            currency: formData.currency
          },
          deliveryDate: formData.deliveryDate,
          location: formData.location || 'السعودية',
          specifications: Object.keys(formData.specifications).length > 0 ? formData.specifications : undefined
        },
        merchant: {
          id: user.id,
          name: user.name || 'تاجر',
          rating: 4.2,
          verified: (user as any).isVerified || false,
          location: 'السعودية',
          businessType: 'تجارة التجزئة'
        },
        selectionCriteria: {
          prioritizePrice: formData.prioritizePrice,
          prioritizeQuality: formData.prioritizeQuality,
          prioritizeSpeed: formData.prioritizeSpeed,
          requireCertification: formData.requireCertification
        }
      };

      const newRequest = marketplaceManager.addMerchantRequest(requestData);
      
      toast.success('تم إضافة الطلب بنجاح! 🎉');
      onSuccess?.(newRequest);
      onClose();
      
      // إعادة تعيين النموذج
      setFormData({
        requestType: 'product',
        title: '',
        description: '',
        category: '',
        subcategory: '',
        quantity: '',
        budgetMin: '',
        budgetMax: '',
        currency: 'SAR',
        deliveryDate: '',
        location: '',
        specifications: {},
        prioritizePrice: false,
        prioritizeQuality: true,
        prioritizeSpeed: false,
        requireCertification: false
      });
      
    } catch (error) {
      console.error('خطأ في إضافة الطلب:', error);
      toast.error('حدث خطأ أثناء إضافة الطلب');
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
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Clipboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">إضافة طلب جديد</h2>
              <p className="text-gray-600">اطلب منتجات أو خدمات من الموردين</p>
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
              <Clipboard className="w-5 h-5 text-green-600" />
              معلومات الطلب
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع الطلب</label>
                <select
                  title="نوع الطلب"
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="product">منتج</option>
                  <option value="service">خدمة</option>
                  <option value="custom">مخصص</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة *</label>
                <select
                  title="فئة المنتج"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الطلب *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="مطلوب: أرز بسمتي عالي الجودة"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">وصف الطلب *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="وصف تفصيلي للمنتج أو الخدمة المطلوبة مع المواصفات المرغوبة"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* المتطلبات */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              المتطلبات والمواصفات
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الكمية المطلوبة *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  placeholder="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ التسليم المطلوب</label>
                <input
                  title="تاريخ التسليم المطلوب"
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">موقع التسليم</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="الرياض"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* المواصفات المطلوبة */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">المواصفات المطلوبة</label>
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
                    placeholder="القيمة المطلوبة"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    title="إضافة مواصفة"
                    type="button"
                    onClick={addSpecification}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    إضافة
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm"><strong>{key}:</strong> {value}</span>
                    <button
                      title="إزالة مواصفة"
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
          </div>

          {/* الميزانية */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              الميزانية المتاحة
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأدنى للميزانية *</label>
                <div className="relative">
                  <input
                    type="number"
                    name="budgetMin"
                    value={formData.budgetMin}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="1000.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">ر.س</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأقصى للميزانية *</label>
                <div className="relative">
                  <input
                    type="number"
                    name="budgetMax"
                    value={formData.budgetMax}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="5000.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">ر.س</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العملة</label>
                <select
                  title="العملة"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="SAR">ريال سعودي</option>
                  <option value="USD">دولار أمريكي</option>
                  <option value="EUR">يورو</option>
                </select>
              </div>
            </div>
          </div>

          {/* معايير الاختيار */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              معايير اختيار المورد
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="prioritizePrice"
                  checked={formData.prioritizePrice}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <div className="font-medium text-gray-800">أولوية للسعر</div>
                  <div className="text-sm text-gray-600">اختيار أقل سعر متاح</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="prioritizeQuality"
                  checked={formData.prioritizeQuality}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <div className="font-medium text-gray-800">أولوية للجودة</div>
                  <div className="text-sm text-gray-600">اختيار أعلى جودة متاحة</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="prioritizeSpeed"
                  checked={formData.prioritizeSpeed}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <div className="font-medium text-gray-800">أولوية للسرعة</div>
                  <div className="text-sm text-gray-600">أسرع وقت تسليم</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="requireCertification"
                  checked={formData.requireCertification}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <div className="font-medium text-gray-800">شهادة جودة مطلوبة</div>
                  <div className="text-sm text-gray-600">يجب أن يكون لديه شهادات معتمدة</div>
                </div>
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
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Clipboard className="w-5 h-5" />
                  إرسال الطلب
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddMerchantRequestModal;