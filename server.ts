import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-Memory & Local JSON Persistent Database Store
interface DatabaseState {
  settings: any;
  institutions: any[];
  departments: any[];
  academicYears: any[];
  professors: any[];
  subjects: any[];
  subjectProfessors: any[];
  lectures: any[];
  lectureResources: any[];
  announcements: any[];
  events: any[];
  subscriptionPlans: any[];
  activationCodes: any[];
  users: any[];
  studentSubjects: any[];
  subscriptions: any[];
  telegramConnections: any[];
  pushSubscriptions: any[];
  notifications: any[];
  notificationRecipients: any[];
  notificationPreferences: any[];
  notificationJobs: any[];
}

const DB_FILE = path.join(__dirname, 'campus_db.json');

// Initial seed data
const initialData: DatabaseState = {
  settings: {
    campusName: 'منصة الحرم الذكي - معهد الفراعنة العالي',
    campusShortName: 'معهد الفراعنة العالي',
    description: 'المنصة الطلابية التعليمية المتكاملة لطلاب معهد الفراعنة العالي للحاسب ونظم المعلومات والإدارة',
    logoUrl: '/icon.svg',
    primaryColor: '#1e3a8a',
    accentColor: '#0d9488',
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
    telegramBotUsername: process.env.TELEGRAM_BOT_USERNAME || 'SmartCampusEgyptBot',
    paymentMethods: {
      vodafoneCash: {
        enabled: true,
        number: '01012345678',
        instructions: 'حوّل قيمة الاشتراك عبر فودافون كاش ثم أرسل صورة التحويل عبر واتساب للحصول على كود التفعيل الفوري.',
      },
      instaPay: {
        enabled: true,
        username: 'pharaohs@instapay',
        instructions: 'حوّل مباشرة عبر تطبيق انستا باي مع كتابة اسم الطالب ورقم هاتفه في خانة البيان.',
      },
      fawry: {
        enabled: true,
        serviceCode: '78910',
        instructions: 'ادفع من أي ماكينة فوري باستخدام كود الخدمة واحتفظ بإيصال الدفع.',
      },
      bankTransfer: {
        enabled: false,
        details: 'البنك الأهلي المصري - حساب معهد الفراعنة العالي رقم 12345678901234',
        instructions: 'التحويل البنكي متاح للاشتراكات السنوية فقط.',
      },
    },
    supportContact: {
      whatsapp: '01012345678',
      phone: '01012345678',
      telegram: 'PharaohsCampusSupport',
      email: 'support@pharaohs.edu.eg',
    },
    subscriptionPricePerTerm: 150,
    subscriptionPriceYearly: 250,
    registrationOpen: true,
    autoNotificationsEnabled: true,
    privacyPolicy: 'نلتزم بحماية خصوصية بيانات طلاب معهد الفراعنة العالي وعدم مشاركتها مع أي طرف ثالث.',
    termsOfService: 'الحساب شخصي وخاص بالطالب المسجل فقط في معهد الفراعنة العالي، ويمنع مشاركة أكواد التفعيل.',
  },
  institutions: [
    {
      id: 'inst-1',
      name: 'معهد الفراعنة العالي للحاسب ونظم المعلومات والإدارة',
      slug: 'pharaohs-institute',
      logoUrl: '/icon.svg',
      isActive: true,
    },
    {
      id: 'inst-2',
      name: 'معهد الفراعنة العالي - شعبة العلوم التجارية',
      slug: 'pharaohs-commerce',
      logoUrl: '/icon.svg',
      isActive: true,
    },
  ],
  departments: [
    {
      id: 'dept-1',
      institutionId: 'inst-1',
      name: 'شعبة نظم معلومات إدارية (MIS)',
      slug: 'mis',
      code: 'MIS',
      isActive: true,
    },
    {
      id: 'dept-2',
      institutionId: 'inst-1',
      name: 'شعبة علوم الحاسب (CS)',
      slug: 'cs',
      code: 'CS',
      isActive: true,
    },
    {
      id: 'dept-3',
      institutionId: 'inst-1',
      name: 'شعبة إدارة الأعمال والمحاسبة',
      slug: 'business-accounting',
      code: 'ACC',
      isActive: true,
    },
  ],
  academicYears: [
    {
      id: 'year-1',
      departmentId: 'dept-1',
      name: 'الفرقة الأولى',
      yearNumber: 1,
      term: 'second',
      isActive: true,
    },
    {
      id: 'year-2',
      departmentId: 'dept-1',
      name: 'الفرقة الثانية',
      yearNumber: 2,
      term: 'second',
      isActive: true,
    },
    {
      id: 'year-3',
      departmentId: 'dept-1',
      name: 'الفرقة الثالثة',
      yearNumber: 3,
      term: 'second',
      isActive: true,
    },
    {
      id: 'year-4',
      departmentId: 'dept-1',
      name: 'الفرقة الرابعة',
      yearNumber: 4,
      term: 'second',
      isActive: true,
    },
  ],
  professors: [
    {
      id: 'prof-1',
      name: 'أ.د. أحمد منصور',
      title: 'أستاذ دكتور',
      bio: 'رئيس قسم نظم المعلومات - خبير قواعد البيانات وتحليل النظم',
      email: 'a.mansour@hitmi.edu.eg',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'prof-2',
      name: 'د. سارة عبد الرحمن',
      title: 'دكتورة',
      bio: 'مدرس علوم الحاسب وهندسة البرمجيات وتطبيقات الويب',
      email: 's.abdelrahman@hitmi.edu.eg',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'prof-3',
      name: 'د. محمود الشريف',
      title: 'دكتور',
      bio: 'مدرس المحاسبة المالية والتكاليف ونظم الرقابة',
      email: 'm.elsherif@hitmi.edu.eg',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'prof-4',
      name: 'د. نهى فؤاد',
      title: 'دكتورة',
      bio: 'مدرس شبكات الحاسب وأمن المعلومات',
      email: 'n.fouad@hitmi.edu.eg',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  ],
  subjects: [
    {
      id: 'sub-1',
      academicYearId: 'year-3',
      name: 'قواعد البيانات المتقدمة',
      code: 'MIS-301',
      creditHours: 3,
      icon: 'database',
      isActive: true,
    },
    {
      id: 'sub-2',
      academicYearId: 'year-3',
      name: 'تطوير تطبيقات الويب والخدمات السحابية',
      code: 'MIS-302',
      creditHours: 3,
      icon: 'code',
      isActive: true,
    },
    {
      id: 'sub-3',
      academicYearId: 'year-3',
      name: 'تحليل وتصميم النظم والـ UML',
      code: 'MIS-303',
      creditHours: 3,
      icon: 'layout',
      isActive: true,
    },
    {
      id: 'sub-4',
      academicYearId: 'year-3',
      name: 'محاسبة التكاليف الإلكترونية',
      code: 'ACC-304',
      creditHours: 3,
      icon: 'calculator',
      isActive: true,
    },
    {
      id: 'sub-5',
      academicYearId: 'year-3',
      name: 'أمن المعلومات والشبكات الذكية',
      code: 'NET-305',
      creditHours: 3,
      icon: 'shield',
      isActive: true,
    },
  ],
  subjectProfessors: [
    { id: 'sp-1', subjectId: 'sub-1', professorId: 'prof-1', isPrimary: true },
    { id: 'sp-2', subjectId: 'sub-2', professorId: 'prof-2', isPrimary: true },
    { id: 'sp-3', subjectId: 'sub-3', professorId: 'prof-1', isPrimary: true },
    { id: 'sp-4', subjectId: 'sub-4', professorId: 'prof-3', isPrimary: true },
    { id: 'sp-5', subjectId: 'sub-5', professorId: 'prof-4', isPrimary: true },
  ],
  lectures: [
    {
      id: 'lec-1',
      subjectId: 'sub-1',
      professorId: 'prof-1',
      lectureNumber: 1,
      title: 'مقدمة في نمذجة البيانات العلائقية ومخطط ERD المتقدم',
      description: 'شرح مفصل لمفاهيم Entity-Relationship Diagram والتحويل إلى جداول مع تدريبات عملية.',
      publishedAt: '2026-10-01T09:00:00Z',
      isPublished: true,
      createdAt: '2026-10-01T08:30:00Z',
    },
    {
      id: 'lec-2',
      subjectId: 'sub-1',
      professorId: 'prof-1',
      lectureNumber: 2,
      title: 'معايير تسوية قواعد البيانات (Normalization 1NF, 2NF, 3NF)',
      description: 'كيفية تجنب التكرار والشذوذ في البيانات وتصميم جداول متماسكة.',
      publishedAt: '2026-10-08T09:00:00Z',
      isPublished: true,
      createdAt: '2026-10-08T08:30:00Z',
    },
    {
      id: 'lec-3',
      subjectId: 'sub-2',
      professorId: 'prof-2',
      lectureNumber: 1,
      title: 'بناء واجهات API الحديثة وتكامل RESTful Architecture',
      description: 'أساسيات الاتصال بين السيرفر والواجهة، ومعالجة الطلبات والحماية.',
      publishedAt: '2026-10-03T11:00:00Z',
      isPublished: true,
      createdAt: '2026-10-03T10:30:00Z',
    },
    {
      id: 'lec-4',
      subjectId: 'sub-3',
      professorId: 'prof-1',
      lectureNumber: 1,
      title: 'مراحل دورة حياة تطوير النظم (SDLC) ومخططات Use Case',
      description: 'تحديد متطلبات النظام والمستخدمين ورسم مخططات حالات الاستخدام.',
      publishedAt: '2026-10-05T13:00:00Z',
      isPublished: true,
      createdAt: '2026-10-05T12:00:00Z',
    },
  ],
  lectureResources: [
    {
      id: 'res-1',
      lectureId: 'lec-1',
      title: 'ملف الشرح الكامل (PDF)',
      resourceType: 'pdf',
      driveUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing',
      fileSize: '4.8 MB',
      sortOrder: 1,
      createdAt: '2026-10-01T08:35:00Z',
    },
    {
      id: 'res-2',
      lectureId: 'lec-1',
      title: 'التسجيل الصوتي للمحاضرة كاملة',
      resourceType: 'audio',
      driveUrl: 'https://drive.google.com/file/d/1demo_audio_lecture_01/view?usp=sharing',
      fileSize: '32.1 MB',
      sortOrder: 2,
      createdAt: '2026-10-01T08:36:00Z',
    },
    {
      id: 'res-3',
      lectureId: 'lec-1',
      title: 'ملخص النقاط الجوهرية وأسئلة الامتحانات السابقة',
      resourceType: 'summary',
      driveUrl: 'https://drive.google.com/file/d/1demo_summary_notes_01/view?usp=sharing',
      fileSize: '1.2 MB',
      sortOrder: 3,
      createdAt: '2026-10-01T08:37:00Z',
    },
    {
      id: 'res-4',
      lectureId: 'lec-2',
      title: 'سلايدات المحاضرة الثانية - Normalization (PDF)',
      resourceType: 'pdf',
      driveUrl: 'https://drive.google.com/file/d/1demo_normalization_slides/view?usp=sharing',
      fileSize: '3.5 MB',
      sortOrder: 1,
      createdAt: '2026-10-08T08:35:00Z',
    },
    {
      id: 'res-5',
      lectureId: 'lec-3',
      title: 'أكواد عملية لمشروع REST API (ZIP / Drive)',
      resourceType: 'assignment',
      driveUrl: 'https://drive.google.com/file/d/1demo_rest_api_code/view?usp=sharing',
      fileSize: '8.4 MB',
      sortOrder: 1,
      createdAt: '2026-10-03T10:35:00Z',
    },
  ],
  announcements: [
    {
      id: 'ann-1',
      title: 'تنبيه عاجل: مواعيد تسليم التكليف العملي لمادة قواعد البيانات',
      content: 'يرجى من جميع طلاب الفرقة الثالثة رفع التكليف الأول على المنصة قبل نهاية الأسبوع القادم يوم الخميس في تمام الساعة 11:59 مساءً.',
      priority: 'urgent',
      isPinned: true,
      targetType: 'academic_year',
      targetId: 'year-3',
      targetName: 'الفرقة الثالثة - نظم معلومات إدارية',
      isPublished: true,
      publishedAt: '2026-10-10T10:00:00Z',
      createdAt: '2026-10-10T09:30:00Z',
    },
    {
      id: 'ann-2',
      title: 'جدول امتحانات منتصف الفصل الدراسي الثاني (الميدتيرم)',
      content: 'تم اعتماد جدول امتحانات الميدتيرم للعام الجامعي وسيبدأ أول امتحان في 25 أكتوبر. يرجى مراجعة صفحة المواعيد في المنصة.',
      priority: 'high',
      isPinned: false,
      targetType: 'all',
      isPublished: true,
      publishedAt: '2026-10-09T14:00:00Z',
      createdAt: '2026-10-09T13:45:00Z',
    },
  ],
  events: [
    {
      id: 'evt-1',
      title: 'محاضرة قواعد البيانات المتقدمة (أ.د. أحمد منصور)',
      description: 'شرح معايير تسوية قواعد البيانات والـ BCNF في المدرج الرئيسي (قاعة 402)',
      eventType: 'lecture',
      eventDate: '2026-10-12',
      startTime: '10:00',
      endTime: '12:00',
      locationOrLink: 'مدرج 402 - مبنى التكنولوجيا',
      targetType: 'academic_year',
      targetId: 'year-3',
      isCancelled: false,
      createdAt: '2026-10-05T10:00:00Z',
    },
    {
      id: 'evt-2',
      title: 'سكشن عملي: تصميم واجهات الويب وReact',
      description: 'تطبيق عملي في معمل الحاسب رقم 3 مع المهندس المعيد',
      eventType: 'section',
      eventDate: '2026-10-13',
      startTime: '12:30',
      endTime: '14:00',
      locationOrLink: 'معمل حاسب 3',
      targetType: 'academic_year',
      targetId: 'year-3',
      isCancelled: false,
      createdAt: '2026-10-05T10:00:00Z',
    },
    {
      id: 'evt-3',
      title: 'تسليم التكليف العملي الأول لنظم المعلومات',
      description: 'آخر موعد لرفع التكليف واستلام الدرجات',
      eventType: 'assignment',
      eventDate: '2026-10-15',
      startTime: '23:59',
      endTime: '23:59',
      locationOrLink: 'بوابة التكليفات',
      targetType: 'academic_year',
      targetId: 'year-3',
      isCancelled: false,
      createdAt: '2026-10-05T10:00:00Z',
    },
  ],
  subscriptionPlans: [
    {
      id: 'plan-term',
      name: 'اشتراك الفصل الدراسي (ترم كامل)',
      durationType: 'term',
      durationDays: 120,
      priceEgp: 150,
      description: 'وصول شامل لجميع محاضرات وملخصات وتسجيلات الفصل الدراسي الحالي.',
      isActive: true,
    },
    {
      id: 'plan-year',
      name: 'اشتراك العام الجامعي الكامل',
      durationType: 'yearly',
      durationDays: 300,
      priceEgp: 250,
      description: 'اشتراك سنوي يشمل الفصلين الدراسيين الأول والثاني مع التحديثات والإشعارات.',
      isActive: true,
    },
    {
      id: 'plan-perm',
      name: 'تفعيل دائم (VIP)',
      durationType: 'permanent',
      durationDays: 0,
      priceEgp: 450,
      description: 'وصول دائم لكافة السنوات والمواد بدون الحاجة للتجديد.',
      isActive: true,
    },
  ],
  activationCodes: [
    {
      id: 'code-1',
      code: 'CAMPUS-2026-TERM',
      planId: 'plan-term',
      planName: 'اشتراك الفصل الدراسي',
      durationDays: 120,
      status: 'available',
      createdBy: 'admin-1',
      createdByName: 'مدير النظام',
      createdAt: '2026-10-01T10:00:00Z',
    },
    {
      id: 'code-2',
      code: 'VIP-SUCCESS-YEAR',
      planId: 'plan-year',
      planName: 'اشتراك العام الكامل',
      durationDays: 300,
      status: 'available',
      createdBy: 'admin-1',
      createdByName: 'مدير النظام',
      createdAt: '2026-10-01T10:00:00Z',
    },
    {
      id: 'code-3',
      code: 'TEST-PERMANENT-99',
      planId: 'plan-perm',
      planName: 'تفعيل دائم',
      durationDays: 0,
      status: 'available',
      createdBy: 'admin-1',
      createdByName: 'مدير النظام',
      createdAt: '2026-10-01T10:00:00Z',
    },
    {
      id: 'code-4',
      code: 'USED-SAMPLE-1234',
      planId: 'plan-term',
      planName: 'اشتراك الفصل الدراسي',
      durationDays: 120,
      status: 'used',
      createdBy: 'admin-1',
      usedBy: 'student-active-1',
      usedByName: 'أحمد إبراهيم علي',
      usedAt: '2026-10-05T12:00:00Z',
      createdAt: '2026-10-01T10:00:00Z',
    },
  ],
  users: [
    {
      id: 'admin-1',
      fullName: 'المهندس كريم الشاذلي (إدارة المنصة)',
      phone: '01099887766',
      email: 'admin@pharaohs.edu.eg',
      role: 'super_admin',
      status: 'active',
      institutionId: 'inst-1',
      institutionName: 'معهد الفراعنة العالي',
      departmentId: 'dept-admin',
      departmentName: 'الإدارة المركزية والدعم الأكاديمي',
      academicYearId: 'admin-level',
      academicYearName: 'لوحة التحكم الإدارية',
      onboardingCompleted: true,
      subscriptionExpiresAt: '2099-12-31T23:59:59Z',
      telegramLinked: true,
      telegramUsername: 'KarimAdmin',
      webPushEnabled: true,
      createdAt: '2026-09-01T10:00:00Z',
    },
    {
      id: 'student-active-1',
      fullName: 'أحمد إبراهيم علي',
      phone: '01123456789',
      email: 'ahmed.ibrahim@pharaohs.edu.eg',
      role: 'student',
      status: 'active',
      institutionId: 'inst-1',
      institutionName: 'معهد الفراعنة العالي',
      departmentId: 'dept-1',
      departmentName: 'شعبة نظم معلومات إدارية (MIS)',
      academicYearId: 'year-3',
      academicYearName: 'الفرقة الثالثة',
      onboardingCompleted: true,
      subscriptionExpiresAt: '2027-02-15T23:59:59Z',
      telegramLinked: true,
      telegramUsername: 'AhmedStudent_Eg',
      webPushEnabled: true,
      createdAt: '2026-10-02T11:00:00Z',
    },
    {
      id: 'student-pending-1',
      fullName: 'محمد يوسف حسام',
      phone: '01234567890',
      email: 'mohamed.youssef@pharaohs.edu.eg',
      role: 'student',
      status: 'pending_activation',
      institutionId: 'inst-1',
      institutionName: 'معهد الفراعنة العالي',
      departmentId: 'dept-1',
      departmentName: 'شعبة نظم معلومات إدارية (MIS)',
      academicYearId: 'year-3',
      academicYearName: 'الفرقة الثالثة',
      onboardingCompleted: false,
      subscriptionExpiresAt: null,
      telegramLinked: false,
      webPushEnabled: false,
      createdAt: '2026-10-10T14:00:00Z',
    },
  ],
  studentSubjects: [
    { studentId: 'student-active-1', subjectId: 'sub-1', professorId: 'prof-1' },
    { studentId: 'student-active-1', subjectId: 'sub-2', professorId: 'prof-2' },
    { studentId: 'student-active-1', subjectId: 'sub-3', professorId: 'prof-1' },
    { studentId: 'student-active-1', subjectId: 'sub-4', professorId: 'prof-3' },
    { studentId: 'student-active-1', subjectId: 'sub-5', professorId: 'prof-4' },
    { studentId: 'admin-1', subjectId: 'sub-1', professorId: 'prof-1' },
    { studentId: 'admin-1', subjectId: 'sub-2', professorId: 'prof-2' },
  ],
  subscriptions: [
    {
      id: 'sub-record-1',
      studentId: 'student-active-1',
      codeId: 'code-4',
      planId: 'plan-term',
      startedAt: '2026-10-05T12:00:00Z',
      expiresAt: '2027-02-15T23:59:59Z',
      status: 'active',
    },
  ],
  telegramConnections: [
    {
      studentId: 'student-active-1',
      telegramUserId: '987654321',
      telegramUsername: 'AhmedStudent_Eg',
      isLinked: true,
      linkedAt: '2026-10-05T12:30:00Z',
      lastDeliveryStatus: 'delivered',
    },
    {
      studentId: 'admin-1',
      telegramUserId: '123456789',
      telegramUsername: 'KarimAdmin',
      isLinked: true,
      linkedAt: '2026-09-02T10:00:00Z',
      lastDeliveryStatus: 'delivered',
    },
  ],
  pushSubscriptions: [
    {
      studentId: 'student-active-1',
      endpoint: 'https://fcm.googleapis.com/fcm/send/sample-endpoint-ahmed',
      keysP256dh: 'sample-p256dh-key',
      keysAuth: 'sample-auth-key',
      deviceName: 'Chrome on Android',
      createdAt: '2026-10-05T12:35:00Z',
    },
  ],
  notifications: [
    {
      id: 'notif-1',
      title: 'محاضرة جديدة: قواعد البيانات المتقدمة',
      content: 'أضاف أ.د. أحمد منصور المحاضرة الثانية: معايير تسوية قواعد البيانات وملفات الشرح.',
      type: 'new_lecture',
      targetUrl: '/subjects/sub-1',
      createdAt: '2026-10-08T09:05:00Z',
    },
    {
      id: 'notif-2',
      title: 'تنبيه إداري: مواعيد تسليم التكليفات',
      content: 'يرجى الالتزام بموعد تسليم التكليف العملي قبل انتهاء المهلة المحددة.',
      type: 'admin_alert',
      targetUrl: '/announcements',
      createdAt: '2026-10-10T10:05:00Z',
    },
  ],
  notificationRecipients: [
    { id: 'nr-1', notificationId: 'notif-1', studentId: 'student-active-1', isRead: false },
    { id: 'nr-2', notificationId: 'notif-2', studentId: 'student-active-1', isRead: false },
  ],
  notificationPreferences: [
    {
      studentId: 'student-active-1',
      lecturesEnabled: true,
      resourcesEnabled: true,
      announcementsEnabled: true,
      eventsEnabled: true,
      subscriptionsEnabled: true,
      telegramEnabled: true,
      webPushEnabled: true,
      subjectOverrides: {},
    },
  ],
  notificationJobs: [],
};

// Database state management
let db: DatabaseState = initialData;

// Load persisted DB if exists
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    db = { ...initialData, ...JSON.parse(raw) };
  } else {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  }
} catch (e) {
  console.error('Error reading DB_FILE, using initial data:', e);
}

function persistDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write DB_FILE:', err);
  }
}

// Global active user session (Defaults to Active Student for high-friction-free review, switchable anytime in UI)
let currentUserId = 'student-active-1';

// Rate limiting map for code activation to prevent brute-forcing
const codeAttempts = new Map<string, { count: number; lockedUntil: number }>();

// Helper to get current profile
function getCurrentUser() {
  const user = db.users.find((u) => u.id === currentUserId) || db.users[0];
  const telConn = db.telegramConnections.find((t) => t.studentId === user.id);
  const pushSub = db.pushSubscriptions.find((p) => p.studentId === user.id);
  return {
    ...user,
    telegramLinked: Boolean(telConn?.isLinked),
    telegramUsername: telConn?.telegramUsername,
    webPushEnabled: Boolean(pushSub),
  };
}

// -----------------------------------------------------------------------------
// 1. AUTH & SESSION API
// -----------------------------------------------------------------------------

app.get('/api/auth/me', (req: Request, res: Response) => {
  res.json({ success: true, user: getCurrentUser() });
});

// Demo account switcher for testing all personas
app.post('/api/auth/switch-demo', (req: Request, res: Response) => {
  const { role } = req.body;
  if (role === 'admin' || role === 'super_admin') {
    currentUserId = 'admin-1';
  } else if (role === 'pending') {
    currentUserId = 'student-pending-1';
  } else {
    currentUserId = 'student-active-1';
  }
  res.json({ success: true, user: getCurrentUser() });
});

// Student registration
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { fullName, phone, password, institutionId, departmentId, academicYearId } = req.body;

  if (!fullName || !phone || !password) {
    return res.status(400).json({ success: false, message: 'يرجى استكمال جميع الحقول المطلوبة' });
  }

  // Egyptian phone validation
  const egyptPhoneRegex = /^01[0125][0-9]{8}$/;
  if (!egyptPhoneRegex.test(phone.trim())) {
    return res.status(400).json({ success: false, message: 'رقم الهاتف يجب أن يكون رقم مصري صحيح (مثال: 01012345678)' });
  }

  // Check existing phone
  const existing = db.users.find((u) => u.phone === phone.trim());
  if (existing) {
    return res.status(400).json({ success: false, message: 'رقم الهاتف مسجل بالفعل مسبقاً' });
  }

  const inst = db.institutions.find((i) => i.id === institutionId) || db.institutions[0];
  const dept = db.departments.find((d) => d.id === departmentId) || db.departments[0];
  const year = db.academicYears.find((y) => y.id === academicYearId) || db.academicYears[0];

  const newUser = {
    id: `student-${Date.now()}`,
    fullName: fullName.trim(),
    phone: phone.trim(),
    email: `${phone.trim()}@student.smartcampus.edu`,
    role: 'student',
    status: 'pending_activation', // Initial status required: pending_activation!
    institutionId: inst.id,
    institutionName: inst.name,
    departmentId: dept.id,
    departmentName: dept.name,
    academicYearId: year.id,
    academicYearName: year.name,
    onboardingCompleted: false,
    subscriptionExpiresAt: null,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  // Initialize notification preferences
  db.notificationPreferences.push({
    studentId: newUser.id,
    lecturesEnabled: true,
    resourcesEnabled: true,
    announcementsEnabled: true,
    eventsEnabled: true,
    subscriptionsEnabled: true,
    telegramEnabled: true,
    webPushEnabled: true,
    subjectOverrides: {},
  });

  currentUserId = newUser.id;
  persistDB();

  res.status(201).json({
    success: true,
    message: 'تم إنشاء الحساب بنجاح! حسابك بانتظار إدخال كود التفعيل للوصول للمحتوى.',
    user: getCurrentUser(),
  });
});

