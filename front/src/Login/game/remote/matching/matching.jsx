import React, { useEffect, useContext } from 'react';
import './matching.css';
import { AuthContext } from '../../../../UserContext/Context';

const Matching = ({ message , type }) => {
    const { user } = useContext(AuthContext );
  const defaultAvatar =
    'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGFobWZ3cThyenBsdzR2ZXBtOTVua2U1bjBqbGttbXJpNXhodmcxNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iJmDndjwTydcPEeu3p/giphy.gif';

  useEffect(() => {
    if (type === 'start_game') {
      console.log('-----start game: ', message);
    }
    console.log('-----type: ', type);
    console.log('-----message: ', message);
  }, [type, message]);


  const renderPlayerInfo = (player) => {
    return (
      <div className="img-name">
        <img src={player?.avatar || defaultAvatar} alt="avatar" />
        <h1>{player?.username || 'Unknown Player'}</h1>
      </div>
    );
  };

  return (
    <div className="matching-container">
      <div className="cover">
        {
        renderPlayerInfo(user?.user)
        }
        <div className="vs"><h1>VS</h1></div>
        {
          renderPlayerInfo(message?.player2)     
        }
      </div>
      <button className="start-match">Start Match</button>
    </div>
  );
};

export default Matching;
