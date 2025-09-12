import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
  data: any;
  options?: any;
}

export const Chart: React.FC<ChartProps> = ({ data, options }) => (
  <div className="w-full h-64">
    <Bar data={data} options={options} />
  </div>
);
