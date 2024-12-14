import React from 'react'
import styl from './MatchHistory.module.css'

const MatchHistory = () => {
  return (
    <div className={styl.mthistory}>
    <div className={styl.mHead}>
      <p style={{width: '30%'}}>Opponent</p>
      <p style={{width: '20%'}}>Result</p>
      <p >Status</p>
      <p >Date & Time</p>
    </div>
    <div className={styl.matches}>
      <div className={styl.cardMatch}>
        <div className={styl.opponent}>
          <div className={styl.extImgOpp}>
            <div className={styl.intImgOpp}>
              <img src='image'/>
            </div>
          </div>
          <p >NOUAHIDI</p>
        </div>
        <div className={styl.res}>
          <p >9 - 1</p>
        </div>
        <div className={styl.status_date}>
          <p >vectory</p>
        </div>
        <div className={styl.status_date}>
          <p className={styl.date}><p >2014-11-27</p>
          <p style={{color: 'rgba(255, 255, 255, 0.4)', fontSize: '10px'}}>13 : 37</p></p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default MatchHistory