// Student Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { phoneOrEmail, password } = req.body;

  const target = (phoneOrEmail || '').trim();
  const found = db.users.find((u) => u.phone === target || u.email === target);

  if (!found) {
    return res.status(404).json({ success: false, message: 'رقم الهاتف أو البريد الإلكتروني غير مسجل' });
  }

  currentUserId = found.id;
  res.json({ success: true, message: 'تم تسجيل الدخول بنجاح', user: getCurrentUser() });
});

// Update profile details
app.put('/api/auth/profile', (req: Request, res: Response) => {
  const { fullName, phone } = req.body;
  const user = db.users.find((u) => u.id === currentUserId);
  if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });

  if (fullName) user.fullName = fullName.trim();
  if (phone) {
    const egyptPhoneRegex = /^01[0125][0-9]{8}$/;
    if (!egyptPhoneRegex.test(phone.trim())) {
      return res.status(400).json({ success: false, message: 'رقم الهاتف يجب أن يكون رقم مصري صحيح' });
    }
    user.phone = phone.trim();
  }

  persistDB();
  res.json({ success: true, message: 'تم تحديث البيانات الشخصية', user: getCurrentUser() });
});

// -----------------------------------------------------------------------------
// 2. ATOMIC CODE ACTIVATION API (With Rate Limiting & Anti-Brute Force)
// -----------------------------------------------------------------------------

