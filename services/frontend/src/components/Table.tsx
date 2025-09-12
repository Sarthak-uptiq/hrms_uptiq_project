import React from 'react';

interface TableProps {
  columns: string[];
  data: any[];
  renderRow?: (row: any) => React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ columns, data, renderRow }) => (
  <table className="w-full border-collapse mt-4">
    <thead>
      <tr>
        {columns.map(col => (
          <th key={col} className="bg-gray-100 p-2 text-left border-b">{col}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, idx) => (
        <tr key={idx} className="border-b">
          {renderRow
            ? renderRow(row)
            : columns.map(col => <td key={col} className="p-2">{row[col]}</td>)}
        </tr>
      ))}
    </tbody>
  </table>
);
