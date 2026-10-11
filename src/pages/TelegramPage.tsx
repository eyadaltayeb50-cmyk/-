import React, { useState, useEffect } from 'react';
import { 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Unlink, 
  Play, 
  Code 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const TelegramPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [linkData, setLinkData] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState<boolean>(false);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [showDocs, setShowDocs] = useState<boolean>(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await api.getTelegramStatus();
      if (res.success) {
        setStatus(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    setGenerating(true);
    try {
      const res = await api.generateTelegramLink();
      if (res.success) {
        setLinkData(res);
      }
    } catch (err: any) {
      alert(err.message || 'فشل توليد رابط تيليجرام');
    } finally {
      setGenerating(false);
    }
  };

  const handleSimulateBot = async () => {
    if (!linkData?.token) return;
    setSimulating(true);
    try {
      const res = await api.simulateBotLink(linkData.token, 'StudentTelegram_Pharaohs');
      if (res.success) {
        setTestResult('✅ تم محاكاة فتح البوت والربط بنجاح!');
        setLinkData(null);
        await loadStatus();
        await refreshUser();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSimulating(false);
    }
  };

  const handleSendTestNotification = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await api.sendTestTelegram();
      if (res.success) {
        setTestResult(res.message);
      }
    } catch (err: any) {
      setTestResult(`❌ ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  const handleUnlink = async () => {
    if (!confirm('هل أنت متأكد من رغبتك في إلغاء ربط حساب تيليجرام؟ لن تصلك الإشعارات بعد ذلك.')) return;
    try {
      await api.unlinkTelegram();
      await loadStatus();
      await refreshUser();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCopyLink = () => {
    if (linkData?.deepLink) {
      navigator.clipboard.writeText(linkData.deepLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wide">
              معهد الفراعنة العالي · تيليجرام
            </span>
            <h1 className="text-2xl font-bold text-slate-900">إشعارات المنصة عبر Telegram Bot</h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          اربط حسابك لتصلك إشعارات المحاضرات الجديدة، ملفات Google Drive، وتنبيهات المواعيد بمعهد الفراعنة على تيليجرام مباشرة مع زر لفتح المحاضرة بضغطة واحدة.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>حالة اتصال الحساب</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              الربط يتم عبر رمز مشفر آمن وقصير الصلاحية (Deep Link).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {status?.isLinked ? (
              <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>حسابك مربوط بنجاح</span>
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold">
                غير مربوط حالياً
              </span>
            )}
          </div>
        </div>

        {status?.isLinked ? (
          /* Linked State Details */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span>اسم المستخدم في تيليجرام:</span>
                <span className="font-mono text-sky-700 font-bold" dir="ltr">
                  @{status.telegramUsername || user?.telegramUsername || 'PharaohsStudent'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>تاريخ الربط:</span>
                <span className="text-slate-500">
                  {status.linkedAt ? new Date(status.linkedAt).toLocaleDateString('ar-EG') : 'حديثاً'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>حالة التسليم الأخيرة:</span>
                <span className="text-emerald-700 font-bold">ناجح (Delivered)</span>
              </div>
            </div>

            {testResult && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                {testResult}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleSendTestNotification}
                disabled={testing}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{testing ? 'جاري الإرسال...' : 'إرسال إشعار تجريبي لاختبار البوت'}</span>
              </button>

              <button
                onClick={handleUnlink}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>إلغاء الربط</span>
              </button>
            </div>
          </div>
        ) : (
          /* Unlinked State: Deep Link Generator */
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed">
              <p className="font-bold text-slate-900">كيف يعمل الربط بأمان؟</p>
              <p>
                1. اضغط على زر <strong>توليد رابط الربط</strong> بالأسفل.<br />
                2. يفتح تيليجرام ويطلب منك الضغط على <strong>بدء (Start)</strong>.<br />
                3. يتعرف البوت على رمز الطالب الخاص بك ويربط حسابك تلقائياً دون الحاجة لإدخال أي بيانات سرية.
              </p>
            </div>

            {linkData ? (
              <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-sky-800">الرابط جاهز (صالح لمدة 15 دقيقة):</span>
                  <span className="font-mono text-[11px] text-slate-500">رمز: {linkData.token.substring(0, 10)}...</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-sky-200 text-xs font-mono text-slate-800" dir="ltr">
                  <span className="truncate flex-1 font-bold">{linkData.deepLink}</span>
                  <button
                    onClick={handleCopyLink}
                    className="p-1 rounded text-slate-500 hover:text-slate-900"
                    title="نسخ الرابط"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={linkData.deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>فتح بوت تيليجرام والضغط على Start</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Simulator button */}
                  <button
                    onClick={handleSimulateBot}
                    disabled={simulating}
                    className="py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="محاكاة الضغط على Start للاختبار السريع"
                  >
                    <span>{simulating ? 'جاري التحقق...' : 'اختبار المحاكاة الفوري ⚡'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleGenerateLink}
                disabled={generating}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{generating ? 'جاري التوليد...' : 'توليد رابط ربط حساب تيليجرام'}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Student FAQ & How It Works Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Send className="w-5 h-5 text-sky-600" />
          <span>كيف تستفيد من بوت تيليجرام بمعهد الفراعنة؟</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <p className="font-bold text-slate-900">📚 تنبيهات المحاضرات</p>
            <p className="text-slate-600 leading-relaxed">
              تصلك رسالة باسم المادة، رقم المحاضرة، وعنوانها فور قيام عضو هيئة التدريس بنشرها.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <p className="font-bold text-slate-900">📂 ملفات Google Drive</p>
            <p className="text-slate-600 leading-relaxed">
              رابط مباشر لفتح الـ PDF أو الشيتات أو السلايدات على جوجل درايف بضغطة واحدة من داخل تيليجرام.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <p className="font-bold text-slate-900">⚡ تنبيهات المواعيد</p>
            <p className="text-slate-600 leading-relaxed">
              إشعارات مواعيد الميدتيرم، تسليم التكليفات، وجداول المحاضرات بتوقيت القاهرة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
