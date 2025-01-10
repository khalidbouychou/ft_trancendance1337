import React, { useEffect, useState } from "react";
import styl from "./History.module.css";
import CardFriend from "./components/CardFriend/CardFriend";
import CardBlocked from "./components/CardBlocked/CardBlocked";
import CardMatch from "./components/CardMatch/CardMatch";
import { IoIosArrowForward } from "react-icons/io";
import Add from "../../assets/Add.svg";
import Chat from "../../assets/Chat.svg";
import Block from "../../assets/Block.svg";
import Settings from "./components/Settings/Settings";
import { RxTextAlignJustify } from "react-icons/rx";

const History = ({ username, ismyprofil }) => {
  const [activeSection, setActiveSection] = useState("matchhistory");
  const [friend, setFriends] = useState([]);
  const [userBlocked, setUserBlocked] = useState([]);
  const [isGame2Visible, setIsGame2Visible] = useState(false);
  const [currentGame, setCurrentGame] = useState("Ping Pong");
  const [isIconRotated, setIsIconRotated] = useState(false);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sett, setSett] = useState('none')

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://10.13.3.2:8000/matches/matches/${username}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch match history");
        }
        const data = await response.json();
        setMatches(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const handleClick = (section) => {
    setActiveSection(section);
  };

  const handleGameChange = () => {
    setCurrentGame(currentGame === "Ping Pong" ? "Tic Tac Toe" : "Ping Pong");
    setIsGame2Visible(false);
    setIsIconRotated(false);
  };

  const handleToggleGame2 = () => {
    setIsGame2Visible(!isGame2Visible);
    setIsIconRotated(!isIconRotated);
  };

  const handelSetClick = () => {
    setSett(prevSett => prevSett === 'none' ? 'flex' : 'none')
  }

  console.log("matches", matches);
  console.log("username", username);
  return (
    <div className={styl.last}>
      <div className={styl.Title}>
        <div className={styl.button}>
          <button
            onClick={() => handleClick("matchhistory")}
            className={`${styl.Button} ${
              activeSection === "matchhistory" ? styl.Clicked : ""
            }`}
          >
            MATCH HISTORY
          </button>
        </div>
        <div className={styl.button}>
          <button
            onClick={() => handleClick("friends")}
            className={`${styl.Button} ${
              activeSection === "friends" ? styl.Clicked : ""
            }`}
          >
            FRIENDS
          </button>
        </div>
        {ismyprofil !== 1 && (
          <div className={styl.button}>
            <button
              onClick={() => handleClick("blocked")}
              className={`${styl.Button} ${
                activeSection === "blocked" ? styl.Clicked : ""
              }`}
            >
              BLOCKED
            </button>
          </div>
        )}
      </div>

      <div className={styl.cont}>
        {activeSection === "matchhistory" && (
          <div className={styl.cont} style={{ flexDirection: "column" }}>
              <button className={styl.sett} onClick={handelSetClick}>
                <RxTextAlignJustify id={styl.butM}/>
                <div className={styl.choiceGame} style={{ display: sett }}>
                  <button className={styl.game} >
                    <p>Ping Pong</p>
                  </button>
                  <button className={styl.game} >
                    <p>Tic Tac Toe</p>
                  </button>
                </div>
              </button>
            <div className={styl.matchHistory}>
              {isLoading ? (
                <p>Loading matches...</p>
              ) : error ? (
                <p>Error: {error}</p>
              ) : (
                matches.map((match) => (
                  <CardMatch key={match.id} match={match} username={username} />
                ))
              )}
            </div>
          </div>
        )}
        {activeSection === "friends" && (
          <div className={styl.friends}>
            {/* Replace with friend data when ready */}
            <p>No friends found</p>
          </div>
        )}
        {activeSection === "blocked" && (
          <div className={styl.block}>
            {/* Replace with blocked data when ready */}
            <p>No blocked users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
