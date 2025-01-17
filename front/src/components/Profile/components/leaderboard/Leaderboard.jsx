import React, { useState, useEffect } from "react";
import styl from "./Leaderboard.module.css";
import { useNavigate } from "react-router-dom";
import CardRank from "./components/CardRank/CardRank";

const Leaderboard = ({t , setProfileName}) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_IP}/api/pingdata`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const fetchedData = await response.json();
        const sortedData = fetchedData
          .filter((data) => data.profile_name !== "ke3ki3a")
          .sort((a, b) => b.data[0]?.wins - a.data[0]?.wins);
        setData(sortedData);
      } catch (error) {
      }
    };

    fetchData();
  }, [setProfileName]);


  const handleCardClick = (profileName) => {
    setProfileName(profileName);
    if (profileName) {
      navigate(`/profile/${profileName}`);
    }
  };

  return (
    <div className={styl.leaderboard}>
      <div className={styl.leaderHead}>
        <p id={styl.Rank}>{t("Rank")}</p>
        <p id={styl.Name}>{t("Name")}</p>
        <p id={styl.Wins}>{t("Wins")}</p>
        <p id={styl.Loses}>{t("Loss")}</p>
        <p id={styl.Level}>{t("Level")}</p>
      </div>
      <div className={styl.pingRanking}>
        {data.map((player, index) => (
          <CardRank
            key={player.username || index}
            player={player}
            index={index}
            setProfileName={setProfileName}
          />
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
