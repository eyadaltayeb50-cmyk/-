import React from 'react';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Megaphone, 
  Send, 
  KeyRound, 
  Settings, 
  Shield, 
  LogOut, 
  Layers,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  X,
  GraduationCap,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  highlight?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { user, isActivated, isAdmin, logout } = useAuth();

  const studentSections: NavSection[] = [
    {
      title: 'بوابة الطالب',
      items: [
        { id: 'home', label: 'الرئيسية', icon: Home },
        { id: 'subjects', label: 'المواد والمحاضرات', icon: BookOpen },
        { id: 'schedule', label: 'المواعيد والتقويم', icon: Calendar },
        { id: 'announcements', label: 'لوحة الإعلانات', icon: Megaphone },
        { id: 'onboarding', label: 'اختيار المواد والدكاترة', icon: Layers },
      ],
    },
    {
      title: 'التكامل والاشتراك',
      items: [
        { id: 'activate', label: 'تفعيل الاشتراك', icon: KeyRound, badge: !isActivated && !isAdmin ? 'مطلوب' : undefined },
        { id: 'telegram', label: 'بوت تيليجرام', icon: Send, highlight: user?.telegramLinked ? 'متصل' : 'غير متصل' },
        { id: 'settings', label: 'الملف والإشعارات', icon: Settings },
      ],
    },
  ];

  const adminSections: NavSection[] = [
    {
      title: 'إدارة المنصة المركزية',
      items: [
        { id: 'admin', label: 'لوحة التحكم الإدارية', icon: Shield, badge: 'رئيسي' },
      ],
    },
    {
      title: 'معاينة تجربة الطالب',
      items: [
        { id: 'home', label: 'الرئيسية (طالب)', icon: Home },
        { id: 'subjects', label: 'المواد والمحاضرات', icon: BookOpen },
        { id: 'schedule', label: 'المواعيد والتقويم', icon: Calendar },
        { id: 'announcements', label: 'الإعلانات', icon: Megaphone },
        { id: 'telegram', label: 'إعدادات تيليجرام', icon: Send },
      ],
    },
  ];

  const menuSections = isAdmin ? adminSections : studentSections;

  const content = (
    <div className="h-full flex flex-col justify-between p-4 bg-white border-l border-slate-200 text-right select-none">
      <div>
        {/* Mobile header close button */}
        {onCloseMobile && (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 md:hidden">
            <span className="text-sm font-bold text-slate-800">قائمة المنصة</span>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* User Card - Distinct for Admin vs Student */}
        {user && (
          <div className={`mb-6 p-4 rounded-2xl border transition ${
            isAdmin
              ? 'bg-gradient-to-br from-purple-50 via-indigo-50 to-white border-purple-200 shadow-xs'
              : 'bg-gradient-to-br from-slate-50 to-blue-50/40 border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
                isAdmin
                  ? 'bg-purple-700 text-white'
                  : 'bg-blue-600 text-white'
              }`}>
                {isAdmin ? <Shield className="w-5 h-5" /> : (user.fullName ? user.fullName[0] : 'ط')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {isAdmin ? 'المهندس كريم الشاذلي' : user.fullName}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {isAdmin
                    ? 'مدير عام المنصة · معهد الفراعنة'
                    : `${user.academicYearName || 'الفرقة الثالثة'} · ${user.departmentName || 'نظم معلومات'}`}
                </p>
              </div>
            </div>

            {/* Status indicator bar */}
            <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {isAdmin ? 'الدور والصلاحيات:' : 'حالة الحساب:'}
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded-md ${
                  isAdmin
                    ? 'bg-purple-100 text-purple-800'
                    : isActivated
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isAdmin ? 'مدير نظام (Super Admin)' : isActivated ? 'مفعّل ونشط' : 'بانتظار التفعيل'}
              </span>
            </div>

            {/* Quick Admin Portal Button if Admin */}
            {isAdmin && activeTab !== 'admin' && (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  if (onCloseMobile) onCloseMobile();
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>فتح لوحة تحكم الإدارة</span>
              </button>
            )}
          </div>
        )}

        {/* Navigation Sections */}
        <div className="space-y-6">
          {menuSections.map((sec, idx) => (
            <div key={idx}>
              <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
                {sec.title}
              </h5>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        isActive
                          ? item.id === 'admin'
                            ? 'bg-purple-600 text-white font-bold shadow-xs'
                            : 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${
                          isActive
                            ? item.id === 'admin' ? 'text-white' : 'text-blue-600'
                            : 'text-slate-500'
                        }`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive && item.id === 'admin'
                            ? 'bg-white/20 text-white'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}

                      {item.highlight && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            item.highlight === 'متصل'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {item.highlight}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer support & logout */}
      <div className="pt-4 border-t border-slate-200 space-y-2">
        <a
          href="https://wa.me/201012345678"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
        >
          <span>دعم معهد الفراعنة عبر واتساب</span>
          <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
        </a>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto bg-white">
        {content}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
