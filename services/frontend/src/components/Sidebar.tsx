import React from 'react';

interface SidebarProps {
  links: { label: string; href: string }[];
  active?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ links, active }) => (
  <aside className="w-56 min-h-screen bg-gray-50 border-r p-4">
    <ul className="space-y-2">
      {links.map(link => (
        <li key={link.href}>
          <a
            href={link.href}
            className={`block px-3 py-2 rounded hover:bg-blue-100 ${active === link.href ? 'bg-blue-200 font-bold' : ''}`}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </aside>
);
