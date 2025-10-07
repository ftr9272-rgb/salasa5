import { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, MessageSquare, Star, CheckCircle, Truck, Package, Clipboard, Send, Heart, Eye, TrendingUp, Award, Users, Clock, ArrowRight, Zap, Shield, Gift, ChevronDown, MapPin, Calendar, DollarSign, Plus, Grid, List, SortAsc, SortDesc, Target, Briefcase, AlertCircle, Settings, Bell, ThumbsUp, MessageCircle, Share2, Store, BarChart3, Tag, Layers, Globe, CalendarClock, CreditCard, Phone, Mail, Building, UserCheck, BadgeCheck, Timer, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { marketplaceManager } from '../utils/marketplaceManager';
import { storage } from '../utils/localStorage';
import type { SupplierOffer, MerchantRequest, ShippingServiceOffer, MarketplaceFilters } from '../types/marketplace';
import type { MarketItem, MerchantOrder, ShippingService } from '../utils/localStorage';
import toast from 'react-hot-toast';
import AddSupplierOfferModal from '../components/AddSupplierOfferModal';
import AddMerchantRequestModal from '../components/AddMerchantRequestModal';

const RedesignedUnifiedMarketplace = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mainTab, setMainTab] = useState<'all' | 'exhibitions'>('all');
  const [activeTab, setActiveTab] = useState<'supplier_offers' | 'merchant_requests' | 'shipping_services' | 'shipping_requests' | 'exhibitions'>('supplier_offers');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'price' | 'rating' | 'popularity'>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  
  // البيانات الذكية الجديدة
  const [supplierOffers, setSupplierOffers] = useState<SupplierOffer[]>([]);
  const [merchantRequests, setMerchantRequests] = useState<MerchantRequest[]>([]);
  const [shippingServices, setShippingServices] = useState<ShippingServiceOffer[]>([]);
  
  // البيانات التقليدية القديمة
  const [traditionalOrders, setTraditionalOrders] = useState<MerchantOrder[]>([]);
  const [traditionalShipping, setTraditionalShipping] = useState<ShippingService[]>([]);
  
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  // معارض الموردين
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<any | null>(null);
  
  // حالة النوافذ المنبثقة
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);

  // تحميل البيانات
  useEffect(() => {
    loadAllData();
    loadRecommendations();
    loadExhibitions();
    
    const handleMarketUpdate = () => {
      loadAllData();
      loadRecommendations();
    };
    
    const handleExhibitionUpdate = () => {
      loadExhibitions();
    };
    
    // إغلاق القائمة المنسدلة عند النقر خارجها
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
  }, [user]);

  const loadAllData = () => {
    // البيانات الذكية الجديدة
    setSupplierOffers(marketplaceManager.getSupplierOffers(filters));
    setMerchantRequests(marketplaceManager.getMerchantRequests(filters));
    setShippingServices(marketplaceManager.getShippingServices(filters));
    
    // البيانات التقليدية القديمة
    setTraditionalOrders(storage.getMerchantOrders());
    setTraditionalShipping(storage.getShippingServices());
  };

  const loadRecommendations = () => {
    if (user) {
      const recs = marketplaceManager.getRecommendations(user.id, activeTab as any);
      setRecommendations(recs);
    }
  };

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
    
    // إضافة معارض وهمية للعرض والتجربة إذا لم توجد معارض حقيقية
    if (allExhibitions.length === 0) {
      const demoExhibitions = [
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
        },
        {
          id: 'demo_exh_3',
          supplierId: 'demo_supplier_3',
          supplierName: 'مؤسسة التجهيزات المنزلية',
          title: 'معرض الأدوات المنزلية',
          description: 'كل ما تحتاجه لمنزل عصري ومريح',
          banner: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
          theme: 'modern',
          visibility: 'public',
          categories: ['أدوات منزلية', 'أجهزة منزلية'],
          settings: {
            allowComments: true,
            showPrices: true,
            enableOrders: true,
            requireSubscription: false
          },
          items: [
            {
              id: 'item_6',
              name: 'طقم أواني طبخ',
              description: 'طقم أواني من الستانلس ستيل - 12 قطعة',
              price: 450,
              images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=400'],
              category: 'أدوات منزلية',
              stock: 80,
              discount: 25,
              featured: true
            },
            {
              id: 'item_7',
              name: 'مكنسة كهربائية ذكية',
              description: 'مكنسة روبوت ذكية مع تطبيق موبايل',
              price: 1200,
              images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400'],
              category: 'أجهزة منزلية',
              stock: 45,
              featured: true
            }
          ],
          stats: { views: 650, likes: 42, shares: 8, subscribers: 28 },
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      allExhibitions.push(...demoExhibitions);
    }
    
    setExhibitions(allExhibitions);
  };

  // دمج طلبات التجار من النظامين
  const getAllMerchantRequests = () => {
    const smartRequests = merchantRequests;
    const traditionalRequests = traditionalOrders.map(order => ({
      id: order.id,
      type: 'merchant_request' as const,
      title: order.title,
      description: order.description,
      requirements: {
        quantity: 0,
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
      stats: {
        views: Math.floor(Math.random() * 100),
        interestedSuppliers: Math.floor(Math.random() * 10),
        averageOfferPrice: order.budget
      },
      createdAt: order.createdAt,
      updatedAt: order.createdAt
    }));
    
    return [...smartRequests, ...traditionalRequests];
  };

  // الحصول على خدمات الشحن الخاصة بالمستخدم الحالي
  const getMyShippingServices = () => {
    if (!user || user.role !== 'shipping_company') return [];
    
    return [...shippingServices, ...traditionalShipping].filter(service => {
      // إذا كان خدمة ذكية، تحقق من معرف الشركة
      if ('shippingCompany' in service) {
        return service.shippingCompany.id === user.id;
      }
      // إذا كان خدمة تقليدية، تحقق من معرف المزود
      return service.provider.id === user.id;
    });
  };

  // الحصول على طلبات الشحن المتاحة لشركات الشحن
  const getShippingRequests = () => {
    const requests = [];
    
    // طلبات التجار التي تحتاج شحن
    const merchantRequests = getAllMerchantRequests().filter(request => 
      request.requirements.location !== 'استلام مباشر' && 
      request.status === 'open'
    );
    
    // عروض الموردين التي لا تشمل الشحن
    const offersNeedingShipping = supplierOffers.filter(offer => 
      !offer.shippingIncluded
    );
    
    return [...merchantRequests, ...offersNeedingShipping];
  };

  // عدد طلبات الشحن المتاحة
  const getShippingRequestsCount = () => {
    return getShippingRequests().length;
  };

  // الحصول على التبويبات المرئية حسب نوع المستخدم
  const getVisibleTabs = () => {
    const allTabs = [
      {
        key: 'supplier_offers',
        label: 'عروض الموردين',
        icon: Store,
        count: supplierOffers.length,
        color: 'from-blue-500 to-purple-600'
      },
      {
        key: 'merchant_requests',
        label: 'طلبات التجار',
        icon: Clipboard,
        count: getAllMerchantRequests().length,
        color: 'from-green-500 to-emerald-600'
      },
      {
        key: 'shipping_services',
        label: 'خدمات الشحن',
        icon: Truck,
        count: shippingServices.length + traditionalShipping.length,
        color: 'from-orange-500 to-red-600'
      },
      {
        key: 'shipping_requests',
        label: 'طلبات الشحن',
        icon: AlertCircle,
        count: getShippingRequestsCount(),
        color: 'from-purple-500 to-pink-600'
      },
      {
        key: 'exhibitions',
        label: 'معارض الموردين',
        icon: Store,
        count: exhibitions.length,
        color: 'from-pink-500 via-purple-500 to-indigo-600'
      }
    ];

    // إذا كان المستخدم شركة شحن، عرض فقط ما يخصها
    if (user?.role === 'shipping_company') {
      return [
        {
          key: 'shipping_services',
          label: 'خدماتي',
          icon: Truck,
          count: getMyShippingServices().length,
          color: 'from-orange-500 to-red-600'
        },
        {
          key: 'shipping_requests',
          label: 'طلبات الشحن المتاحة',
          icon: AlertCircle,
          count: getShippingRequestsCount(),
          color: 'from-purple-500 to-pink-600'
        }
      ];
    }
    
    // للمستخدمين الآخرين، إخفاء طلبات الشحن المخصصة
    return allTabs.filter(tab => tab.key !== 'shipping_requests');
  };

  // البحث الموحد
  const getFilteredData = () => {
    const query = searchQuery.toLowerCase();
    
    switch (activeTab) {
      case 'supplier_offers':
        return supplierOffers.filter(offer => 
          offer.title.toLowerCase().includes(query) ||
          offer.description.toLowerCase().includes(query) ||
          offer.category.toLowerCase().includes(query)
        );
        
      case 'merchant_requests':
        return getAllMerchantRequests().filter(request => 
          request.title.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query) ||
          request.category?.toLowerCase().includes(query)
        );
        
      case 'shipping_services':
        // لشركات الشحن: عرض خدماتها فقط
        if (user?.role === 'shipping_company') {
          return getMyShippingServices().filter(service => 
            ('category' in service ? service.category : '')?.toLowerCase().includes(query) ||
            service.description?.toLowerCase().includes(query)
          );
        }
        // للآخرين: عرض جميع الخدمات
        const smartShipping = shippingServices.filter(service => 
          service.serviceType.toLowerCase().includes(query) ||
          service.shippingCompany.name.toLowerCase().includes(query)
        );
        const traditionalShippingFiltered = traditionalShipping.filter(service => 
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
        );
        return [...smartShipping, ...traditionalShippingFiltered];
        
      case 'shipping_requests':
        // فقط لشركات الشحن: طلبات الشحن المتاحة
        return getShippingRequests().filter(request => 
          request.title.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query)
        );
        
      case 'exhibitions':
        // عرض المعارض
        return exhibitions.filter(exhibition => 
          exhibition.title.toLowerCase().includes(query) ||
          exhibition.description.toLowerCase().includes(query) ||
          exhibition.supplierName.toLowerCase().includes(query)
        );
        
      default:
        return [];
    }
  };

  // ترتيب البيانات
  const getSortedData = (data: any[]) => {
    return [...data].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          const priceA = a.price || a.requirements?.budget?.min || a.pricePerKg || 0;
          const priceB = b.price || b.requirements?.budget?.min || b.pricePerKg || 0;
          return priceA - priceB;
          
        case 'rating':
          const ratingA = a.supplier?.rating || a.merchant?.rating || a.provider?.rating || a.shippingCompany?.rating || 0;
          const ratingB = b.supplier?.rating || b.merchant?.rating || b.provider?.rating || b.shippingCompany?.rating || 0;
          return ratingB - ratingA;
          
        case 'popularity':
          const viewsA = a.stats?.views || Math.floor(Math.random() * 100);
          const viewsB = b.stats?.views || Math.floor(Math.random() * 100);
          return viewsB - viewsA;
          
        case 'recent':
        default:
          const dateA = new Date(a.createdAt || a.updatedAt || Date.now()).getTime();
          const dateB = new Date(b.createdAt || b.updatedAt || Date.now()).getTime();
          return dateB - dateA;
      }
    });
  };

  // إضافة إلى المفضلة
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
  };

  // عرض التوصيات
  const renderRecommendations = () => {
    if (recommendations.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">توصيات مخصصة لك</h3>
              <p className="text-sm text-gray-600">بناءً على اهتماماتك ونشاطك</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  if (item.type === 'supplier_offer') setActiveTab('supplier_offers');
                  else if (item.type === 'merchant_request') setActiveTab('merchant_requests');
                  else if (item.type === 'shipping_service') setActiveTab('shipping_services');
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-800 text-sm">{item.title || item.name}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    موصى
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-green-600">
                    {item.price ? `${item.price} ريال` : 'اطلب عرض سعر'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // عرض البطاقات حسب النوع - التصميم المحسن
  const renderCard = (item: any, index: number) => {
    const isSupplierOffer = item.type === 'supplier_offer' || (!item.type && item.supplier);
    const isMerchantRequest = item.type === 'merchant_request' || (!item.type && item.merchant);
    const isShippingService = item.type === 'shipping_service' || (!item.type && item.shippingCompany);
    const isTraditionalProduct = !item.type && !item.supplier && !item.merchant && !item.shippingCompany;
    const isShippingRequest = activeTab === 'shipping_requests';

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
        whileHover={{ y: -5 }}
        className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
      >
        {/* رأس البطاقة مع صورة متحركة */}
        <div className={`relative h-48 bg-gradient-to-br ${
          isSupplierOffer ? 'from-blue-500 to-indigo-600' :
          isMerchantRequest ? 'from-green-500 to-emerald-600' :
          isShippingService ? 'from-orange-500 to-red-600' :
          isShippingRequest ? 'from-purple-500 to-pink-600' :
          'from-amber-500 to-yellow-600'
        } overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
          
          {/* صورة المنتج أو رمز توضيحي */}
          <div className="relative h-full flex items-center justify-center">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="text-white text-5xl drop-shadow-lg"
            >
              {isSupplierOffer ? '🏭' :
               isMerchantRequest ? '📋' :
               isShippingService ? '🚚' :
               isShippingRequest ? '📦🚛' :
               '📦'}
            </motion.div>
          </div>
          
          {/* شارات ومعلومات إضافية */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleFavorite(item.id)}
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                favorites.has(item.id) 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/20 text-white hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4" />
            </motion.button>
            
            <button 
              title="عرض التفاصيل"
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all backdrop-blur-sm"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* نوع العنصر */}
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full font-medium">
              {isSupplierOffer ? 'عرض مورد' :
               isMerchantRequest ? 'طلب تاجر' :
               isShippingService ? 'خدمة شحن' :
               isShippingRequest ? 'يحتاج شحن' :
               'منتج تقليدي'}
            </span>
          </div>
          
          {/* خصم إذا كان متوفرًا */}
          {item.discount && (
            <div className="absolute top-3 left-3">
              <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                -{item.discount}%
              </span>
            </div>
          )}
        </div>

        {/* محتوى البطاقة */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
              {item.title || item.name}
            </h3>
            {(item.supplier?.verified || item.merchant?.verified || item.provider?.verified || item.shippingCompany?.verified) && (
              <BadgeCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
            )}
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>

          {/* معلومات السعر والتقييم */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-bold text-green-600">
                {item.price ? `${item.price} ريال` :
                 item.requirements?.budget ? `${item.requirements.budget.min}-${item.requirements.budget.max} ريال` :
                 item.pricePerKg ? `${item.pricePerKg} ريال/كيلو` :
                 'اطلب عرض سعر'}
              </span>
            </div>
            
            {/* التقييم */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm text-gray-600">
                {item.supplier?.rating || item.merchant?.rating || item.provider?.rating || item.shippingCompany?.rating || 'جديد'}
              </span>
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="truncate">
                {item.supplier?.location || item.merchant?.location || item.provider?.location || item.shippingCompany?.location || 'غير محدد'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {item.supplier?.responseTime || item.merchant?.responseTime || item.estimatedDelivery || 'حسب الاتفاق'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>
                {item.availableQuantity || item.stock || item.requirements?.quantity || 'غير محدد'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-SA') : 'غير محدد'}
              </span>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              {isShippingRequest ? 'عرض خدمة شحن' : 'تواصل'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  const filteredData = getFilteredData();
  const sortedData = getSortedData(filteredData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* الخلفية التفاعلية */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <div className="relative">
        {/* العنوان الرئيسي المحسن */}
        <div className="text-center py-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-base font-bold mb-6 shadow-lg"
          >
            <Zap className="w-5 h-5" />
            السوق الموحد - منصة التجارة الشاملة
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent"
          >
            السوق الموحد
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            منصة متطورة تجمع بين عروض الموردين وطلبات التجار وخدمات الشحن والمنتجات التقليدية في تجربة موحدة ومتكاملة
          </motion.p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* التبويبات الرئيسية المحسنة */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            {/* التبويبات الرئيسية: السوق الشامل + المعارض */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setMainTab('all');
                  setActiveTab('supplier_offers');
                }}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-3 shadow-md ${
                  mainTab === 'all'
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <div className="text-right">
                  <div className="text-base">السوق الشامل</div>
                  <div className="text-xs opacity-80">جميع العروض والطلبات</div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setMainTab('exhibitions');
                  setActiveTab('exhibitions');
                }}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-3 shadow-md ${
                  mainTab === 'exhibitions'
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Store className="w-5 h-5" />
                <div className="text-right">
                  <div className="text-base">معارض الموردين</div>
                  <div className="text-xs opacity-80">{exhibitions.length} معرض</div>
                </div>
              </button>
            </div>

            {/* القائمة المنسدلة للفئات (تظهر فقط في السوق الشامل) */}
            {mainTab === 'all' && (
              <div className="relative category-menu-container">
                <button
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                  className="px-5 py-3 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all flex items-center gap-2 font-medium text-gray-700 shadow-sm"
                >
                  <Filter className="w-4 h-4" />
                  <span>الفئات</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* القائمة المنسدلة */}
                <AnimatePresence>
                  {showCategoryMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                      {getVisibleTabs().filter(tab => tab.key !== 'exhibitions').map(tab => (
                        <button
                          key={tab.key}
                          onClick={() => {
                            setActiveTab(tab.key as any);
                            setShowCategoryMenu(false);
                          }}
                          className={`w-full px-5 py-3 flex items-center gap-3 transition-all ${
                            activeTab === tab.key
                              ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 font-bold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <tab.icon className="w-5 h-5" />
                          <div className="flex-1 text-right">
                            <div className="font-medium">{tab.label}</div>
                            <div className="text-xs text-gray-500">{tab.count} عنصر</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* التوصيات المحسنة */}
          {renderRecommendations()}

          {/* البحث والفلاتر المحسنة */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">البحث الذكي</label>
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="ابحث بالاسم، الوصف، أو الكلمات المفتاحية..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-6 pr-12 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="min-w-[140px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ترتيب حسب</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full py-3 px-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all text-sm"
                    title="ترتيب النتائج"
                  >
                    <option value="recent">الأحدث</option>
                    <option value="price">السعر</option>
                    <option value="rating">التقييم</option>
                    <option value="popularity">الشعبية</option>
                  </select>
                </div>
                
                <div className="flex flex-col justify-end">
                  <div className="flex gap-2">
                    <button
                      title={viewMode === 'grid' ? 'عرض قائمة' : 'عرض شبكة'}
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      className="p-3 bg-white/80 text-gray-600 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-sm"
                    >
                      {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
                    </button>
                    
                    <button
                      title="فتح الفلاتر"
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-3 rounded-lg transition-all duration-300 shadow-sm ${
                        showFilters
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-blue-600'
                      }`}
                    >
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* أزرار الإضافة المحسنة */}
          {user && (
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              {(user.role === 'supplier' || !user.role) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddOfferModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  إضافة عرض مورد
                </motion.button>
              )}
              
              {(user.role === 'merchant' || !user.role) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddRequestModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  إضافة طلب تاجر
                </motion.button>
              )}
            </div>
          )}

          {/* المحتوى المحسن */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {getVisibleTabs().find(tab => tab.key === activeTab)?.label} ({sortedData.length})
              </h2>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{sortedData.reduce((sum, item) => sum + (item.stats?.views || Math.floor(Math.random() * 100)), 0)} مشاهدة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{sortedData.length} عنصر</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{favorites.size} مفضل</span>
                </div>
              </div>
            </div>

            {sortedData.length === 0 ? (
              <div className="text-center py-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"
                >
                  {activeTab === 'supplier_offers' ? <Store className="w-12 h-12 text-gray-400" /> :
                   activeTab === 'merchant_requests' ? <Clipboard className="w-12 h-12 text-gray-400" /> :
                   activeTab === 'shipping_services' ? <Truck className="w-12 h-12 text-gray-400" /> :
                   <Package className="w-12 h-12 text-gray-400" />}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد نتائج</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'جرب تغيير كلمات البحث أو الفلاتر' : 'لا توجد عناصر في هذا القسم حالياً'}
                </p>
              </div>
            ) : activeTab === 'exhibitions' ? (
              // عرض المعارض
              selectedExhibition ? (
                // عرض تفاصيل معرض واحد
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl"
                >
                  {/* زر الرجوع */}
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setSelectedExhibition(null)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        title="العودة للمعارض"
                        aria-label="العودة للمعارض"
                      >
                        <ArrowRight className="w-6 h-6 text-white" />
                      </button>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white">{selectedExhibition.title}</h2>
                        <p className="text-white/90 text-sm">من {selectedExhibition.supplierName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Banner */}
                  {selectedExhibition.banner && (
                    <div className="relative h-64 bg-gradient-to-br from-purple-500 to-pink-500">
                      <img src={selectedExhibition.banner} alt={selectedExhibition.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-4 right-4 left-4">
                        <p className="text-white text-lg">{selectedExhibition.description}</p>
                      </div>
                    </div>
                  )}

                  {/* إحصائيات */}
                  <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-purple-600 mb-1">
                          <Eye className="w-5 h-5" />
                          <span className="text-2xl font-bold">{selectedExhibition.stats.views}</span>
                        </div>
                        <p className="text-sm text-gray-600">مشاهدة</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-pink-600 mb-1">
                          <Heart className="w-5 h-5" />
                          <span className="text-2xl font-bold">{selectedExhibition.stats.likes}</span>
                        </div>
                        <p className="text-sm text-gray-600">إعجاب</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                          <Users className="w-5 h-5" />
                          <span className="text-2xl font-bold">{selectedExhibition.stats.subscribers}</span>
                        </div>
                        <p className="text-sm text-gray-600">متابع</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-emerald-600 mb-1">
                          <Package className="w-5 h-5" />
                          <span className="text-2xl font-bold">{selectedExhibition.items.length}</span>
                        </div>
                        <p className="text-sm text-gray-600">منتج</p>
                      </div>
                    </div>
                  </div>

                  {/* منتجات المعرض */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">منتجات المعرض</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedExhibition.items.map((item: any, index: number) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -5 }}
                          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                        >
                          <div className="relative h-48 bg-gray-100">
                            {item.images[0] ? (
                              <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-16 h-16 text-gray-300" />
                              </div>
                            )}
                            {item.featured && (
                              <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                مميز
                              </div>
                            )}
                            {item.discount && (
                              <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                -{item.discount}%
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <h4 className="font-bold text-gray-800 mb-1">{item.name}</h4>
                            <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                            <div className="flex items-center justify-between mb-3">
                              <div>
                                {item.discount ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-purple-600">
                                      {(item.price * (1 - item.discount / 100)).toFixed(2)} ريال
                                    </span>
                                    <span className="text-sm text-gray-400 line-through">
                                      {item.price} ريال
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-lg font-bold text-purple-600">{item.price} ريال</span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">المخزون: {item.stock}</span>
                            </div>

                            <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                              <ShoppingCart className="w-4 h-4" />
                              إضافة للسلة
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                // عرض شبكة المعارض
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exhibitions.map((exhibition: any, index: number) => (
                    <motion.div
                      key={exhibition.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      onClick={() => setSelectedExhibition(exhibition)}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500">
                        {exhibition.banner ? (
                          <img 
                            src={exhibition.banner} 
                            alt={exhibition.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Store className="w-20 h-20 text-white/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute top-2 right-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-purple-600">
                          {exhibition.items.length} منتج
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors mb-1">
                              {exhibition.title}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Store className="w-4 h-4" />
                              {exhibition.supplierName}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {exhibition.description}
                        </p>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="text-center p-2 bg-purple-50 rounded-lg">
                            <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                              <Eye className="w-4 h-4" />
                              <span className="text-sm font-bold">{exhibition.stats.views}</span>
                            </div>
                            <p className="text-xs text-gray-600">مشاهدة</p>
                          </div>
                          <div className="text-center p-2 bg-pink-50 rounded-lg">
                            <div className="flex items-center justify-center gap-1 text-pink-600 mb-1">
                              <Heart className="w-4 h-4" />
                              <span className="text-sm font-bold">{exhibition.stats.likes}</span>
                            </div>
                            <p className="text-xs text-gray-600">إعجاب</p>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                              <Users className="w-4 h-4" />
                              <span className="text-sm font-bold">{exhibition.stats.subscribers}</span>
                            </div>
                            <p className="text-xs text-gray-600">متابع</p>
                          </div>
                        </div>

                        <button className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" />
                          عرض المعرض
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1 lg:grid-cols-2'
              }`}>
                {sortedData.map((item, index) => renderCard(item, index))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* النوافذ المنبثقة */}
      <AnimatePresence>
        {showAddOfferModal && (
          <AddSupplierOfferModal
            isOpen={showAddOfferModal}
            onClose={() => setShowAddOfferModal(false)}
            onSuccess={(offer) => {
              setSupplierOffers([offer, ...supplierOffers]);
              toast.success('تم إضافة العرض بنجاح!');
            }}
          />
        )}
        
        {showAddRequestModal && (
          <AddMerchantRequestModal
            isOpen={showAddRequestModal}
            onClose={() => setShowAddRequestModal(false)}
            onSuccess={(request) => {
              setMerchantRequests([request, ...merchantRequests]);
              toast.success('تم إضافة الطلب بنجاح!');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RedesignedUnifiedMarketplace;