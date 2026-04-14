import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 p-4 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow-md)] animate-in slide-in-from-right duration-300"
          style={{
            borderLeft: `4px solid ${
              toast.type === 'success'
                ? 'var(--success)'
                : toast.type === 'error'
                ? 'var(--danger)'
                : 'var(--accent)'
            }`,
          }}
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-[var(--success)]" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5 text-[var(--danger)]" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[var(--accent)]" />}
          
          <span className="text-sm font-medium">{toast.message}</span>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-auto text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
