import React from 'react';

export const AttendanceSummary: React.FC = () => {
  // Mock data
  const attendance = {
    present: 20,
    absent: 2,
    late: 1,
    total: 23,
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-bold mb-2">Attendance Summary</h3>
      <ul className="space-y-1">
        <li>Present: <span className="font-semibold text-green-600">{attendance.present}</span></li>
        <li>Absent: <span className="font-semibold text-red-600">{attendance.absent}</span></li>
        <li>Late: <span className="font-semibold text-yellow-600">{attendance.late}</span></li>
        <li>Total Days: <span className="font-semibold">{attendance.total}</span></li>
      </ul>
    </div>
  );
};
