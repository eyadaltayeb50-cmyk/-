import React from 'react';
import { BookOpen, ShieldCheck, Users, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

const pillars = [
  {
    icon: BookOpen,
    title: 'محتوى دراسي منظم',
    description: 'مجموعات المحاضرات، الملفات، والأدلة الدراسية في واجهة موحدة وسهلة الوصول.',
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    icon: ShieldCheck,
    title: 'حسابات آمنة ومفعلة',
    description: 'نظام تسجيل، تفعيل اشتراك، ومتابعة حالة الحساب بطريقة واضحة ومؤمنة.',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Users,
    title: 'تواصل فعال مع الطلاب',
    description: 'إعلانات، تنبيهات، وربط سريع مع تيليجرام والبريد الداخلي للمنصة.',
    accent: 'from-violet-500 to-purple-500',
  },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">About the platform</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">عن تجربة Smart Campus</h1>
          <p className="mt-4 text-base text-blue-50 leading-relaxed">
            تم تصميم المنصة لتكون نقطة التواصل الرئيسية بين المعهد والطالب، عبر مركز موحد لإدارة
            المحتوى الدراسي، التفعيل، الإعلانات، التنبيهات، والملف الشخصي، مع تجربة مستخدم عربية حديثة
            ومتجاوبة على جميع الأجهزة.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {pillars.map(({ icon: Icon, title, description, accent }) => (
          <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r ${accent} text-white`}>
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-black text-slate-900">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-violet-600" />
          <h2 className="text-xl font-black text-slate-900">الرسالة والقيمة</h2>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2 text-sm leading-relaxed text-slate-700">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-bold text-slate-900 mb-2">الرسالة:</p>
            توحيد الخدمات التعليمية في منصة واحدة ترفع كفاءة التواصل بين المؤسسة والطلاب وتقلل التشتت.
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-bold text-slate-900 mb-2">القيمة:</p>
            جعل الوصول إلى المحاضرات والإعلانات والمواعيد أسهل، مع تجربة سلسة من خلال الهاتف والكمبيوتر.
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-black text-slate-900">ما الذي يوفره النظام؟</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {[
            'إدارة حسابات الطلاب وتفعيل الاشتراك.',
            'مركز للإعلانات الرسمية والمواعيد.',
            'إدارة المحاضرات والمواد مع روابط Google Drive.',
            'تنبيهات تيليجرام وWeb Push.',
            'لوحة تحكم إدارية متكاملة للمنشورات والطلاب والأكواد.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" />
          العودة إلى الصفحة الرئيسية
        </button>
      </div>
    </div>
  );
};
