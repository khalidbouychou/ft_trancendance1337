import styl from './CardFriend.module.css'
import userImage from '../../../../assets/nouahidi.jpeg'

const CardFriend = ({ friend }) => {
  console.log(friend)
  return (
    <div className={styl.friends}>
        <div className={styl.CardFriend}>
          <div className={styl.card}>
            <div className={styl.First}></div>
            <div className={styl.Last}>
              <p id={styl.p2}>My Friend</p>
            </div>
          </div>
          <div className={styl.User}>
            <div className={styl.image}>
              <img src={friend.friend.image}/>
              <div className={styl.online}></div>
            </div>
            <p >{friend.friend.name}</p>
          </div>
        </div>
    </div>
  )
}

export default CardFriend
