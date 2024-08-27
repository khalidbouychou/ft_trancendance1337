import React, { useState } from "react";
import styl from "./History.module.css";
import CardFriend from "./components/CardFriend/CardFriend";
import CardBlocked from "./components/CardBlocked/CardBlocked";
import CardMatch from "./components/CardMatch/CardMatch";
import Add from '../../assets/Add.svg'
import Chat from '../../assets/Chat.svg'
import Block from '../../assets/Block.svg'
import Settings from "./components/Settings/Settings";

const History = () => {
  const [activeSection, setActiveSection] = useState("matchhistory");

  const handleClick = (section) => {
    setActiveSection(section);
  };

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
        <div className={styl.button}>
        {ismyprofil === 0 ? (
            <button
              onClick={() => handleClick("settings")}
              className={`${styl.Button} ${activeSection === "settings" ? styl.Clicked : ""}`}
            >
              SETTINGS
            </button>
          ) : (
            <button
              onClick={() => handleClick("blocked")}
              className={`${styl.Button} ${activeSection === "blocked" ? styl.Clicked : ""}`}
            >
              BLOCKED
            </button>
          )}
        </div>
      </div>
      <div className={styl.cont}>
        {activeSection === "matchhistory" && (
          <div className={styl.matchHistory}>
            <CardMatch />
          </div>
        )}
        {activeSection === "friends" && (
          <div className={styl.friends}>
            <CardFriend />
            <CardFriend />
            <CardFriend />
            <CardFriend />
            <CardFriend />
            <CardFriend />
            <CardFriend />
          </div>
        )}
        {activeSection === "blocked" && (
          <div className={styl.block}>
            <CardBlocked />
          </div>
        )}
        {activeSection === "settings" && (
            <Settings />
        )}
      </div>
    </div>
  );
};

export default History;
