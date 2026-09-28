import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      id="toast"
      className="fixed bottom-6 right-6 z-50 bg-primary-container text-on-primary px-space-md py-space-sm rounded-lg shadow-xl flex items-center gap-space-sm animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      <span className="material-symbols-outlined text-secondary text-base">
        check_circle
      </span>
      <span className="font-body-sm text-body-sm font-semibold">{message}</span>
    </div>
  );
};
