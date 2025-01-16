import styl from "./CardBlocked.module.css";
import axios from "axios";



const CardBlocked = ({ userBlocked, onUnblock }) => {
  const handleUnblock = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_IP}/api/users/1/unblock_user/`, {
        blocked_user_id: userBlocked.blocked_friend.id,
      });
      if (onUnblock) onUnblock();
    } catch (error) {
    }
  };

  return (
    <div className={styl.friends}>
      <div className={styl.CardFriend}>
        <div className={styl.card}>
          <div className={styl.First}>
            <button className={styl.unblock} onClick={handleUnblock}>
              <p>Unblock</p>
            </button>
          </div>
          <div className={styl.Last}></div>
        </div>
        <div className={styl.User}>
          <div className={styl.image}>
            <img
              src={userBlocked.blocked_friend.image}
              alt={userBlocked.blocked_friend.name}
            />
          </div>
          <p>{userBlocked.blocked_friend.name.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

export default CardBlocked;
