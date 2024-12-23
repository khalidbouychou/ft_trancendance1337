import React, { useEffect, useState } from "react";
import styl from "./Statistic.module.css";
// import CurveChart from "../../../Home/components/CurveChart/CurveChart";
import CurveLevel from "../../../Home/components/CurveLevel/CurveLevel";
// import Chart from '../../../Home/components/test/Chart';
import Chart from "../../../Home/components/test/Chart";
import axios from "axios";

const Statistic = ({ userData, profileName }) => {
  const total = userData?.data[0]?.wins + userData?.data[0]?.losses;
  const winPercentage = (userData?.data[0]?.wins / total) * 100;
  const lossPercentage = (userData?.data[0]?.losses / total) * 100;
  const [daTa, setDaTa] = useState([]);
  const data = [
    { time: "Jan", wins: 5, losses: 3 },
    { time: "Feb", wins: 8, losses: 2 },
    { time: "Mar", wins: 4, losses: 5 },
  ];

  const levelData = [
    { level: 1, time: 5 },
    { level: 2, time: 12 },
    { level: 3, time: 20 },
    { level: 4, time: 25 },
  ];
  console.log("profile_name == ", profileName);
  const playerData = {
    wins: 100,
    losses: 200,
    exp_game: 500,
    timestamp: "2024-12-22T12:37:05.581806Z",
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(
        `http://localhost:8000/api/matches/${profileName}/`
      );
      setDaTa(data.data);
    };
    fetchData();
  }, [profileName]);
  console.log("response == ", daTa);
  return (
    <div className={styl.statistic}>
      <div className={styl.upperPart}>
        <div className={styl.circ}>
          <div
            className={styl.chartCir}
            style={{
              background: `conic-gradient(
                  #25233C ${winPercentage}%,  
                  #7667D9 0 ${lossPercentage + winPercentage}%
                  )`,
            }}
          ></div>
          <div className={styl.chartText}>
            <p>Wins: {userData?.data[0]?.wins}</p>
            <p>Losses: {userData?.data[0]?.losses}</p>
          </div>
        </div>
        <div className={styl.CurveChart}>
          <Chart matches={daTa}  profileName={profileName}/>
          {/* <CurveChart data={data} /> */}
        </div>
      </div>
      <div className={styl.bottom}>
        <CurveLevel data={levelData} />
      </div>
    </div>
  );
};

export default Statistic;
