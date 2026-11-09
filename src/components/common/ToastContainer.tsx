import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-emerald-800 text-white border-emerald-700';
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />;

        if (toast.type === 'error') {
          bg = 'bg-red-800 text-white border-red-700';
          icon = <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-800 text-white border-amber-700';
          icon = <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />;
        } else if (toast.type === 'info') {
          bg = 'bg-blue-800 text-white border-blue-700';
          icon = <Info className="w-5 h-5 text-blue-300 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border text-sm transition-all animate-in slide-in-from-bottom-3 duration-200 ${bg}`}
          >
            {icon}
            <div className="flex-1 font-medium leading-relaxed">{toast.message}</div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
