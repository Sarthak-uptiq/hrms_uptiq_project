import React from 'react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export const CompanySettings: React.FC = () => {
  return (
    <div className="bg-white rounded shadow p-4 mt-4">
      <h3 className="font-bold mb-2">Company Settings</h3>
      <form className="grid gap-4">
        <Input label="Company Name" value="Acme Corp" readOnly />
        <Input label="Notification Email" value="hr@acme.com" readOnly />
        <Input label="Leave Policy" value="20 days/year" readOnly />
        <Input label="Payroll Cycle" value="Monthly" readOnly />
        <Button className="mt-2">Edit Settings</Button>
      </form>
    </div>
  );
};
