import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  KeyRound, 
  BookOpen, 
  Megaphone, 
  Send, 
  Settings as SettingsIcon, 
  BarChart3, 
  Plus, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  ExternalLink,
  Copy,
  Check,
  Globe,
  Radio,
  FileText,
  GraduationCap,
  Bot,
  Zap,
  RefreshCw,
  Key,
  Link as LinkIcon,
  Phone,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { AdminStats, UserProfile, ActivationCode, PlatformSettings, Subject } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'codes' | 'content' | 'broadcast' | 'telegram' | 'reports' | 'settings'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Students tab
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [studentFilter, setStudentFilter] = useState<string>('all');

  // Codes tab
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [codePrefix, setCodePrefix] = useState<string>('PHARAOHS');
  const [codeCount, setCodeCount] = useState<number>(5);
  const [codeDuration, setCodeDuration] = useState<number>(120);
  const [codeGenerating, setCodeGenerating] = useState<boolean>(false);
  const [codeMessage, setCodeMessage] = useState<string | null>(null);

  // Content tab (Lectures & Drive Resources)
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [lecNumber, setLecNumber] = useState<number>(1);
  const [lecTitle, setLecTitle] = useState<string>('');
  const [lecDesc, setLecDesc] = useState<string>('');
  const [resTitle, setResTitle] = useState<string>('');
  const [resType, setResType] = useState<string>('pdf');
  const [resDriveUrl, setResDriveUrl] = useState<string>('');
  const [lecSubmitting, setLecSubmitting] = useState<boolean>(false);
  const [lecMessage, setLecMessage] = useState<string | null>(null);

  // Broadcast campaign
  const [bcTitle, setBcTitle] = useState<string>('');
  const [bcContent, setBcContent] = useState<string>('');
  const [bcTarget, setBcTarget] = useState<string>('all');
  const [bcChannels, setBcChannels] = useState<string[]>(['in_app', 'telegram', 'webpush']);
  const [bcSubmitting, setBcSubmitting] = useState<boolean>(false);
  const [bcMessage, setBcMessage] = useState<string | null>(null);

  // Platform Settings
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings | null>(null);
  const [settingsSaving, setSettingsSaving] = useState<boolean>(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  // Telegram Integration Tab
  const [telegramInfo, setTelegramInfo] = useState<any>(null);
  const [botTokenInput, setBotTokenInput] = useState<string>('');
  const [botUsernameInput, setBotUsernameInput] = useState<string>('');
  const [telegramActionMessage, setTelegramActionMessage] = useState<string | null>(null);
  const [telegramTesting, setTelegramTesting] = useState<boolean>(false);
  const [webhookSetting, setWebhookSetting] = useState<boolean>(false);
  const [copiedWebhook, setCopiedWebhook] = useState<boolean>(false);
  const [tgPhoneSearch, setTgPhoneSearch] = useState<string>('');
  const [copiedAllPhones, setCopiedAllPhones] = useState<boolean>(false);
  const [copiedStudentPhone, setCopiedStudentPhone] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, studentsRes, codesRes, subjectsRes, settingsRes, telRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminStudents(),
        api.getAdminCodes(),
        api.getSubjects(),
        api.getSettings(),
        api.getAdminTelegramInfo(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (studentsRes.success) setStudents(studentsRes.students);
      if (codesRes.success) setCodes(codesRes.codes);
      if (subjectsRes.success) {
        setSubjects(subjectsRes.subjects);
        if (subjectsRes.subjects.length > 0) setSelectedSubjectId(subjectsRes.subjects[0].id);
      }
      if (settingsRes.success) {
        setPlatformSettings(settingsRes.settings);
        setBotUsernameInput(settingsRes.settings.telegramBotUsername || '');
      }
      if (telRes.success) {
        setTelegramInfo(telRes);
        if (telRes.username) setBotUsernameInput(telRes.username);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Student status changer
  const handleUpdateStudentStatus = async (id: string, newStatus: string) => {
    try {
      await api.updateStudentStatus(id, newStatus);
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus as any } : s))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Code generation
  const handleGenerateCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeGenerating(true);
    setCodeMessage(null);
    try {
      const res = await api.generateCodes({
        prefix: codePrefix,
        count: codeCount,
        durationDays: codeDuration,
      });
      if (res.success) {
        setCodeMessage(res.message);
        setCodes((prev) => [...res.codes, ...prev]);
        const statsRes = await api.getAdminStats();
        if (statsRes.success) setStats(statsRes.stats);
      }
    } catch (err: any) {
      setCodeMessage(`❌ ${err.message}`);
    } finally {
      setCodeGenerating(false);
    }
  };

  const handleToggleCodeDisable = async (id: string) => {
    try {
      const res = await api.toggleCodeDisable(id);
      if (res.success) {
        setCodes((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: res.code.status } : c))
        );
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Export codes to CSV
  const handleExportCodesCSV = () => {
    const headers = ['الكود', 'المدة بالايام', 'الحالة', 'تاريخ الانشاء', 'المستخدم بواسطة'];
    const rows = codes.map((c) => [
      c.code,
      c.durationDays,
      c.status,
      c.createdAt,
      c.usedByName || '-',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pharaohs_campus_codes_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Lecture Creation
  const handleCreateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !lecTitle) {
      alert('يرجى اختيار المادة وعنوان المحاضرة');
      return;
    }

    setLecSubmitting(true);
    setLecMessage(null);
    try {
      const resources = resDriveUrl ? [{
        title: resTitle || 'ملف الشرح Google Drive',
        resourceType: resType,
        driveUrl: resDriveUrl,
        fileSize: '5 MB',
      }] : [];

      const res = await api.createLecture({
        subjectId: selectedSubjectId,
        lectureNumber: lecNumber,
        title: lecTitle,
        description: lecDesc,
        resources,
      });

      if (res.success) {
        setLecMessage('✅ تم نشر المحاضرة وتوزيع الإشعارات التلقائية للطلاب بنجاح!');
        setLecTitle('');
        setLecDesc('');
        setResDriveUrl('');
        setResTitle('');
        setLecNumber((n) => n + 1);
        const statsRes = await api.getAdminStats();
        if (statsRes.success) setStats(statsRes.stats);
      }
    } catch (err: any) {
      setLecMessage(`❌ ${err.message}`);
    } finally {
      setLecSubmitting(false);
    }
  };

  // Broadcast Notification Campaign
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcTitle || !bcContent) {
      alert('يرجى ملء عنوان ونص الرسالة');
      return;
    }

    setBcSubmitting(true);
    setBcMessage(null);
    try {
      const res = await api.broadcastNotification({
        title: bcTitle,
        content: bcContent,
        channels: bcChannels,
        targetAudience: bcTarget,
      });
      if (res.success) {
        setBcMessage(res.message);
        setBcTitle('');
        setBcContent('');
      }
    } catch (err: any) {
      setBcMessage(`❌ ${err.message}`);
    } finally {
      setBcSubmitting(false);
    }
  };

  // Save Platform Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platformSettings) return;
    setSettingsSaving(true);
    setSettingsMessage(null);
    try {
      const res = await api.updateSettings(platformSettings);
      if (res.success) {
        setSettingsMessage('✅ تم حفظ إعدادات معهد الفراعنة بنجاح!');
      }
    } catch (err: any) {
      setSettingsMessage(`❌ ${err.message}`);
    } finally {
      setSettingsSaving(false);
    }
  };

  // Telegram Management Handlers
  const handleTestBotToken = async () => {
    setTelegramTesting(true);
    setTelegramActionMessage(null);
    try {
      const res = await api.testAdminTelegramBot(botTokenInput || undefined);
      if (res.success) {
        setTelegramActionMessage(res.message);
        const refreshed = await api.getAdminTelegramInfo();
        if (refreshed.success) setTelegramInfo(refreshed);
      }
    } catch (err: any) {
      setTelegramActionMessage(`❌ ${err.message}`);
    } finally {
      setTelegramTesting(false);
    }
  };

  const handleSetupWebhook = async () => {
    setWebhookSetting(true);
    setTelegramActionMessage(null);
    try {
      const res = await api.setupAdminTelegramWebhook();
      if (res.success) {
        setTelegramActionMessage(res.message);
        const refreshed = await api.getAdminTelegramInfo();
        if (refreshed.success) setTelegramInfo(refreshed);
      }
    } catch (err: any) {
      setTelegramActionMessage(`❌ ${err.message}`);
    } finally {
      setWebhookSetting(false);
    }
  };

  const handleDeleteWebhook = async () => {
    if (!confirm('هل تريد بالتأكيد إلغاء تسجيل الـ Webhook مع سيرفرات تيليجرام؟')) return;
    try {
      const res = await api.deleteAdminTelegramWebhook();
      setTelegramActionMessage(res.message);
      const refreshed = await api.getAdminTelegramInfo();
      if (refreshed.success) setTelegramInfo(refreshed);
    } catch (err: any) {
      setTelegramActionMessage(`❌ ${err.message}`);
    }
  };

  const handleSaveBotCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platformSettings) return;
    setSettingsSaving(true);
    setTelegramActionMessage(null);
    try {
      const updated = {
        ...platformSettings,
        telegramBotToken: botTokenInput.trim() || platformSettings.telegramBotToken,
        telegramBotUsername: botUsernameInput.trim().replace('@', ''),
      };
      const res = await api.updateSettings(updated);
      if (res.success) {
        setPlatformSettings(res.settings);
        setTelegramActionMessage('✅ تم حفظ بيانات توكن واسم البوت بنجاح!');
        const refreshed = await api.getAdminTelegramInfo();
        if (refreshed.success) setTelegramInfo(refreshed);
      }
    } catch (err: any) {
      setTelegramActionMessage(`❌ ${err.message}`);
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleCopyWebhookUrl = () => {
    if (telegramInfo?.suggestedWebhookUrl) {
      navigator.clipboard.writeText(telegramInfo.suggestedWebhookUrl);
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    }
  };

  const handleCopyAllStudentPhones = () => {
    if (!telegramInfo?.connections?.length) return;
    const phones = telegramInfo.connections
      .map((c: any) => c.studentPhone)
      .filter(Boolean)
      .join(', ');
    navigator.clipboard.writeText(phones);
    setCopiedAllPhones(true);
    setTimeout(() => setCopiedAllPhones(false), 2000);
  };

  const handleCopySinglePhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedStudentPhone(phone);
    setTimeout(() => setCopiedStudentPhone(null), 2000);
  };

  const handleExportPhonesCSV = () => {
    if (!telegramInfo?.connections?.length) return;
    const headers = 'اسم الطالب,رقم الهاتف,الشعبة,كود التفعيل,تاريخ التسجيل,معرف تيليجرام,الحالة\n';
    const rows = telegramInfo.connections
      .map((c: any) => `"${c.studentName || ''}","${c.studentPhone || ''}","${c.departmentName || ''}","${c.activationCode || ''}","${c.linkedAt || c.activatedAt || ''}","${c.telegramUsername || ''}","مسجل تلقائياً"`)
      .join('\n');
    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_bot_phones_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  لوحة الإدارة المركزية
                </span>
                <span className="text-xs text-slate-500 font-medium">معهد الفراعنة العالي</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-0.5">لوحة تحكم إدارة المنصة</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200">
              مدير النظام: المهندس كريم الشاذلي
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 mt-5 border-t border-slate-100">
          {[
            { id: 'overview', label: 'نظرة عامة والـ KPIs', icon: BarChart3 },
            { id: 'students', label: `الطلاب (${students.length})`, icon: Users },
            { id: 'codes', label: `أكواد التفعيل (${codes.length})`, icon: KeyRound },
            { id: 'content', label: 'المحاضرات وملفات Drive', icon: BookOpen },
            { id: 'broadcast', label: 'إرسال حملة إشعارات', icon: Megaphone },
            { id: 'telegram', label: `تيليجرام Bot (${telegramInfo?.linkedStudentsCount || 0})`, icon: Send },
            { id: 'settings', label: 'إعدادات المعهد والدفع', icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500">إجمالي طلاب المعهد</span>
              <div className="text-3xl font-black text-slate-900">{stats.totalStudents}</div>
              <span className="text-[11px] text-teal-700 block font-bold">{stats.activeStudents} طالب نشط</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500">بانتظار التفعيل</span>
              <div className="text-3xl font-black text-amber-600">{stats.pendingStudents}</div>
              <span className="text-[11px] text-slate-500 block">يحتاجون أكواد اشتراك</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500">أكواد التفعيل المتاحة</span>
              <div className="text-3xl font-black text-blue-600">{stats.availableCodesCount}</div>
              <span className="text-[11px] text-slate-500 block">{stats.usedCodesCount} كود مستخدم</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500">ربط تيليجرام</span>
              <div className="text-3xl font-black text-sky-600">{stats.telegramLinkedCount}</div>
              <span className="text-[11px] text-slate-500 block">{stats.webPushSubscribedCount} إشعارات ويب</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">إحصائيات المحتوى بمعهد الفراعنة</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">المعهد:</span>
                  <span className="text-slate-900 font-bold">معهد الفراعنة العالي</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">الشعب والأقسام:</span>
                  <span className="text-slate-900 font-bold">{stats.totalDepartments} شعبات دراسية</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">المواد الدراسية:</span>
                  <span className="text-slate-900 font-bold">{stats.totalSubjects} مواد</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">إجمالي المحاضرات:</span>
                  <span className="text-blue-700 font-bold">{stats.totalLectures} محاضرة</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">حالة محرك الإشعارات التلقائية</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">الإشعارات المرسلة للطلاب:</span>
                  <span className="text-emerald-700 font-bold">{stats.sentNotificationsCount} إشعار</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">الإشعارات الفاشلة:</span>
                  <span className="text-slate-500 font-bold">{stats.failedNotificationsCount}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">بوت تيليجرام:</span>
                  <span className="text-sky-700 font-bold">نشط وجاهز للربط</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">Web Push VAPID:</span>
                  <span className="text-teal-700 font-bold">مضبوط في البيئة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. STUDENTS MANAGEMENT TAB */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="ابحث بالاسم أو رقم الهاتف..."
                className="w-full bg-white border border-slate-300 rounded-xl pr-10 pl-3 py-2 text-xs text-slate-900 outline-none focus:border-purple-600"
              />
            </div>

            <select
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
              className="bg-white border border-slate-300 text-slate-700 rounded-xl px-3 py-2 text-xs outline-none"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">مفعّل (Active)</option>
              <option value="pending_activation">بانتظار التفعيل</option>
              <option value="expired">منتهي الصلاحية</option>
              <option value="suspended">موقوف (Suspended)</option>
            </select>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">اسم الطالب</th>
                    <th className="p-3.5">رقم الهاتف</th>
                    <th className="p-3.5">الشعبة والفرقة</th>
                    <th className="p-3.5">تيليجرام</th>
                    <th className="p-3.5">حالة الحساب</th>
                    <th className="p-3.5">إجراءات الإدارة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {students
                    .filter((s) =>
                      studentFilter === 'all' ? true : s.status === studentFilter
                    )
                    .filter((s) =>
                      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
                      s.phone.includes(studentSearch)
                    )
                    .map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/80">
                        <td className="p-3.5 font-bold text-slate-900">{st.fullName}</td>
                        <td className="p-3.5 font-mono text-slate-600" dir="ltr">{st.phone}</td>
                        <td className="p-3.5 text-slate-600">
                          {st.academicYearName} · {st.departmentName}
                        </td>
                        <td className="p-3.5">
                          {st.telegramLinked ? (
                            <span className="text-sky-700 font-bold">@{st.telegramUsername || 'مرتبط'}</span>
                          ) : (
                            <span className="text-slate-400">غير مرتبط</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                            st.status === 'active' ? 'bg-teal-100 text-teal-800' :
                            st.status === 'pending_activation' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {st.status === 'active' ? 'مفعّل' : st.status === 'pending_activation' ? 'معلق' : st.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={st.status}
                            onChange={(e) => handleUpdateStudentStatus(st.id, e.target.value)}
                            className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-[11px] text-slate-800 outline-none"
                          >
                            <option value="active">تفعيل فوري</option>
                            <option value="pending_activation">تعليق (Pending)</option>
                            <option value="expired">إنهاء الاشتراك</option>
                            <option value="suspended">حظر الحساب</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ACTIVATION CODES TAB */}
      {activeTab === 'codes' && (
        <div className="space-y-6">
          {/* Generation form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-700" />
              <span>توليد أكواد تفعيل جديدة لمعهد الفراعنة (Bulk Code Generator)</span>
            </h3>

            {codeMessage && (
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 font-semibold">
                {codeMessage}
              </div>
            )}

            <form onSubmit={handleGenerateCodes} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">بادئة الكود (Prefix)</label>
                <input
                  type="text"
                  value={codePrefix}
                  onChange={(e) => setCodePrefix(e.target.value.toUpperCase())}
                  placeholder="PHARAOHS"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono uppercase outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">العدد المطلوب</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={codeCount}
                  onChange={(e) => setCodeCount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">مدة الاشتراك (بالأيام)</label>
                <select
                  value={codeDuration}
                  onChange={(e) => setCodeDuration(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                >
                  <option value={120}>فصل دراسي (120 يوم)</option>
                  <option value={300}>سنة كاملة (300 يوم)</option>
                  <option value={30}>شهر واحد (30 يوم)</option>
                  <option value={0}>تفعيل دائم (Permanent)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={codeGenerating}
                  className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>{codeGenerating ? 'جاري التوليد...' : 'توليد الأكواد فوراً'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Codes List & Export */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">سجل أكواد التفعيل</h3>
              <button
                onClick={handleExportCodesCSV}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-purple-700" />
                <span>تصدير CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">الكود</th>
                    <th className="p-3">الباقة والمدة</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">المستخدم</th>
                    <th className="p-3">تاريخ الاستخدام</th>
                    <th className="p-3">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
                  {codes.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-bold text-purple-800">{c.code}</td>
                      <td className="p-3 font-sans text-slate-600">
                        {c.durationDays === 0 ? 'دائم' : `${c.durationDays} يوم`}
                      </td>
                      <td className="p-3 font-sans">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          c.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                          c.status === 'used' ? 'bg-slate-100 text-slate-500' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {c.status === 'available' ? 'متاح' : c.status === 'used' ? 'مستخدم' : c.status}
                        </span>
                      </td>
                      <td className="p-3 font-sans text-slate-600">{c.usedByName || '-'}</td>
                      <td className="p-3 font-sans text-slate-400">
                        {c.usedAt ? new Date(c.usedAt).toLocaleDateString('ar-EG') : '-'}
                      </td>
                      <td className="p-3 font-sans">
                        {c.status !== 'used' && (
                          <button
                            onClick={() => handleToggleCodeDisable(c.id)}
                            className="text-[11px] text-amber-700 hover:underline cursor-pointer"
                          >
                            {c.status === 'disabled' ? 'تفعيل' : 'تعطيل'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONTENT MANAGEMENT (Lectures & Google Drive links) */}
      {activeTab === 'content' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-700" />
              <span>نشر محاضرة جديدة مع موارد Google Drive</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              يتم حفظ المحاضرة وإرسال إشعار تلقائي للطلاب المسجلين بمعهد الفراعنة عبر تيليجرام وWeb Push فوراً.
            </p>
          </div>

          {lecMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
              {lecMessage}
            </div>
          )}

          <form onSubmit={handleCreateLecture} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">المادة الدراسية</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2.5 text-xs outline-none"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">رقم المحاضرة</label>
                <input
                  type="number"
                  min="1"
                  value={lecNumber}
                  onChange={(e) => setLecNumber(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">عنوان المحاضرة</label>
                <input
                  type="text"
                  value={lecTitle}
                  onChange={(e) => setLecTitle(e.target.value)}
                  placeholder="مثال: مفاهيم تحليل وتصميم النظم المتقدمة"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الوصف أو محاور المحاضرة</label>
              <textarea
                value={lecDesc}
                onChange={(e) => setLecDesc(e.target.value)}
                placeholder="أبرز النقاط المشروحة وتوجيهات أستاذ المادة..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
              />
            </div>

            {/* Google Drive Resource Input */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 block">
                إضافة ملف Google Drive للمحاضرة:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">عنوان الملف</label>
                  <input
                    type="text"
                    value={resTitle}
                    onChange={(e) => setResTitle(e.target.value)}
                    placeholder="سلايدات الشرح الرسمية (PDF)"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">نوع المورد</label>
                  <select
                    value={resType}
                    onChange={(e) => setResType(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-xs outline-none"
                  >
                    <option value="pdf">مستند / PDF</option>
                    <option value="audio">تسجيل صوتي</option>
                    <option value="video">فيديو المحاضرة</option>
                    <option value="summary">ملخص وأسئلة</option>
                    <option value="assignment">تكليف / واجب</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">رابط Google Drive</label>
                  <input
                    type="url"
                    value={resDriveUrl}
                    onChange={(e) => setResDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    dir="ltr"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={lecSubmitting}
                className="px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-xs"
              >
                <span>{lecSubmitting ? 'جاري النشر...' : 'نشر المحاضرة وتوزيع الإشعارات'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. BROADCAST CAMPAIGN TAB */}
      {activeTab === 'broadcast' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-purple-700" />
              <span>إرسال حملة إشعار شاملة لطلاب معهد الفراعنة</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              إرسال رسالة فورية عبر قنوات متعددة (تيليجرام، إشعارات المتصفح، ولوحة الإعلانات).
            </p>
          </div>

          {bcMessage && (
            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 font-semibold">
              {bcMessage}
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">عنوان الإشعار</label>
              <input
                type="text"
                value={bcTitle}
                onChange={(e) => setBcTitle(e.target.value)}
                placeholder="مثال: تنبيه هام بشأن جدول امتحانات الأسبوع القادم"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">نص الرسالة</label>
              <textarea
                value={bcContent}
                onChange={(e) => setBcContent(e.target.value)}
                placeholder="اكتب التنبيه المفصل..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none leading-relaxed"
              />
            </div>

            {/* Channels checkboxes */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">قنوات الإرسال المستهدفة:</span>
              <div className="flex flex-wrap gap-4 text-xs text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bcChannels.includes('in_app')}
                    onChange={(e) => {
                      if (e.target.checked) setBcChannels([...bcChannels, 'in_app']);
                      else setBcChannels(bcChannels.filter((c) => c !== 'in_app'));
                    }}
                    className="rounded text-purple-600 bg-white border-slate-300"
                  />
                  <span>مركز الإشعارات داخل المنصة</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bcChannels.includes('telegram')}
                    onChange={(e) => {
                      if (e.target.checked) setBcChannels([...bcChannels, 'telegram']);
                      else setBcChannels(bcChannels.filter((c) => c !== 'telegram'));
                    }}
                    className="rounded text-purple-600 bg-white border-slate-300"
                  />
                  <span>بوت تيليجرام (Telegram Bot)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bcChannels.includes('webpush')}
                    onChange={(e) => {
                      if (e.target.checked) setBcChannels([...bcChannels, 'webpush']);
                      else setBcChannels(bcChannels.filter((c) => c !== 'webpush'));
                    }}
                    className="rounded text-purple-600 bg-white border-slate-300"
                  />
                  <span>إشعارات المتصفح (Web Push)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={bcSubmitting}
                className="px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-xs"
              >
                <span>{bcSubmitting ? 'جاري الإرسال...' : 'إرسال الحملة لجميع الطلاب'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. TELEGRAM BOT MANAGEMENT & COORDINATION TAB */}
      {activeTab === 'telegram' && (
        <div className="space-y-6">
          {/* Banner & Intro */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wide">
                    إدارة البوت والـ Webhook · معهد الفراعنة العالي
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    تنسيق وربط بوت تيليجرام (Telegram Bot Coordination)
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestBotToken}
                  disabled={telegramTesting}
                  className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${telegramTesting ? 'animate-spin' : ''}`} />
                  <span>{telegramTesting ? 'جاري الفحص...' : 'فحص حالة البوت'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              تحكم كامل في ربط بوت تيليجرام الخاص بك، تفعيل الـ Webhook، ومتابعة الطلاب المشتركين لتصلهم تنبيهات المحاضرات وملفات Google Drive والإعلانات لحظة بلحظة.
            </p>
          </div>

          {telegramActionMessage && (
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs font-bold text-sky-900 flex items-center justify-between">
              <span>{telegramActionMessage}</span>
              <button
                onClick={() => setTelegramActionMessage(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>اسم البوت المسجل</span>
                <Bot className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-lg font-black text-slate-900 font-mono" dir="ltr">
                @{telegramInfo?.username || 'SmartCampusEgyptBot'}
              </p>
              <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
                telegramInfo?.hasToken ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {telegramInfo?.hasToken ? '✅ توكن البوت مدخل ومحفوظ' : '⚠️ بانتظار إدخال توكن البوت'}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>حالة الـ Webhook مع تيليجرام</span>
                <Globe className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-sm font-bold text-slate-900 truncate" dir="ltr">
                {telegramInfo?.webhookDetails?.url ? 'Webhook مسجل بنجاح' : 'غير مسجل تلقائياً'}
              </p>
              <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
                telegramInfo?.webhookDetails?.url ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {telegramInfo?.webhookDetails?.url ? 'متصل ومفعل' : 'يمكن التفعيل بنقرة زر'}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>أرقام الطلاب المسجلة بالبوت</span>
                <Phone className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono">
                {telegramInfo?.connections?.filter((c: any) => c.studentPhone)?.length || 0}
              </p>
              <span className="text-[11px] text-emerald-700 font-bold">
                تسجيل تلقائي فور إدخال كود التفعيل ✅
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>الربط والتسليم الآلي</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono">
                {telegramInfo?.linkedStudentsCount || 0}
              </p>
              <span className="text-[11px] text-slate-500 font-medium">
                تصلهم تنبيهات المحاضرات والملفات فوراً
              </span>
            </div>
          </div>

          {/* Bot Credentials & Webhook Setup Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Credentials Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xs">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Key className="w-5 h-5 text-sky-600" />
                  <span>بيانات اعتماد البوت (Bot Credentials)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  أدخل رمز التوكن (Token) الذي حصلت عليه من @BotFather واسم المستخدم.
                </p>
              </div>

              <form onSubmit={handleSaveBotCredentials} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    توكن البوت (TELEGRAM_BOT_TOKEN)
                  </label>
                  <input
                    type="password"
                    placeholder="مثال: 7123456789:AAHkYj_xxxxxxxxxxxxxx"
                    value={botTokenInput}
                    onChange={(e) => setBotTokenInput(e.target.value)}
                    dir="ltr"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono outline-none focus:border-sky-500"
                  />
                  {telegramInfo?.tokenMasked && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      التوكن الحالي المحفوظ: <span className="font-mono text-slate-700">{telegramInfo.tokenMasked}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    معرف البوت (TELEGRAM_BOT_USERNAME)
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs" dir="ltr">
                    <span className="text-slate-400 font-mono font-bold mr-1">@</span>
                    <input
                      type="text"
                      placeholder="MyPharaohsBot"
                      value={botUsernameInput}
                      onChange={(e) => setBotUsernameInput(e.target.value)}
                      className="w-full bg-transparent text-slate-900 font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={settingsSaving}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <span>{settingsSaving ? 'جاري الحفظ...' : 'حفظ بيانات البوت'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTestBotToken}
                    disabled={telegramTesting}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
                  >
                    <span>{telegramTesting ? 'جاري الفحص...' : 'فحص التوكن'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Webhook Manager Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xs">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span>تفعيل الـ Webhook التلقائي مع تيليجرام</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  الـ Webhook هو الرابط الذي ترسل تيليجرام إليه التحديثات فور ضغط الطالب على Start.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    رابط الـ Webhook في المنصة
                  </label>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono text-slate-800" dir="ltr">
                    <span className="truncate flex-1 font-semibold text-[11px]">
                      {telegramInfo?.suggestedWebhookUrl || 'https://.../api/telegram/webhook'}
                    </span>
                    <button
                      onClick={handleCopyWebhookUrl}
                      className="p-1 rounded text-slate-500 hover:text-slate-900 cursor-pointer"
                      title="نسخ الرابط"
                    >
                      {copiedWebhook ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs space-y-1">
                  <p className="font-bold">حالة الـ Webhook الحالية:</p>
                  <p className="font-mono text-[11px]" dir="ltr">
                    {telegramInfo?.webhookDetails?.url || 'لا يوجد Webhook مسجل حالياً لدى تيليجرام'}
                  </p>
                  {telegramInfo?.webhookDetails?.pending_update_count !== undefined && (
                    <p className="text-[11px] text-amber-800">
                      التحديثات المعلقة: {telegramInfo.webhookDetails.pending_update_count}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSetupWebhook}
                    disabled={webhookSetting}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{webhookSetting ? 'جاري التفعيل...' : 'تفعيل الـ Webhook تلقائياً (1-Click)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteWebhook}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold text-xs transition cursor-pointer"
                    title="حذف الـ Webhook"
                  >
                    <span>إلغاء</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Complete Coordination Guide */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-sky-600" />
                <span>دليل التنسيق وربط البوت خطوة بخطوة (Full Setup Guide)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                اتبع هذه الخطوات البسيطة لإنشاء بوت تيليجرام الخاص بك وربطه بالكامل مع منصة معهد الفراعنة:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-sky-600 text-white font-black flex items-center justify-center text-xs">
                  1
                </div>
                <h4 className="font-bold text-slate-900 text-sm">إنشاء البوت عبر BotFather</h4>
                <p className="text-slate-600 leading-relaxed">
                  افتح تطبيق تيليجرام وابحث عن <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-sky-700 font-bold">@BotFather</code> واضغط <strong>Start</strong>.
                </p>
                <p className="text-slate-600">
                  أرسل الأمر <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono font-bold text-slate-800">/newbot</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-sky-600 text-white font-black flex items-center justify-center text-xs">
                  2
                </div>
                <h4 className="font-bold text-slate-900 text-sm">تسمية البوت واختيار المعرف</h4>
                <p className="text-slate-600 leading-relaxed">
                  اكتب اسم البوت، مثلاً: <span className="font-bold text-slate-800">معهد الفراعنة - الحرم الذكي</span>.
                </p>
                <p className="text-slate-600">
                  ثم اكتب معرفاً ينتهي بـ <code>bot</code>، مثلاً: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono font-bold text-sky-700">PharaohsCampusBot</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-sky-600 text-white font-black flex items-center justify-center text-xs">
                  3
                </div>
                <h4 className="font-bold text-slate-900 text-sm">نسخ الـ Token ولصقه</h4>
                <p className="text-slate-600 leading-relaxed">
                  سيرسل لك BotFather رسالة تحتوي على التوكن بالصيغة:
                  <code className="block bg-white p-1.5 my-1 rounded border border-slate-200 font-mono text-[11px] text-slate-700 break-all" dir="ltr">
                    7123456789:AAHkYj_xxxxxxxxxxxxxx
                  </code>
                  انسخه والصقه في حقل توكن البوت أعلاه واضغط <strong>حفظ</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-sky-600 text-white font-black flex items-center justify-center text-xs">
                  4
                </div>
                <h4 className="font-bold text-slate-900 text-sm">تفعيل الـ Webhook</h4>
                <p className="text-slate-600 leading-relaxed">
                  اضغط على زر <strong>تفعيل الـ Webhook تلقائياً</strong> أعلاه. سيقوم النظام بربط رابط المنصة بسيرفرات تيليجرام فورياً.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-sky-600 text-white font-black flex items-center justify-center text-xs">
                  5
                </div>
                <h4 className="font-bold text-slate-900 text-sm">كيف يربط الطالب حسابه؟</h4>
                <p className="text-slate-600 leading-relaxed">
                  يدخل الطالب على صفحته ويختار <strong>تيليجرام</strong> ثم يضغط <strong>توليد رابط الربط</strong>. يفتح البوت ويضغط <strong>Start</strong> فيتم الربط الآمن فورياً دون أي كلمات مرور!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-sky-600 text-white font-black flex items-center justify-center text-xs">
                  6
                </div>
                <h4 className="font-bold text-slate-900 text-sm">التنسيق والإرسال التلقائي</h4>
                <p className="text-slate-600 leading-relaxed">
                  بمجرد إضافة أي محاضرة جديدة بملفات Drive أو نشر إعلان أو إرسال حملة بث من لوحة الإدارة، يرسل السيرفر الإشعار لكل طالب مربوط تلقائياً.
                </p>
              </div>
            </div>
          </div>

          {/* Auto-Registered Student Phone Numbers in Bot Table */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-sky-600" />
                    <span>سجل أرقام الطلاب المسجلين بالبوت تلقائياً ({telegramInfo?.connections?.length || 0})</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    تسجيل تلقائي عند تفعيل الاشتراك ✅
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  يتم حفظ وتوثيق رقم هاتف كل طالب في البوت آلياً بمجرد إدخال كود التفعيل، وتصلهم المحاضرات والتنبيهات فوراً.
                </p>
              </div>

              {/* Action buttons: Copy all numbers & Export CSV */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAllStudentPhones}
                  className="px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  title="نسخ جميع أرقام هواتف الطلاب المسجلين لإرسال رسائل جماعية"
                >
                  {copiedAllPhones ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedAllPhones ? 'تم نسخ جميع الأرقام!' : 'نسخ جميع أرقام المشتركين'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportPhonesCSV}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  title="تصدير كملف Excel / CSV"
                >
                  <Download className="w-4 h-4" />
                  <span>تصدير CSV</span>
                </button>
              </div>
            </div>

            {/* Search Filter for Student Phones */}
            <div className="flex items-center gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو رقم الهاتف أو كود التفعيل..."
                  value={tgPhoneSearch}
                  onChange={(e) => setTgPhoneSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pr-9 pl-3 py-2 text-xs outline-none focus:border-sky-500 text-slate-800"
                />
              </div>
              {tgPhoneSearch && (
                <button
                  type="button"
                  onClick={() => setTgPhoneSearch('')}
                  className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
                >
                  مسح
                </button>
              )}
            </div>

            {telegramInfo?.connections && telegramInfo.connections.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                      <th className="py-2.5 px-3">اسم الطالب</th>
                      <th className="py-2.5 px-3">رقم الهاتف المسجل</th>
                      <th className="py-2.5 px-3">الشعبة والفرقة</th>
                      <th className="py-2.5 px-3">كود التفعيل</th>
                      <th className="py-2.5 px-3">تاريخ التسجيل والتفعيل</th>
                      <th className="py-2.5 px-3">حالة البوت</th>
                      <th className="py-2.5 px-3">معرف تيليجرام</th>
                      <th className="py-2.5 px-3 text-center">إجراءات التواصل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {telegramInfo.connections
                      .filter((c: any) => {
                        if (!tgPhoneSearch.trim()) return true;
                        const q = tgPhoneSearch.toLowerCase().trim();
                        return (
                          (c.studentName && c.studentName.toLowerCase().includes(q)) ||
                          (c.studentPhone && c.studentPhone.includes(q)) ||
                          (c.activationCode && c.activationCode.toLowerCase().includes(q)) ||
                          (c.telegramUsername && c.telegramUsername.toLowerCase().includes(q))
                        );
                      })
                      .map((c: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{c.studentName}</div>
                            <span className="text-[10px] text-slate-400 font-mono">{c.studentId}</span>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">
                            <div className="flex items-center gap-1.5" dir="ltr">
                              <span>{c.studentPhone || 'غير مدخل'}</span>
                              {c.studentPhone && (
                                <button
                                  type="button"
                                  onClick={() => handleCopySinglePhone(c.studentPhone)}
                                  className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
                                  title="نسخ الرقم"
                                >
                                  {copiedStudentPhone === c.studentPhone ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            <div>{c.departmentName || 'نظم معلومات إدارية'}</div>
                            <span className="text-[10px] text-slate-400">{c.academicYearName || 'الفرقة الثالثة'}</span>
                          </td>
                          <td className="py-3 px-3">
                            {c.activationCode ? (
                              <span className="font-mono bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-bold">
                                {c.activationCode}
                              </span>
                            ) : (
                              <span className="text-slate-400">تفعيل مباشر</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                            {c.activatedAt || c.linkedAt ? (
                              new Date(c.activatedAt || c.linkedAt).toLocaleDateString('ar-EG', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            ) : (
                              'حديثاً'
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1 whitespace-nowrap">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>مسجل تلقائياً ومفعّل</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-sky-700 font-bold whitespace-nowrap" dir="ltr">
                            {c.telegramUsername ? `@${c.telegramUsername}` : (
                              <span className="text-slate-400 font-normal text-[11px]">في انتظار Start</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {c.studentPhone && (
                                <>
                                  <a
                                    href={`https://wa.me/20${c.studentPhone.replace(/^0+/, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                                    title="مراسلة عبر واتساب"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </a>
                                  <a
                                    href={`tel:${c.studentPhone}`}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                                    title="اتصال هاتفي"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                </>
                              )}
                              {c.telegramUsername && (
                                <a
                                  href={`https://t.me/${c.telegramUsername}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 transition"
                                  title="فتح في تيليجرام"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                لا يوجد طلاب مسجلين بالبوت حتى الآن. بمجرد تفعيل أي طالب لاشتراكه باستخدام كود تفعيل، سيظهر رقمه وبياناته هنا تلقائياً!
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. PLATFORM SETTINGS TAB (Branding, Pricing, Payments) */}
      {activeTab === 'settings' && platformSettings && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-purple-700" />
              <span>تخصيص هوية معهد الفراعنة وطرق الدفع والأسعار</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              جميع الإعدادات يتم تطبيقها فورياً على جميع صفحات الطلاب.
            </p>
          </div>

          {settingsMessage && (
            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 font-semibold">
              {settingsMessage}
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">اسم المنصة</label>
                <input
                  type="text"
                  value={platformSettings.campusName}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, campusName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">رقم فودافون كاش للاشتراك</label>
                <input
                  type="text"
                  value={platformSettings.paymentMethods.vodafoneCash.number}
                  onChange={(e) =>
                    setPlatformSettings({
                      ...platformSettings,
                      paymentMethods: {
                        ...platformSettings.paymentMethods,
                        vodafoneCash: {
                          ...platformSettings.paymentMethods.vodafoneCash,
                          number: e.target.value,
                        },
                      },
                    })
                  }
                  dir="ltr"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">معرف انستا باي (InstaPay)</label>
                <input
                  type="text"
                  value={platformSettings.paymentMethods.instaPay.username}
                  onChange={(e) =>
                    setPlatformSettings({
                      ...platformSettings,
                      paymentMethods: {
                        ...platformSettings.paymentMethods,
                        instaPay: {
                          ...platformSettings.paymentMethods.instaPay,
                          username: e.target.value,
                        },
                      },
                    })
                  }
                  dir="ltr"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">سعر اشتراك الترم (ج.م)</label>
                <input
                  type="number"
                  value={platformSettings.subscriptionPricePerTerm}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, subscriptionPricePerTerm: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={settingsSaving}
                className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition cursor-pointer shadow-xs"
              >
                <span>{settingsSaving ? 'جاري الحفظ...' : 'حفظ إعدادات المنصة'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
