import React from 'react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export const EmployeeForm: React.FC = () => {
  // Form state would be managed with react-hook-form in a real app
  return (
    <form className="bg-white rounded shadow p-4 mt-4 grid gap-4">
      <h3 className="font-bold mb-2">Add/Edit Employee</h3>
      <Input label="Name" placeholder="Name" />
      <Input label="Email" placeholder="Email" />
      <Input label="Role" placeholder="Role" />
      <Button type="submit">Save</Button>
    </form>
  );
};
