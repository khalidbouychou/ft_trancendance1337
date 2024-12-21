import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Anonymizeds/Anonymized.css';

const Anonymizeds = () => {
  const [anonymizeds, setAnonymizeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnonymizeds = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/list_anonymized/', {
          withCredentials: true,
        });
        setAnonymizeds(response.data);  // Set the list of anonymized accounts
        setLoading(false);  // Set loading to false when the data is fetched
      } catch (error) {
        console.error('Error fetching anonymized accounts:', error);
        setLoading(false);
      }
    };

    fetchAnonymizeds();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading text while data is being fetched
  }

  return (
    <div className="anonymizeds-container">
      <h2>List of Anonymized Accounts</h2>
      <div className="card-container">
        {anonymizeds.length === 0 ? (
          <p>No anonymized accounts found.</p>
        ) : (
          anonymizeds.map((account) => (
            <div key={account.player} className="card">
              <img
                src={account.avatar}
                alt={account.profile_name}
                className="avatar"
              />
              <div className="card-content">
                <h3>{account.profile_name}</h3>
                <p>Player: {account.player}</p>
                <p>Status: {account.status_network}</p>
                {/* <Link to={`/anonymizeds/${account.player}`} className="view-btn">
                  View Details
                </Link> */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Anonymizeds;
