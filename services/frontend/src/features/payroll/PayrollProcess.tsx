import React from 'react';
import { Button } from '../../components/Button';

export const PayrollProcess: React.FC = () => {
  return (
    <div className="bg-white rounded shadow p-4 mt-4">
      <h3 className="font-bold mb-2">Process Payroll</h3>
      <Button>Process Payroll</Button>
    </div>
  );
};
