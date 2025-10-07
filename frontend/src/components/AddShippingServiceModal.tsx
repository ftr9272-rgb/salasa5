import { useState } from 'react';
import { Truck, DollarSign, Clock, MapPin, Star, Tag, FileText } from 'lucide-react';
import Modal from './Modal';
import toast from 'react-hot-toast';
import { storage, type ShippingService } from '../utils/localStorage';

interface AddShippingServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (service: any) => void;
  user?: {
    id: string;
    name: string;
    type: 'merchant' | 'supplier' | 'shipping_company';
    rating?: number;
    verified?: boolean;
  };
}

const AddShippingServiceModal = ({ isOpen, onClose, onAdd, user }: AddShippingServiceModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'خدمة شحن',
    serviceArea: '',
    deliveryTime: '',
    specialFeatures: '',
    status: 'active' as const,
    type: 'service' as const
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'خدمة شحن',
    'توصيل سريع',
    'توصيل مبرد',
    'توصيل دولي',
    'تخزين',
    'تغليف',
    'توصيل ذاتي',
    'خدمات لوجستية'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // محاكاة API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        throw new Error('يجب تسجيل الدخول لإضافة الخدمة');
      }

      // Add to shipping services
      const payload: Omit<ShippingService, 'id' | 'createdAt'> = {
        name: formData.name,
        description: formData.description,
        pricePerKg: parseFloat(formData.price) || 0,
        deliveryTime: formData.deliveryTime || '',
        coverage: formData.serviceArea || '',
        category: formData.category || 'خدمة شحن',
        provider: {
          id: user.id,
          name: user.name,
          type: user.type
        },
        // Default values for required fields
        rating: user.rating || 4.5,
        verified: user.verified || false
      };

      const savedService: ShippingService = storage.addShippingService(payload as Omit<ShippingService, 'id' | 'createdAt'>);

      onAdd(savedService);
      toast.success('✅ تم إضافة الخدمة بنجاح إلى السوق!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'خدمة شحن',
        serviceArea: '',
        deliveryTime: '',
        specialFeatures: '',
        status: 'active',
        type: 'service'
      });
      
      onClose();
      
      // Dispatch event to update marketplace
      window.dispatchEvent(new CustomEvent('market-updated'));
    } catch (error) {
      toast.error('❌ حدث خطأ في إضافة الخدمة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🚚 إضافة خدمة شحن جديدة"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* اسم الخدمة */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Truck className="w-4 h-4" />
              اسم الخدمة *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="مثال: توصيل سريع في نفس اليوم"
            />
          </div>

          {/* السعر */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4" />
              السعر الأساسي (ريال) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50.00"
            />
          </div>

          {/* الفئة */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4" />
              الفئة *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* وقت التسليم */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              وقت التسليم التقديري
            </label>
            <input
              type="text"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="مثال: 2-4 ساعات"
            />
          </div>

          {/* منطقة الخدمة */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              منطقة الخدمة
            </label>
            <input
              type="text"
              name="serviceArea"
              value={formData.serviceArea}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="مثال: الرياض، جدة، المنطقة الشرقية"
            />
          </div>
        </div>

        {/* الميزات الخاصة */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Star className="w-4 h-4" />
            الميزات الخاصة
          </label>
          <input
            type="text"
            name="specialFeatures"
            value={formData.specialFeatures}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="مثال: تتبع مباشر، تأمين على الشحنات، تغليف مجاني"
          />
        </div>

        {/* الوصف */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4" />
            وصف الخدمة
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="اكتب وصفاً مفصلاً للخدمة..."
          />
        </div>

        {/* الحالة */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            حالة الخدمة
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
            <option value="draft">مسودة</option>
          </select>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-xl text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                جاري الإضافة...
              </>
            ) : (
              <>
                <Truck className="w-5 h-5" />
                إضافة الخدمة إلى السوق
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

export default AddShippingServiceModal;