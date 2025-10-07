import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  X, Settings, User, Bell, Shield, 
  Palette, Globe, Save, AlertCircle,
  Phone, Mail, MapPin, CreditCard,
  Eye, EyeOff, Download, Upload
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settingsData: SettingsData) => void;
}

interface SettingsData {
  // Profile Settings
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  logo: File | null;
  
  // Business Settings
  currency: string;
  timezone: string;
  language: string;
  businessType: string;
  
  // Notification Settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderNotifications: boolean;
  stockNotifications: boolean;
  marketingEmails: boolean;
  
  // Security Settings
  twoFactorAuth: boolean;
  autoLogout: number;
  passwordExpiry: number;
  
  // Display Settings
  theme: 'light' | 'dark' | 'auto';
  itemsPerPage: number;
  defaultView: string;
  
  // Integration Settings
  autoSync: boolean;
  apiAccess: boolean;
  webhooks: string[];
  
  // Backup Settings
  autoBackup: boolean;
  backupFrequency: string;
  retentionPeriod: number;
}

const currencies = [
  { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س' },
  { code: 'USD', name: 'دولار أمريكي', symbol: '$' },
  { code: 'EUR', name: 'يورو', symbol: '€' },
  { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ' }
];

const timezones = [
  { value: 'Asia/Riyadh', label: 'السعودية (GMT+3)' },
  { value: 'Asia/Dubai', label: 'الإمارات (GMT+4)' },
  { value: 'Asia/Kuwait', label: 'الكويت (GMT+3)' },
  { value: 'UTC', label: 'التوقيت العالمي (UTC)' }
];

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  
  const [settingsData, setSettingsData] = useState<SettingsData>({
    companyName: 'شركة التجارة الإلكترونية',
    contactPerson: 'أحمد محمد',
    email: 'ahmed@company.com',
    phone: '966501234567',
    address: 'الرياض، السعودية',
    logo: null,
    currency: 'SAR',
    timezone: 'Asia/Riyadh',
    language: 'ar',
    businessType: 'تاجر جملة',
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    stockNotifications: true,
    marketingEmails: false,
    twoFactorAuth: false,
    autoLogout: 30,
    passwordExpiry: 90,
    theme: 'light',
    itemsPerPage: 10,
    defaultView: 'grid',
    autoSync: true,
    apiAccess: false,
    webhooks: [],
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 30
  });

  const tabs = [
    { id: 'profile', name: 'الملف الشخصي', icon: User },
    { id: 'notifications', name: 'الإشعارات', icon: Bell },
    { id: 'security', name: 'الأمان', icon: Shield },
    { id: 'display', name: 'العرض', icon: Palette },
    { id: 'integration', name: 'التكامل', icon: Globe },
    { id: 'backup', name: 'النسخ الاحتياطي', icon: Download }
  ];

  const validateSettings = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!settingsData.companyName.trim()) newErrors.companyName = 'اسم الشركة مطلوب';
    if (!settingsData.contactPerson.trim()) newErrors.contactPerson = 'اسم الشخص المسؤول مطلوب';
    if (!settingsData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (settingsData.email && !emailRegex.test(settingsData.email)) {
      newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateSettings()) {
      onSave(settingsData);
      onClose();
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSettingsData(prev => ({ ...prev, logo: file }));
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settingsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'supplier-settings.json';
    link.click();
    URL.revokeObjectURL(url);
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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">إعدادات المورد</h2>
                  <p className="text-indigo-100">إدارة إعدادات حسابك وتفضيلاتك</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-right flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-indigo-100 text-indigo-700 border-r-4 border-indigo-500'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[70vh]">
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">الملف الشخصي والشركة</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        اسم الشركة *
                      </label>
                      <input
                        type="text"
                        value={settingsData.companyName}
                        onChange={(e) => setSettingsData(prev => ({ ...prev, companyName: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                          errors.companyName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="شركة التجارة الإلكترونية"
                      />
                      {errors.companyName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.companyName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        الشخص المسؤول *
                      </label>
                      <input
                        type="text"
                        value={settingsData.contactPerson}
                        onChange={(e) => setSettingsData(prev => ({ ...prev, contactPerson: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                          errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="أحمد محمد"
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
                        <Mail className="w-4 h-4 inline ml-1" />
                        البريد الإلكتروني *
                      </label>
                      <input
                        type="email"
                        value={settingsData.email}
                        onChange={(e) => setSettingsData(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="ahmed@company.com"
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
                        <Phone className="w-4 h-4 inline ml-1" />
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        value={settingsData.phone}
                        onChange={(e) => setSettingsData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        placeholder="966501234567"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline ml-1" />
                        العنوان
                      </label>
                      <textarea
                        value={settingsData.address}
                        onChange={(e) => setSettingsData(prev => ({ ...prev, address: e.target.value }))}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
                        placeholder="الرياض، السعودية"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        شعار الشركة
                      </label>
                      <div className="flex items-center gap-4">
                        {settingsData.logo ? (
                          <img
                            src={URL.createObjectURL(settingsData.logo)}
                            alt="شعار الشركة"
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload"
                          />
                          <label
                            htmlFor="logo-upload"
                            className="cursor-pointer bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors inline-flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            رفع الشعار
                          </label>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG حتى 2MB</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-800 mb-4">إعدادات العمل</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          العملة
                        </label>
                        <select
                          value={settingsData.currency}
                          onChange={(e) => setSettingsData(prev => ({ ...prev, currency: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        >
                          {currencies.map(currency => (
                            <option key={currency.code} value={currency.code}>
                              {currency.name} ({currency.symbol})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          المنطقة الزمنية
                        </label>
                        <select
                          value={settingsData.timezone}
                          onChange={(e) => setSettingsData(prev => ({ ...prev, timezone: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        >
                          {timezones.map(tz => (
                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          اللغة
                        </label>
                        <select
                          value={settingsData.language}
                          onChange={(e) => setSettingsData(prev => ({ ...prev, language: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        >
                          {languages.map(lang => (
                            <option key={lang.code} value={lang.code}>
                              {lang.flag} {lang.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">إعدادات الإشعارات</h3>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'إشعارات البريد الإلكتروني', desc: 'تلقي الإشعارات عبر البريد الإلكتروني' },
                      { key: 'smsNotifications', label: 'إشعارات الرسائل النصية', desc: 'تلقي الإشعارات عبر الرسائل النصية' },
                      { key: 'orderNotifications', label: 'إشعارات الطلبات', desc: 'تنبيهات عند وجود طلبات جديدة أو تحديثات' },
                      { key: 'stockNotifications', label: 'إشعارات المخزون', desc: 'تنبيهات عند انخفاض المخزون' },
                      { key: 'marketingEmails', label: 'رسائل تسويقية', desc: 'تلقي العروض والأخبار التسويقية' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h4 className="font-medium text-gray-800">{item.label}</h4>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsData[item.key as keyof SettingsData] as boolean}
                            onChange={(e) => setSettingsData(prev => ({ ...prev, [item.key]: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">إعدادات الأمان</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-800">المصادقة الثنائية</h4>
                        <p className="text-sm text-gray-600">حماية إضافية لحسابك</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsData.twoFactorAuth}
                          onChange={(e) => setSettingsData(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          تسجيل الخروج التلقائي (دقيقة)
                        </label>
                        <select
                          value={settingsData.autoLogout}
                          onChange={(e) => setSettingsData(prev => ({ ...prev, autoLogout: parseInt(e.target.value) }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        >
                          <option value={15}>15 دقيقة</option>
                          <option value={30}>30 دقيقة</option>
                          <option value={60}>ساعة واحدة</option>
                          <option value={120}>ساعتان</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          انتهاء صلاحية كلمة المرور (يوم)
                        </label>
                        <select
                          value={settingsData.passwordExpiry}
                          onChange={(e) => setSettingsData(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        >
                          <option value={30}>30 يوم</option>
                          <option value={60}>60 يوم</option>
                          <option value={90}>90 يوم</option>
                          <option value={0}>لا تنتهي</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">تغيير كلمة المرور</h4>
                      <div className="space-y-3">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="كلمة المرور الحالية"
                          className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                        />
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="كلمة المرور الجديدة"
                            className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                          تحديث كلمة المرور
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'display' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">إعدادات العرض</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        المظهر العام
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'light', label: '☀️ فاتح', desc: 'مظهر فاتح' },
                          { value: 'dark', label: '🌙 داكن', desc: 'مظهر داكن' },
                          { value: 'auto', label: '🔄 تلقائي', desc: 'حسب النظام' }
                        ].map((theme) => (
                          <label key={theme.value} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="theme"
                              value={theme.value}
                              checked={settingsData.theme === theme.value}
                              onChange={(e) => setSettingsData(prev => ({ ...prev, theme: e.target.value as any }))}
                              className="ml-2 text-indigo-600"
                            />
                            <div>
                              <span className="font-medium">{theme.label}</span>
                              <p className="text-sm text-gray-600">{theme.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        عدد العناصر في الصفحة
                      </label>
                      <select
                        value={settingsData.itemsPerPage}
                        onChange={(e) => setSettingsData(prev => ({ ...prev, itemsPerPage: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      >
                        <option value={10}>10 عناصر</option>
                        <option value={25}>25 عنصر</option>
                        <option value={50}>50 عنصر</option>
                        <option value={100}>100 عنصر</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        العرض الافتراضي
                      </label>
                      <select
                        value={settingsData.defaultView}
                        onChange={(e) => setSettingsData(prev => ({ ...prev, defaultView: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      >
                        <option value="grid">شبكة</option>
                        <option value="list">قائمة</option>
                        <option value="card">بطاقات</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'integration' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">التكامل والـ API</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-800">المزامنة التلقائية</h4>
                        <p className="text-sm text-gray-600">مزامنة البيانات تلقائياً مع الأنظمة الخارجية</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsData.autoSync}
                          onChange={(e) => setSettingsData(prev => ({ ...prev, autoSync: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-800">الوصول للـ API</h4>
                        <p className="text-sm text-gray-600">السماح بالوصول عبر واجهة برمجة التطبيقات</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsData.apiAccess}
                          onChange={(e) => setSettingsData(prev => ({ ...prev, apiAccess: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {settingsData.apiAccess && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="font-medium text-blue-800 mb-2">مفتاح API</h4>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value="sk_live_1234567890abcdef..."
                            readOnly
                            className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded text-sm"
                          />
                          <button className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                            نسخ
                          </button>
                          <button className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm">
                            تجديد
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'backup' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">النسخ الاحتياطي</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-800">النسخ الاحتياطي التلقائي</h4>
                        <p className="text-sm text-gray-600">إنشاء نسخ احتياطية تلقائية من بياناتك</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsData.autoBackup}
                          onChange={(e) => setSettingsData(prev => ({ ...prev, autoBackup: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {settingsData.autoBackup && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            تكرار النسخ الاحتياطي
                          </label>
                          <select
                            value={settingsData.backupFrequency}
                            onChange={(e) => setSettingsData(prev => ({ ...prev, backupFrequency: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          >
                            <option value="daily">يومياً</option>
                            <option value="weekly">أسبوعياً</option>
                            <option value="monthly">شهرياً</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            مدة الاحتفاظ (يوم)
                          </label>
                          <select
                            value={settingsData.retentionPeriod}
                            onChange={(e) => setSettingsData(prev => ({ ...prev, retentionPeriod: parseInt(e.target.value) }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          >
                            <option value={7}>7 أيام</option>
                            <option value={30}>30 يوم</option>
                            <option value={90}>90 يوم</option>
                            <option value={365}>سنة واحدة</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-800 mb-4">إدارة النسخ الاحتياطية</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-green-300 text-green-700 rounded-xl hover:bg-green-50 transition-colors">
                          <Download className="w-5 h-5" />
                          إنشاء نسخة احتياطية الآن
                        </button>
                        
                        <button 
                          onClick={exportSettings}
                          className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-blue-300 text-blue-700 rounded-xl hover:bg-blue-50 transition-colors"
                        >
                          <Upload className="w-5 h-5" />
                          تصدير الإعدادات
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 flex justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              حفظ الإعدادات
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SettingsModal;