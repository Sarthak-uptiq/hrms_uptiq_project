import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info' }) => (
  <div
    className={`fixed top-6 right-6 px-4 py-2 rounded shadow-lg z-50 text-white ${
      type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'
    }`}
    role="alert"
    aria-live="assertive"
  >
    {message}
  </div>
);
