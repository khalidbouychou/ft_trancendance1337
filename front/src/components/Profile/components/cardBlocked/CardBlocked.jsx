import React from "react";
import styl from "./CardBlocked.module.css";
import { color } from "chart.js/helpers";

const CardBlocked = ({user}) => {
  return (
    <div className={styl.cardBlocked}>
      <div className={styl.extImg} style={{left: '5%'}}>
        <div
          className={styl.extImg}
          style={{ width: "57px", height: "67px" }}
        >
            <img src={user.avatar} />
        </div>
      </div>
      <div className={styl.name}>
        <p style={{color: 'white', fontSize: '16px'}}>{user.profile_name}</p>
        <p ><p >Deletion Date : </p><p >2024-12-22</p></p>
      </div>
      <button className={styl.unblock}>unblock</button>
    </div>
  );
};

export default CardBlocked;
