import { useState } from 'react';
import { Search, Package, ShoppingCart, Truck, Store, Heart, Star, Eye, MessageCircle, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CleanExhibitionMarketplace = () => {
  const [selectedExhibition, setSelectedExhibition] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // بيانات المعارض للاختبار
  const exhibitionsData = [
    { 
      id: '1', 
      title: 'معرض الأغذية الفاخرة', 
      description: 'معرض شامل للمواد الغذائية عالية الجودة', 
      supplierName: 'مؤسسة الأغذية المتميزة',
      banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
      contact: {
        phone: '+966501234567',
        whatsapp: '+966501234567',
        email: 'info@premium-foods.sa',
        website: 'www.premium-foods.sa'
      },
      items: [
        {
          id: 'item1',
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
          id: 'item2',
          name: 'زيت زيتون إيطالي',
          description: 'زيت زيتون بكر ممتاز - 1 لتر',
          price: 85,
          images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'],
          category: 'زيوت',
          stock: 300,
          featured: true
        }
      ],
      rating: 4.7, 
      views: 524,
      stats: { views: 524, likes: 89, shares: 23, subscribers: 45 }
    },
    { 
      id: '2', 
      title: 'معرض الإلكترونيات', 
      description: 'أحدث الأجهزة الإلكترونية والتكنولوجيا', 
      supplierName: 'شركة الإلكترونيات الذكية',
      banner: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
      contact: {
        phone: '+966507654321',
        whatsapp: '+966507654321',
        email: 'sales@smart-electronics.sa',
        website: 'www.smart-electronics.sa'
      },
      items: [
        {
          id: 'item3',
          name: 'سماعات لاسلكية',
          description: 'سماعات بلوتوث عالية الجودة مع عزل الضوضاء',
          price: 350,
          images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
          category: 'إلكترونيات',
          stock: 150,
          discount: 20,
          featured: true
        }
      ],
      rating: 4.6, 
      views: 398,
      stats: { views: 398, likes: 67, shares: 15, subscribers: 32 }
    },
    { 
      id: '3', 
      title: 'معرض الأزياء والموضة', 
      description: 'أحدث صيحات الموضة والأزياء العصرية والتقليدية', 
      supplierName: 'بيت الأناقة للأزياء',
      banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      contact: {
        phone: '+966509876543',
        whatsapp: '+966509876543',
        email: 'info@elegance-fashion.sa',
        website: 'www.elegance-fashion.sa'
      },
      items: [
        {
          id: 'item4',
          name: 'ثوب رجالي فاخر',
          description: 'ثوب رجالي عالي الجودة من القطن المصري',
          price: 450,
          images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
          category: 'أزياء رجالية',
          stock: 200,
          discount: 15,
          featured: true
        },
        {
          id: 'item5',
          name: 'عباءة نسائية مطرزة',
          description: 'عباءة نسائية أنيقة مع تطريز يدوي فاخر',
          price: 680,
          images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'],
          category: 'أزياء نسائية',
          stock: 120,
          featured: true
        },
        {
          id: 'item6',
          name: 'حذاء رياضي متطور',
          description: 'حذاء رياضي مريح بتقنية امتصاص الصدمات',
          price: 320,
          images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
          category: 'أحذية',
          stock: 300,
          discount: 25,
          featured: true
        }
      ],
      rating: 4.5, 
      views: 789,
      stats: { views: 789, likes: 145, shares: 34, subscribers: 78 }
    },
    { 
      id: '4', 
      title: 'معرض مواد البناء والإنشاء', 
      description: 'جميع مواد البناء عالية الجودة لمشاريع الإنشاء', 
      supplierName: 'شركة البناء المتقدم',
      banner: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
      contact: {
        phone: '+966512345678',
        whatsapp: '+966512345678',
        email: 'sales@advanced-construction.sa',
        website: 'www.advanced-construction.sa'
      },
      items: [
        {
          id: 'item7',
          name: 'أسمنت بورتلاند',
          description: 'أسمنت عالي الجودة مقاوم للعوامل الجوية - 50 كجم',
          price: 25,
          images: ['https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400'],
          category: 'أسمنت',
          stock: 1000,
          featured: true
        },
        {
          id: 'item8',
          name: 'طوب أحمر فاخر',
          description: 'طوب أحمر عالي الجودة مقاوم للحرارة والرطوبة',
          price: 0.75,
          images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'],
          category: 'طوب',
          stock: 50000,
          discount: 10,
          featured: true
        }
      ],
      rating: 4.8, 
      views: 612,
      stats: { views: 612, likes: 98, shares: 28, subscribers: 56 }
    },
    { 
      id: '5', 
      title: 'معرض الأثاث المنزلي', 
      description: 'أثاث منزلي عصري وكلاسيكي بأجود الخامات', 
      supplierName: 'معرض الملكي للأثاث',
      banner: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      contact: {
        phone: '+966523456789',
        whatsapp: '+966523456789',
        email: 'info@royal-furniture.sa',
        website: 'www.royal-furniture.sa'
      },
      items: [
        {
          id: 'item9',
          name: 'طقم صالون فاخر',
          description: 'طقم صالون من 7 قطع بتصميم عصري وخامات فاخرة',
          price: 8500,
          images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'],
          category: 'صالونات',
          stock: 15,
          discount: 20,
          featured: true
        },
        {
          id: 'item10',
          name: 'غرفة نوم كاملة',
          description: 'غرفة نوم كاملة من خشب الزان الطبيعي - 6 قطع',
          price: 12000,
          images: ['https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=400'],
          category: 'غرف نوم',
          stock: 8,
          featured: true
        },
        {
          id: 'item11',
          name: 'طاولة طعام رخامية',
          description: 'طاولة طعام من الرخام الطبيعي تتسع لـ 8 أشخاص',
          price: 4200,
          images: ['https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400'],
          category: 'طاولات',
          stock: 25,
          discount: 15,
          featured: true
        }
      ],
      rating: 4.9, 
      views: 1205,
      stats: { views: 1205, likes: 234, shares: 67, subscribers: 123 }
    },
    { 
      id: '6', 
      title: 'معرض السيارات والمركبات', 
      description: 'سيارات جديدة ومستعملة وقطع غيار أصلية', 
      supplierName: 'معرض النجم للسيارات',
      banner: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
      contact: {
        phone: '+966534567890',
        whatsapp: '+966534567890',
        email: 'sales@star-motors.sa',
        website: 'www.star-motors.sa'
      },
      items: [
        {
          id: 'item12',
          name: 'سيارة كامري 2024',
          description: 'سيارة تويوتا كامري موديل 2024 جديدة بالكامل',
          price: 125000,
          images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400'],
          category: 'سيارات جديدة',
          stock: 5,
          featured: true
        },
        {
          id: 'item13',
          name: 'إطارات ميشلان',
          description: 'إطارات ميشلان أصلية مقاس 225/60/R16',
          price: 450,
          images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'],
          category: 'قطع غيار',
          stock: 200,
          discount: 10,
          featured: true
        }
      ],
      rating: 4.4, 
      views: 892,
      stats: { views: 892, likes: 156, shares: 45, subscribers: 89 }
    },
    { 
      id: '7', 
      title: 'معرض الألعاب والهدايا', 
      description: 'ألعاب تعليمية وترفيهية وهدايا مميزة لجميع الأعمار', 
      supplierName: 'عالم الألعاب السعيد',
      banner: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800',
      contact: {
        phone: '+966545678901',
        whatsapp: '+966545678901',
        email: 'info@happy-toys.sa',
        website: 'www.happy-toys.sa'
      },
      items: [
        {
          id: 'item14',
          name: 'لعبة تركيب ذكية',
          description: 'لعبة تركيب تعليمية تنمي المهارات الذهنية - 500 قطعة',
          price: 180,
          images: ['https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400'],
          category: 'ألعاب تعليمية',
          stock: 150,
          discount: 15,
          featured: true
        },
        {
          id: 'item15',
          name: 'دراجة أطفال ملونة',
          description: 'دراجة أطفال آمنة ومريحة بألوان زاهية',
          price: 320,
          images: ['https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=400'],
          category: 'دراجات',
          stock: 75,
          featured: true
        }
      ],
      rating: 4.6, 
      views: 654,
      stats: { views: 654, likes: 112, shares: 29, subscribers: 67 }
    },
    { 
      id: '8', 
      title: 'معرض العطور والتجميل', 
      description: 'عطور فاخرة ومستحضرات تجميل عالية الجودة', 
      supplierName: 'بيت العطور الملكي',
      banner: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
      contact: {
        phone: '+966556789012',
        whatsapp: '+966556789012',
        email: 'info@royal-perfumes.sa',
        website: 'www.royal-perfumes.sa'
      },
      items: [
        {
          id: 'item16',
          name: 'عطر عود ملكي',
          description: 'عطر عود طبيعي فاخر برائحة استثنائية - 50 مل',
          price: 850,
          images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'],
          category: 'عطور',
          stock: 100,
          discount: 20,
          featured: true
        },
        {
          id: 'item17',
          name: 'كريم ترطيب طبيعي',
          description: 'كريم ترطيب بخلاصات طبيعية للبشرة الحساسة',
          price: 150,
          images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'],
          category: 'تجميل',
          stock: 250,
          featured: true
        }
      ],
      rating: 4.7, 
      views: 743,
      stats: { views: 743, likes: 134, shares: 41, subscribers: 78 }
    }
  ];

  // تصفية المعارض بناءً على البحث
  const filteredExhibitions = exhibitionsData.filter(exhibition =>
    exhibition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exhibition.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exhibition.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExhibitionClick = (exhibition: any) => {
    setSelectedExhibition(exhibition);
    toast.success(`تم فتح معرض: ${exhibition.title}`);
  };

  const handleBackToExhibitions = () => {
    setSelectedExhibition(null);
    toast.success('تم العودة إلى قائمة المعارض');
  };

  const handleContactSupplier = (method: string, contact: any, itemName?: string, item?: any) => {
    switch (method) {
      case 'chat':
        // Open the global chat window and provide the supplier + optional item as the initial contact
        try {
          const chatContact = {
            id: contact.id || selectedExhibition?.id || String(Math.random()).slice(2),
            name: selectedExhibition?.supplierName || contact.name || 'المورد',
            type: 'supplier',
            itemName: itemName,
            item: item ? { id: item.id, name: item.name } : undefined,
            ...contact
          };

          window.dispatchEvent(new CustomEvent('open-chat-with-contact', { detail: { contact: chatContact } }));
          toast.success(itemName ? `تم فتح نافذة المحادثة بخصوص ${itemName}` : 'تم فتح نافذة المحادثة مع المورد');
        } catch (err) {
          console.error('Failed to open chat with contact', err);
          toast.error('حدث خطأ أثناء فتح المحادثة');
        }
        break;
      case 'whatsapp':
        const whatsappUrl = `https://wa.me/${contact.whatsapp.replace('+', '')}?text=مرحباً، أنا مهتم بمنتجاتكم في المعرض`;
        window.open(whatsappUrl, '_blank');
        toast.success('تم فتح واتساب');
        break;
      case 'phone':
        window.location.href = `tel:${contact.phone}`;
        toast.success('تم فتح تطبيق الهاتف');
        break;
      case 'email':
        const emailUrl = `mailto:${contact.email}?subject=استفسار عن المعرض&body=مرحباً، أنا مهتم بمنتجاتكم في المعرض`;
        window.location.href = emailUrl;
        toast.success('تم فتح تطبيق البريد الإلكتروني');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            المعارض
          </h1>
          <p className="text-gray-600">اكتشف معارض الموردين والشركات</p>
        </div>

        {/* Search Bar - Only show when not viewing exhibition details */}
        {!selectedExhibition && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث في المعارض بالاسم أو الوصف أو اسم المورد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="مسح البحث"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-3 text-sm text-gray-600">
                تم العثور على {filteredExhibitions.length} معرض من أصل {exhibitionsData.length}
              </div>
            )}
          </div>
        )}

        {selectedExhibition ? (
          // عرض تفاصيل المعرض المحدد
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header with back button */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToExhibitions}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="العودة للمعارض"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
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
                <img 
                  src={selectedExhibition.banner} 
                  alt={selectedExhibition.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 right-4 left-4">
                  <p className="text-white text-lg">{selectedExhibition.description}</p>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                تواصل مع المورد
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleContactSupplier('chat', selectedExhibition.contact)}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-purple-200 hover:border-purple-400"
                >
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">محادثة</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleContactSupplier('whatsapp', selectedExhibition.contact)}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-green-200 hover:border-green-400"
                >
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.251"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">واتساب</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleContactSupplier('phone', selectedExhibition.contact)}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-blue-200 hover:border-blue-400"
                >
                  <Phone className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">اتصال</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleContactSupplier('email', selectedExhibition.contact)}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-red-200 hover:border-red-400"
                >
                  <Mail className="w-6 h-6 text-red-600" />
                  <span className="text-sm font-medium text-gray-700">إيميل</span>
                </motion.button>
              </div>

              {/* Contact Details */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{selectedExhibition.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{selectedExhibition.contact.email}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
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

            {/* Exhibition Items */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">منتجات المعرض</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedExhibition.items.map((item: any, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                  >
                    <div className="relative h-48 bg-gray-100">
                      {item.images[0] ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
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
                                {(item.price * (1 - item.discount / 100)).toFixed(0)} ريال
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

                      <button 
                        onClick={() => toast.success(`تم إضافة ${item.name} للسلة`)}
                        className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        إضافة للسلة
                      </button>
                      
                      {/* Quick chat button for this item */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          try {
                            const chatContact = {
                              id: selectedExhibition?.id || String(Math.random()).slice(2),
                              name: selectedExhibition?.supplierName || 'المورد',
                              type: 'supplier',
                              itemName: item.name,
                              item: { id: item.id, name: item.name },
                              ...selectedExhibition?.contact
                            };
                            window.dispatchEvent(new CustomEvent('open-chat-with-contact', { detail: { contact: chatContact } }));
                            toast.success(`تم فتح المحادثة بخصوص ${item.name}`);
                          } catch (err) {
                            console.error('Failed to open chat for item', err);
                            toast.error('حدث خطأ أثناء فتح المحادثة');
                          }
                        }}
                        className="mt-3 w-full py-2 border border-purple-200 rounded-lg text-purple-700 font-medium hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        محادثة المورد
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // عرض قائمة المعارض
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {searchQuery ? `نتائج البحث (${filteredExhibitions.length})` : 'المعارض المتاحة'}
              </h2>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  مسح البحث
                </button>
              )}
            </div>

            {filteredExhibitions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredExhibitions.map((exhibition, index) => (
                  <motion.div
                    key={exhibition.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.8, type: "spring", stiffness: 100 }}
                    whileHover={{ y: -12, scale: 1.03 }}
                    className="group bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-700 border border-white/50 overflow-hidden cursor-pointer relative transform hover:rotate-1"
                    onClick={() => handleExhibitionClick(exhibition)}
                  >
                    {/* Enhanced Card Header */}
                    <div className="relative h-48 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 overflow-hidden">
                      {/* Advanced Background Pattern */}
                      <div className="absolute inset-0">
                        <div className="absolute top-6 right-6 w-20 h-20 bg-white/15 rounded-full blur-2xl animate-pulse"></div>
                        <div className="absolute bottom-6 left-6 w-24 h-24 bg-pink-300/20 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-300/10 rounded-full blur-3xl"></div>
                        {/* Animated mesh pattern */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-x-12 group-hover:skew-x-0 transition-transform duration-700"></div>
                        </div>
                      </div>
                      
                      <div className="relative h-full flex items-center justify-center">
                        <div className="relative group-hover:scale-125 transition-all duration-500">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-3xl rotate-6 group-hover:rotate-12 transition-all duration-500 shadow-2xl"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-3xl -rotate-6 group-hover:-rotate-12 transition-all duration-500"></div>
                          <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border border-white/50">
                            <Store className="w-10 h-10 text-violet-600 group-hover:text-fuchsia-600 transition-colors duration-300" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Click Indicator */}
                      <div className="absolute bottom-4 right-4 bg-white/30 backdrop-blur-lg rounded-full p-3 group-hover:bg-white/50 group-hover:scale-110 transition-all duration-300 border border-white/20">
                        <svg className="w-5 h-5 text-white group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                      
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/0 to-purple-600/20 group-hover:to-purple-600/30 transition-all duration-300"></div>
                    </div>

                    {/* Enhanced Card Content */}
                    <div className="p-8">
                      {/* Title */}
                      <h3 className="font-bold text-2xl text-slate-800 mb-4 line-clamp-1 group-hover:text-violet-700 transition-all duration-300 group-hover:translate-x-1">
                        {exhibition.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-slate-600 text-base line-clamp-2 mb-6 leading-relaxed group-hover:text-slate-700 transition-colors">
                        {exhibition.description}
                      </p>
                      
                      {/* Supplier Badge */}
                      <div className="inline-flex items-center bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-200/50 text-violet-700 px-4 py-2 rounded-2xl text-sm font-semibold mb-6 group-hover:shadow-lg group-hover:shadow-violet-200/50 transition-all duration-300">
                        <Store className="w-4 h-4 mr-2 text-violet-500" />
                        {exhibition.supplierName}
                      </div>

                      {/* Enhanced Stats */}
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 text-blue-700 px-3 py-2 rounded-xl text-sm font-semibold shadow-sm">
                            <Eye className="w-4 h-4" />
                            {exhibition.views}
                          </div>
                          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 text-amber-700 px-3 py-2 rounded-xl text-sm font-semibold shadow-sm">
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                            {exhibition.rating}
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                          {exhibition.items.length} منتج
                        </div>
                      </div>

                      {/* Enhanced Actions */}
                      <div className="space-y-4">
                        {/* Main Action Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExhibitionClick(exhibition);
                          }}
                          className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          <span className="relative">عرض المعرض</span>
                          <svg className="w-5 h-5 group-hover:translate-x-2 transition-all duration-300 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                        
                        {/* Secondary Actions */}
                        <div className="flex gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContactSupplier('whatsapp', exhibition.contact);
                            }}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm font-semibold group relative overflow-hidden"
                            title="تواصل عبر واتساب"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                            <svg className="w-4 h-4 relative" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.251"/>
                            </svg>
                            <span className="relative">واتساب</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContactSupplier('phone', exhibition.contact);
                            }}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm font-semibold group relative overflow-hidden"
                            title="اتصال مباشر"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                            <Phone className="w-4 h-4 relative" />
                            <span className="relative">اتصال</span>
                          </button>
                        </div>
                        
                        {/* Enhanced Quick Contact Options */}
                        <div className="flex gap-3 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContactSupplier('chat', exhibition.contact);
                            }}
                            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 text-violet-700 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold border border-violet-200/50 hover:border-violet-300 hover:shadow-md group"
                          >
                            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>محادثة</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContactSupplier('email', exhibition.contact);
                            }}
                            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 text-slate-700 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold border border-slate-200/50 hover:border-slate-300 hover:shadow-md group"
                          >
                            <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>إيميل</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              // حالة عدم وجود نتائج بحث
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">لا توجد معارض</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `لم يتم العثور على معارض تحتوي على "${searchQuery}"`
                    : 'لا توجد معارض متاحة حالياً'
                  }
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all"
                  >
                    مسح البحث
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CleanExhibitionMarketplace;