import React from 'react';
import styl from './CardUser.module.css';

const CardUser = ({ user }) => {
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
            <img  src={user.avatar}/>
          </div>
          <button >
            <p>{user.profile_name.toUpperCase()}</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardUser;
