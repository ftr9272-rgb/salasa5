import React, { useState, useEffect } from 'react';
// motion is used via JSX tags (e.g. <motion.div />); ESLint may false-positive that it's unused
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const SupplierMerchants = () => {
  const [merchants, setMerchants] = useState(() => {
    try {
      // migrate/read partners key first, fallback to older merchants key
      const raw = localStorage.getItem('supplier_partners_v1') || localStorage.getItem('supplier_merchants_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [_selectedMerchant, _setSelectedMerchant] = useState(null);
  const [_showMerchantDetails, _setShowMerchantDetails] = useState(false);

  // add partner modal state
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [newPartner, setNewPartner] = useState({ type: 'merchant', name: '', email: '', phone: '', services: '' });
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    try {
      localStorage.setItem('supplier_partners_v1', JSON.stringify(merchants));
    } catch {}
  }, [merchants]);

  useEffect(() => {
    const fetchMerchants = async () => {
    try {
      // محاكاة البيانات - في التطبيق الحقيقي ستأتي من API
      const mockMerchants = [
        {
          id: 1,
          name: 'متجر الأسواق الحديثة',
          type: 'merchant',
          email: 'modern@markets.com',
          phone: '+966501234567',
          address: 'الرياض، حي النخيل، شارع الملك فهد',
          businessType: 'تجارة إلكترونية',
          rating: 4.8,
          totalOrders: 45,
          totalSpent: 125000,
          lastOrderDate: '2025-09-06',
          status: 'active',
          joinDate: '2024-01-15',
          paymentTerms: '30 يوم',
          creditLimit: 50000,
          notes: 'عميل ممتاز، دفع منتظم'
        },
        {
          id: 2,
          type: 'merchant',
          name: 'سوق المدينة',
          email: 'city@market.com',
          phone: '+966502345678',
          address: 'جدة، حي الصفا، شارع التحلية',
          businessType: 'متجر تقليدي',
          rating: 4.5,
          totalOrders: 32,
          totalSpent: 89000,
          lastOrderDate: '2025-09-05',
          status: 'active',
          joinDate: '2024-03-20',
          paymentTerms: '15 يوم',
          creditLimit: 30000,
          notes: 'عميل جيد، يحتاج متابعة'
        },
        {
          id: 3,
          type: 'merchant',
          name: 'متجر الجودة',
          email: 'quality@store.com',
          phone: '+966503456789',
          address: 'الدمام، حي الفيصلية، شارع الأمير محمد',
          businessType: 'متجر متخصص',
          rating: 4.9,
          totalOrders: 67,
          totalSpent: 198000,
          lastOrderDate: '2025-09-04',
          status: 'vip',
          joinDate: '2023-11-10',
          paymentTerms: '45 يوم',
          creditLimit: 100000,
          notes: 'عميل VIP، أولوية في الخدمة'
        },
        {
          id: 4,
          type: 'merchant',
          name: 'متجر التقنية',
          email: 'tech@store.com',
          phone: '+966504567890',
          address: 'مكة المكرمة، حي العزيزية، شارع الحرم',
          businessType: 'إلكترونيات',
          rating: 3.8,
          totalOrders: 12,
          totalSpent: 25000,
          lastOrderDate: '2025-08-28',
          status: 'inactive',
          joinDate: '2024-06-05',
          paymentTerms: '7 أيام',
          creditLimit: 10000,
          notes: 'عميل جديد، يحتاج تطوير العلاقة'
        }
        ,
        // شركات الشحن
        {
          id: 101,
          type: 'shipping',
          name: 'شركة الشحن السريعة',
          email: 'fast@shipping.com',
          phone: '+966505000111',
          address: 'الرياض، حي الشحن',
          businessType: 'شحن وتوصيل',
          services: 'توصيل داخلي، توصيل عاجل',
          rating: 4.6,
          totalOrders: 120,
          totalSpent: 0,
          lastOrderDate: '2025-09-06',
          status: 'active',
          joinDate: '2022-05-01',
          paymentTerms: '30 يوم',
          creditLimit: 0,
          notes: 'شريك شحن موثوق'
        },
        {
          id: 102,
          type: 'shipping',
          name: 'الشحن الوطني',
          email: 'national@ship.com',
          phone: '+966505000222',
          address: 'جدة، حي الصناعات',
          businessType: 'نقل جوي وبري',
          services: 'نقل ثقيل، تتبع شحنات',
          rating: 4.2,
          totalOrders: 80,
          totalSpent: 0,
          lastOrderDate: '2025-09-03',
          status: 'active',
          joinDate: '2023-02-15',
          paymentTerms: '15 يوم',
          creditLimit: 0,
          notes: 'شركات شحن متعاونة'
        }
      ];
      // only set mock if we don't already have persisted merchants
      setMerchants((prev) => (prev && prev.length ? prev : mockMerchants));
    } catch (error) {
      console.error('خطأ في جلب بيانات التجار:', error);
    }
    };
    fetchMerchants();
  }, []);

  const openAddPartner = () => {
    setNewPartner({ type: 'merchant', name: '', email: '', phone: '', services: '' });
    setShowAddPartner(true);
  };

  const closeAddPartner = () => setShowAddPartner(false);

  const handleAddPartnerSubmit = (e) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.name.trim()) {
      alert('الرجاء إدخال اسم الشريك');
      return;
    }
    const payload = {
      type: newPartner.type,
      name: newPartner.name,
      email: newPartner.email,
      phone: newPartner.phone,
      services: newPartner.services
    };
  fetch('/api/supplier/merchants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'خطأ');
        }
        return res.json();
      })
      .then((data) => {
        const created = (data && data.merchant) ? data.merchant : { id: Date.now(), name: payload.name, email: payload.email, phone: payload.phone };
        const partnerObj = { id: created.id || Date.now(), name: created.name || payload.name, email: created.email || payload.email, phone: created.phone || payload.phone, type: payload.type, businessType: payload.type === 'shipping' ? 'شحن وتوصيل' : 'تجارة', services: payload.services || '', rating: 0, totalOrders: 0, totalSpent: 0, creditLimit: 0, lastOrderDate: '-', paymentTerms: '-' };
        setMerchants((prev) => [partnerObj, ...prev]);
        setShowAddPartner(false);
      })
      .catch(() => {
        const id = Date.now();
        const partnerObj = { id, name: newPartner.name, email: newPartner.email, phone: newPartner.phone, type: newPartner.type, businessType: newPartner.type === 'shipping' ? 'شحن وتوصيل' : 'تجارة', services: newPartner.services || '', rating: 0, totalOrders: 0, totalSpent: 0, creditLimit: 0, lastOrderDate: '-', paymentTerms: '-' };
        setMerchants((prev) => [partnerObj, ...prev]);
        setShowAddPartner(false);
      });
  };

  const filteredMerchants = merchants.filter(merchant => {
    const searchLower = (searchTerm || '').toLowerCase();
    const matchesSearch = (merchant.name || '').toLowerCase().includes(searchLower) ||
                         (merchant.email || '').toLowerCase().includes(searchLower) ||
                         (merchant.businessType || '').toLowerCase().includes(searchLower);
    const matchesRating = filterRating === 'all' || 
                         (filterRating === 'high' && merchant.rating >= 4.5) ||
                         (filterRating === 'medium' && merchant.rating >= 3.5 && merchant.rating < 4.5) ||
                         (filterRating === 'low' && merchant.rating < 3.5);
    const matchesType = filterType === 'all' || (merchant.type || 'merchant') === filterType;
    return matchesSearch && matchesRating && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'vip':
        return 'bg-purple-100 text-purple-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'vip':
        return 'VIP';
      case 'inactive':
        return 'غير نشط';
      default:
        return status;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-200 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  const _ratingFilters = ['all', 'high', 'medium', 'low'];

  return (
    <div className="p-6 space-y-6" style={{ color: '#0f172a', WebkitTextFillColor: '#0f172a' }}>
      {/* العنوان والإحصائيات */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة التجار</h1>
          <p className="text-gray-600">متابعة وإدارة علاقاتك مع التجار والعملاء</p>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي التجار</p>
                  <p className="text-2xl font-bold">{merchants.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">التجار النشطون</p>
                  <p className="text-2xl font-bold text-green-600">
                    {merchants.filter(m => m.status === 'active' || m.status === 'vip').length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">عملاء VIP</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {merchants.filter(m => m.status === 'vip').length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي المبيعات</p>
                  <p className="text-2xl font-bold text-green-600">
                    {merchants.reduce((sum, m) => sum + (m.totalSpent || 0), 0).toLocaleString()} ريال
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* أدوات البحث والتصفية */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="البحث في التجار..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع الشركاء</option>
                  <option value="merchant">تجار</option>
                  <option value="shipping">شركات شحن</option>
                </select>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع التقييمات</option>
                  <option value="high">تقييم عالي (4.5+)</option>
                  <option value="medium">تقييم متوسط (3.5-4.5)</option>
                  <option value="low">تقييم منخفض (أقل من 3.5)</option>
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  تصفية
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* قائمة التجار */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>قائمة الشركاء</CardTitle>
                <CardDescription>
                  عرض {filteredMerchants.length} من أصل {merchants.length} شريك
                </CardDescription>
              </div>
              <div>
                <Button onClick={openAddPartner} className="bg-green-600 text-white hover:bg-green-700">
                  <Users className="h-4 w-4 mr-2" />
                  إضافة شريك
                </Button>
              </div>
            </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMerchants.map((merchant) => (
                <motion.div
                  key={merchant.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow supplier-card"
                  style={{ backgroundColor: '#ffffff', color: '#111827' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          title={merchant.name || ''}
                          className="font-semibold text-lg clamp-2"
                          style={{
                            color: '#0f172a',
                            margin: 0,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: '1.15',
                              overflowWrap: 'break-word',
                              WebkitTextFillColor: '#0f172a',
                              backgroundClip: 'initial'
                          }}
                        >
                          {merchant.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(merchant.status)}`}>
                          {getStatusText(merchant.status)}
                        </span>
                      </div>
                      <p title={merchant.businessType || ''} className="mb-1" style={{ color: '#475569', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', WebkitTextFillColor: '#475569', backgroundClip: 'initial' }}>{merchant.businessType}</p>
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(merchant.rating)}
                        <span className="text-sm text-gray-600 mr-1">({merchant.rating})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span title={merchant.email || ''} className="block" style={{ maxWidth: '100%', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#374151', overflowWrap: 'anywhere', WebkitTextFillColor: '#374151', backgroundClip: 'initial' }}>{merchant.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span title={merchant.phone || ''} className="block" style={{ maxWidth: '100%', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#374151', WebkitTextFillColor: '#374151', backgroundClip: 'initial' }}>{merchant.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span title={merchant.address || ''} className="block" style={{ maxWidth: '100%', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#374151', overflowWrap: 'anywhere', WebkitTextFillColor: '#374151', backgroundClip: 'initial' }}>{merchant.address}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{merchant.totalOrders}</p>
                      <p className="text-xs text-gray-600">طلب</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{(merchant.totalSpent || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-600">ريال</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{(merchant.creditLimit || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-600">حد ائتماني</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">آخر طلب:</span>
                      <span className="font-medium">{merchant.lastOrderDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">شروط الدفع:</span>
                      <span className="font-medium">{merchant.paymentTerms}</span>
                    </div>
                  </div>

                  {merchant.notes && (
                    <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                      <p title={merchant.notes || ''} className="text-sm text-blue-800" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', WebkitTextFillColor: '#1e3a8a', color: '#1e3a8a', backgroundClip: 'initial' }}>{merchant.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        _setSelectedMerchant(merchant);
                        _setShowMerchantDetails(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      عرض التفاصيل
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      اتصال
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-1" />
                      رسالة
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredMerchants.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">لا يوجد شركاء يطابقون البحث</p>
              </div>
            )}
          </CardContent>
        </Card>
        {showAddPartner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
              <h4 className="text-lg font-bold mb-4">إضافة شريك جديد</h4>
              <form onSubmit={handleAddPartnerSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-700">نوع الشريك</label>
                  <select value={newPartner.type} onChange={(e) => setNewPartner(s => ({ ...s, type: e.target.value }))} className="w-full mt-2 px-3 py-2 border rounded-lg">
                    <option value="merchant">تاجر</option>
                    <option value="shipping">شركة شحن</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-700">اسم الشريك</label>
                  <input autoFocus value={newPartner.name} onChange={(e) => setNewPartner((s) => ({ ...s, name: e.target.value }))} className="w-full mt-2 px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm text-gray-700">البريد الإلكتروني</label>
                  <input value={newPartner.email} onChange={(e) => setNewPartner((s) => ({ ...s, email: e.target.value }))} className="w-full mt-2 px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm text-gray-700">الهاتف</label>
                  <input value={newPartner.phone} onChange={(e) => setNewPartner((s) => ({ ...s, phone: e.target.value }))} className="w-full mt-2 px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm text-gray-700">خدمات / ملاحظات</label>
                  <input value={newPartner.services} onChange={(e) => setNewPartner((s) => ({ ...s, services: e.target.value }))} className="w-full mt-2 px-3 py-2 border rounded-lg" />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button type="button" onClick={closeAddPartner} className="px-4 py-2 rounded-lg bg-gray-100">إلغاء</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white">إضافة</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SupplierMerchants;

