import React from 'react';

const WinnerOverlay = ({ winner,BnewScore, AnewScore, Aa ,Ba}) => {
  return (
    <div className="winner-overlay">
      <h2 className="winner-text">"{winner}" Wins!</h2>
      <p>Press SPACE to restart</p>
      <div className='avatar-holder'> 
      <div className='img-score-holder'>
        <div className='img-score'>
          <img className='Aa' src={Aa}/>
          <span className='Score-A'> {AnewScore} </span> 
       </div> 
       <div className='img-score'>
          <img className='Ba' src={Ba}/>
          <span className='Score-B'> {BnewScore} </span>  
       </div>
      </div>
      </div>
    </div>
  );
};

export default WinnerOverlay;