import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Layers, 
  GraduationCap, 
  BookOpen, 
  UserCheck, 
  ArrowLeft, 
  ArrowRight, 
  Save,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Subject, Institution, Department, AcademicYear } from '../types';

interface OnboardingPageProps {
  onCompleted?: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onCompleted }) => {
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Selections state
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedYearId, setSelectedYearId] = useState<string>('');
  
  const [subjectConfigs, setSubjectConfigs] = useState<Record<string, { selected: boolean; professorId: string }>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getOnboardingData();
      if (res.success) {
        setInstitutions(res.institutions);
        setDepartments(res.departments);
        setAcademicYears(res.academicYears);
        setSubjects(res.subjects);

        setSelectedInstitutionId(user?.institutionId || res.institutions[0]?.id || '');
        setSelectedDepartmentId(user?.departmentId || res.departments[0]?.id || '');
        setSelectedYearId(user?.academicYearId || res.academicYears[0]?.id || '');

        const configs: Record<string, { selected: boolean; professorId: string }> = {};
        res.subjects.forEach((s) => {
          const prior = res.currentSelections.find((cs: any) => cs.subjectId === s.id);
          configs[s.id] = {
            selected: prior ? true : true,
            professorId: prior?.professorId || s.professors[0]?.id || '',
          };
        });
        setSubjectConfigs(configs);
      }
    } catch (err: any) {
      setError(err.message || 'فشل تحميل بيانات الإعداد');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubject = (subjectId: string) => {
    setSubjectConfigs((prev) => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        selected: !prev[subjectId]?.selected,
      },
    }));
  };

  const handleSelectProfessor = (subjectId: string, profId: string) => {
    setSubjectConfigs((prev) => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        professorId: profId,
      },
    }));
  };

  const handleSave = async () => {
    const selectedList = Object.entries(subjectConfigs)
      .filter(([_, cfg]) => cfg.selected)
      .map(([subjectId, cfg]) => ({
        subjectId,
        professorId: cfg.professorId || undefined,
      }));

    if (selectedList.length === 0) {
      setError('يرجى اختيار مادة واحدة على الأقل للاستمرار');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await api.saveOnboarding({
        institutionId: selectedInstitutionId,
        departmentId: selectedDepartmentId,
        academicYearId: selectedYearId,
        selections: selectedList,
      });

      if (res.success) {
        await refreshUser();
        if (onCompleted) {
          onCompleted();
        }
      }
    } catch (err: any) {
      setError(err.message || 'فشل حفظ الاختيارات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500">جاري تحميل بيانات معهد الفراعنة...</p>
      </div>
    );
  }

  const selectedCount = Object.values(subjectConfigs).filter((c) => c.selected).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Wizard Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
              معهد الفراعنة العالي · إعداد الملف الدراسي
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              اختيار المواد وأعضاء هيئة التدريس
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          حدد المواد التي تدرسها هذا الفصل والدكاترة المشرفين عليها بمعهد الفراعنة لتظهر لك محاضراتهم ومذكراتهم فقط.
        </p>

        {/* Stepper Indicator */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-slate-100">
          <div className={`p-2.5 rounded-xl text-center text-xs font-bold transition ${
            step >= 1 ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-slate-50 text-slate-400'
          }`}>
            1. تأكيد الفرقة والشعبة
          </div>
          <div className={`p-2.5 rounded-xl text-center text-xs font-bold transition ${
            step >= 2 ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-slate-50 text-slate-400'
          }`}>
            2. اختيار المواد ({selectedCount})
          </div>
          <div className={`p-2.5 rounded-xl text-center text-xs font-bold transition ${
            step >= 3 ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-slate-50 text-slate-400'
          }`}>
            3. اختيار الدكاترة
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Step 1: Confirmation of Institution & Department */}
      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-700" />
            <span>البيانات الأكاديمية للطالب بمعهد الفراعنة</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">المعهد</label>
              <select
                value={selectedInstitutionId}
                onChange={(e) => setSelectedInstitutionId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-2xl px-4 py-3 text-sm focus:border-blue-600 outline-none"
              >
                {institutions.map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">الشعبة الدراسية</label>
              <select
                value={selectedDepartmentId}
                onChange={(e) => setSelectedDepartmentId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-2xl px-4 py-3 text-sm focus:border-blue-600 outline-none"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">الفرقة الدراسية</label>
              <select
                value={selectedYearId}
                onChange={(e) => setSelectedYearId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-2xl px-4 py-3 text-sm focus:border-blue-600 outline-none"
              >
                {academicYears.map((y) => (
                  <option key={y.id} value={y.id}>{y.name} - الفصل الدراسي الثاني</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <span>التالي: اختيار المواد</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Subject Selections */}
      {step === 2 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-700" />
              <span>المواد الدراسية المتاحة لشعبتك</span>
            </h2>
            <span className="text-xs text-slate-500 font-bold">
              تم تحديد ({selectedCount}) مواد
            </span>
          </div>

          <div className="space-y-3">
            {subjects.map((sub) => {
              const isSelected = subjectConfigs[sub.id]?.selected ?? false;
              return (
                <div
                  key={sub.id}
                  onClick={() => handleToggleSubject(sub.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-300 text-slate-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300 text-transparent'
                    }`}>
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{sub.name}</h4>
                      <p className="text-xs text-slate-500">
                        كود: {sub.code} · {sub.creditHours || 3} ساعات معتمدة
                      </p>
                    </div>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-medium">
                    {sub.professors.length > 1 ? `${sub.professors.length} دكاترة متاحين` : sub.professors[0]?.name || 'دكتور المادة'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابق</span>
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={selectedCount === 0}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 transition cursor-pointer disabled:opacity-40 shadow-xs"
            >
              <span>التالي: اختيار الدكاترة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Professor Selections */}
      {step === 3 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-700" />
            <span>تحديد دكتور كل مادة بمعهد الفراعنة</span>
          </h2>
          <p className="text-xs text-slate-500">
            حدد المحاضر الذي تتابع معه في قاعة المحاضرات لعرض تسجيلاته وسلايداته المفضلة.
          </p>

          <div className="space-y-4">
            {subjects
              .filter((s) => subjectConfigs[s.id]?.selected)
              .map((sub) => {
                const currentProfId = subjectConfigs[sub.id]?.professorId;
                return (
                  <div key={sub.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">{sub.name}</span>
                      <span className="text-xs text-slate-500 font-mono font-bold">{sub.code}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sub.professors.map((p) => {
                        const isChosen = currentProfId === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelectProfessor(sub.id, p.id)}
                            className={`p-3 rounded-xl border text-right transition cursor-pointer ${
                              isChosen
                                ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                {p.name[0]}
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-slate-900 block truncate">
                                  {p.title} {p.name}
                                </span>
                                <span className="text-[10px] text-slate-500 truncate block">
                                  {p.bio || 'هيئة التدريس بمعهد الفراعنة'}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابق</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'جاري الحفظ...' : 'حفظ والذهاب للمنصة'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
