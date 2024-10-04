import React from 'react'
import styl from './ChooseGame.module.css'
import {Swiper, SwiperSlide} from 'swiper'

const ChooseGame = () => {
  return (
    <div className={styl.chouseGame}>
      <div className={styl.cardGame}>
        <div className={styl.game}>
          <div className={styl.gameName}>
            <p >Tic Tac Toe</p>
          </div>
          <div className={styl.image}>
            <img src={tic}/>
          </div>
        </div>
      </div>
      <div className={styl.cardGame}>
      <div className={styl.game}>
          <div className={styl.gameName}>
            <p >Ping Pong</p>
          </div>
          <div className={styl.image}>
            <img src={ping}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChooseGame
