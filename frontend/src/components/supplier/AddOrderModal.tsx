import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  X, ShoppingCart, Box, Calendar, 
  MapPin, CreditCard, Save, AlertCircle,
  Plus, Minus, Truck, Clock, FileText, User, DollarSign, CheckCircle
} from 'lucide-react';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: OrderData) => void;
  availableProducts?: Product[];
  partners?: Partner[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

interface Partner {
  id: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderData {
  partnerId: string;
  partnerName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  deliveryDate: string;
  deliveryAddress: string;
  paymentMethod: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'processing';
}

const mockProducts: Product[] = [
  { id: '1', name: 'هاتف ذكي آيفون 15', price: 3500, stock: 25, category: 'إلكترونيات' },
  { id: '2', name: 'لابتوب ديل XPS', price: 4500, stock: 10, category: 'إلكترونيات' },
  { id: '3', name: 'ساعة ذكية', price: 800, stock: 50, category: 'إلكترونيات' },
  { id: '4', name: 'سماعات بلوتوث', price: 250, stock: 100, category: 'إلكترونيات' }
];

const mockPartners: Partner[] = [
  { id: '1', businessName: 'متجر الإلكترونيات الذكية', contactPerson: 'أحمد محمد', phone: '966501234567', email: 'ahmed@electronics.com' },
  { id: '2', businessName: 'سوبر ماركت الأهلي', contactPerson: 'سارة أحمد', phone: '966507654321', email: 'sara@ahlisupermarket.com' },
  { id: '3', businessName: 'صيدلية النور', contactPerson: 'محمد علي', phone: '966509876543', email: 'mohammed@noorpharma.com' }
];

function AddOrderModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  availableProducts = mockProducts,
  partners = mockPartners 
}: AddOrderModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [orderData, setOrderData] = useState<OrderData>({
    partnerId: '',
    partnerName: '',
    items: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    deliveryDate: '',
    deliveryAddress: '',
    paymentMethod: 'cash',
    notes: '',
    status: 'pending'
  });

  const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: number }>({});

  const calculateTotals = (items: OrderItem[], discountPercent: number = 0) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discount = (subtotal * discountPercent) / 100;
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * 0.15; // 15% VAT
    const total = taxableAmount + tax;
    
    return { subtotal, discount, tax, total };
  };

  const addProduct = (product: Product) => {
    const quantity = selectedProducts[product.id] || 1;
    const existingItemIndex = orderData.items.findIndex(item => item.productId === product.id);
    
    let newItems: OrderItem[];
    
    if (existingItemIndex >= 0) {
      newItems = orderData.items.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: quantity, total: quantity * item.price }
          : item
      );
    } else {
      const newItem: OrderItem = {
        productId: product.id,
        productName: product.name,
        quantity: quantity,
        price: product.price,
        total: quantity * product.price
      };
      newItems = [...orderData.items, newItem];
    }
    
    const totals = calculateTotals(newItems, orderData.discount);
    setOrderData(prev => ({
      ...prev,
      items: newItems,
      ...totals
    }));
  };

  const removeProduct = (productId: string) => {
    const newItems = orderData.items.filter(item => item.productId !== productId);
    const totals = calculateTotals(newItems, orderData.discount);
    setOrderData(prev => ({
      ...prev,
      items: newItems,
      ...totals
    }));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProduct(productId);
      return;
    }

    const newItems = orderData.items.map(item => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
        : item
    );
    
    const totals = calculateTotals(newItems, orderData.discount);
    setOrderData(prev => ({
      ...prev,
      items: newItems,
      ...totals
    }));
  };

  const updateDiscount = (discountPercent: number) => {
    const totals = calculateTotals(orderData.items, discountPercent);
    setOrderData(prev => ({
      ...prev,
      discount: totals.discount,
      tax: totals.tax,
      total: totals.total
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!orderData.partnerId) newErrors.partnerId = 'يجب اختيار شريك';
    } else if (step === 2) {
      if (orderData.items.length === 0) newErrors.items = 'يجب إضافة منتج واحد على الأقل';
    } else if (step === 3) {
      if (!orderData.deliveryDate) newErrors.deliveryDate = 'تاريخ التسليم مطلوب';
      if (!orderData.deliveryAddress.trim()) newErrors.deliveryAddress = 'عنوان التسليم مطلوب';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(orderData);
      onClose();
      setCurrentStep(1);
      setOrderData({
        partnerId: '',
        partnerName: '',
        items: [],
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
        deliveryDate: '',
        deliveryAddress: '',
        paymentMethod: 'cash',
        notes: '',
        status: 'pending'
      });
      setSelectedProducts({});
    }
  };

  const selectPartner = (partner: Partner) => {
    setOrderData(prev => ({
      ...prev,
      partnerId: partner.id,
      partnerName: partner.businessName
    }));
  };

  const steps = [
    { number: 1, title: 'اختيار الشريك', icon: User },
    { number: 2, title: 'إضافة المنتجات', icon: Box },
    { number: 3, title: 'تفاصيل التسليم', icon: MapPin },
    { number: 4, title: 'تأكيد الطلب', icon: CheckCircle }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">إنشاء طلب جديد</h2>
                  <p className="text-orange-100">أنشئ طلب شراء جديد للشركاء</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Steps Progress */}
            <div className="flex items-center justify-between mt-6">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center gap-2 ${
                    currentStep >= step.number 
                      ? 'text-white' 
                      : 'text-orange-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStep >= step.number
                        ? 'bg-white text-orange-600'
                        : 'bg-orange-500/30 text-orange-200'
                    }`}>
                      {currentStep > step.number ? '✓' : step.number}
                    </div>
                    <span className="text-sm font-medium hidden md:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 md:w-16 h-0.5 mx-2 ${
                      currentStep > step.number ? 'bg-white' : 'bg-orange-300/30'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Box className="w-5 h-5 text-orange-600" />
                  اختيار الشريك التجاري
                </h3>
                
                {errors.partnerId && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.partnerId}
                  </p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {partners.map((partner) => (
                    <motion.div
                      key={partner.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectPartner(partner)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        orderData.partnerId === partner.id
                          ? 'border-orange-500 bg-orange-50 shadow-lg'
                          : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{partner.businessName}</h4>
                          <p className="text-sm text-gray-600 mt-1">{partner.contactPerson}</p>
                          <p className="text-sm text-gray-500">{partner.phone}</p>
                          <p className="text-sm text-gray-500">{partner.email}</p>
                        </div>
                        {orderData.partnerId === partner.id && (
                          <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center">
                            ✓
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  اختيار المنتجات
                </h3>
                
                {errors.items && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.items}
                  </p>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Available Products */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">المنتجات المتاحة</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {availableProducts.map((product) => (
                        <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-800">{product.name}</h5>
                              <p className="text-sm text-gray-600">{product.category}</p>
                              <p className="text-lg font-bold text-green-600">{product.price} ريال</p>
                              <p className="text-xs text-gray-500">متوفر: {product.stock} قطعة</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="1"
                                max={product.stock}
                                value={selectedProducts[product.id] || 1}
                                onChange={(e) => setSelectedProducts(prev => ({
                                  ...prev,
                                  [product.id]: parseInt(e.target.value) || 1
                                }))}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                              />
                              <button
                                onClick={() => addProduct(product)}
                                disabled={product.stock === 0}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm transition-colors"
                              >
                                إضافة
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selected Products */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">المنتجات المضافة</h4>
                    {orderData.items.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>لم يتم إضافة منتجات بعد</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {orderData.items.map((item) => (
                          <div key={item.productId} className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-800">{item.productName}</h5>
                                <p className="text-sm text-gray-600">{item.price} ريال × {item.quantity}</p>
                                <p className="text-lg font-bold text-blue-600">{item.total} ريال</p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className="w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors flex items-center justify-center"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  className="w-8 h-8 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors flex items-center justify-center"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => removeProduct(item.productId)}
                                  className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center ml-2"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Order Summary */}
                        <div className="border-t-2 border-gray-300 pt-4 mt-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>المجموع الفرعي:</span>
                              <span>{orderData.subtotal.toFixed(2)} ريال</span>
                            </div>
                            <div className="flex justify-between">
                              <span>الخصم:</span>
                              <span>-{orderData.discount.toFixed(2)} ريال</span>
                            </div>
                            <div className="flex justify-between">
                              <span>ضريبة القيمة المضافة (15%):</span>
                              <span>{orderData.tax.toFixed(2)} ريال</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                              <span>الإجمالي:</span>
                              <span>{orderData.total.toFixed(2)} ريال</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-purple-600" />
                  تفاصيل التسليم والدفع
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      تاريخ التسليم المطلوب *
                    </label>
                    <input
                      type="date"
                      value={orderData.deliveryDate}
                      onChange={(e) => setOrderData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                        errors.deliveryDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.deliveryDate && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.deliveryDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      طريقة الدفع
                    </label>
                    <select
                      value={orderData.paymentMethod}
                      onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    >
                      <option value="cash">نقداً عند الاستلام</option>
                      <option value="bank_transfer">تحويل بنكي</option>
                      <option value="credit">آجل</option>
                      <option value="card">بطاقة ائتمانية</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      عنوان التسليم *
                    </label>
                    <textarea
                      value={orderData.deliveryAddress}
                      onChange={(e) => setOrderData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none ${
                        errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="أدخل العنوان الكامل للتسليم..."
                    />
                    {errors.deliveryAddress && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.deliveryAddress}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      نسبة الخصم (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={(orderData.discount / orderData.subtotal * 100) || 0}
                      onChange={(e) => updateDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ملاحظات إضافية
                    </label>
                    <textarea
                      value={orderData.notes}
                      onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                      placeholder="أي ملاحظات خاصة بالطلب..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Save className="w-5 h-5 text-green-600" />
                  مراجعة الطلب النهائية
                </h3>
                
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  {/* Partner Info */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">معلومات الشريك:</h4>
                    <p className="text-gray-600">{orderData.partnerName}</p>
                  </div>
                  
                  {/* Order Items */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">المنتجات:</h4>
                    <div className="space-y-2">
                      {orderData.items.map((item) => (
                        <div key={item.productId} className="flex justify-between items-center bg-white p-3 rounded-lg">
                          <div>
                            <span className="font-medium">{item.productName}</span>
                            <span className="text-sm text-gray-500 ml-2">×{item.quantity}</span>
                          </div>
                          <span className="font-semibold">{item.total} ريال</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Delivery Info */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">تفاصيل التسليم:</h4>
                    <p className="text-gray-600">
                      <Clock className="w-4 h-4 inline ml-1" />
                      التاريخ: {orderData.deliveryDate}
                    </p>
                    <p className="text-gray-600">
                      <MapPin className="w-4 h-4 inline ml-1" />
                      العنوان: {orderData.deliveryAddress}
                    </p>
                  </div>
                  
                  {/* Payment Method */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">طريقة الدفع:</h4>
                    <p className="text-gray-600">
                      <CreditCard className="w-4 h-4 inline ml-1" />
                      {orderData.paymentMethod === 'cash' && 'نقداً عند الاستلام'}
                      {orderData.paymentMethod === 'bank_transfer' && 'تحويل بنكي'}
                      {orderData.paymentMethod === 'credit' && 'آجل'}
                      {orderData.paymentMethod === 'card' && 'بطاقة ائتمانية'}
                    </p>
                  </div>
                  
                  {/* Total Summary */}
                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>إجمالي الطلب:</span>
                      <span className="text-green-600">{orderData.total.toFixed(2)} ريال</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              السابق
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                التالي
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                تأكيد الطلب
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AddOrderModal;