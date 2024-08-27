import React, { useState } from "react";
import styl from "./History.module.css";
import CardFriend from "./components/CardFriend/CardFriend";
import CardBlocked from "./components/CardBlocked/CardBlocked";
import CardMatch from "./components/CardMatch/CardMatch";

const History = () => {
  const [activeSection, setActiveSection] = useState("matchhistory");

  const handleClick = (section) => {
    setActiveSection(section);
  };

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
          <button
            onClick={() => handleClick("blocked")}
            className={`${styl.Button} ${activeSection === "blocked" ? styl.Clicked : ""}`}
          >
            BLOCKED
          </button>
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
          </div>
        )}
        {activeSection === "blocked" && (
          <div className={styl.blocked}>
            <CardBlocked />
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
