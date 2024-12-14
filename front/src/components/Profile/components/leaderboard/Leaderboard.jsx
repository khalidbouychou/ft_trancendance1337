import React, { useState, useEffect } from "react";
import styl from "./Leaderboard.module.css";
import { ImList2 } from "react-icons/im";
import Ranking from "./components/ranking/Ranking";

const Leaderboard = () => {
  const [openChooseGame, setOpenChooseGame] = useState(false);
  const [game, setGame] = useState("ping");
  const [rankingData, setRankingData] = useState([]);

  const handleChooseClick = () => {
    setOpenChooseGame(!openChooseGame);
  };

  const handleGameSelection = (selectedGame) => {
    setGame(selectedGame);
    setOpenChooseGame(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/${game}data/`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setRankingData(data);
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };
    fetchData();
  }, [game]);

  return (
    <div className={styl.leaderboard}>
      <div className={styl.leaderHead}>
        <p id={styl.Rank}>Rank</p>
        <p id={styl.Name}>Name</p>
        <p id={styl.Wins}>Wins</p>
        <p id={styl.Loses}>Loses</p>
        <p id={styl.Level}>Level</p>
        <button className={styl.chooseGame} onClick={handleChooseClick}>
          <ImList2 />
          {openChooseGame && (
            <div className={styl.games}>
              <button
                onClick={() => handleGameSelection("ping")}
                style={{
                  backgroundColor: game === "ping" ? "rgb(130, 130, 5)" : "none",
                }}
              >
                <p>Ping Pong</p>
              </button>
              <button
                onClick={() => handleGameSelection("tic")}
                style={{
                  backgroundColor: game === "tic" ? "rgb(130, 130, 5)" : "none",
                }}
              >
                <p>Tic Tac Toe</p>
              </button>
            </div>
          )}
        </button>
      </div>
      <Ranking data={rankingData} />
    </div>
  );
};

export default Leaderboard;
