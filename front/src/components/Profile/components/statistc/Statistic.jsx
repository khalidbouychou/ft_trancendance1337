import React, { useEffect, useState } from "react";
import styl from "./Statistic.module.css";
// import CurveChart from "../../../Home/components/CurveChart/CurveChart";
import CurveLevel from "../../../Home/components/CurveLevel/CurveLevel";
// import Chart from '../../../Home/components/test/Chart';
import Chart from "../../../Home/components/test/Chart";
import axios from "axios";
import CircularLevel from "./CirculeLevel/CercleLevel";

const Statistic = ({ userData, profileName }) => {
  const total = userData?.data[0]?.wins + userData?.data[0]?.losses;
  let winPercentage = (userData?.data[0]?.wins / total) * 100;
  let lossPercentage = (userData?.data[0]?.losses / total) * 100;
  const [daTa, setDaTa] = useState([]);
  const [level, setLevel] = useState(50);
  if (!winPercentage && !lossPercentage) {
    winPercentage = 50
    lossPercentage = 50
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(
        `http://localhost:8000/api/matches/${profileName}/`
      );
      setDaTa(data.data);
    };
    fetchData();
  }, [profileName]);

  console.log("response == ", (userData?.data[0]?.exp_game % 100));
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
            <p>Wins: {winPercentage}%</p>
            <p>Losses: {lossPercentage}%</p>
          </div>
        </div>
        <div className={styl.CurveChart}>
          <Chart matches={daTa} profileName={profileName} />
        </div>
      </div>
      <div className={styl.bottom}>
        <div className={styl.cirLevel}>
          {/* <div className={styl.circle}> */}
            <CircularLevel percentage={userData?.data[0]?.exp_game % 100} color="#660da5" width={250} height={250} />
        </div>
        <div className={styl.level_exp}>
          <CurveLevel data={daTa} playerName={profileName} style={{width: '50%'}}/>
        </div>
      </div>
    </div>
  );
};

export default Statistic;
