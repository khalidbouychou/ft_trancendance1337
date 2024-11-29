import React from 'react'
import styl from './Leaderboard.module.css'

const Leaderboard = () => {
  return (
    <div className={styl.leaderboard}>
    <div className={styl.leaderHead}>
      <p id={styl.Rank}>Rank</p>
      <p id={styl.Name}>Name</p>
      <p id={styl.Wins}>Wins</p>
      <p id={styl.Loses}>Loses</p>
      <p id={styl.Level}>Level</p>
    </div>
    <div className={styl.ranking}>
      <button className={styl.cardRank}>
        <div className={styl.rank}>
          <p >#1</p>
          <div className={styl.extImgLead}>
            <div className={styl.intImgLead}>
              <img src='userImage'/>
            </div>
          </div>
        </div>
        <div className={styl.playerName}>
          <p >NOUAHIDI</p>
        </div>
        <div className={styl.wins}>
          <p >15</p>
        </div>
        <div className={styl.loses}>
          <p >5</p>
        </div>
        <div className={styl.lvl}>
          <p >9</p>
        </div>
      </button>
    </div>
  </div>
  )
}

export default Leaderboard
