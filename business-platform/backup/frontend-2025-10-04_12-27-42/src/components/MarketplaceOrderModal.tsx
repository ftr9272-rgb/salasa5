import { useState } from 'react';
import { X, Box, User, DollarSign } from 'lucide-react';
import Modal from './Modal';
import toast from 'react-hot-toast';

interface MarketplaceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (order: any) => void;
  selectedItem?: any | null;
}

const MarketplaceOrderModal = ({ isOpen, onClose, onAdd, selectedItem }: MarketplaceOrderModalProps) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    merchant: '',
    packageDescription: selectedItem?.name || '',
    value: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 700));
      const payload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        merchant: formData.merchant || 'التاجر',
        packageDescription: formData.packageDescription,
        value: formData.value ? Number(formData.value) : 0,
        originalItemId: selectedItem?.id || null,
        publishToMarketplace: true
      };
  onAdd(payload);
      toast.success('✅ تم إنشاء ونشر الطلب في السوق');
      setFormData({ customerName: '', customerPhone: '', merchant: '', packageDescription: '', value: '' });
      onClose();
    } catch (err) {
      toast.error('حدث خطأ أثناء إنشاء الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📣 إنشاء طلب للسوق المشترك" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="merchantName" className="block text-sm font-medium text-gray-700">اسم التاجر</label>
          <input id="merchantName" name="merchant" value={formData.merchant} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label htmlFor="packageDescription" className="block text-sm font-medium text-gray-700">وصف الطرد</label>
          <textarea id="packageDescription" name="packageDescription" value={formData.packageDescription} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700">قيمة الطلب (ريال)</label>
          <input id="value" name="value" type="number" value={formData.value} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="flex gap-2 justify-end pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">إلغاء</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded">{isSubmitting ? 'جاري...' : 'نشر في السوق'}</button>
        </div>
      </form>
    </Modal>
  );
};

export default MarketplaceOrderModal;
