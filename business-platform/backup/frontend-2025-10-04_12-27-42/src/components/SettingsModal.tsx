import { useState } from 'react';
import { Settings, Bell, Shield, Palette, Globe, Database, Download, BarChart3 } from 'lucide-react';
import Modal from './Modal';
import toast from 'react-hot-toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'merchant' | 'supplier' | 'shipping';
}

const SettingsModal = ({ isOpen, onClose, userType }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      orderUpdates: true,
      promotions: false,
      weeklyReports: true
    },
    appearance: {
      theme: 'light',
      language: 'ar',
      currency: 'SAR',
      dateFormat: 'dd/mm/yyyy'
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false,
      analyticsTracking: true,
      marketingEmails: false
    },
    business: {
      businessName: '',
      businessType: '',
      taxNumber: '',
      address: '',
      phone: '',
      email: '',
      operatingHours: '9:00 - 18:00',
      autoAcceptOrders: false,
      minimumOrderValue: '',
      deliveryRadius: ''
    }
  });

  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category] as any,
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('✅ تم حفظ الإعدادات بنجاح!');
      onClose();
    } catch (error) {
      toast.error('❌ حدث خطأ في حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('✅ تم تصدير البيانات بنجاح!');
    } catch (error) {
      toast.error('❌ حدث خطأ في تصدير البيانات');
    } finally {
      setIsExporting(false);
    }
  };

  const getBusinessLabels = () => {
    switch (userType) {
      case 'merchant':
        return {
          businessName: 'اسم المتجر',
          businessType: 'نوع النشاط التجاري',
          extraFields: ['deliveryRadius']
        };
      case 'supplier':
        return {
          businessName: 'اسم الشركة الموردة',
          businessType: 'نوع التوريد',
          extraFields: ['minimumOrderValue']
        };
      case 'shipping':
        return {
          businessName: 'اسم شركة الشحن',
          businessType: 'نوع الخدمات',
          extraFields: ['deliveryRadius', 'autoAcceptOrders']
        };
      default:
        return {
          businessName: 'اسم النشاط',
          businessType: 'نوع النشاط',
          extraFields: []
        };
    }
  };

  const businessLabels = getBusinessLabels();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚙️ الإعدادات والتخصيص"
      size="xl"
    >
      <div className="space-y-6">
        {/* التبويبات */}
        <div className="flex flex-wrap gap-2 border-b">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'general'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="inline w-4 h-4 mr-2" />
            عام
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'notifications'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bell className="inline w-4 h-4 mr-2" />
            الإشعارات
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'appearance'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Palette className="inline w-4 h-4 mr-2" />
            المظهر
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'privacy'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield className="inline w-4 h-4 mr-2" />
            الخصوصية
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'business'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Database className="inline w-4 h-4 mr-2" />
            النشاط
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'data'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="inline w-4 h-4 mr-2" />
            البيانات
          </button>
        </div>

        {/* الإعدادات العامة */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">⚙️ الإعدادات العامة</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">تفعيل الوضع المظلم</h4>
                    <p className="text-sm text-gray-600">تغيير مظهر التطبيق إلى الوضع المظلم</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.appearance.theme === 'dark'}
                      onChange={(e) => handleSettingChange('appearance', 'theme', e.target.checked ? 'dark' : 'light')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">الصوت والاهتزاز</h4>
                    <p className="text-sm text-gray-600">تشغيل الأصوات والاهتزاز للإشعارات</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.pushNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">حفظ تلقائي</h4>
                    <p className="text-sm text-gray-600">حفظ البيانات تلقائياً كل 30 ثانية</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* إعدادات الإشعارات */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4">🔔 إعدادات الإشعارات</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">إشعارات البريد الإلكتروني</h4>
                    <p className="text-sm text-gray-600">استلام إشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">رسائل SMS</h4>
                    <p className="text-sm text-gray-600">استلام إشعارات عبر الرسائل النصية</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.smsNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">تحديثات الطلبات</h4>
                    <p className="text-sm text-gray-600">إشعارات عند تغيير حالة الطلبات</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.orderUpdates}
                      onChange={(e) => handleSettingChange('notifications', 'orderUpdates', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">التقارير الأسبوعية</h4>
                    <p className="text-sm text-gray-600">استلام تقرير أسبوعي عن الأداء</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.weeklyReports}
                      onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* إعدادات المظهر */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">🎨 إعدادات المظهر</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="inline w-4 h-4 mr-2" />
                    اللغة
                  </label>
                  <select
                    value={settings.appearance.language}
                    onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العملة
                  </label>
                  <select
                    value={settings.appearance.currency}
                    onChange={(e) => handleSettingChange('appearance', 'currency', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                    <option value="EUR">يورو (EUR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تنسيق التاريخ
                  </label>
                  <select
                    value={settings.appearance.dateFormat}
                    onChange={(e) => handleSettingChange('appearance', 'dateFormat', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="dd/mm/yyyy">يوم/شهر/سنة</option>
                    <option value="mm/dd/yyyy">شهر/يوم/سنة</option>
                    <option value="yyyy-mm-dd">سنة-شهر-يوم</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نمط المظهر
                  </label>
                  <select
                    value={settings.appearance.theme}
                    onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="light">فاتح</option>
                    <option value="dark">مظلم</option>
                    <option value="auto">تلقائي</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* إعدادات الخصوصية */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-4">🔒 إعدادات الخصوصية</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مستوى الخصوصية
                  </label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="public">عام - يمكن للجميع رؤية معلوماتي</option>
                    <option value="restricted">محدود - المعلومات الأساسية فقط</option>
                    <option value="private">خاص - المعلومات مخفية</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">مشاركة البيانات لتحسين الخدمة</h4>
                    <p className="text-sm text-gray-600">السماح باستخدام البيانات لتطوير المنتج</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.dataSharing}
                      onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">تتبع الإحصائيات</h4>
                    <p className="text-sm text-gray-600">السماح بجمع إحصائيات الاستخدام</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.analyticsTracking}
                      onChange={(e) => handleSettingChange('privacy', 'analyticsTracking', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* إعدادات النشاط التجاري */}
        {activeTab === 'business' && (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-4">🏢 معلومات النشاط</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {businessLabels.businessName}
                  </label>
                  <input
                    type="text"
                    value={settings.business.businessName}
                    onChange={(e) => handleSettingChange('business', 'businessName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder={businessLabels.businessName}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {businessLabels.businessType}
                  </label>
                  <input
                    type="text"
                    value={settings.business.businessType}
                    onChange={(e) => handleSettingChange('business', 'businessType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder={businessLabels.businessType}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الرقم الضريبي
                  </label>
                  <input
                    type="text"
                    value={settings.business.taxNumber}
                    onChange={(e) => handleSettingChange('business', 'taxNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="123456789012345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={settings.business.phone}
                    onChange={(e) => handleSettingChange('business', 'phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="+966501234567"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان
                  </label>
                  <textarea
                    value={settings.business.address}
                    onChange={(e) => handleSettingChange('business', 'address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    rows={2}
                    placeholder="العنوان الكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ساعات العمل
                  </label>
                  <input
                    type="text"
                    value={settings.business.operatingHours}
                    onChange={(e) => handleSettingChange('business', 'operatingHours', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="9:00 - 18:00"
                  />
                </div>

                {businessLabels.extraFields.includes('deliveryRadius') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نطاق التوصيل (كم)
                    </label>
                    <input
                      type="number"
                      value={settings.business.deliveryRadius}
                      onChange={(e) => handleSettingChange('business', 'deliveryRadius', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="25"
                    />
                  </div>
                )}

                {businessLabels.extraFields.includes('minimumOrderValue') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      أقل قيمة طلب (ريال)
                    </label>
                    <input
                      type="number"
                      value={settings.business.minimumOrderValue}
                      onChange={(e) => handleSettingChange('business', 'minimumOrderValue', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="50"
                    />
                  </div>
                )}
              </div>

              {businessLabels.extraFields.includes('autoAcceptOrders') && (
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">قبول الطلبات تلقائياً</h4>
                    <p className="text-sm text-gray-600">قبول الطلبات الواردة تلقائياً دون تدخل يدوي</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.business.autoAcceptOrders}
                      onChange={(e) => handleSettingChange('business', 'autoAcceptOrders', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* إدارة البيانات */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">📊 إدارة البيانات</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-800 mb-2">تصدير البيانات</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    قم بتصدير جميع بياناتك في ملف Excel أو CSV لحفظها أو معالجتها خارجياً
                  </p>
                  <button
                    onClick={handleExportData}
                    disabled={isExporting}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isExporting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isExporting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        جاري التصدير...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        تصدير البيانات
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-800 mb-2">مساحة التخزين المستخدمة</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>الصور والملفات</span>
                      <span>125 MB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>المستخدم: 125 MB</span>
                      <span>المتاح: 375 MB</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-800 mb-2">النسخ الاحتياطي</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    آخر نسخة احتياطية: اليوم، الساعة 14:30
                  </p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Database className="w-4 h-4" />
                    إنشاء نسخة احتياطية
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              isSaving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-blue-600 hover:shadow-xl text-white'
            }`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                جاري الحفظ...
              </>
            ) : (
              <>
                <Settings className="w-5 h-5" />
                حفظ الإعدادات
              </>
            )}
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;