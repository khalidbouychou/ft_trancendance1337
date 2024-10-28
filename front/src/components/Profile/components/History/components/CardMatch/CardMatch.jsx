import styl from './CardMatch.module.css'
import userImage from '../../../../assets/nouahidi.jpeg'

const CardMatch = ({match}) => {
  console.log('match == ', match)
  return (
    <div className={styl.CardMatch}>
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
          <p >match.loser</p>
        </div>
    </div>
  )
}

export default CardMatch
