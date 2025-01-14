import React, { useEffect, useState } from "react";
import styl from "./MatchHistory.module.css";
import axios from "axios";
import CardMatch from "./components/cardMatch/CardMatch";

const MatchHistory = ({ profileName, t }) => {
  const [matchees, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(
          `http://${import.meta.env.VITE_BACKEND_IP}/api/matches/${profileName}/`,
          {
            withCredentials: true,
          }
        );
        console.log("response == ", response);

        const sortedMatches = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setMatches(sortedMatches);
      } catch (error) {
        setError("Error fetching match data");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [profileName]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styl.mthistory}>
      <div className={styl.mHead}>
        <p style={{ width: "30%" }}>{t("Opponent")}</p>
        <p style={{ width: "20%" }}>{t("Result")}</p>
        <p>{t("Status")}</p>
        <p>{t("Date & Time")}</p>
      </div>
      {matchees.length > 0 ? (
        <div className={styl.matches}>
          {matchees.map((match, index) => (
            <CardMatch
              key={index}
              match={match}
              profileName={profileName}
              animationDelay={`${0.2 * index}s`}
            />
          ))}
        </div>
      ) : (
        <div className={styl.emptyMt}>
          <p>No match history found</p>
        </div>
      )}
    </div>
  );
};

export default MatchHistory;
