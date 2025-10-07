import { useState } from 'react';
import { Box, User, MapPin, CheckCircle, AlertCircle, X } from 'lucide-react';
import Modal from './Modal';
import toast from 'react-hot-toast';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onUpdate: (orderId: string, updates: any) => void;
}

const OrderDetailsModal = ({ isOpen, onClose, order, onUpdate }: OrderDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState('details');
  const [newStatus, setNewStatus] = useState(order?.status || '');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses = [
    'جاهز للشحن',
    'في الطريق للاستلام',
    'تم الاستلام',
    'في الطريق للتسليم',
    'تم التسليم',
    'مؤجل',
    'ملغي',
    'مُعاد'
  ];

  const statusColors: { [key: string]: string } = {
    'جاهز للشحن': 'bg-blue-100 text-blue-800',
    'في الطريق للاستلام': 'bg-yellow-100 text-yellow-800',
    'تم الاستلام': 'bg-orange-100 text-orange-800',
    'في الطريق للتسليم': 'bg-purple-100 text-purple-800',
    'تم التسليم': 'bg-green-100 text-green-800',
    'مؤجل': 'bg-gray-100 text-gray-800',
    'ملغي': 'bg-red-100 text-red-800',
    'مُعاد': 'bg-pink-100 text-pink-800'
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order.status) {
      toast.error('❌ يرجى اختيار حالة جديدة');
      return;
    }

    setIsUpdating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updates = {
        status: newStatus,
        lastUpdated: new Date().toISOString(),
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: statusNote
          }
        ]
      };

      onUpdate(order.id, updates);
      toast.success('✅ تم تحديث حالة الطلب بنجاح!');
      setStatusNote('');
      
    } catch (error) {
      toast.error('❌ حدث خطأ في تحديث الطلب');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`📦 تفاصيل الطلب ${order.id}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* التبويبات */}
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'details'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 التفاصيل
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'tracking'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📍 التتبع
          </button>
          <button
            onClick={() => setActiveTab('update')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'update'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ⚡ تحديث الحالة
          </button>
        </div>

        {/* تفاصيل الطلب */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* الحالة الحالية */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">الحالة الحالية</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">التقدم</p>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${order.progress || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{order.progress || 0}%</p>
                </div>
              </div>
            </div>

            {/* معلومات العميل والمتجر */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3">👤 معلومات العميل</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{order.customer || order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 text-green-600">📞</span>
                    <span className="text-sm">{order.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{order.destination}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">🏪 معلومات المتجر</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{order.merchant}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{order.pickupAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 text-blue-600">💰</span>
                    <span className="text-sm">{order.value}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* تفاصيل الشحنة */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-3">📦 تفاصيل الشحنة</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">وصف الطرد:</p>
                  <p className="font-medium">{order.packageDescription}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">الأولوية:</p>
                  <p className="font-medium">{order.priority}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">الوزن:</p>
                  <p className="font-medium">{order.weight || 'غير محدد'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">الأبعاد:</p>
                  <p className="font-medium">{order.dimensions || 'غير محددة'}</p>
                </div>
              </div>
            </div>

            {/* معلومات السائق والمركبة */}
            {order.driver && order.driver !== 'سيتم التحديد' && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-3">🚛 معلومات التوصيل</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">السائق:</p>
                    <p className="font-medium">{order.driver}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">رقم الهاتف:</p>
                    <p className="font-medium">{order.driverPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">نوع المركبة:</p>
                    <p className="font-medium">{order.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">المسافة المتوقعة:</p>
                    <p className="font-medium">{order.distance}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ملاحظات خاصة */}
            {order.specialInstructions && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📝 تعليمات خاصة</h4>
                <p className="text-sm text-gray-600">{order.specialInstructions}</p>
              </div>
            )}
          </div>
        )}

        {/* تتبع الطلب */}
        {activeTab === 'tracking' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📍 تاريخ حالات الطلب</h3>
              
              <div className="space-y-3">
                {order.statusHistory?.length > 0 ? (
                  order.statusHistory.map((entry: any, index: number) => (
                    <div key={index} className="flex items-start gap-4 p-3 bg-white rounded-lg">
                      <div className="flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{entry.status}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(entry.timestamp).toLocaleString('ar-SA')}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-gray-600">{entry.note}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>لا يوجد تاريخ للحالات بعد</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">⏱️ معلومات التوقيت</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">تاريخ الإنشاء:</span>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleString('ar-SA')}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">آخر تحديث:</span>
                  <p className="font-medium">
                    {order.lastUpdated 
                      ? new Date(order.lastUpdated).toLocaleString('ar-SA')
                      : 'لا يوجد تحديثات'
                    }
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">الوقت المتوقع للتسليم:</span>
                  <p className="font-medium">{order.estimatedTime}</p>
                </div>
                <div>
                  <span className="text-gray-600">وقت التسليم المطلوب:</span>
                  <p className="font-medium">{order.deliveryTime || 'غير محدد'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* تحديث الحالة */}
        {activeTab === 'update' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ تحديث حالة الطلب</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة الجديدة *
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">اختر الحالة الجديدة</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  {newStatus && (
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[newStatus]}`}>
                        {newStatus}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظة (اختيارية)
                  </label>
                  <textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="أضف ملاحظة حول التحديث..."
                  />
                </div>

                <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating || !newStatus || newStatus === order.status}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    isUpdating || !newStatus || newStatus === order.status
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-xl text-white'
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      جاري التحديث...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      تحديث الحالة
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* الحالة الحالية */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">الحالة الحالية</h4>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
          </div>
        )}

        {/* زر الإغلاق */}
        <div className="flex justify-end pt-6 border-t">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5" />
            إغلاق
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;