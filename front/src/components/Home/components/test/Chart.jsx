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

// Register necessary components for Chart.js
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Chart = ({ matches = [], profileName }) => {
  // Format date to 'dd-mm-yyyy'
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Prepare data for the chart
  const matchData = matches.map((match) => {
    const formattedDate = formatDate(match.date);

    // Determine if the user is the winner or loser
    const isWinner = match.winner_profile_name === profileName;
    const isLoser = match.loser_profile_name === profileName;

    // Determine scores for both the user and the opponent
    const userScore = isWinner
      ? match.left_score // User's score as the winner
      : isLoser
      ? match.right_score // User's score as the loser
      : 0;

    const opponentScore = isWinner
      ? match.right_score // Opponent's score when user is the winner
      : isLoser
      ? match.left_score // Opponent's score when user is the loser
      : 0;

    return { date: formattedDate, userScore, opponentScore };
  });

  // Extract labels (dates) and data (scores)
  const labels = matchData.map((match) => match.date);
  const userScores = matchData.map((match) => match.userScore);
  const opponentScores = matchData.map((match) => match.opponentScore);

  const chartData = {
    labels, // Dates
    datasets: [
      {
        label: 'Your Score',
        data: userScores, // User scores
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Opponent Score',
        data: opponentScores, // Opponent scores
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Match History (Your Scores vs Opponent)',
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Score',
        },
        min: 0,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default Chart;
