import React, { useState } from 'react';
import { 
  KeyRound, 
  CheckCircle2, 
  Copy, 
  Check, 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  AlertTriangle,
  Zap,
  Phone,
  Send,
  Sparkles,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface ActivatePageProps {
  onSuccessNavigate?: () => void;
}

export const ActivatePage: React.FC<ActivatePageProps> = ({ onSuccessNavigate }) => {
  const { user, isActivated, refreshUser } = useAuth();
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState(user?.phone || '01012345678');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [registeredBotData, setRegisteredBotData] = useState<{
    phone: string;
    botDeepLink?: string;
    botUsername?: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'activate' | 'payment'>('activate');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('يرجى إدخال كود التفعيل');
      return;
    }

    if (!phone.trim()) {
      setError('يرجى إدخال رقم الهاتف للتسجيل في البوت');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setRegisteredBotData(null);

    try {
      const res = await api.verifyCode(code.trim(), phone.trim());
      if (res.success) {
        setSuccessMessage(res.message);
        setRegisteredBotData({
          phone: res.registeredPhone || phone.trim(),
          botDeepLink: res.botDeepLink,
          botUsername: res.botUsername,
        });
        setCode('');
        await refreshUser();

        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#0d9488', '#8b5cf6', '#f59e0b', '#10b981'],
        });
      }
    } catch (err: any) {
      setError(err.message || 'فشل تفعيل الكود، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Account Status Hero Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xs transition-all ${
        isActivated 
          ? 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-200' 
          : 'bg-gradient-to-br from-amber-50 via-white to-orange-50 border-amber-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              isActivated 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {isActivated ? <ShieldCheck className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide bg-slate-100 text-slate-700">
                  معهد الفراعنة العالي
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isActivated ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isActivated ? 'مفعّل ونشط ✅' : 'بانتظار التفعيل ⏳'}
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900">
                {isActivated ? 'اشتراكك بمعهد الفراعنة نشط' : 'تفعيل الحساب والوصول للمحاضرات'}
              </h1>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {isActivated ? (
                  <>
                    صلاحية اشتراكك سارية حتى{' '}
                    <strong className="text-emerald-700">
                      {user?.subscriptionExpiresAt
                        ? new Date(user.subscriptionExpiresAt).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'تفعيل دائم'}
                    </strong>
                    . يمكنك تجديد الاشتراك في أي وقت بإدخال كود جديد دون فقدان بياناتك.
                  </>
                ) : (
                  'حسابك حالياً في حالة الانتظار. للحصول على المحاضرات والملخصات والروابط الدراسية، أدخل كود التفعيل المستلم من إدارة المعهد.'
                )}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('activate')}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-center ${
                activeTab === 'activate'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              إدخال كود التفعيل
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-center ${
                activeTab === 'payment'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              طرق الدفع والتواصل
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      {activeTab === 'activate' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Activation Form */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600" />
                <span>أدخل رمز التفعيل</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                الكود مكون من حروف وأرقام، ويتم تفعيله لربطه بحسابك بمعهد الفراعنة بشكل فوري.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
                <div className="leading-relaxed font-semibold">{error}</div>
              </div>
            )}

            {/* Telegram Bot Automated Registration Result Card */}
            {registeredBotData && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300 shadow-md space-y-4 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-sm">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      تأكيد التسجيل الفوري في البوت ✅
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      تم تفعيل الاشتراك وتسجيل رقمك بالبوت تلقائياً!
                    </h3>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">رقم الهاتف المسجل بالبوت:</span>
                    <span className="font-mono text-emerald-800 font-black text-sm" dir="ltr">
                      {registeredBotData.phone}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">حالة الربط والإشعارات:</span>
                    <span className="text-emerald-700 font-bold">نشط ومسجل بقاعدة بيانات البوت تلقائياً ✅</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">معرف بوت معهد الفراعنة:</span>
                    <span className="font-mono text-sky-700 font-bold" dir="ltr">
                      @{registeredBotData.botUsername || 'SmartCampusEgyptBot'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  {registeredBotData.botDeepLink && (
                    <a
                      href={registeredBotData.botDeepLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs text-center"
                    >
                      <Send className="w-4 h-4" />
                      <span>فتح البوت على Telegram وتأكيد الاستلام 🚀</span>
                    </a>
                  )}
                  {onSuccessNavigate && (
                    <button
                      type="button"
                      onClick={onSuccessNavigate}
                      className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer text-center"
                    >
                      الانتقال للمحاضرات الآن
                    </button>
                  )}
                </div>
              </div>
            )}

            {successMessage && !registeredBotData && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <div className="leading-relaxed font-bold">{successMessage}</div>
              </div>
            )}

            <form onSubmit={handleActivate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  كود التفعيل (Activation Code)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="مثال: CAMPUS-2026-TERM"
                    dir="ltr"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-2xl px-4 py-3.5 text-center text-lg font-mono font-bold tracking-widest text-blue-800 uppercase transition placeholder:text-slate-400 outline-none"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Automated Bot Phone Number Input */}
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    <span>رقم الهاتف المحمول (يُسجل في البوت تلقائياً)</span>
                  </label>
                  <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                    <Bot className="w-3 h-3 text-sky-600" />
                    <span>تسجيل تلقائي في البوت 🤖</span>
                  </span>
                </div>
                
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010xxxxxxxx"
                  dir="ltr"
                  className="w-full bg-white border border-sky-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 rounded-xl px-3.5 py-2.5 text-center text-sm font-mono font-bold text-slate-900 transition outline-none"
                  disabled={loading}
                />

                <p className="text-[11px] text-sky-900/80 leading-relaxed font-medium">
                  ⚡ بمجرد تفعيل الاشتراك، سيتم تسجيل رقمك تلقائياً في بوت تيليجرام معهد الفراعنة لتصلك المحاضرات والملخصات والروابط أولاً بأول.
                </p>
              </div>

              {/* Sample test codes */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-600 font-bold block mb-2">أكواد تجريبية جاهزة للاختبار الفوري:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setCode('CAMPUS-2026-TERM')}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-blue-800 text-xs font-mono font-bold border border-slate-300 transition cursor-pointer"
                  >
                    CAMPUS-2026-TERM (ترم)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCode('VIP-SUCCESS-YEAR')}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-blue-800 text-xs font-mono font-bold border border-slate-300 transition cursor-pointer"
                  >
                    VIP-SUCCESS-YEAR (سنة)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCode('TEST-PERMANENT-99')}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-blue-800 text-xs font-mono font-bold border border-slate-300 transition cursor-pointer"
                  >
                    TEST-PERMANENT-99 (دائم)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>جاري التحقق من الكود وتفعيل الحساب...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>تفعيل الحساب الآن</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500">
              ليس لديك كود؟{' '}
              <button
                type="button"
                onClick={() => setActiveTab('payment')}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                تعرف على طرق التحويل والدفع
              </button>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ماذا يمنحك التفعيل بمعهد الفراعنة؟</span>
            </h3>

            <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>الوصول لجميع محاضرات شعبتك الدراسية.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>تحميل ملفات الشرح والـ PDF والملخصات من Google Drive.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>الاستماع إلى التسجيلات الصوتية ومقاطع الفيديو للمحاضرين.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>إشعارات فورية عبر Telegram وبوش عند نزول أي جديد.</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-slate-100">
              <a
                href="https://wa.me/201012345678"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>طلب الكود عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Payment Methods Guide */
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">طرق الدفع لمعهد الفراعنة العالي</h2>
              <p className="text-sm text-slate-600 mt-1">
                يمكنك التحويل عبر أي من الوسائل التالية، ثم إرسال لقطة شاشة للتحويل على واتساب لاستلام الكود فوراً.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Vodafone Cash */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">فودافون كاش</span>
                    <span className="text-xs text-slate-500 font-bold">150 ج.م / ترم</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    حوّل المبلغ عبر خدمة فودافون كاش إلى الرقم التالي:
                  </p>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-sm text-slate-900 mb-3 font-bold" dir="ltr">
                    <span>01012345678</span>
                    <button
                      onClick={() => handleCopy('01012345678', 'voda')}
                      className="p-1 rounded text-slate-400 hover:text-slate-800"
                      title="نسخ الرقم"
                    >
                      {copiedKey === 'voda' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  احتفظ برسالة تأكيد التحويل لتسليم الكود.
                </p>
              </div>

              {/* InstaPay */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">انستا باي (InstaPay)</span>
                    <span className="text-xs text-slate-500 font-bold">تحويل لحظي</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    حوّل عبر عنوان الدفع اللحظي الخاص بالمعهد:
                  </p>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-900 mb-3 font-bold" dir="ltr">
                    <span className="truncate">pharaohs@instapay</span>
                    <button
                      onClick={() => handleCopy('pharaohs@instapay', 'insta')}
                      className="p-1 rounded text-slate-400 hover:text-slate-800 shrink-0"
                      title="نسخ المعرف"
                    >
                      {copiedKey === 'insta' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  اكتب اسم الطالب ورقم هاتفه في خانة الغرض.
                </p>
              </div>

              {/* Fawry */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">فوري (Fawry)</span>
                    <span className="text-xs text-slate-500 font-bold">أي ماكينة</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    ادفع من أي منفذ فوري باستخدام كود الخدمة:
                  </p>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-sm text-slate-900 mb-3 font-bold" dir="ltr">
                    <span>78910</span>
                    <button
                      onClick={() => handleCopy('78910', 'fawry')}
                      className="p-1 rounded text-slate-400 hover:text-slate-800"
                      title="نسخ كود الخدمة"
                    >
                      {copiedKey === 'fawry' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  اطلب إيصال المعاملة الورقي لتصويره.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
