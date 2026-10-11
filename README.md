# Smart Campus (منصة الحرم الذكي) 🎓
**منصة طلابية تعليمية متكاملة باللغة العربية (Full-Stack PWA)**

منصة حديثة مخصصة لطلاب المعاهد والجامعات المصرية والعربية، تدعم الهواتف والأجهزة المكتبية، وتتضمن نظام تفعيل الاشتراكات بالأكواد، تخزين المحاضرات بروابط Google Drive، وبوت تيليجرام تفاعلي وإشعارات ويب بوش (Web Push).

---

## 🚀 المميزات الرئيسية (Core Features)

1. **واجهة باللغة العربية وتصميم Mobile-First (RTL)**:
   - متوافقة مع الهواتف الذكية مع شريط تنقل سفلي مرن وقائمة جانبية للأجهزة المكتبية.
   - ألوان عصرية: كحلي داكن (`#0f172a`)، تركواز (`#14b8a6`)، ولمسات بنفسجية.
2. **نظام حسابات الطلاب (Student Accounts)**:
   - تسجيل برقم الهاتف المصري والتحقق منه.
   - دورات حياة الحساب: `pending_activation`, `active`, `expired`, `suspended`, `banned`.
3. **نظام تفعيل الحسابات بأكواد فريدة (Activation Codes & Paywall)**:
   - حماية المحتوى من الخادم وقاعدة البيانات؛ لا يمكن للطلاب غير المفعلين فتح ملفات المحاضرات.
   - تفعيل فوري بعملية ذرية (Atomic Transaction) تمنع استخدام الكود مرتين.
   - دليل طرق الدفع (فودافون كاش، انستا باي، فوري).
4. **معالج إعداد أولي للمواد والدكاترة (Onboarding Wizard)**:
   - اختيار القسم والفرقة الدراسية.
   - تحديد المواد والدكتور المفضل لكل مادة.
5. **إدارة المحاضرات وموارد Google Drive**:
   - دعم ملفات متعددة لكل محاضرة (PDF، تسجيل صوتي، فيديو، ملخص، واجب).
   - توفير روابط Google Drive المباشرة وتنبيهات صلاحيات المشاركة.
6. **تكامل متقدم مع Telegram Bot**:
   - ربط الحساب برمز Deep Link قصير الصلاحية ووحيد الاستخدام (`/start link_<TOKEN>`).
   - إرسال إشعارات فورية مع زر انتقال للمحاضرة.
   - دعم دمج بوت موجود مسبقاً دون إعادة برمجته.
7. **إشعارات المتصفح الحقيقية (Web Push Notifications)**:
   - متوافقة مع معايير Service Worker و VAPID keys.
   - تحكم كامل للطالب في أنواع التنبيهات وإمكانية إيقاف/تفعيل التنبيهات لكل مادة على حدة.
8. **لوحة تحكم إدارية كاملة (`/admin`)**:
   - متابعة مؤشرات الأداء (KPIs).
   - إدارة الطلاب وتغيير حالات الحسابات.
   - توليد مجموعات أكواد تفعيل وتصديرها بصيغة CSV.
   - نشر المحاضرات والإعلانات وإرسال حملات إشعارات موجهة.
   - تخصيص هوية المنصة، الشعار، أرقام الدفع، وأسعار الاشتراكات.
9. **تطبيق ويب تقدمي (PWA)**:
   - قابل للتثبيت على Android و iOS و Desktop.
   - العمل بدون إنترنت للأجزاء المحفوظة (Offline fallback).

---

## 🛠️ بنية التقنيات (Tech Stack)

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Lucide Icons.
- **Backend**: Express TypeScript API + جاهزية تامة للتوصيل المباشر مع Supabase.
- **Database & Auth**: PostgreSQL Schema + Supabase Auth + Row Level Security (RLS).
- **Notifications**: Telegram Bot API + Web Push API (VAPID) + Service Worker.
- **Hosting**: جاهز للنشر الفوري على Vercel أو أجهزة Linux / Docker.

---

## 📦 التشغيل المحلي (Local Setup)

```bash
# 1. استنساخ المشروع
git clone https://github.com/your-username/smart-campus.git
cd smart-campus

# 2. تثبيت الحزم
npm install

# 3. إعداد متغيرات البيئة
cp .env.example .env

# 4. تشغيل خادم التطوير
npm run dev
```

افتح المتصفح على: `http://localhost:3000`

---

## 🗄️ إعداد Supabase وقاعدة البيانات (Database Migrations)

المشروع يحتوي على ملفات Migration جاهزة في مسار `/supabase/migrations`:

1. `001_initial_schema.sql`: ينشئ كافة الجداول والعلاقات والدالة الذرية `activate_student_subscription`.
2. `002_security_rls.sql`: يفعل سياسات الأمان (Row Level Security) لمنع وصول غير المشتركين للمحاضرات.

لتنفيذها في لوحة تحكم Supabase:
- اذهب إلى **SQL Editor** في مشروع Supabase الخاص بك.
- الصق محتوى ملف `001_initial_schema.sql` واضغط **Run**.
- ثم الصق محتوى ملف `002_security_rls.sql` واضغط **Run**.

---

## 🤖 دمج بوت تيليجرام الحالي (Existing Bot Integration)

إذا كان لديك مشروع بوت تيليجرام مسبق على Node.js و Vercel:

1. لا تقم بحذف البوت أو إعادة بنائه.
2. أضف استماعاً لأمر البداية بالـ Deep Link:
```typescript
bot.onText(/\/start link_(.+)/, async (msg, match) => {
  const token = 'link_' + match[1];
  const response = await fetch('https://YOUR_APP_URL/api/telegram/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: { text: '/start ' + token, from: msg.from }
    })
  });
  
  bot.sendMessage(msg.chat.id, '🎉 مرحباً بك! تم ربط حسابك في Smart Campus بنجاح.');
});
```
3. أضف `TELEGRAM_BOT_TOKEN` و `TELEGRAM_BOT_USERNAME` إلى ملف `.env`.

---

## 🚢 النشر على Vercel

تم إعداد المشروع ليعمل بسلاسة على Vercel:
1. ارفع المشروع إلى GitHub.
2. في لوحة تحكم Vercel، اختر **Import Repository**.
3. أضف متغيرات البيئة من ملف `.env.example`.
4. انقر فوق **Deploy**.

---

## 🧪 قائمة الاختبارات المنفذة (Verified Test Scenarios)

- [x] إنشاء حساب طالب جديد برقم مصري والتحقق من حالة `pending_activation`.
- [x] منع الطالب غير المفعل من الوصول لملفات المحاضرات وظهور بوابة التفعيل.
- [x] إدخال كود تفعيل صالح والتفعيل اللحظي مع احتفالية Confetti وتحديث تاريخ الصلاحية.
- [x] رفض كود التفعيل المستخدم مسبقاً لمنع استخدامه المزدوج.
- [x] رفض كود التفعيل غير الصالح مع تطبيق الحماية من التخمين (Rate Limiting).
- [x] معالج اختيار المواد والدكاترة وتخصيص تجربة الطالب.
- [x] توليد روابط Deep Link لتيليجرام واختبار المحاكاة الفوري بنجاح.
- [x] تفعيل إشعارات المتصفح وتخزين الاشتراك عبر Service Worker.
- [x] حماية لوحة الإدارة (`/admin`) وقصرها على المسؤولين.
- [x] توليد دفعات أكواد تفعيل جديدة وتصديرها بصيغة CSV.
- [x] تجاوب التصميم مع الهواتف الذكية والأجهزة اللوحية و PWA.
