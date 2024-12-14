import React from "react";
import styl from "./CardFriend.module.css";

const CardFriend = () => {
  return (
    <div className={styl.cardFriend}>
      <div className={styl.userImage}>
        <div className={styl.extImg}>
          <div className={styl.extImg} style={{width: '57px', height: '67px'}}>
            <img src="image"/>
          </div>
        </div>
      </div>
      <div className={styl.userName}>
        <div className={styl.name}>
          <p >NOUAHIDI</p>
        </div>
        <div className={styl.levels}>
          <div className={styl.level}>
            <p >Ping Pong level: </p>
            <div className={styl.Parallelogram}>5</div>
          </div>
          <div className={styl.level}>
            <p >Ping Pong level: </p>
            <div className={styl.Parallelogram}>5</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardFriend;
