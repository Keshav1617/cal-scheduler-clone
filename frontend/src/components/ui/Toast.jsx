import { useEffect } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

const typeClasses = {
  success: 'bg-[#1C1C1C] border border-zinc-800 text-white shadow-2xl',
  error: 'bg-red-600 text-white',
  info: 'bg-slate-800 text-slate-50',
  warning: 'bg-amber-500 text-slate-900',
};

function ToastItem({ toast }) {
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const id = setTimeout(() => removeToast(toast.id), 4000);
    return () => clearTimeout(id);
  }, [toast.id, removeToast]);

  return (
    <div
      className={clsx(
        'pointer-events-auto mb-3 flex w-full max-w-sm items-start gap-3 rounded-lg px-4 py-3 shadow-lg ring-1 ring-black/10',
        typeClasses[toast.type]
      )}
    >
      <div className="flex-1">
        {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
        {toast.message && <p className="mt-0.5 text-xs opacity-90">{toast.message}</p>}
      </div>
      <button
        type="button"
        onClick={() => removeToast(toast.id)}
        className="mt-0.5 text-xs opacity-70 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-end px-4 sm:items-end sm:px-6">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

export default ToastContainer;

