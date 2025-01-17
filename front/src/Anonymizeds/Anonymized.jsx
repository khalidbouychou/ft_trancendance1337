import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Anonymizeds/Anonymized.css';
import { AuthContext } from '../UserContext/Context';

const Anonymizeds = () => {
  const [anonymizeds, setAnonymizeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useContext(AuthContext);

  useEffect(() => {
    const fetchAnonymizeds = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/api/list_anonymized/`, {
          withCredentials: true,
        });
        setAnonymizeds(response.data); 
        setLoading(false);  
      } catch (error) {
        console.error("anonymize", error);
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
              </div>
                <Link to={`/profile/khbouych`} className="view-btn">
                  Back Home
                </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Anonymizeds;
