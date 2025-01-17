import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ExpChart = ({ data, playerName, t }) => {
  const beginExp = 100;

  if (!data || data.length === 0) {
    return <p>No match data available to display the chart.</p>;
  }

  const expData = data.reduce(
    (acc, match, index) => {
      const prevExp = acc.exp[acc.exp.length - 1] || beginExp;

      let expChange = 0;
      if (match.winner === playerName) {
        expChange = 10;
      } else if (match.loser === playerName) {
        expChange = 1;
      }

      const newExp = prevExp + expChange;
      acc.exp.push(newExp);
      acc.labels.push(`M.${index + 1}`);
      return acc;
    },
    { exp: [], labels: [] }
  );

  const chartData = {
    labels: expData.labels,
    datasets: [
      {
        label: 'EXP',
        data: expData.exp,
        borderColor: 'rgba(75, 192, 192, 1)', 
        backgroundColor: 'rgba(75, 192, 192, 0.4)', 
        borderWidth: 2,
        tension: 0, 
        stepped: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'white', // Legend text color
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const currentExp = tooltipItem.raw;
            const matchIndex = tooltipItem.dataIndex;
            const expChange =
              matchIndex === 0 ? currentExp - beginExp : currentExp - expData.exp[matchIndex - 1];
            return `EXP: ${currentExp} (${t("Change")}: ${expChange >= 0 ? '+' : ''}${expChange})`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: t("Matches"),
          color: 'white', // X-axis title color
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)', 
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
        border: {
          color: 'rgba(255, 255, 255, 0.6)', 
        },
      },
      y: {
        title: {
          display: true,
          text: 'EXP',
          color: 'white', // Y-axis title color
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.6)', 
        },
        border: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
        min: 100,
      },
    },
  };

  return <Line data={chartData} options={options} style={{ width: '100%', height: '100%' }} />;
};

export default ExpChart;
