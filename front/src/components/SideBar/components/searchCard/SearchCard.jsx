import React from "react";
import styl from "./SearchCard.module.css";
import userImage from "../../assets/nouahidi.jpeg";

const SearchCard = ({ user }) => {
  return (
    <button className={styl.searchCard}>
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
      <p className={styl.userName}>{user.username}</p>
    </button>
  );
};

export default SearchCard;
