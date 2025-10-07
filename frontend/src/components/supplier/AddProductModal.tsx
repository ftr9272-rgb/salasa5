import { motion } from 'framer-motion';
import { X, Plus, Minus, Box, Tag, Layers, FileText, Calendar, Shield, Truck, Package as PackageIcon } from 'lucide-react';
import { useState } from 'react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
}

interface ProductForm {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  tags: string[];
  images: string[];
  specifications: { key: string; value: string }[];
  minOrder: number;
  maxOrder: number;
  deliveryTime: string;
  warranty: string;
}

function AddProductModal({ isOpen, onClose, onSave }: AddProductModalProps) {
  const [form, setForm] = useState<ProductForm>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    description: '',
    tags: [],
    images: [],
    specifications: [{ key: '', value: '' }],
    minOrder: 1,
    maxOrder: 1000,
    deliveryTime: '',
    warranty: ''
  });

  const [newTag, setNewTag] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const categories = [
    'إلكترونيات',
    'ملابس',
    'منزل وحديقة',
    'كتب',
    'صحة وجمال',
    'رياضة',
    'طعام ومشروبات',
    'ألعاب وهوايات',
    'سيارات',
    'مجوهرات وإكسسوارات'
  ];

  const handleInputChange = (field: keyof ProductForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addSpecification = () => {
    setForm(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const removeSpecification = (index: number) => {
    setForm(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    setForm(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      id: `PRD-${Date.now()}`,
      status: 'active',
      rating: 0,
      sales: 0,
      merchants: 0,
      createdAt: new Date().toISOString()
    });
    onClose();
    // إعادة تعيين النموذج
    setForm({
      name: '',
      category: '',
      price: 0,
      stock: 0,
      description: '',
      tags: [],
      images: [],
      specifications: [{ key: '', value: '' }],
      minOrder: 1,
      maxOrder: 1000,
      deliveryTime: '',
      warranty: ''
    });
    setCurrentStep(1);
  };

  if (!isOpen) return null;

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        <Box className="inline w-6 h-6 ml-2" />
        المعلومات الأساسية
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            اسم المنتج *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="أدخل اسم المنتج"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الفئة *
          </label>
          <select
            required
            value={form.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            title="اختر فئة المنتج"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">اختر الفئة</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            السعر (ريال) *
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الكمية المتوفرة *
          </label>
          <input
            type="number"
            required
            min="0"
            value={form.stock}
            onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          وصف المنتج *
        </label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="أدخل وصفاً مفصلاً للمنتج"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        التفاصيل والمواصفات
      </h3>

      {/* العلامات */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          العلامات (Tags)
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="أضف علامة جديدة"
          />
          <button
            type="button"
            onClick={addTag}
            title="إضافة علامة"
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                title={`حذف ${tag}`}
                className="hover:text-emerald-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* المواصفات */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            المواصفات
          </label>
          <button
            type="button"
            onClick={addSpecification}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            إضافة مواصفة
          </button>
        </div>
        <div className="space-y-3">
          {form.specifications.map((spec, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="text"
                value={spec.key}
                onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                title="اسم المواصفة"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="اسم المواصفة"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                title="قيمة المواصفة"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="القيمة"
              />
              {form.specifications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  title="حذف المواصفة"
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* تفاصيل الطلب */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الحد الأدنى للطلب
          </label>
          <input
            type="number"
            min="1"
            value={form.minOrder}
            onChange={(e) => handleInputChange('minOrder', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الحد الأقصى للطلب
          </label>
          <input
            type="number"
            min="1"
            value={form.maxOrder}
            onChange={(e) => handleInputChange('maxOrder', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            مدة التسليم
          </label>
          <input
            type="text"
            value={form.deliveryTime}
            onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="مثال: 2-3 أيام عمل"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            فترة الضمان
          </label>
          <input
            type="text"
            value={form.warranty}
            onChange={(e) => handleInputChange('warranty', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="مثال: سنة واحدة"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              إضافة منتج جديد
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              الخطوة {currentStep} من 2
            </p>
          </div>
          <button
            onClick={onClose}
            title="إغلاق"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center w-full max-w-md">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 1 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                currentStep >= 2 ? 'bg-emerald-500' : 'bg-gray-200'
              }`} />
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}

          {/* Actions */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-3 text-emerald-600 border border-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  السابق
                </button>
              )}
              
              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!form.name || !form.category || !form.price || !form.stock}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  التالي
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  إضافة المنتج
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AddProductModal;