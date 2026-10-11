import React from 'react';
import {
  BadgeCheck,
  Code2,
  Palette,
  PenTool,
  Sparkles,
  UserRound,
} from 'lucide-react';

const expertise = [
  {
    icon: Palette,
    title: 'تصميم واجهات عربية',
    details: 'واجهة عربية متكاملة، نظيفة، ومتجاوبة.',
  },
  {
    icon: Code2,
    title: 'تطوير واجهة المستخدم',
    details: 'كتابة مكونات React/Tailwind قابلة للتطوير.',
  },
  {
    icon: PenTool,
    title: 'تجربة المستخدم',
    details: 'نسق بصري سهل على الطلاب ويعزز التفاعل.',
  },
];

export const DesignerPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">Designed by</p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">أحمد / المصمم المسؤول</h1>
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm">
            <UserRound className="h-10 w-10 text-indigo-200" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-6 w-6 text-emerald-600" />
            <h2 className="text-xl font-black text-slate-900">مقدمة مختصرة</h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            تم تصميم هذه المنصة بهدف توصيل تجربة تعليمية أنيقة ومهنية لطلاب المعهد، مع مراعاة سهولة
            الاستخدام، اللغة العربية، وأداء الواجهة على الهواتف والأجهزة اللوحية والمكتبية على حد سواء.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            تم التركيز على مبدأ البساطة في التنقل، مع رسائل واضحة، ألوان متوازنة، ونظام معلومات قابل
            للتوسع مستقبلاً مع اللوحات الإدارية والموظفين والعمليات التشغيلية للمنصة.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-violet-50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-violet-600" />
            <h2 className="text-xl font-black text-slate-900">الهوية البصرية</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>• ألوان هادئة: أزرق، بنفسجي، أخضر</li>
            <li>• خط عربي واضح ومريح للقراءة</li>
            <li>• بطاقات متدرجة ومقسمة للمحتوى</li>
            <li>• تقويمات وأزرار موضوعة بعناية لسهولة الاستخدام</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {expertise.map(({ icon: Icon, title, details }) => (
          <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
