import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Heart, 
  Shuffle, 
  Star,
  Package,
  Building2,
  Truck,
  Zap,
  Smartphone,
  Shirt,
  Coffee,
  Home,
  Car,
  Dumbbell,
  Briefcase,
  User,
  UserCog,
  ShoppingCart,
  Bell,
  Moon,
  ArrowLeft,
  Factory,
  MessageCircle,
  Phone,
  FileText,
  Share2,
  Calendar,
  MapPin,
  Plus,
  Users,
  Handshake,
  Building,
  TruckIcon,
  Store
} from 'lucide-react';

const SmartMarketplace = ({ userType, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [selectedPartnerType, setSelectedPartnerType] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [partnerContact, setPartnerContact] = useState('');

  // استخدام userType من props مباشرة
  const currentUserType = userType || 'merchant';

  // Enhanced Categories Data
  const categories = [
    { id: 'all', name: 'جميع الفئات', count: '1000+', icon: Package },
    { id: 'electronics', name: 'الإلكترونيات', count: '245+', icon: Smartphone },
    { id: 'industrial', name: 'الصناعية', count: '180+', icon: Factory },
    { id: 'textiles', name: 'الأقمشة والنسيج', count: '320+', icon: Shirt },
    { id: 'medical', name: 'الطبية', count: '150+', icon: Heart },
    { id: 'automotive', name: 'السيارات', count: '200+', icon: Car },
    { id: 'construction', name: 'البناء والتشييد', count: '120+', icon: Home },
    { id: 'services', name: 'الخدمات', count: '90+', icon: Truck }
  ];

  const userTypes = [
    { id: 'supplier', name: 'مورد', icon: Building2 },
    { id: 'merchant', name: 'تاجر', icon: ShoppingCart },
    { id: 'shipping', name: 'شركة شحن', icon: Truck }
  ];

  const partnerTypes = [
    { id: 'supplier', name: 'مورد معتمد', icon: Building },
    { id: 'merchant', name: 'تاجر موثوق', icon: Store },
    { id: 'shipping', name: 'شركة شحن', icon: TruckIcon },
    { id: 'distributor', name: 'موزع', icon: Package },
    { id: 'manufacturer', name: 'مصنع', icon: Factory },
    { id: 'service_provider', name: 'مزود خدمة', icon: Handshake }
  ];

  // Products organized by user type
  const userSpecificData = {
    supplier: {
      products: [
        {
          id: 5,
          name: 'عرض منتجات التصنيع المتطورة',
          supplier: 'مصنع الدقة الصناعية',
          price: '8,500',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1565792668941-c1a5e9c6ce83?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'عرض مورد',
          userType: 'supplier',
          category: 'industrial'
        },
        {
          id: 6,
          name: 'منتج جديد - مواد خام متقدمة',
          supplier: 'موردي المواد الأساسية',
          price: '2,100',
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'منتج جديد',
          userType: 'supplier',
          category: 'electronics'
        },
        {
          id: 11,
          name: 'أقمشة فاخرة للمصانع',
          supplier: 'مصانع النسيج الحديثة',
          price: '1,200',
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'جودة عالية',
          userType: 'supplier',
          category: 'textiles'
        },
        {
          id: 12,
          name: 'معدات طبية متخصصة',
          supplier: 'الشركة الطبية المتقدمة',
          price: '15,000',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'معتمد طبياً',
          userType: 'supplier',
          category: 'medical'
        },
        {
          id: 13,
          name: 'مكونات السيارات الأصلية',
          supplier: 'قطع غيار السيارات',
          price: '3,500',
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'أصلي',
          userType: 'supplier',
          category: 'automotive'
        },
        {
          id: 14,
          name: 'أدوات البناء المتطورة',
          supplier: 'شركة البناء الذكية',
          price: '5,800',
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'متين',
          userType: 'supplier',
          category: 'construction'
        }
      ]
    },
    merchant: {
      products: [
        {
          id: 7,
          name: 'طلب شراء - نظام نقاط بيع',
          supplier: 'مطلوب من التجار',
          price: '4,200',
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'طلب شراء',
          userType: 'merchant',
          category: 'electronics'
        },
        {
          id: 8,
          name: 'طلب شحن - حلول الدفع',
          supplier: 'يحتاج خدمة شحن',
          price: '1,800',
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'طلب شحن',
          userType: 'merchant',
          category: 'services'
        },
        {
          id: 15,
          name: 'طلب شراء - أجهزة صناعية',
          supplier: 'التاجر المحترف',
          price: '12,000',
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'طلب عاجل',
          userType: 'merchant',
          category: 'industrial'
        },
        {
          id: 16,
          name: 'طلب ملابس بالجملة',
          supplier: 'متجر الأزياء الكبير',
          price: '8,500',
          rating: 4.4,
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'بالجملة',
          userType: 'merchant',
          category: 'textiles'
        },
        {
          id: 17,
          name: 'طلب معدات طبية',
          supplier: 'صيدلية الحي',
          price: '6,200',
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'مستعجل',
          userType: 'merchant',
          category: 'medical'
        },
        {
          id: 18,
          name: 'طلب قطع سيارات',
          supplier: 'ورشة السيارات الحديثة',
          price: '2,900',
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'ضروري',
          userType: 'merchant',
          category: 'automotive'
        }
      ]
    },
    shipping: {
      products: [
        {
          id: 9,
          name: 'عرض خدمة شحن سريع',
          supplier: 'أسطول النقل المتطور',
          price: '85',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'عرض خدمة',
          userType: 'shipping',
          category: 'services'
        },
        {
          id: 10,
          name: 'خدمة تتبع متطورة',
          supplier: 'تقنيات التتبع الذكية',
          price: '32',
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'خدمة مميزة',
          userType: 'shipping',
          category: 'electronics'
        },
        {
          id: 19,
          name: 'شحن المعدات الثقيلة',
          supplier: 'شركة الشحن الصناعي',
          price: '450',
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'شحن ثقيل',
          userType: 'shipping',
          category: 'industrial'
        },
        {
          id: 20,
          name: 'توصيل الأدوية الطبية',
          supplier: 'خدمة التوصيل الطبي',
          price: '25',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'سري ومؤمن',
          userType: 'shipping',
          category: 'medical'
        },
        {
          id: 21,
          name: 'نقل السيارات',
          supplier: 'شاحنات نقل السيارات',
          price: '320',
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'نقل آمن',
          userType: 'shipping',
          category: 'automotive'
        },
        {
          id: 22,
          name: 'شحن المواد الحساسة',
          supplier: 'النقل المتخصص',
          price: '180',
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          badge: 'حساس',
          userType: 'shipping',
          category: 'textiles'
        }
      ]
    }
  };

  // منطق عرض المنتجات حسب نوع المستخدم
  const getAllProductsForUser = () => {
    if (currentUserType === 'shipping') {
      // شركات الشحن ترى فقط طلبات الشحن من التجار
      return userSpecificData.merchant.products.filter(product => 
        product.badge === 'طلب شحن' || product.name.includes('شحن')
      );
    } else {
      // التجار والموردون يرون جميع المنتجات
      return [
        ...userSpecificData.supplier.products,
        ...userSpecificData.merchant.products,
        ...userSpecificData.shipping.products
      ];
    }
  };

  const allProducts = getAllProductsForUser();
  const currentProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white font-cairo" dir="rtl">
      {/* Enhanced Header */}
      <header className="bg-white shadow-lg relative overflow-hidden border-b-2 border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">العودة</span>
            </button>

            {/* Logo & Brand */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-800">أعمالي</h1>
                <p className="text-xs text-gray-600">منصة الأعمال الاحترافية</p>
              </div>
            </div>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-2">
              <button className="nav-link active bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">السوق</button>
              <button className="nav-link text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg transition-colors">الموردون</button>
              <button className="nav-link text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg transition-colors">التجار</button>
              <button className="nav-link text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg transition-colors">الشحن</button>
            </nav>
            
            {/* Action Buttons & User Profile */}
            <div className="flex items-center gap-4">
              {/* User Type Indicator */}
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {userTypes.find(u => u.id === currentUserType)?.name}
                </span>
              </div>
              
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Moon className="w-5 h-5 text-gray-600" />
              </button>
              
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center">2</span>
              </button>
              
              <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">أ</span>
                </div>
                <span className="hidden sm:inline text-white font-medium">أحمد</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Compact Hero Section */}
        <section className="relative mb-12 rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50"></div>
          <div className="relative px-6 py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-slate-900">
              منصة أعمالي - السوق الذكي
            </h1>
            <p className="text-lg mb-8 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              منصة متطورة تجمع كبار الموردين والتجار وشركات الشحن المعتمدة
            </p>
            
            {/* Advanced Search Bar */}
            <div className="mb-8 max-w-xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="ابحث عن المنتجات، الموردين، أو الخدمات..."
                  className="block w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    بحث
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors">
                  أدوات صناعية
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 transition-colors">
                  شحن سريع
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 cursor-pointer hover:bg-purple-200 transition-colors">
                  معدات طبية
                </span>
              </div>
            </div>
            
            {/* Compact Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">{[
                { number: '500+', label: 'مورد معتمد', icon: '🏪', color: 'bg-gradient-to-br from-blue-50 to-blue-100' },
                { number: '1000+', label: 'تاجر نشط', icon: '🛒', color: 'bg-gradient-to-br from-green-50 to-green-100' },
                { number: '50+', label: 'شركة شحن', icon: '🚚', color: 'bg-gradient-to-br from-purple-50 to-purple-100' },
                { number: '10K+', label: 'معاملة يومية', icon: '📊', color: 'bg-gradient-to-br from-orange-50 to-orange-100' }
              ].map((stat, index) => (
                <div key={index} className={`${stat.color} rounded-xl p-3 border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1`}>
                  <div className="text-center">
                    <div className="text-lg mb-1">{stat.icon}</div>
                    <div className="text-xl font-black text-slate-800 mb-1">{stat.number}</div>
                    <div className="text-slate-600 text-xs font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* Compact Sidebar - Categories */}
          <aside className="lg:w-72 w-full">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 sticky top-6">
              <div className="mb-5">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  فئات المنتجات
                </h3>
                <p className="text-sm text-slate-500">
                  اختر الفئة المناسبة لك
                </p>
              </div>
              
              <div className="space-y-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  const isSelected = selectedCategory === category.id;
                  return (
                    <div
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`group relative rounded-lg p-3 cursor-pointer transition-all duration-300 border ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'bg-slate-50 hover:bg-blue-50 border-transparent hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm ${
                          isSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white group-hover:bg-blue-100'
                        }`}>
                          <IconComponent className={`w-5 h-5 transition-colors duration-300 ${
                            isSelected 
                              ? 'text-white' 
                              : 'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-sm font-bold transition-colors ${
                            isSelected 
                              ? 'text-blue-700' 
                              : 'text-slate-700 group-hover:text-blue-600'
                          }`}>
                            {category.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">{category.count} منتج</p>
                        </div>
                        <div className={`transition-opacity duration-300 ${
                          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Filter Section */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <h4 className="text-lg font-bold text-slate-800 mb-4">فلترة النتائج</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">السعر</span>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                      تخصيص
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">التقييم</span>
                    <div className="flex space-x-1 space-x-reverse">
                      {[1,2,3,4,5].map(star => (
                        <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Products */}
          <main className="flex-1">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-bold text-slate-800">
                    منتجات مختارة لـ {userTypes.find(u => u.id === currentUserType)?.name}
                  </h3>
                  <p className="text-slate-600 mt-2">
                    {currentProducts.length} منتج متاح
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>ترتيب حسب: الأحدث</option>
                    <option>ترتيب حسب: السعر</option>
                    <option>ترتيب حسب: التقييم</option>
                  </select>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button className="p-2 rounded-md bg-white shadow-sm">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-md">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {currentProducts.map((product) => (
                <div key={product.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1">
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        {product.badge}
                      </span>
                    </div>
                    
                    {/* Heart Button */}
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110 hover:bg-white">
                      <Heart className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors" />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Header with Rating and Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 pr-3">
                        <h4 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight mb-2">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            product.userType === 'supplier' ? 'bg-green-100 text-green-700' :
                            product.userType === 'merchant' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {product.userType === 'supplier' ? 'عرض مورد' :
                             product.userType === 'merchant' ? 'طلب تاجر' :
                             'خدمة شحن'}
                          </span>
                          {product.badge.includes('عاجل') || product.badge.includes('مستعجل') && (
                            <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-red-700 animate-pulse">
                              عاجل
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        <Star className="w-4 h-4 text-blue-500 fill-current" />
                        <span className="text-sm font-bold text-blue-700 mr-1">{product.rating}</span>
                      </div>
                    </div>
                    
                    {/* Supplier Info */}
                    <div className="mb-4">
                      <p className="text-slate-600 text-sm font-medium">{product.supplier}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {product.userType === 'shipping' ? 'خدمة محلية' : 'الرياض'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {product.userType === 'shipping' ? 'متاح الآن' : 'متاح'}
                        </span>
                        {product.userType === 'merchant' && (
                          <span className="flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            شحن مطلوب
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Interactive Actions */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <div className="grid grid-cols-2 gap-2">
                        <button className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          محادثة
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                          <Phone className="w-4 h-4" />
                          اتصال
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                          <FileText className="w-4 h-4" />
                          طلب عرض
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                          <Share2 className="w-4 h-4" />
                          مشاركة
                        </button>
                      </div>
                      {product.userType === 'shipping' && (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <button className="flex items-center justify-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                            <Calendar className="w-4 h-4" />
                            جدولة
                          </button>
                          <button className="flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                            <MapPin className="w-4 h-4" />
                            تتبع
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Price and Main Action */}
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <span className="font-black text-2xl text-slate-800">
                          {product.price}
                        </span>
                        <span className="text-sm font-normal text-slate-600 mr-1">ر.س</span>
                      </div>
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 hover:bg-blue-700">
                        {product.userType === 'supplier' ? 'عرض المنتج' : 
                         product.userType === 'merchant' ? 'استجابة للطلب' : 
                         'تقديم عرض'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </main>

      {/* Partner Modal */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl transform transition-all duration-300 scale-95 animate-scaleIn">
            <button 
              onClick={() => setShowPartnerModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">إضافة شريك جديد</h3>
              <p className="text-gray-600">اختر نوع الشريك وأدخل المعلومات المطلوبة</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع الشريك</label>
                <div className="grid grid-cols-2 gap-3">
                  {partnerTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedPartnerType(type.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedPartnerType === type.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                        selectedPartnerType === type.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <type.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم الشريك</label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="أدخل اسم الشريك"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">معلومات الاتصال</label>
                <input
                  type="text"
                  value={partnerContact}
                  onChange={(e) => setPartnerContact(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="رقم الهاتف أو البريد الإلكتروني"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowPartnerModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    // هنا يمكن إضافة منطق حفظ الشريك
                    console.log('إضافة شريك:', { type: selectedPartnerType, name: partnerName, contact: partnerContact });
                    setShowPartnerModal(false);
                    // إعادة تعيين الحقول
                    setSelectedPartnerType('');
                    setPartnerName('');
                    setPartnerContact('');
                  }}
                  disabled={!selectedPartnerType || !partnerName || !partnerContact}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    !selectedPartnerType || !partnerName || !partnerContact
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  إضافة الشريك
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SmartMarketplace;
