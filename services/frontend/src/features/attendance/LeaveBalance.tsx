import React from 'react';

export const LeaveBalance: React.FC = () => {
  // Mock data
  const leave = {
    balance: 12,
    used: 8,
    total: 20,
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-bold mb-2">Leave Balance</h3>
      <ul className="space-y-1">
        <li>Available: <span className="font-semibold text-green-600">{leave.balance}</span></li>
        <li>Used: <span className="font-semibold text-blue-600">{leave.used}</span></li>
        <li>Total: <span className="font-semibold">{leave.total}</span></li>
      </ul>
    </div>
  );
};
