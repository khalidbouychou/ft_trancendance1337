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

const Chart = ({ matches = [], profileName }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const matchData = matches.map((match) => {
    const formattedDate = formatDate(match.date);
    let userScore = 0
    let opponentScore = 0
    if (match.winner_profile_name === profileName) {
      if (match.left_score > match.right_score) {
        userScore = match.left_score
        opponentScore = match.right_score
      } else {
        userScore = match.right_score;
        opponentScore = match.left_score;
      }
    }
    else {
      if (match.left_score < match.right_score) {
        userScore = match.left_score
        opponentScore = match.right_score
      } else {
        userScore = match.right_score;
        opponentScore = match.left_score;
      }
    }
    return { date: formattedDate, userScore, opponentScore };
  });

  const labels = matchData.map((match) => match.date);
  const userScores = matchData.map((match) => match.userScore);
  const opponentScores = matchData.map((match) => match.opponentScore);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Your Score',
        data: userScores,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Opponent Score',
        data: opponentScores,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
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
        text: 'Match History (Your Scores vs Opponent)',
        color: '#FFFFFF',
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'white',
        },
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const item = tooltipItems[0];
            return item.raw.date; // Use the full date from the raw data
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          display: false,
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
          text: 'Score',
          color: 'white',
        },
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          color: 'rgba(255, 255, 255, 0.6)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
        border: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
    },
  };
  
  

  return <Line data={chartData} options={options} />;
};

export default Chart;
