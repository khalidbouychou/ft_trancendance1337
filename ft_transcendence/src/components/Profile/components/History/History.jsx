import React, { useEffect, useState } from "react";
import styl from "./History.module.css";
import CardFriend from "./components/CardFriend/CardFriend";
import CardBlocked from "./components/CardBlocked/CardBlocked";
import CardMatch from "./components/CardMatch/CardMatch";
import Add from '../../assets/Add.svg'
import Chat from '../../assets/Chat.svg'
import Block from '../../assets/Block.svg'
import Settings from "./components/Settings/Settings";
import axios from "axios";

const History = ({ onFriendClick, id } ) => {
  const [activeSection, setActiveSection] = useState("matchhistory");
  const [friend, setFriends] = useState([]);
  const [userBlocked, setUserBlocked] = useState([]);

  const fetchUserFriends = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/${id}/user_friends/`);
      setFriends(response.data);
      console.log('Fetched friends:', response.data);
    }
    catch {
      console.error("Error fetching user friends")
    }
  };

  useEffect(() => {
    fetchUserFriends();
  },[])

  const handleClick = (section) => {
    setActiveSection(section);
  };

  const fetchUserBlocked = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/${id}/user_blocked_friends/`);
      setUserBlocked(response.data);
    }
    catch {
      console.error("Error fetching user blocked friends")
    }
  };

  useEffect(() => {
    fetchUserBlocked();
  },[])

  const ismyprofil = 0


  return (
    <div className={styl.last}>
      <div className={styl.Title}>
        <div className={styl.button}>
          <button
            onClick={() => handleClick("matchhistory")}
            className={`${styl.Button} ${activeSection === "matchhistory" ? styl.Clicked : ""}`}
          >
            MATCH HISTORY
          </button>
        </div>
        <div className={styl.button}>
          <button
            onClick={() => handleClick("friends")}
            className={`${styl.Button} ${activeSection === "friends" ? styl.Clicked : ""}`}
          >
            FRIENDS
          </button>
        </div>
        {ismyprofil !== 1 ? (
          <div className={styl.button}>
            <button
              onClick={() => handleClick("blocked")}
              className={`${styl.Button} ${activeSection === "blocked" ? styl.Clicked : ""}`}
            >
              BLOCKED
            </button>
          </div>
        ) : (
          null
        )}
      </div>
      <div className={styl.cont}>
        {activeSection === "matchhistory" && (
          <div className={styl.matchHistory}>
            <CardMatch />
          </div>
        )}
        {activeSection === "friends" && (
          <div className={styl.friends}>
            {friend.map((friend) => (
              <CardFriend key={friend.id} friend={friend} onClick={onFriendClick}/>
            ))}
          </div>
        )}
        {activeSection === "blocked" && (
          <div className={styl.block}>
            {userBlocked.map((userBlocked) => (
              <CardBlocked key={userBlocked.id} userBlocked={userBlocked}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
