import React from 'react'
// import styl from './PingGame.module.css'
import './PingGame.css'
// import React, { useState } from 'react';
import tournoi from '../../assets/tournii.jpeg';
import team from '../../assets/tmvstm.jpeg';
import local from '../../assets/local.jpeg';
import _1vs1 from '../../assets/1vs1.jpeg';
import { Link } from 'react-router-dom';

const PingGame = () => {
  return (
    <div className='container-games'>
      <div className='local'>
        <img src="https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg" />
        <h2 > Local Turnoi</h2>
      </div>
      <div className='remote'>
        remote turnoi
      </div>
      <div className='friendvsfriend'>
        1vs1
      </div>
      <div className='game3d'>
        3d hame
      </div>
      <div className='turnoiremote'>
        turnoi remote
      </div>
      <div className='turnoiremote'>
        turnoi remote
      </div>
    </div>
  )
}

export default PingGame
