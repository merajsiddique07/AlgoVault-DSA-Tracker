import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { type = 'success', message = '' } = toast;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-brand-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30',
    error: 'border-rose-500/30',
    info: 'border-brand-500/30',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border ${borders[type]} shadow-xl text-xs text-slate-800 dark:text-slate-100 font-medium`}
      >
        {icons[type]}
        <span>{message}</span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 ml-2"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
