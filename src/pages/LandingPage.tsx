import React, { useState } from 'react';
import {
  Menu,
  X,
  BookOpen,
  Calendar,
  Bell,
  Send,
  Users,
  Smartphone,
  Shield,
  ChevronLeft,
  CheckCircle2,
  Zap,
  Globe,
  ArrowRight,
} from 'lucide-react';

export const LandingPage: React.FC<{ onNavigateToAuth: () => void }> = ({ onNavigateToAuth }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200/50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="text-xl font-black text-blue-600 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span>Smart Campus</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => scrollToSection('home')}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                الرئيسية
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                عن المنصة
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                المميزات
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                الأسئلة الشائعة
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={onNavigateToAuth}
                className="px-4 py-2 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50 transition"
              >
                تسجيل الدخول
              </button>
              <button
                onClick={onNavigateToAuth}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition shadow-sm"
              >
                إنشاء حساب
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <button
                onClick={() => scrollToSection('home')}
                className="block w-full text-right px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                الرئيسية
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-right px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                عن المنصة
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-right px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                المميزات
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="block w-full text-right px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                الأسئلة الشائعة
              </button>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={onNavigateToAuth}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50 transition"
                >
                  دخول
                </button>
                <button
                  onClick={onNavigateToAuth}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition"
                >
                  تسجيل
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 via-white to-white overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                  مستقبلك الدراسي في مكان واحد
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                  منصة تعليمية رقمية متقدمة مخصصة لطلاب معهد الفراعنة العالي، تجمع المحاضرات والملفات الدراسية والإعلانات والجداول والمواعيد في تجربة تعليمي�� سهلة ومنظمة.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onNavigateToAuth}
                  className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <span>ابدأ رحلتك التعليمية</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-900 font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2"
                >
                  <span>اكتشف المنصة</span>
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative h-96 sm:h-full hidden md:block">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="space-y-4 w-full">
                  {/* Card 1 */}
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 transform -rotate-3 hover:rotate-0 transition">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <div className="text-sm font-semibold text-blue-900">محاضرات متنظمة</div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 transform rotate-3 hover:rotate-0 transition">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div className="text-sm font-semibold text-purple-900">جداول ومواعيد</div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 transform -rotate-2 hover:rotate-0 transition">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-amber-600" />
                      <div className="text-sm font-semibold text-amber-900">إعلانات فورية</div>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 transform rotate-2 hover:rotate-0 transition">
                    <div className="flex items-center gap-3">
                      <Send className="w-5 h-5 text-sky-600" />
                      <div className="text-sm font-semibold text-sky-900">تنبيهات تيليجرام</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
              مميزات المنصة الرئيسية
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              جميع الخدمات التعليمية التي تحتاجها في تطبيق واحد سهل وآمن
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                المحاضرات والمواد الدراسية
              </h3>
              <p className="text-sm text-slate-600">
                الوصول المنظم للمحاضرات والملفات والملخصات من Google Drive مباشرة
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-sm transition">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                الجداول والمواعيد
              </h3>
              <p className="text-sm text-slate-600">
                متابعة المحاضرات والسكاشن والامتحانات بسهولة وتنظيم
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                الإعلانات الجامعية
              </h3>
              <p className="text-sm text-slate-600">
                متابعة الأخبار والتحديثات المهمة من إدارة المعهد
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 hover:shadow-sm transition">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                إشعارات بوت تيليجرام
              </h3>
              <p className="text-sm text-slate-600">
                استقبال تنبيهات المحاضرات والإعلانات بعد ربط الحساب
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-sm transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                تنظيم المواد والدكاترة
              </h3>
              <p className="text-sm text-slate-600">
                الوصول إلى المواد والمحاضرين المسجلين لديك بشكل منظم
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-sm transition">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                تطبيق موحد
              </h3>
              <p className="text-sm text-slate-600">
                تجربة تعليمية موحدة على الهاتف والكمبيوتر والتابلت
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Whom Section */}
      <section
        id="audience"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
              لمن هذه المنصة؟
            </h2>
            <p className="text-lg text-slate-600">
              منصة Smart Campus مخصصة لطلاب معهد الفراعنة العالي للحاسب ونظم المعلومات والإدارة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-center">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">نظم المعلومات الإدارية</h3>
              <p className="text-sm text-blue-800">
                شعبة نظم المعلومات الإدارية (MIS) بجميع فرقها الدراسية
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 text-center">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-bold text-purple-900 mb-2">علوم الحاسب</h3>
              <p className="text-sm text-purple-800">
                شعبة علوم الحاسب (CS) بجميع فرقها الدراسية
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">الإدارة والمحاسبة</h3>
              <p className="text-sm text-amber-800">
                شعبة الإدارة والمحاسبة بجميع فرقها الدراسية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
              كيف تعمل المنصة؟
            </h2>
            <p className="text-lg text-slate-600">
              أربع خطوات بسيطة لبدء رحلتك التعليمية
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connector Line - Desktop Only */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200" />

            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center relative z-10">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4 shadow-md">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">إنشاء حساب طالب</h3>
                <p className="text-sm text-slate-600">
                  سجل حسابك باستخدام رقم هاتفك أو بريدك الإلكتروني
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center relative z-10">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4 shadow-md">
                  2
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">تفعيل الاشتراك</h3>
                <p className="text-sm text-slate-600">
                  أدخل كود التفعيل الم��تمد من إدارة المعهد
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center relative z-10">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4 shadow-md">
                  3
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">اختر موادك</h3>
                <p className="text-sm text-slate-600">
                  اختر الشعبة والفرقة والمواد الدراسية الخاصة بك
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center relative z-10">
                <div className="w-12 h-12 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4 shadow-md">
                  4
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">متابع واستقبل</h3>
                <p className="text-sm text-slate-600">
                  اتابع المحاضرات والمواعيد واستقبل الإشعارات
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-amber-900 mb-2">نقطة مهمة</h4>
                <p className="text-sm text-amber-800">
                  المحتوى المقيد لا يصبح متاحاً إلا بعد تفعيل حسابك بنجاح. هذا يضمن أن جميع الطلاب لديهم إمكانية الوصول المتساوية للمحتوى التعليمي.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            ابدأ تنظيم رحلتك الدراسية اليوم
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            أنشئ حسابك على Smart Campus وتابع الخدمات التعليمية المتاحة لطلاب معهد الفراعنة العالي
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onNavigateToAuth}
              className="px-8 py-3 rounded-2xl bg-white text-blue-600 font-bold hover:bg-slate-100 transition shadow-lg"
            >
              إنشاء حساب جديد
            </button>
            <button
              onClick={onNavigateToAuth}
              className="px-8 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold border border-blue-400/50 transition"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
              الأسئلة الشائعة
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'هل المنصة متوافقة مع جميع الأجهزة؟',
                a: 'نعم، منصة Smart Campus متوافقة مع جميع الأجهزة والشاشات - الهواتف الذكية والتابلت والكمبيوتر المكتبي.',
              },
              {
                q: 'كيف أحصل على كود التفعيل؟',
                a: 'يتم توزيع أكواد التفعيل من قبل إدارة معهد الفراعنة العالي للطلاب المسجلين. تواصل مع الإدارة للحصول على كودك.',
              },
              {
                q: 'هل يمكنني الوصول للمحاضرات بدون تفعيل؟',
                a: 'لا، المحتوى المقيد يتطلب تفعيل حسابك أولاً. بعد التفعيل، سيكون لديك الوصول الكامل للمحاضرات والملفات.',
              },
              {
                q: 'كيفية الحصول على إشعارات تيليجرام؟',
                a: 'بعد تسجيل الدخول، توجه إلى صفحة إشعارات تيليجرام وتابع التعليمات لربط حسابك ببوت المنصة.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:shadow-xs transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    ؟
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">Smart Campus</span>
              </div>
              <p className="text-slate-400 text-sm">
                منصة تعليمية لطلاب معهد الفراعنة العالي
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">الروابط</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <button onClick={() => scrollToSection('home')} className="hover:text-white transition">
                    الرئيسية
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('about')} className="hover:text-white transition">
                    عن المنصة
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-white transition">
                    المميزات
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">الصفحات</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="/about" className="hover:text-white transition">
                    عن المنصة
                  </a>
                </li>
                <li>
                  <a href="/designer" className="hover:text-white transition">
                    عن المصمم
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">المساعدة</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <button onClick={() => scrollToSection('faq')} className="hover:text-white transition">
                    الأسئلة الشائعة
                  </button>
                </li>
                <li>
                  <span className="hover:text-white transition cursor-pointer">تواصل معنا</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>
              © 2024 Smart Campus - منصة معهد الفراعنة العالي. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
