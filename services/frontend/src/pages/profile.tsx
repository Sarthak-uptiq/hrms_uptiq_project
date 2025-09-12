import React from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Navbar } from '../components/Navbar';

const ProfilePage: React.FC = () => {
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john@company.com',
    role: 'employee',
    jobTitle: 'Software Engineer',
    department: 'IT',
    payrollHistory: [
      { month: 'Jan', amount: 5000 },
      { month: 'Feb', amount: 5000 },
    ],
  };

  return (
    <div>
      <Navbar user={user} />
      <main className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-6">
        <h2 className="text-xl font-bold mb-4">Profile</h2>
        <div className="grid gap-4">
          <Input label="Name" value={user.name} readOnly />
          <Input label="Email" value={user.email} readOnly />
          <Input label="Role" value={user.role} readOnly />
          <Input label="Job Title" value={user.jobTitle} readOnly />
          <Input label="Department" value={user.department} readOnly />
        </div>
        <h3 className="mt-6 mb-2 font-semibold">Payroll History</h3>
        <table className="w-full border mt-2">
          <thead>
            <tr>
              <th className="p-2 border">Month</th>
              <th className="p-2 border">Amount</th>
            </tr>
          </thead>
          <tbody>
            {user.payrollHistory.map((row, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{row.month}</td>
                <td className="p-2 border">${row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button className="mt-6">Edit Profile</Button>
      </main>
    </div>
  );
};

export default ProfilePage;
