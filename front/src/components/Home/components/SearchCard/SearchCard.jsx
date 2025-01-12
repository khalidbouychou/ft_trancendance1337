import React from 'react';
import styl from './SearchCard.module.css';
import { useNavigate } from 'react-router-dom';

const SearchCard = ({ user }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${user?.username}`);
  };

  return (
    <button className={styl.searchCard} onClick={handleClick}>
      <div className={styl.userImage}>
        <img src={user.avatar} />
      </div>
      <div className={styl.userName}>
        <p>{user?.username}</p>
      </div>
    </button>
  );
};

export default SearchCard;
