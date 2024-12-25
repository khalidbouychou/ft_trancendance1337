import React, { useState, useEffect } from "react";
import styl from "./Leaderboard.module.css";
import { useNavigate } from "react-router-dom";
import CardRank from "./components/CardRank/CardRank";

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/pingdata`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const fetchedData = await response.json();
        console.log("Fetched Data:", fetchedData);

        const sortedData = fetchedData
          .filter((data) => data.profile_name !== "ke3ki3a")
          .sort((a, b) => b.data[0]?.wins - a.data[0]?.wins);
        setData(sortedData);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (profileName) => {
    if (profileName) {
      navigate(`/profile/${profileName}`);
    }
  };

  return (
    <div className={styl.leaderboard}>
      <div className={styl.leaderHead}>
        <p id={styl.Rank}>Rank</p>
        <p id={styl.Name}>Name</p>
        <p id={styl.Wins}>Wins</p>
        <p id={styl.Loses}>Loses</p>
        <p id={styl.Level}>Level</p>
      </div>
      <div className={styl.pingRanking}>
        {data.map((player, index) => (
          <CardRank
            key={player.username || index}
            player={player}
            index={index}
            handleCardClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