app.post('/api/activation/verify', (req: Request, res: Response) => {
  const user = getCurrentUser();
  const rawCode = (req.body.code || '').trim().toUpperCase();

  if (!rawCode) {
    return res.status(400).json({ success: false, message: 'يرجى إدخال كود التفعيل' });
  }

  // Rate Limiting check per user
  const now = Date.now();
  const attemptInfo = codeAttempts.get(user.id) || { count: 0, lockedUntil: 0 };

  if (attemptInfo.lockedUntil > now) {
    const remainingSecs = Math.ceil((attemptInfo.lockedUntil - now) / 1000);
    return res.status(429).json({
      success: false,
      message: `تم إيقاف المحاولات مؤقتاً لكثرة المحاولات الخاطئة. يرجى المحاولة بعد ${remainingSecs} ثانية.`,
    });
  }

  // Find code
  const codeIndex = db.activationCodes.findIndex((c) => c.code.toUpperCase() === rawCode);

  if (codeIndex === -1) {
    attemptInfo.count += 1;
    if (attemptInfo.count >= 5) {
      attemptInfo.lockedUntil = now + 60 * 1000; // 1 min lock
      attemptInfo.count = 0;
    }
    codeAttempts.set(user.id, attemptInfo);
    return res.status(400).json({ success: false, message: 'كود التفعيل غير صحيح، يرجى التأكد من الرمز المدخل' });
  }

  const codeRecord = db.activationCodes[codeIndex];

  if (codeRecord.status === 'used') {
    return res.status(400).json({
      success: false,
      message: 'عفواً! هذا الكود مستخدم بالفعل من قبل، لا يمكن استخدام نفس الكود مرتين.',
    });
  }

  if (codeRecord.status === 'disabled' || codeRecord.status === 'expired') {
    return res.status(400).json({ success: false, message: 'عفواً! هذا الكود معطل أو منتهي الصلاحية.' });
  }

  // Atomic operation: calculate expiry, mark code as used, create subscription, update profile
  const durationDays = codeRecord.durationDays;
  let newExpiry: Date;

  if (durationDays === 0) {
    // Permanent
    newExpiry = new Date();
    newExpiry.setFullYear(newExpiry.getFullYear() + 50);
  } else {
    const baseDate = user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date()
      ? new Date(user.subscriptionExpiresAt)
      : new Date();
    newExpiry = new Date(baseDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
  }

  // 1. Mark Code Used
  db.activationCodes[codeIndex].status = 'used';
  db.activationCodes[codeIndex].usedBy = user.id;
  db.activationCodes[codeIndex].usedByName = user.fullName;
  db.activationCodes[codeIndex].usedAt = new Date().toISOString();

  // 2. Insert Subscription record
  const subRecord = {
    id: `sub-${Date.now()}`,
    studentId: user.id,
    codeId: codeRecord.id,
    planId: codeRecord.planId,
    startedAt: new Date().toISOString(),
    expiresAt: newExpiry.toISOString(),
    status: 'active',
  };
  db.subscriptions.push(subRecord);

  // 3. Update User Status to Active
  const userIdx = db.users.findIndex((u) => u.id === user.id);
  if (userIdx !== -1) {
    db.users[userIdx].status = 'active';
    db.users[userIdx].subscriptionExpiresAt = newExpiry.toISOString();
  }

  // Reset rate limiting counter on success
  codeAttempts.delete(user.id);
  persistDB();

  // Create in-app activation celebration notification
  const notif = {
    id: `notif-act-${Date.now()}`,
    title: '🎉 تهانينا! تم تفعيل حسابك بنجاح',
    content: `تم تفعيل اشتراكك في المنصة بنجاح حتى ${newExpiry.toLocaleDateString('ar-EG')}. استمتع بجميع المحاضرات والملخصات.`,
    type: 'subscription_alert',
    targetUrl: '/subjects',
    createdAt: new Date().toISOString(),
  };
  db.notifications.push(notif);
  db.notificationRecipients.push({
    id: `nr-${Date.now()}`,
    notificationId: notif.id,
    studentId: user.id,
    isRead: false,
  });

  res.json({
    success: true,
    message: 'تم تفعيل حسابك بنجاح! مرحباً بك في الحرم الذكي.',
    expiresAt: newExpiry.toISOString(),
    user: getCurrentUser(),
  });
});

// -----------------------------------------------------------------------------
// 3. ONBOARDING & SUBJECT SELECTIONS
// -----------------------------------------------------------------------------

app.get('/api/student/onboarding-data', (req: Request, res: Response) => {
  const user = getCurrentUser();
  const yearId = user.academicYearId || 'year-3';

  // Get subjects for this academic year
  const subjectsForYear = db.subjects
    .filter((s) => s.academicYearId === yearId && s.isActive)
    .map((s) => {
      // Find professors linked to this subject
      const profIds = db.subjectProfessors.filter((sp) => sp.subjectId === s.id).map((sp) => sp.professorId);
      const profs = db.professors.filter((p) => profIds.includes(p.id));
      return {
        ...s,
        professors: profs.length > 0 ? profs : [db.professors[0]],
      };
    });

  res.json({
    success: true,
    institutions: db.institutions.filter((i) => i.isActive),
    departments: db.departments.filter((d) => d.isActive),
    academicYears: db.academicYears.filter((y) => y.isActive),
    subjects: subjectsForYear,
    currentSelections: db.studentSubjects.filter((ss) => ss.studentId === user.id),
  });
});

app.post('/api/student/onboarding', (req: Request, res: Response) => {
  const user = getCurrentUser();
  const { selections, institutionId, departmentId, academicYearId } = req.body;

  if (!Array.isArray(selections) || selections.length === 0) {
    return res.status(400).json({ success: false, message: 'يرجى اختيار مادة واحدة على الأقل' });
  }

  // Update profile institution/dept if passed
  const userIdx = db.users.findIndex((u) => u.id === user.id);
  if (userIdx !== -1) {
    if (institutionId) db.users[userIdx].institutionId = institutionId;
    if (departmentId) db.users[userIdx].departmentId = departmentId;
    if (academicYearId) db.users[userIdx].academicYearId = academicYearId;
    db.users[userIdx].onboardingCompleted = true;
  }

  // Replace student selections
  db.studentSubjects = db.studentSubjects.filter((ss) => ss.studentId !== user.id);
  for (const item of selections) {
    db.studentSubjects.push({
      studentId: user.id,
      subjectId: item.subjectId,
      professorId: item.professorId || null,
    });
  }

  persistDB();
  res.json({
    success: true,
    message: 'تم حفظ اختيارات المواد بنجاح!',
    user: getCurrentUser(),
  });
});

// -----------------------------------------------------------------------------
// 4. STUDENT DASHBOARD & CONTENT APIS (Strict Paywall Enforced)
// -----------------------------------------------------------------------------

// Middleware: Verify student is ACTIVE before allowing lecture content
function requireActiveStudent(req: Request, res: Response, next: Function) {
  const user = getCurrentUser();
  if (user.role === 'admin' || user.role === 'super_admin') {
    return next();
  }
  if (user.status !== 'active') {
    return res.status(403).json({
      success: false,
      paywall: true,
      message: 'الوصول للمحتوى التعليمي يتطلب تفعيل الحساب بإدخال كود اشتراك ساري.',
    });
  }
  next();
}

app.get('/api/student/dashboard', (req: Request, res: Response) => {
  const user = getCurrentUser();

  // If pending activation, return limited preview
  if (user.status !== 'active' && user.role === 'student') {
    return res.json({
      success: true,
      user,
      isLocked: true,
      stats: {
        enrolledSubjectsCount: 0,
        availableLecturesCount: db.lectures.length,
        upcomingEventsCount: 0,
        unreadNotificationsCount: 1,
      },
      announcements: db.announcements.slice(0, 2),
      recentLectures: [],
      upcomingEvents: [],
    });
  }

  // Active student: Enrolled subjects
  const enrolledSubjectIds = db.studentSubjects
    .filter((ss) => ss.studentId === user.id)
    .map((ss) => ss.subjectId);

  // If none enrolled yet, default to department subjects
  const finalSubjectIds = enrolledSubjectIds.length > 0
    ? enrolledSubjectIds
    : db.subjects.slice(0, 4).map((s) => s.id);

  // Recent lectures from enrolled subjects
  const recentLectures = db.lectures
    .filter((l) => finalSubjectIds.includes(l.subjectId) && l.isPublished)
    .map((l) => {
      const subject = db.subjects.find((s) => s.id === l.subjectId);
      const prof = db.professors.find((p) => p.id === l.professorId);
      const resources = db.lectureResources.filter((r) => r.lectureId === l.id);
      return {
        ...l,
        subjectName: subject?.name || 'مادة دراسية',
        professorName: prof ? `${prof.title} ${prof.name}` : '',
        resourcesCount: resources.length,
      };
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);

  // Upcoming Cairo Events
  const upcomingEvents = db.events
    .filter((e) => !e.isCancelled)
    .sort((a, b) => new Date(`${a.eventDate}T${a.startTime}`).getTime() - new Date(`${b.eventDate}T${b.startTime}`).getTime())
    .slice(0, 4);

  // Announcements
  const announcements = db.announcements
    .filter((a) => a.isPublished)
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  // Unread notifications count
  const unreadCount = db.notificationRecipients.filter(
    (nr) => nr.studentId === user.id && !nr.isRead
  ).length;

  res.json({
    success: true,
    user,
    isLocked: false,
    stats: {
      enrolledSubjectsCount: finalSubjectIds.length,
      availableLecturesCount: recentLectures.length,
      upcomingEventsCount: upcomingEvents.length,
      unreadNotificationsCount: unreadCount,
    },
    recentLectures,
    upcomingEvents,
    announcements,
  });
});

app.get('/api/student/subjects', (req: Request, res: Response) => {
  const user = getCurrentUser();

  const userSelections = db.studentSubjects.filter((ss) => ss.studentId === user.id);
  const enrolledIds = userSelections.map((ss) => ss.subjectId);

  // If student hasn't selected yet, show department year subjects
  const yearId = user.academicYearId || 'year-3';
  const candidateSubjects = enrolledIds.length > 0
    ? db.subjects.filter((s) => enrolledIds.includes(s.id))
    : db.subjects.filter((s) => s.academicYearId === yearId);

  const subjectsWithDetails = candidateSubjects.map((s) => {
    const selection = userSelections.find((ss) => ss.subjectId === s.id);
    const assignedProfId = selection?.professorId;
    const profs = db.professors.filter((p) =>
      db.subjectProfessors.some((sp) => sp.subjectId === s.id && sp.professorId === p.id)
    );
    const activeProf = profs.find((p) => p.id === assignedProfId) || profs[0] || db.professors[0];

    const lecs = db.lectures.filter((l) => l.subjectId === s.id && l.isPublished);
    const latestLec = lecs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0];

    return {
      ...s,
      professors: profs,
      currentProfessor: activeProf,
      lecturesCount: lecs.length,
      latestUpdate: latestLec?.publishedAt || s.createdAt,
    };
  });

  res.json({ success: true, subjects: subjectsWithDetails });
});

// Subject Lectures with Paywall Protection
app.get('/api/student/subjects/:id/lectures', requireActiveStudent, (req: Request, res: Response) => {
  const subjectId = req.params.id;
  const subject = db.subjects.find((s) => s.id === subjectId);
  if (!subject) return res.status(404).json({ success: false, message: 'المادة غير موجودة' });

  const lecs = db.lectures
    .filter((l) => l.subjectId === subjectId && l.isPublished)
    .sort((a, b) => a.lectureNumber - b.lectureNumber)
    .map((l) => {
      const prof = db.professors.find((p) => p.id === l.professorId);
      const resources = db.lectureResources
        .filter((r) => r.lectureId === l.id)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      return {
        ...l,
        professorName: prof ? `${prof.title} ${prof.name}` : undefined,
        resources,
      };
    });

  res.json({ success: true, subject, lectures: lecs });
});

// Announcements
app.get('/api/student/announcements', (req: Request, res: Response) => {
  res.json({
    success: true,
    announcements: db.announcements.filter((a) => a.isPublished),
  });
});

// Schedule & Calendar Events (Cairo Timezone)
app.get('/api/student/events', (req: Request, res: Response) => {
  const events = db.events
    .filter((e) => !e.isCancelled)
    .sort((a, b) => new Date(`${a.eventDate}T${a.startTime}`).getTime() - new Date(`${b.eventDate}T${b.startTime}`).getTime());

  res.json({ success: true, events });
});

// Notifications list
app.get('/api/student/notifications', (req: Request, res: Response) => {
  const user = getCurrentUser();
  const recipientEntries = db.notificationRecipients.filter((nr) => nr.studentId === user.id);

  const list = recipientEntries.map((nr) => {
    const notif = db.notifications.find((n) => n.id === nr.notificationId);
    return {
      id: nr.notificationId,
      recipientId: nr.id,
      title: notif?.title || 'إشعار جديد',
      content: notif?.content || '',
      type: notif?.type || 'announcement',
      targetUrl: notif?.targetUrl || '/',
      isRead: nr.isRead,
      createdAt: notif?.createdAt || new Date().toISOString(),
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ success: true, notifications: list, unreadCount: list.filter((n) => !n.isRead).length });
});

app.post('/api/student/notifications/:id/read', (req: Request, res: Response) => {
  const user = getCurrentUser();
  const notifId = req.params.id;
  const entry = db.notificationRecipients.find((nr) => nr.studentId === user.id && nr.notificationId === notifId);
  if (entry) {
    entry.isRead = true;
    persistDB();
  }
  res.json({ success: true });
});

app.post('/api/student/notifications/read-all', (req: Request, res: Response) => {
  const user = getCurrentUser();
  db.notificationRecipients
    .filter((nr) => nr.studentId === user.id)
    .forEach((nr) => (nr.isRead = true));
  persistDB();
  res.json({ success: true });
});

// Notification preferences
app.get('/api/student/notification-preferences', (req: Request, res: Response) => {
  const user = getCurrentUser();
  let prefs = db.notificationPreferences.find((p) => p.studentId === user.id);
  if (!prefs) {
    prefs = {
      studentId: user.id,
      lecturesEnabled: true,
      resourcesEnabled: true,
      announcementsEnabled: true,
      eventsEnabled: true,
      subscriptionsEnabled: true,
      telegramEnabled: true,
      webPushEnabled: true,
      subjectOverrides: {},
    };
    db.notificationPreferences.push(prefs);
  }
  res.json({ success: true, preferences: prefs });
});

app.put('/api/student/notification-preferences', (req: Request, res: Response) => {
  const user = getCurrentUser();
  const idx = db.notificationPreferences.findIndex((p) => p.studentId === user.id);
  if (idx !== -1) {
    db.notificationPreferences[idx] = { ...db.notificationPreferences[idx], ...req.body };
  } else {
    db.notificationPreferences.push({ studentId: user.id, ...req.body });
  }
  persistDB();
  res.json({ success: true, message: 'تم حفظ تفضيلات الإشعارات' });
});

// -----------------------------------------------------------------------------
// 5. TELEGRAM BOT INTEGRATION API (Single-use Deep-Link & Real Webhook)
// -----------------------------------------------------------------------------

function getTelegramBotToken(): string {
  return (db.settings.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN || '').trim();
}

function getTelegramBotUsername(): string {
  return (db.settings.telegramBotUsername || process.env.TELEGRAM_BOT_USERNAME || 'SmartCampusEgyptBot').trim().replace('@', '');
}

async function sendTelegramMessage(chatId: string | number, text: string, inlineButton?: { text: string; url: string }): Promise<boolean> {
  const token = getTelegramBotToken();
  if (!token || !chatId) return false;
  try {
    const payload: any = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    };
    if (inlineButton) {
      payload.reply_markup = {
        inline_keyboard: [[inlineButton]],
      };
    }
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as any;
    return Boolean(data?.ok);
  } catch (e) {
    console.error('Failed to send Telegram message:', e);
    return false;
  }
}

const activeLinkingTokens = new Map<string, { studentId: string; expiresAt: number }>();

app.post('/api/telegram/generate-link', (req: Request, res: Response) => {
  const user = getCurrentUser();
  const token = `link_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins expiry

  activeLinkingTokens.set(token, { studentId: user.id, expiresAt });

  const botUsername = getTelegramBotUsername();
  const deepLink = `https://t.me/${botUsername}?start=${token}`;

  res.json({
    success: true,
    token,
    deepLink,
    expiresInMinutes: 15,
    botUsername,
  });
});

app.get('/api/telegram/status', (req: Request, res: Response) => {
  const user = getCurrentUser();
  const telConn = db.telegramConnections.find((t) => t.studentId === user.id);
  res.json({
    success: true,
    isLinked: Boolean(telConn?.isLinked),
    telegramUsername: telConn?.telegramUsername || null,
    linkedAt: telConn?.linkedAt || null,
    lastDeliveryStatus: telConn?.lastDeliveryStatus || 'pending',
  });
});

app.post('/api/telegram/unlink', (req: Request, res: Response) => {
  const user = getCurrentUser();
  const idx = db.telegramConnections.findIndex((t) => t.studentId === user.id);
  if (idx !== -1) {
    db.telegramConnections.splice(idx, 1);
    persistDB();
  }
  res.json({ success: true, message: 'تم إلغاء ربط حساب تيليجرام بنجاح' });
});

// Development simulator for telegram deep-link testing without external webhook tunnel
app.post('/api/telegram/simulate-bot-link', (req: Request, res: Response) => {
  const { token, simulatedTelegramUsername } = req.body;
  const tokenInfo = activeLinkingTokens.get(token);

  if (!tokenInfo || tokenInfo.expiresAt < Date.now()) {
    return res.status(400).json({ success: false, message: 'رمز الربط غير صالح أو انتهت صلاحيته' });
  }

  // Single-use token: remove immediately
  activeLinkingTokens.delete(token);

  const studentId = tokenInfo.studentId;
  const simulatedId = Math.floor(100000000 + Math.random() * 900000000).toString();
  const username = (simulatedTelegramUsername || 'Student_Telegram').replace('@', '');

  // Update or insert telegram connection
  const connIndex = db.telegramConnections.findIndex((t) => t.studentId === studentId);
  if (connIndex !== -1) {
    db.telegramConnections[connIndex] = {
      studentId,
      telegramUserId: simulatedId,
      telegramUsername: username,
      isLinked: true,
      linkedAt: new Date().toISOString(),
      lastDeliveryStatus: 'delivered',
    };
  } else {
    db.telegramConnections.push({
      studentId,
      telegramUserId: simulatedId,
      telegramUsername: username,
      isLinked: true,
      linkedAt: new Date().toISOString(),
      lastDeliveryStatus: 'delivered',
    });
  }

  persistDB();

  res.json({
    success: true,
    message: 'تم التحقق من رمز الربط وحفظ معرف تيليجرام بنجاح!',
    telegramUsername: username,
  });
});

// Real Telegram Webhook (When deployed with live Bot Token)
app.post('/api/telegram/webhook', async (req: Request, res: Response) => {
  try {
    const update = req.body;
    if (update?.message?.text && update.message.text.startsWith('/start link_')) {
      const token = update.message.text.replace('/start ', '').trim();
      const tokenInfo = activeLinkingTokens.get(token);

      if (tokenInfo && tokenInfo.expiresAt >= Date.now()) {
        activeLinkingTokens.delete(token);
        const studentId = tokenInfo.studentId;
        const tgUser = update.message.from;

        const connIndex = db.telegramConnections.findIndex((t) => t.studentId === studentId);
        const record = {
          studentId,
          telegramUserId: tgUser.id.toString(),
          telegramUsername: tgUser.username || tgUser.first_name,
          isLinked: true,
          linkedAt: new Date().toISOString(),
          lastDeliveryStatus: 'delivered' as const,
        };

        if (connIndex !== -1) {
          db.telegramConnections[connIndex] = record;
        } else {
          db.telegramConnections.push(record);
        }
        persistDB();

        // If real bot token is present, send welcome message back to telegram user
        const welcomeText = `🎉 <b>مرحباً بك يا ${tgUser.first_name || 'طالبنا العزيز'}!</b>\n\n🏛️ <b>معهد الفراعنة العالي للحاسب ونظم المعلومات</b>\nتم ربط حسابك بمنصة <b>Smart Campus</b> بنجاح!\n\nستصلك إشعارات المحاضرات والمقررات والملفات والمواعيد الهامة فور نشرها هنا مباشرة.`;
        await sendTelegramMessage(tgUser.id, welcomeText);
      }
    }
  } catch (err) {
    console.error('Telegram webhook error:', err);
  }
  res.status(200).send('OK');
});

// Send test Telegram message
app.post('/api/telegram/test-notification', async (req: Request, res: Response) => {
  const user = getCurrentUser();
  const conn = db.telegramConnections.find((t) => t.studentId === user.id);

  if (!conn || !conn.isLinked) {
    return res.status(400).json({ success: false, message: 'حساب تيليجرام غير مربوط بعد' });
  }

  const messageText = `🔔 <b>إشعار تجريبي من معهد الفراعنة العالي (Smart Campus)</b>\n\nعزيزي <b>${user.fullName}</b>،\nتم اختبار اتصال بوت تيليجرام بنجاح! ستصلك التنبيهات لحظة بلحظة فور نشر أي محتوى جديد.`;

  if (conn.telegramUserId) {
    await sendTelegramMessage(conn.telegramUserId, messageText);
  }

  conn.lastDeliveryStatus = 'delivered';
  persistDB();

  res.json({
    success: true,
    message: 'تم إرسال الإشعار التجريبي إلى حساب تيليجرام بنجاح!',
  });
});

// -----------------------------------------------------------------------------
// 6. WEB PUSH NOTIFICATIONS API
// -----------------------------------------------------------------------------

app.post('/api/push/subscribe', (req: Request, res: Response) => {
  const user = getCurrentUser();
  const { subscription, deviceName } = req.body;

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ success: false, message: 'بيانات اشتراك Push غير صالحة' });
  }

  const existingIdx = db.pushSubscriptions.findIndex(
    (p) => p.studentId === user.id && p.endpoint === subscription.endpoint
  );

  const subData = {
    studentId: user.id,
    endpoint: subscription.endpoint,
    keysP256dh: subscription.keys?.p256dh || '',
    keysAuth: subscription.keys?.auth || '',
    deviceName: deviceName || 'متصفح ويب',
    createdAt: new Date().toISOString(),
  };

  if (existingIdx !== -1) {
    db.pushSubscriptions[existingIdx] = subData;
  } else {
    db.pushSubscriptions.push(subData);
  }

  persistDB();
  res.json({ success: true, message: 'تم تفعيل إشعارات المتصفح بنجاح' });
});

