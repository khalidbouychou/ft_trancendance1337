import styl from './CardBlocked.module.css'
import userImage from '../../../../assets/nouahidi.jpeg'

const CardBlocked = () => {
  return (
    <div className={styl.CardFriend}>
        <div className={styl.card}>
          <div className={styl.First}>
            <button className={styl.unblock}>
              <p >Unblock</p>
            </button>
          </div>
          <div className={styl.Last}>
            <p id={styl.p1}>NOUREDDINE</p>
          </div>
        </div>
        <div className={styl.image}>
          <img src={userImage}></img>
        </div>
    </div>
  )
}

export default CardBlocked
