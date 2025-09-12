import React from 'react';

interface NavbarProps {
  user?: { name: string; role: string };
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => (
  <nav className="flex items-center justify-between px-6 py-3 bg-white shadow">
    <div className="font-bold text-lg text-blue-700">HRMS Platform</div>
    <div className="flex items-center gap-4">
      {user && (
        <span className="text-sm text-gray-600">{user.name} ({user.role})</span>
      )}
      {onLogout && (
        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={onLogout}>
          Logout
        </button>
      )}
    </div>
  </nav>
);
