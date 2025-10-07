import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Clock, CheckCircle, XCircle, Eye, 
  Package, Truck, Calendar, User, DollarSign, AlertCircle,
  MoreHorizontal, MessageSquare, Download, RefreshCw
} from 'lucide-react';
import { useState } from 'react';

interface Order {
  id: string;
  merchantName: string;
  merchantAvatar: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  orderDate: string;
  expectedDelivery: string;
  notes?: string;
}

function SupplierOrdersManagement() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      merchantName: 'متجر الإلكترونيات الذكية',
      merchantAvatar: '📱',
      products: [
        { name: 'هاتف iPhone 15', quantity: 10, price: 4200 },
        { name: 'سماعات AirPods', quantity: 5, price: 800 }
      ],
      totalAmount: 46000,
      status: 'pending',
      priority: 'urgent',
      orderDate: '2024-01-15',
      expectedDelivery: '2024-01-18',
      notes: 'طلب عاجل للعميل المهم - يرجى الإسراع في التجهيز'
    },
    {
      id: 'ORD-002',
      merchantName: 'متجر الأزياء العصرية',
      merchantAvatar: '👗',
      products: [
        { name: 'فساتين صيفية', quantity: 25, price: 320 },
        { name: 'حقائب نسائية', quantity: 15, price: 180 }
      ],
      totalAmount: 10700,
      status: 'confirmed',
      priority: 'high',
      orderDate: '2024-01-14',
      expectedDelivery: '2024-01-17',
      notes: 'موسم العروض - كميات كبيرة'
    },
    {
      id: 'ORD-003',
      merchantName: 'مكتبة المعرفة الشاملة',
      merchantAvatar: '📚',
      products: [
        { name: 'كتب تعليمية', quantity: 50, price: 85 },
        { name: 'أدوات مكتبية', quantity: 100, price: 25 }
      ],
      totalAmount: 6750,
      status: 'processing',
      priority: 'medium',
      orderDate: '2024-01-13',
      expectedDelivery: '2024-01-16'
    },
    {
      id: 'ORD-004',
      merchantName: 'صيدلية النور الطبية',
      merchantAvatar: '💊',
      products: [
        { name: 'مكملات غذائية', quantity: 30, price: 120 },
        { name: 'منتجات عناية', quantity: 20, price: 75 }
      ],
      totalAmount: 5100,
      status: 'shipped',
      priority: 'low',
      orderDate: '2024-01-12',
      expectedDelivery: '2024-01-15'
    }
  ]);

  const statusOptions = [
    { value: 'all', label: 'جميع الطلبات', count: orders.length },
    { value: 'pending', label: 'في الانتظار', count: orders.filter(o => o.status === 'pending').length },
    { value: 'confirmed', label: 'مؤكدة', count: orders.filter(o => o.status === 'confirmed').length },
    { value: 'processing', label: 'قيد التجهيز', count: orders.filter(o => o.status === 'processing').length },
    { value: 'shipped', label: 'تم الشحن', count: orders.filter(o => o.status === 'shipped').length },
    { value: 'delivered', label: 'تم التسليم', count: orders.filter(o => o.status === 'delivered').length }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || order.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            📋 إدارة الطلبات
          </h1>
          <p className="text-gray-600 mt-1">متابعة وإدارة جميع طلبات التجار</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <RefreshCw className="w-4 h-4" />
            تحديث
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Download className="w-4 h-4" />
            تصدير
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في الطلبات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              title="فلترة حسب الحالة"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              title="فلترة حسب الأولوية"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="all">جميع الأولويات</option>
              <option value="urgent">عاجل</option>
              <option value="high">مرتفع</option>
              <option value="medium">متوسط</option>
              <option value="low">منخفض</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {statusOptions.map((status, index) => (
          <motion.button
            key={status.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedStatus(status.value)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedStatus === status.value
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-gray-200 bg-white hover:border-gray-300 text-gray-600 hover:shadow-md'
            }`}
          >
            <div className="text-2xl font-bold">{status.count}</div>
            <div className="text-sm font-medium">{status.label}</div>
          </motion.button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {/* Priority Indicator */}
                  <div className={`w-3 h-16 rounded-full ${getPriorityColor(order.priority)}`}></div>
                  
                  {/* Order Info */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{order.merchantAvatar}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{order.merchantName}</h3>
                        <p className="text-sm text-gray-600">رقم الطلب: {order.id}</p>
                      </div>
                    </div>
                    
                    {/* Products Summary */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">المنتجات:</p>
                      <div className="space-y-1">
                        {order.products.map((product, i) => (
                          <div key={i} className="text-xs text-gray-500">
                            {product.name} × {product.quantity} - {product.price} ريال
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mb-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                          <p className="text-sm text-amber-700">{order.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-800 mb-1">
                      {order.totalAmount.toLocaleString()} ريال
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status === 'pending' ? 'في الانتظار' :
                       order.status === 'confirmed' ? 'مؤكد' :
                       order.status === 'processing' ? 'قيد التجهيز' :
                       order.status === 'shipped' ? 'تم الشحن' :
                       order.status === 'delivered' ? 'تم التسليم' : 'ملغي'}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderDetails(true);
                      }}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                      title="رسالة للتاجر"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      title="المزيد"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>تاريخ الطلب: {order.orderDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span>التسليم المتوقع: {order.expectedDelivery}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex gap-2 flex-wrap">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        قبول الطلب
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        رفض الطلب
                      </button>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'processing')}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      بدء التجهيز
                    </button>
                  )}
                  {order.status === 'processing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      تم الشحن
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد طلبات</h3>
            <p className="text-gray-500">لم يتم العثور على أي طلبات تطابق معايير البحث</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupplierOrdersManagement;