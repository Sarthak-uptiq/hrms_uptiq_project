import React from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Navbar } from '../components/Navbar';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-6">
        <h2 className="text-xl font-bold mb-4">Company Settings</h2>
        <form className="grid gap-4">
          <Input label="Company Name" value="Acme Corp" readOnly />
          <Input label="Notification Email" value="hr@acme.com" readOnly />
          <Input label="Leave Policy" value="20 days/year" readOnly />
          <Input label="Payroll Cycle" value="Monthly" readOnly />
          <Button className="mt-4">Edit Settings</Button>
        </form>
      </main>
    </div>
  );
};

export default SettingsPage;
