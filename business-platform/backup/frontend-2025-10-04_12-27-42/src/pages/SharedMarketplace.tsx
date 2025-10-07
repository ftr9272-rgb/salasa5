import { useState } from 'react';
import { Search, Package, ShoppingCart, Truck, Heart, Star, Eye, Plus, MessageCircle, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const SharedMarketplace = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // بيانات وهمية للعرض
  const sampleData = {
    products: [
      { 
        id: '1', 
        title: 'أرز بسمتي فاخر', 
        description: 'أرز بسمتي عالي الجودة من الهند - 10 كيلو', 
        price: 120, 
        rating: 4.8, 
        views: 245,
        minimumQuantity: 10,
        supplierName: 'مؤسسة الأرز الذهبي',
        contact: {
          phone: '+966501111111',
          whatsapp: '+966501111111',
          email: 'sales@golden-rice.sa'
        }
      },
      { 
        id: '2', 
        title: 'زيت زيتون إيطالي', 
        description: 'زيت زيتون بكر ممتاز من إيطاليا - 1 لتر', 
        price: 85, 
        rating: 4.6, 
        views: 189,
        minimumQuantity: 6,
        supplierName: 'شركة الزيوت المتميزة',
        contact: {
          phone: '+966502222222',
          whatsapp: '+966502222222',
          email: 'info@premium-oils.sa'
        }
      },
      { 
        id: '3', 
        title: 'عسل طبيعي جبلي', 
        description: 'عسل طبيعي 100% من الجبال - 1 كيلو', 
        price: 150, 
        rating: 4.9, 
        views: 312,
        minimumQuantity: 5,
        supplierName: 'مناحل الجبال العربية',
        contact: {
          phone: '+966503333333',
          whatsapp: '+966503333333',
          email: 'contact@mountain-honey.sa'
        }
      },
      { 
        id: '8', 
        title: 'قهوة عربية أصيلة', 
        description: 'قهوة عربية أصيلة محمصة حديثاً - 500 جرام', 
        price: 95, 
        rating: 4.7, 
        views: 427,
        minimumQuantity: 12,
        supplierName: 'محمصة البن العربي',
        contact: {
          phone: '+966508888888',
          whatsapp: '+966508888888',
          email: 'orders@arabic-coffee.sa'
        }
      },
      { 
        id: '9', 
        title: 'تمر مجدول فاخر', 
        description: 'تمر مجدول درجة أولى من المدينة المنورة - 1 كيلو', 
        price: 75, 
        rating: 4.8, 
        views: 356,
        minimumQuantity: 8,
        supplierName: 'مزارع النخيل الشريف',
        contact: {
          phone: '+966509999999',
          whatsapp: '+966509999999',
          email: 'sales@dates-farm.sa'
        }
      },
      { 
        id: '10', 
        title: 'سمن بلدي طبيعي', 
        description: 'سمن بلدي طبيعي 100% من الأبقار المحلية - 2 كيلو', 
        price: 180, 
        rating: 4.6, 
        views: 298,
        minimumQuantity: 3,
        supplierName: 'مراعي الخير الطبيعية',
        contact: {
          phone: '+966501010101',
          whatsapp: '+966501010101',
          email: 'info@natural-dairy.sa'
        }
      },
      { 
        id: '11', 
        title: 'توابل مشكلة فاخرة', 
        description: 'خلطة توابل مشكلة من أجود الأنواع - عبوة 500 جرام', 
        price: 45, 
        rating: 4.5, 
        views: 234,
        minimumQuantity: 20,
        supplierName: 'بيت التوابل العربي',
        contact: {
          phone: '+966501111222',
          whatsapp: '+966501111222',
          email: 'orders@spice-house.sa'
        }
      },
      { 
        id: '12', 
        title: 'شاي أحمر سيلاني', 
        description: 'شاي أحمر سيلاني فاخر من سريلانكا - 250 جرام', 
        price: 35, 
        rating: 4.4, 
        views: 189,
        minimumQuantity: 15,
        supplierName: 'شركة الشاي الملكي',
        contact: {
          phone: '+966501212121',
          whatsapp: '+966501212121',
          email: 'tea@royal-tea.sa'
        }
      }
    ],
    requests: [
      { 
        id: '4', 
        title: 'طلب أجهزة إلكترونية', 
        description: 'مطلوب أجهزة لابتوب وأجهزة كمبيوتر للمكاتب', 
        rating: 4.5, 
        views: 98,
        merchantName: 'شركة المكاتب الحديثة',
        contact: {
          phone: '+966504444444',
          whatsapp: '+966504444444',
          email: 'procurement@modern-offices.sa'
        }
      },
      { 
        id: '5', 
        title: 'مواد غذائية بالجملة', 
        description: 'مطلوب مواد غذائية متنوعة للمطاعم', 
        rating: 4.7, 
        views: 156,
        merchantName: 'مجموعة مطاعم الذواقة',
        contact: {
          phone: '+966505555555',
          whatsapp: '+966505555555',
          email: 'orders@gourmet-restaurants.sa'
        }
      },
      { 
        id: '13', 
        title: 'مواد بناء ومقاولات', 
        description: 'مطلوب مواد بناء متنوعة لمشروع سكني كبير', 
        rating: 4.6, 
        views: 267,
        merchantName: 'شركة الإنشاءات المتطورة',
        contact: {
          phone: '+966501313131',
          whatsapp: '+966501313131',
          email: 'projects@advanced-construction.sa'
        }
      },
      { 
        id: '14', 
        title: 'أثاث مكتبي متكامل', 
        description: 'مطلوب أثاث مكتبي لمقر جديد - مكاتب وكراسي وخزائن', 
        budget: '80000-120000', 
        rating: 4.4, 
        views: 134,
        merchantName: 'مؤسسة الأعمال الناجحة',
        contact: {
          phone: '+966501414141',
          whatsapp: '+966501414141',
          email: 'purchasing@successful-business.sa'
        }
      },
      { 
        id: '15', 
        title: 'معدات مطاعم احترافية', 
        description: 'مطلوب معدات مطبخ احترافية لسلسلة مطاعم جديدة', 
        rating: 4.8, 
        views: 345,
        merchantName: 'مجموعة المطاعم العالمية',
        contact: {
          phone: '+966501515151',
          whatsapp: '+966501515151',
          email: 'equipment@global-restaurants.sa'
        }
      },
      { 
        id: '16', 
        title: 'أجهزة طبية متخصصة', 
        description: 'مطلوب أجهزة طبية وتشخيصية لعيادة متخصصة', 
        rating: 4.9, 
        views: 189,
        merchantName: 'مجمع العيادات التخصصية',
        contact: {
          phone: '+966501616161',
          whatsapp: '+966501616161',
          email: 'medical@specialist-clinic.sa'
        }
      },
      { 
        id: '17', 
        title: 'سيارات تجارية', 
        description: 'مطلوب سيارات تجارية للتوصيل والشحن', 
        rating: 4.3, 
        views: 289,
        merchantName: 'شركة التوصيل السريع',
        contact: {
          phone: '+966501717171',
          whatsapp: '+966501717171',
          email: 'fleet@fast-delivery.sa'
        }
      }
    ],
    shipping: [
      { 
        id: '6', 
        title: 'خدمة الشحن السريع', 
        description: 'شحن سريع داخل المملكة خلال 24 ساعة', 
        price: 25, 
        rating: 4.4, 
        views: 203,
        companyName: 'شركة البرق للشحن السريع',
        contact: {
          phone: '+966506666666',
          whatsapp: '+966506666666',
          email: 'support@lightning-shipping.sa'
        }
      },
      { 
        id: '7', 
        title: 'الشحن الاقتصادي', 
        description: 'شحن اقتصادي للطلبات الكبيرة خلال 3-5 أيام', 
        price: 15, 
        rating: 4.2, 
        views: 178,
        companyName: 'شركة الوفاء للنقل',
        contact: {
          phone: '+966507777777',
          whatsapp: '+966507777777',
          email: 'info@alwafa-transport.sa'
        }
      },
      { 
        id: '18', 
        title: 'الشحن الدولي', 
        description: 'خدمة الشحن الدولي لجميع أنحاء العالم خلال 5-7 أيام', 
        price: 85, 
        rating: 4.6, 
        views: 445,
        companyName: 'شركة العالمية للشحن',
        contact: {
          phone: '+966501818181',
          whatsapp: '+966501818181',
          email: 'international@global-shipping.sa'
        }
      },
      { 
        id: '19', 
        title: 'الشحن المبرد', 
        description: 'خدمة شحن مبردة للمواد الغذائية والأدوية', 
        price: 45, 
        rating: 4.7, 
        views: 267,
        companyName: 'شركة التبريد المتخصصة',
        contact: {
          phone: '+966501919191',
          whatsapp: '+966501919191',
          email: 'cold@specialized-cooling.sa'
        }
      },
      { 
        id: '20', 
        title: 'شحن البضائع الثقيلة', 
        description: 'شحن متخصص للبضائع الثقيلة والمعدات الكبيرة', 
        price: 150, 
        rating: 4.5, 
        views: 156,
        companyName: 'شركة النقل الثقيل',
        contact: {
          phone: '+966502020202',
          whatsapp: '+966502020202',
          email: 'heavy@heavy-transport.sa'
        }
      },
      { 
        id: '21', 
        title: 'التوصيل السريع داخل المدن', 
        description: 'توصيل سريع خلال ساعتين داخل المدن الرئيسية', 
        price: 35, 
        rating: 4.8, 
        views: 534,
        companyName: 'خدمة التوصيل الفوري',
        contact: {
          phone: '+966502121212',
          whatsapp: '+966502121212',
          email: 'instant@instant-delivery.sa'
        }
      },
      { 
        id: '22', 
        title: 'الشحن الآمن للأجهزة', 
        description: 'شحن متخصص وآمن للأجهزة الإلكترونية والهشة', 
        price: 55, 
        rating: 4.9, 
        views: 298,
        companyName: 'شركة الشحن الآمن',
        contact: {
          phone: '+966502222333',
          whatsapp: '+966502222333',
          email: 'safe@safe-shipping.sa'
        }
      }
    ]
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'products': return sampleData.products;
      case 'requests': return sampleData.requests;
      case 'shipping': return sampleData.shipping;
      default: return [];
    }
  };

  const filteredData = getCurrentData().filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleContact = (method: string, contact: any, itemName: string) => {
    switch (method) {
      case 'chat':
        try {
          // resolve contact type from current active tab when not provided
          const resolvedType = contact.type || (activeTab === 'products' ? 'supplier' : activeTab === 'requests' ? 'merchant' : 'shipping_company');
          const chatContact = {
            id: contact.id || String(Math.random()).slice(2),
            name: contact.supplierName || contact.merchantName || contact.companyName || contact.name || itemName,
            type: resolvedType,
            itemName: itemName,
            item: { id: contact.id || String(Math.random()).slice(2), name: itemName },
            ...contact
          };
          window.dispatchEvent(new CustomEvent('open-chat-with-contact', { detail: { contact: chatContact } }));
          toast.success(`تم فتح نافذة المحادثة بخصوص ${itemName}`);
        } catch (err) {
          console.error('Failed to open chat with contact', err);
          toast.error('حدث خطأ أثناء فتح المحادثة');
        }
        // هنا يمكن فتح نافذة المحادثة
        break;
      case 'whatsapp':
        const whatsappUrl = `https://wa.me/${contact.whatsapp.replace('+', '')}?text=مرحباً، أنا مهتم بـ ${itemName}`;
        window.open(whatsappUrl, '_blank');
        toast.success('تم فتح واتساب');
        break;
      case 'phone':
        window.location.href = `tel:${contact.phone}`;
        toast.success('تم فتح تطبيق الهاتف');
        break;
      case 'email':
        const emailUrl = `mailto:${contact.email}?subject=استفسار عن ${itemName}&body=مرحباً، أنا مهتم بـ ${itemName}`;
        window.location.href = emailUrl;
        toast.success('تم فتح تطبيق البريد الإلكتروني');
        break;
      default:
        break;
    }
  };

  const getTabConfig = (tab: string) => {
    const configs = {
      products: { label: 'عروض الموردين', icon: Package, color: 'blue', count: sampleData.products.length },
      requests: { label: 'طلبات التجار', icon: ShoppingCart, color: 'green', count: sampleData.requests.length },
      shipping: { label: 'خدمات الشحن', icon: Truck, color: 'orange', count: sampleData.shipping.length }
    };
    return configs[tab as keyof typeof configs];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            السوق المشترك
          </h1>
          <p className="text-gray-600 text-lg">منصة مشتركة لربط الموردين والتجار وشركات الشحن</p>
        </motion.div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(sampleData).map(([key, data], index) => {
            const config = getTabConfig(key);
            const IconComponent = config.icon;
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`bg-gradient-to-r ${
                  config.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                  config.color === 'green' ? 'from-green-500 to-emerald-600' :
                  'from-orange-500 to-red-600'
                } rounded-xl p-4 text-white`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">{config.label}</p>
                    <p className="text-2xl font-bold">{config.count}</p>
                  </div>
                  <IconComponent className="w-8 h-8 text-white/60" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث في جميع أقسام السوق..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-50 p-2 rounded-xl">
          {Object.keys(sampleData).map((tab) => {
            const config = getTabConfig(tab);
            const IconComponent = config.icon;
            
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? `bg-${config.color}-500 text-white shadow-lg`
                    : 'text-gray-600 hover:bg-white hover:shadow-sm'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {config.label}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {config.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className={`relative h-32 bg-gradient-to-br ${
                activeTab === 'products' ? 'from-blue-500 to-indigo-600' :
                activeTab === 'requests' ? 'from-green-500 to-emerald-600' :
                'from-orange-500 to-red-600'
              }`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                    favorites.has(item.id) ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'
                  }`}
                  aria-label={favorites.has(item.id) ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                >
                  <Heart className={`w-4 h-4 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
                </button>

                <div className="relative h-full flex items-center justify-center">
                  {activeTab === 'products' && <Package className="w-12 h-12 text-white" />}
                  {activeTab === 'requests' && <ShoppingCart className="w-12 h-12 text-white" />}
                  {activeTab === 'shipping' && <Truck className="w-12 h-12 text-white" />}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                  {item.title}
                </h3>
                
                {/* Company/Supplier Name */}
                <p className="text-sm text-purple-600 font-medium mb-2">
                  {(item as any).supplierName || (item as any).merchantName || (item as any).companyName}
                </p>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {item.description}
                </p>

                {/* Price/Budget */}
                <div className="mb-4">
                  {(item as any).price ? (
                    <div>
                      <span className="text-xl font-bold text-gray-800">
                        {(item as any).price} ريال
                      </span>
                      {(item as any).minimumQuantity && (
                        <div className="text-sm text-blue-600 font-medium mt-1">
                          <Package className="w-4 h-4 inline-block ml-1" />
                          أقل كمية للطلب: {(item as any).minimumQuantity} قطعة
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-blue-600 font-medium">
                      طلب عرض سعر
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {item.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400" />
                      {item.rating}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {/* Main Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('تم إرسال استفسار بنجاح!');
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all"
                    >
                      عرض التفاصيل
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContact('whatsapp', (item as any).contact, item.title);
                      }}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center justify-center"
                      title="تواصل عبر واتساب"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.251"/>
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className={`px-3 py-2 rounded-lg transition-all ${
                        favorites.has(item.id) 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      aria-label={favorites.has(item.id) ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Quick Contact Options */}
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContact('chat', (item as any).contact, item.title);
                      }}
                      className="flex-1 py-1 px-2 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-all flex items-center justify-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      محادثة
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContact('phone', (item as any).contact, item.title);
                      }}
                      className="flex-1 py-1 px-2 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-all flex items-center justify-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      اتصال
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContact('email', (item as any).contact, item.title);
                      }}
                      className="flex-1 py-1 px-2 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-all flex items-center justify-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      إيميل
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-600 mb-6">جرب البحث عن شيء آخر</p>
            <button
              onClick={() => setSearchQuery('')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all"
            >
              مسح البحث
            </button>
          </div>
        )}

        {/* Floating Action Button */}
        {user && (
          <div className="fixed bottom-6 right-6 z-40">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toast.success('قريباً: إضافة عرض جديد')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
              aria-label="إضافة عرض جديد"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedMarketplace;