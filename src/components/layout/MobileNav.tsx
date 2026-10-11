import React from 'react';
import { Home, BookOpen, Calendar, Megaphone, User, KeyRound, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, unreadCount = 0 }) => {
  const { isActivated, isAdmin } = useAuth();

  const navItems = [
    ...(isAdmin
      ? [{ id: 'admin', label: 'لوحة الإدارة', icon: Shield, highlight: true }]
      : []),
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'subjects', label: 'المواد', icon: BookOpen },
    { id: 'schedule', label: 'المواعيد', icon: Calendar },
    { id: 'announcements', label: 'الإعلانات', icon: Megaphone },
    ...(!isActivated && !isAdmin
      ? [{ id: 'activate', label: 'التفعيل', icon: KeyRound, highlight: true }]
      : !isAdmin
      ? [{ id: 'settings', label: 'حسابي', icon: User }]
      : []),
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 shadow-lg safe-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isHighlight = item.highlight;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer relative ${
                isActive
                  ? item.id === 'admin'
                    ? 'text-purple-700 font-black'
                    : 'text-blue-600 font-black'
                  : isHighlight
                  ? item.id === 'admin'
                    ? 'text-purple-600 font-bold'
                    : 'text-amber-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.id === 'announcements' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                )}
              </div>
              <span className="text-[11px] mt-1 leading-none">{item.label}</span>
              {isActive && (
                <span className={`w-1 h-1 rounded-full mt-1 ${item.id === 'admin' ? 'bg-purple-700' : 'bg-blue-600'}`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
