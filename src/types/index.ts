export type UserRole = 'student' | 'admin' | 'super_admin' | 'content_manager';

export type AccountStatus = 'pending_activation' | 'active' | 'expired' | 'suspended' | 'banned';

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  institutionId?: string;
  institutionName?: string;
  departmentId?: string;
  departmentName?: string;
  academicYearId?: string;
  academicYearName?: string;
  avatarUrl?: string;
  subscriptionExpiresAt?: string;
  telegramLinked?: boolean;
  telegramUsername?: string;
  webPushEnabled?: boolean;
  onboardingCompleted?: boolean;
  createdAt: string;
}

export interface Institution {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  isActive: boolean;
  departmentsCount?: number;
}

export interface Department {
  id: string;
  institutionId: string;
  name: string;
  slug: string;
  code?: string;
  isActive: boolean;
}

export interface AcademicYear {
  id: string;
  departmentId: string;
  name: string; // e.g. "الفرقة الأولى"
  yearNumber: number;
  term: 'first' | 'second' | 'full';
  isActive: boolean;
}

export interface Professor {
  id: string;
  name: string;
  title: string; // e.g. "أ.د.", "د."
  bio?: string;
  avatarUrl?: string;
  email?: string;
}

export interface Subject {
  id: string;
  academicYearId: string;
  name: string;
  code: string;
  creditHours?: number;
  icon?: string;
  isActive: boolean;
  professors: Professor[];
  lecturesCount?: number;
  latestUpdate?: string;
}

export interface StudentSubjectSelection {
  subjectId: string;
  professorId?: string;
}

export type ResourceType = 'pdf' | 'audio' | 'video' | 'summary' | 'assignment' | 'link' | 'other';

export interface LectureResource {
  id: string;
  lectureId: string;
  title: string;
  resourceType: ResourceType;
  driveUrl: string;
  fileSize?: string;
  sortOrder: number;
  createdAt: string;
}

export interface Lecture {
  id: string;
  subjectId: string;
  subjectName?: string;
  professorId?: string;
  professorName?: string;
  lectureNumber: number;
  title: string;
  description?: string;
  publishedAt: string;
  isPublished: boolean;
  resources: LectureResource[];
  createdAt: string;
}

export type AnnouncementPriority = 'urgent' | 'high' | 'normal';
export type TargetType = 'all' | 'institution' | 'department' | 'academic_year' | 'subject' | 'professor';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  priority: AnnouncementPriority;
  isPinned: boolean;
  targetType: TargetType;
  targetId?: string;
  targetName?: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
}

export type EventType = 'lecture' | 'section' | 'exam' | 'assignment' | 'revision' | 'holiday' | 'general';

export interface CampusEvent {
  id: string;
  title: string;
  description?: string;
  eventType: EventType;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  locationOrLink?: string;
  targetType: TargetType;
  targetId?: string;
  isCancelled: boolean;
  createdAt: string;
}

export type DurationType = 'permanent' | 'monthly' | 'term' | 'yearly' | 'custom';
export type CodeStatus = 'available' | 'used' | 'disabled' | 'expired';

export interface SubscriptionPlan {
  id: string;
  name: string;
  durationType: DurationType;
  durationDays: number;
  priceEgp: number;
  description: string;
  isActive: boolean;
}

export interface ActivationCode {
  id: string;
  code: string;
  planId: string;
  planName?: string;
  durationDays: number;
  status: CodeStatus;
  createdBy: string;
  createdByName?: string;
  usedBy?: string;
  usedByName?: string;
  usedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  type: 'new_lecture' | 'new_resource' | 'announcement' | 'new_event' | 'event_update' | 'event_cancel' | 'admin_alert' | 'subscription_alert';
  targetUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  lecturesEnabled: boolean;
  resourcesEnabled: boolean;
  announcementsEnabled: boolean;
  eventsEnabled: boolean;
  subscriptionsEnabled: boolean;
  telegramEnabled: boolean;
  webPushEnabled: boolean;
  subjectOverrides: Record<string, boolean>; // subjectId -> boolean
}

export interface TelegramConnection {
  studentId: string;
  studentName?: string;
  studentPhone?: string;
  telegramUserId?: string;
  telegramUsername?: string;
  isLinked: boolean;
  linkingToken?: string;
  tokenExpiresAt?: string;
  linkedAt?: string;
  activatedAt?: string;
  activationCode?: string;
  planName?: string;
  autoRegistered?: boolean;
  academicYearName?: string;
  departmentName?: string;
  lastDeliveryStatus?: 'delivered' | 'failed' | 'pending';
}

export interface PlatformSettings {
  campusName: string;
  campusShortName: string;
  description: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  telegramBotToken?: string;
  telegramBotUsername?: string;
  paymentMethods: {
    vodafoneCash: { enabled: boolean; number: string; instructions: string };
    instaPay: { enabled: boolean; username: string; instructions: string };
    fawry: { enabled: boolean; serviceCode: string; instructions: string };
    bankTransfer: { enabled: boolean; details: string; instructions: string };
  };
  supportContact: {
    whatsapp: string;
    phone: string;
    telegram: string;
    email: string;
  };
  subscriptionPricePerTerm: number;
  subscriptionPriceYearly: number;
  registrationOpen: boolean;
  autoNotificationsEnabled: boolean;
  privacyPolicy: string;
  termsOfService: string;
}

export interface AdminStats {
  totalStudents: number;
  activeStudents: number;
  pendingStudents: number;
  expiredStudents: number;
  totalInstitutions: number;
  totalDepartments: number;
  totalSubjects: number;
  totalLectures: number;
  totalAnnouncements: number;
  telegramLinkedCount: number;
  webPushSubscribedCount: number;
  availableCodesCount: number;
  usedCodesCount: number;
  sentNotificationsCount: number;
  failedNotificationsCount: number;
}
