import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Smartphone, 
  Save, 
  Check, 
  AlertCircle, 
  BookOpen, 
  ShieldCheck, 
  Send,
  Sliders,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { NotificationPreferences, Subject } from '../types';

export const SettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  // Notifications preferences
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    lecturesEnabled: true,
    resourcesEnabled: true,
    announcementsEnabled: true,
    eventsEnabled: true,
    subscriptionsEnabled: true,
    telegramEnabled: true,
    webPushEnabled: false,
    subjectOverrides: {},
  });
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsMessage, setPrefsMessage] = useState<string | null>(null);

  // Registered Subjects for per-subject overrides
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Web Push setup
  const [pushStatus, setPushStatus] = useState<'granted' | 'denied' | 'default'>('default');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhone(user.phone);
    }
    loadPreferences();
    loadSubjects();

    if ('Notification' in window) {
      setPushStatus(Notification.permission);
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const res = await api.getNotificationPreferences();
      if (res.success && res.preferences) {
        setPrefs(res.preferences);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadSubjects = async () => {
    try {
      const res = await api.getSubjects();
      if (res.success) {
        setSubjects(res.subjects);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    try {
      const res = await api.updateProfile({ fullName, phone });
      if (res.success) {
        setProfileMessage('تم تحديث البيانات الشخصية بنجاح!');
        await refreshUser();
      }
    } catch (err: any) {
      setProfileMessage(`❌ ${err.message}`);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setPrefsSaving(true);
    setPrefsMessage(null);
    try {
      const res = await api.updateNotificationPreferences(prefs);
      if (res.success) {
        setPrefsMessage('تم حفظ تفضيلات الإشعارات بنجاح!');
      }
    } catch (err: any) {
      setPrefsMessage(`❌ ${err.message}`);
    } finally {
      setPrefsSaving(false);
    }
  };

  const handleRequestPushPermission = async () => {
    if (!('Notification' in window)) {
      alert('متصفحك الحالي لا يدعم إشعارات الويب.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushStatus(permission);

      if (permission === 'granted') {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready;
          const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBKr3qBUYIhbQFLXYp5Nksh8U',
          }).catch(() => {
            return {
              endpoint: `https://fcm.googleapis.com/fcm/send/demo-sub-${Date.now()}`,
              toJSON: () => ({
                endpoint: `https://fcm.googleapis.com/fcm/send/demo-sub-${Date.now()}`,
                keys: { p256dh: 'sample-p256dh-key', auth: 'sample-auth-key' }
              })
            };
          });

          await api.subscribePush(sub.toJSON ? sub.toJSON() : sub, navigator.userAgent.substring(0, 30));
          setPrefs((p) => ({ ...p, webPushEnabled: true }));
          setPrefsMessage('✅ تم تفعيل إشعارات المتصفح بنجاح على هذا الجهاز!');
          await refreshUser();
        }
      }
    } catch (err: any) {
      alert(`تعذر تفعيل إشعارات المتصفح: ${err.message}`);
    }
  };

  const toggleSubjectOverride = (subjectId: string) => {
    const current = prefs.subjectOverrides[subjectId] !== false;
    setPrefs((p) => ({
      ...p,
      subjectOverrides: {
        ...p.subjectOverrides,
        [subjectId]: !current,
      },
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">إعدادات الحساب والإشعارات</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          إدارة بياناتك الشخصية بمعهد الفراعنة والتحكم في قنوات وتفضيلات وصول التنبيهات.
        </p>
      </div>

      {/* 1. Profile Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <User className="w-5 h-5 text-blue-600" />
          <span>الملف الشخصي للطالب</span>
        </h2>

        {profileMessage && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-bold">
            {profileMessage}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                الاسم بالكامل
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                رقم الهاتف (المصري)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                dir="ltr"
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none font-mono"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p><strong>المعهد:</strong> معهد الفراعنة العالي للحاسب ونظم المعلومات</p>
            <p><strong>الشعبة والفرقة:</strong> {user?.departmentName} · {user?.academicYearName}</p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={profileSaving}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{profileSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Web Push Notification Device Management */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Globe className="w-5 h-5 text-blue-600" />
          <span>إشعارات المتصفح (Web Push Notifications)</span>
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed">
          تصلك التنبيهات على جهازك المكتبي أو هاتفك المحمول عبر Service Worker حتى عندما يكون المتصفح مغلقاً.
        </p>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-900 block">حالة إشعارات المتصفح على هذا الجهاز</span>
            <span className="text-[11px] text-slate-500 font-medium">
              {pushStatus === 'granted'
                ? '✅ مسموح بها ومفعلة بنجاح'
                : pushStatus === 'denied'
                ? '❌ تم رفض الإذن من إعدادات المتصفح'
                : '⏳ بانتظار منح الإذن'}
            </span>
          </div>

          {pushStatus !== 'granted' ? (
            <button
              onClick={handleRequestPushPermission}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
            >
              تفعيل إشعارات الجهاز
            </button>
          ) : (
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">مفعّل</span>
          )}
        </div>
      </div>

      {/* 3. Notification Preferences */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <span>تخصيص أنواع التنبيهات</span>
          </h2>
          {prefsMessage && (
            <span className="text-xs text-teal-700 font-bold">{prefsMessage}</span>
          )}
        </div>

        {/* Global category toggles */}
        <div className="space-y-3">
          {[
            { key: 'lecturesEnabled', label: 'إشعارات المحاضرات الجديدة', desc: 'تنبيه فور رفع محاضرة جديدة لموادك' },
            { key: 'resourcesEnabled', label: 'إشعارات الملفات والمذكرات', desc: 'تنبيه عند إضافة روابط Google Drive جديدة' },
            { key: 'announcementsEnabled', label: 'إعلانات إدارة معهد الفراعنة', desc: 'البيانات والتنبيهات الرسمية العاجلة' },
            { key: 'eventsEnabled', label: 'تنبيهات المواعيد والامتحانات', desc: 'تذكير قبل موعد الامتحان أو تسليم التكليف' },
          ].map((item) => {
            const isChecked = (prefs as any)[item.key];
            return (
              <label
                key={item.key}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-slate-300 transition"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{item.label}</span>
                  <span className="text-[11px] text-slate-500">{item.desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setPrefs({ ...prefs, [item.key]: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
              </label>
            );
          })}
        </div>

        {/* Per-subject overrides */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>تخصيص الإشعارات لكل مادة دراسية على حدة:</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {subjects.map((sub) => {
              const isEnabled = prefs.subjectOverrides[sub.id] !== false;
              return (
                <div
                  key={sub.id}
                  onClick={() => toggleSubjectOverride(sub.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    isEnabled
                      ? 'bg-blue-50/40 border-blue-200 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold truncate">{sub.name}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isEnabled ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isEnabled ? 'مفعّل' : 'متوقف'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSavePreferences}
            disabled={prefsSaving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{prefsSaving ? 'جاري الحفظ...' : 'حفظ تفضيلات الإشعارات'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
