import { useState } from 'react';
import { Package, DollarSign, Tag, Layers, Image, Upload, X, Link } from 'lucide-react';
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
    status: 'active',
    minimumOrderQuantity: '',
    saleUnit: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageInputMethod, setImageInputMethod] = useState<'upload' | 'url'>('upload');

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
        status: 'active',
        minimumOrderQuantity: '',
        saleUnit: ''
      });
      setImageUrl('');
      setImageInputMethod('upload');
      
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

  // معالجة رفع الصور
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        toast.error('❌ يرجى رفع صور فقط');
        return;
      }

      // التحقق من حجم الملف (أقل من 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('❌ حجم الصورة يجب أن يكون أقل من 5MB');
        return;
      }

      // تحويل الصورة إلى base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageData]
        }));
        toast.success('✅ تم إضافة الصورة');
      };
      reader.readAsDataURL(file);
    });
  };

  // إضافة رابط صورة
  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) {
      toast.error('❌ يرجى إدخال رابط الصورة');
      return;
    }

    // التحقق من صحة الرابط
    try {
      new URL(imageUrl);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
      setImageUrl('');
      toast.success('✅ تم إضافة رابط الصورة');
    } catch {
      toast.error('❌ رابط الصورة غير صحيح');
    }
  };

  // حذف صورة
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    toast.success('🗑️ تم حذف الصورة');
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
              title="اختر فئة المنتج"
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

          {/* وحدة البيع */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Layers className="w-4 h-4" />
              وحدة البيع (اختياري)
            </label>
            <select
              name="saleUnit"
              value={formData.saleUnit}
              onChange={handleChange}
              title="اختر وحدة البيع"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">اختر وحدة البيع</option>
              <option value="قطعة">قطعة</option>
              <option value="كرتون">كرتون</option>
              <option value="درزن">درزن (12 قطعة)</option>
              <option value="علبة">علبة</option>
              <option value="صندوق">صندوق</option>
              <option value="كيس">كيس</option>
              <option value="باليت">باليت</option>
              <option value="حزمة">حزمة</option>
            </select>
          </div>

          {/* الحد الأدنى للطلب */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Layers className="w-4 h-4" />
              الحد الأدنى للطلب (اختياري)
            </label>
            <input
              type="number"
              name="minimumOrderQuantity"
              value={formData.minimumOrderQuantity}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="مثال: 10 (إذا كان البيع بالكرتون)"
            />
            {formData.saleUnit && (
              <p className="text-xs text-gray-500 mt-1">
                💡 سيتم البيع بوحدة: {formData.saleUnit}
              </p>
            )}
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
            title="اختر حالة المنتج"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
            <option value="draft">مسودة</option>
          </select>
        </div>

        {/* صور المنتج */}
        <div className="border-t pt-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
            <Image className="w-4 h-4" />
            صور المنتج (اختياري)
          </label>

          {/* طريقة إدخال الصورة */}
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setImageInputMethod('upload')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                imageInputMethod === 'upload'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              <Upload className="w-4 h-4" />
              رفع صورة
            </button>
            <button
              type="button"
              onClick={() => setImageInputMethod('url')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                imageInputMethod === 'url'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              <Link className="w-4 h-4" />
              رابط صورة
            </button>
          </div>

          {/* رفع صورة */}
          {imageInputMethod === 'upload' && (
            <div className="mb-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 font-medium">اضغط لرفع صورة</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF (أقل من 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          )}

          {/* رابط صورة */}
          {imageInputMethod === 'url' && (
            <div className="mb-4 flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                إضافة
              </button>
            </div>
          )}

          {/* عرض الصور المضافة */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`صورة ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="حذف الصورة"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {formData.images.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              لم يتم إضافة أي صور بعد
            </p>
          )}
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