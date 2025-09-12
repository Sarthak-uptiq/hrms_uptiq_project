import React from 'react';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { Navbar } from '../components/Navbar';

const PayrollPage: React.FC = () => {
  // Mock payroll data
  const payrolls = [
    { id: 1, name: 'John Doe', month: 'Jan', status: 'Processed', amount: 5000 },
    { id: 2, name: 'Jane Smith', month: 'Jan', status: 'Pending', amount: 4800 },
  ];

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Payroll</h2>
        <Table
          columns={["Name", "Month", "Status", "Amount"]}
          data={payrolls}
          renderRow={row => (
            <>
              <td className="p-2">{row.name}</td>
              <td className="p-2">{row.month}</td>
              <td className="p-2">{row.status}</td>
              <td className="p-2">${row.amount}</td>
            </>
          )}
        />
        <Button className="mt-4">Process Payroll</Button>
      </main>
    </div>
  );
};

export default PayrollPage;
