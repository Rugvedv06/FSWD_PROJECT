import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
        <h3 className="text-xl font-bold mb-2 text-[var(--text)]">{title}</h3>
        <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed">
          {message}
        </p>
        
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="btn-outline flex-1 py-2.5"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-[var(--danger)] text-white hover:opacity-90 transition-all shadow-lg shadow-[var(--danger)]/20"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
