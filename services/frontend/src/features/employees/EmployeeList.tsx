import React from 'react';
import { Table } from '../../components/Table';

export const EmployeeList: React.FC = () => {
  // Mock data
  const employees = [
    { id: 1, name: 'John Doe', email: 'john@company.com', role: 'employee', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'employee', status: 'active' },
    { id: 3, name: 'Bob HR', email: 'bob@company.com', role: 'hr', status: 'active' },
  ];

  return (
    <div className="bg-white rounded shadow p-4 mt-4">
      <h3 className="font-bold mb-2">Employee Directory</h3>
      <Table
        columns={["Name", "Email", "Role", "Status"]}
        data={employees}
        renderRow={row => (
          <>
            <td className="p-2">{row.name}</td>
            <td className="p-2">{row.email}</td>
            <td className="p-2">{row.role}</td>
            <td className="p-2">{row.status}</td>
          </>
        )}
      />
    </div>
  );
};
