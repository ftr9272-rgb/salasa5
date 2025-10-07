import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Zap, Bell } from 'lucide-react';

interface ChatButtonProps {
  onClick: () => void;
  hasNotifications?: boolean;
  notificationCount?: number;
  /** render variant: floating (default) or inline for header */
  variant?: 'floating' | 'inline';
  className?: string;
  ariaLabel?: string;
}

const ChatButton: React.FC<ChatButtonProps> = ({ 
  onClick, 
  hasNotifications = false, 
  notificationCount = 0,
  variant = 'floating',
  className = '',
  ariaLabel = 'فتح المحادثات'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (hasNotifications) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasNotifications]);

  const wrapperClass = variant === 'floating'
    ? `fixed bottom-6 left-6 z-40 ${className}`
    : `inline-flex items-center ${className}`;

  return (
    <motion.div
      className={wrapperClass}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.2 
      }}
    >
      {/* Notification Tooltip */}
      <AnimatePresence>
        {hasNotifications && !isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.8 }}
            className="absolute bottom-16 left-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl shadow-2xl min-w-max"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">
                لديك {notificationCount} رسالة جديدة
              </span>
            </div>
            {/* Arrow */}
            <div className="absolute -bottom-1 left-4 w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={ariaLabel}
        className={`relative ${variant === 'floating' ? 'w-16 h-16' : 'w-10 h-10'} rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          showPulse ? 'animate-pulse' : ''
        }`}
        style={{
          background: variant === 'floating' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
        }}
      >
        {/* Pulse Animation */}
        {hasNotifications && (
          <>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-ping opacity-75"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse opacity-50"></div>
          </>
        )}

        {/* Icon */}
        <motion.div
          animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <MessageSquare className={`${variant === 'floating' ? 'w-8 h-8 text-white' : 'w-5 h-5 text-gray-700'}`} />
        </motion.div>

        {/* Notification Badge */}
        {hasNotifications && notificationCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute ${variant === 'floating' ? '-top-2 -right-2 w-6 h-6 text-xs' : '-top-1 -right-1 w-5 h-5 text-[10px]'} bg-red-500 text-white font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg`}
          >
            {notificationCount > 99 ? '99+' : notificationCount}
          </motion.div>
        )}

        {/* Quick Action Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full shadow-lg"
        >
          <Zap className="w-2 h-2 text-white m-0.5" />
        </motion.div>
      </motion.button>

      {/* Ripple Effect */}
      <AnimatePresence>
        {isHovered && variant === 'floating' && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 -z-10"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatButton;