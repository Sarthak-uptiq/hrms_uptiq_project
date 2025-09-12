import React from 'react';
import { Button } from '../../components/Button';

export const Recruitment: React.FC = () => {
  // Mock data
  const candidates = [
    { id: 1, name: 'Alice', stage: 'Interview' },
    { id: 2, name: 'Bob', stage: 'Screening' },
  ];

  return (
    <div className="bg-white rounded shadow p-4 mt-4">
      <h3 className="font-bold mb-2">Recruitment</h3>
      <ul className="mb-2">
        {candidates.map(c => (
          <li key={c.id} className="flex justify-between items-center py-1">
            <span>{c.name}</span>
            <span className="text-sm text-gray-500">{c.stage}</span>
          </li>
        ))}
      </ul>
      <Button>Add New Role</Button>
    </div>
  );
};
