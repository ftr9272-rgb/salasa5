import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  X, Users, Building, Phone, Mail, MapPin, 
  FileText, Star, Shield, Save, AlertCircle,
  Globe, Calendar, CreditCard, Check
} from 'lucide-react';

interface AddPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (partnerData: PartnerData) => void;
}

interface PartnerData {
  // معلومات أساسية
  businessName: string;
  contactPerson: string;
  businessType: string;
  category: string;
  
  // معلومات الاتصال
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  
  // العنوان
  city: string;
  district: string;
  street: string;
  postalCode: string;
  
  // معلومات تجارية
  commercialRegister: string;
  taxNumber: string;
  bankAccount: string;
  bankName: string;
  
  // شروط التعاون
  paymentTerms: string;
  deliveryTerms: string;
  minimumOrder: number;
  discountRate: number;
  
  // ملفات ووثائق
  documents: File[];
  logo: File | null;
  
  // ملاحظات
  notes: string;
  // نوع الشريك: تاجر تجزئة او شركة شحن
  partnerType: string;
  
  // حالة الموافقة
  status: 'pending' | 'approved' | 'rejected';
}

const businessTypes = [
  'تاجر تجزئة',
  'تاجر جملة',
  'مصنع',
  'مستورد',
  'موزع',
  'متجر إلكتروني',
  'سوبر ماركت',
  'صيدلية',
  'مطعم',
  'أخرى'
];

const categories = [
  'إلكترونيات',
  'ملابس وأزياء',
  'منزل ومطبخ',
  'صحة وجمال',
  'رياضة ولياقة',
  'ألعاب وترفيه',
  'كتب وقرطاسية',
  'طعام ومشروبات',
  'سيارات وقطع غيار',
  'مواد بناء',
  'أخرى'
];

const cities = [
  'الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة',
  'الأحساء', 'الطائف', 'بريدة', 'تبوك', 'خميس مشيط',
  'حائل', 'نجران', 'الجبيل', 'ينبع', 'أبها'
];

