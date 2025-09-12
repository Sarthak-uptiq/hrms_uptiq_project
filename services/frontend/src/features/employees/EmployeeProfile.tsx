import React from 'react';

export const EmployeeProfile: React.FC = () => {
  // Mock data
  const employee = {
    name: 'John Doe',
    email: 'john@company.com',
    role: 'employee',
    jobTitle: 'Software Engineer',
    department: 'IT',
    status: 'active',
  };

  return (
    <div className="bg-white rounded shadow p-4 mt-4">
      <h3 className="font-bold mb-2">Employee Profile</h3>
      <ul className="space-y-1">
        <li>Name: <span className="font-semibold">{employee.name}</span></li>
        <li>Email: <span className="font-semibold">{employee.email}</span></li>
        <li>Role: <span className="font-semibold">{employee.role}</span></li>
        <li>Job Title: <span className="font-semibold">{employee.jobTitle}</span></li>
        <li>Department: <span className="font-semibold">{employee.department}</span></li>
        <li>Status: <span className="font-semibold text-green-600">{employee.status}</span></li>
      </ul>
    </div>
  );
};
