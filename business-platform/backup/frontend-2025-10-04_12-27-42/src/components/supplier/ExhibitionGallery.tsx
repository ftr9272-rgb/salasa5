import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Plus, 
  Eye, 
  EyeOff, 
  Lock, 
  Globe, 
  Users, 
  Trash2, 
  Edit, 
  Save,
  X,
  Upload,
  Sparkles,
  Share2,
  Settings,
  Calendar,
  Tag,
  Star,
  Crown,
  TrendingUp,
  Award,
  ShoppingBag,
  Grid,
  List,
  Search,
  Filter,
  MoreVertical,
  Download,
  Heart,
  MessageCircle,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import { storage } from '../../utils/localStorage';

// Types
export interface ExhibitionItem {
  id: string;
  exhibitionId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  featured: boolean;
  stock: number;
  discount?: number;
  tags: string[];
  createdAt: string;
}

export interface Exhibition {
  id: string;
  supplierId: string;
  supplierName: string;
  title: string;
  description: string;
  banner: string;
  theme: 'modern' | 'classic' | 'minimal' | 'luxury';
  visibility: 'public' | 'subscribers' | 'private';
  allowedUsers?: string[]; // For private exhibitions
  items: ExhibitionItem[];
  categories: string[];
  stats: {
    views: number;
    likes: number;
    shares: number;
    subscribers: number;
  };
  settings: {
    allowComments: boolean;
    showPrices: boolean;
    enableOrders: boolean;
    requireSubscription: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface ExhibitionGalleryProps {
  supplierId: string;
  supplierName: string;
  onClose?: () => void;
}

const ExhibitionGallery: React.FC<ExhibitionGalleryProps> = ({ 
  supplierId, 
  supplierName,
  onClose 
}) => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ExhibitionItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Load exhibitions from localStorage and create default if not exists
  useEffect(() => {
    const stored = localStorage.getItem(`exhibitions_${supplierId}`);
    if (stored) {
      const loadedExhibitions = JSON.parse(stored);
      setExhibitions(loadedExhibitions);
      
      // If no exhibitions exist, create a default one automatically
      if (loadedExhibitions.length === 0) {
        createDefaultExhibition();
      }
    } else {
      // No storage exists, create default exhibition
      createDefaultExhibition();
    }
  }, [supplierId]);

  // Create default exhibition automatically (private by default)
  const createDefaultExhibition = () => {
    const defaultExhibition: Exhibition = {
      id: `exh_${Date.now()}`,
      supplierId,
      supplierName,
      title: `معرض ${supplierName}`,
      description: 'معرضي الإلكتروني لعرض جميع منتجاتي',
      banner: '',
      theme: 'modern',
      visibility: 'private', // خاص بشكل افتراضي - يمكن تفعيله لاحقاً
      items: [],
      categories: [],
      stats: {
        views: 0,
        likes: 0,
        shares: 0,
        subscribers: 0
      },
      settings: {
        allowComments: true,
        showPrices: true,
        enableOrders: true,
        requireSubscription: false
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [defaultExhibition];
    localStorage.setItem(`exhibitions_${supplierId}`, JSON.stringify(updated));
    setExhibitions(updated);
    
    // Notify other components
    window.dispatchEvent(new Event('exhibition-updated'));
  };

  // Save exhibitions to localStorage
  const saveExhibitions = (exhs: Exhibition[]) => {
    localStorage.setItem(`exhibitions_${supplierId}`, JSON.stringify(exhs));
    setExhibitions(exhs);
  };

  // Create new exhibition (one per supplier)
  const createExhibition = (data: Partial<Exhibition>) => {
    // Check if supplier already has an exhibition
    if (exhibitions.length > 0) {
      toast.error('لديك معرض بالفعل! يمكنك تعديله أو حذفه وإنشاء معرض جديد.');
      return null;
    }

    const newExhibition: Exhibition = {
      id: `exh_${Date.now()}`,
      supplierId,
      supplierName,
      title: data.title || 'معرضي',
      description: data.description || '',
      banner: data.banner || '',
      theme: data.theme || 'modern',
      visibility: data.visibility || 'public',
      items: [],
      categories: [],
      stats: {
        views: 0,
        likes: 0,
        shares: 0,
        subscribers: 0
      },
      settings: {
        allowComments: true,
        showPrices: true,
        enableOrders: true,
        requireSubscription: false
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [...exhibitions, newExhibition];
    saveExhibitions(updated);
    toast.success('تم إنشاء معرضك بنجاح! 🎉');
    return newExhibition;
  };

  // Update exhibition
  const updateExhibition = (id: string, updates: Partial<Exhibition>) => {
    const updated = exhibitions.map(exh => 
      exh.id === id 
        ? { ...exh, ...updates, updatedAt: new Date().toISOString() }
        : exh
    );
    saveExhibitions(updated);
    toast.success('تم تحديث المعرض بنجاح! ✓');
  };

  // Delete exhibition
  const deleteExhibition = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المعرض؟')) {
      const updated = exhibitions.filter(exh => exh.id !== id);
      saveExhibitions(updated);
      toast.success('تم حذف المعرض');
    }
  };

  // Add item to exhibition
  const addItemToExhibition = (exhibitionId: string, item: Omit<ExhibitionItem, 'id' | 'exhibitionId' | 'createdAt'>) => {
    const newItem: ExhibitionItem = {
      id: `item_${Date.now()}`,
      exhibitionId,
      ...item,
      createdAt: new Date().toISOString()
    };

    const updated = exhibitions.map(exh => {
      if (exh.id === exhibitionId) {
        const items = [...exh.items, newItem];
        const categories = Array.from(new Set([...exh.categories, item.category]));
        return { ...exh, items, categories, updatedAt: new Date().toISOString() };
      }
      return exh;
    });

    saveExhibitions(updated);
    toast.success('تم إضافة المنتج للمعرض! ✓');
  };

  // Update item
  const updateItem = (exhibitionId: string, itemId: string, updates: Partial<ExhibitionItem>) => {
    const updated = exhibitions.map(exh => {
      if (exh.id === exhibitionId) {
        const items = exh.items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        );
        return { ...exh, items, updatedAt: new Date().toISOString() };
      }
      return exh;
    });
    saveExhibitions(updated);
    toast.success('تم تحديث المنتج! ✓');
  };

  // Delete item
  const deleteItem = (exhibitionId: string, itemId: string) => {
    if (window.confirm('هل تريد حذف هذا المنتج؟')) {
      const updated = exhibitions.map(exh => {
        if (exh.id === exhibitionId) {
          const items = exh.items.filter(item => item.id !== itemId);
          return { ...exh, items, updatedAt: new Date().toISOString() };
        }
        return exh;
      });
      saveExhibitions(updated);
      toast.success('تم حذف المنتج');
    }
  };

  // Publish item to marketplace
  const publishItemToMarket = (exhibitionId: string, item: ExhibitionItem) => {
    try {
      const exhibition = exhibitions.find(e => e.id === exhibitionId);
      if (!exhibition) {
        toast.error('المعرض غير موجود');
        return;
      }

      // Calculate final price after discount
      const finalPrice = item.discount 
        ? item.price * (1 - item.discount / 100)
        : item.price;

      // Create market item
      const marketItem = {
        name: item.name,
        price: finalPrice,
        stock: item.stock,
        category: item.category,
        description: `${item.description}\n\n📦 من معرض: ${exhibition.title}`,
        images: item.images,
        sku: `EXH-${exhibitionId}-${item.id}`,
        weight: '',
        dimensions: '',
        status: 'active' as const,
        type: 'product' as const,
        provider: {
          id: supplierId,
          name: supplierName,
          type: 'supplier' as const,
          rating: 4.5,
          verified: true
        },
        metadata: {
          exhibitionId: exhibitionId,
          exhibitionTitle: exhibition.title,
          originalPrice: item.price,
          discount: item.discount,
          featured: item.featured,
          tags: item.tags
        }
      };

      // Add to market
      storage.addMarketItem(marketItem);
      
      // Update exhibition stats
      const updated = exhibitions.map(exh => {
        if (exh.id === exhibitionId) {
          return {
            ...exh,
            stats: {
              ...exh.stats,
              shares: exh.stats.shares + 1
            }
          };
        }
        return exh;
      });
      saveExhibitions(updated);

      toast.success('🎉 تم نشر المنتج في السوق المشترك بنجاح!');
      
      // Dispatch event to update marketplace
      window.dispatchEvent(new CustomEvent('market-updated'));
    } catch (error) {
      console.error('Error publishing to market:', error);
      toast.error('حدث خطأ أثناء نشر المنتج');
    }
  };

  // Publish entire exhibition to marketplace
  const publishExhibitionToMarket = (exhibitionId: string) => {
    const exhibition = exhibitions.find(e => e.id === exhibitionId);
    if (!exhibition) {
      toast.error('المعرض غير موجود');
      return;
    }

    if (exhibition.items.length === 0) {
      toast.error('المعرض فارغ! أضف منتجات أولاً');
      return;
    }

    const confirm = window.confirm(
      `هل تريد نشر جميع منتجات المعرض "${exhibition.title}" في السوق المشترك؟\n\n` +
      `سيتم نشر ${exhibition.items.length} منتج`
    );

    if (!confirm) return;

    try {
      let publishedCount = 0;
      
      exhibition.items.forEach(item => {
        const finalPrice = item.discount 
          ? item.price * (1 - item.discount / 100)
          : item.price;

        const marketItem = {
          name: item.name,
          price: finalPrice,
          stock: item.stock,
          category: item.category,
          description: `${item.description}\n\n📦 من معرض: ${exhibition.title}`,
          images: item.images,
          sku: `EXH-${exhibitionId}-${item.id}`,
          weight: '',
          dimensions: '',
          status: 'active' as const,
          type: 'product' as const,
          provider: {
            id: supplierId,
            name: supplierName,
            type: 'supplier' as const,
            rating: 4.5,
            verified: true
          },
          metadata: {
            exhibitionId: exhibitionId,
            exhibitionTitle: exhibition.title,
            originalPrice: item.price,
            discount: item.discount,
            featured: item.featured,
            tags: item.tags
          }
        };

        storage.addMarketItem(marketItem);
        publishedCount++;
      });

      // Update exhibition stats
      const updated = exhibitions.map(exh => {
        if (exh.id === exhibitionId) {
          return {
            ...exh,
            stats: {
              ...exh.stats,
              shares: exh.stats.shares + publishedCount
            }
          };
        }
        return exh;
      });
      saveExhibitions(updated);

      toast.success(`🎉 تم نشر ${publishedCount} منتج في السوق المشترك!`);
      
      // Dispatch event to update marketplace
      window.dispatchEvent(new CustomEvent('market-updated'));
    } catch (error) {
      console.error('Error publishing exhibition:', error);
      toast.error('حدث خطأ أثناء نشر المعرض');
    }
  };

  // Get visibility icon
  const getVisibilityIcon = (visibility: Exhibition['visibility']) => {
    switch (visibility) {
      case 'public':
        return <Globe className="w-4 h-4" />;
      case 'subscribers':
        return <Users className="w-4 h-4" />;
      case 'private':
        return <Lock className="w-4 h-4" />;
    }
  };

  // Get visibility text
  const getVisibilityText = (visibility: Exhibition['visibility']) => {
    switch (visibility) {
      case 'public':
        return 'عام - يراه الجميع';
      case 'subscribers':
        return 'للمشتركين فقط';
      case 'private':
        return 'خاص - بدعوة فقط';
    }
  };

  // Filter items
  const getFilteredItems = (exhibition: Exhibition) => {
    let filtered = exhibition.items;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    return filtered;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  🎨 معرضي
                </h1>
                <p className="text-gray-600 mt-1">معرضك الإلكتروني الشخصي</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-3 bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors"
                  title="إغلاق"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[
              { label: 'الحالة', value: exhibitions.length > 0 ? 'نشط' : 'غير نشط', icon: ImageIcon, color: 'purple', isStatus: true },
              { label: 'المنتجات', value: exhibitions.reduce((sum, e) => sum + e.items.length, 0), icon: ShoppingBag, color: 'pink' },
              { label: 'المشاهدات', value: exhibitions.reduce((sum, e) => sum + e.stats.views, 0), icon: Eye, color: 'blue' },
              { label: 'الإعجابات', value: exhibitions.reduce((sum, e) => sum + e.stats.likes, 0), icon: Heart, color: 'red' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl p-4 shadow-lg border-2 border-${stat.color}-100`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-600 rounded-lg`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${(stat as any).isStatus ? (exhibitions.length > 0 ? 'text-green-600' : 'text-gray-400') : 'text-gray-800'}`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Exhibitions List */}
        {!selectedExhibition ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {exhibitions.map((exhibition, index) => (
                <motion.div
                  key={exhibition.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedExhibition(exhibition)}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group border-2 border-transparent hover:border-purple-300"
                >
                  {/* Banner */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
                    {exhibition.banner ? (
                      <img src={exhibition.banner} alt={exhibition.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-md ${
                        exhibition.visibility === 'public' ? 'bg-green-500/80' :
                        exhibition.visibility === 'subscribers' ? 'bg-blue-500/80' :
                        'bg-gray-800/80'
                      }`}>
                        <div className="flex items-center gap-1">
                          {getVisibilityIcon(exhibition.visibility)}
                          <span>{getVisibilityText(exhibition.visibility).split(' - ')[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {exhibition.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {exhibition.description || 'لا يوجد وصف'}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-purple-600">{exhibition.items.length}</p>
                        <p className="text-xs text-gray-500">منتج</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-600">{exhibition.stats.views}</p>
                        <p className="text-xs text-gray-500">مشاهدة</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-pink-600">{exhibition.stats.likes}</p>
                        <p className="text-xs text-gray-500">إعجاب</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{exhibition.stats.subscribers}</p>
                        <p className="text-xs text-gray-500">مشترك</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExhibition(exhibition);
                          }}
                          className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                          عرض
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Edit exhibition
                          }}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          title="تعديل المعرض"
                        >
                          <Edit className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteExhibition(exhibition.id);
                          }}
                          className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                          title="حذف المعرض"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                      
                      {/* Toggle Market Visibility */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newVisibility = exhibition.visibility === 'public' ? 'private' : 'public';
                          updateExhibition(exhibition.id, { visibility: newVisibility });
                          toast.success(newVisibility === 'public' ? 'المعرض يظهر الآن في السوق الموحد! 🎉' : 'تم إخفاء المعرض من السوق الموحد');
                        }}
                        className={`w-full py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                          exhibition.visibility === 'public' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                            : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                        }`}
                      >
                        {exhibition.visibility === 'public' ? (
                          <>
                            <Globe className="w-4 h-4" />
                            يظهر في السوق
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            لا يظهر في السوق
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <ExhibitionView
            exhibition={selectedExhibition}
            onBack={() => setSelectedExhibition(null)}
            onUpdate={updateExhibition}
            onAddItem={addItemToExhibition}
            onUpdateItem={updateItem}
            onDeleteItem={deleteItem}
            onPublishItem={(exhibitionId, itemId) => {
              const item = selectedExhibition.items.find(i => i.id === itemId);
              if (item) publishItemToMarket(exhibitionId, item);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Exhibition View Component
const ExhibitionView: React.FC<{
  exhibition: Exhibition;
  onBack: () => void;
  onUpdate: (id: string, updates: Partial<Exhibition>) => void;
  onAddItem: (exhibitionId: string, item: Omit<ExhibitionItem, 'id' | 'exhibitionId' | 'createdAt'>) => void;
  onUpdateItem: (exhibitionId: string, itemId: string, updates: Partial<ExhibitionItem>) => void;
  onDeleteItem: (exhibitionId: string, itemId: string) => void;
  onPublishItem: (exhibitionId: string, itemId: string) => void;
}> = ({ exhibition, onBack, onUpdate, onAddItem, onUpdateItem, onDeleteItem, onPublishItem }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const filteredItems = exhibition.items.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <X className="w-5 h-5" />
          العودة للمعارض
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{exhibition.title}</h2>
            <p className="text-gray-600 mb-4">{exhibition.description}</p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {exhibition.visibility === 'public' && <Globe className="w-4 h-4" />}
                {exhibition.visibility === 'subscribers' && <Users className="w-4 h-4" />}
                {exhibition.visibility === 'private' && <Lock className="w-4 h-4" />}
                <span>
                  {exhibition.visibility === 'public' ? 'عام' :
                   exhibition.visibility === 'subscribers' ? 'للمشتركين' : 'خاص'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {new Date(exhibition.createdAt).toLocaleDateString('ar-SA')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddItemModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              إضافة منتج
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="فلتر الفئة"
          >
            <option value="all">جميع الفئات</option>
            {exhibition.categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{filteredItems.length} من {exhibition.items.length} منتج</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {exhibition.stats.views} مشاهدة
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {exhibition.stats.likes} إعجاب
            </span>
          </div>
        </div>
      </div>

      {/* Items Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        <AnimatePresence>
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
            >
              {item.featured && (
                <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  مميز
                </div>
              )}

              <div className="relative h-48 bg-gray-100">
                {item.images[0] ? (
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                {item.discount && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    -{item.discount}%
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    {item.discount ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-purple-600">
                          {(item.price * (1 - item.discount / 100)).toFixed(2)} ريال
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {item.price} ريال
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-purple-600">{item.price} ريال</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">المخزون: {item.stock}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        // Edit item
                      }}
                      className="flex-1 py-2 bg-purple-100 text-purple-600 rounded-lg font-medium hover:bg-purple-200 transition-colors"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => onDeleteItem(exhibition.id, item.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="حذف المنتج"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Publish to Market Button */}
                  <button
                    onClick={() => onPublishItem(exhibition.id, item.id)}
                    className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    نشر في السوق
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-20">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد منتجات</p>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      <AddExhibitionItemModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onAdd={(item) => {
          onAddItem(exhibition.id, item);
          setShowAddItemModal(false);
        }}
      />

      {/* Settings Modal */}
      <ExhibitionSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        exhibition={exhibition}
        onUpdate={(updates) => {
          onUpdate(exhibition.id, updates);
          setShowSettingsModal(false);
        }}
      />
    </motion.div>
  );
};

// Create Exhibition Modal
const CreateExhibitionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: Partial<Exhibition>) => void;
}> = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    banner: '',
    theme: 'modern' as Exhibition['theme'],
    visibility: 'public' as Exhibition['visibility']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('يرجى إدخال اسم المعرض');
      return;
    }
    onCreate(formData);
    onClose();
    setFormData({
      title: '',
      description: '',
      banner: '',
      theme: 'modern',
      visibility: 'public'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">إنشاء معرض جديد</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اسم المعرض *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="مثال: معرض الربيع 2024"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              placeholder="وصف المعرض..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">رابط صورة الغلاف</label>
            <input
              type="url"
              value={formData.banner}
              onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://example.com/banner.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">السمة</label>
            <select
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value as Exhibition['theme'] })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="modern">عصري</option>
              <option value="classic">كلاسيكي</option>
              <option value="minimal">بسيط</option>
              <option value="luxury">فاخر</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">الخصوصية *</label>
            <div className="space-y-3">
              {[
                { value: 'public', icon: Globe, label: 'عام', desc: 'يمكن لأي شخص رؤية المعرض' },
                { value: 'subscribers', icon: Users, label: 'للمشتركين فقط', desc: 'فقط المشتركون في صفحتك' },
                { value: 'private', icon: Lock, label: 'خاص', desc: 'فقط الأشخاص المدعوون' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.visibility === option.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={option.value}
                    checked={formData.visibility === option.value}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value as Exhibition['visibility'] })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <option.icon className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-gray-800">{option.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            >
              إنشاء المعرض
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Add Exhibition Item Modal
const AddExhibitionItemModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<ExhibitionItem, 'id' | 'exhibitionId' | 'createdAt'>) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    images: [''],
    category: '',
    featured: false,
    stock: '',
    discount: '',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      toast.error('يرجى إدخال اسم المنتج والسعر');
      return;
    }

