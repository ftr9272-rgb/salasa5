// أنواع البيانات الخاصة بالسوق
export interface MarketPlace {
  id: string;
  type: 'supplier_offer' | 'merchant_request' | 'shipping_service';
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  expiryDate?: string;
}

// عروض الموردين
export interface SupplierOffer extends MarketPlace {
  type: 'supplier_offer';
  offerType: 'product' | 'service' | 'bundle';
  
  // معلومات المنتج/الخدمة
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  
  // التسعير والكمية
  price: number;
  currency: 'SAR' | 'USD' | 'EUR';
  minimumQuantity: number;
  availableQuantity: number;
  
  // معلومات التوصيل والشحن
  deliveryOptions: DeliveryOption[];
  shippingIncluded: boolean;
  
  // الجودة والمواصفات
  quality: 'premium' | 'standard' | 'economy';
  certifications: string[];
  specifications: { [key: string]: string };
  
  // معلومات المورد
  supplier: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
    responseTime: string; // "خلال ساعة", "خلال يوم"
    location: string;
  };
  
  // شروط العرض
  terms: {
    paymentMethods: string[];
    returnPolicy: string;
    warrantyPeriod?: string;
    bulkDiscounts?: BulkDiscount[];
  };
  
  // إحصائيات العرض
  stats: {
    views: number;
    inquiries: number;
    orders: number;
    satisfaction: number; // من 5
  };
}

// طلبات التجار
export interface MerchantRequest extends MarketPlace {
  type: 'merchant_request';
  requestType: 'product' | 'service' | 'custom';
  
  // معلومات الطلب
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  
  // المتطلبات
  requirements: {
    quantity: number;
    budget: {
      min: number;
      max: number;
      currency: 'SAR' | 'USD' | 'EUR';
    };
    deliveryDate: string;
    location: string;
    specifications?: { [key: string]: string };
  };
  
  // معلومات التاجر
  merchant: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
    location: string;
    businessType: string;
  };
  
  // معايير الاختيار
  selectionCriteria: {
    prioritizePrice: boolean;
    prioritizeQuality: boolean;
    prioritizeSpeed: boolean;
    requireCertification: boolean;
  };
  
  // العروض المستلمة
  receivedOffers: SupplierResponse[];
  
  // إحصائيات الطلب
  stats: {
    views: number;
    offers: number;
    avgOfferPrice: number;
  };
}

// خدمات الشحن
export interface ShippingServiceOffer extends MarketPlace {
  type: 'shipping_service';
  serviceType: 'express' | 'standard' | 'bulk' | 'special';
  
  // معلومات الخدمة
  title: string;
  description: string;
  coverage: string[];
  
  // التسعير
  pricing: {
    basePrice: number;
    pricePerKg: number;
    pricePerKm: number;
    fuelSurcharge: number;
    currency: 'SAR';
  };
  
  // أوقات التسليم
  deliveryTimes: {
    sameDay: boolean;
    nextDay: boolean;
    standard: string; // "2-3 أيام"
    express: string; // "24 ساعة"
  };
  
  // الخدمات المتاحة
  services: {
    trackingIncluded: boolean;
    insuranceIncluded: boolean;
    signatureRequired: boolean;
    cashOnDelivery: boolean;
    fragmentHandling: boolean;
    temperatureControlled: boolean;
  };
  
  // معلومات شركة الشحن
  shippingCompany: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
    license: string;
    experience: string;
    fleet: FleetInfo;
  };
  
  // إحصائيات الخدمة
  stats: {
    totalDeliveries: number;
    onTimeDelivery: number; // نسبة مئوية
    customerSatisfaction: number; // من 5
    avgDeliveryTime: string;
  };
}

// عرض رد من المورد على طلب التاجر
export interface SupplierResponse {
  id: string;
  requestId: string;
  supplierId: string;
  supplierName: string;
  
  // تفاصيل العرض
  offer: {
    price: number;
    quantity: number;
    deliveryDate: string;
    description: string;
    terms: string;
  };
  
  // حالة العرض
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  submittedAt: string;
  respondedAt?: string;
}

// خيارات التوصيل
export interface DeliveryOption {
  type: 'pickup' | 'delivery' | 'shipping';
  price: number;
  estimatedTime: string;
  description: string;
}

// خصومات الكمية
export interface BulkDiscount {
  minQuantity: number;
  discountPercentage: number;
}

// معلومات الأسطول
export interface FleetInfo {
  totalVehicles: number;
  vehicleTypes: string[];
  maxCapacity: string;
  specialEquipment: string[];
}

// فلاتر البحث المتقدمة
export interface MarketplaceFilters {
  // فلاتر عامة
  category?: string;
  priceRange?: { min: number; max: number };
  location?: string;
  rating?: number;
  verified?: boolean;
  
  // فلاتر خاصة بالموردين
  supplierFilters?: {
    quality?: 'premium' | 'standard' | 'economy';
    responseTime?: string;
    certifications?: string[];
  };
  
  // فلاتر خاصة بالتجار
  merchantFilters?: {
    budget?: { min: number; max: number };
    urgency?: 'urgent' | 'normal' | 'flexible';
    businessType?: string;
  };
  
  // فلاتر خاصة بالشحن
  shippingFilters?: {
    deliverySpeed?: 'same_day' | 'next_day' | 'standard';
    serviceType?: 'express' | 'standard' | 'bulk';
    coverage?: string;
  };
}

// إحصائيات السوق
export interface MarketplaceStats {
  totalOffers: number;
  totalRequests: number;
  totalServices: number;
  activeUsers: number;
  totalTransactions: number;
  avgResponseTime: string;
  successRate: number;
  categoriesData: CategoryStats[];
}

export interface CategoryStats {
  category: string;
  offers: number;
  requests: number;
  avgPrice: number;
  growth: number; // نسبة النمو
}