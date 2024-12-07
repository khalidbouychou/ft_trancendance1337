import React from 'react'
import style from './PingGame.module.css'
// import React, { useState } from 'react';
import tournoi from '../../assets/tournii.jpeg';
import team from '../../assets/tmvstm.jpeg';
import local from '../../assets/local.jpeg';
import _1vs1 from '../../assets/1vs1.jpeg';
import { Link } from 'react-router-dom';

const PingGame = () => {
  return (
    <div className={style.pingPong}>
      <div className={style.card}>
        <div className={style.cardName}>
          <p >Local</p>
        </div>
        <div className={style.Image}>
          <Link to={"/games/localpong"}><img src={local}/></Link>
        </div>
      </div>
      <div className={style.card}>
        <div className={style.cardName}>
          <p >1 Vs 1</p>
        </div>
        <div className={style.Image}>
          <Link to={"/games/onlinepong"}><img src={_1vs1}/></Link>
        </div>
      </div>
      <div className={style.card}>
        <div className={style.cardName}>
          <p >Tournament</p>
        </div>
        <div className={style.Image}>
          <Link to={"/games/tournament"}><img src={tournoi}/></Link>
        </div>
      </div>
      <div className={style.card}>
        <div className={style.cardName}>
          <p >Remote Tournament</p>
        </div>
        <div className={style.Image}>
          <Link to={"/games/remotetournament"}><img src={tournoi}/></Link>
        </div>
      </div>
      <div className={style.card}>
        <div className={style.cardName}>
          <p >Local Team</p>
        </div>
        <div className={style.Image}>
          <Link to={"/games/localteampong"}><img src={team}/></Link>
        </div>
      </div>
    </div>
  )
}

export default PingGame
