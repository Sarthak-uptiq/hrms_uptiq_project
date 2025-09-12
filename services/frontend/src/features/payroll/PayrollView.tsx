import React from 'react';
import { Table } from '../../components/Table';

export const PayrollView: React.FC = () => {
  // Mock payroll data
  const payrolls = [
    { id: 1, month: 'Jan', status: 'Processed', amount: 5000 },
    { id: 2, month: 'Feb', status: 'Pending', amount: 4800 },
  ];

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-bold mb-2">Payroll Preview</h3>
      <Table
        columns={["Month", "Status", "Amount"]}
        data={payrolls}
        renderRow={row => (
          <>
            <td className="p-2">{row.month}</td>
            <td className="p-2">{row.status}</td>
            <td className="p-2">${row.amount}</td>
          </>
        )}
      />
    </div>
  );
};
