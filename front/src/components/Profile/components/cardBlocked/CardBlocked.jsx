import React from "react";
import styl from "./CardBlocked.module.css";
import { color } from "chart.js/helpers";

const CardBlocked = ({user}) => {
  return (
    <div className={styl.cardBlocked}>
      <div className={styl.extImg} style={{left: '8%'}}>
        <div
          className={styl.extImg}
          style={{ width: "57px", height: "67px" }}
        >
            <img src={user.avatar} />
        </div>
      </div>
      <div className={styl.name}>
        <p style={{color: 'white', fontSize: '16px'}}>{user.profile_name}</p>
      </div>
    </div>
  );
};

export default CardBlocked;
