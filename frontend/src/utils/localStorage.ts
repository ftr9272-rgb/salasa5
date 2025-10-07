// مساعدات لإدارة البيانات المحلية
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  images: string[];
  sku: string;
  weight: string;
  dimensions: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  products: OrderProduct[];
  totalAmount: number;
  status: string;
  priority: 'عالية' | 'متوسطة' | 'منخفضة';
  deliveryAddress: string;
  deliveryDate: string;
  notes: string;
  createdAt: string;
}

export interface OrderProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  vehicleId?: string;
  status: 'نشط' | 'متاح' | 'مشغول' | 'غير متاح';
  rating: number;
  deliveries: number;
  todayEarnings: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  model: string;
  year: number;
  capacity: string;
  fuelType: string;
  driverId?: string;
  status: 'نشط' | 'صيانة' | 'غير متاح';
  insuranceExpiry: string;
  registrationExpiry: string;
  createdAt: string;
}

export interface MarketItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  images: string[];
  sku: string;
  weight: string;
  dimensions: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  type: 'product' | 'service' | 'offer';
  provider: {
    id: string;
    name: string;
    type: 'merchant' | 'supplier' | 'shipping_company';
    rating?: number;
    verified?: boolean;
  };
}

export interface MerchantOrder {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  merchant: {
    id: string;
    name: string;
    rating?: number;
    verified?: boolean;
  };
  // منتجات مرتبطة بالطلب (اختياري)
  products?: OrderProduct[];
  // خدمة الشحن المختارة إن وُجدت
  shippingServiceId?: string | null;
  // تاريخ النشر في السوق (إن نُشر)
  publishedAt?: string | null;
}

export interface ShippingService {
  id: string;
  name: string;
  description: string;
  pricePerKg: number;
  deliveryTime: string;
  coverage: string;
  rating?: number;
  verified?: boolean;
  provider: {
    id: string;
    name: string;
    type: 'merchant' | 'supplier' | 'shipping_company';
  };
  category: string;
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  // canonical types used across the app
  type?: 'retailer' | 'supplier' | 'shipping_company' | string;
  city?: string;
  category?: string;
  createdAt: string;
}

