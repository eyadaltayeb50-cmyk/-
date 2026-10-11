import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Clock, BookOpen, Megaphone, ShieldAlert, KeyRound, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { NotificationItem } from '../types';

interface NotificationsPageProps {
  onNavigateTab: (tab: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigateTab }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.getNotifications();
      if (res.success) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'new_lecture':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-amber-600" />;
      case 'subscription_alert':
        return <KeyRound className="w-5 h-5 text-emerald-600" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            <span>مركز إشعارات معهد الفراعنة</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            سجل التنبيهات وإشعارات المحاضرات والمواعيد الجديدة.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-2xs"
          >
            <CheckCheck className="w-4 h-4 text-blue-600" />
            <span>تحديد الكل كمقروء</span>
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl skeleton-shimmer" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm">
          لا توجد إشعارات حالياً.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition flex items-start gap-4 cursor-pointer shadow-2xs ${
                notif.isRead
                  ? 'bg-slate-50 border-slate-200 text-slate-600'
                  : 'bg-white border-blue-300 text-slate-900 shadow-xs'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                {getNotifIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{notif.title}</h3>
                  <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                    {new Date(notif.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  {notif.content}
                </p>

                {notif.targetUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const path = notif.targetUrl?.replace('/', '') || 'home';
                      onNavigateTab(path);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>فتح الصفحة المرتبطة</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {!notif.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
