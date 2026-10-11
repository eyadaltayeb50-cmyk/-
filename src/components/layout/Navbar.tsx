import React, { useState } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  UserX, 
  ShieldCheck, 
  Menu, 
  ChevronDown,
  GraduationCap,
  Shield,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { NotificationItem } from '../../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
  unreadCount?: number;
  notifications?: NotificationItem[];
  onOpenNotifications?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  unreadCount = 0,
  onOpenNotifications,
  activeTab,
  setActiveTab,
}) => {
  const { user, isActivated, isAdmin, switchDemo } = useAuth();
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const handleSwitchRole = (role: 'active' | 'pending' | 'admin') => {
    switchDemo(role);
    setShowDemoMenu(false);
    if (role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('home');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Right side: Brand & Mobile Sidebar trigger */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              aria-label="القائمة"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div 
            onClick={() => setActiveTab(isAdmin ? 'admin' : 'home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 p-0.5 shadow-sm group-hover:scale-105 transition">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-700" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900 tracking-tight">Smart Campus</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200/60">
                  معهد الفراعنة العالي
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-[240px] font-medium">
                {isAdmin ? 'بوابة الإدارة المركزية والتحكم' : (user?.departmentName || 'شعبة نظم معلومات إدارية')}
              </p>
            </div>
          </div>
        </div>

        {/* Center/Left: Actions */}
        <div className="flex items-center gap-2.5">

          {/* Quick Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs text-slate-700 border border-slate-200 transition font-medium cursor-pointer"
              title="تبديل وضع العرض"
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-purple-900">مدير النظام (Admin)</span>
                </>
              ) : isActivated ? (
                <>
                  <UserCheck className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold text-slate-700 hidden sm:inline">طالب مفعّل</span>
                </>
              ) : (
                <>
                  <UserX className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-slate-700 hidden sm:inline">طالب غير مفعّل</span>
                </>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showDemoMenu && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-right animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500">اختر صلاحية الحساب للاختبار:</span>
                </div>
                <div className="py-1 space-y-1">
                  <button
                    onClick={() => handleSwitchRole('admin')}
                    className={`w-full text-right px-3 py-2.5 text-xs rounded-xl flex items-center justify-between transition cursor-pointer ${
                      isAdmin ? 'bg-purple-50 text-purple-900 font-bold border border-purple-200' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span>مدير النظام (Super Admin)</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">لوحة الإدارة</span>
                  </button>

                  <button
                    onClick={() => handleSwitchRole('active')}
                    className={`w-full text-right px-3 py-2.5 text-xs rounded-xl flex items-center justify-between transition cursor-pointer ${
                      user?.status === 'active' && !isAdmin ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-teal-600" />
                      <span>طالب مفعّل (أحمد إبراهيم)</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">كامل المحتوى</span>
                  </button>

                  <button
                    onClick={() => handleSwitchRole('pending')}
                    className={`w-full text-right px-3 py-2.5 text-xs rounded-xl flex items-center justify-between transition cursor-pointer ${
                      user?.status === 'pending_activation' && !isAdmin ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserX className="w-4 h-4 text-amber-600" />
                      <span>طالب جديد (غير مفعّل)</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">شاشة الكود</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* If user is Admin, direct Admin Button in navbar */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>لوحة الإدارة</span>
            </button>
          )}

          {/* PWA Install Button */}
          <PWAInstallButton compact />

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                if (onOpenNotifications) {
                  onOpenNotifications();
                } else {
                  setActiveTab('notifications');
                }
              }}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              title="الإشعارات"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* User Status Badge (If student) */}
          {!isAdmin && user && (
            <div 
              onClick={() => !isActivated && setActiveTab('activate')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                isActivated
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              {isActivated ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>اشتراك نشط</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>تفعيل الحساب</span>
                </>
              )}
            </div>
          )}

          {/* User Avatar */}
          <div 
            onClick={() => setActiveTab(isAdmin ? 'admin' : 'settings')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs cursor-pointer transition border ${
              isAdmin
                ? 'bg-purple-100 border-purple-300 text-purple-800'
                : 'bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-400'
            }`}
            title={isAdmin ? 'إدارة المنصة' : 'الملف الشخصي'}
          >
            {isAdmin ? 'مدير' : (user?.fullName ? user.fullName[0] : 'ط')}
          </div>

        </div>

      </div>
    </header>
  );
};
