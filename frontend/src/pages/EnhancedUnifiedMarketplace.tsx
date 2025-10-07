import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ShoppingCart, Star, Heart, Eye, TrendingUp, Package, Truck, Store, Plus, Grid, List, Crown, Sparkles, CheckCircle, ArrowRight, BadgeCheck, UserCheck, MessageCircle, ThumbsUp, MessageSquare, ShieldCheck as Verified } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { marketplaceManager } from '../utils/marketplaceManager';
import { storage } from '../utils/localStorage';
import type { SupplierOffer, MerchantRequest, ShippingServiceOffer, MarketplaceFilters } from '../types/marketplace';
import type { MarketItem, MerchantOrder, ShippingService } from '../utils/localStorage';
import toast from 'react-hot-toast';

const EnhancedUnifiedMarketplace = () => {
  const { user } = useAuth();
  
  // حالة التحكم الأساسية
  const [searchQuery, setSearchQuery] = useState('');
  const [mainTab, setMainTab] = useState<'all' | 'exhibitions'>('all');
  const [activeTab, setActiveTab] = useState<'supplier_offers' | 'merchant_requests' | 'shipping_services' | 'shipping_requests' | 'exhibitions'>('supplier_offers');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'price' | 'rating' | 'popularity'>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  
  // البيانات الذكية الحديثة
  const [supplierOffers, setSupplierOffers] = useState<SupplierOffer[]>([]);
  const [merchantRequests, setMerchantRequests] = useState<MerchantRequest[]>([]);
  const [shippingServices, setShippingServices] = useState<ShippingServiceOffer[]>([]);
  
  // البيانات التقليدية للتوافق
  const [traditionalOrders, setTraditionalOrders] = useState<MerchantOrder[]>([]);
  const [traditionalShipping, setTraditionalShipping] = useState<ShippingService[]>([]);
  
  // البيانات التفاعلية
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<any | null>(null);
  const [marketStats, setMarketStats] = useState<any>({});
  
  // حالة النوافذ المنبثقة
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showItemDetails, setShowItemDetails] = useState(false);

  // تحميل البيانات عند التهيئة
  useEffect(() => {
    loadAllData();
    loadRecommendations();
    loadExhibitions();
    loadMarketStats();
    loadFavorites();
    
    const handleMarketUpdate = () => {
      loadAllData();
      loadRecommendations();
      loadMarketStats();
    };
    
    const handleExhibitionUpdate = () => {
      loadExhibitions();
    };
    
    // إغلاق القوائم المنسدلة عند النقر خارجها
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.category-menu-container')) {
        setShowCategoryMenu(false);
      }
    };
    
    window.addEventListener('marketplace-updated', handleMarketUpdate);
    window.addEventListener('market-updated', handleMarketUpdate);
    window.addEventListener('exhibition-updated', handleExhibitionUpdate);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('marketplace-updated', handleMarketUpdate);
      window.removeEventListener('market-updated', handleMarketUpdate);
      window.removeEventListener('exhibition-updated', handleExhibitionUpdate);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [user, filters]);

  // تحميل جميع البيانات
  const loadAllData = () => {
    // البيانات الذكية الحديثة
    setSupplierOffers(marketplaceManager.getSupplierOffers(filters));
    setMerchantRequests(marketplaceManager.getMerchantRequests(filters));
    setShippingServices(marketplaceManager.getShippingServices(filters));
    
    // البيانات التقليدية للتوافق
    setTraditionalOrders(storage.getMerchantOrders());
    setTraditionalShipping(storage.getShippingServices());
  };

  // تحميل التوصيات الذكية
  const loadRecommendations = () => {
    if (user) {
      const recs = marketplaceManager.getRecommendations(user.id, activeTab as any);
      setRecommendations(recs);
    }
  };

  // تحميل معارض الموردين
  const loadExhibitions = () => {
    const allExhibitions: any[] = [];
    const keys = Object.keys(localStorage);
    const exhibitionKeys = keys.filter(key => key.startsWith('exhibitions_'));
    
    exhibitionKeys.forEach(key => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const supplierExhibitions = JSON.parse(stored);
          const publicExhibitions = supplierExhibitions.filter(
            (exh: any) => exh.visibility === 'public'
          );
          allExhibitions.push(...publicExhibitions);
        }
      } catch (error) {
        console.error('Error loading exhibitions:', error);
      }
    });
    
    // إضافة معارض وهمية للعرض إذا لم توجد معارض حقيقية
    if (allExhibitions.length === 0) {
      const demoExhibitions = generateDemoExhibitions();
      allExhibitions.push(...demoExhibitions);
    }
    
    setExhibitions(allExhibitions);
  };

  // تحميل إحصائيات السوق
  const loadMarketStats = () => {
    const stats = {
      totalOffers: supplierOffers.length,
      totalRequests: merchantRequests.length + traditionalOrders.length,
      totalShipping: shippingServices.length + traditionalShipping.length,
      totalExhibitions: exhibitions.length
    };
    setMarketStats(stats);
  };

  // تحميل المفضلة من التخزين المحلي
  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem(`marketplace_favorites_${user?.id || 'guest'}`);
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // حفظ المفضلة في التخزين المحلي
  const saveFavorites = (newFavorites: Set<string>) => {
    try {
      localStorage.setItem(`marketplace_favorites_${user?.id || 'guest'}`, JSON.stringify([...newFavorites]));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  // دمج طلبات التجار من النظامين
  const getAllMerchantRequests = useMemo(() => {
    const smartRequests = merchantRequests;
    const traditionalRequests = traditionalOrders.map(order => ({
      id: order.id,
      type: 'merchant_request' as const,
      title: order.title,
      description: order.description,
      requirements: {
        quantity: 1,
        budget: { min: order.budget * 0.8, max: order.budget * 1.2, currency: 'SAR' },
        deliveryDate: order.deadline,
        location: 'غير محدد'
      },
      merchant: {
        id: order.merchant.id,
        name: order.merchant.name,
        rating: order.merchant.rating || 4.0,
        verified: true,
        responseTime: 'خلال يوم',
        location: 'غير محدد'
      },
      status: order.status as any,
      category: order.category,
      selectionCriteria: {
        priority: 'price' as const,
        maxDeliveryTime: '7 أيام',
        preferredSuppliers: [],
        qualityRequirements: 'جيد'
      },
      receivedOffers: [],
      stats: { views: 0, inquiries: 0, offers: 0 },
      tags: ['عادي'],
      createdAt: order.createdAt,
      updatedAt: order.createdAt
    }));
    
    return [...smartRequests, ...traditionalRequests];
  }, [merchantRequests, traditionalOrders]);

  // فلترة وترتيب البيانات حسب البحث والفلاتر
  const getFilteredData = () => {
    let data: any[] = [];
    
    switch (activeTab) {
      case 'supplier_offers':
        data = supplierOffers;
        break;
      case 'merchant_requests':
        data = getAllMerchantRequests;
        break;
      case 'shipping_services':
        data = [...shippingServices, ...traditionalShipping.map(service => ({
          ...service,
          type: 'shipping_service',
          shippingCompany: {
            id: service.id,
            name: service.name,
            rating: 4.5,
            verified: true,
            responseTime: 'خلال ساعة'
          }
        }))];
        break;
      case 'exhibitions':
        data = exhibitions;
        break;
      default:
        data = [];
    }

    // تطبيق البحث
    if (searchQuery) {
      data = data.filter(item => 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // تطبيق فلتر الفئة
    if (filters.category) {
      data = data.filter(item => 
        item.category === filters.category ||
        item.categories?.includes(filters.category)
      );
    }

    // تطبيق فلتر التقييم
    if (filters.rating) {
      data = data.filter(item => {
        const rating = item.rating || item.supplier?.rating || item.merchant?.rating || item.shippingCompany?.rating || 0;
        return rating >= filters.rating!;
      });
    }

    // ترتيب البيانات
    data.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          const priceA = a.price || a.budget?.min || 0;
          const priceB = b.price || b.budget?.min || 0;
          return priceA - priceB;
        case 'rating':
          const ratingA = a.rating || a.supplier?.rating || a.merchant?.rating || 0;
          const ratingB = b.rating || b.supplier?.rating || b.merchant?.rating || 0;
          return ratingB - ratingA;
        case 'popularity':
          const popularityA = a.stats?.views || a.views || 0;
          const popularityB = b.stats?.views || b.views || 0;
          return popularityB - popularityA;
        case 'recent':
        default:
          return new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime();
      }
    });

    return data;
  };

  // تبديل حالة المفضلة
  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
      toast.success('تم إزالة من المفضلة');
    } else {
      newFavorites.add(id);
      toast.success('تم إضافة إلى المفضلة');
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  // عرض تفاصيل العنصر
  const showItemDetailsModal = (item: any) => {
    setSelectedItem(item);
    setShowItemDetails(true);
  };

  // إنشاء معارض وهمية للعرض
  const generateDemoExhibitions = () => {
    return [
      {
        id: 'demo_exh_1',
        supplierId: 'demo_supplier_1',
        supplierName: 'مؤسسة الأغذية المتميزة',
        title: 'معرض المواد الغذائية الفاخرة',
        description: 'أجود أنواع الأرز والزيوت والبهارات من مصادر موثوقة',
        banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
        theme: 'modern',
        visibility: 'public',
        categories: ['أرز', 'زيوت', 'عسل'],
        settings: {
          allowComments: true,
          showPrices: true,
          enableOrders: true,
          requireSubscription: false
        },
        items: [
          {
            id: 'item_1',
            name: 'أرز بسمتي هندي',
            description: 'أرز بسمتي عالي الجودة - كيس 10 كجم',
            price: 120,
            images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
            category: 'أرز',
            stock: 500,
            discount: 10,
            featured: true
          },
          {
            id: 'item_2',
            name: 'زيت زيتون إيطالي',
            description: 'زيت زيتون بكر ممتاز - 1 لتر',
            price: 85,
            images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'],
            category: 'زيوت',
            stock: 300,
            featured: true
          },
          {
            id: 'item_3',
            name: 'عسل طبيعي',
            description: 'عسل جبلي طبيعي 100% - 1 كجم',
            price: 150,
            images: ['https://images.unsplash.com/photo-1587049352846-4a222e784704?w=400'],
            category: 'عسل',
            stock: 200,
            discount: 15,
            featured: false
          }
        ],
        stats: { views: 1250, likes: 89, shares: 23, subscribers: 45 },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo_exh_2',
        supplierId: 'demo_supplier_2',
        supplierName: 'شركة الإلكترونيات الذكية',
        title: 'معرض الأجهزة الإلكترونية',
        description: 'أحدث الأجهزة الإلكترونية والإكسسوارات',
        banner: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
        theme: 'modern',
        visibility: 'public',
        categories: ['إلكترونيات', 'إكسسوارات'],
        settings: {
          allowComments: true,
          showPrices: true,
          enableOrders: true,
          requireSubscription: false
        },
        items: [
          {
            id: 'item_4',
            name: 'سماعات لاسلكية',
            description: 'سماعات بلوتوث عالية الجودة مع عزل الضوضاء',
            price: 350,
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
            category: 'إلكترونيات',
            stock: 150,
            discount: 20,
            featured: true
          },
          {
            id: 'item_5',
            name: 'شاحن سريع',
            description: 'شاحن سريع 65 واط - متوافق مع جميع الأجهزة',
            price: 95,
            images: ['https://images.unsplash.com/photo-1591290619762-d4c7dfc4e5b0?w=400'],
            category: 'إكسسوارات',
            stock: 400,
            featured: false
          }
        ],
        stats: { views: 890, likes: 67, shares: 15, subscribers: 32 },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  // عرض شريط الإحصائيات
  const renderStatsBar = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">عروض الموردين</p>
            <p className="text-2xl font-bold">{supplierOffers.length}</p>
          </div>
          <Package className="w-8 h-8 text-blue-200" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">طلبات التجار</p>
            <p className="text-2xl font-bold">{getAllMerchantRequests.length}</p>
          </div>
          <ShoppingCart className="w-8 h-8 text-green-200" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">خدمات الشحن</p>
            <p className="text-2xl font-bold">{shippingServices.length + traditionalShipping.length}</p>
          </div>
          <Truck className="w-8 h-8 text-orange-200" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">المعارض</p>
            <p className="text-2xl font-bold">{exhibitions.length}</p>
          </div>
          <Store className="w-8 h-8 text-purple-200" />
        </div>
      </div>
    </div>
  );

  // عرض التوصيات الذكية
  const renderRecommendations = () => {
    if (recommendations.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-xl p-6 border border-amber-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                توصيات ذكية مخصصة لك
                <Crown className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-sm text-gray-600">بناءً على اهتماماتك ونشاطك في السوق</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white p-4 rounded-lg border border-amber-200 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => showItemDetailsModal(item)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-800 text-sm group-hover:text-amber-600 transition-colors">
                    {item.title || item.name}
                  </h4>
                  <div className="flex items-center gap-1">
                    <Verified className="w-3 h-3 text-amber-500" />
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                      موصى
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-600">
                    {item.price ? `${item.price} ريال` : 'اطلب عرض سعر'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // عرض شريط البحث والفلاتر المحسن
  const renderSearchAndFilters = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      {/* شريط البحث الرئيسي */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="ابحث في جميع أقسام السوق..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* شريط الفلاتر والترتيب */}
      <div className="flex flex-wrap items-center gap-4">
        {/* زر الفلاتر */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
            showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:border-blue-300'
          }`}
        >
          <Filter className="w-4 h-4" />
          فلاتر متقدمة
        </button>

        {/* خيارات الترتيب */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">ترتيب حسب:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="recent">الأحدث</option>
            <option value="price">السعر</option>
            <option value="rating">التقييم</option>
            <option value="popularity">الأكثر شعبية</option>
          </select>
        </div>

        {/* خيارات العرض */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            aria-label="عرض الشبكة"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            aria-label="عرض القائمة"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* الفلاتر المتقدمة */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => setFilters({...filters, category: e.target.value || undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  aria-label="فلتر الفئة"
                >
                  <option value="">جميع الفئات</option>
                  <option value="إلكترونيات">إلكترونيات</option>
                  <option value="أغذية">أغذية</option>
                  <option value="ملابس">ملابس</option>
                  <option value="أدوات منزلية">أدوات منزلية</option>
                  <option value="خدمات شحن">خدمات شحن</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأدنى للتقييم</label>
                <select
                  value={filters.rating || ''}
                  onChange={(e) => setFilters({...filters, rating: e.target.value ? Number(e.target.value) : undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  aria-label="فلتر التقييم"
                >
                  <option value="">جميع التقييمات</option>
                  <option value="4">4 نجوم فأكثر</option>
                  <option value="3">3 نجوم فأكثر</option>
                  <option value="2">2 نجوم فأكثر</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المنطقة</label>
                <select
                  value={filters.location || ''}
                  onChange={(e) => setFilters({...filters, location: e.target.value || undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  aria-label="فلتر المنطقة"
                >
                  <option value="">جميع المناطق</option>
                  <option value="الرياض">الرياض</option>
                  <option value="جدة">جدة</option>
                  <option value="الدمام">الدمام</option>
                  <option value="مكة">مكة</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // عرض علامات التبويب المحسنة
  const renderTabs = () => {
    const tabs = [
      { id: 'supplier_offers', label: 'عروض الموردين', icon: Package, count: supplierOffers.length, color: 'blue' },
      { id: 'merchant_requests', label: 'طلبات التجار', icon: ShoppingCart, count: getAllMerchantRequests.length, color: 'green' },
      { id: 'shipping_services', label: 'خدمات الشحن', icon: Truck, count: shippingServices.length + traditionalShipping.length, color: 'orange' },
      { id: 'exhibitions', label: 'المعارض', icon: Store, count: exhibitions.length, color: 'purple' }
    ];

    return (
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-50 p-2 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? `bg-${tab.color}-500 text-white shadow-lg transform scale-105`
                : 'text-gray-600 hover:bg-white hover:shadow-sm'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={`px-2 py-1 rounded-full text-xs ${
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    );
  };

  // عرض البطاقات المحسنة
  const renderEnhancedCard = (item: any, index: number) => {
    const isSupplierOffer = item.type === 'supplier_offer' || (!item.type && item.supplier);
    const isMerchantRequest = item.type === 'merchant_request' || (!item.type && item.merchant);
    const isShippingService = item.type === 'shipping_service' || (!item.type && item.shippingCompany);
    const isExhibition = activeTab === 'exhibitions';
    const isFavorite = favorites.has(item.id);

    const cardGradient = isSupplierOffer ? 'from-blue-500 to-indigo-600' :
                        isMerchantRequest ? 'from-green-500 to-emerald-600' :
                        isShippingService ? 'from-orange-500 to-red-600' :
                        isExhibition ? 'from-purple-500 to-pink-600' :
                        'from-gray-500 to-gray-600';

    const cardIcon = isSupplierOffer ? Package :
                    isMerchantRequest ? ShoppingCart :
                    isShippingService ? Truck :
                    isExhibition ? Store : Package;

    const IconComponent = cardIcon;

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 * index }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden relative"
      >
        {/* شارة المفضلة */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* رأس البطاقة مع تدرج ملون */}
        <div className={`relative h-48 bg-gradient-to-br ${cardGradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
          
          {/* الرمز أو الصورة */}
          <div className="relative h-full flex items-center justify-center">
            {item.banner || item.images?.[0] ? (
              <img
                src={item.banner || item.images[0]}
                alt={item.title || item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-8 bg-white/20 rounded-full backdrop-blur-sm"
              >
                <IconComponent className="w-16 h-16 text-white" />
              </motion.div>
            )}
          </div>

          {/* شارات الحالة */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            {item.featured && (
              <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Crown className="w-3 h-3" />
                مميز
              </span>
            )}
            {item.verified && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" />
                موثق
              </span>
            )}
            {item.discount && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                -{item.discount}%
              </span>
            )}
          </div>
        </div>

        {/* محتوى البطاقة */}
        <div className="p-6">
          {/* العنوان والوصف */}
          <div className="mb-4">
            <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
              {item.title || item.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {item.description}
            </p>
          </div>

          {/* معلومات المزود */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {item.supplier?.name || item.merchant?.name || item.shippingCompany?.name || item.supplierName || 'مزود الخدمة'}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-current" />
                  <span className="text-xs text-gray-600">
                    {item.rating || item.supplier?.rating || item.merchant?.rating || item.shippingCompany?.rating || 4.5}
                  </span>
                </div>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-600">
                  {item.supplier?.responseTime || item.merchant?.responseTime || item.shippingCompany?.responseTime || 'خلال ساعة'}
                </span>
              </div>
            </div>
          </div>

          {/* السعر والمعلومات المالية */}
          <div className="flex items-center justify-between mb-4">
            <div>
              {item.price ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-800">
                    {item.price} ريال
                  </span>
                  {item.discount && (
                    <span className="text-sm text-gray-500 line-through">
                      {Math.round(item.price / (1 - item.discount / 100))} ريال
                    </span>
                  )}
                </div>
              ) : item.budget ? (
                <div className="text-sm text-gray-600">
                  الميزانية: {item.budget.min} - {item.budget.max} ريال
                </div>
              ) : (
                <span className="text-green-600 font-medium">اطلب عرض سعر</span>
              )}
            </div>
            
            {item.stock && (
              <div className="text-sm text-gray-600">
                متوفر: {item.stock}
              </div>
            )}
          </div>

          {/* الإحصائيات */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {item.stats?.views || item.views || 0}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {item.stats?.inquiries || item.inquiries || 0}
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                {item.stats?.likes || item.likes || 0}
              </div>
            </div>
            <span className="text-xs">
              {new Date(item.createdAt || item.updatedAt || '').toLocaleDateString('ar-SA')}
            </span>
          </div>

          {/* الأزرار */}
          <div className="flex gap-2">
            <button
              onClick={() => showItemDetailsModal(item)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              عرض التفاصيل
            </button>
            <button
              onClick={() => {
                if (isSupplierOffer) {
                  toast.success('تم إرسال استفسار للمورد');
                } else if (isMerchantRequest) {
                  toast.success('تم إرسال عرض للتاجر');
                } else if (isShippingService) {
                  toast.success('تم طلب خدمة الشحن');
                } else {
                  toast.success('تم إرسال الطلب');
                }
              }}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(item.id)}
              className={`px-4 py-3 rounded-lg transition-all ${
                isFavorite 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // عرض قائمة البيانات
  const renderItemsList = () => {
    const filteredData = getFilteredData();

    if (filteredData.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">لا توجد نتائج</h3>
          <p className="text-gray-600 mb-6">جرب تغيير معايير البحث أو الفلاتر</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilters({});
            }}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all"
          >
            مسح الفلاتر
          </button>
        </div>
      );
    }

    return (
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        : 'space-y-4'
      }>
        {filteredData.map((item, index) => renderEnhancedCard(item, index))}
      </div>
    );
  };

  // عرض أزرار الإجراءات حسب نوع المستخدم
  const renderActionButtons = () => {
    if (!user) return null;

    return (
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        {(user.role === 'supplier' || user.role === 'admin') && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAddOfferModal(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
            title="إضافة عرض جديد"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        )}
        
        {/* Merchant floating cart button removed per request */}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* رأس الصفحة */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              السوق الموحد المطور
            </h1>
            <p className="text-gray-600 text-lg">منصة متطورة لربط الموردين والتجار وشركات الشحن</p>
          </motion.div>
          
          {/* شريط الإحصائيات */}
          {renderStatsBar()}
        </div>

        {/* التوصيات الذكية */}
        {user && renderRecommendations()}

        {/* شريط البحث والفلاتر */}
        {renderSearchAndFilters()}

        {/* علامات التبويب */}
        {renderTabs()}

        {/* قائمة العناصر */}
        {renderItemsList()}

        {/* أزرار الإجراءات العائمة */}
        {renderActionButtons()}

        {/* النوافذ المنبثقة */}
        <AnimatePresence>
          {/* Modal components removed for build compatibility */}

          {showItemDetails && selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowItemDetails(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedItem.title || selectedItem.name}
                    </h2>
                    <button
                      onClick={() => setShowItemDetails(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedItem.images?.[0] && (
                      <img
                        src={selectedItem.images[0]}
                        alt={selectedItem.title || selectedItem.name}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                    
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">الوصف</h3>
                      <p className="text-gray-600">{selectedItem.description}</p>
                    </div>
                    
                    {selectedItem.price && (
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">السعر</h3>
                        <p className="text-2xl font-bold text-green-600">{selectedItem.price} ريال</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-4">
                      <button
                        className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-all"
                        onClick={() => {
                          toast.success('تم إرسال استفسار بنجاح!');
                          setShowItemDetails(false);
                        }}
                      >
                        إرسال استفسار
                      </button>
                      <button
                        title={favorites.has(selectedItem.id) ? 'إزالة من المفضلة' : 'أضف إلى المفضلة'}
                        aria-label={favorites.has(selectedItem.id) ? 'إزالة من المفضلة' : 'أضف إلى المفضلة'}
                        onClick={() => toggleFavorite(selectedItem.id)}
                        className={`px-4 py-3 rounded-lg transition-all ${
                          favorites.has(selectedItem.id)
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.has(selectedItem.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedUnifiedMarketplace;