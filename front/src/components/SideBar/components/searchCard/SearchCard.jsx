import React from "react";
import styl from "./SearchCard.module.css";
import userImage from "../../assets/nouahidi.jpeg";
import { useNavigate } from "react-router-dom";

const SearchCard = ({ user, isHighlighted }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${user.profile_name}`);
  };

  return (
    <button className={`${styl.searchCard} ${isHighlighted ? styl.highlighted : ""}`} onClick={handleClick}>
      <div className={styl.userImage}>
        <div className={styl.extImg}>
          <div
            className={styl.intImg}
          >
            <img src={user.avatar}></img>
          </div>
        </div>
      </div>
      <p className={styl.userName}>{user.profile_name}</p>
    </button>
  );
};

export default SearchCard;
