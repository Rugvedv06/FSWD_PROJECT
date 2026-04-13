import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// Center text plugin to render total in middle
const centerText = {
  id: 'centerText',
  beforeDraw(chart) {
    const { ctx, chartArea: { width, height } } = chart;
    ctx.save();
    const total = chart.config._config._data.datasets[0]?.data.reduce((a,b) => a + b, 0) || 0;
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#fff';
    ctx.font = '600 18px system-ui, -apple-system, Roboto, "Helvetica Neue", Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`$${total.toFixed(2)}`, chart.width / 2, chart.height / 2);
    ctx.restore();
  }
};

ChartJS.register(centerText);

const SpendChart = ({ expenses }) => {
  const categoryData = useMemo(() => {
    return expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {});
  }, [expenses]);

  const labels = Object.keys(categoryData);
  const values = Object.values(categoryData);

  // Palettes of yellow shades
  const paletteOuter = ['#FFEDB5', '#FFE7A8', '#FFE28B', '#FFD95E', '#FFD24D', '#E6B800'];
  const paletteMid = ['#FFF7D6', '#FFF2C8', '#FFEBA6', '#FFE38A', '#FFDB6D', '#D4A800'];
  const paletteInner = ['#FFFCEB', '#FFF9E2', '#FFF5D0', '#FFEFBA', '#FFEAA8', '#CFA500'];

  const doughnutData = {
    labels,
    datasets: [
      {
        label: 'inner',
        data: values,
        backgroundColor: labels.map((_, i) => paletteInner[i % paletteInner.length]),
        borderColor: 'rgba(0,0,0,0.06)',
        borderWidth: 1
      },
      {
        label: 'mid',
        data: values.map(v => v * 0.7),
        backgroundColor: labels.map((_, i) => paletteMid[i % paletteMid.length]),
        borderColor: 'rgba(0,0,0,0.06)',
        borderWidth: 1
      },
      {
        label: 'outer',
        data: values.map(v => v * 0.4),
        backgroundColor: labels.map((_, i) => paletteOuter[i % paletteOuter.length]),
        borderColor: 'rgba(0,0,0,0.06)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    cutout: '60%',
    maintainAspectRatio: false
  };

  return (
    <div className="h-full min-h-[320px] flex items-center justify-center">
      <div className="w-full h-[360px] max-w-[680px] neumorph p-4">
        <Doughnut data={doughnutData} options={options} />
      </div>
    </div>
  );
};

export default SpendChart;