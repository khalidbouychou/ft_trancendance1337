import React from "react";
import styl from "./CardRank.module.css";
import { useNavigate } from "react-router-dom";
const CardRank = ({ player, index , setProfileName}) => {
const navigate = useNavigate();
  const playerData = player.data?.[0] || {};

  const handleCardClick = (profileName) => {
    setProfileName(profileName);
    if (profileName) {
      navigate(`/profile/${profileName}`);
    }
  };

  return (
    <button
      key={player.username || index}
      className={styl.cardRank}
      onClick={() => handleCardClick(player.profile_name)}
    >
      <div className={styl.rank}>
        <p>#{index + 1}</p>
        <div className={styl.extImgLead}>
          <div className={styl.intImgLead}>
            <img
              src={player.avatar || "defaultUserImage.jpg"}
              alt="Player Avatar"
            />
          </div>
        </div>
      </div>
      <div className={styl.playerName}>
        <p>
            {player.profile_name.length > 8
            ? player.profile_name.toUpperCase().slice(0, 6) + "."
            : player.profile_name.toUpperCase()}
        </p>
      </div>
      <div className={styl.wins}>
        <p>{playerData.wins ?? "N/A"}</p>
      </div>
      <div className={styl.loses}>
        <p>{playerData.losses ?? "N/A"}</p>
      </div>
      <div className={styl.lvl}>
        <p>{Math.floor(playerData.exp_game / 100) ?? "N/A"}</p>
      </div>
    </button>
  );
};

export default CardRank;
