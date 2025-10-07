import { useState, useEffect } from 'react';
import { Search, Package, Grid, List, Star, DollarSign, MapPin, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { storage } from '../utils/localStorage';
import type { MarketItem, ShippingService } from '../utils/localStorage';
import { useAuth } from '../contexts/AuthContext';

const SimpleMarketplace = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [shippingServices, setShippingServices] = useState<ShippingService[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const items = storage.getMarketItems();
    const services = storage.getShippingServices();
    
    setMarketItems(items);
    setShippingServices(services);
  }, []);

  // فلترة بسيطة للمنتجات
  const filteredProducts = marketItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // فلترة بسيطة للخدمات
  const filteredServices = shippingServices.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* هيدر بسيط */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Package className="w-4 h-4" />
              السوق التقليدي
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              عرض المنتجات والخدمات
            </h1>
            <p className="text-gray-600">
              تصفح بسيط للمنتجات والخدمات المتاحة
            </p>
          </div>

          {/* التبويبات البسيطة */}
          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'products'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              المنتجات ({filteredProducts.length})
            </button>
            
            <button
              onClick={() => setActiveTab('services')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'services'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              خدمات الشحن ({filteredServices.length})
            </button>
          </div>

          {/* البحث البسيط */}
          <div className="flex gap-4 items-center justify-center">
            <div className="relative max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="ابحث هنا..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title={viewMode === 'grid' ? 'عرض قائمة' : 'عرض شبكة'}
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'products' && (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              المنتجات المتاحة ({filteredProducts.length})
            </h2>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد منتجات متاحة حالياً</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                  >
                    {/* صورة المنتج */}
                    <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 rounded-t-lg flex items-center justify-center">
                      <div className="text-white text-4xl">
                        {item.type === 'product' ? '📦' : '🛠️'}
                      </div>
                    </div>
                    
                    {/* معلومات المنتج */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-bold text-green-600">
                            {item.price} ريال
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">
                            {'جديد'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{'غير محدد'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              خدمات الشحن ({filteredServices.length})
            </h2>
            
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد خدمات شحن متاحة حالياً</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 text-gray-800">
                          {service.name}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {service.description}
                        </p>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-bold text-green-600">
                              {service.pricePerKg} ريال/كيلو
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">
                              {'جديد'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-3xl mb-2"><Truck className="w-8 h-8 text-gray-400" /></div>
                        <div className="text-sm text-gray-500">
                          {'-'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleMarketplace;