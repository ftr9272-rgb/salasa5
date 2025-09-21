import React, { useState, useEffect } from 'react';
// motion is used via JSX tags (e.g. <motion.div />); ESLint's no-unused-vars may false-positive here
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const SmartMarketplace = ({ userType, onBack }) => {
  const [activeView, setActiveView] = useState(userType || 'merchant');

  const switchUserType = (type) => {
    setActiveView(type);
  };

  const [supplierQuery, setSupplierQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(supplierQuery.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [supplierQuery]);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">السوق الذكي</h1>
                <p className="text-white/80 text-sm">اكتشف الفرص التجارية المناسبة لك</p>
              </div>
            </div>
            
            {/* User Type Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => switchUserType('merchant')}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  activeView === 'merchant' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                تاجر التجزئة
              </button>
              <button
                onClick={() => switchUserType('supplier')}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  activeView === 'supplier' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                مورد
              </button>
              <button
                onClick={() => switchUserType('shipping')}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  activeView === 'shipping' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                شركة شحن
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Merchant View */}
        {activeView === 'merchant' && (
          <motion.div {...fadeIn}>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">مرحباً بك في السوق</h2>
              <p className="text-gray-600">اكتشف أفضل الموردين والمنتجات وخدمات الشحن</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Suppliers Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      الموردين المتاحين
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">24 مورد نشط</span>
                      <input
                        aria-label="ابحث في الموردين"
                        placeholder="ابحث عن مورد أو فئة..."
                        value={supplierQuery}
                        onChange={(e) => setSupplierQuery(e.target.value)}
                        className="text-sm px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(
                      [
                        { name: 'مؤسسة الأصيل التجارية', category: 'إلكترونيات ومعدات', rating: 4.8, reviews: 127, products: 156, color: 'from-green-400 to-emerald-500', tags: ['توصيل سريع', 'أسعار منافسة'] },
                        { name: 'شركة النور للمواد الغذائية', category: 'مواد غذائية ومشروبات', rating: 4.6, reviews: 89, products: 243, color: 'from-blue-400 to-indigo-500', tags: ['جودة عالية', 'خصومات كمية'] },
                        { name: 'معرض الأناقة للملابس', category: 'ملابس وإكسسوارات', rating: 4.9, reviews: 203, products: 89, color: 'from-purple-400 to-pink-500', tags: ['أحدث الموضة', 'عروض موسمية'] },
                        { name: 'مستودع البناء المتطور', category: 'مواد بناء وأدوات', rating: 4.7, reviews: 156, products: 312, color: 'from-orange-400 to-red-500', tags: ['مخزون كبير', 'ضمان الجودة'] }
                      ]
                    )
                      .filter((s) => {
                        if (!debouncedQuery) return true;
                        return (
                          s.name.toLowerCase().includes(debouncedQuery) ||
                          s.category.toLowerCase().includes(debouncedQuery) ||
                          s.tags.join(' ').toLowerCase().includes(debouncedQuery)
                        );
                      })
                      .map((supplier, index) => (
                        <motion.div
                          key={index}
                          className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer"
                          whileHover={{ y: -5 }}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 bg-gradient-to-r ${supplier.color} rounded-xl flex items-center justify-center text-white font-bold`}>
                              م{index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{supplier.name}</h4>
                              <p className="text-sm text-gray-500">{supplier.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm mb-3">
                            <span className="text-green-600 font-medium">⭐ {supplier.rating} ({supplier.reviews} تقييم)</span>
                            <span className="text-gray-500">{supplier.products} منتج</span>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {supplier.tags.map((tag, tagIndex) => (
                              <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Shipping Companies */}
              <div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
                      </svg>
                    </div>
                    شركات الشحن
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'شركة السرعة للنقل', description: 'توصيل سريع داخل المدينة', price: 15, time: '24 ساعة', status: 'متاح الآن', statusColor: 'green' },
                      { name: 'مؤسسة الأمان للشحن', description: 'شحن آمن للبضائع الثقيلة', price: 25, time: '48 ساعة', status: 'مشغول', statusColor: 'orange' },
                      { name: 'شركة الوفاء اللوجستية', description: 'شحن اقتصادي للكميات الكبيرة', price: 12, time: '72 ساعة', status: 'متاح الآن', statusColor: 'green' }
                    ].map((company, index) => (
                      <motion.div
                        key={index}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">{company.name}</h4>
                          <span className={`text-${company.statusColor}-600 text-sm font-medium`}>{company.status}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{company.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-purple-600">{company.price} ريال</span>
                          <span className="text-xs text-gray-500">خلال {company.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Supplier View */}
        {activeView === 'supplier' && (
          <motion.div {...fadeIn}>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">لوحة المورد</h2>
              <p className="text-gray-600">اعرض منتجاتك واستقبل طلبات التجار</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* My Products */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                        </svg>
                      </div>
                      منتجاتي المعروضة
                    </h3>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      + إضافة منتج جديد
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'لابتوب HP EliteBook', description: 'لابتوب عالي الأداء للأعمال', price: 2500, quantity: 15, views: 45, orders: 3, status: 'متوفر', statusColor: 'green' },
                      { name: 'طابعة Canon متعددة الوظائف', description: 'طابعة ليزر ملونة عالية الجودة', price: 850, quantity: 3, views: 28, orders: 7, status: 'قليل', statusColor: 'yellow' },
                      { name: 'كاميرا مراقبة ذكية', description: 'كاميرا عالية الدقة مع تطبيق ذكي', price: 320, quantity: 25, views: 67, orders: 12, status: 'متوفر', statusColor: 'green' },
                      { name: 'راوتر WiFi 6 متقدم', description: 'راوتر عالي السرعة للشبكات الكبيرة', price: 450, quantity: 0, views: 89, orders: 15, status: 'نفد', statusColor: 'red' }
                    ].map((product, index) => (
                      <motion.div
                        key={index}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-800">{product.name}</h4>
                          <span className={`px-2 py-1 bg-${product.statusColor}-100 text-${product.statusColor}-700 text-xs rounded-full`}>
                            {product.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{product.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-lg font-bold ${product.quantity > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                            {product.price} ريال
                          </span>
                          <span className="text-sm text-gray-500">الكمية: {product.quantity}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <span>👁️ {product.views} مشاهدة</span> • <span>🛒 {product.orders} طلبات</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Merchant Requests */}
              <div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z"/>
                      </svg>
                    </div>
                    طلبات التجار
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { merchant: 'متجر الإلكترونيات الحديثة', product: '10 × لابتوب HP EliteBook', amount: 25000, status: 'طلب جديد', statusColor: 'blue' },
                      { merchant: 'مكتب الأعمال المتطور', product: '5 × طابعة Canon', amount: 4250, status: 'قيد المراجعة', statusColor: 'orange' },
                      { merchant: 'شركة الأمن الشامل', product: '20 × كاميرا مراقبة', amount: 6400, status: 'مقبول', statusColor: 'green' }
                    ].map((request, index) => (
                      <motion.div
                        key={index}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">{request.merchant}</h4>
                          <span className={`px-2 py-1 bg-${request.statusColor}-100 text-${request.statusColor}-700 text-xs rounded-full`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">يطلب: {request.product}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-lg font-bold ${request.status === 'مقبول' ? 'text-green-600' : 'text-blue-600'}`}>
                            {request.amount.toLocaleString()} ريال
                          </span>
                          {request.status !== 'مقبول' ? (
                            <div className="flex gap-2">
                              <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">قبول</button>
                              <button className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-400">رفض</button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">جاري التحضير</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Shipping View */}
        {activeView === 'shipping' && (
          <motion.div {...fadeIn}>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">لوحة شركة الشحن</h2>
              <p className="text-gray-600">اعرض خدماتك واستقبل طلبات الشحن</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Available Shipments */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
                        </svg>
                      </div>
                      طلبات الشحن المتاحة
                    </h3>
                    <span className="text-sm text-gray-500">12 طلب جديد</span>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { 
                        merchant: 'متجر الإلكترونيات الحديثة', 
                        supplier: 'مؤسسة الأصيل التجارية',
                        from: 'الرياض - حي الملز',
                        to: 'جدة - حي الروضة',
                        weight: 25,
                        value: 25000,
                        price: 180,
                        priority: 'عاجل',
                        priorityColor: 'green',
                        icon: 'blue'
                      },
                      {
                        merchant: 'شركة الأمن الشامل',
                        supplier: 'مؤسسة الأصيل التجارية',
                        from: 'الرياض - حي الملز',
                        to: 'الدمام - حي الفيصلية',
                        weight: 45,
                        value: 6400,
                        price: 120,
                        priority: 'عادي',
                        priorityColor: 'blue',
                        icon: 'green'
                      },
                      {
                        merchant: 'مكتب الأعمال المتطور',
                        supplier: 'شركة النور للمواد الغذائية',
                        from: 'جدة - حي البلد',
                        to: 'الرياض - حي العليا',
                        weight: 12,
                        value: 4250,
                        price: 95,
                        priority: 'متوسط',
                        priorityColor: 'yellow',
                        icon: 'orange'
                      }
                    ].map((shipment, index) => (
                      <motion.div
                        key={index}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-${shipment.icon}-100 rounded-lg flex items-center justify-center`}>
                              <svg className={`w-6 h-6 text-${shipment.icon}-600`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{shipment.merchant}</h4>
                              <p className="text-sm text-gray-500">من: {shipment.supplier}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 bg-${shipment.priorityColor}-100 text-${shipment.priorityColor}-700 text-xs rounded-full`}>
                            {shipment.priority}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">من</p>
                            <p className="text-sm font-medium">{shipment.from}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">إلى</p>
                            <p className="text-sm font-medium">{shipment.to}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500">الوزن: {shipment.weight} كيلو</p>
                            <p className="text-xs text-gray-500">القيمة: {shipment.value.toLocaleString()} ريال</p>
                          </div>
                          <div className="text-left">
                            <p className="text-lg font-bold text-purple-600">{shipment.price} ريال</p>
                            <button className="px-4 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 mt-1">
                              تقديم عرض
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* My Services & Statistics */}
              <div className="space-y-6">
                {/* My Services */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"/>
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                      </svg>
                    </div>
                    خدماتي
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'الشحن السريع', description: 'توصيل خلال 24 ساعة داخل المدينة', price: '15-25 ريال', status: 'متاح', statusColor: 'green' },
                      { name: 'الشحن الاقتصادي', description: 'توصيل خلال 3-5 أيام بأسعار منافسة', price: '8-15 ريال', status: 'متاح', statusColor: 'green' },
                      { name: 'الشحن الآمن', description: 'للبضائع الثمينة مع تأمين شامل', price: '25-40 ريال', status: 'محدود', statusColor: 'yellow' }
                    ].map((service, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">{service.name}</h4>
                        <p className="text-sm text-gray-500 mb-3">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-purple-600">{service.price}</span>
                          <span className={`px-2 py-1 bg-${service.statusColor}-100 text-${service.statusColor}-700 text-xs rounded-full`}>
                            {service.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">إحصائيات الأداء</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">الشحنات المكتملة</span>
                      <span className="font-bold text-green-600">247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">التقييم العام</span>
                      <span className="font-bold text-yellow-600">⭐ 4.8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">الإيرادات الشهرية</span>
                      <span className="font-bold text-purple-600">12,450 ريال</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default SmartMarketplace;

