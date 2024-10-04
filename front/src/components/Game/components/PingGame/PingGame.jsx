import React from 'react'
import styl from './PingGame.module.css'
// import React, { useState } from 'react';
import tournoi from '../../assets/tournii.jpeg';
import team from '../../assets/tmvstm.jpeg';
import local from '../../assets/local.jpeg';
import _1vs1 from '../../assets/1vs1.jpeg';

const PingGame = () => {
  return (
    <div className={styl.pingPong}>
      <div className={styl.card}>
        <div className={styl.cardName}>
          <p >Local</p>
        </div>
        <div className={styl.Image}>
          <img src={local}/>
        </div>
      </div>
      <div className={styl.card}>
        <div className={styl.cardName}>
          <p >1 Vs 1</p>
        </div>
        <div className={styl.Image}>
          <img src={_1vs1}/>
        </div>
      </div>
      <div className={styl.card}>
        <div className={styl.cardName}>
          <p >Tournament</p>
        </div>
        <div className={styl.Image}>
          <img src={tournoi}/>
        </div>
      </div>
      <div className={styl.card}>
        <div className={styl.cardName}>
          <p >Local Team</p>
        </div>
        <div className={styl.Image}>
          <img src={team}/>
        </div>
      </div>
    </div>
  )
}

export default PingGame
