import styl from './CardFriend.module.css'
import userImage from '../../../../assets/nouahidi.jpeg'

const CardFriend = () => {
  return (
    <div className={styl.friends}>
        <div className={styl.CardFriend}>
          <div className={styl.card}>
            <div className={styl.First}></div>
            <div className={styl.Last}>
              <p id={styl.p1}>NOUREDDINE</p>
              <p id={styl.p2}>My Friend</p>
            </div>
          </div>
          <div className={styl.image}>
            <img src={userImage}></img>
            <div className={styl.online}></div>
          </div>
        </div>
    </div>
  )
}

export default CardFriend