// مساعدات للتخزين المحلي
export const storage = {
  // منتجات
  getProducts: (): Product[] => {
    const products = localStorage.getItem('business_products');
    return products ? JSON.parse(products) : [];
  },

  addProduct: (product: Omit<Product, 'id' | 'createdAt'>): Product => {
    const products = storage.getProducts();
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    localStorage.setItem('business_products', JSON.stringify(products));
    try {
      console.debug('[storage] addProduct -> dispatching products-updated', newProduct);
      // notify same-window listeners that products changed
      window.dispatchEvent(new CustomEvent('products-updated', { detail: { product: newProduct } }));
    } catch (e) {
      // ignore in non-window environments
    }
    return newProduct;
  },

  updateProduct: (id: string, updates: Partial<Product>): Product | null => {
    const products = storage.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    products[index] = { ...products[index], ...updates };
    localStorage.setItem('business_products', JSON.stringify(products));
    return products[index];
  },

  deleteProduct: (id: string): boolean => {
    const products = storage.getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    localStorage.setItem('business_products', JSON.stringify(filteredProducts));
    return filteredProducts.length !== products.length;
  },

  // طلبات
  getOrders: (): Order[] => {
    const orders = localStorage.getItem('business_orders');
    return orders ? JSON.parse(orders) : [];
  },

  addOrder: (order: Omit<Order, 'id' | 'createdAt'>): Order => {
    const orders = storage.getOrders();
    const newOrder: Order = {
      ...order,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    localStorage.setItem('business_orders', JSON.stringify(orders));
    return newOrder;
  },

  updateOrder: (id: string, updates: Partial<Order>): Order | null => {
    const orders = storage.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    
    orders[index] = { ...orders[index], ...updates };
    localStorage.setItem('business_orders', JSON.stringify(orders));
    return orders[index];
  },

  // سائقين
  getDrivers: (): Driver[] => {
    const drivers = localStorage.getItem('business_drivers');
    return drivers ? JSON.parse(drivers) : [];
  },

  addDriver: (driver: Omit<Driver, 'id' | 'createdAt'>): Driver => {
    const drivers = storage.getDrivers();
    const newDriver: Driver = {
      ...driver,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    drivers.push(newDriver);
    localStorage.setItem('business_drivers', JSON.stringify(drivers));
    return newDriver;
  },

  updateDriver: (id: string, updates: Partial<Driver>): Driver | null => {
    const drivers = storage.getDrivers();
    const index = drivers.findIndex(d => d.id === id);
    if (index === -1) return null;
    
    drivers[index] = { ...drivers[index], ...updates };
    localStorage.setItem('business_drivers', JSON.stringify(drivers));
    return drivers[index];
  },

  // مركبات
  getVehicles: (): Vehicle[] => {
    const vehicles = localStorage.getItem('business_vehicles');
    return vehicles ? JSON.parse(vehicles) : [];
  },

  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>): Vehicle => {
    const vehicles = storage.getVehicles();
    const newVehicle: Vehicle = {
      ...vehicle,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    vehicles.push(newVehicle);
    localStorage.setItem('business_vehicles', JSON.stringify(vehicles));
    return newVehicle;
  },

  updateVehicle: (id: string, updates: Partial<Vehicle>): Vehicle | null => {
    const vehicles = storage.getVehicles();
    const index = vehicles.findIndex(v => v.id === id);
    if (index === -1) return null;
    
    vehicles[index] = { ...vehicles[index], ...updates };
    localStorage.setItem('business_vehicles', JSON.stringify(vehicles));
    return vehicles[index];
  },

  // منتجات السوق المشترك
  getMarketItems: (): MarketItem[] => {
    const marketItems = localStorage.getItem('business_market_items');
    return marketItems ? JSON.parse(marketItems) : [];
  },

  addMarketItem: (item: Omit<MarketItem, 'id' | 'createdAt'>): MarketItem => {
    const marketItems = storage.getMarketItems();
    const newItem: MarketItem = {
      ...item,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    marketItems.push(newItem);
    localStorage.setItem('business_market_items', JSON.stringify(marketItems));
    try {
      console.debug('[storage] addMarketItem -> dispatching market-updated', newItem);
      // notify other parts of the app in the same window
      window.dispatchEvent(new CustomEvent('market-updated', { detail: { item: newItem } }));
    } catch (e) {
      // ignore if window isn't available (SSR or test env)
    }
    return newItem;
  },

  // طلبات التجار
  getMerchantOrders: (): MerchantOrder[] => {
    const orders = localStorage.getItem('business_merchant_orders');
    return orders ? JSON.parse(orders) : [];
  },

  addMerchantOrder: (order: Omit<MerchantOrder, 'id' | 'createdAt'>): MerchantOrder => {
    const orders = storage.getMerchantOrders();
    const newOrder: MerchantOrder = {
      ...order,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    localStorage.setItem('business_merchant_orders', JSON.stringify(orders));
    return newOrder;
  },
  updateMerchantOrder: (id: string, updates: Partial<MerchantOrder>): MerchantOrder | null => {
    const orders = storage.getMerchantOrders();
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) return null;
    orders[idx] = { ...orders[idx], ...updates };
    localStorage.setItem('business_merchant_orders', JSON.stringify(orders));
    return orders[idx];
  },

  // خدمات الشحن
  getShippingServices: (): ShippingService[] => {
    const services = localStorage.getItem('business_shipping_services');
    return services ? JSON.parse(services) : [];
  },

  addShippingService: (service: Omit<ShippingService, 'id' | 'createdAt'>): ShippingService => {
    const services = storage.getShippingServices();
    const newService: ShippingService = {
      ...service,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    services.push(newService);
    localStorage.setItem('business_shipping_services', JSON.stringify(services));
    try {
      // notify other parts of the app in the same window
      window.dispatchEvent(new CustomEvent('market-updated', { detail: { item: newService } }));
    } catch (e) {
      // ignore if window isn't available (SSR or test env)
    }
    return newService;
  },

  // مسح جميع البيانات
  clearAll: (): void => {
    localStorage.removeItem('business_products');
    localStorage.removeItem('business_orders');
    localStorage.removeItem('business_drivers');
    localStorage.removeItem('business_vehicles');
    localStorage.removeItem('business_market_items');
    localStorage.removeItem('business_merchant_orders');
    localStorage.removeItem('business_shipping_services');
    localStorage.removeItem('supplier_partners');
  },

  // شركاء المورد
  getPartners: (): Partner[] => {
    const raw = localStorage.getItem('supplier_partners');
    if (!raw) return [];
    try {
      const parsed: Partner[] = JSON.parse(raw);
      const normalize = (t?: string) => {
        if (!t) return t;
        switch (t) {
          case 'تاجر تجزئة': return 'retailer';
          case 'شركة شحن': return 'shipping_company';
          case 'مورد': return 'supplier';
          default: return t;
        }
      };
      const normalized = parsed.map(p => ({ ...p, type: normalize(p.type) }));
      // if any normalization occurred, persist the normalized array
      if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
        localStorage.setItem('supplier_partners', JSON.stringify(normalized));
      }
      return normalized;
    } catch (e) {
      console.error('[storage] failed to parse supplier_partners', e);
      return [];
    }
  },

  addPartner: (p: Omit<Partner, 'id' | 'createdAt'>): Partner => {
    const partners = storage.getPartners();
    const newPartner: Partner = {
      ...p,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    partners.push(newPartner);
    localStorage.setItem('supplier_partners', JSON.stringify(partners));
    return newPartner;
  },

  deletePartner: (id: string): boolean => {
    const partners = storage.getPartners();
    const filtered = partners.filter(p => p.id !== id);
    localStorage.setItem('supplier_partners', JSON.stringify(filtered));
    return filtered.length !== partners.length;
  },

  // Function to clear and re-seed market data
  resetMarketData: (): void => {
    localStorage.removeItem('business_market_items');
    localStorage.removeItem('business_merchant_orders');
    localStorage.removeItem('business_shipping_services');
    seedMarketData();
  },

  // إحصائيات
  getStats: () => {
    const products = storage.getProducts();
    const orders = storage.getOrders();
    const drivers = storage.getDrivers();
    const vehicles = storage.getVehicles();

    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
      new Date(order.createdAt).toDateString() === today
    );

    return {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.status === 'active').length,
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      pendingOrders: orders.filter(o => o.status === 'جديد' || o.status === 'قيد المراجعة').length,
      totalDrivers: drivers.length,
      activeDrivers: drivers.filter(d => d.status === 'نشط' || d.status === 'متاح').length,
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter(v => v.status === 'نشط').length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      todayRevenue: todayOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    };
  }
};

// مولد معرفات فريدة
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// بيانات تجريبية
export const seedData = () => {
  // إضافة بيانات تجريبية إذا لم تكن موجودة
  if (storage.getProducts().length === 0) {
    const sampleProducts: Omit<Product, 'id' | 'createdAt'>[] = [
      {
        name: 'هاتف ذكي آيفون 15',
        price: 4000,
        stock: 25,
        category: 'إلكترونيات',
        description: 'أحدث هاتف ذكي من آبل بتقنيات متطورة',
        images: [],
        sku: 'IP15-001',
        weight: '0.2 كج',
        dimensions: '15×7×0.8 سم',
        status: 'active'
      },
      {
        name: 'لابتوب ديل XPS 13',
        price: 5500,
        stock: 15,
        category: 'إلكترونيات',
        description: 'لابتوب عالي الأداء للمحترفين',
        images: [],
        sku: 'DL-XPS13',
        weight: '1.2 كج',
        dimensions: '30×21×1.5 سم',
        status: 'active'
      }
    ];

    sampleProducts.forEach(product => storage.addProduct(product));
  }

  if (storage.getOrders().length === 0) {
    const sampleOrders: Omit<Order, 'id' | 'createdAt'>[] = [
      {
        customerId: 'cust001',
        customerName: 'أحمد محمد',
        customerEmail: 'ahmed@example.com',
        customerPhone: '0501234567',
        products: [
          { productId: 'prod001', name: 'هاتف ذكي', price: 4000, quantity: 1 }
        ],
        totalAmount: 4000,
        status: 'جديد',
        priority: 'عالية',
        deliveryAddress: 'الرياض، حي النرجس، شارع الملك فهد',
        deliveryDate: '2024-01-20',
        notes: 'توصيل سريع مطلوب'
      }
    ];

    sampleOrders.forEach(order => storage.addOrder(order));
  }

  // Always seed market data to ensure we have the latest dummy data
  seedMarketData();
};

// بيانات تجريبية للسوق
export const seedMarketData = () => {
  // Always re-seed market data to ensure we have the latest dummy data
  // Clear existing data
  localStorage.removeItem('business_market_items');
  localStorage.removeItem('business_merchant_orders');
  localStorage.removeItem('business_shipping_services');
  
  const sampleMarketItems: Omit<MarketItem, 'id' | 'createdAt'>[] = [
    {
      name: 'هاتف ذكي آيفون 15',
      price: 4000,
      stock: 25,
      category: 'إلكترونيات',
      description: 'أحدث هاتف ذكي من آبل بتقنيات متطورة',
      images: [],
      sku: 'IP15-001',
      weight: '0.2 كج',
      dimensions: '15×7×0.8 سم',
      status: 'active',
      type: 'product',
      provider: {
        id: 'provider_1',
        name: 'شركة التوريد المتقدم',
        type: 'supplier',
        rating: 4.8,
        verified: true
      }
    },
    {
      name: 'لابتوب ديل XPS 13',
      price: 5500,
      stock: 15,
      category: 'إلكترونيات',
      description: 'لابتوب عالي الأداء للمحترفين',
      images: [],
      sku: 'DL-XPS13',
      weight: '1.2 كج',
      dimensions: '30×21×1.5 سم',
      status: 'active',
      type: 'product',
      provider: {
        id: 'provider_2',
        name: 'معرض الأجهزة الذكية',
        type: 'merchant',
        rating: 4.6,
        verified: true
      }
    },
    {
      name: 'ساعة ذكية سامسونج',
      price: 1200,
      stock: 30,
      category: 'إلكترونيات',
      description: 'ساعة ذكية بتصميم أنيق وميزات متقدمة',
      images: [],
      sku: 'SS-GW1',
      weight: '0.1 كج',
      dimensions: '4×4×1 سم',
      status: 'active',
      type: 'product',
      provider: {
        id: 'provider_3',
        name: 'متجر الإلكترونيات الحديثة',
        type: 'merchant',
        rating: 4.5,
        verified: true
      }
    },
    {
      name: 'سماعة بلوتوث جودة عالية',
      price: 350,
      stock: 50,
      category: 'إلكترونيات',
      description: 'سماعة بلوتوث بجودة صوت ممتازة وبطارية تدوم حتى 20 ساعة',
      images: [],
      sku: 'BT-HQ1',
      weight: '0.3 كج',
      dimensions: '8×8×3 سم',
      status: 'active',
      type: 'product',
      provider: {
        id: 'provider_4',
        name: 'شركة الصوت الرقمي',
        type: 'supplier',
        rating: 4.7,
        verified: true
      }
    },
    // Additional products
    {
      name: 'طقم أثاث مكتبي حديث',
      price: 8500,
      stock: 10,
      category: 'أثاث',
      description: 'طقم أثاث مكتبي مكون من مكتب وكرسي ومكتبة بتصميم عصري',
      images: [],
      sku: 'OF-MOD1',
      weight: '40 كج',
      dimensions: '200×100×75 سم',
      status: 'active',
      type: 'product',
      provider: {
        id: 'provider_5',
        name: 'أثاث المكاتب الراقية',
        type: 'supplier',
        rating: 4.6,
        verified: true
      }
    },
    {
      name: 'آلة تصوير ليزرية متعددة الوظائف',
      price: 12000,
      stock: 5,
      category: 'معدات مكتبية',
      description: 'آلة تصوير ليزرية بسرعة عالية ووظائف متعددة including الطباعة والنسخ وال掃ان',
      images: [],
      sku: 'PR-CAN1',
      weight: '25 كج',
      dimensions: '60×50×40 سم',
      status: 'active',
      type: 'product',
      provider: {
        id: 'provider_6',
        name: 'محل المعدات المكتبية المتخصصة',
        type: 'merchant',
        rating: 4.4,
        verified: true
      }
    },
    {
      name: 'مجموعة أدوات كهربائية احترافية',
      price: 3200,
      stock: 20,
      category: 'أدوات',
      description: 'مجموعة مكونة من 50 أداة كهربائية بجودة عالية وضمان 2 سنة',
      images: [],
      sku: 'TL-PRO1',
      weight: '15 كج',
      dimensions: '40×30×20 سم',
      status: 'active',
      type: 'product',
      provider: {
        id: 'provider_7',
        name: 'متجر الأدوات الاحترافية',
        type: 'supplier',
        rating: 4.7,
        verified: true
      }
    }
  ];

  sampleMarketItems.forEach(item => storage.addMarketItem(item));

  const sampleOrders: Omit<MerchantOrder, 'id' | 'createdAt'>[] = [
    {
      title: 'طلب شراء أجهزة محمولة',
      description: 'نحتاج إلى شراء 50 جهاز محمول للاستخدام في مشاريعنا',
      category: 'إلكترونيات',
      budget: 150000,
      deadline: '2024-02-15',
      status: 'open',
      merchant: {
        id: 'merchant_1',
        name: 'شركة التقنية الحديثة',
        rating: 4.8,
        verified: true
      }
    },
    {
      title: 'طلب مواد مكتبية',
      description: 'نحتاج إلى شراء مواد مكتبية للعام الجديد',
      category: 'مواد مكتبية',
      budget: 25000,
      deadline: '2024-01-30',
      status: 'open',
      merchant: {
        id: 'merchant_2',
        name: 'معرض المكاتب الحديثة',
        rating: 4.5,
        verified: true
      }
    },
    {
      title: 'طلب معدات طبية',
      description: 'نحتاج إلى شراء معدات طبية مختبرية',
      category: 'معدات طبية',
      budget: 500000,
      deadline: '2024-03-01',
      status: 'open',
      merchant: {
        id: 'merchant_3',
        name: 'شركة الأدوية المتقدمة',
        rating: 4.9,
        verified: true
      }
    },
    // Additional orders
    {
      title: 'طلب أثاث مكتبي',
      description: 'نحتاج إلى تجهيز مكتب جديد بأثاث حديث وعملي',
      category: 'أثاث',
      budget: 45000,
      deadline: '2024-02-28',
      status: 'open',
      merchant: {
        id: 'merchant_4',
        name: 'شركة الاستشارات المكتبية',
        rating: 4.6,
        verified: true
      }
    },
    {
      title: 'طلب معدات بناء',
      description: 'نحتاج إلى شراء معدات بناء ثقيلة لمشروعنا الجديد',
      category: 'معدات بناء',
      budget: 1200000,
      deadline: '2024-04-15',
      status: 'open',
      merchant: {
        id: 'merchant_5',
        name: 'شركة البناء المتقدمة',
        rating: 4.8,
        verified: true
      }
    }
  ];

  sampleOrders.forEach(order => storage.addMerchantOrder(order));

  const sampleServices: Omit<ShippingService, 'id' | 'createdAt'>[] = [
    {
      name: 'خدمة شحن سريعة',
      description: 'توصيل خلال 24 ساعة لجميع أنحاء المملكة',
      pricePerKg: 15,
      deliveryTime: '24 ساعة',
      coverage: 'جميع أنحاء المملكة',
      rating: 4.8,
      verified: true,
      provider: {
        id: 'shipping_1',
        name: 'شركة الشحن السريع',
        type: 'shipping_company'
      },
      category: 'خدمة شحن'
    },
    {
      name: 'خدمة شحن دولية',
      description: 'توصيل دولي آمن وسريع',
      pricePerKg: 25,
      deliveryTime: '3-5 أيام',
      coverage: 'العالم',
      rating: 4.7,
      verified: true,
      provider: {
        id: 'shipping_2',
        name: 'العالمية للشحن',
        type: 'shipping_company'
      },
      category: 'خدمة شحن'
    },
    {
      name: 'خدمة شحن اقتصادية',
      description: 'توصيل اقتصادي بأسعار تنافسية',
      pricePerKg: 8,
      deliveryTime: '5-7 أيام',
      coverage: 'المناطق الرئيسية',
      rating: 4.5,
      verified: true,
      provider: {
        id: 'shipping_3',
        name: 'الشحن الاقتصادي',
        type: 'shipping_company'
      },
      category: 'خدمة شحن'
    },
    // Additional shipping services
    {
      name: 'خدمة شحن ممتازة',
      description: 'توصيل ممتاز مع تتبع مباشر وتأمين على البضائع',
      pricePerKg: 20,
      deliveryTime: '48 ساعة',
      coverage: 'جميع أنحاء المملكة والخليج',
      rating: 4.9,
      verified: true,
      provider: {
        id: 'shipping_4',
        name: 'الshipping الممتاز',
        type: 'shipping_company'
      },
      category: 'خدمة شحن'
    },
    {
      name: 'خدمة شحن.same-day',
      description: 'توصيل في نفس اليوم للطلبات المقدمة قبل الساعة 12 ظهراً',
      pricePerKg: 35,
      deliveryTime: 'same-day',
      coverage: 'الرياض وجدة والدمام',
      rating: 4.8,
      verified: true,
      provider: {
        id: 'shipping_5',
        name: 'الشحن السريع.same-day',
        type: 'shipping_company'
      },
      category: 'خدمة شحن'
    }
  ];

  sampleServices.forEach(service => storage.addShippingService(service));
};
