import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AddProductModal from '../components/AddProductModal';
import { storage } from '../utils/localStorage';
import { useAuth } from '../contexts/AuthContext';
import type { Product } from '../utils/localStorage';

const ProductsPage = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // products backed by local storage
  const [products, setProducts] = useState<Product[]>(() => {
    try { return storage.getProducts(); } catch (e) { return []; }
  });

  // current auth (provider info) - call at top-level
  const auth = useAuth();

  useEffect(() => {
    const onProductsUpdated = () => {
      try {
        const latest = storage.getProducts();
        console.debug('[ProductsPage] products-updated received, reloading products, count=', latest.length);
        setProducts(latest);
      } catch (e) {
        console.error('[ProductsPage] error reading products on update', e);
      }
    };

    window.addEventListener('products-updated', onProductsUpdated as EventListener);
    window.addEventListener('storage', onProductsUpdated as EventListener);

    return () => {
      window.removeEventListener('products-updated', onProductsUpdated as EventListener);
      window.removeEventListener('storage', onProductsUpdated as EventListener);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'low-stock':
        return 'كمية منخفضة';
      case 'out-of-stock':
        return 'نفد المخزون';
      case 'draft':
        return 'مسودة';
      default:
        return 'غير محدد';
    }
  };

  // دالة معالجة إضافة منتج
  const handleAddProduct = (productData: any) => {
    try {
      console.log('تم إضافة منتج جديد:', productData);
      const saved = storage.addProduct({
        name: productData.name,
        price: Number(productData.price) || 0,
        stock: Number(productData.stock) || 0,
        category: productData.category,
        description: productData.description,
        images: productData.images || [],
        sku: productData.sku || '',
        weight: productData.weight || '',
        dimensions: productData.dimensions || '',
        status: productData.status || 'active'
      });

      // publish to marketplace
      const user = auth?.user;
      storage.addMarketItem({
        name: saved.name,
        price: saved.price,
        stock: saved.stock,
        category: saved.category,
        description: saved.description,
        images: saved.images || [],
        sku: saved.sku || '',
        weight: saved.weight || '',
        dimensions: saved.dimensions || '',
        status: saved.status,
        type: 'product',
        provider: {
          id: user?.id || 'unknown_provider',
          name: user?.companyName || user?.name || 'مزود غير معروف',
          type: user?.role === 'shipping_company' ? 'shipping_company' : (user?.role === 'supplier' ? 'supplier' : 'merchant')
        }
      });

      // update local UI state immediately
      setProducts(storage.getProducts());
    } catch (err) {
      console.error('خطأ عند حفظ المنتج:', err);
    } finally {
      setShowAddProductModal(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesFilter = filter === 'all' || product.status === filter;
    const matchesSearch = product.id.includes(searchTerm) || 
                          product.name.includes(searchTerm) || 
                          product.category.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة المنتجات</h1>
              <p className="text-gray-600">إضافة وتعديل وحذف المنتجات في متجرك</p>
            </div>
            <button 
              onClick={() => setShowAddProductModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              إضافة منتج جديد
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="البحث برقم المنتج، الاسم، أو الفئة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'active' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                نشط
              </button>
              <button
                onClick={() => setFilter('low-stock')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'low-stock' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                كمية منخفضة
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المنتج
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الفئة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    السعر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المخزون
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المبيعات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-lg">📦</span>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {('sales' in product) ? (product as any).sales : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.status)}`}>
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        تعديل
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        عرض
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد منتجات</h3>
              <p className="text-gray-500">لا توجد منتجات تطابق معايير البحث الخاصة بك</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="mr-4">
                <div className="text-2xl font-bold text-gray-800">42</div>
                <div className="text-gray-600">إجمالي المنتجات</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="mr-4">
                <div className="text-2xl font-bold text-gray-800">38</div>
                <div className="text-gray-600">منتجات نشطة</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="mr-4">
                <div className="text-2xl font-bold text-gray-800">4</div>
                <div className="text-gray-600">كمية منخفضة</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* نافذة إضافة المنتج */}
      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onAdd={handleAddProduct}
      />
    </div>
  );
};

export default ProductsPage;