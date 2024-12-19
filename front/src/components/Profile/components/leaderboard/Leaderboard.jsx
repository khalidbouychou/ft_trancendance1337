import React, { useState, useEffect } from "react";
import styl from "./Leaderboard.module.css";
import { ImList2 } from "react-icons/im";

const Leaderboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://localhost/api/pingdata`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const fetchedData = await response.json();
        console.log("Fetched Data:", fetchedData);

        // Sort by wins in descending order
        const sortedData = fetchedData.sort((a, b) => b.data[0]?.wins - a.data[0]?.wins);
        setData(sortedData);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styl.leaderboard}>
      <div className={styl.leaderHead}>
        <p id={styl.Rank}>Rank</p>
        <p id={styl.Name}>Name</p>
        <p id={styl.Wins}>Wins</p>
        <p id={styl.Loses}>Loses</p>
        <p id={styl.Loses}>Level</p>
      </div>
      <div className={styl.pingRanking}>
        {data.map((player, index) => {
          const playerData = player.data?.[0] || {};
          return (
            <button key={player.username || index} className={styl.cardRank}>
              <div className={styl.rank}>
                <p>#{index + 1}</p>
                <div className={styl.extImgLead}>
                  <div className={styl.intImgLead}>
                    <img src={player.avatar || "defaultUserImage.jpg"} alt="Player Avatar" />
                  </div>
                </div>
              </div>
              <div className={styl.playerName}>
                <p>{player.profile_name || "Unknown"}</p>
              </div>
              <div className={styl.wins}>
                <p>{playerData.wins ?? "N/A"}</p>
              </div>
              <div className={styl.loses}>
                <p>{playerData.losses ?? "N/A"}</p>
              </div>
              <div className={styl.lvl}>
                <p>{playerData.exp_game ?? "N/A"}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
