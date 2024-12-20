import React, { useEffect, useState } from 'react'
import styl from './MatchHistory.module.css'
import { useFetcher } from 'react-router-dom'
import axios from 'axios'

const MatchHistory = ({profileName}) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/matches/${profileName}/`);
        console.log('response == ', response)
        setMatches(response.data);
      } catch (error) {
        setError('Error fetching match data');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [profileName]);
  console.log('dataaa', matches);
  return (
    <div className={styl.mthistory}>
    <div className={styl.mHead}>
      <p style={{width: '30%'}}>Opponent</p>
      <p style={{width: '20%'}}>Result</p>
      <p >Status</p>
      <p >Date & Time</p>
    </div>
    <div className={styl.matches}>
    {/* {matches.map((match, index) => (
          <div key={index} className={styl.cardMatch}>
            <div className={styl.opponent}>
              <div className={styl.extImgOpp}>
                <div className={styl.intImgOpp}>
                  <img src={match.opponent_image || 'default_image_url'} alt={match.opponent_name} />
                </div>
              </div>
              <p>{match.opponent_name}</p>
            </div>
            <div className={styl.res}>
              <p>{match.score}</p>
            </div>
            <div className={styl.status_date}>
              <p>{match.status}</p>
            </div>
            <div className={styl.status_date}>
              <p className={styl.date}>
                <p>{match.date}</p>
                <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '10px' }}>
                  {match.time}
                </p>
              </p>
            </div>
          </div>
        ))} */}
      <div className={styl.cardMatch}>
        <div className={styl.opponent}>
          <div className={styl.extImgOpp}>
            <div className={styl.intImgOpp}>
              <img src='image'/>
            </div>
          </div>
          <p >NOUAHIDI</p>
        </div>
        <div className={styl.res}>
          <p >9 - 1</p>
        </div>
        <div className={styl.status_date}>
          <p >vectory</p>
        </div>
        <div className={styl.status_date}>
          <p className={styl.date}><p >2014-11-27</p><p style={{color: 'rgba(255, 255, 255, 0.4)', fontSize: '10px'}}>13 : 37</p></p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default MatchHistory
