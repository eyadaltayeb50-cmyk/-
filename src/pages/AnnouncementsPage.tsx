import React, { useState, useEffect } from 'react';
import { Megaphone, Pin, AlertCircle, Clock, Search } from 'lucide-react';
import { api } from '../services/api';
import { Announcement } from '../types';

export const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'urgent'>('all');

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.getAnnouncements();
      if (res.success) {
        setAnnouncements(res.announcements);
      }
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = announcements.filter((a) =>
    filter === 'urgent' ? a.priority === 'urgent' : true
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-amber-600" />
            <span>لوحة إعلانات معهد الفراعنة العالي</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            جميع البيانات والتنبيهات الرسمية الصادرة من عمادة المعهد وهيئة التدريس.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            جميع الإعلانات
          </button>
          <button
            onClick={() => setFilter('urgent')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === 'urgent' ? 'bg-red-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            تنبيهات عاجلة فقط
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-36 rounded-3xl skeleton-shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm">
          لا توجد إعلانات منشورة حالياً في هذا القسم.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((ann) => (
            <div
              key={ann.id}
              className={`p-6 rounded-3xl border transition shadow-2xs ${
                ann.isPinned
                  ? 'bg-blue-50/50 border-blue-300 shadow-xs'
                  : ann.priority === 'urgent'
                  ? 'bg-red-50/40 border-red-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {ann.isPinned && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                      <Pin className="w-3 h-3" />
                      <span>مثبت</span>
                    </span>
                  )}
                  {ann.priority === 'urgent' && (
                    <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">
                      تنبيه عاجل
                    </span>
                  )}
                </div>

                <span className="text-xs text-slate-400">
                  {new Date(ann.publishedAt).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{ann.title}</h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {ann.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
