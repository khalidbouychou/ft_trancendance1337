import React from "react";
import styl from "./CardMatch.module.css";
import { useNavigate } from "react-router-dom";

const CardMatch = ({ match, profileName, animationDelay }) => {
  const navigate = useNavigate();
  const opponent = match.winner === profileName ? match.loser : match.winner;
  const status = match.winner === profileName ? "Victory" : "Defeat";
  const score = `${match.left_score} - ${match.right_score}`;
  const color = match.winner === profileName ? "linear-gradient(to right, #006437, #00b378)" : "linear-gradient(to right, #64000e, #8b0000)";
  const [date, time] = match.date.split("T");
  const formattedTime = time.slice(0, 5);
  const image =
    match.winner === profileName ? match.winner_avatar : match.loser_avatar;

  const handleClick = () => {
    navigate(`/profile/${opponent}`, { replace: true });
  };

  return (
    <button
      className={styl.cardMatch}
      onClick={handleClick}
      style={{ animationDelay, background: color }}
    >
      <div className={styl.opponent}>
        <div className={styl.extImgOpp}>
          <div className={styl.intImgOpp}>
            <img src={image} alt={`${opponent}'s avatar`} />
          </div>
        </div>
        <p>
          {opponent.length > 8
            ? opponent.toUpperCase().slice(0, 6) + "."
            : opponent.toUpperCase()}
        </p>
      </div>
      <div className={styl.res}>
        <p>{score}</p>
      </div>
      <div className={styl.status_date}>
        <p>{status}</p>
      </div>
      <div className={styl.status_date}>
        <p className={styl.date}>
          <p>{date}</p>
          <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "10px" }}>
            {formattedTime}
          </p>
        </p>
      </div>
    </button>
  );
};

export default CardMatch;