function AddPartnerModal({ isOpen, onClose, onSubmit }: AddPartnerModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [partnerData, setPartnerData] = useState<PartnerData>({
    businessName: '',
    contactPerson: '',
    businessType: '',
    category: '',
    partnerType: '',
    email: '',
    phone: '',
    whatsapp: '',
    website: '',
    city: '',
    district: '',
    street: '',
    postalCode: '',
    commercialRegister: '',
    taxNumber: '',
    bankAccount: '',
    bankName: '',
    paymentTerms: '30',
    deliveryTerms: '',
    minimumOrder: 0,
    discountRate: 0,
    documents: [],
    logo: null,
    notes: '',
    status: 'pending'
  });

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!partnerData.businessName.trim()) newErrors.businessName = 'اسم الشركة مطلوب';
      if (!partnerData.contactPerson.trim()) newErrors.contactPerson = 'اسم الشخص المسؤول مطلوب';
      if (!partnerData.businessType) newErrors.businessType = 'نوع النشاط مطلوب';
      if (!partnerData.partnerType) newErrors.partnerType = 'نوع الشريك مطلوب';
      if (!partnerData.category) newErrors.category = 'فئة النشاط مطلوبة';
    } else if (step === 2) {
      if (!partnerData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
      if (!partnerData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
      if (!partnerData.city) newErrors.city = 'المدينة مطلوبة';
      
      // التحقق من صحة البريد الإلكتروني
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (partnerData.email && !emailRegex.test(partnerData.email)) {
        newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
      }
    } else if (step === 3) {
      if (!partnerData.commercialRegister.trim()) newErrors.commercialRegister = 'السجل التجاري مطلوب';
      if (!partnerData.taxNumber.trim()) newErrors.taxNumber = 'الرقم الضريبي مطلوب';
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
      onSubmit(partnerData);
      onClose();
      setCurrentStep(1);
      setPartnerData({
        businessName: '',
        contactPerson: '',
        businessType: '',
        partnerType: '',
        category: '',
        email: '',
        phone: '',
        whatsapp: '',
        website: '',
        city: '',
        district: '',
        street: '',
        postalCode: '',
        commercialRegister: '',
        taxNumber: '',
        bankAccount: '',
        bankName: '',
        paymentTerms: '30',
        deliveryTerms: '',
        minimumOrder: 0,
        discountRate: 0,
        documents: [],
        logo: null,
        notes: '',
        status: 'pending'
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'documents' | 'logo') => {
    const files = Array.from(e.target.files || []);
    if (type === 'documents') {
      setPartnerData(prev => ({
        ...prev,
        documents: [...prev.documents, ...files]
      }));
    } else if (files[0]) {
      setPartnerData(prev => ({
        ...prev,
        logo: files[0]
      }));
    }
  };

  const removeDocument = (index: number) => {
    setPartnerData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const steps = [
    { number: 1, title: 'معلومات الشركة', icon: Building },
    { number: 2, title: 'بيانات الاتصال', icon: Phone },
    { number: 3, title: 'المعلومات القانونية', icon: Shield },
    { number: 4, title: 'شروط التعاون', icon: FileText }
  ];

  const getPartnerTypeLabel = (t: string) => {
    if (!t) return '-';
    switch (t) {
      case 'retailer': return 'تاجر تجزئة';
      case 'supplier': return 'مورد';
      case 'shipping_company': return 'شركة شحن';
      default: return t;
    }
  };

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">إضافة شريك جديد</h2>
                  <p className="text-emerald-100">املأ البيانات لإضافة شريك تجاري جديد</p>
                </div>
              </div>
              <button
                onClick={onClose}
                title="إغلاق"
                aria-label="إغلاق"
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
                      : 'text-emerald-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStep >= step.number
                        ? 'bg-white text-emerald-600'
                        : 'bg-emerald-500/30 text-emerald-200'
                    }`}>
                      {currentStep > step.number ? '✓' : step.number}
                    </div>
                    <span className="text-sm font-medium hidden md:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 md:w-16 h-0.5 mx-2 ${
                      currentStep > step.number ? 'bg-white' : 'bg-emerald-300/30'
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
                  <Building className="w-5 h-5 text-emerald-600" />
                  معلومات الشركة
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      اسم الشركة / المؤسسة *
                    </label>
                    <input
                      type="text"
                      value={partnerData.businessName}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, businessName: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                        errors.businessName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="مثال: شركة الإلكترونيات المتقدمة"
                    />
                    {errors.businessName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.businessName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      اسم الشخص المسؤول *
                    </label>
                    <input
                      type="text"
                      value={partnerData.contactPerson}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, contactPerson: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                        errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="أحمد محمد العلي"
                    />
                    {errors.contactPerson && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.contactPerson}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      نوع النشاط التجاري *
                    </label>
                    <select
                      value={partnerData.businessType}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, businessType: e.target.value }))}
                      aria-label="نوع النشاط التجاري"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                        errors.businessType ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">اختر نوع النشاط</option>
                      {businessTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.businessType && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.businessType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      نوع الشريك *
                    </label>
                      <select
                        value={partnerData.partnerType}
                        onChange={(e) => setPartnerData(prev => ({ ...prev, partnerType: e.target.value }))}
                        aria-label="نوع الشريك"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                          errors.partnerType ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">اختر نوع الشريك</option>
                        <option value="retailer">تاجر تجزئة</option>
                        <option value="shipping_company">شركة شحن</option>
                        <option value="supplier">مورد</option>
                      </select>
                    {errors.partnerType && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.partnerType}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      فئة المنتجات *
                    </label>
                    <select
                      value={partnerData.category}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, category: e.target.value }))}
                      aria-label="فئة المنتجات"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">اختر فئة المنتجات</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.category}
                      </p>
                    )}
                  </div>
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
                  <Phone className="w-5 h-5 text-blue-600" />
                  بيانات الاتصال والعنوان
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      value={partnerData.email}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="info@company.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      value={partnerData.phone}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, phone: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="966501234567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رقم الواتساب
                    </label>
                    <input
                      type="tel"
                      value={partnerData.whatsapp}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, whatsapp: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="966501234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      موقع الويب
                    </label>
                    <input
                      type="url"
                      value={partnerData.website}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="https://www.company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      المدينة *
                    </label>
                    <select
                      value={partnerData.city}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, city: e.target.value }))}
                      aria-label="المدينة"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">اختر المدينة</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الحي
                    </label>
                    <input
                      type="text"
                      value={partnerData.district}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, district: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="العليا"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الشارع والرقم
                    </label>
                    <input
                      type="text"
                      value={partnerData.street}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, street: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="شارع الملك فهد، رقم 123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الرمز البريدي
                    </label>
                    <input
                      type="text"
                      value={partnerData.postalCode}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, postalCode: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="12345"
                    />
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
                  <Shield className="w-5 h-5 text-purple-600" />
                  المعلومات القانونية والمالية
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رقم السجل التجاري *
                    </label>
                    <input
                      type="text"
                      value={partnerData.commercialRegister}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, commercialRegister: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                        errors.commercialRegister ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="1010123456"
                    />
                    {errors.commercialRegister && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.commercialRegister}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الرقم الضريبي *
                    </label>
                    <input
                      type="text"
                      value={partnerData.taxNumber}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, taxNumber: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                        errors.taxNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="300123456789003"
                    />
                    {errors.taxNumber && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.taxNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رقم الحساب البنكي (IBAN)
                    </label>
                    <input
                      type="text"
                      value={partnerData.bankAccount}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, bankAccount: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="SA1234567890123456789012"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      اسم البنك
                    </label>
                    <input
                      type="text"
                      value={partnerData.bankName}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, bankName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="البنك الأهلي السعودي"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      الوثائق والمستندات
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(e, 'documents')}
                        className="hidden"
                        id="documents-upload"
                      />
                      <label htmlFor="documents-upload" className="cursor-pointer">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">اضغط لرفع الوثائق</p>
                        <p className="text-xs text-gray-500 mt-1">السجل التجاري، شهادة ضريبية، إلخ</p>
                      </label>
                    </div>
                    
                    {partnerData.documents.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {partnerData.documents.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <button
                              onClick={() => removeDocument(index)}
                              title="إزالة المستند"
                              aria-label="إزالة المستند"
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
                  <FileText className="w-5 h-5 text-green-600" />
                  شروط التعاون والمراجعة النهائية
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      مدة السداد (بالأيام)
                    </label>
                    <select
                      value={partnerData.paymentTerms}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                      aria-label="مدة السداد"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    >
                      <option value="0">نقداً عند الاستلام</option>
                      <option value="15">15 يوم</option>
                      <option value="30">30 يوم</option>
                      <option value="45">45 يوم</option>
                      <option value="60">60 يوم</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الحد الأدنى للطلب (ريال)
                    </label>
                    <input
                      type="number"
                      value={partnerData.minimumOrder}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, minimumOrder: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="1000"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      نسبة الخصم (%)
                    </label>
                    <input
                      type="number"
                      value={partnerData.discountRate}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, discountRate: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="5"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      شروط التسليم
                    </label>
                    <input
                      type="text"
                      value={partnerData.deliveryTerms}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, deliveryTerms: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="التسليم خلال 3 أيام عمل"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ملاحظات إضافية
                    </label>
                    <textarea
                      value={partnerData.notes}
                      onChange={(e) => setPartnerData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                      placeholder="أي ملاحظات أو شروط خاصة..."
                    />
                  </div>
                </div>

                {/* ملخص البيانات */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                  <h4 className="font-bold text-gray-800 mb-3">ملخص البيانات:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">الشركة:</span> {partnerData.businessName}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">الشخص المسؤول:</span> {partnerData.contactPerson}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">نوع النشاط:</span> {partnerData.businessType}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">نوع الشريك:</span> {getPartnerTypeLabel(partnerData.partnerType)}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">البريد:</span> {partnerData.email}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">الهاتف:</span> {partnerData.phone}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">المدينة:</span> {partnerData.city}
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
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                التالي
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                حفظ الشريك
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AddPartnerModal;