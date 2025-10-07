import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X, Bell, Box, Truck, Store, DollarSign } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'order' | 'payment' | 'shipping';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationToastProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onRemove }) => {
  useEffect(() => {
    toasts.forEach(toast => {
      if (toast.duration !== 0) {
        const timer = setTimeout(() => {
          onRemove(toast.id);
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [toasts, onRemove]);

  const getToastIcon = (type: Toast['type']) => {
    const icons = {
      success: CheckCircle,
      warning: AlertTriangle,
      error: AlertTriangle,
      info: Info,
      order: Box,
      payment: DollarSign,
      shipping: Truck
    };
    const Icon = icons[type] || Info;
    return <Icon size={20} />;
  };

  const getToastColors = (type: Toast['type']) => {
    const colors = {
      success: 'from-green-500 to-emerald-500 border-green-200',
      warning: 'from-orange-500 to-amber-500 border-orange-200',
      error: 'from-red-500 to-rose-500 border-red-200',
      info: 'from-blue-500 to-cyan-500 border-blue-200',
      order: 'from-purple-500 to-violet-500 border-purple-200',
      payment: 'from-green-500 to-teal-500 border-green-200',
      shipping: 'from-blue-500 to-indigo-500 border-blue-200'
    };
    return colors[type] || colors.info;
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`bg-gradient-to-r ${getToastColors(toast.type)} text-white rounded-xl shadow-2xl border-2 min-w-80 max-w-md pointer-events-auto`}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getToastIcon(toast.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1">
                    {toast.title}
                  </h4>
                  <p className="text-sm opacity-90 leading-relaxed">
                    {toast.message}
                  </p>
                  
                  {toast.action && (
                    <button
                      onClick={toast.action.onClick}
                      className="mt-2 bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-1 rounded-full transition-colors"
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onRemove(toast.id)}
                  className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
                  title="إغلاق"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook لإدارة التوستات
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const newToast: Toast = {
      ...toast,
      id: Date.now().toString()
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAll = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAll
  };
};

export default NotificationToast;