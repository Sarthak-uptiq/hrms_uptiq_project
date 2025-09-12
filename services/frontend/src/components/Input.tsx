import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => (
  <div className="mb-4">
    {label && <label className="block mb-1 font-medium text-gray-700">{label}</label>}
    <input
      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
      {...props}
    />
    {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
  </div>
);
