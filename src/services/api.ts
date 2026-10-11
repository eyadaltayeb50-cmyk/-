import { 
  UserProfile, 
  PlatformSettings, 
  Subject, 
  Lecture, 
  Announcement, 
  CampusEvent, 
  NotificationItem, 
  NotificationPreferences, 
  AdminStats, 
  ActivationCode, 
  Institution, 
  Department, 
  AcademicYear 
} from '../types';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `خطأ في الخادم (${res.status})`);
  }
  return data;
}

export const api = {
  // Auth
  async getCurrentUser(): Promise<{ success: boolean; user: UserProfile }> {
    return fetchJSON('/api/auth/me');
  },

  async login(phoneOrEmail: string, password?: string): Promise<{ success: boolean; user: UserProfile; message: string }> {
    return fetchJSON('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phoneOrEmail, password }),
    });
  },

  async register(data: {
    fullName: string;
    phone: string;
    password?: string;
    institutionId?: string;
    departmentId?: string;
    academicYearId?: string;
  }): Promise<{ success: boolean; user: UserProfile; message: string }> {
    return fetchJSON('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async switchDemo(role: 'active' | 'pending' | 'admin'): Promise<{ success: boolean; user: UserProfile }> {
    return fetchJSON('/api/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  },

  async updateProfile(data: { fullName?: string; phone?: string }): Promise<{ success: boolean; user: UserProfile; message: string }> {
    return fetchJSON('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Activation
  async verifyCode(code: string, phone?: string): Promise<{ 
    success: boolean; 
    message: string; 
    user: UserProfile; 
    expiresAt: string;
    telegramAutoRegistered?: boolean;
    registeredPhone?: string;
    botDeepLink?: string;
    botUsername?: string;
  }> {
    return fetchJSON('/api/activation/verify', {
      method: 'POST',
      body: JSON.stringify({ code, phone }),
    });
  },

  // Onboarding & Catalog
  async getOnboardingData(): Promise<{
    success: boolean;
    institutions: Institution[];
    departments: Department[];
    academicYears: AcademicYear[];
    subjects: Subject[];
    currentSelections: any[];
  }> {
    return fetchJSON('/api/student/onboarding-data');
  },

  async saveOnboarding(data: {
    institutionId?: string;
    departmentId?: string;
    academicYearId?: string;
    selections: { subjectId: string; professorId?: string }[];
  }): Promise<{ success: boolean; user: UserProfile; message: string }> {
    return fetchJSON('/api/student/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Dashboard & Content
  async getDashboard(): Promise<{
    success: boolean;
    user: UserProfile;
    isLocked: boolean;
    stats: {
      enrolledSubjectsCount: number;
      availableLecturesCount: number;
      upcomingEventsCount: number;
      unreadNotificationsCount: number;
    };
    recentLectures: any[];
    upcomingEvents: CampusEvent[];
    announcements: Announcement[];
  }> {
    return fetchJSON('/api/student/dashboard');
  },

  async getSubjects(): Promise<{ success: boolean; subjects: Subject[] }> {
    return fetchJSON('/api/student/subjects');
  },

  async getSubjectLectures(subjectId: string): Promise<{ success: boolean; subject: Subject; lectures: Lecture[] }> {
    return fetchJSON(`/api/student/subjects/${subjectId}/lectures`);
  },

  async getAnnouncements(): Promise<{ success: boolean; announcements: Announcement[] }> {
    return fetchJSON('/api/student/announcements');
  },

  async getEvents(): Promise<{ success: boolean; events: CampusEvent[] }> {
    return fetchJSON('/api/student/events');
  },

  // Notifications
  async getNotifications(): Promise<{ success: boolean; notifications: NotificationItem[]; unreadCount: number }> {
    return fetchJSON('/api/student/notifications');
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return fetchJSON(`/api/student/notifications/${id}/read`, { method: 'POST' });
  },

  async markAllNotificationsRead(): Promise<{ success: boolean }> {
    return fetchJSON('/api/student/notifications/read-all', { method: 'POST' });
  },

  async getNotificationPreferences(): Promise<{ success: boolean; preferences: NotificationPreferences }> {
    return fetchJSON('/api/student/notification-preferences');
  },

  async updateNotificationPreferences(prefs: Partial<NotificationPreferences>): Promise<{ success: boolean; message: string }> {
    return fetchJSON('/api/student/notification-preferences', {
      method: 'PUT',
      body: JSON.stringify(prefs),
    });
  },

  // Telegram Integration
  async generateTelegramLink(): Promise<{
    success: boolean;
    token: string;
    deepLink: string;
    expiresInMinutes: number;
    botUsername: string;
  }> {
    return fetchJSON('/api/telegram/generate-link', { method: 'POST' });
  },

  async getTelegramStatus(): Promise<{
    success: boolean;
    isLinked: boolean;
    telegramUsername: string | null;
    linkedAt: string | null;
    lastDeliveryStatus: string;
  }> {
    return fetchJSON('/api/telegram/status');
  },

  async simulateBotLink(token: string, simulatedTelegramUsername?: string): Promise<{
    success: boolean;
    message: string;
    telegramUsername: string;
  }> {
    return fetchJSON('/api/telegram/simulate-bot-link', {
      method: 'POST',
      body: JSON.stringify({ token, simulatedTelegramUsername }),
    });
  },

  async sendTestTelegram(): Promise<{ success: boolean; message: string }> {
    return fetchJSON('/api/telegram/test-notification', { method: 'POST' });
  },

  async unlinkTelegram(): Promise<{ success: boolean; message: string }> {
    return fetchJSON('/api/telegram/unlink', { method: 'POST' });
  },

  // Web Push
  async subscribePush(subscription: any, deviceName?: string): Promise<{ success: boolean; message: string }> {
    return fetchJSON('/api/push/subscribe', {
      method: 'POST',
      body: JSON.stringify({ subscription, deviceName }),
    });
  },

  // Settings
  async getSettings(): Promise<{ success: boolean; settings: PlatformSettings }> {
    return fetchJSON('/api/settings');
  },

  async updateSettings(settings: Partial<PlatformSettings>): Promise<{ success: boolean; message: string; settings: PlatformSettings }> {
    return fetchJSON('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Admin APIs
  async getAdminStats(): Promise<{ success: boolean; stats: AdminStats }> {
    return fetchJSON('/api/admin/stats');
  },

  async getAdminStudents(): Promise<{ success: boolean; students: UserProfile[] }> {
    return fetchJSON('/api/admin/students');
  },

  async updateStudentStatus(id: string, status: string): Promise<{ success: boolean; message: string }> {
    return fetchJSON(`/api/admin/students/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async getAdminCodes(): Promise<{ success: boolean; codes: ActivationCode[] }> {
    return fetchJSON('/api/admin/codes');
  },

  async generateCodes(data: {
    prefix?: string;
    count: number;
    planId?: string;
    durationDays?: number;
  }): Promise<{ success: boolean; message: string; codes: ActivationCode[] }> {
    return fetchJSON('/api/admin/codes/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async toggleCodeDisable(id: string): Promise<{ success: boolean; message: string; code: ActivationCode }> {
    return fetchJSON(`/api/admin/codes/${id}/disable`, { method: 'PUT' });
  },

  async createLecture(data: any): Promise<{ success: boolean; message: string }> {
    return fetchJSON('/api/admin/content/lectures', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteLecture(id: string): Promise<{ success: boolean; message: string }> {
    return fetchJSON(`/api/admin/content/lectures/${id}`, { method: 'DELETE' });
  },

  async createAnnouncement(data: any): Promise<{ success: boolean; message: string }> {
    return fetchJSON('/api/admin/content/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async broadcastNotification(data: {
    title: string;
    content: string;
    channels?: string[];
    targetAudience?: string;
  }): Promise<{ success: boolean; message: string; targetedCount: number }> {
    return fetchJSON('/api/admin/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getReports(): Promise<{ success: boolean; studentsByDept: Record<string, number>; studentsByYear: Record<string, number>; totalActive: number; totalTelegramLinked: number; totalWebPush: number; recentCodes: ActivationCode[] }> {
    return fetchJSON('/api/admin/reports');
  },

  // Admin Telegram Management
  async getAdminTelegramInfo(): Promise<{
    success: boolean;
    hasToken: boolean;
    tokenMasked: string | null;
    username: string;
    botDetails: any;
    webhookDetails: any;
    suggestedWebhookUrl: string;
    linkedStudentsCount: number;
    connections: Array<{
      studentId: string;
      studentName: string;
      studentPhone: string;
      telegramUsername?: string;
      linkedAt?: string;
      status?: string;
    }>;
  }> {
    return fetchJSON('/api/admin/telegram/info');
  },

  async setupAdminTelegramWebhook(webhookUrl?: string): Promise<{ success: boolean; message: string; result?: any }> {
    return fetchJSON('/api/admin/telegram/setup-webhook', {
      method: 'POST',
      body: JSON.stringify({ webhookUrl }),
    });
  },

  async deleteAdminTelegramWebhook(): Promise<{ success: boolean; message: string }> {
    return fetchJSON('/api/admin/telegram/delete-webhook', { method: 'POST' });
  },

  async testAdminTelegramBot(token?: string): Promise<{ success: boolean; message: string; bot?: any }> {
    return fetchJSON('/api/admin/telegram/test-bot', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  async getCatalog(): Promise<{
    success: boolean;
    institutions: Institution[];
    departments: Department[];
    academicYears: AcademicYear[];
    professors: any[];
    subjects: Subject[];
    plans: any[];
  }> {
    return fetchJSON('/api/catalog');
  },
};
