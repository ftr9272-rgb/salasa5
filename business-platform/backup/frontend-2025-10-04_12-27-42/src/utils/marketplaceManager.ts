import { SupplierOffer, MerchantRequest, ShippingServiceOffer, SupplierResponse, MarketplaceFilters, MarketplaceStats } from '../types/marketplace';

// مساعدات إدارة السوق الذكي
class MarketplaceManager {
  private static instance: MarketplaceManager;
  
  static getInstance(): MarketplaceManager {
    if (!MarketplaceManager.instance) {
      MarketplaceManager.instance = new MarketplaceManager();
    }
    return MarketplaceManager.instance;
  }

  // === إدارة عروض الموردين ===
  
  addSupplierOffer(offer: Omit<SupplierOffer, 'id' | 'createdAt' | 'updatedAt' | 'stats'>): SupplierOffer {
    const offers = this.getSupplierOffers();
    const newOffer: SupplierOffer = {
      ...offer,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        views: 0,
        inquiries: 0,
        orders: 0,
        satisfaction: 5
      }
    };
    
    offers.push(newOffer);
    localStorage.setItem('marketplace_supplier_offers', JSON.stringify(offers));
    
    // إشعار بتحديث السوق
    this.notifyMarketUpdate('supplier_offer_added', newOffer);
    
