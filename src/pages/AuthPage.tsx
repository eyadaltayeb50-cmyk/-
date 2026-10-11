import React, { useState } from 'react';
import { 
  GraduationCap, 
  Phone, 
  Lock, 
  User, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  UserCheck,
  UserX
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { login, register, switchDemo } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Login form
  const [loginPhone, setLoginPhone] = useState<string>('');
  const [loginPass, setLoginPass] = useState<string>('');

  // Register form
  const [fullName, setFullName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPass, setRegPass] = useState<string>('');
  const [regConfirmPass, setRegConfirmPass] = useState<string>('');
  const [institutionId, setInstitutionId] = useState<string>('inst-1');
  const [departmentId, setDepartmentId] = useState<string>('dept-1');
  const [academicYearId, setAcademicYearId] = useState<string>('year-3');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone) {
      setError('يرجى إدخال رقم الهاتف أو البريد الإلكتروني');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(loginPhone, loginPass);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !regPhone || !regPass) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (regPass !== regConfirmPass) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
      return;
    }

    const egyptPhoneRegex = /^01[0125][0-9]{8}$/;
    if (!egyptPhoneRegex.test(regPhone.trim())) {
      setError('رقم الهاتف يجب أن يكون رقم محمول مصري صحيح مكون من 11 رقم (يبدأ بـ 010 أو 011 أو 012 أو 015)');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await register({
        fullName,
        phone: regPhone,
        password: regPass,
        institutionId,
        departmentId,
        academicYearId,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'فشل إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'active' | 'pending' | 'admin') => {
    setLoading(true);
    try {
      await switchDemo(role);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-9 shadow-xl space-y-6">
        
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 p-0.5 mx-auto shadow-md">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-bold text-blue-700 text-xl">
              <GraduationCap className="w-7 h-7" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900">معهد الفراعنة العالي</h1>
          <p className="text-xs text-slate-500 font-medium">
            المنصة الطلابية والتعليم الإلكتروني (Smart Campus)
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
              mode === 'login' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
              mode === 'register' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            إنشاء حساب طالب جديد
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-semibold">{error}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                رقم الهاتف أو البريد الإلكتروني
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="01123456789"
                  dir="ltr"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl pr-10 pl-4 py-3 text-xs text-slate-900 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl pr-10 pl-4 py-3 text-xs text-slate-900 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loading ? 'جاري الدخول...' : 'تسجيل الدخول للمنصة'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الاسم بالكامل (كما في بطاقة المعهد)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: حسام أحمد محمود"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم الهاتف المصري
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="01012345678"
                  dir="ltr"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-900 outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  تأكيد كلمة المرور
                </label>
                <input
                  type="password"
                  value={regConfirmPass}
                  onChange={(e) => setRegConfirmPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">المعهد</label>
                <select
                  value={institutionId}
                  onChange={(e) => setInstitutionId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-2 py-2 text-xs outline-none"
                >
                  <option value="inst-1">معهد الفراعنة العالي</option>
                  <option value="inst-2">معهد الفراعنة - تجارة</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">الشعبة</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-2 py-2 text-xs outline-none"
                >
                  <option value="dept-1">نظم معلومات إدارية</option>
                  <option value="dept-2">علوم حاسب</option>
                  <option value="dept-3">إدارة ومحاسبة</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">الفرقة</label>
                <select
                  value={academicYearId}
                  onChange={(e) => setAcademicYearId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-2 py-2 text-xs outline-none"
                >
                  <option value="year-1">الفرقة الأولى</option>
                  <option value="year-2">الفرقة الثانية</option>
                  <option value="year-3">الفرقة الثالثة</option>
                  <option value="year-4">الفرقة الرابعة</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
              ℹ️ الحساب الجديد ينشأ بحالة <strong className="text-amber-700">بانتظار التفعيل</strong>، وسيتطلب إدخال كود التفعيل للوصول لمحاضرات معهد الفراعنة.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loading ? 'جاري الإنشاء...' : 'إنشاء الحساب ومتابعة التفعيل'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Demo Personas */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-500 block text-center">
            🚀 التبديل السريع لتجربة سيناريوهات المنصة:
          </span>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('active')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-center transition cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-teal-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-800 block truncate">طالب مفعّل</span>
              <span className="text-[9px] text-teal-700 font-semibold block">عرض المحاضرات</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('pending')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-center transition cursor-pointer"
            >
              <UserX className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-800 block truncate">طالب غير مفعّل</span>
              <span className="text-[9px] text-amber-700 font-semibold block">تجربة التفعيل</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-center transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-800 block truncate">مدير المنصة</span>
              <span className="text-[9px] text-purple-700 font-semibold block">لوحة الإدارة</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
