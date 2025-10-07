import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  X, Tag, Image, Save, AlertCircle,
  Upload, Palette, FileText
} from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (categoryData: CategoryData) => void;
}

interface CategoryData {
  name: string;
  description: string;
  parentCategory: string;
  icon: string;
  color: string;
  image: File | null;
  isActive: boolean;
  sortOrder: number;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
}

const predefinedIcons = [
  '📱', '💻', '🖥️', '⌚', '🎧', '📷', '🖨️', '⌨️',
  '👕', '👔', '👗', '👠', '👜', '🧥', '👖', '🩳',
  '🏠', '🛏️', '🪑', '🍽️', '🧺', '🕯️', '🖼️', '🧸',
  '💄', '🧴', '🧼', '🪒', '💊', '🩺', '🧽', '🪥',
  '⚽', '🏀', '🎾', '🏓', '🏋️', '🚴', '🏊', '🎯',
  '🎮', '🧩', '🎲', '🃏', '🎪', '🎨', '🎭', '🎪',
  '📚', '📖', '✏️', '🖍️', '📝', '📐', '🔍', '📊',
  '🍎', '🥖', '🧀', '🥛', '☕', '🍰', '🍫', '🍯',
  '🚗', '🏍️', '🚲', '⛽', '🔧', '🛞', '🔋', '🛠️'
];

const colorOptions = [
  { name: 'أزرق', value: '#3B82F6', bg: 'bg-blue-500' },
  { name: 'أخضر', value: '#10B981', bg: 'bg-emerald-500' },
  { name: 'بنفسجي', value: '#8B5CF6', bg: 'bg-violet-500' },
  { name: 'وردي', value: '#EC4899', bg: 'bg-pink-500' },
  { name: 'برتقالي', value: '#F59E0B', bg: 'bg-amber-500' },
  { name: 'أحمر', value: '#EF4444', bg: 'bg-red-500' },
  { name: 'رمادي', value: '#6B7280', bg: 'bg-gray-500' },
  { name: 'أسود', value: '#1F2937', bg: 'bg-gray-800' }
];

const mainCategories = [
  'إلكترونيات',
  'ملابس وأزياء',
  'منزل ومطبخ',
  'صحة وجمال',
  'رياضة ولياقة',
  'ألعاب وترفيه',
  'كتب وقرطاسية',
  'طعام ومشروبات',
  'سيارات ومركبات',
  'أدوات ومعدات'
];

function AddCategoryModal({ isOpen, onClose, onSubmit }: AddCategoryModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [categoryData, setCategoryData] = useState<CategoryData>({
    name: '',
    description: '',
    parentCategory: '',
    icon: '📦',
    color: '#3B82F6',
    image: null,
    isActive: true,
    sortOrder: 0,
    metaTitle: '',
    metaDescription: '',
    tags: []
  });

  const [newTag, setNewTag] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!categoryData.name.trim()) newErrors.name = 'اسم الفئة مطلوب';
    if (!categoryData.description.trim()) newErrors.description = 'وصف الفئة مطلوب';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(categoryData);
      onClose();
      setCategoryData({
        name: '',
        description: '',
        parentCategory: '',
        icon: '📦',
        color: '#3B82F6',
        image: null,
        isActive: true,
        sortOrder: 0,
        metaTitle: '',
        metaDescription: '',
        tags: []
      });
      setNewTag('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryData(prev => ({ ...prev, image: file }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !categoryData.tags.includes(newTag.trim())) {
      setCategoryData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCategoryData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">إضافة فئة منتجات جديدة</h2>
                  <p className="text-purple-100">أنشئ فئة جديدة لتنظيم منتجاتك</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[75vh]">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  المعلومات الأساسية
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      اسم الفئة *
                    </label>
                    <input
                      type="text"
                      value={categoryData.name}
                      onChange={(e) => setCategoryData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="مثال: هواتف ذكية"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الفئة الرئيسية
                    </label>
                    <select
                      value={categoryData.parentCategory}
                      onChange={(e) => setCategoryData(prev => ({ ...prev, parentCategory: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    >
                      <option value="">فئة رئيسية</option>
                      {mainCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      وصف الفئة *
                    </label>
                    <textarea
                      value={categoryData.description}
                      onChange={(e) => setCategoryData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="اكتب وصفاً مفصلاً عن الفئة..."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Visual Settings */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-pink-600" />
                  التصميم والمظهر
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Icon Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      اختيار الأيقونة
                    </label>
                    <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {predefinedIcons.map((icon, index) => (
                        <button
                          key={index}
                          onClick={() => setCategoryData(prev => ({ ...prev, icon }))}
                          className={`w-10 h-10 rounded-lg text-xl hover:bg-gray-100 transition-colors ${
                            categoryData.icon === icon 
                              ? 'bg-purple-100 border-2 border-purple-500' 
                              : 'border border-gray-200'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-sm text-gray-600">المحدد: </span>
                      <span className="text-2xl">{categoryData.icon}</span>
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      اختيار اللون
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setCategoryData(prev => ({ ...prev, color: color.value }))}
                          className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                            categoryData.color === color.value
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full ${color.bg}`}></div>
                          <span className="text-sm font-medium">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      صورة الفئة
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="category-image-upload"
                      />
                      <label htmlFor="category-image-upload" className="cursor-pointer">
                        {categoryData.image ? (
                          <div className="space-y-2">
                            <img
                              src={URL.createObjectURL(categoryData.image)}
                              alt="معاينة الصورة"
                              className="w-32 h-32 object-cover rounded-lg mx-auto"
                            />
                            <p className="text-sm text-gray-600">{categoryData.image.name}</p>
                            <p className="text-xs text-purple-600">اضغط لتغيير الصورة</p>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">اضغط لرفع صورة الفئة</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG حتى 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Settings */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">إعدادات إضافية</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ترتيب العرض
                    </label>
                    <input
                      type="number"
                      value={categoryData.sortOrder}
                      onChange={(e) => setCategoryData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="0"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">الرقم الأقل يظهر أولاً</p>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categoryData.isActive}
                        onChange={(e) => setCategoryData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="sr-only"
                      />
                      <div className={`relative w-12 h-6 rounded-full transition-colors ${
                        categoryData.isActive ? 'bg-purple-600' : 'bg-gray-300'
                      }`}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          categoryData.isActive ? 'translate-x-6' : 'translate-x-0'
                        }`}></div>
                      </div>
                      <span className="mr-3 text-sm font-medium text-gray-700">
                        فئة نشطة
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      عنوان SEO
                    </label>
                    <input
                      type="text"
                      value={categoryData.metaTitle}
                      onChange={(e) => setCategoryData(prev => ({ ...prev, metaTitle: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="عنوان لمحركات البحث"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      وصف SEO
                    </label>
                    <input
                      type="text"
                      value={categoryData.metaDescription}
                      onChange={(e) => setCategoryData(prev => ({ ...prev, metaDescription: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="وصف لمحركات البحث"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  العلامات (Tags)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {categoryData.tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-purple-500 hover:text-purple-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="اكتب علامة واضغط Enter"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    إضافة
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">معاينة الفئة</h3>
                <div 
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                  style={{ borderColor: categoryData.color }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: categoryData.color + '20', color: categoryData.color }}
                    >
                      {categoryData.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{categoryData.name || 'اسم الفئة'}</h4>
                      <p className="text-sm text-gray-600">{categoryData.description || 'وصف الفئة'}</p>
                    </div>
                  </div>
                  {categoryData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {categoryData.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      {categoryData.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{categoryData.tags.length - 3} أخرى
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 flex justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              حفظ الفئة
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AddCategoryModal;