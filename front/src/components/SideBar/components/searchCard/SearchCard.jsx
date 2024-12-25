import React from "react";
import styl from "./SearchCard.module.css";
import userImage from "../../assets/nouahidi.jpeg";
import { useNavigate } from "react-router-dom";

const SearchCard = ({ user }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${user.profile_name}`);
  };

  return (
    <button className={styl.searchCard} onClick={handleClick}>
      <div className={styl.userImage}>
        <div className={styl.intImg}>
          <div
            className={styl.intImg}
            style={{ width: "50px", height: "55px", backgroundColor: "white" }}
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
