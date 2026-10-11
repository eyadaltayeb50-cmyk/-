import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  ChevronLeft, 
  User, 
  FileText, 
  Layers,
  ArrowRight,
  ExternalLink,
  Video,
  Music,
  FileCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Subject, Lecture } from '../types';
import { PaywallModal } from '../components/common/PaywallModal';

interface SubjectsPageProps {
  onGoToActivate: () => void;
  onGoToOnboarding: () => void;
}

export const SubjectsPage: React.FC<SubjectsPageProps> = ({ onGoToActivate, onGoToOnboarding }) => {
  const { isActivated, isAdmin } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  
  // Selected Subject for deep view
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [subjectLectures, setSubjectLectures] = useState<Lecture[]>([]);
  const [lecturesLoading, setLecturesLoading] = useState<boolean>(false);

  // Paywall
  const [showPaywall, setShowPaywall] = useState<boolean>(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const res = await api.getSubjects();
      if (res.success) {
        setSubjects(res.subjects);
      }
    } catch (err) {
      console.error('Failed to load subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubject = async (subject: Subject) => {
    if (!isActivated && !isAdmin) {
      setShowPaywall(true);
      return;
    }

    setActiveSubject(subject);
    setLecturesLoading(true);
    try {
      const res = await api.getSubjectLectures(subject.id);
      if (res.success) {
        setSubjectLectures(res.lectures);
      }
    } catch (err: any) {
      if (err.message && err.message.includes('تفعيل')) {
        setShowPaywall(true);
      }
    } finally {
      setLecturesLoading(false);
    }
  };

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onGoToActivate={onGoToActivate}
        subjectTitle={activeSubject?.name}
      />

      {/* If looking at a specific subject's lectures */}
      {activeSubject ? (
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
            <button
              onClick={() => { setActiveSubject(null); }}
              className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-800 transition cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لكافة المواد</span>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-700 block mb-1">
                  كود المادة: {activeSubject.code}
                </span>
                <h1 className="text-2xl font-black text-slate-900">{activeSubject.name}</h1>
                <p className="text-xs text-slate-500 mt-1">
                  المحاضر: {(activeSubject as any).currentProfessor?.name || 'أعضاء هيئة التدريس بمعهد الفراعنة'} ·{' '}
                  {activeSubject.creditHours || 3} ساعات معتمدة
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center shrink-0">
                <span className="text-xs text-slate-500 block">إجمالي المحاضرات</span>
                <span className="text-xl font-bold text-blue-700">{subjectLectures.length}</span>
              </div>
            </div>
          </div>

          {/* Lectures List */}
          {lecturesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-2xl skeleton-shimmer" />
              ))}
            </div>
          ) : subjectLectures.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm">
              لم يتم رفع محاضرات لهذه المادة حتى الآن بمعهد الفراعنة.
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">قائمة المحاضرات ومذكرات الشرح (Google Drive)</h2>

              <div className="space-y-3">
                {subjectLectures.map((lec) => (
                  <div
                    key={lec.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200/50">
                            المحاضرة {lec.lectureNumber}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(lec.publishedAt).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{lec.title}</h3>
                      </div>

                      <span className="text-xs text-slate-500 font-medium">
                        {lec.resources?.length || 0} موارد Google Drive
                      </span>
                    </div>

                    {lec.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {lec.description}
                      </p>
                    )}

                    {/* Resources directly listed */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
                      {lec.resources?.map((res) => (
                        <a
                          key={res.id}
                          href={res.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 flex items-center justify-between gap-3 text-xs transition shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-700 shrink-0">
                              {res.resourceType === 'pdf' ? <FileText className="w-3.5 h-3.5" /> :
                               res.resourceType === 'video' ? <Video className="w-3.5 h-3.5" /> :
                               res.resourceType === 'audio' ? <Music className="w-3.5 h-3.5" /> :
                               <FileCode className="w-3.5 h-3.5" />}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 truncate block">{res.title}</span>
                              <span className="text-[10px] text-slate-500">{res.fileSize || 'ملف'}</span>
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Main Catalog of Subjects */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">مواد معهد الفراعنة العالي</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                استعرض المواد المسجلة لشعبتك والملفات المرفوعة على Google Drive.
              </p>
            </div>

            <button
              onClick={onGoToOnboarding}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-2xs"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>تعديل اختيارات المواد</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم المادة أو الكود الدراسي..."
              className="w-full bg-white border border-slate-200 focus:border-blue-600 rounded-2xl pr-11 pl-4 py-3 text-xs sm:text-sm text-slate-900 outline-none transition shadow-2xs"
            />
          </div>

          {/* Subjects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-44 rounded-3xl skeleton-shimmer" />
              ))}
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-sm">
              لم يتم العثور على مواد مطابقة للبحث.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubjects.map((sub: any) => (
                <div
                  key={sub.id}
                  onClick={() => handleOpenSubject(sub)}
                  className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 group shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-blue-700 px-2 py-0.5 rounded bg-blue-50 border border-blue-200/50">
                        {sub.code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {sub.lecturesCount || 0} محاضرات
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition">
                      {sub.name}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sub.currentProfessor?.name || 'أستاذ المادة'}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      آخر تحديث: {new Date(sub.latestUpdate || Date.now()).toLocaleDateString('ar-EG')}
                    </span>
                    <button className="flex items-center gap-1 font-bold text-blue-700 group-hover:translate-x-1 transition cursor-pointer">
                      <span>فتح المحاضرات</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
