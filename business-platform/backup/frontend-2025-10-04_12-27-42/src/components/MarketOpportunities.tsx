import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, DollarSign, TrendingUp, Users, Package, Clock, Star, ArrowRight, Zap, Crown, Gift, Send, Search, Filter, SortAsc, Grid, List, Sparkles, Award, TrendingDown, CheckCircle, Store, Eye, Heart, ShoppingBag } from 'lucide-react';
import { storage } from '../utils/localStorage';
import toast from 'react-hot-toast';
import type { Exhibition } from './supplier/ExhibitionGallery';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: 'partnership' | 'expansion' | 'trend' | 'seasonal' | 'premium';
  priority: 'high' | 'medium' | 'low';
  estimatedRevenue: string;
  timeframe: string;
  effort: 'low' | 'medium' | 'high';
  successRate: number;
  tags: string[];
  sendTo?: 'market';
}

interface MarketOpportunitiesProps {
  userType?: 'merchant' | 'supplier' | 'shipping';
  user?: {
    id: string;
    name: string;
    type: 'merchant' | 'supplier' | 'shipping_company';
    rating?: number;
    verified?: boolean;
  };
}

const MarketOpportunities: React.FC<MarketOpportunitiesProps> = ({ userType = 'merchant', user }) => {
  // State management
  const [activeTab, setActiveTab] = useState<'opportunities' | 'exhibitions'>('opportunities');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'partnership' | 'expansion' | 'trend' | 'seasonal' | 'premium'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'revenue' | 'success'>('priority');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null);

  const getOpportunitiesForUser = (userType: string): Opportunity[] => {
    const baseOpportunities: Record<string, Opportunity[]> = {
      merchant: [
        {
          id: '1',
          title: 'شراكة مع موردين محليين',
          description: 'فرصة للتعاون مع موردين جدد لتقليل التكاليف وتحسين الجودة',
          type: 'partnership',
          priority: 'high',
          estimatedRevenue: '45,000 ريال',
          timeframe: 'شهرين',
          effort: 'medium',
          successRate: 85,
          tags: ['شراكة', 'توفير تكاليف', 'جودة عالية'],
          sendTo: 'market'
        },
        {
          id: '2', 
          title: 'توسع في منتجات عضوية',
          description: 'الطلب على المنتجات العضوية في ازدياد مستمر بنسبة 40% سنوياً',
          type: 'trend',
          priority: 'high',
          estimatedRevenue: '80,000 ريال',
          timeframe: 'ثلاثة أشهر',
          effort: 'high',
          successRate: 78,
          tags: ['عضوي', 'صحة', 'اتجاه صاعد'],
          sendTo: 'market'
        },
        {
          id: '3',
          title: 'عروض موسم الشتاء',
          description: 'استغل موسم الشتاء لعروض ملابس وأدوات التدفئة',
          type: 'seasonal',
          priority: 'medium',
          estimatedRevenue: '25,000 ريال',
          timeframe: 'شهر واحد',
          effort: 'low',
          successRate: 92,
          tags: ['موسمي', 'ملابس', 'تدفئة'],
          sendTo: 'market'
        },
        {
          id: '4',
          title: 'برنامج عضوية مميزة',
          description: 'إطلاق برنامج عضوية للعملاء المميزين مع خصومات وخدمات حصرية',
          type: 'premium',
          priority: 'medium',
          estimatedRevenue: '35,000 ريال',
          timeframe: 'شهرين',
          effort: 'medium',
          successRate: 70,
          tags: ['عضوية', 'ولاء', 'خدمات مميزة'],
          sendTo: 'market'
        }
      ],
      supplier: [
        {
          id: '5',
          title: 'توريد للأسواق الجديدة',
          description: 'فرصة دخول أسواق جديدة في المناطق الناشئة مع زيادة الطلب',
          type: 'expansion',
          priority: 'high',
          estimatedRevenue: '120,000 ريال',
          timeframe: 'أربعة أشهر',
          effort: 'high',
          successRate: 75,
          tags: ['توسع', 'أسواق جديدة', 'نمو'],
          sendTo: 'market'
        },
        {
          id: '6',
          title: 'تطوير منتجات مبتكرة',
          description: 'الاستثمار في تطوير منتجات تقنية مطلوبة في السوق',
          type: 'trend',
          priority: 'high',
          estimatedRevenue: '95,000 ريال',
          timeframe: 'ستة أشهر',
          effort: 'high',
          successRate: 65,
          tags: ['ابتكار', 'تقنية', 'مستقبل'],
          sendTo: 'market'
        },
        {
          id: '7',
          title: 'شراكة مع متاجر إلكترونية',
          description: 'التعاون مع منصات التجارة الإلكترونية الرائدة',
          type: 'partnership',
          priority: 'medium',
          estimatedRevenue: '60,000 ريال',
          timeframe: 'شهرين',
          effort: 'medium',
          successRate: 80,
          tags: ['إلكتروني', 'منصات', 'رقمي'],
          sendTo: 'market'
        }
      ],
      shipping: [
        {
          id: '8',
          title: 'خدمة التوصيل السريع',
          description: 'إطلاق خدمة توصيل في نفس اليوم للطلبات العاجلة',
          type: 'trend',
          priority: 'high',
          estimatedRevenue: '70,000 ريال',
          timeframe: 'شهرين',
          effort: 'medium',
          successRate: 88,
          tags: ['سرعة', 'توصيل فوري', 'خدمة مميزة'],
          sendTo: 'market'
        },
        {
          id: '9',
          title: 'توسع في المناطق النائية',
          description: 'تغطية مناطق جديدة نائية مع طرد متزايد على خدمات التوصيل',
          type: 'expansion',
          priority: 'medium',
          estimatedRevenue: '50,000 ريال',
          timeframe: 'ثلاثة أشهر',
          effort: 'high',
          successRate: 72,
          tags: ['توسع جغرافي', 'مناطق نائية', 'تغطية شاملة'],
          sendTo: 'market'
        },
        {
          id: '10',
          title: 'خدمات التوصيل المبرد',
          description: 'تطوير أسطول مبرد لتوصيل المنتجات الطازجة والأدوية',
          type: 'premium',
          priority: 'high',
          estimatedRevenue: '85,000 ريال',
          timeframe: 'أربعة أشهر',
          effort: 'high',
          successRate: 70,
          tags: ['تبريد', 'طازج', 'أدوية'],
          sendTo: 'market'
        }
      ]
    };
    
    return baseOpportunities[userType] || [];
  };

  // Load public exhibitions from all suppliers
  useEffect(() => {
    const loadExhibitions = () => {
      const allExhibitions: Exhibition[] = [];
      
      // Get all supplier IDs from localStorage
      const keys = Object.keys(localStorage);
      const exhibitionKeys = keys.filter(key => key.startsWith('exhibitions_'));
      
      exhibitionKeys.forEach(key => {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const supplierExhibitions: Exhibition[] = JSON.parse(stored);
            // Only include public exhibitions
            const publicExhibitions = supplierExhibitions.filter(
              exh => exh.visibility === 'public'
            );
            allExhibitions.push(...publicExhibitions);
          }
        } catch (error) {
          console.error('Error loading exhibitions:', error);
        }
      });
      
      setExhibitions(allExhibitions);
    };
    
    loadExhibitions();
    
    // Listen for exhibition updates
    const handleExhibitionUpdate = () => loadExhibitions();
    window.addEventListener('exhibition-updated', handleExhibitionUpdate);
    
    return () => {
      window.removeEventListener('exhibition-updated', handleExhibitionUpdate);
    };
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'partnership':
        return <Users className="w-5 h-5" />;
      case 'expansion':
        return <TrendingUp className="w-5 h-5" />;
      case 'trend':
        return <Zap className="w-5 h-5" />;
      case 'seasonal':
        return <Gift className="w-5 h-5" />;
      case 'premium':
        return <Crown className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'partnership':
        return 'text-blue-600 bg-blue-50';
      case 'expansion':
        return 'text-emerald-600 bg-emerald-50';
      case 'trend':
        return 'text-purple-600 bg-purple-50';
      case 'seasonal':
        return 'text-amber-600 bg-amber-50';
      case 'premium':
        return 'text-rose-600 bg-rose-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEffortText = (effort: string) => {
    switch (effort) {
      case 'low':
        return 'جهد قليل';
      case 'medium':
        return 'جهد متوسط';
      case 'high':
        return 'جهد عالي';
      default:
        return 'غير محدد';
    }
  };

  const opportunities = getOpportunitiesForUser(userType);

  // Filter, search, and sort opportunities
  const filteredAndSortedOpportunities = useMemo(() => {
    let filtered = opportunities;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(opp => opp.type === selectedFilter);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'revenue':
          const revenueA = parseInt(a.estimatedRevenue.replace(/,/g, '')) || 0;
          const revenueB = parseInt(b.estimatedRevenue.replace(/,/g, '')) || 0;
          return revenueB - revenueA;
        case 'success':
          return b.successRate - a.successRate;
        default:
          return 0;
      }
    });

    return sorted;
  }, [opportunities, searchTerm, selectedFilter, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => ({
    totalOpportunities: opportunities.length,
    highPriority: opportunities.filter(o => o.priority === 'high').length,
    avgSuccess: Math.round(opportunities.reduce((sum, o) => sum + o.successRate, 0) / opportunities.length),
    lowEffort: opportunities.filter(o => o.effort === 'low').length,
    trending: opportunities.filter(o => o.type === 'trend').length,
  }), [opportunities]);

  // Function to send opportunity to marketplace
  const sendToMarketplace = (opportunity: Opportunity) => {
    if (!user) {
      toast.error('يجب تسجيل الدخول لإرسال الفرصة إلى السوق');
      return;
    }

    try {
      // Convert opportunity to market item format
      const marketItem = {
        name: opportunity.title,
        price: parseInt(opportunity.estimatedRevenue.replace(/,/g, '')) || 0,
        stock: 1,
        category: opportunity.type === 'partnership' ? 'شراكة' : 
                  opportunity.type === 'expansion' ? 'توسع' :
                  opportunity.type === 'trend' ? 'اتجاه' :
                  opportunity.type === 'seasonal' ? 'موسمي' : 'مميز',
        description: opportunity.description,
        images: [],
        sku: `OPP-${opportunity.id}`,
        weight: '',
        dimensions: '',
        status: 'active' as const,
        type: 'offer' as const,
        provider: {
          id: user.id,
          name: user.name,
          type: user.type,
          rating: user.rating,
          verified: user.verified
        }
      };

      // Add to marketplace
      storage.addMarketItem(marketItem);
      
      // Show success message
      toast.success('تم إرسال الفرصة إلى السوق المشترك بنجاح!');
      
      // Dispatch event to update marketplace
      window.dispatchEvent(new CustomEvent('market-updated'));
    } catch (error) {
      console.error('Error sending opportunity to marketplace:', error);
      toast.error('حدث خطأ أثناء إرسال الفرصة إلى السوق');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-2"
      >
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('opportunities')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'opportunities'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Target className="w-5 h-5" />
            الفرص التجارية
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'opportunities' ? 'bg-white/20' : 'bg-purple-100 text-purple-600'
            }`}>
              {opportunities.length}
            </span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('exhibitions')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'exhibitions'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Store className="w-5 h-5" />
            معارض الموردين
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'exhibitions' ? 'bg-white/20' : 'bg-purple-100 text-purple-600'
            }`}>
              {exhibitions.length}
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Hero Section مع إحصائيات ملخصة */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl p-8 text-white"
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                {activeTab === 'opportunities' ? (
                  <Sparkles className="w-8 h-8 text-white" />
                ) : (
                  <Store className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold font-arabic mb-1">
                  {activeTab === 'opportunities' ? '🎯 الفرص المتاحة' : '🏪 معارض الموردين'}
                </h2>
                <p className="text-white/90">
                  {activeTab === 'opportunities' 
                    ? 'اكتشف فرص نمو مبتكرة مخصصة لنشاطك التجاري'
                    : 'تصفح معارض الموردين واستكشف منتجاتهم المميزة'}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}
              >
                <Grid className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}
              >
                <List className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'إجمالي الفرص', value: stats.totalOpportunities, icon: Target, color: 'bg-blue-500/30' },
              { label: 'أولوية عالية', value: stats.highPriority, icon: Star, color: 'bg-amber-500/30' },
              { label: 'متوسط النجاح', value: `${stats.avgSuccess}%`, icon: TrendingUp, color: 'bg-emerald-500/30' },
              { label: 'اتجاهات صاعدة', value: stats.trending, icon: Zap, color: 'bg-purple-500/30' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.color} backdrop-blur-sm rounded-xl p-4`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Search and Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن فرصة مناسبة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">الفئة:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all' as const, label: 'الكل', icon: '📊' },
                { value: 'partnership' as const, label: 'شراكة', icon: '🤝' },
                { value: 'expansion' as const, label: 'توسع', icon: '📈' },
                { value: 'trend' as const, label: 'اتجاه', icon: '⚡' },
                { value: 'seasonal' as const, label: 'موسمي', icon: '🎁' },
                { value: 'premium' as const, label: 'مميز', icon: '👑' },
              ].map((filter) => (
                <motion.button
                  key={filter.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedFilter === filter.value
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1">{filter.icon}</span>
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 mr-auto">
            <SortAsc className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">ترتيب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'priority' | 'revenue' | 'success')}
              className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="خيارات الترتيب"
            >
              <option value="priority">الأولوية</option>
              <option value="revenue">العائد المتوقع</option>
              <option value="success">نسبة النجاح</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-600">
            {filteredAndSortedOpportunities.length === opportunities.length
              ? `عرض جميع الفرص (${opportunities.length})`
              : `عرض ${filteredAndSortedOpportunities.length} من أصل ${opportunities.length} فرصة`}
          </span>
          {searchTerm && (
            <span className="text-sm text-purple-600 font-medium">
              نتائج البحث عن "{searchTerm}"
            </span>
          )}
        </div>
      </motion.div>

      {/* بطاقات الفرص - Empty State */}
      {filteredAndSortedOpportunities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد فرص مطابقة</h3>
          <p className="text-gray-600 mb-4">جرب تعديل البحث أو الفلاتر للعثور على فرص مناسبة</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedFilter('all');
            }}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            إعادة تعيين الفلاتر
          </button>
        </motion.div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
          <AnimatePresence>
            {filteredAndSortedOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`relative bg-white border-2 border-gray-100 rounded-xl p-6 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 group ${
                  viewMode === 'list' ? 'flex items-center gap-6' : ''
                }`}
              >
                {/* Trending Badge */}
                {opportunity.type === 'trend' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    رائج
                  </motion.div>
                )}

                {/* Verified Badge */}
                {opportunity.successRate >= 80 && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-emerald-500 text-white p-1 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  </div>
                )}

                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  {/* رأس البطاقة */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-xl ${getTypeColor(opportunity.type)} group-hover:scale-110 transition-transform`}>
                        {getTypeIcon(opportunity.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 font-arabic mb-1 group-hover:text-purple-600 transition-colors">
                          {opportunity.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPriorityColor(opportunity.priority)}`}>
                            {opportunity.priority === 'high' ? '🔥 أولوية عالية' : opportunity.priority === 'medium' ? '⚡ متوسطة' : '✅ منخفضة'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* الوصف */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed font-arabic">
                    {opportunity.description}
                  </p>

                  {/* ROI Metrics - Enhanced */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3 border border-emerald-200">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs text-emerald-700 font-medium">عائد متوقع</span>
                      </div>
                      <p className="text-lg font-bold text-emerald-700 font-arabic">{opportunity.estimatedRevenue}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-700 font-medium">مدة التنفيذ</span>
                      </div>
                      <p className="text-lg font-bold text-blue-700 font-arabic">{opportunity.timeframe}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-purple-600" />
                        <span className="text-xs text-purple-700 font-medium">الجهد</span>
                      </div>
                      <p className="text-lg font-bold text-purple-700 font-arabic">
                        {opportunity.effort === 'low' ? '✨ قليل' : opportunity.effort === 'medium' ? '⚡ متوسط' : '🔥 عالي'}
                      </p>
                    </div>
                  </div>

                  {/* شريط نسبة النجاح - Enhanced */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-gray-700">نسبة النجاح المتوقعة</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">{opportunity.successRate}%</span>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${opportunity.successRate}%` }}
                        transition={{ delay: 0.3 + index * 0.05, duration: 0.8, ease: "easeOut" }}
                        className={`h-3 rounded-full ${
                          opportunity.successRate >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-600' :
                          opportunity.successRate >= 60 ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                          'bg-gradient-to-r from-amber-500 to-orange-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* العلامات والإجراءات */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {opportunity.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full font-arabic font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {opportunity.sendTo === 'market' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => sendToMarketplace(opportunity)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transition-all"
                          title="إرسال إلى السوق المشترك"
                        >
                          <Send className="w-4 h-4" />
                          <span className="font-arabic">إرسال للسوق</span>
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-all"
                      >
                        <span className="font-arabic">استكشف</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ملخص الفرص - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-arabic">📊 تحليل شامل للفرص</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-red-500/30 rounded-lg">
                  <Star className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium">أولوية عالية</span>
              </div>
              <p className="text-3xl font-bold">{stats.highPriority}</p>
              <p className="text-xs mt-1 text-white/80">فرص مهمة</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-emerald-500/30 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium">متوسط النجاح</span>
              </div>
              <p className="text-3xl font-bold">{stats.avgSuccess}%</p>
              <p className="text-xs mt-1 text-white/80">نسبة التحقيق</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-amber-500/30 rounded-lg">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium">سهلة التنفيذ</span>
              </div>
              <p className="text-3xl font-bold">{stats.lowEffort}</p>
              <p className="text-xs mt-1 text-white/80">جهد قليل</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-500/30 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium">اتجاهات رائجة</span>
              </div>
              <p className="text-3xl font-bold">{stats.trending}</p>
              <p className="text-xs mt-1 text-white/80">فرص ساخنة</p>
            </motion.div>
          </div>

          {/* Pro Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/30 rounded-lg mt-1">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold mb-1">💡 نصيحة ذكية</h4>
                <p className="text-sm text-white/90">
                  {activeTab === 'opportunities' 
                    ? 'ابدأ بالفرص ذات الأولوية العالية والجهد المنخفض لتحقيق أسرع النتائج. استخدم خاصية "إرسال للسوق" لمشاركة الفرص مع شركائك المحتملين!'
                    : 'تصفح معارض الموردين المختلفة واكتشف منتجاتهم الحصرية. يمكنك التواصل مباشرة مع الموردين لعقد صفقات مميزة!'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Exhibitions Section */}
      {activeTab === 'exhibitions' && (
  <AnimatePresence>
          {selectedExhibition ? (
            // Exhibition Detail View
            <motion.div
              key="exhibition-detail"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Back Button */}
              <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <button
                  onClick={() => setSelectedExhibition(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="العودة للمعارض"
                  aria-label="العودة للمعارض"
                >
                  <ArrowRight className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-800">{selectedExhibition.title}</h3>
                  <p className="text-sm text-gray-500">من {selectedExhibition.supplierName}</p>
                </div>
              </div>

              {/* Exhibition Banner */}
              {selectedExhibition.banner && (
                <div className="relative h-64 bg-gradient-to-br from-purple-500 to-pink-500">
                  <img 
                    src={selectedExhibition.banner} 
                    alt={selectedExhibition.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 right-4 left-4">
                    <p className="text-white text-lg">{selectedExhibition.description}</p>
                  </div>
                </div>
              )}

              {/* Exhibition Stats */}
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

              {/* Exhibition Products */}
              <div className="p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4">منتجات المعرض</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedExhibition.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Product Image */}
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

                      {/* Product Info */}
                      <div className="p-4">
                        <h5 className="font-bold text-gray-800 mb-1">{item.name}</h5>
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
                          <ShoppingBag className="w-4 h-4" />
                          إضافة للسلة
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            // Exhibitions Grid View
            <motion.div
              key="exhibitions-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {exhibitions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center"
                >
                  <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">لا توجد معارض متاحة حالياً</h3>
                  <p className="text-gray-500">سيتم عرض المعارض العامة للموردين هنا</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exhibitions.map((exhibition, index) => (
                    <motion.div
                      key={exhibition.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedExhibition(exhibition)}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                    >
                      {/* Exhibition Banner */}
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

                      {/* Exhibition Info */}
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

                        {/* Stats */}
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

                        {/* Action Button */}
                        <button className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" />
                          عرض المعرض
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default MarketOpportunities;