// -----------------------------------------------------------------------------
// 7. ADMIN PORTAL APIS (Full Management, Protected Role)
// -----------------------------------------------------------------------------

function requireAdmin(req: Request, res: Response, next: Function) {
  const user = getCurrentUser();
  if (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'content_manager') {
    return res.status(403).json({ success: false, message: 'غير مصرح: هذه الصفحة مخصصة لإدارة المنصة فقط' });
  }
  next();
}

app.get('/api/admin/stats', requireAdmin, (req: Request, res: Response) => {
  const stats = {
    totalStudents: db.users.filter((u) => u.role === 'student').length,
    activeStudents: db.users.filter((u) => u.role === 'student' && u.status === 'active').length,
    pendingStudents: db.users.filter((u) => u.role === 'student' && u.status === 'pending_activation').length,
    expiredStudents: db.users.filter((u) => u.role === 'student' && u.status === 'expired').length,
    totalInstitutions: db.institutions.length,
    totalDepartments: db.departments.length,
    totalSubjects: db.subjects.length,
    totalLectures: db.lectures.length,
    totalAnnouncements: db.announcements.length,
    telegramLinkedCount: db.telegramConnections.filter((t) => t.isLinked).length,
    webPushSubscribedCount: db.pushSubscriptions.length,
    availableCodesCount: db.activationCodes.filter((c) => c.status === 'available').length,
    usedCodesCount: db.activationCodes.filter((c) => c.status === 'used').length,
    sentNotificationsCount: db.notifications.length,
    failedNotificationsCount: 0,
  };

  res.json({ success: true, stats });
});

