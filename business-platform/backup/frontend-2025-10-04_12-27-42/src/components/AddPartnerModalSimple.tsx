import React, { useState } from 'react';
import { X, Users, Building, Phone, Mail, MapPin } from 'lucide-react';
import Modal from './Modal';
import toast from 'react-hot-toast';

interface AddPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (partnerData: any) => void;
}

const AddPartnerModalSimple: React.FC<AddPartnerModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    partnerType: '',
    category: '',
    email: '',
    phone: '',
    city: ''
  });

  const partnerTypes = ['تاجر تجزئة', 'تاجر جملة', 'شركة شحن', 'مورد', 'مصنع'];
  
  const categories = [
    'إلكترونيات',
    'ملابس وأزياء',
    'منزل ومطبخ',
    'صحة وجمال',
    'أغذية ومشروبات',
    'رياضة ولياقة',
    'مواد بناء',
    'خدمات شحن',
    'أخرى'
  ];

  const cities = [
    'الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة',
    'الأحساء', 'الطائف', 'بريدة', 'تبوك', 'خميس مشيط'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من المدخلات
    if (!formData.businessName.trim()) {
      toast.error('الرجاء إدخال اسم الشركة');
      return;
    }

    if (!formData.contactPerson.trim()) {
      toast.error('الرجاء إدخال اسم الشخص المسؤول');
      return;
    }

    if (!formData.partnerType) {
      toast.error('الرجاء اختيار نوع الشريك');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('الرجاء إدخال رقم الهاتف');
      return;
    }

    if (!formData.city) {
      toast.error('الرجاء اختيار المدينة');
      return;
    }

    // إرسال البيانات
    onSubmit(formData);
    
    // إعادة تعيين النموذج
    setFormData({
      businessName: '',
      contactPerson: '',
      partnerType: '',
      category: '',
      email: '',
      phone: '',
      city: ''
    });

    toast.success('✅ تم إضافة الشريك بنجاح!');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🤝 إضافة شريك جديد"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-blue-800 text-sm">
            أدخل المعلومات الأساسية للشريك الجديد
          </p>
        </div>

        {/* اسم الشركة */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Building className="w-4 h-4" />
            اسم الشركة *
          </label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="شركة المنتجات الوطنية"
          />
        </div>

        {/* الشخص المسؤول */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4" />
            الشخص المسؤول *
          </label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="أحمد محمد"
          />
        </div>

        {/* نوع الشريك */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نوع الشريك *
          </label>
          <select
            name="partnerType"
            value={formData.partnerType}
            onChange={handleChange}
            required
            aria-label="نوع الشريك"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- اختر نوع الشريك --</option>
            {partnerTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* الفئة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            فئة النشاط
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            aria-label="فئة النشاط"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- اختر الفئة --</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* رقم الهاتف */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4" />
            رقم الهاتف *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="+966501234567"
          />
        </div>

        {/* البريد الإلكتروني */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4" />
            البريد الإلكتروني
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="info@company.com"
          />
        </div>

        {/* المدينة */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4" />
            المدينة *
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            aria-label="المدينة"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- اختر المدينة --</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* الأزرار */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            إضافة الشريك
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPartnerModalSimple;
