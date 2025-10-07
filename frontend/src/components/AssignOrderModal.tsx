import React, { useState } from 'react';
import { X, Truck, User, Phone, Mail } from 'lucide-react';
import Modal from './Modal';
import { storage } from '../utils/localStorage';
import type { ShippingService } from '../utils/localStorage';

interface AssignOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  onAssign: (orderId: string, partnerId: string) => void;
}

const AssignOrderModal = ({ isOpen, onClose, orderId, onAssign }: AssignOrderModalProps) => {
  const [selectedPartner, setSelectedPartner] = useState('');
  const [loading, setLoading] = useState(false);
  
  // الحصول على خدمات الشحن من localStorage
  const shippingServices = storage.getShippingServices();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartner) {
      alert('الرجاء اختيار شريك شحن');
      return;
    }
    
    setLoading(true);
    try {
      onAssign(orderId, selectedPartner);
      onClose();
      setSelectedPartner('');
    } catch (error) {
      console.error('فشل في تعيين الطلب:', error);
      alert('حدث خطأ أثناء تعيين الطلب لشريك الشحن');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🚚 تعيين طلب لشريك شحن" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            اختر شريك الشحن الذي تريد تعيين هذا الطلب له. سيتم إشعار الشريك تلقائيًا بالطلب الجديد.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اختيار شريك الشحن *
          </label>
          {shippingServices.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Truck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">لا توجد خدمات شحن متوفرة حالياً</p>
              <p className="text-sm text-gray-400 mt-1">قم بإضافة شركاء شحن من قسم الشركاء</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {shippingServices.map((service) => (
                <div 
                  key={service.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPartner === service.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedPartner(service.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <input
                        type="radio"
                        name="partner"
                        checked={selectedPartner === service.id}
                        onChange={() => setSelectedPartner(service.id)}
                        className="h-4 w-4 text-blue-600"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        {service.verified && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            موثوق
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>💰 {service.pricePerKg} ريال/كجم</span>
                        <span>⏱️ {service.deliveryTime}</span>
                        <span>📍 {service.coverage}</span>
                      </div>
                      {service.provider && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <User className="w-3 h-3" />
                            <span>{service.provider.name}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || !selectedPartner || shippingServices.length === 0}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium ${
              loading || !selectedPartner || shippingServices.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                جاري التعيين...
              </>
            ) : (
              <>
                <Truck className="w-4 h-4" />
                تعيين الطلب
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            إلغاء
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignOrderModal;