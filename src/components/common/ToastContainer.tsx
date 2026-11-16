import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  // Ambil hanya 1 toast terbaru
  const activeToast = toasts[toasts.length - 1];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div
        key={activeToast.id}
        className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 text-white text-xs font-medium shadow-lg backdrop-blur-sm border border-white/10 transition-all duration-200"
      >
        {getIcon(activeToast.type)}
        <span className="truncate max-w-[260px] sm:max-w-xs">{activeToast.message}</span>
        <button
          onClick={() => dismissToast(activeToast.id)}
          className="ml-1 text-slate-400 hover:text-white transition-colors"
          aria-label="Tutup"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
