import { useState } from 'react';
import { Package, DollarSign, Tag, Layers } from 'lucide-react';
import Modal from './Modal';
import toast from 'react-hot-toast';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: any) => void;
}

const AddProductModal = ({ isOpen, onClose, onAdd }: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    images: [] as string[],
    sku: '',
    weight: '',
    dimensions: '',
    status: 'active'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'إلكترونيات',
    'أزياء',
    'منزلية',
    'رياضة',
    'صحة وجمال',
    'كتب',
    'ألعاب',
    'طعام ومشروبات',
    'سيارات',
    'أخرى'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // محاكاة API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProduct = {
        id: Date.now().toString(),
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        createdAt: new Date().toISOString(),
      };

      onAdd(newProduct);
      toast.success('✅ تم إضافة المنتج بنجاح!');
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        stock: '',
        category: '',
        description: '',
        images: [],
        sku: '',
        weight: '',
        dimensions: '',
        status: 'active'
      });
      
      onClose();
    } catch (error) {
      toast.error('❌ حدث خطأ في إضافة المنتج');
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
      title="📦 إضافة منتج جديد"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* اسم المنتج */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4" />
              اسم المنتج *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="مثال: هاتف ذكي آيفون 15"
            />
          </div>

          {/* السعر */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4" />
              السعر (ريال) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="2500.00"
            />
          </div>

          {/* الكمية */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Layers className="w-4 h-4" />
              الكمية المتاحة *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="50"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">اختر الفئة</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* رقم المنتج */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4" />
              رقم المنتج (SKU)
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="IPHONE15-001"
            />
          </div>

          {/* الوزن */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4" />
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
        </div>

        {/* الأبعاد */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Package className="w-4 h-4" />
            الأبعاد (طول × عرض × ارتفاع) سم
          </label>
          <input
            type="text"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="15 × 7 × 1"
          />
        </div>

        {/* الوصف */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Package className="w-4 h-4" />
            وصف المنتج
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="اكتب وصفاً مفصلاً للمنتج..."
          />
        </div>

        {/* الحالة */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            حالة المنتج
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                : 'bg-gradient-to-r from-emerald-500 to-blue-600 hover:shadow-xl text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                جاري الإضافة...
              </>
            ) : (
              <>
                <Package className="w-5 h-5" />
                إضافة المنتج
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

export default AddProductModal;