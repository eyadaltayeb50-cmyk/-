import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:right-auto md:w-auto z-50 flex items-center justify-between gap-3 rounded-xl bg-amber-600/95 text-white px-4 py-2.5 shadow-xl backdrop-blur-sm border border-amber-500/50 text-xs font-medium">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
        <span>وضع عدم الاتصال — يتم تصفح المحتوى المحفوظ مؤقتاً</span>
      </div>
      <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
    </div>
  );
};
