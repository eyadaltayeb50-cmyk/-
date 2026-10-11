import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Tag, Filter, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { CampusEvent, EventType } from '../types';

export const SchedulePage: React.FC = () => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await api.getEvents();
      if (res.success) {
        setEvents(res.events);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeBadge = (type: EventType) => {
    switch (type) {
      case 'exam':
        return { label: 'امتحان', color: 'bg-red-100 text-red-800 border-red-200' };
      case 'assignment':
        return { label: 'تسليم تكليف', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'lecture':
        return { label: 'محاضرة', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'section':
        return { label: 'سكشن عملي', color: 'bg-teal-100 text-teal-800 border-teal-200' };
      case 'revision':
        return { label: 'مراجعة', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'holiday':
        return { label: 'إجازة رسمية', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      default:
        return { label: 'حدث عام', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const filteredEvents = events.filter((e) =>
    filterType === 'all' ? true : e.eventType === filterType
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              معهد الفراعنة العالي · بتوقيت القاهرة (Africa/Cairo)
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">المواعيد والتقويم الدراسي</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            مواعيد المحاضرات الأسبوعية، السكاشن بالمعامل، الامتحانات، وتواريخ تسليم الواجبات.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'lecture', label: 'المحاضرات' },
            { id: 'section', label: 'السكاشن' },
            { id: 'exam', label: 'الامتحانات' },
            { id: 'assignment', label: 'التكليفات' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                filterType === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl skeleton-shimmer" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm">
          لا توجد مواعيد مسجلة ضمن التصنيف المختار.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((evt) => {
            const badge = getEventTypeBadge(evt.eventType);
            return (
              <div
                key={evt.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs text-slate-500 font-mono font-bold">
                      {evt.eventDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{evt.title}</h3>

                  {evt.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {evt.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-mono font-bold">{evt.startTime} - {evt.endTime}</span>
                  </div>

                  {evt.locationOrLink && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{evt.locationOrLink}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
