import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getCategoryColor } from '../utils/categoryColors';

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendChart = ({ expenses }) => {
  const categoryData = useMemo(() => {
    return expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {});
  }, [expenses]);

  const labels = Object.keys(categoryData);
  const values = Object.values(categoryData);
  const backgroundColors = labels.map(label => getCategoryColor(label));

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColors,
        borderColor: 'var(--surface)',
        borderWidth: 2,
        hoverOffset: 12,
        borderRadius: 4
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#A1A1AA', // Zinc-400 fallback
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 11,
            weight: '600',
            family: 'system-ui'
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                return {
                  text: `${label}: $${value.toFixed(2)}`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: 'transparent',
                  lineWidth: 0,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: '#18181B',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        borderColor: '#27272A',
        borderWidth: 1
      }
    },
    cutout: '75%',
    maintainAspectRatio: false,
    elements: {
      arc: {
        borderWidth: 2
      }
    }
  };

  return (
    <div className="w-full h-full relative group">
      <Doughnut data={data} options={options} />
      <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Total Outflow</p>
        <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
          ${values.reduce((a, b) => a + b, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default SpendChart;