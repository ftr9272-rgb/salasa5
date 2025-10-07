import { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, MessageSquare, Star, CheckCircle, Truck, Package, Clipboard, Send, Heart, Eye, TrendingUp, Award, Users, Clock, ArrowRight, Zap, Shield, Gift, ChevronDown, MapPin, Calendar, DollarSign, Plus, Grid, List, SortAsc, SortDesc, Target, Briefcase, AlertCircle, Settings, Bell, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { marketplaceManager } from '../utils/marketplaceManager';
import type { SupplierOffer, MerchantRequest, ShippingServiceOffer, MarketplaceFilters } from '../types/marketplace';
import toast from 'react-hot-toast';
import AddSupplierOfferModal from '../components/AddSupplierOfferModal';
import AddMerchantRequestModal from '../components/AddMerchantRequestModal';

const SmartMarketplace = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'offers' | 'requests' | 'services'>('offers');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'price' | 'rating' | 'popularity'>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  
  // البيانات
  const [supplierOffers, setSupplierOffers] = useState<SupplierOffer[]>([]);
  const [merchantRequests, setMerchantRequests] = useState<MerchantRequest[]>([]);
  const [shippingServices, setShippingServices] = useState<ShippingServiceOffer[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  // حالة النوافذ المنبثقة
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);

  // تحميل البيانات
  useEffect(() => {
    loadData();
    loadRecommendations();
    
    // تحديث البيانات عند تغيير السوق
    const handleMarketUpdate = () => {
      loadData();
      loadRecommendations();
    };
    
    window.addEventListener('marketplace-updated', handleMarketUpdate);
    return () => window.removeEventListener('marketplace-updated', handleMarketUpdate);
  }, [user]);

  const loadData = () => {
    setSupplierOffers(marketplaceManager.getSupplierOffers(filters));
    setMerchantRequests(marketplaceManager.getMerchantRequests(filters));
    setShippingServices(marketplaceManager.getShippingServices(filters));
    
    // تحميل بيانات تجريبية إذا لم توجد
    const allItems = marketplaceManager.getSupplierOffers();
    if (allItems.length === 0) {
      marketplaceManager.seedSampleData();
      setSupplierOffers(marketplaceManager.getSupplierOffers(filters));
      setMerchantRequests(marketplaceManager.getMerchantRequests(filters));
      setShippingServices(marketplaceManager.getShippingServices(filters));
    }
  };

  const loadRecommendations = () => {
    if (user) {
      const recs = marketplaceManager.getRecommendations(user.id, user.role as any);
      setRecommendations(recs);
    }
  };

  // تحديث البيانات عند تغيير الفلاتر
  useEffect(() => {
    loadData();
  }, [filters]);

  // تحديد التبويبات المرئية حسب نوع المستخدم
  const getVisibleTabs = () => {
    switch (user?.role) {
      case 'supplier':
        return [
          { key: 'requests', label: 'طلبات التجار', icon: Clipboard, count: merchantRequests.length },
          { key: 'offers', label: 'عروضي', icon: Package, count: supplierOffers.filter(o => o.supplier.id === user.id).length },
          { key: 'services', label: 'خدمات الشحن', icon: Truck, count: shippingServices.length }
        ];
      case 'merchant':
        return [
          { key: 'offers', label: 'عروض الموردين', icon: Package, count: supplierOffers.length },
          { key: 'requests', label: 'طلباتي', icon: Clipboard, count: merchantRequests.filter(r => r.merchant.id === user.id).length },
          { key: 'services', label: 'خدمات الشحن', icon: Truck, count: shippingServices.length }
        ];
      case 'shipping_company':
        return [
          { key: 'requests', label: 'طلبات الشحن', icon: Clipboard, count: merchantRequests.length },
          { key: 'offers', label: 'فرص الشحن', icon: Package, count: supplierOffers.filter(o => !o.shippingIncluded).length },
          { key: 'services', label: 'خدماتي', icon: Truck, count: shippingServices.filter(s => s.shippingCompany.id === user.id).length }
        ];
      default:
        return [
          { key: 'offers', label: 'عروض الموردين', icon: Package, count: supplierOffers.length },
          { key: 'requests', label: 'طلبات التجار', icon: Clipboard, count: merchantRequests.length },
          { key: 'services', label: 'خدمات الشحن', icon: Truck, count: shippingServices.length }
        ];
    }
  };

  // البحث الذكي
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = marketplaceManager.smartSearch(query);
      setSupplierOffers(results.offers);
      setMerchantRequests(results.requests);
      setShippingServices(results.services);
    } else {
      loadData();
    }
  };

  // ترتيب النتائج
  const sortResults = <T extends any>(items: T[], type: 'offers' | 'requests' | 'services'): T[] => {
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          const aDate = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
          const bDate = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
          return bDate - aDate;
        case 'price':
          if (type === 'offers') {
            return (a as SupplierOffer).price - (b as SupplierOffer).price;
          } else if (type === 'requests') {
            return (a as MerchantRequest).requirements.budget.max - (b as MerchantRequest).requirements.budget.max;
          }
          return 0;
        case 'rating':
          if (type === 'offers') {
            return (b as SupplierOffer).supplier.rating - (a as SupplierOffer).supplier.rating;
          } else if (type === 'requests') {
            return (b as MerchantRequest).merchant.rating - (a as MerchantRequest).merchant.rating;
          } else if (type === 'services') {
            return (b as ShippingServiceOffer).shippingCompany.rating - (a as ShippingServiceOffer).shippingCompany.rating;
          }
          return 0;
        case 'popularity':
          if (type === 'offers') {
            return (b as SupplierOffer).stats.views - (a as SupplierOffer).stats.views;
          } else if (type === 'requests') {
            return (b as MerchantRequest).stats.views - (a as MerchantRequest).stats.views;
          }
          return 0;
        default:
          return 0;
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
    localStorage.setItem(`marketplace_favorites_${user?.id}`, JSON.stringify([...newFavorites]));
  };

  // فتح المحادثة
  const openChat = (withUserId: string, withUserName: string) => {
    const chatEvent = new CustomEvent('open-chat', {
      detail: {
        withUserId,
        withUserName,
        context: 'marketplace'
      }
    });
    window.dispatchEvent(chatEvent);
  };

  // رندر عرض المورد
  const renderSupplierOffer = (offer: SupplierOffer, index: number) => (
    <motion.div
      key={offer.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      {/* صورة العرض */}
      <div className={`relative bg-gradient-to-br from-blue-500 to-indigo-600 ${
        viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'
      }`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
        <div className="relative h-full flex items-center justify-center">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="text-white text-5xl drop-shadow-lg"
          >
            {offer.offerType === 'product' ? '📦' : offer.offerType === 'service' ? '🛠️' : '🎁'}
          </motion.div>
        </div>
        
        {/* شارات */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
            offer.quality === 'premium' ? 'bg-purple-500' : 
            offer.quality === 'standard' ? 'bg-blue-500' : 'bg-green-500'
          }`}>
            {offer.quality === 'premium' ? 'مميز' : offer.quality === 'standard' ? 'عادي' : 'اقتصادي'}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() => toggleFavorite(offer.id)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              favorites.has(offer.id) 
                ? 'bg-red-500 text-white' 
                : 'bg-white/20 text-white hover:bg-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorites.has(offer.id) ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* خصم للكمية */}
        {offer.terms.bulkDiscounts && offer.terms.bulkDiscounts.length > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
              خصم {offer.terms.bulkDiscounts[0].discountPercentage}%
            </span>
          </div>
        )}
      </div>

      {/* محتوى العرض */}
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
              {offer.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">{offer.description}</p>
          </div>
          <div className="text-right ml-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {offer.price.toLocaleString()}
            </span>
            <div className="text-sm text-gray-500">{offer.currency}</div>
          </div>
        </div>

        {/* معلومات المورد */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {offer.supplier.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">{offer.supplier.name}</span>
              {offer.supplier.verified && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span>{offer.supplier.rating}</span>
              <span>•</span>
              <MapPin className="w-3 h-3" />
              <span>{offer.supplier.location}</span>
            </div>
          </div>
        </div>

        {/* تفاصيل إضافية */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400" />
            <span>الكمية: {offer.availableQuantity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>رد: {offer.supplier.responseTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span>ضمان: {offer.terms.warrantyPeriod || 'بدون'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-400" />
            <span>{offer.shippingIncluded ? 'شحن مجاني' : 'شحن مدفوع'}</span>
          </div>
        </div>

        {/* شهادات الجودة */}
        {offer.certifications.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {offer.certifications.slice(0, 3).map(cert => (
              <span key={cert} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {cert}
              </span>
            ))}
            {offer.certifications.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{offer.certifications.length - 3}
              </span>
            )}
          </div>
        )}

        {/* أزرار العمل */}
        <div className="flex gap-2">
          <button
            onClick={() => openChat(offer.supplier.id, offer.supplier.name)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            تواصل
          </button>
          <button 
            title="عرض التفاصيل"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button 
            title="إضافة إلى العربة"
            className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  // رندر طلب التاجر
  const renderMerchantRequest = (request: MerchantRequest, index: number) => (
    <motion.div
      key={request.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-200 ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      {/* رأس الطلب */}
      <div className={`relative bg-gradient-to-br from-green-500 to-emerald-600 ${
        viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'
      }`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
        <div className="relative h-full flex items-center justify-center">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="text-white text-5xl drop-shadow-lg"
          >
            📋
          </motion.div>
        </div>
        
        {/* شارة نوع الطلب */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
            request.requestType === 'product' ? 'bg-blue-500' : 
            request.requestType === 'service' ? 'bg-purple-500' : 'bg-orange-500'
          }`}>
            {request.requestType === 'product' ? 'منتج' : 
             request.requestType === 'service' ? 'خدمة' : 'مخصص'}
          </span>
        </div>

        {/* شارة الميزانية */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/20 text-white px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm">
            {request.requirements.budget.min.toLocaleString()} - {request.requirements.budget.max.toLocaleString()} ر.س
          </span>
        </div>

        {/* أزرار سريعة */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() => toggleFavorite(request.id)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              favorites.has(request.id) 
                ? 'bg-red-500 text-white' 
                : 'bg-white/20 text-white hover:bg-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorites.has(request.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* محتوى الطلب */}
      <div className="p-6 flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors mb-2">
            {request.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{request.description}</p>
        </div>

        {/* معلومات التاجر */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {request.merchant.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">{request.merchant.name}</span>
              {request.merchant.verified && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span>{request.merchant.rating}</span>
              <span>•</span>
              <Briefcase className="w-3 h-3" />
              <span>{request.merchant.businessType}</span>
            </div>
          </div>
        </div>

        {/* تفاصيل المتطلبات */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400" />
            <span>الكمية: {request.requirements.quantity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{new Date(request.requirements.deliveryDate).toLocaleDateString('ar-SA')}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{request.requirements.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-400" />
            <span>عروض: {request.stats.offers}</span>
          </div>
        </div>

        {/* معايير الاختيار */}
        <div className="flex flex-wrap gap-2 mb-4">
          {request.selectionCriteria.prioritizeQuality && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">أولوية للجودة</span>
          )}
          {request.selectionCriteria.prioritizePrice && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">أولوية للسعر</span>
          )}
          {request.selectionCriteria.prioritizeSpeed && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">أولوية للسرعة</span>
          )}
          {request.selectionCriteria.requireCertification && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">شهادة مطلوبة</span>
          )}
        </div>

        {/* أزرار العمل */}
        <div className="flex gap-2">
          {user?.role === 'supplier' ? (
            <>
              <button
                onClick={() => toast.success('سيتم فتح نموذج تقديم العرض قريباً')}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                تقديم عرض
              </button>
              <button
                title="تواصل مع التاجر"
                onClick={() => openChat(request.merchant.id, request.merchant.name)}
                className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openChat(request.merchant.id, request.merchant.name)}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                تواصل
              </button>
              <button 
                title="عرض التفاصيل"
                className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  // رندر خدمة الشحن
  const renderShippingService = (service: ShippingServiceOffer, index: number) => (
    <motion.div
      key={service.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-200 ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      {/* رأس الخدمة */}
      <div className={`relative bg-gradient-to-br from-orange-500 to-red-600 ${
        viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'
      }`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
        <div className="relative h-full flex items-center justify-center">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="text-white text-5xl drop-shadow-lg"
          >
            🚚
          </motion.div>
        </div>
        
        {/* شارة نوع الخدمة */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
            service.serviceType === 'express' ? 'bg-red-500' : 
            service.serviceType === 'standard' ? 'bg-blue-500' : 
            service.serviceType === 'bulk' ? 'bg-purple-500' : 'bg-green-500'
          }`}>
            {service.serviceType === 'express' ? 'سريع' : 
             service.serviceType === 'standard' ? 'عادي' : 
             service.serviceType === 'bulk' ? 'كمية' : 'خاص'}
          </span>
        </div>

        {/* شارة السعر */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/20 text-white px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm">
            من {service.pricing.basePrice} ر.س
          </span>
        </div>

        {/* أزرار سريعة */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() => toggleFavorite(service.id)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              favorites.has(service.id) 
                ? 'bg-red-500 text-white' 
                : 'bg-white/20 text-white hover:bg-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorites.has(service.id) ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* شارة التتبع */}
        {service.services.trackingIncluded && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
              تتبع مباشر
            </span>
          </div>
        )}
      </div>

      {/* محتوى الخدمة */}
      <div className="p-6 flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors mb-2">
            {service.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
        </div>

        {/* معلومات شركة الشحن */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
            {service.shippingCompany.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">{service.shippingCompany.name}</span>
              {service.shippingCompany.verified && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span>{service.shippingCompany.rating}</span>
              <span>•</span>
              <Truck className="w-3 h-3" />
              <span>{service.shippingCompany.experience}</span>
            </div>
          </div>
        </div>

        {/* تفاصيل الخدمة */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{service.deliveryTimes.express}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span>{service.pricing.pricePerKg} ر.س/كيلو</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{service.coverage.length} مدينة</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-gray-400" />
            <span>{service.stats.onTimeDelivery}% في الوقت</span>
          </div>
        </div>

        {/* خدمات إضافية */}
        <div className="flex flex-wrap gap-2 mb-4">
          {service.services.trackingIncluded && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">تتبع</span>
          )}
          {service.services.insuranceIncluded && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">تأمين</span>
          )}
          {service.services.cashOnDelivery && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">دفع عند الاستلام</span>
          )}
          {service.services.temperatureControlled && (
            <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs">تبريد</span>
          )}
        </div>

        {/* أزرار العمل */}
        <div className="flex gap-2">
          <button
            onClick={() => openChat(service.shippingCompany.id, service.shippingCompany.name)}
            className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            تواصل
          </button>
          <button 
            title="عرض التفاصيل"
            className="px-4 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button
            title="طلب الخدمة"
            onClick={() => toast.success('سيتم فتح نموذج طلب الخدمة قريباً')}
            className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  // رندر التوصيات
  const renderRecommendations = () => {
    if (recommendations.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">توصيات ذكية لك</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.slice(0, 3).map((item, index) => {
            if (item.type === 'supplier_offer') {
              return renderSupplierOffer(item, index);
            } else if (item.type === 'merchant_request') {
              return renderMerchantRequest(item, index);
            } else {
              return renderShippingService(item, index);
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* رأس السوق */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* العنوان والوصف */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                السوق الذكي
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role === 'supplier' ? 'اعرض منتجاتك واستجب لطلبات التجار' :
                 user?.role === 'merchant' ? 'اطلب منتجات وخدمات من أفضل الموردين' :
                 user?.role === 'shipping_company' ? 'قدم خدمات الشحن واكسب عملاء جدد' :
                 'تسوق من أفضل الموردين وشركات الشحن'}
              </p>
            </div>

            {/* شريط البحث */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="ابحث عن منتجات، خدمات، أو موردين..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="flex items-center gap-3">
              {/* زر إضافة جديد */}
              {user && (
                <div className="relative">
                  {user.role === 'supplier' && (
                    <button
                      onClick={() => setShowAddOfferModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة عرض
                    </button>
                  )}
                  {user.role === 'merchant' && (
                    <button
                      onClick={() => setShowAddRequestModal(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة طلب
                    </button>
                  )}
                </div>
              )}
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                فلاتر
              </button>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <select
                title="ترتيب النتائج"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="recent">الأحدث</option>
                <option value="price">السعر</option>
                <option value="rating">التقييم</option>
                <option value="popularity">الأكثر شعبية</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* التبويبات */}
        <div className="flex flex-wrap gap-2 mb-8">
          {getVisibleTabs().map(tab => (
            <button
              key={tab.key}
              title={tab.label}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* التوصيات */}
        {renderRecommendations()}

        {/* المحتوى */}
        <div className="space-y-8">
          {/* عروض الموردين */}
          {activeTab === 'offers' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">عروض الموردين</h2>
                <span className="text-gray-600">{sortResults(supplierOffers, 'offers').length} عرض</span>
              </div>
              
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {sortResults(supplierOffers, 'offers').map(renderSupplierOffer)}
              </div>
              
              {supplierOffers.length === 0 && (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-500 mb-2">لا توجد عروض حالياً</h3>
                  <p className="text-gray-400">ستظهر عروض الموردين هنا</p>
                </div>
              )}
            </div>
          )}

          {/* طلبات التجار */}
          {activeTab === 'requests' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">طلبات التجار</h2>
                <span className="text-gray-600">{sortResults(merchantRequests, 'requests').length} طلب</span>
              </div>
              
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {sortResults(merchantRequests, 'requests').map(renderMerchantRequest)}
              </div>
              
              {merchantRequests.length === 0 && (
                <div className="text-center py-16">
                  <Clipboard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-500 mb-2">لا توجد طلبات حالياً</h3>
                  <p className="text-gray-400">ستظهر طلبات التجار هنا</p>
                </div>
              )}
            </div>
          )}

          {/* خدمات الشحن */}
          {activeTab === 'services' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">خدمات الشحن</h2>
                <span className="text-gray-600">{sortResults(shippingServices, 'services').length} خدمة</span>
              </div>
              
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {sortResults(shippingServices, 'services').map(renderShippingService)}
              </div>
              
              {shippingServices.length === 0 && (
                <div className="text-center py-16">
                  <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-500 mb-2">لا توجد خدمات شحن حالياً</h3>
                  <p className="text-gray-400">ستظهر خدمات الشحن هنا</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* النوافذ المنبثقة */}
      <AddSupplierOfferModal 
        isOpen={showAddOfferModal} 
        onClose={() => setShowAddOfferModal(false)}
        onSuccess={(offer) => {
          setSupplierOffers(prev => [offer, ...prev]);
          toast.success('تم إضافة العرض بنجاح! 🎉');
        }}
      />
      
      <AddMerchantRequestModal 
        isOpen={showAddRequestModal} 
        onClose={() => setShowAddRequestModal(false)}
        onSuccess={(request) => {
          setMerchantRequests(prev => [request, ...prev]);
          toast.success('تم إضافة الطلب بنجاح! 🎉');
        }}
      />
    </div>
  );
};

export default SmartMarketplace;