    return newOffer;
  }

  getSupplierOffers(filters?: MarketplaceFilters): SupplierOffer[] {
    const offers = JSON.parse(localStorage.getItem('marketplace_supplier_offers') || '[]') as SupplierOffer[];
    
    if (!filters) return offers;
    
    return offers.filter(offer => {
      // فلاتر عامة
      if (filters.category && offer.category !== filters.category) return false;
      if (filters.priceRange && (offer.price < filters.priceRange.min || offer.price > filters.priceRange.max)) return false;
      if (filters.location && !offer.supplier.location.includes(filters.location)) return false;
      if (filters.rating && offer.supplier.rating < filters.rating) return false;
      if (filters.verified !== undefined && offer.supplier.verified !== filters.verified) return false;
      
      // فلاتر خاصة بالموردين
      if (filters.supplierFilters) {
        const sf = filters.supplierFilters;
        if (sf.quality && offer.quality !== sf.quality) return false;
        if (sf.responseTime && offer.supplier.responseTime !== sf.responseTime) return false;
        if (sf.certifications && !sf.certifications.every(cert => offer.certifications.includes(cert))) return false;
      }
      
      return true;
    });
  }

  updateSupplierOffer(id: string, updates: Partial<SupplierOffer>): SupplierOffer | null {
    const offers = this.getSupplierOffers();
    const index = offers.findIndex(o => o.id === id);
    
    if (index === -1) return null;
    
    offers[index] = {
      ...offers[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('marketplace_supplier_offers', JSON.stringify(offers));
    this.notifyMarketUpdate('supplier_offer_updated', offers[index]);
    
    return offers[index];
  }

  // === إدارة طلبات التجار ===
  
  addMerchantRequest(request: Omit<MerchantRequest, 'id' | 'createdAt' | 'updatedAt' | 'receivedOffers' | 'stats'>): MerchantRequest {
    const requests = this.getMerchantRequests();
    const newRequest: MerchantRequest = {
      ...request,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      receivedOffers: [],
      stats: {
        views: 0,
        offers: 0,
        avgOfferPrice: 0
      }
    };
    
    requests.push(newRequest);
    localStorage.setItem('marketplace_merchant_requests', JSON.stringify(requests));
    
    this.notifyMarketUpdate('merchant_request_added', newRequest);
    
    return newRequest;
  }

  getMerchantRequests(filters?: MarketplaceFilters): MerchantRequest[] {
    const requests = JSON.parse(localStorage.getItem('marketplace_merchant_requests') || '[]') as MerchantRequest[];
    
    if (!filters) return requests;
    
    return requests.filter(request => {
      // فلاتر عامة
      if (filters.category && request.category !== filters.category) return false;
      if (filters.location && !request.merchant.location.includes(filters.location)) return false;
      if (filters.rating && request.merchant.rating < filters.rating) return false;
      if (filters.verified !== undefined && request.merchant.verified !== filters.verified) return false;
      
      // فلاتر خاصة بالتجار
      if (filters.merchantFilters) {
        const mf = filters.merchantFilters;
        if (mf.budget && (request.requirements.budget.min > mf.budget.max || request.requirements.budget.max < mf.budget.min)) return false;
        if (mf.businessType && request.merchant.businessType !== mf.businessType) return false;
      }
      
      return true;
    });
  }

  // إضافة عرض من مورد على طلب تاجر
  addSupplierResponse(requestId: string, response: Omit<SupplierResponse, 'id' | 'submittedAt'>): SupplierResponse | null {
    const requests = this.getMerchantRequests();
    const requestIndex = requests.findIndex(r => r.id === requestId);
    
    if (requestIndex === -1) return null;
    
    const newResponse: SupplierResponse = {
      ...response,
      id: this.generateId(),
      submittedAt: new Date().toISOString()
    };
    
    requests[requestIndex].receivedOffers.push(newResponse);
    requests[requestIndex].stats.offers++;
    
    // تحديث متوسط الأسعار
    const offers = requests[requestIndex].receivedOffers;
    requests[requestIndex].stats.avgOfferPrice = offers.reduce((sum, offer) => sum + offer.offer.price, 0) / offers.length;
    
    localStorage.setItem('marketplace_merchant_requests', JSON.stringify(requests));
    this.notifyMarketUpdate('supplier_response_added', newResponse);
    
    return newResponse;
  }

  // === إدارة خدمات الشحن ===
  
  addShippingService(service: Omit<ShippingServiceOffer, 'id' | 'createdAt' | 'updatedAt' | 'stats'>): ShippingServiceOffer {
    const services = this.getShippingServices();
    const newService: ShippingServiceOffer = {
      ...service,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        totalDeliveries: 0,
        onTimeDelivery: 95,
        customerSatisfaction: 4.8,
        avgDeliveryTime: '2-3 أيام'
      }
    };
    
    services.push(newService);
    localStorage.setItem('marketplace_shipping_services', JSON.stringify(services));
    
    this.notifyMarketUpdate('shipping_service_added', newService);
    
    return newService;
  }

  getShippingServices(filters?: MarketplaceFilters): ShippingServiceOffer[] {
    const services = JSON.parse(localStorage.getItem('marketplace_shipping_services') || '[]') as ShippingServiceOffer[];
    
    if (!filters) return services;
    
    return services.filter(service => {
      // فلاتر عامة
      if (filters.location && !service.coverage.includes(filters.location)) return false;
      if (filters.rating && service.shippingCompany.rating < filters.rating) return false;
      if (filters.verified !== undefined && service.shippingCompany.verified !== filters.verified) return false;
      
      // فلاتر خاصة بالشحن
      if (filters.shippingFilters) {
        const sf = filters.shippingFilters;
        if (sf.serviceType && service.serviceType !== sf.serviceType) return false;
        if (sf.deliverySpeed) {
          if (sf.deliverySpeed === 'same_day' && !service.deliveryTimes.sameDay) return false;
          if (sf.deliverySpeed === 'next_day' && !service.deliveryTimes.nextDay) return false;
        }
        if (sf.coverage && !service.coverage.includes(sf.coverage)) return false;
      }
      
      return true;
    });
  }

  // === البحث الذكي ===
  
  smartSearch(query: string, type?: 'all' | 'offers' | 'requests' | 'services') {
    const results = {
      offers: [] as SupplierOffer[],
      requests: [] as MerchantRequest[],
      services: [] as ShippingServiceOffer[]
    };
    
    const searchTerm = query.toLowerCase();
    
    if (type === 'all' || type === 'offers' || !type) {
      results.offers = this.getSupplierOffers().filter(offer =>
        offer.title.toLowerCase().includes(searchTerm) ||
        offer.description.toLowerCase().includes(searchTerm) ||
        offer.category.toLowerCase().includes(searchTerm) ||
        offer.supplier.name.toLowerCase().includes(searchTerm)
      );
    }
    
    if (type === 'all' || type === 'requests' || !type) {
      results.requests = this.getMerchantRequests().filter(request =>
        request.title.toLowerCase().includes(searchTerm) ||
        request.description.toLowerCase().includes(searchTerm) ||
        request.category.toLowerCase().includes(searchTerm) ||
        request.merchant.name.toLowerCase().includes(searchTerm)
      );
    }
    
    if (type === 'all' || type === 'services' || !type) {
      results.services = this.getShippingServices().filter(service =>
        service.title.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.shippingCompany.name.toLowerCase().includes(searchTerm) ||
        service.coverage.some(area => area.toLowerCase().includes(searchTerm))
      );
    }
    
    return results;
  }

  // === التوصيات الذكية ===
  
  getRecommendations(userId: string, userType: 'supplier' | 'merchant' | 'shipping'): any[] {
    // خوارزمية التوصيات بناءً على نوع المستخدم وسجل التفاعلات
    switch (userType) {
      case 'supplier':
        return this.getRecommendationsForSupplier(userId);
      case 'merchant':
        return this.getRecommendationsForMerchant(userId);
      case 'shipping':
        return this.getRecommendationsForShipping(userId);
      default:
        return [];
    }
  }

  private getRecommendationsForSupplier(supplierId: string): MerchantRequest[] {
    const requests = this.getMerchantRequests();
    // توصية الطلبات التي تتطابق مع تخصص المورد
    return requests
      .filter(request => request.status === 'active')
      .sort((a, b) => {
        // ترتيب حسب الميزانية وتاريخ الإنتهاء
        const budgetDiff = b.requirements.budget.max - a.requirements.budget.max;
        if (budgetDiff !== 0) return budgetDiff;
        
        const dateA = new Date(a.requirements.deliveryDate).getTime();
        const dateB = new Date(b.requirements.deliveryDate).getTime();
        return dateA - dateB;
      })
      .slice(0, 10);
  }

  private getRecommendationsForMerchant(merchantId: string): SupplierOffer[] {
    const offers = this.getSupplierOffers();
    // توصية العروض الأكثر مناسبة للتاجر
    return offers
      .filter(offer => offer.status === 'active')
      .sort((a, b) => {
        // ترتيب حسب التقييم والسعر
        const ratingDiff = b.supplier.rating - a.supplier.rating;
        if (ratingDiff !== 0) return ratingDiff;
        
        return a.price - b.price;
      })
      .slice(0, 10);
  }

  private getRecommendationsForShipping(shippingId: string): (MerchantRequest | SupplierOffer)[] {
    const requests = this.getMerchantRequests();
    const offers = this.getSupplierOffers();
    
    // العثور على الطلبات والعروض التي تحتاج خدمات شحن
    const needsShipping = [
      ...requests.filter(r => r.status === 'active'),
      ...offers.filter(o => o.status === 'active' && !o.shippingIncluded)
    ];
    
    return needsShipping.slice(0, 10);
  }

  // === الإحصائيات ===
  
  getMarketplaceStats(): MarketplaceStats {
    const offers = this.getSupplierOffers();
    const requests = this.getMerchantRequests();
    const services = this.getShippingServices();
    
    const categories = Array.from(new Set([
      ...offers.map(o => o.category),
      ...requests.map(r => r.category)
    ]));
    
    const categoriesData = categories.map(category => {
      const categoryOffers = offers.filter(o => o.category === category);
      const categoryRequests = requests.filter(r => r.category === category);
      
      return {
        category,
        offers: categoryOffers.length,
        requests: categoryRequests.length,
        avgPrice: categoryOffers.reduce((sum, o) => sum + o.price, 0) / categoryOffers.length || 0,
        growth: Math.random() * 20 - 5 // محاكاة نمو عشوائي
      };
    });
    
    return {
      totalOffers: offers.length,
      totalRequests: requests.length,
      totalServices: services.length,
      activeUsers: 150, // محاكاة
      totalTransactions: 1250, // محاكاة
      avgResponseTime: '2.5 ساعة',
      successRate: 87.5,
      categoriesData
    };
  }

  // === المساعدات ===
  
  private generateId(): string {
    return 'MP' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private notifyMarketUpdate(eventType: string, data: any): void {
    try {
      window.dispatchEvent(new CustomEvent('marketplace-updated', {
        detail: { eventType, data }
      }));
    } catch (e) {
      // تجاهل في البيئات غير المتاحة
    }
  }

  // === إعادة تعيين البيانات ===
  
  clearAllData(): void {
    localStorage.removeItem('marketplace_supplier_offers');
    localStorage.removeItem('marketplace_merchant_requests');
    localStorage.removeItem('marketplace_shipping_services');
  }

  // === بيانات تجريبية ===
  
  seedSampleData(): void {
    this.clearAllData();
    
    // عروض الموردين
    const sampleOffers: Omit<SupplierOffer, 'id' | 'createdAt' | 'updatedAt' | 'stats'>[] = [
      {
        type: 'supplier_offer',
        status: 'active',
        offerType: 'product',
        title: 'أرز بسمتي هندي فاخر - جودة عالية',
        description: 'أرز بسمتي هندي أصلي من أجود الأنواع، معبأ في أكياس محكمة الإغلاق',
        category: 'المواد الغذائية',
        subcategory: 'الحبوب والبقوليات',
        price: 25,
        currency: 'SAR',
        minimumQuantity: 50,
        availableQuantity: 1000,
        deliveryOptions: [
          { type: 'pickup', price: 0, estimatedTime: 'فوري', description: 'استلام من المستودع' },
          { type: 'delivery', price: 50, estimatedTime: '1-2 يوم', description: 'توصيل داخل الرياض' }
        ],
        shippingIncluded: false,
        quality: 'premium',
        certifications: ['ISO 9001', 'HACCP', 'Halal'],
        specifications: {
          'المنشأ': 'الهند',
          'نوع الحبة': 'طويلة',
          'وزن الكيس': '25 كيلو',
          'تاريخ الانتهاء': '24 شهر'
        },
        supplier: {
          id: 'SUP001',
          name: 'شركة التجارة الذهبية',
          rating: 4.8,
          verified: true,
          responseTime: 'خلال ساعة',
          location: 'الرياض'
        },
        terms: {
          paymentMethods: ['كاش', 'تحويل بنكي', 'شيك'],
          returnPolicy: 'استرداد خلال 7 أيام',
          warrantyPeriod: '6 أشهر',
          bulkDiscounts: [
            { minQuantity: 100, discountPercentage: 5 },
            { minQuantity: 500, discountPercentage: 10 }
          ]
        }
      }
    ];

    // طلبات التجار
    const sampleRequests: Omit<MerchantRequest, 'id' | 'createdAt' | 'updatedAt' | 'receivedOffers' | 'stats'>[] = [
      {
        type: 'merchant_request',
        status: 'active',
        requestType: 'product',
        title: 'مطلوب: زيت زيتون إيطالي أصلي',
        description: 'نبحث عن زيت زيتون إيطالي بكر ممتاز للبيع في متاجرنا',
        category: 'المواد الغذائية',
        subcategory: 'الزيوت',
        requirements: {
          quantity: 200,
          budget: { min: 40, max: 60, currency: 'SAR' },
          deliveryDate: '2025-10-15',
          location: 'جدة',
          specifications: {
            'النوع': 'بكر ممتاز',
            'المنشأ': 'إيطاليا',
            'حجم العبوة': '500 مل',
            'شهادة الجودة': 'مطلوبة'
          }
        },
        merchant: {
          id: 'MER001',
          name: 'سوبر ماركت النخبة',
          rating: 4.5,
          verified: true,
          location: 'جدة',
          businessType: 'تجارة التجزئة'
        },
        selectionCriteria: {
          prioritizePrice: false,
          prioritizeQuality: true,
          prioritizeSpeed: true,
          requireCertification: true
        }
      }
    ];

    // خدمات الشحن
    const sampleServices: Omit<ShippingServiceOffer, 'id' | 'createdAt' | 'updatedAt' | 'stats'>[] = [
      {
        type: 'shipping_service',
        status: 'active',
        serviceType: 'express',
        title: 'خدمة الشحن السريع - توصيل خلال 24 ساعة',
        description: 'خدمة شحن سريعة وموثوقة مع تتبع مباشر للشحنات',
        coverage: ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة'],
        pricing: {
          basePrice: 15,
          pricePerKg: 3,
          pricePerKm: 0.5,
          fuelSurcharge: 2,
          currency: 'SAR'
        },
        deliveryTimes: {
          sameDay: true,
          nextDay: true,
          standard: '2-3 أيام',
          express: '24 ساعة'
        },
        services: {
          trackingIncluded: true,
          insuranceIncluded: true,
          signatureRequired: true,
          cashOnDelivery: true,
          fragmentHandling: true,
          temperatureControlled: false
        },
        shippingCompany: {
          id: 'SHIP001',
          name: 'شركة البرق للشحن',
          rating: 4.7,
          verified: true,
          license: 'LIC-2023-001',
          experience: '10 سنوات',
          fleet: {
            totalVehicles: 50,
            vehicleTypes: ['شاحنات صغيرة', 'فانات', 'دراجات نارية'],
            maxCapacity: '5 طن',
            specialEquipment: ['أجهزة تتبع GPS', 'نظام تبريد']
          }
        }
      }
    ];

    // إضافة البيانات التجريبية
    sampleOffers.forEach(offer => this.addSupplierOffer(offer));
    sampleRequests.forEach(request => this.addMerchantRequest(request));
    sampleServices.forEach(service => this.addShippingService(service));
  }
}

export const marketplaceManager = MarketplaceManager.getInstance();