import React from 'react';

const ScoreBoard = ({ Aa,Ba,playerAScore, playerBScore }) => {
  return (
    <div className="score-board">
       <div className='img-score-board'>
        <img className="aavatar" src={Aa} />
        <span className="player-a-score"> {playerAScore}</span>
       </div>
       <div className='img-score-board'>
          <img className="bavatar" src={Ba} />
          <span className="player-b-score"> {playerBScore}</span> 
      </div>
    </div>
  );
};

export default ScoreBoard;