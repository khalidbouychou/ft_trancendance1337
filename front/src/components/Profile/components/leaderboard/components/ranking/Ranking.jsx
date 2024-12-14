import React from "react";
import styl from "./Ranking.module.css";

const Ranking = ({ data }) => {
    console.log('ddddata == ', data)
  return (
    <div className={styl.Ranking}>
      {data.length > 0 ? (
        data.map((player, index) => (
          <button key={index} className={styl.cardRank}>
            <div className={styl.rank}>
              <p>#{index + 1}</p>
              <div className={styl.extImgLead}>
                <div className={styl.intImgLead}>
                  <img src={player.avatar || "defaultImage.png"} alt="User Avatar" />
                </div>
              </div>
            </div>
            <div className={styl.playerName}>
                <p>{player.profile_name.toUpperCase()}</p>
            </div>
            <div className={styl.wins}>
              <p>{player.data[0].wins}</p>
            </div>
            <div className={styl.loses}>
              <p>{player.data[0].losses}</p>
            </div>
            <div className={styl.lvl}>
              <p>{player.data[0].exp_game / 100}</p>
            </div>
          </button>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Ranking;
