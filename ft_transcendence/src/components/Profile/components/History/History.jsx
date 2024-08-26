import styl from "./History.module.css"
import userImage from "../../assets/nouahidi.jpeg"
// import Add from "../../assets/Add.svg"
// import Chat from "../../assets/Chat.svg"
// import Block from "../../assets/Block.svg"
import { useState, useEffect } from "react"
import CardFriend from "./components/CardFriend/CardFriend";
import CardBlocked from "./components/CardBlocked/CardBlocked";
import CardMatch from "./components/CardMatch/CardMatch";
// import Big from './components/Big/Big'
// import Small from "./components/Small/Small"



const History = () => {
  const ismyprofil = 0
  const [activeSection, setActiveSection] = useState("matchhistory")
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardWidth = width <= 1800 ? '320px' : '400px';

  return (
    <div className={styl.last}>
      <div className={styl.Title}>
        <button
          onClick={() => setActiveSection("matchhistory")}
          className={styl.Button}
        >
          MATCH HISTORY
        </button>
        <button
          onClick={() => setActiveSection("friends")}
          className={styl.Button}
        >
          FRIENDS
        </button>
        <button
          onClick={() => setActiveSection("blocked")}
          className={styl.Button}
        >
          BLOCKED
        </button>
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