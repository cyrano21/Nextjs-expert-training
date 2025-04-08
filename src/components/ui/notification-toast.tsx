import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationProps {
  title: string;
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose?: () => void;
  action?: React.ReactNode;
  className?: string;
  open?: boolean;
}

export function Notification({
  title,
  message,
  type = 'info',
  duration = 5000,
  onClose,
  action,
  className,
  open = true,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    setIsVisible(open);
  }, [open]);

  useEffect(() => {
    if (duration !== Infinity && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, isVisible, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  // Définir l'icône et les couleurs en fonction du type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          bgColor: 'bg-green-500',
          textColor: 'text-white',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          bgColor: 'bg-amber-500',
          textColor: 'text-white',
        };
      case 'error':
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          bgColor: 'bg-red-500',
          textColor: 'text-white',
        };
      case 'info':
      default:
        return {
          icon: <Info className="h-5 w-5" />,
          bgColor: 'bg-primary',
          textColor: 'text-primary-foreground',
        };
    }
  };

  const { icon, bgColor, textColor } = getTypeStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed right-4 top-4 z-50 w-full max-w-sm overflow-hidden rounded-lg border bg-card shadow-lg",
            className
          )}
        >
          <div className="flex">
            <div className={cn("flex w-12 flex-shrink-0 items-center justify-center", bgColor)}>
              <span className={textColor}>{icon}</span>
            </div>
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{title}</h3>
                  <div className="mt-1 text-sm text-muted-foreground">{message}</div>
                  {action && <div className="mt-3">{action}</div>}
                </div>
                <button
                  onClick={handleClose}
                  className="ml-4 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Barre de progression pour la durée */}
          {duration !== Infinity && (
            <motion.div
              className={cn("h-1", bgColor)}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Composant pour gérer plusieurs notifications
interface NotificationProviderProps {
  children: React.ReactNode;
}

interface NotificationContextType {
  showNotification: (props: Omit<NotificationProps, 'open'>) => string;
  closeNotification: (id: string) => void;
}

export const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Array<NotificationProps & { id: string }>>([]);

  const showNotification = (props: Omit<NotificationProps, 'open'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { ...props, id, open: true }]);
    return id;
  };

  const closeNotification = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, open: false } : notification
    ));
    
    // Supprimer la notification après l'animation de sortie
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 300);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, closeNotification }}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Notification
                {...notification}
                onClose={() => closeNotification(notification.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

// Hook pour utiliser les notifications
export function useNotification() {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
