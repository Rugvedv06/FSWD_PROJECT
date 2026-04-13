import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, Tooltip, Legend, 
  CategoryScale, LinearScale, PointElement, LineElement, Title
);

const SpendChart = ({ expenses }) => {
  const categoryData = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const doughnutData = {
    labels: Object.keys(categoryData),
    datasets: [{
      label: 'Spending by Category',
      data: Object.values(categoryData),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(248, 113, 113, 0.8)',
        'rgba(45, 212, 191, 0.8)',
        'rgba(251, 191, 36, 0.8)',
      ],
      borderColor: 'rgba(15, 23, 42, 1)',
      borderWidth: 2,
    }]
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'ui-sans-serif', weight: 'bold', size: 10 },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        titleColor: '#e2e8f0',
        bodyColor: '#6366f1',
        usePointStyle: true
      }
    },
    cutout: '70%',
    maintainAspectRatio: false
  };

  return (
    <div className="h-full min-h-[300px] flex items-center justify-center">
      <Doughnut data={doughnutData} options={options} />
    </div>
  );
};

export default SpendChart;