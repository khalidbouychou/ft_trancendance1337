import styl from './CardMatch.module.css'
import userImage from '../../../../assets/nouahidi.jpeg'
import { useEffect, useState } from 'react'

const CardMatch = ({match, username}) => {
  console.log('match == ', match)
  const [color, setColor] = useState('rgba(0, 128, 0, 0.3)')
  console.log('aausername == ', match.winner)
  useEffect(() => {
    if (match.winner === username) {
      setColor('rgba(0, 128, 0, 0.3)')
    } else {
      setColor('rgba(255, 0, 0, 0.3)')
    }
  }, [username])
  return (
    <div className={styl.CardMatch} style={{backgroundColor: color}}>
        <div className={styl.Player}>
          <img src={userImage}></img>
          <p >{match.winner}</p>
        </div>
        <div className={styl.ScoreDate}>
          <p >2024-08-24</p>
          <p id={styl.score}>{match.left_score} - {match.right_score}</p>
        </div>
        <div className={styl.Player}>
          <img src={userImage}></img>
          <p >{match.loser}</p>
        </div>
    </div>
  )
}

export default CardMatch