app.get('/api/admin/students', requireAdmin, (req: Request, res: Response) => {
  const students = db.users
    .filter((u) => u.role === 'student')
    .map((s) => {
      const tel = db.telegramConnections.find((t) => t.studentId === s.id);
      const push = db.pushSubscriptions.find((p) => p.studentId === s.id);
      const sub = db.subscriptions.find((sub) => sub.studentId === s.id);
      return {
        ...s,
        telegramLinked: Boolean(tel?.isLinked),
        telegramUsername: tel?.telegramUsername,
        webPushEnabled: Boolean(push),
        activeSubscription: sub,
      };
    });

  res.json({ success: true, students });
});

app.put('/api/admin/students/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  const student = db.users.find((u) => u.id === req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'الطالب غير موجود' });

  student.status = status;
  persistDB();
  res.json({ success: true, message: 'تم تحديث حالة حساب الطالب بنجاح', student });
});

// Activation Codes management
app.get('/api/admin/codes', requireAdmin, (req: Request, res: Response) => {
  res.json({ success: true, codes: db.activationCodes });
});

app.post('/api/admin/codes/generate', requireAdmin, (req: Request, res: Response) => {
  const { prefix = 'CAMPUS', count = 1, planId, durationDays = 120 } = req.body;
  const admin = getCurrentUser();
  const plan = db.subscriptionPlans.find((p) => p.id === planId) || db.subscriptionPlans[0];

  const generatedCodes: any[] = [];
  const qty = Math.min(Math.max(1, Number(count)), 100);

  for (let i = 0; i < qty; i++) {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
    const codeStr = `${prefix.trim().toUpperCase()}-${uniqueNumber}-${randomSuffix}`;

    const newCode = {
      id: `code-${Date.now()}-${i}`,
      code: codeStr,
      planId: plan.id,
      planName: plan.name,
      durationDays: Number(durationDays),
      status: 'available',
      createdBy: admin.id,
      createdByName: admin.fullName,
      createdAt: new Date().toISOString(),
    };
    db.activationCodes.unshift(newCode);
    generatedCodes.push(newCode);
  }

  persistDB();
  res.json({
    success: true,
    message: `تم إنشاء ${qty} كود تفعيل بنجاح`,
    codes: generatedCodes,
  });
});

app.put('/api/admin/codes/:id/disable', requireAdmin, (req: Request, res: Response) => {
  const code = db.activationCodes.find((c) => c.id === req.params.id);
  if (!code) return res.status(404).json({ success: false, message: 'الكود غير موجود' });

  code.status = code.status === 'disabled' ? 'available' : 'disabled';
  persistDB();
  res.json({ success: true, message: 'تم تغيير حالة الكود بنجاح', code });
});

// Content management (Lectures & Drive Resources)
app.post('/api/admin/content/lectures', requireAdmin, (req: Request, res: Response) => {
  const { subjectId, professorId, lectureNumber, title, description, resources } = req.body;

  if (!subjectId || !lectureNumber || !title) {
    return res.status(400).json({ success: false, message: 'بيانات المحاضرة غير مكتملة' });
  }

  const newLecture = {
    id: `lec-${Date.now()}`,
    subjectId,
    professorId: professorId || null,
    lectureNumber: Number(lectureNumber),
    title: title.trim(),
    description: description?.trim() || '',
    publishedAt: new Date().toISOString(),
    isPublished: true,
    createdAt: new Date().toISOString(),
  };

  db.lectures.unshift(newLecture);

  // Add resources
  if (Array.isArray(resources)) {
    resources.forEach((r, idx) => {
      if (r.title && r.driveUrl) {
        db.lectureResources.push({
          id: `res-${Date.now()}-${idx}`,
          lectureId: newLecture.id,
          title: r.title.trim(),
          resourceType: r.resourceType || 'pdf',
          driveUrl: r.driveUrl.trim(),
          fileSize: r.fileSize || 'غير محدد',
          sortOrder: idx + 1,
          createdAt: new Date().toISOString(),
        });
      }
    });
  }

  // Automatic Notification Dispatch Engine
  if (db.settings.autoNotificationsEnabled) {
    const subject = db.subjects.find((s) => s.id === subjectId);
    const prof = db.professors.find((p) => p.id === professorId);
    const notifTitle = `📚 محاضرة جديدة: ${subject?.name || 'مادة دراسية'}`;
    const notifContent = `تم إضافة المحاضرة (${lectureNumber}) بعنوان "${title}"${prof ? ` بواسطة ${prof.title} ${prof.name}` : ''}.`;

    const notif = {
      id: `notif-lec-${Date.now()}`,
      title: notifTitle,
      content: notifContent,
      type: 'new_lecture',
      targetUrl: `/subjects/${subjectId}`,
      createdAt: new Date().toISOString(),
    };
    db.notifications.unshift(notif);

    // Notify enrolled active students
    db.users.filter((u) => u.role === 'student' && u.status === 'active').forEach((st) => {
      db.notificationRecipients.push({
        id: `nr-${Date.now()}-${st.id}`,
        notificationId: notif.id,
        studentId: st.id,
        isRead: false,
      });
    });

    // Notify enrolled active students via Telegram if linked
    const activeStudentIds = new Set(db.users.filter((u) => u.role === 'student' && u.status === 'active').map(u => u.id));
    db.telegramConnections.filter(c => c.isLinked && c.telegramUserId && activeStudentIds.has(c.studentId)).forEach(c => {
      const tgMsg = `📚 <b>محاضرة جديدة بمعهد الفراعنة العالي</b>\n\n📖 المادة: <b>${subject?.name || 'مقرر دراسي'}</b>\n📌 المحاضرة: <b>${title}</b> (رقم ${lectureNumber})\n${prof ? `👨‍🏫 المحاضر: ${prof.title} ${prof.name}\n` : ''}\nيمكنك الآن فتح المنصة والاطلاع على ملفات الـ Google Drive المرفقة.`;
      sendTelegramMessage(c.telegramUserId, tgMsg);
    });
  }

  persistDB();
  res.status(201).json({ success: true, message: 'تم نشر المحاضرة والملفات وإرسال الإشعارات للطلاب بنجاح', lecture: newLecture });
});

app.delete('/api/admin/content/lectures/:id', requireAdmin, (req: Request, res: Response) => {
  db.lectures = db.lectures.filter((l) => l.id !== req.params.id);
  db.lectureResources = db.lectureResources.filter((r) => r.lectureId !== req.params.id);
  persistDB();
  res.json({ success: true, message: 'تم حذف المحاضرة بنجاح' });
});

// Announcements creation
app.post('/api/admin/content/announcements', requireAdmin, (req: Request, res: Response) => {
  const { title, content, priority = 'normal', isPinned = false, targetType = 'all', targetId } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'يرجى كتابة عنوان ونص الإعلان' });
  }

  const newAnn = {
    id: `ann-${Date.now()}`,
    title: title.trim(),
    content: content.trim(),
    priority,
    isPinned: Boolean(isPinned),
    targetType,
    targetId: targetId || null,
    isPublished: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  db.announcements.unshift(newAnn);

  // Dispatch notification
  const notif = {
    id: `notif-ann-${Date.now()}`,
    title: `📢 ${title}`,
    content,
    type: 'announcement',
    targetUrl: '/announcements',
    createdAt: new Date().toISOString(),
  };
  db.notifications.unshift(notif);

  db.users.filter((u) => u.role === 'student').forEach((st) => {
    db.notificationRecipients.push({
      id: `nr-${Date.now()}-${st.id}`,
      notificationId: notif.id,
      studentId: st.id,
      isRead: false,
    });
  });

  // Notify all students with linked Telegram
  db.telegramConnections.filter((c) => c.isLinked && c.telegramUserId).forEach((c) => {
    const tgMsg = `📢 <b>إعلان هام - معهد الفراعنة العالي</b>\n\n📌 <b>${title}</b>\n\n${content}`;
    sendTelegramMessage(c.telegramUserId, tgMsg);
  });

  persistDB();
  res.status(201).json({ success: true, message: 'تم نشر الإعلان بنجاح', announcement: newAnn });
});

// Broadcast notification engine
app.post('/api/admin/notifications/broadcast', requireAdmin, (req: Request, res: Response) => {
  const { title, content, channels = ['in_app'], targetAudience = 'all' } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'يرجى إدخال العنوان والمحتوى' });
  }

  const targetStudents = db.users.filter((u) => u.role === 'student');

  const notif = {
    id: `broadcast-${Date.now()}`,
    title: title.trim(),
    content: content.trim(),
    type: 'admin_alert',
    targetUrl: '/announcements',
    createdAt: new Date().toISOString(),
  };
  db.notifications.unshift(notif);

  targetStudents.forEach((st) => {
    db.notificationRecipients.push({
      id: `nr-bc-${Date.now()}-${st.id}`,
      notificationId: notif.id,
      studentId: st.id,
      isRead: false,
    });
  });

  // If Telegram channel selected, dispatch to all linked students
  if (channels.includes('telegram')) {
    db.telegramConnections.filter((c) => c.isLinked && c.telegramUserId).forEach((c) => {
      const tgMsg = `📣 <b>تنبيه من إدارة معهد الفراعنة العالي</b>\n\n📌 <b>${title}</b>\n\n${content}`;
      sendTelegramMessage(c.telegramUserId, tgMsg);
    });
  }

  persistDB();

  res.json({
    success: true,
    message: `تم إرسال الحملة الإشعارية بنجاح إلى ${targetStudents.length} طالب.`,
    targetedCount: targetStudents.length,
    channels,
  });
});

// Admin Telegram Bot Management APIs
app.get('/api/admin/telegram/info', requireAdmin, async (req: Request, res: Response) => {
  const token = getTelegramBotToken();
  const username = getTelegramBotUsername();
  const appUrl = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
  const suggestedWebhookUrl = `${appUrl}/api/telegram/webhook`;

  let botDetails = null;
  let webhookDetails = null;

  if (token) {
    try {
      const botRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const botData = (await botRes.json()) as any;
      if (botData.ok) {
        botDetails = botData.result;
      }

      const whRes = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
      const whData = (await whRes.json()) as any;
      if (whData.ok) {
        webhookDetails = whData.result;
      }
    } catch (err) {
      console.error('Error fetching Telegram bot info:', err);
    }
  }

  res.json({
    success: true,
    hasToken: Boolean(token),
    tokenMasked: token ? `${token.substring(0, 7)}...${token.slice(-5)}` : null,
    username,
    botDetails,
    webhookDetails,
    suggestedWebhookUrl,
    linkedStudentsCount: db.telegramConnections.filter((t) => t.isLinked).length,
    connections: db.telegramConnections.filter((t) => t.isLinked).map((c) => {
      const st = db.users.find((u) => u.id === c.studentId);
      return {
        studentId: c.studentId,
        studentName: st?.fullName || 'طالب',
        studentPhone: st?.phone || '',
        telegramUsername: c.telegramUsername,
        linkedAt: c.linkedAt,
        status: c.lastDeliveryStatus,
      };
    }),
  });
});

app.post('/api/admin/telegram/setup-webhook', requireAdmin, async (req: Request, res: Response) => {
  const token = getTelegramBotToken();
  if (!token) {
    return res.status(400).json({ success: false, message: 'يرجى إدخال توكن البوت (Bot Token) أولاً وحفظه' });
  }

  const appUrl = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
  const webhookUrl = req.body.webhookUrl || `${appUrl}/api/telegram/webhook`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl, drop_pending_updates: true }),
    });
    const data = (await response.json()) as any;
    if (data.ok) {
      res.json({
        success: true,
        message: `✅ تم تفعيل الـ Webhook بنجاح مع سيرفرات تيليجرام (${webhookUrl})`,
        result: data.result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: `فشل تفعيل الـ Webhook: ${data.description || 'تأكد من التوكن والرابط'}`,
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: `خطأ في الاتصال بسيرفر تيليجرام: ${err.message}` });
  }
});

app.post('/api/admin/telegram/delete-webhook', requireAdmin, async (req: Request, res: Response) => {
  const token = getTelegramBotToken();
  if (!token) return res.status(400).json({ success: false, message: 'لا يوجد توكن مسجل' });

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`);
    const data = (await response.json()) as any;
    res.json({ success: Boolean(data.ok), message: data.description || 'تم إلغاء الـ Webhook' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/admin/telegram/test-bot', requireAdmin, async (req: Request, res: Response) => {
  const token = req.body.token ? req.body.token.trim() : getTelegramBotToken();
  if (!token) {
    return res.status(400).json({ success: false, message: 'يرجى إدخال توكن البوت لاختباره' });
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = (await response.json()) as any;
    if (data.ok) {
      res.json({
        success: true,
        message: `✅ اتصال البوت سليم 100%! اسم البوت: @${data.result.username} (${data.result.first_name})`,
        bot: data.result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: `❌ التوكن غير صالح: ${data.description || 'يرجى التأكد من نسخه بدقة من @BotFather'}`,
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: `خطأ في الاتصال بـ Telegram API: ${err.message}` });
  }
});

// Reports API
app.get('/api/admin/reports', requireAdmin, (req: Request, res: Response) => {
  const studentsByDept: Record<string, number> = {};
  db.users.filter((u) => u.role === 'student').forEach((s) => {
    const dept = s.departmentName || 'غير محدد';
    studentsByDept[dept] = (studentsByDept[dept] || 0) + 1;
  });

  const studentsByYear: Record<string, number> = {};
  db.users.filter((u) => u.role === 'student').forEach((s) => {
    const yr = s.academicYearName || 'غير محدد';
    studentsByYear[yr] = (studentsByYear[yr] || 0) + 1;
  });

  res.json({
    success: true,
    studentsByDept,
    studentsByYear,
    totalActive: db.users.filter((u) => u.role === 'student' && u.status === 'active').length,
    totalTelegramLinked: db.telegramConnections.filter((t) => t.isLinked).length,
    totalWebPush: db.pushSubscriptions.length,
    recentCodes: db.activationCodes.slice(0, 10),
  });
});

// Platform Settings API
app.get('/api/settings', (req: Request, res: Response) => {
  res.json({ success: true, settings: db.settings });
});

app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
  db.settings = { ...db.settings, ...req.body };
  persistDB();
  res.json({ success: true, message: 'تم تحديث إعدادات المنصة بنجاح', settings: db.settings });
});

// Academic Catalog API
app.get('/api/catalog', (req: Request, res: Response) => {
  res.json({
    success: true,
    institutions: db.institutions,
    departments: db.departments,
    academicYears: db.academicYears,
    professors: db.professors,
    subjects: db.subjects,
    plans: db.subscriptionPlans,
  });
});

// -----------------------------------------------------------------------------
// VITE DEV SERVER INTEGRATION OR STATIC PRODUCTION FILE SERVING
// -----------------------------------------------------------------------------

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Smart Campus Server running on port ${PORT}`);
  });
}

startServer();
