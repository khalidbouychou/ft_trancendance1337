import React, { useState } from "react";
import styl from "./Leaderboard.module.css";
import { ImList2 } from "react-icons/im";


const Leaderboard = () => {
  const [openChooseGame, setOpenChooseGame] = useState('none')
  const [game, setGame] = useState('ping')
  const handelChooseClick = () => {
    setOpenChooseGame(openChooseGame === 'none'? 'flex' : 'none')
  }
  return (
    <div className={styl.leaderboard}>
      <div className={styl.leaderHead}>
        <p id={styl.Rank}>Rank</p>
        <p id={styl.Name}>Name</p>
        <p id={styl.Wins}>Wins</p>
        <p id={styl.Loses}>Loses</p>
        <p id={styl.Level}>Level</p>
        <button className={styl.chooseGame} onClick={handelChooseClick}>
          <ImList2 />
          <div className={styl.games} style={{display: openChooseGame}}>
            <button ><p >Ping Pong</p></button>
            <button ><p >Tic Tac Toe</p></button>
          </div>
        </button>
      </div>
      <div className={styl.pingRanking}>
        <button className={styl.cardRank}>
          <div className={styl.rank}>
            <p>#1</p>
            <div className={styl.extImgLead}>
              <div className={styl.intImgLead}>
                <img src="userImage" />
              </div>
            </div>
          </div>
          <div className={styl.playerName}>
            <p>NOUAHIDI</p>
          </div>
          <div className={styl.wins}>
            <p>15</p>
          </div>
          <div className={styl.loses}>
            <p>5</p>
          </div>
          <div className={styl.lvl}>
            <p>9</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
