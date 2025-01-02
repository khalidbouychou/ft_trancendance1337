import React, { useEffect, useState } from 'react';
import styl from './MatchHistory.module.css';
import axios from 'axios';
import CardMatch from './components/cardMatch/CardMatch';

const MatchHistory = ({ profileName }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/matches/${profileName}/` , {
          withCredentials: true,
      });
        console.log('response == ', response);

        const sortedMatches = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setMatches(sortedMatches);
      } catch (error) {
        setError('Error fetching match data');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [profileName]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styl.mthistory}>
      <div className={styl.mHead}>
        <p style={{ width: '30%' }}>Opponent</p>
        <p style={{ width: '20%' }}>Result</p>
        <p>Status</p>
        <p>Date & Time</p>
      </div>
      <div className={styl.matches}>
        {matches.map((match, index) => (
          <CardMatch
            key={index}
            match={match}
            profileName={profileName}
            animationDelay={`${0.2 * index}s`}
          />
        ))}
      </div>
    </div>
  );
};

export default MatchHistory;
