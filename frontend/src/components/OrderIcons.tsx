import { Package, ShoppingCart } from 'lucide-react';

export const ShippingOrderIcon = () => (
  <span title="طلب شحن" className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
    <Package className="w-5 h-5 text-blue-600" />
  </span>
);

export const ProductOrderIcon = () => (
  <span title="طلب منتجات" className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
    <ShoppingCart className="w-5 h-5 text-green-600" />
  </span>
);
