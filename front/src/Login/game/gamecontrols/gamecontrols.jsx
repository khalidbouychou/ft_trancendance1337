import React from 'react';

const GameControls = () => {
  return (
    <div className="game-controls">
      Controls: 
      <span className="player-a-controls">Player A (Left): W/S</span>
      <span className="player-b-controls">Player B (Right): Up/Down Arrows</span>
    </div>
  );
};

export default GameControls;