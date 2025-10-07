import { motion } from 'framer-motion';
import { Package, TrendingUp, Users, ShoppingCart, Truck, AlertCircle, CheckCircle, Clock, Plus, Filter, Search, BarChart3, Eye, Edit, Star, Calendar, DollarSign, Percent, Upload, Bell, Settings, User, FileText, Archive, Layers, Tag, Gift, MapPin, Phone, Mail, Globe, Award, Shield, Zap, Target, X, Save, Trash2, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage, Product, Order, OrderProduct } from '../utils/localStorage';

// Types for our supplier dashboard
interface SupplierProduct extends Product {
  sold?: number;
}

interface SupplierOrder extends Order {
  merchantName: string;
  orderValue: string;
  product: string;
  quantity: number;
  date: string;
}

interface InventoryAlert {
  product: string;
  stock: number;
  threshold: number;
  status: 'low' | 'out';
}

interface PerformanceMetric {
  label: string;
  value: string;
  change: string;
}

interface SupplierProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  verified: boolean;
  joinDate: string;
  totalSales: string;
  productsCount: number;
  activeOrders: number;
}

function SupplierDashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('الشهر');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Form states
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showEditProductForm, setShowEditProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SupplierProduct | null>(null);
  
  // Form data
  const [productFormData, setProductFormData] = useState({
    name: '',
    price: 0,
    stock: 0,
    category: '',
    description: '',
    sku: '',
    weight: '',
    dimensions: '',
    status: 'active' as 'active' | 'inactive' | 'draft'
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For demonstration, we'll load from localStorage if available
    const savedProducts = localStorage.getItem('supplier_products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error('Failed to parse saved products:', e);
      }
    } else {
      // Load from main storage if no supplier-specific data exists
      const mainProducts = storage.getProducts();
      if (mainProducts.length > 0) {
        setProducts(mainProducts.map(p => ({ ...p, sold: Math.floor(Math.random() * 100) })));
      }
    }
    
    const savedOrders = localStorage.getItem('supplier_orders');
    if (savedOrders) {
      try {
        setRecentOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error('Failed to parse saved orders:', e);
      }
    }
  }, [user]);

  // Stats for supplier dashboard (only shown in overview)
  const stats = [
    {
      title: 'إجمالي المنتجات',
      value: '284',
      change: '+5.2%',
      icon: <Package className="w-6 h-6" />,
      color: 'text-supplier',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      trend: 'up'
    },
    {
      title: 'الطلبات الجديدة',
      value: '67',
      change: '+18.5%',
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      trend: 'up'
    },
    {
      title: 'العملاء النشطون',
      value: '145',
      change: '+7.8%',
      icon: <Users className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      trend: 'up'
    },
    {
      title: 'معدل الرضا',
      value: '4.7/5',
      change: '+0.3%',
      icon: <Star className="w-6 h-6" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      trend: 'up'
    },
    {
      title: 'الإيرادات الشهرية',
      value: '125,000 ريال',
      change: '+12.3%',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      trend: 'up'
    },
    {
      title: 'متوسط وقت التسليم',
      value: '2.3 يوم',
      change: '-0.5%',
      icon: <Truck className="w-6 h-6" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      trend: 'down'
    }
  ];

  // Mock data - in a real app this would come from API/storage
  const [recentOrders, setRecentOrders] = useState<SupplierOrder[]>([
    {
      id: 'ORD-001',
      merchantName: 'متجر الإلكترونيات المتقدم',
      product: 'هواتف ذكية - آيفون 15',
      quantity: 50,
      status: 'pending',
      date: '2024-01-15',
      orderValue: '125,000 ريال',
      customerId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      products: [],
      totalAmount: 0,
      priority: 'عالية',
      deliveryAddress: '',
      deliveryDate: '',
      notes: '',
      createdAt: ''
    },
    {
      id: 'ORD-002',
      merchantName: 'متجر الأجهزة المنزلية',
      product: 'أجهزة كمبيوتر محمولة',
      quantity: 25,
      status: 'processing',
      date: '2024-01-14',
      orderValue: '87,500 ريال',
      customerId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      products: [],
      totalAmount: 0,
      priority: 'متوسطة',
      deliveryAddress: '',
      deliveryDate: '',
      notes: '',
      createdAt: ''
    },
    {
      id: 'ORD-003',
      merchantName: 'متجر الأزياء العصرية',
      product: 'ملابس رياضية متنوعة',
      quantity: 100,
      status: 'completed',
      date: '2024-01-13',
      orderValue: '45,200 ريال',
      customerId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      products: [],
      totalAmount: 0,
      priority: 'منخفضة',
      deliveryAddress: '',
      deliveryDate: '',
      notes: '',
      createdAt: ''
    },
    {
      id: 'ORD-004',
      merchantName: 'متجر الكتب والمكتبة',
      product: 'كتب تعليمية وثقافية',
      quantity: 200,
      status: 'shipped',
      date: '2024-01-12',
      orderValue: '32,800 ريال',
      customerId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      products: [],
      totalAmount: 0,
      priority: 'متوسطة',
      deliveryAddress: '',
      deliveryDate: '',
      notes: '',
      createdAt: ''
    }
  ]);

  const [products, setProducts] = useState<SupplierProduct[]>([
    { 
      id: '1', 
      name: 'هواتف ذكية - آيفون 15', 
      price: 2500, 
      stock: 50, 
      sold: 156, 
      status: 'active', 
      category: 'إلكترونيات',
      description: 'أحدث هاتف ذكي من آبل',
      images: [],
      sku: 'IP15-001',
      weight: '0.2 كج',
      dimensions: '15×7×0.8 سم',
      createdAt: new Date().toISOString()
    },
    { 
      id: '2', 
      name: 'أجهزة كمبيوتر محمولة', 
      price: 3500, 
      stock: 25, 
      sold: 89, 
      status: 'active', 
      category: 'إلكترونيات',
      description: 'لابتوب عالي الأداء',
      images: [],
      sku: 'LAPTOP-001',
      weight: '1.5 كج',
      dimensions: '30×20×2 سم',
      createdAt: new Date().toISOString()
    },
    { 
      id: '3', 
      name: 'ملابس رياضية متنوعة', 
      price: 450, 
      stock: 100, 
      sold: 234, 
      status: 'active', 
      category: 'أزياء',
      description: 'ملابس رياضية مريحة',
      images: [],
      sku: 'SPORT-001',
      weight: '0.3 كج',
      dimensions: '40×30×5 سم',
      createdAt: new Date().toISOString()
    },
    { 
      id: '4', 
      name: 'كتب تعليمية وثقافية', 
      price: 164, 
      stock: 200, 
      sold: 67, 
      status: 'draft', 
      category: 'كتب',
      description: 'كتب معرفية متنوعة',
      images: [],
      sku: 'BOOK-001',
      weight: '0.5 كج',
      dimensions: '20×15×3 سم',
      createdAt: new Date().toISOString()
    },
    { 
      id: '5', 
      name: 'أدوات منزلية', 
      price: 320, 
      stock: 0, 
      sold: 45, 
      status: 'inactive', 
      category: 'منزلية',
      description: 'أدوات منزلية متعددة الاستخدامات',
      images: [],
      sku: 'HOME-001',
      weight: '1 كج',
      dimensions: '25×15×10 سم',
      createdAt: new Date().toISOString()
    },
    { 
      id: '6', 
      name: 'مكملات غذائية', 
      price: 89, 
      stock: 75, 
      sold: 123, 
      status: 'active', 
      category: 'صحة',
      description: 'مكملات غذائية عالية الجودة',
      images: [],
      sku: 'HEALTH-001',
      weight: '0.2 كج',
      dimensions: '10×5×2 سم',
      createdAt: new Date().toISOString()
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'processing':
        return <AlertCircle className="w-3 h-3" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'shipped':
        return <Truck className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار';
      case 'processing':
        return 'قيد المعالجة';
      case 'completed':
        return 'مكتمل';
      case 'shipped':
        return 'تم الشحن';
      default:
        return 'غير محدد';
    }
  };

  // New supplier-specific data
  const supplierProfile: SupplierProfile = {
    name: user?.companyName || user?.name || 'مورد الجودة العالية',
    email: user?.email || 'supplier@example.com',
    phone: user?.phone || '+966507654321',
    address: 'الرياض، حي النرجس، شارع الملك فهد',
    rating: 4.8,
    verified: true,
    joinDate: '2023-05-15',
    totalSales: '2,450,000 ريال',
    productsCount: 284,
    activeOrders: 67
  };

  const inventoryAlerts: InventoryAlert[] = [
    { product: 'هواتف ذكية - آيفون 15', stock: 5, threshold: 10, status: 'low' },
    { product: 'أدوات منزلية', stock: 0, threshold: 5, status: 'out' },
    { product: 'سماعة بلوتوث جودة عالية', stock: 3, threshold: 10, status: 'low' }
  ];

  const performanceMetrics: PerformanceMetric[] = [
    { label: 'معدل التسليم في الوقت المحدد', value: '94%', change: '+2.1%' },
    { label: 'معدل إرجاع المنتجات', value: '1.2%', change: '-0.3%' },
    { label: 'متوسط وقت الاستجابة', value: '2.5 ساعة', change: '-0.8 ساعة' },
    { label: 'نسبة الطلبات المكتملة', value: '98.5%', change: '+1.2%' }
  ];

  // Handle form input changes
  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  // Handle adding a new product
  const handleAddProduct = () => {
    const newProduct: SupplierProduct = {
      ...productFormData,
      id: Date.now().toString(),
      sold: 0,
      images: [],
      createdAt: new Date().toISOString()
    };
    
    setProducts(prev => {
      const updatedProducts = [...prev, newProduct];
      // Save to localStorage
      localStorage.setItem('supplier_products', JSON.stringify(updatedProducts));
      // Also save to main storage
      try {
        storage.addProduct({
          name: newProduct.name,
          price: newProduct.price,
          stock: newProduct.stock,
          category: newProduct.category,
          description: newProduct.description,
          images: newProduct.images,
          sku: newProduct.sku,
          weight: newProduct.weight,
          dimensions: newProduct.dimensions,
          status: newProduct.status
        });
      } catch (e) {
        console.error('Failed to save to main storage:', e);
      }
      return updatedProducts;
    });
    setProductFormData({
      name: '',
      price: 0,
      stock: 0,
      category: '',
      description: '',
      sku: '',
      weight: '',
      dimensions: '',
      status: 'active'
    });
    setShowAddProductForm(false);
  };

  // Handle editing a product
  const handleEditProduct = (product: SupplierProduct) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      description: product.description,
      sku: product.sku,
      weight: product.weight,
      dimensions: product.dimensions,
      status: product.status
    });
    setShowEditProductForm(true);
  };

  // Handle updating a product
  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    
    setProducts(prev => {
      const updatedProducts = prev.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...productFormData } 
          : p
      );
      // Save to localStorage
      localStorage.setItem('supplier_products', JSON.stringify(updatedProducts));
      // Also update in main storage
      try {
        storage.updateProduct(editingProduct.id, {
          name: productFormData.name,
          price: productFormData.price,
          stock: productFormData.stock,
          category: productFormData.category,
          description: productFormData.description,
          images: editingProduct.images,
          sku: productFormData.sku,
          weight: productFormData.weight,
          dimensions: productFormData.dimensions,
          status: productFormData.status,
          createdAt: editingProduct.createdAt
        });
      } catch (e) {
        console.error('Failed to update in main storage:', e);
      }
      return updatedProducts;
    });
    
    setEditingProduct(null);
    setShowEditProductForm(false);
    setProductFormData({
      name: '',
      price: 0,
      stock: 0,
      category: '',
      description: '',
      sku: '',
      weight: '',
      dimensions: '',
      status: 'active'
    });
  };

  // Handle deleting a product
  const handleDeleteProduct = (id: string) => {
    setProducts(prev => {
      const updatedProducts = prev.filter(p => p.id !== id);
      // Save to localStorage
      localStorage.setItem('supplier_products', JSON.stringify(updatedProducts));
      // Also delete from main storage
      try {
        storage.deleteProduct(id);
      } catch (e) {
        console.error('Failed to delete from main storage:', e);
      }
      return updatedProducts;
    });
  };

  // Handle accepting an order
  const handleAcceptOrder = (orderId: string) => {
    setRecentOrders(prev => {
      const updatedOrders = prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'processing' } 
          : order
      );
      // Save to localStorage
      localStorage.setItem('supplier_orders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });
  };

  // Handle shipping an order
  const handleShipOrder = (orderId: string) => {
    setRecentOrders(prev => {
      const updatedOrders = prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'shipped' } 
          : order
      );
      // Save to localStorage
      localStorage.setItem('supplier_orders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-right"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              📦 لوحة تحكم المورد
            </h1>
            <p className="text-lg text-gray-600">
              إدارة منتجاتك وطلباتك من مكان واحد مع تتبع شامل للأداء 📊
            </p>
          </motion.div>
        </div>

        {/* محدد الفترة مع تصميم محسن */}
        <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {['اليوم', 'الأسبوع', 'الشهر', 'السنة'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-emerald-500 to-purple-600 text-white shadow-xl scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:shadow-lg hover:scale-102'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          
          {/* التبويبات مع تحسينات */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: '📊' },
              { id: 'products', label: 'المنتجات', icon: '📦' },
              { id: 'orders', label: 'الطلبات', icon: '🛒' },
              { id: 'inventory', label: 'المخزون', icon: '📦' },
              { id: 'analytics', label: 'التحليلات', icon: '📈' },
              { id: 'profile', label: 'الملف الشخصي', icon: '👤' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-xl scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:shadow-lg hover:scale-102'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards - Only shown in overview tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${stat.bgColor} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-opacity-20 hover:scale-105 cursor-pointer group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-sm font-semibold ${stat.color} flex items-center gap-1`}>
                        {stat.trend === 'up' ? '📈' : '📉'} {stat.change}
                      </span>
                      <span className="text-xs text-gray-500">من {selectedPeriod} الماضي</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl bg-white bg-opacity-70 group-hover:scale-110 transition-transform ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* محتوى التبويبات */}
        {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">إجمالي المنتجات</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <Package className="w-8 h-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">المنتجات النشطة</p>
                  <p className="text-2xl font-bold">{products.filter(p => p.status === 'active').length}</p>
                </div>
                <CheckCircle className="w-8 h-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">الطلبات قيد المعالجة</p>
                  <p className="text-2xl font-bold">{recentOrders.filter(o => o.status === 'processing').length}</p>
                </div>
                <Clock className="w-8 h-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">إجمالي المبيعات</p>
                  <p className="text-2xl font-bold">{products.reduce((sum, p) => sum + (p.sold || 0), 0)}</p>
                </div>
                <TrendingUp className="w-8 h-8 opacity-80" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2 bg-card rounded-xl p-6 card-shadow"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground font-heading">
                  الطلبات الأخيرة
                </h2>
                <button className="text-primary hover:text-primary/80 transition-colors font-arabic text-sm">
                  عرض جميع الطلبات
                </button>
              </div>
              
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-foreground font-arabic">
                            {order.merchantName}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            #{order.id}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground font-arabic mb-1">
                          {order.product}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="font-arabic">الكمية: {order.quantity}</span>
                          <span className="font-arabic">{order.date}</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground font-heading mb-2">
                          {order.orderValue}
                        </p>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-arabic ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Product Management & Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              {/* Product Summary */}
              <div className="bg-card rounded-xl p-6 card-shadow">
                <h3 className="text-lg font-semibold text-foreground font-heading mb-4">
                  ملخص المنتجات
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-arabic">المنتجات النشطة</span>
                    <span className="font-semibold text-green-600">{products.filter(p => p.status === 'active').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-arabic">نفدت الكمية</span>
                    <span className="font-semibold text-red-600">{products.filter(p => p.stock === 0).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-arabic">قيد المراجعة</span>
                    <span className="font-semibold text-yellow-600">{products.filter(p => p.status === 'draft').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-arabic">المسودات</span>
                    <span className="font-semibold text-muted-foreground">{products.filter(p => p.status === 'inactive').length}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card rounded-xl p-6 card-shadow">
                <h3 className="text-lg font-semibold text-foreground font-heading mb-4">
                  إجراءات سريعة
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowAddProductForm(true)}
                    className="w-full bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 transition-colors text-right font-arabic flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة منتج جديد
                  </button>
                  <button className="w-full bg-secondary text-secondary-foreground p-3 rounded-lg hover:bg-secondary/80 transition-colors text-right font-arabic flex items-center justify-center gap-2">
                    <Tag className="w-4 h-4" />
                    تحديث الأسعار
                  </button>
                  <button className="w-full bg-muted text-muted-foreground p-3 rounded-lg hover:bg-muted/80 transition-colors text-right font-arabic flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    تقرير المبيعات
                  </button>
                  <button className="w-full border border-primary text-primary p-3 rounded-lg hover:bg-primary/5 transition-colors text-right font-arabic flex items-center justify-center gap-2">
                    <Gift className="w-4 h-4" />
                    إدارة العروض
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <span>📦</span> إدارة المنتجات
              </h2>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="البحث عن منتج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  />
                </div>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  title="فلتر حسب الحالة"
                >
                  <option value="">جميع المنتجات</option>
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                  <option value="draft">مسودة</option>
                </select>
                <button 
                  onClick={() => setShowAddProductForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  إضافة منتج
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter(product => {
                  const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                     product.category.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesStatus = selectedStatus ? product.status === selectedStatus : true;
                  return matchesSearch && matchesStatus;
                })
                .map((product, index) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-xl ${
                        product.status === 'active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        product.status === 'inactive' ? 'bg-red-100 text-red-800 border border-red-200' :
                        'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {product.status === 'active' ? '🟢 نشط' : product.status === 'inactive' ? '🔴 غير نشط' : '🟡 مسودة'}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-lg border border-blue-200">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          السعر: {product.price.toLocaleString()} ريال
                        </span>
                        <span className="text-sm text-gray-500">
                          الكمية المتاحة: {product.stock}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <span>🛒</span> إدارة الطلبات
              </h2>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="البحث عن طلب..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  />
                </div>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  title="فلتر حسب الحالة"
                >
                  <option value="">جميع الطلبات</option>
                  <option value="pending">في الانتظار</option>
                  <option value="processing">قيد المعالجة</option>
                  <option value="completed">مكتمل</option>
                  <option value="shipped">تم الشحن</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentOrders
                .filter(order => {
                  const matchesSearch = order.product.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                     order.merchantName.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesStatus = selectedStatus ? order.status === selectedStatus : true;
                  return matchesSearch && matchesStatus;
                })
                .map((order, index) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-xl ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-lg border border-blue-200">
                        {order.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {order.product}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {order.merchantName}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          الكمية: {order.quantity}
                        </span>
                        <span className="text-sm text-gray-500">
                          قيمة الطلب: {order.orderValue}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => handleAcceptOrder(order.id)}
                            className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            قبول الطلب
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button 
                            onClick={() => handleShipOrder(order.id)}
                            className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            شحن الطلب
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <span>📦</span> إدارة المخزون
              </h2>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="البحث عن منتج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter(product => {
                  const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                     product.category.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesStatus = selectedStatus ? product.status === selectedStatus : true;
                  return matchesSearch && matchesStatus;
                })
                .map((product, index) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-xl ${
                        product.status === 'active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        product.status === 'inactive' ? 'bg-red-100 text-red-800 border border-red-200' :
                        'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {product.status === 'active' ? '🟢 نشط' : product.status === 'inactive' ? '🔴 غير نشط' : '🟡 مسودة'}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-lg border border-blue-200">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-2 bg-emerald-50 rounded-lg">
                        <span>💰 السعر:</span>
                        <span className="font-bold text-emerald-600">{product.price} ريال</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                        <span>📦 المخزون:</span>
                        <span className={`font-bold ${product.stock > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          {product.stock > 0 ? product.stock : 'نفد المخزون'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                        <span>🏆 المبيعات:</span>
                        <span className="font-bold text-purple-600">{product.sold || 0}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-xl text-sm hover:from-blue-200 hover:to-blue-300 transition-all font-semibold flex items-center justify-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        تعديل
                      </button>
                      <button className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 rounded-xl text-sm hover:from-emerald-200 hover:to-emerald-300 transition-all font-semibold flex items-center justify-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        الإحصائيات
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="mt-3 w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </button>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <span>📈</span> التحليلات
              </h2>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="البحث عن مؤشر..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {performanceMetrics
                .filter(metric => {
                  const matchesSearch = metric.label.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchesSearch;
                })
                .map((metric, index) => (
                  <motion.div 
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all group"
                  >
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {metric.label}
                    </h3>
                    <p className="text-3xl font-bold text-emerald-600 mb-2">
                      {metric.value}
                    </p>
                    <p className="text-sm text-gray-600">
                      {metric.change}
                    </p>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <span>🛒</span> إدارة الطلبات
              </h2>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="البحث عن طلب..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  />
                </div>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  title="فلتر حسب الحالة"
                >
                  <option value="">جميع الطلبات</option>
                  <option value="pending">في الانتظار</option>
                  <option value="processing">قيد المعالجة</option>
                  <option value="completed">مكتمل</option>
                  <option value="shipped">تم الشحن</option>
                </select>
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  تقرير شامل
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="border-2 border-gray-100 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-xl transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-bold text-xl text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {order.merchantName}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                          #{order.id}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3 text-lg">{order.product}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span className="flex items-center gap-1">📦 الكمية: <strong>{order.quantity}</strong></span>
                        <span className="flex items-center gap-1">📅 {order.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl text-emerald-600 mb-3">
                        {order.orderValue}
                      </p>
                      <span className={`inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-bold border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      عرض التفاصيل
                    </button>
                    <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors font-medium flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      اتصال بالتاجر
                    </button>
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => handleAcceptOrder(order.id)}
                        className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors font-medium flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        قبول الطلب
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button 
                        onClick={() => handleShipOrder(order.id)}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium flex items-center gap-1"
                      >
                        <Truck className="w-4 h-4" />
                        تحديث الشحن
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Inventory Alerts */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                <span>⚠️</span> تنبيهات المخزون
              </h2>
              
              <div className="space-y-4">
                {inventoryAlerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      alert.status === 'out' 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{alert.product}</h3>
                        <p className="text-sm text-gray-600">
                          المخزون الحالي: <span className="font-bold">{alert.stock}</span> | الحد الأدنى: {alert.threshold}
                        </p>
                      </div>
                      <button className={`px-4 py-2 rounded-lg font-medium ${
                        alert.status === 'out' 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-yellow-500 text-white hover:bg-yellow-600'
                      }`}>
                        {alert.status === 'out' ? 'إعادة التجهيز' : 'تحديث الكمية'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Inventory Management */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span>📦</span> إدارة المخزون
                </h2>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="البحث في المخزون..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                    />
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    تصدير التقرير
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-3 font-semibold">المنتج</th>
                      <th className="pb-3 font-semibold">التصنيف</th>
                      <th className="pb-3 font-semibold">الكمية</th>
                      <th className="pb-3 font-semibold">الحد الأدنى</th>
                      <th className="pb-3 font-semibold">الحالة</th>
                      <th className="pb-3 font-semibold">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 font-medium">{product.name}</td>
                        <td className="py-4">{product.category}</td>
                        <td className="py-4">
                          <span className={product.stock === 0 ? 'text-red-600 font-bold' : ''}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-4">10</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.stock === 0 
                              ? 'bg-red-100 text-red-800' 
                              : product.stock < 10 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {product.stock === 0 ? 'نفذ' : product.stock < 10 ? 'منخفض' : 'متوفر'}
                          </span>
                        </td>
                        <td className="py-4">
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            تحديث
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                <span>🏆</span> مقاييس الأداء
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {performanceMetrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200"
                  >
                    <h3 className="font-bold text-blue-800 mb-2">{metric.label}</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</p>
                    <p className="text-sm text-green-600 font-semibold">📈 {metric.change}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Financial Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
                <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  تحليل الإيرادات
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>إيرادات الشهر:</span>
                    <span className="font-bold text-emerald-600">285,700 ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span>متوسط الطلب:</span>
                    <span className="font-bold text-emerald-600">4,265 ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الهامش الربحي:</span>
                    <span className="font-bold text-emerald-600">23.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>النمو الشهري:</span>
                    <span className="font-bold text-emerald-600">+18.5%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  تحليل المبيعات
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>أفضل منتج:</span>
                    <span className="font-bold text-blue-600">سماعات بلوتوث</span>
                  </div>
                  <div className="flex justify-between">
                    <span>أفضل فئة:</span>
                    <span className="font-bold text-blue-600">إلكترونيات</span>
                  </div>
                  <div className="flex justify-between">
                    <span>معدل النمو:</span>
                    <span className="font-bold text-blue-600">+18.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الطلبات الجديدة:</span>
                    <span className="font-bold text-blue-600">67 طلب</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
              <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                توصيات لتحسين الأداء
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    زيادة المبيعات
                  </h4>
                  <p className="text-sm text-gray-600">اضف منتجات جديدة في فئة الإلكترونيات لزيادة المبيعات بنسبة 25%</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    تحسين العرض
                  </h4>
                  <p className="text-sm text-gray-600">حسن من جودة صور المنتجات وأوصافها لزيادة معدل التحويل</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <Archive className="w-4 h-4" />
                    إدارة المخزون
                  </h4>
                  <p className="text-sm text-gray-600">12 منتج نفد مخزونه، قم بإعادة التجهيز قريباً</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    تحسين التقييم
                  </h4>
                  <p className="text-sm text-gray-600">تابع مع العملاء لتحسين تقييمات المنتجات والوصول لـ 4.8/5</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Supplier Profile */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                <span>👤</span> الملف الشخصي للمورد
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {supplierProfile.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{supplierProfile.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500">★</span>
                          <span className="font-bold">{supplierProfile.rating}</span>
                          <span className="text-gray-500">({supplierProfile.verified ? 'محقق' : 'غير محقق'})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                          <p className="font-medium">{supplierProfile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">رقم الهاتف</p>
                          <p className="font-medium">{supplierProfile.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">العنوان</p>
                          <p className="font-medium">{supplierProfile.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">تاريخ الانضمام</p>
                          <p className="font-medium">{supplierProfile.joinDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-blue-800 mb-4">إحصائيات سريعة</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">إجمالي المبيعات</span>
                      <span className="font-bold text-blue-600">{supplierProfile.totalSales}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">عدد المنتجات</span>
                      <span className="font-bold text-blue-600">{supplierProfile.productsCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">الطلبات النشطة</span>
                      <span className="font-bold text-blue-600">{supplierProfile.activeOrders}</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2">
                    <Settings className="w-4 h-4" />
                    تعديل الملف الشخصي
                  </button>
                </div>
              </div>
            </div>
            
            {/* Company Verification */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                <span>🛡️</span> توثيق الشركة
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">السجل التجاري</h3>
                  <p className="text-sm text-gray-500 mb-4">قم برفع صورة السجل التجاري</p>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    رفع ملف
                  </button>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">شهادة الجودة</h3>
                  <p className="text-sm text-gray-500 mb-4">قم برفع شهادات الجودة إن وجدت</p>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    رفع ملف
                  </button>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-green-50 border-green-200">
                  <Globe className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2 text-green-700">الملف مكتمل</h3>
                  <p className="text-sm text-green-600 mb-4">تم توثيق الشركة بنجاح</p>
                  <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            </div>
            
            {/* Notification Settings */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                <span>🔔</span> إعدادات الإشعارات
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">إشعارات الطلبات الجديدة</h3>
                    <p className="text-sm text-gray-500">تلقي إشعار عند وصول طلب جديد</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">إشعارات المخزون المنخفض</h3>
                    <p className="text-sm text-gray-500">تلقي إشعار عند نفاد أو انخفاض المخزون</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">إشعارات التقييمات</h3>
                    <p className="text-sm text-gray-500">تلقي إشعار عند تلقي تقييم جديد</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">النشر في السوق المشترك</h3>
                    <p className="text-sm text-gray-500">تلقي إشعارات حول عروض السوق المشترك</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">إضافة منتج جديد</h3>
                <button 
                  onClick={() => {
                    setShowAddProductForm(false);
                    setProductFormData({
                      name: '',
                      price: 0,
                      stock: 0,
                      category: '',
                      description: '',
                      sku: '',
                      weight: '',
                      dimensions: '',
                      status: 'active'
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
                  <input
                    type="text"
                    name="name"
                    value={productFormData.name}
                    onChange={handleProductFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="أدخل اسم المنتج"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">السعر (ريال)</label>
                    <input
                      type="number"
                      name="price"
                      value={productFormData.price}
                      onChange={handleProductFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="أدخل السعر"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الكمية المتوفرة</label>
                    <input
                      type="number"
                      name="stock"
                      value={productFormData.stock}
                      onChange={handleProductFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="أدخل الكمية"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                    <select
                      name="category"
                      value={productFormData.category}
                      onChange={handleProductFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="">اختر التصنيف</option>
                      <option value="إلكترونيات">إلكترونيات</option>
                      <option value="أزياء">أزياء</option>
                      <option value="كتب">كتب</option>
                      <option value="منزلية">منزلية</option>
                      <option value="صحة">صحة</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                    <select
                      name="status"
                      value={productFormData.status}
                      onChange={handleProductFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="active">نشط</option>
                      <option value="inactive">غير نشط</option>
                      <option value="draft">مسودة</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                  <textarea
                    name="description"
                    value={productFormData.description}
                    onChange={handleProductFormChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="أدخل وصف المنتج"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رمز SKU</label>
                    <input
                      type="text"
                      name="sku"
                      value={productFormData.sku}
                      onChange={handleProductFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="أدخل رمز SKU"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوزن</label>
                    <input
                      type="text"
                      name="weight"
                      value={productFormData.weight}
                      onChange={handleProductFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="أدخل الوزن"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الأبعاد</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={productFormData.dimensions}
                    onChange={handleProductFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="أدخل الأبعاد (طول×عرض×ارتفاع)"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddProductForm(false);
                    setProductFormData({
                      name: '',
                      price: 0,
                      stock: 0,
                      category: '',
                      description: '',
                      sku: '',
                      weight: '',
                      dimensions: '',
                      status: 'active'
                    });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all font-semibold flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  إضافة المنتج
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductForm && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">تعديل المنتج</h3>
                <button 
                  onClick={() => {
                    setShowEditProductForm(false);
                    setEditingProduct(null);
                    setProductFormData({
                      name: '',
                      price: 0,
                      stock: 0,
                      category: '',
                      description: '',
                      sku: '',
                      weight: '',
                      dimensions: '',
                      status: 'active'
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
                  <input
                    type="text"
                    name="name"
                    value={productFormData.name}
                    onChange={handleProductFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="أدخل اسم المنتج"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">السعر (ريال)</label>
                    <input
                      type="number"
                      name="price"
                      value={productFormData.price}
                      onChange={handleProductFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="أدخل السعر"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الكمية المتوفرة</label>
                    <input
                      type="number"
                      name="stock"
                      value={productFormData.stock}
                      onChange={handleProductFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="أدخل الكمية"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                    <select
                      name="category"
                      value={productFormData.category}
                      onChange={handleProductFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="">اختر التصنيف</option>
                      <option value="إلكترونيات">إلكترونيات</option>
                      <option value="أزياء">أزياء</option>
                      <option value="كتب">كتب</option>
                      <option value="منزلية">منزلية</option>
                      <option value="صحة">صحة</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                    <select
                      name="status"
                      value={productFormData.status}
                      onChange={handleProductFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="active">نشط</option>
                      <option value="inactive">غير نشط</option>
                      <option value="draft">مسودة</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                  <textarea
                    name="description"
                    value={productFormData.description}
                    onChange={handleProductFormChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="أدخل وصف المنتج"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رمز SKU</label>
                    <input
                      type="text"
                      name="sku"
                      value={productFormData.sku}
                      onChange={handleProductFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="أدخل رمز SKU"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوزن</label>
                    <input
                      type="text"
                      name="weight"
                      value={productFormData.weight}
                      onChange={handleProductFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="أدخل الوزن"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الأبعاد</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={productFormData.dimensions}
                    onChange={handleProductFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="أدخل الأبعاد (طول×عرض×ارتفاع)"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowEditProductForm(false);
                    setEditingProduct(null);
                    setProductFormData({
                      name: '',
                      price: 0,
                      stock: 0,
                      category: '',
                      description: '',
                      sku: '',
                      weight: '',
                      dimensions: '',
                      status: 'active'
                    });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleUpdateProduct}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all font-semibold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupplierDashboard;