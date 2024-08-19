import CirclePercentage from '../../../Profile/component/Circle/circle'
import styl from './CardRank.module.css'
import UserImage from '../../assets/prf.svg'


const CardRank = () => {
  return (
    <div className={styl.CardRank}>
        <div className={styl.GlobalRankings}>
            <p> #1</p>
            <p>RANK</p>
        </div>
        <div className={styl.Inf}>
            <img src={UserImage}/>
            <p ><a href='http://localhost:3000/' >KHBOUYCH</a></p>
        </div>
        <div className={styl.PositiveMatches}>
            <p>WINS</p>
            <p> 11</p>
        </div>
        <div className={styl.Ratio}>
            <CirclePercentage percentage={20} width={110} height={110}/>
        </div>
    </div>
  )
}

export default CardRank

