import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Megaphone, 
  Bell, 
  Send, 
  Sparkles, 
  ArrowLeft, 
  Clock, 
  ChevronLeft, 
  ShieldAlert, 
  KeyRound, 
  FileText, 
  ExternalLink,
  CheckCircle2,
  Video,
  FileCode,
  Music,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { PaywallModal } from '../components/common/PaywallModal';

interface HomePageProps {
  onNavigateTab: (tab: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateTab }) => {
  const { user, isActivated, isAdmin } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedLecture, setSelectedLecture] = useState<any>(null);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);

  useEffect(() => {
    loadDashboard();
  }, [user?.id, user?.status]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboard();
      if (res.success) {
        setDashboardData(res);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLecture = (lecture: any) => {
    if (!isActivated && !isAdmin) {
      setShowPaywall(true);
      return;
    }
    setSelectedLecture(lecture);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-44 rounded-3xl skeleton-shimmer" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl skeleton-shimmer" />
          ))}
        </div>
        <div className="h-64 rounded-3xl skeleton-shimmer" />
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    enrolledSubjectsCount: 5,
    availableLecturesCount: 4,
    upcomingEventsCount: 3,
    unreadNotificationsCount: 1,
  };

  const recentLectures = dashboardData?.recentLectures || [];
  const upcomingEvents = dashboardData?.upcomingEvents || [];
  const announcements = dashboardData?.announcements || [];

  return (
    <div className="space-y-6">
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onGoToActivate={() => onNavigateTab('activate')}
      />

      {/* Hero Welcome Banner - Light and Modern */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 text-white font-bold backdrop-blur-xs flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>معهد الفراعنة العالي</span>
              </span>
              <span className="text-xs text-blue-100 font-medium">
                {user?.institutionName || 'معهد الفراعنة العالي للحاسب ونظم المعلومات'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              مرحباً، {user?.fullName || 'عزيزي الطالب'} 👋
            </h1>

            <p className="text-sm text-blue-100 max-w-xl leading-relaxed">
              {user?.departmentName || 'شعبة نظم معلومات إدارية'} · {user?.academicYearName || 'الفرقة الثالثة'}.
              {isActivated ? (
                ' جميع محاضراتك وجداولك الدراسية جاهزة للمتابعة والتحميل.'
              ) : (
                ' يرجى تفعيل حسابك للاستمتاع بكافة محاضرات الفصل الدراسي.'
              )}
            </p>
          </div>

          {/* Quick Action in Hero */}
          <div className="shrink-0 flex sm:flex-col gap-2.5">
            {!isActivated && !isAdmin ? (
              <button
                onClick={() => onNavigateTab('activate')}
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>تفعيل الحساب الآن</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigateTab('subjects')}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-blue-900 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-blue-700" />
                <span>استعراض موادي</span>
              </button>
            )}

            {!user?.telegramLinked && (
              <button
                onClick={() => onNavigateTab('telegram')}
                className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ربط تيليجرام</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient decorative elements */}
        <div className="absolute -top-12 -left-12 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Paywall Warning Notice if Pending */}
      {!isActivated && !isAdmin && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">حسابك بانتظار إدخال كود التفعيل</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                لا يمكنك فتح روابط Google Drive أو تحميل ملفات المحاضرات قبل إدخال الكود.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('activate')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shrink-0 transition cursor-pointer shadow-xs"
          >
            إدخال كود التفعيل
          </button>
        </div>
      )}

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => onNavigateTab('subjects')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">المواد المسجلة</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.enrolledSubjectsCount}</div>
        </div>

        <div
          onClick={() => onNavigateTab('subjects')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">المحاضرات المتاحة</span>
            <FileText className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.availableLecturesCount}</div>
        </div>

        <div
          onClick={() => onNavigateTab('schedule')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">المواعيد القادمة</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.upcomingEventsCount}</div>
        </div>

        <div
          onClick={() => onNavigateTab('announcements')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">الإعلانات الرسمية</span>
            <Megaphone className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{announcements.length}</div>
        </div>
      </div>

      {/* Main Grid: Recent Lectures & Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 2 Cols: Recent Lectures */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>أحدث محاضرات معهد الفراعنة</span>
            </h2>
            <button
              onClick={() => onNavigateTab('subjects')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>عرض كل المواد</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentLectures.length === 0 ? (
              <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm">
                لا توجد محاضرات منشورة حالياً لموادك المسجلة.
              </div>
            ) : (
              recentLectures.map((lec: any) => (
                <div
                  key={lec.id}
                  onClick={() => handleOpenLecture(lec)}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-blue-700">{lec.subjectName}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-600">{lec.professorName || 'دكتور المادة'}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">محاضرة {lec.lectureNumber}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {lec.title}
                    </h3>

                    {lec.description && (
                      <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                        {lec.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-right sm:text-left">
                      <span className="text-[11px] text-slate-400 block font-medium">
                        {new Date(lec.publishedAt).toLocaleDateString('ar-EG')}
                      </span>
                      <span className="text-[11px] text-teal-600 font-bold block">
                        {lec.resourcesCount || 3} ملفات مرفقة
                      </span>
                    </div>

                    <button className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                      <span>عرض</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 1 Col: Upcoming Cairo Events & Announcements */}
        <div className="space-y-6">

          {/* Upcoming Schedule Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>المواعيد القادمة (توقيت القاهرة)</span>
              </h3>
              <button
                onClick={() => onNavigateTab('schedule')}
                className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
              >
                الكل
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">لا توجد مواعيد مسجلة قريباً.</p>
              ) : (
                upcomingEvents.map((evt: any) => (
                  <div key={evt.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold ${
                        evt.eventType === 'exam' ? 'text-red-600' :
                        evt.eventType === 'assignment' ? 'text-amber-700' : 'text-blue-700'
                      }`}>
                        {evt.eventType === 'exam' ? 'امتحان' : evt.eventType === 'assignment' ? 'تسليم تكليف' : 'محاضرة'}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px] font-semibold">{evt.startTime}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{evt.title}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>{evt.eventDate}</span>
                      <span>{evt.locationOrLink || 'المدرج الرئيسي'}</span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Announcements Pinned Widget */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-600" />
                <span>تنبيهات المعهد</span>
              </h3>
              <button
                onClick={() => onNavigateTab('announcements')}
                className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
              >
                عرض
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 2).map((ann: any) => (
                <div key={ann.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      ann.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {ann.priority === 'urgent' ? 'عاجل' : 'إعلان'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(ann.publishedAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{ann.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Selected Lecture Google Drive Resources Modal */}
      {selectedLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-right max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
              <div>
                <span className="text-xs font-bold text-blue-700 block mb-1">
                  {selectedLecture.subjectName} · محاضرة {selectedLecture.lectureNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedLecture.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  المحاضر: {selectedLecture.professorName || 'هيئة التدريس'}
                </p>
              </div>
              <button
                onClick={() => setSelectedLecture(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {selectedLecture.description && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed mb-5">
                {selectedLecture.description}
              </div>
            )}

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800">
                الملفات والموارد التعليمية (Google Drive):
              </h4>

              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-800 leading-relaxed">
                ℹ️ يتم استضافة ملفات الشرح على Google Drive الخاص بمعهد الفراعنة العالي. اضغط على زر فتح الملف للتحميل أو المشاهدة.
              </div>

              {selectedLecture.resources?.map((res: any) => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-blue-600">
                      {res.resourceType === 'pdf' ? <FileText className="w-4 h-4" /> :
                       res.resourceType === 'video' ? <Video className="w-4 h-4" /> :
                       res.resourceType === 'audio' ? <Music className="w-4 h-4" /> :
                       <FileCode className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 block truncate">{res.title}</span>
                      <span className="text-[10px] text-slate-500 block">{res.fileSize || 'ملف'}</span>
                    </div>
                  </div>

                  <a
                    href={res.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition shrink-0 shadow-2xs"
                  >
                    <span>فتح الملف</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedLecture(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
