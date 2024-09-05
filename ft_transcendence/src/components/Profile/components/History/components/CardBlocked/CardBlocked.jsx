import styl from './CardBlocked.module.css'
import userImage from '../../../../assets/nouahidi.jpeg'

const CardBlocked = () => {
  return (
    <div className={styl.friends}>
        <div className={styl.CardFriend}>
          <div className={styl.card}>
            <div className={styl.First}>
              <button className={styl.unblock}>
                <p >Unblock</p>
              </button>
            </div>
            <div className={styl.Last}></div>
          </div>
          <div className={styl.User}>
            <div className={styl.image}>
              <img src={userImage}/>
            </div>
            <p >NOUAHDI</p>
          </div>
        </div>
    </div>
  )
}

export default CardBlocked
