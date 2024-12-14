import React from 'react'
import styl from './Statistic.module.css'
import CurveChart from '../../../Home/components/CurveChart/CurveChart'
import CurveLevel from '../../../Home/components/CurveLevel/CurveLevel'

const Statistic = () => {
    const total = 15 + 10;
    const winPercentage = (15 / total) * 100;
    const lossPercentage = (10 / total) * 100;
    const data = [
      { time: 'Jan', wins: 5, losses: 3 },
      { time: 'Feb', wins: 8, losses: 2 },
      { time: 'Mar', wins: 4, losses: 5 },
    ]

    const levelData = [
      { level: 1, time: 5 },
      { level: 2, time: 12 },
      { level: 3, time: 20 },
      { level: 4, time: 25 },
    ];
    return (
      <div className={styl.statistic}>
      <div className={styl.upperPart}>
          <div className={styl.circ}>
              <div className={styl.chartCir} style={{
                  background: `conic-gradient(
                  #25233C ${winPercentage}%,  
                  #7667D9 0 ${lossPercentage + winPercentage}%
                  )`,
              }}>
              </div>
              <div className={styl.chartText}>
                  <p>Wins: 5</p>
                  <p>Losses: 4</p>
              </div>
          </div>
          <div className={styl.CurveChart}>
              <CurveChart data={data} />
          </div>
      </div>
      <div className={styl.bottom}>
          <CurveLevel data={levelData}/>
      </div>
    </div>
    )
}

export default Statistic
