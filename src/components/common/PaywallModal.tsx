import React from 'react';
import { ShieldAlert, KeyRound, MessageCircle, X } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToActivate: () => void;
  subjectTitle?: string;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onGoToActivate,
  subjectTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-right">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center mb-5 text-amber-700">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">المحتوى التعليمي محمي</h3>
        
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {subjectTitle ? `للوصول إلى محاضرات ومذكرات "${subjectTitle}" بمعهد الفراعنة، ` : ''}
          يجب تفعيل اشتراكك أولاً باستخدام كود التفعيل الساري. لا يمكن لغير المشتركين تحميل الملفات من Google Drive.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              onGoToActivate();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>الانتقال لصفحة إدخال كود التفعيل</span>
          </button>

          <a
            href="https://wa.me/201012345678"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>طلب كود تفعيل عبر واتساب</span>
          </a>
        </div>
      </div>
    </div>
  );
};
