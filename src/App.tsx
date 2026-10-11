/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

// Pages
import { HomePage } from './pages/HomePage';
import { SubjectsPage } from './pages/SubjectsPage';
import { SchedulePage } from './pages/SchedulePage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ActivatePage } from './pages/ActivatePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { TelegramPage } from './pages/TelegramPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AuthPage } from './pages/AuthPage';
import { api } from './services/api';

function MainApp() {
  const { user, isActivated, isAdmin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // If initial user is Admin, switch tab to admin
  useEffect(() => {
    if (user && isAdmin && activeTab === 'home') {
      setActiveTab('admin');
    }
  }, [user?.role, isAdmin]);

  // Register PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration note:', err);
      });
    }
  }, []);

  // Periodically fetch notifications count
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.getNotifications();
        if (res.success) {
          setUnreadCount(res.unreadCount);
        }
      } catch (e) {
        // quiet
      }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-700">جاري تحميل منصة معهد الفراعنة العالي...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white">
      <OfflineIndicator />

      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        unreadCount={unreadCount}
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onOpenNotifications={() => handleNavigate('notifications')}
      />

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12 min-w-0">
          {showAuthModal ? (
            <AuthPage onSuccess={() => setShowAuthModal(false)} />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomePage onNavigateTab={handleNavigate} />
              )}

              {activeTab === 'subjects' && (
                <SubjectsPage
                  onGoToActivate={() => handleNavigate('activate')}
                  onGoToOnboarding={() => handleNavigate('onboarding')}
                />
              )}

              {activeTab === 'schedule' && <SchedulePage />}

              {activeTab === 'announcements' && <AnnouncementsPage />}

              {activeTab === 'notifications' && (
                <NotificationsPage onNavigateTab={handleNavigate} />
              )}

              {activeTab === 'activate' && (
                <ActivatePage onSuccessNavigate={() => handleNavigate('onboarding')} />
              )}

              {activeTab === 'onboarding' && (
                <OnboardingPage onCompleted={() => handleNavigate('home')} />
              )}

              {activeTab === 'telegram' && <TelegramPage />}

              {activeTab === 'settings' && <SettingsPage />}

              {activeTab === 'admin' && <AdminDashboardPage />}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        unreadCount={unreadCount}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
