import React from "react";
import styl from "./CardFriend.module.css";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CardFriend = ({friend}) => {
  console.log("CardFriend", friend.profile_name)
  const [pingData, setPingdata] = useState('')
  const navigate = useNavigate();

  useEffect (() => {
    const fectchData = async () => {
      const response = await axios.get(`http://10.13.10.18:8000/api/pingdata/${friend.profile_name}/` , {
        withCredentials: true,
    });
      setPingdata(response.data)
    }
    fectchData()
  },[friend.profile_name])

  const handleClick = () => {
    navigate(`/profile/${friend.profile_name}`)
  }

  return (
    <div className={styl.cardFriend} onClick={handleClick}>
      <div className={styl.userImage}>
        <div className={styl.extImg}>
          <div className={styl.extImg} style={{width: '57px', height: '67px'}}>
            <img src={friend.avatar}/>
          </div>
        </div>
      </div>
      <div className={styl.userName}>
        <div className={styl.name}>
          <p >{friend.profile_name}</p>
        </div>
        <div className={styl.levels}>
          <div className={styl.level}>
            <p >Ping Pong level: </p>
            <div className={styl.Parallelogram}>{pingData[0]?.exp_game / 100}</div>
          </div>
          <div className={styl.level}>
            <p >Ping Pong exp: </p>
            <div className={styl.Parallelogram}>{pingData[0]?.exp_game}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardFriend;
