import { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, MessageSquare, Star, CheckCircle, Truck, Package, Clipboard, Send, Heart, Eye, TrendingUp, Award, Users, Clock, ArrowRight, Zap, Shield, Gift, ChevronDown, MapPin, Calendar, DollarSign, Plus, Grid, List, SortAsc, SortDesc, Target, Briefcase, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '../utils/localStorage';
import type { MarketItem, MerchantOrder, ShippingService } from '../utils/localStorage';
import { useAuth } from '../contexts/AuthContext';
import { marketplaceManager } from '../utils/marketplaceManager';
import type { SupplierOffer, MerchantRequest, ShippingServiceOffer, MarketplaceFilters } from '../types/marketplace';
import toast from 'react-hot-toast';

const Marketplace = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [sortBy, setSortBy] = useState('recent');
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'services'>('products');
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [merchantOrders, setMerchantOrders] = useState<MerchantOrder[]>([]);
  const [shippingServices, setShippingServices] = useState<ShippingService[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    // Load all marketplace data
    const items = storage.getMarketItems();
    const orders = storage.getMerchantOrders();
    const services = storage.getShippingServices();
    
    setMarketItems(items);
    setMerchantOrders(orders);
    setShippingServices(services);

    const onMarketUpdated = () => {
      setMarketItems(storage.getMarketItems());
      setMerchantOrders(storage.getMerchantOrders());
      setShippingServices(storage.getShippingServices());
    };

    // custom event for same-window updates
    window.addEventListener('market-updated', onMarketUpdated as EventListener);
    // storage event for cross-tab updates
    window.addEventListener('storage', onMarketUpdated as EventListener);

    return () => {
      window.removeEventListener('market-updated', onMarketUpdated as EventListener);
      window.removeEventListener('storage', onMarketUpdated as EventListener);
    };
  }, []);

  // Determine which tabs should be visible based on user role
  const getVisibleTabs = () => {
    // Shipping companies can only see services
    if (user?.role === 'shipping_company') {
      return ['services'];
    }
    // Suppliers and merchants can see all tabs
    return ['products', 'orders', 'services'];
  };

  // Set initial active tab based on user role
  useEffect(() => {
    const visibleTabs = getVisibleTabs();
    if (!visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0] as any);
    }
  }, [activeTab, user]);

  // Get all unique categories from all item types
  const getAllCategories = () => {
    const allCategories = Array.from(new Set([
      ...marketItems.map(i => i.category),
      ...merchantOrders.map(o => o.category),
      ...shippingServices.map(s => s.category || 'خدمة شحن')
    ])).filter(Boolean) as string[];
    
    return ['الكل', ...allCategories];
  };

  // Get item type for better categorization
  const getItemTypeLabel = (item: any, tab: string) => {
    if (tab === 'products') {
      return (item as MarketItem).type === 'product' ? 'منتج' : 
             (item as MarketItem).type === 'service' ? 'خدمة' : 'عرض خاص';
    } else if (tab === 'orders') {
      return 'طلب تجاري';
    } else {
      return 'خدمة شحن';
    }
  };

  // Get item type icon
  const getItemTypeIcon = (item: any, tab: string) => {
    // Return a Lucide icon component instead of emoji for a cleaner, consistent look
    if (tab === 'products') {
      if ((item as MarketItem).type === 'product') return <Package className="w-10 h-10 sm:w-16 sm:h-16" />;
      if ((item as MarketItem).type === 'service') return <Briefcase className="w-10 h-10 sm:w-16 sm:h-16" />;
      return <Gift className="w-10 h-10 sm:w-16 sm:h-16" />;
    } else if (tab === 'orders') {
      return <Clipboard className="w-8 h-8 sm:w-10 sm:h-10" />;
    } else {
      return <Truck className="w-10 h-10 sm:w-16 sm:h-16" />;
    }
  };

  const getFilteredItems = () => {
    if (activeTab === 'products') {
      return marketItems
        .filter(item => {
          const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCategory = selectedCategory === 'الكل' || item.category === selectedCategory;
          return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case 'price-low':
              return a.price - b.price;
            case 'price-high':
              return b.price - a.price;
            case 'rating':
              return (b.provider.rating || 0) - (a.provider.rating || 0);
            default:
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
        });
    } else if (activeTab === 'orders') {
      return merchantOrders
        .filter(order => {
          const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCategory = selectedCategory === 'الكل' || order.category === selectedCategory;
          // Only show open orders
          return matchesSearch && matchesCategory && order.status === 'open';
        })
        .sort((a, b) => {
          switch (sortBy) {
            case 'price-low':
              return a.budget - b.budget;
            case 'price-high':
              return b.budget - a.budget;
            case 'rating':
              return (b.merchant.rating || 0) - (a.merchant.rating || 0);
            default:
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
        });
    } else {
      return shippingServices
        .filter(service => {
          const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCategory = selectedCategory === 'الكل' || service.category === selectedCategory;
          return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case 'price-low':
              return a.pricePerKg - b.pricePerKg;
            case 'price-high':
              return b.pricePerKg - a.pricePerKg;
            case 'rating':
              return (b.rating || 0) - (a.rating || 0);
            default:
              return (b.rating || 0) - (a.rating || 0);
          }
        });
    }
  };

  const filteredItems = getFilteredItems();

  const getUserTypeIcon = (type: 'merchant' | 'supplier' | 'shipping_company') => {
    switch (type) {
      case 'merchant': return '🏪';
      case 'supplier': return '🏭';
      case 'shipping_company': return '🚛';
      default: return '👤';
    }
  };

  const getUserTypeLabel = (type: 'merchant' | 'supplier' | 'shipping_company') => {
    switch (type) {
      case 'merchant': return 'تاجر';
      case 'supplier': return 'مورد';
      case 'shipping_company': return 'شركة شحن';
      default: return 'مستخدم';
    }
  };

  const handleContactProvider = (item: any) => {
    // Dispatch event to open chat with the provider
    const resolvedType = item.provider?.type || item.merchant?.type || (activeTab === 'products' ? 'supplier' : activeTab === 'orders' ? 'merchant' : 'shipping_company');
    const providerInfo = {
      id: item.provider?.id || item.merchant?.id || item.id,
      name: item.provider?.name || item.merchant?.name || item.name,
      type: resolvedType,
      itemName: item.name,
      item: { id: item.id, name: item.name },
      contact: item.provider?.contact || item.contact || undefined
    };

    // Create a custom event with provider + item context
    const chatEvent = new CustomEvent('open-chat-with-contact', {
      detail: {
        contact: providerInfo
      }
    });

    // Dispatch the event to open chat
    window.dispatchEvent(chatEvent);
  };

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  const renderProductItem = (item: MarketItem, index: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ y: -5, scale: 1.01 }}
      className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20"
    >
      {/* Product Image with Overlay Effects */}
      <div className="relative h-40 sm:h-56 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
        <div className="relative h-full flex items-center justify-center">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="text-white text-4xl sm:text-6xl drop-shadow-lg"
          >
            {item.type === 'product' ? '📦' : item.type === 'service' ? '🛠️' : '🎁'}
          </motion.div>
        </div>
        
        {/* Floating Action Buttons */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-1 sm:gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleFavorite(item.id)}
            className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm transition-all ${
              favorites.has(item.id) 
                ? 'bg-red-500 text-white' 
                : 'bg-white/20 text-white hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 sm:p-2 rounded-full bg-white/20 text-white hover:bg-blue-500 hover:text-white backdrop-blur-sm transition-all"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.button>
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
          <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
            item.type === 'product' 
              ? 'bg-blue-500 text-white' 
              : item.type === 'service' 
                ? 'bg-amber-500 text-white' 
                : 'bg-purple-500 text-white'
          }`}>
            {item.type === 'product' ? 'منتج' : item.type === 'service' ? 'خدمة' : 'عرض خاص'}
          </span>
        </div>

        {/* Discount Badge */}
        {item.price > 1000 && (
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
            <span className="bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg text-xs font-bold">
              خصم 15%
            </span>
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-6">
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <h3 className="text-base sm:text-xl font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-1">
            {item.name}
          </h3>
          <div className="text-right">
            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {item.price.toLocaleString()}
            </span>
            <div className="text-xs sm:text-sm text-gray-500">ريال</div>
          </div>
        </div>
        
        <p className="text-xs sm:text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
        
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium border border-blue-200">
            {item.category}
          </span>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              <span className="text-xs sm:text-sm text-green-600 font-medium hidden sm:block">رائج</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500">المخزون: {item.stock}</span>
          </div>
        </div>
        
        {/* Provider Info Enhanced */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-primary via-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm sm:text-lg shadow-lg"
              >
                {getUserTypeIcon(item.provider.type)}
              </motion.div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-800 text-sm sm:text-base">{item.provider.name}</span>
                  {item.provider.verified && (
                    <div className="flex items-center gap-1 bg-green-100 px-1 py-0.5 sm:px-2 sm:py-1 rounded-full">
                      <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 text-green-600" />
                      <span className="text-xs text-green-700 font-medium hidden sm:block">موثق</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{item.provider.rating || '4.8'}</span>
                  </div>
                  <div className="flex items-center gap-1 hidden sm:flex">
                    <Users className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">+200 عميل</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center hidden sm:block">
              <span className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-2 py-1 rounded-full font-medium border border-blue-200">
                {getUserTypeLabel(item.provider.type)}
              </span>
              <div className="flex items-center gap-1 mt-1 justify-center">
                <Clock className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600">متاح الآن</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Actions */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex gap-1 sm:gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleContactProvider(item)}
              className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium text-xs sm:text-sm"
            >
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">تواصل مباشر</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-medium text-xs sm:text-sm"
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:block">طلب سريع</span>
              <span className="sm:hidden">طلب</span>
            </motion.button>
          </div>
          
          <div className="flex items-center justify-between text-xs bg-gray-50 rounded-lg p-2 hidden sm:flex">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-green-500" />
              <span>ضمان الجودة</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3 text-blue-500" />
              <span>شحن مجاني +500 ريال</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span>توصيل سريع</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderOrderItem = (order: MerchantOrder, index: number) => (
    <motion.div
      key={order.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
    >
      <div className="p-3 sm:p-6">
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <h3 className="text-base sm:text-xl font-bold text-gray-800">{order.title}</h3>
          <div className="text-right">
            <span className="text-base sm:text-lg font-bold text-green-600">{order.budget.toLocaleString()} ريال</span>
            <div className="text-xs sm:text-sm text-gray-500">الميزانية</div>
          </div>
        </div>
        
        <p className="text-xs sm:text-gray-600 mb-3 sm:mb-4 line-clamp-2">{order.description}</p>
        
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="px-2 py-1 sm:px-3 sm:py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm">
            {order.category}
          </span>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="truncate">حتى: {new Date(order.deadline).toLocaleDateString('ar-SA')}</span>
          </div>
        </div>
        
        {/* Merchant Info */}
        <div className="border-t border-gray-100 pt-3 sm:pt-4 mb-3 sm:mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm">
                {getUserTypeIcon('merchant')}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-800 text-sm sm:text-base">{order.merchant.name}</span>
                  {order.merchant.verified && (
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                  <span className="text-xs sm:text-sm text-gray-600">{order.merchant.rating || 'لا تقييم'}</span>
                </div>
              </div>
            </div>
            <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs rounded ${
              order.status === 'open' 
                ? 'bg-green-100 text-green-800' 
                : order.status === 'in_progress' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-gray-100 text-gray-800'
            }`}>
              {order.status === 'open' ? 'مفتوح' : order.status === 'in_progress' ? 'قيد التنفيذ' : 'مغلق'}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-1 sm:gap-3">
          <button
            onClick={() => handleContactProvider(order)}
            className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-green-600 text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
          >
            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>تقديم عرض</span>
          </button>
          <button className="flex items-center justify-center gap-1 sm:gap-2 bg-gray-100 text-gray-700 py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:block">تفاصيل</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderServiceItem = (service: ShippingService, index: number) => (
    <motion.div
      key={service.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
    >
      <div className="p-3 sm:p-6">
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <h3 className="text-base sm:text-xl font-bold text-gray-800">{service.name}</h3>
          <div className="text-right">
            <span className="text-base sm:text-lg font-bold text-amber-600">{service.pricePerKg} ريال/كغ</span>
            <div className="text-xs sm:text-sm text-gray-500">السعر</div>
          </div>
        </div>
        
        <p className="text-xs sm:text-gray-600 mb-3 sm:mb-4 line-clamp-3">{service.description}</p>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            <span className="text-xs sm:text-sm text-gray-600">{service.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
            <span className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-none">{service.coverage}</span>
          </div>
        </div>
        
        {/* Provider Info */}
        <div className="border-t border-gray-100 pt-3 sm:pt-4 mb-3 sm:mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm">
                {getUserTypeIcon('shipping_company')}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-800 text-sm sm:text-base">{service.provider.name}</span>
                  {service.verified && (
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                  <span className="text-xs sm:text-sm text-gray-600">{service.rating || 'لا تقييم'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-1 sm:gap-3">
          <button
            onClick={() => handleContactProvider(service)}
            className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-amber-600 text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg hover:bg-amber-700 transition-colors text-xs sm:text-sm"
          >
            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>تواصل</span>
          </button>
          <button className="flex items-center justify-center gap-1 sm:gap-2 bg-gray-100 text-gray-700 py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:block">تفاصيل</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderItems = () => {
    if (filteredItems.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-12 text-center col-span-full"
        >
          <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">لا توجد عناصر</h3>
          <p className="text-sm sm:text-gray-600">جرب تعديل معايير البحث أو تصفح فئات مختلفة</p>
        </motion.div>
      );
    }

    return filteredItems.map((item, index) => {
      if (activeTab === 'products') {
        return renderProductItem(item as MarketItem, index);
      } else if (activeTab === 'orders') {
        return renderOrderItem(item as MerchantOrder, index);
      } else {
        return renderServiceItem(item as ShippingService, index);
      }
    });
  };

  // Get visible tabs based on user role
  const visibleTabs = getVisibleTabs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 py-4 sm:py-8">
      <div className="container mx-auto px-2 sm:px-4">
        {/* قسم دعائي لجذب الاشتراك */}
        <section className="mb-6 sm:mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="bg-gradient-to-r from-primary/80 via-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-lg sm:shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8 mb-4 sm:mb-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-2 sm:mb-3">شبكة الشركاء المعتمدين</h1>
              <p className="text-sm sm:text-lg text-white/90 mb-3 sm:mb-4">منصة حصرية للتجار والموردين وشركات الشحن المرخصة، تضمن أعلى معايير الجودة والمصداقية في بيئة أعمال آمنة.</p>
              <ul className="text-white/90 space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                <li className="flex items-center gap-1 sm:gap-2"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" /> شركاء معتمدون ومرخصون فقط</li>
                <li className="flex items-center gap-1 sm:gap-2"><Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" /> ضمان الجودة والمصداقية</li>
                <li className="flex items-center gap-1 sm:gap-2"><Gift className="w-4 h-4 sm:w-5 sm:h-5 text-pink-200" /> بيئة تجارية آمنة ومحمية</li>
              </ul>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="bg-white text-primary font-bold px-4 py-2 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg text-sm sm:text-lg hover:bg-primary hover:text-white transition-all">
                تقدم للانضمام كشريك معتمد
              </motion.button>
            </div>
            <div className="flex flex-col items-center gap-3 sm:gap-6">
              <div className="flex gap-3 sm:gap-6">
                <div className="bg-white/20 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-4 text-center">
                  <div className="text-xl sm:text-3xl font-bold text-white">+{marketItems.length}</div>
                  <div className="text-xs sm:text-sm text-white/80">منتج متاح</div>
                </div>
                <div className="bg-white/20 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-4 text-center">
                  <div className="text-xl sm:text-3xl font-bold text-white">+{merchantOrders.filter(o => o.status === 'open').length}</div>
                  <div className="text-xs sm:text-sm text-white/80">طلب نشط</div>
                </div>
                <div className="bg-white/20 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-4 text-center">
                  <div className="text-xl sm:text-3xl font-bold text-white">+{shippingServices.length}</div>
                  <div className="text-xs sm:text-sm text-white/80">خدمة شحن</div>
                </div>
              </div>
              <div className="mt-2 sm:mt-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-1 sm:gap-2">
                  <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-300" />
                  <span className="text-white font-bold text-sm sm:text-lg">تقييم المنصة 4.9/5</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
          {/* شريط العروض الحصرية */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md py-2 sm:py-3 px-4 sm:px-6 flex items-center gap-3 sm:gap-6 overflow-x-auto mb-4 sm:mb-6">
            <Gift className="w-4 h-4 sm:w-6 sm:h-6 text-pink-500" />
            <span className="font-bold text-primary text-sm sm:text-base">عروض حصرية اليوم:</span>
            {marketItems.slice(0, 3).map(item => (
              <span key={item.id} className="bg-gradient-to-r from-blue-100 to-purple-100 text-primary px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm whitespace-nowrap">{item.name}</span>
            ))}
          </motion.div>
        </section>
        {/* نهاية القسم الدعائي */}

  {/* Top Navigation Menu (sticky) */}
  <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg mb-4 sm:mb-6 overflow-hidden sticky top-4 z-20">
          {/* Category Filter - Moved above search bar */}
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap gap-1 sm:gap-2 p-2 sm:p-4">
              {getAllCategories().map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Sort Section */}
          <div className="flex flex-wrap items-center justify-between p-2 sm:p-4 gap-2 sm:gap-4">
            {/* Search Bar */}
            <div className="flex-1 min-w-[150px] sm:min-w-[200px] relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن منتج، طلب أو خدمة..."
                className="pl-7 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 w-full rounded-lg sm:rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                title="بحث في السوق"
              />
            </div>

            {/* Sort Options */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm font-medium appearance-none pr-6 sm:pr-8"
                title="ترتيب النتائج"
              >
                <option value="recent">الأحدث</option>
                <option value="price-low">الأقل سعراً</option>
                <option value="price-high">الأعلى سعراً</option>
                <option value="rating">الأعلى تقييماً</option>
              </select>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 absolute left-1.5 sm:left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => setViewMode('grid')}
                aria-label="عرض شبكي"
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                aria-label="عرض قائمة"
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation with counts */}
          <div className="border-t border-gray-200">
            <div className="flex flex-wrap gap-1 sm:gap-2 p-2 sm:p-4">
              {visibleTabs.map(tab => {
                let count = 0;
                let label = '';
                
                switch (tab) {
                  case 'products':
                    count = marketItems.length;
                    label = 'منتجات';
                    break;
                  case 'orders':
                    count = merchantOrders.filter(o => o.status === 'open').length;
                    label = 'طلبات';
                    break;
                  case 'services':
                    count = shippingServices.length;
                    label = 'شحن';
                    break;
                }
                
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                      activeTab === tab 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    title={label}
                  >
                    <span className="truncate max-w-[60px] sm:max-w-none">{label}</span>
                    <span className="bg-white/20 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Items Grid/List */}
        <main>
          <AnimatePresence>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {renderItems()}
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:gap-4">
                {renderItems()}
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default Marketplace;
