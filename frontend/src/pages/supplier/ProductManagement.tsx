import { motion } from 'framer-motion';
import { Package, Plus, Edit, Trash2, Search, Filter, Star, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import AddProductModal from '../../components/supplier/AddProductModal';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  rating: number;
  status: 'active' | 'low_stock' | 'out_of_stock';
  image: string;
  lastUpdated: string;
}

function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [sortBy, setSortBy] = useState('name');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  const categories = ['الكل', 'إلكترونيات', 'ملابس', 'منزل وحديقة', 'كتب', 'صحة وجمال', 'رياضة'];

  const [products, setProducts] = useState<Product[]>([
    {
      id: 'PRD-001',
      name: 'هاتف ذكي Samsung Galaxy S24',
      category: 'إلكترونيات',
      price: 2500,
      stock: 45,
      sales: 156,
      rating: 4.8,
      status: 'active',
      image: '📱',
      lastUpdated: '2024-01-15'
    },
    {
      id: 'PRD-002',
      name: 'قميص قطني رجالي أنيق',
      category: 'ملابس',
      price: 85,
      stock: 8,
      sales: 89,
      rating: 4.6,
      status: 'low_stock',
      image: '👔',
      lastUpdated: '2024-01-14'
    },
    {
      id: 'PRD-003',
      name: 'طقم أواني طبخ مقاوم للحرارة',
      category: 'منزل وحديقة',
      price: 320,
      stock: 0,
      sales: 234,
      rating: 4.9,
      status: 'out_of_stock',
      image: '🍳',
      lastUpdated: '2024-01-13'
    },
    {
      id: 'PRD-004',
      name: 'كتاب تطوير الذات والنجاح',
      category: 'كتب',
      price: 45,
      stock: 120,
      sales: 67,
      rating: 4.7,
      status: 'active',
      image: '📚',
      lastUpdated: '2024-01-12'
    },
    {
      id: 'PRD-005',
      name: 'كريم مرطب للبشرة الجافة',
      category: 'صحة وجمال',
      price: 95,
      stock: 23,
      sales: 145,
      rating: 4.5,
      status: 'active',
      image: '🧴',
      lastUpdated: '2024-01-11'
    },
    {
      id: 'PRD-006',
      name: 'حذاء رياضي للجري والتمارين',
      category: 'رياضة',
      price: 180,
      stock: 5,
      sales: 78,
      rating: 4.4,
      status: 'low_stock',
      image: '👟',
      lastUpdated: '2024-01-10'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'متوفر';
      case 'low_stock':
        return 'مخزون منخفض';
      case 'out_of_stock':
        return 'نفد المخزون';
      default:
        return 'غير محدد';
    }
  };

  const handleAddProduct = (newProduct: any) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setProductToDelete(product);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setProductToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setProductToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-center lg:text-right mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              📦 إدارة المنتجات
            </h1>
            <p className="text-lg text-gray-600">
              تحكم كامل في منتجاتك ومخزونك مع إحصائيات تفصيلية
            </p>
          </div>

          {/* شريط الأدوات */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              {/* البحث والفلترة */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ابحث عن منتج..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    title="اختر الفئة"
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    title="ترتيب حسب"
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="name">الاسم</option>
                    <option value="price">السعر</option>
                    <option value="stock">المخزون</option>
                    <option value="sales">المبيعات</option>
                  </select>
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  إضافة منتج جديد
                </button>
                <button className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  المزيد من الفلاتر
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-600">
                {products.length}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">إجمالي المنتجات</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                {products.filter(p => p.status === 'active').length}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">منتجات متوفرة</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">
                {products.filter(p => p.status === 'low_stock').length}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">مخزون منخفض</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingDown className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold text-red-600">
                {products.filter(p => p.status === 'out_of_stock').length}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">نفد المخزون</h3>
          </motion.div>
        </div>

        {/* قائمة المنتجات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              📋 قائمة المنتجات ({filteredProducts.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">المنتج</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">الفئة</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">السعر</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">المخزون</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">المبيعات</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">التقييم</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">الحالة</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{product.image}</div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {product.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 rounded-full text-sm font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {product.price} ريال
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${
                        product.stock > 20 ? 'text-green-600' : 
                        product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-emerald-600">
                        {product.sales}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {product.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          title="تعديل المنتج"
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          title="حذف المنتج"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                لا توجد منتجات
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                لم يتم العثور على منتجات تطابق معايير البحث المحددة
              </p>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProduct}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDeleteProduct}
        itemName={productToDelete?.name}
        title="حذف المنتج"
        message="هل أنت متأكد من رغبتك في حذف هذا المنتج؟"
      />
    </div>
  );
}

export default ProductManagement;