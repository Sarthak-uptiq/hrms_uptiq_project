import React from 'react';
import { Chart } from '../../components/Chart';

export const KPICards: React.FC = () => {
  // Mock KPI data
  const kpiData = {
    labels: ['Employees', 'Payroll Processed', 'Leaves'],
    datasets: [
      {
        label: 'KPI',
        data: [50, 45, 12],
        backgroundColor: ['#2563eb', '#059669', '#f59e42'],
      },
    ],
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-bold mb-2">HR KPIs</h3>
      <Chart data={kpiData} />
    </div>
  );
};
