import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed as standalone PWA, hide button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop prompt
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 font-medium transition cursor-pointer ${
          compact
            ? 'px-3 py-1.5 text-xs rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/30'
            : 'px-3.5 py-2 text-sm rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold shadow-md shadow-teal-500/20'
        }`}
        title="تثبيت التطبيق على جهازك"
      >
        <Download className="w-4 h-4" />
        <span>تثبيت التطبيق</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-teal-400" />
          <span>تثبيت PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-right">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-teal-400" />
                  تثبيت التطبيق على آيفون وآيباد
                </h3>
              </div>
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-750">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <p>اضغط على زر <strong>المشاركة (Share)</strong> في شريط متصفح Safari السفلي.</p>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-750">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <p>مرر للأسفل واضغط على <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.</p>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-750">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <p>اضغط <strong>إضافة (Add)</strong> بالأعلى لتجد أيقونة التطبيق في شاشتك الرئيسية فوراً!</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2.5 text-sm transition"
              >
                فهمت ذلك
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