    onAdd({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      images: formData.images.filter(img => img.trim() !== ''),
      category: formData.category,
      featured: formData.featured,
      stock: parseInt(formData.stock) || 0,
      discount: formData.discount ? parseFloat(formData.discount) : undefined,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== '')
    });

    setFormData({
      name: '',
      description: '',
      price: '',
      images: [''],
      category: '',
      featured: false,
      stock: '',
      discount: '',
      tags: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">إضافة منتج للمعرض</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم المنتج *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">السعر (ريال) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المخزون</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الخصم (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">رابط الصورة</label>
              <input
                type="url"
                value={formData.images[0]}
                onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">الوسوم (افصل بفواصل)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="جديد, خصم, حصري"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">منتج مميز</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            >
              إضافة المنتج
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Exhibition Settings Modal
const ExhibitionSettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  exhibition: Exhibition;
  onUpdate: (updates: Partial<Exhibition>) => void;
}> = ({ isOpen, onClose, exhibition, onUpdate }) => {
  const [settings, setSettings] = useState(exhibition.settings);
  const [visibility, setVisibility] = useState(exhibition.visibility);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ settings, visibility });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-lg w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">إعدادات المعرض</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">عرض المعرض في السوق الموحد</label>
            <p className="text-xs text-gray-500 mb-3">اختر متى يظهر معرضك للتجار والعملاء في السوق</p>
            <div className="space-y-2">
              {[
                { value: 'public', icon: Globe, label: 'عام', desc: 'يظهر في السوق الموحد للجميع' },
                { value: 'subscribers', icon: Users, label: 'للمشتركين فقط', desc: 'يظهر فقط للمشتركين في معرضك' },
                { value: 'private', icon: Lock, label: 'خاص', desc: 'لا يظهر في السوق - خاص بك فقط' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    visibility === option.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={option.value}
                    checked={visibility === option.value}
                    onChange={(e) => setVisibility(e.target.value as Exhibition['visibility'])}
                    className="mt-1"
                  />
                  <option.icon className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-medium block">{option.label}</span>
                    <span className="text-xs text-gray-500">{option.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowComments}
                onChange={(e) => setSettings({ ...settings, allowComments: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">السماح بالتعليقات</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showPrices}
                onChange={(e) => setSettings({ ...settings, showPrices: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">عرض الأسعار</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableOrders}
                onChange={(e) => setSettings({ ...settings, enableOrders: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">تفعيل الطلبات</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireSubscription}
                onChange={(e) => setSettings({ ...settings, requireSubscription: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">يتطلب اشتراك</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            >
              حفظ التغييرات
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ExhibitionGallery;
