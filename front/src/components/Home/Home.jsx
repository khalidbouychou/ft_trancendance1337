import styl from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { FaSearchengin } from "react-icons/fa6";
import "react-circular-progressbar/dist/styles.css";
import Tmp1 from "./components/Tmp1/Tmp1";
import { useState, useEffect, useContext } from "react";
import Tmp2 from "./components/Tmp2/Tmp2";
import SearchCard from "./components/SearchCard/SearchCard";
import { AuthContext } from "../../UserContext/Context";
import CurveChart from "./components/CurveChart/CurveChart";
import CurveLevel from "./components/CurveLevel/CurveLevel";
import Statistic from "../Profile/components/statistc/Statistic";
import { FaChartArea } from "react-icons/fa";
import { FaMedal } from "react-icons/fa6";
import { ImFontSize } from "react-icons/im";
import { fontString } from "chart.js/helpers";
import { GiCrossMark } from "react-icons/gi";
import { PiGameControllerFill } from "react-icons/pi";

const Home = () => {
  const { user } = useContext(AuthContext);
  const profile_name = user?.user?.profile_name;
  const [filteredPingData, setFilteredPingData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchDataResults = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/pingdata/`);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const sortedData = data
          .sort((a, b) => {
            if (b.level === a.level) {
              return b.wins - a.wins;
            }
            return b.level - a.level;
          })
          .slice(0, 3);

        setFilteredPingData(sortedData);
        const userSpecificData = data.find(
          (item) => item.profile_name === profile_name
        );
        setUserData(userSpecificData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchDataResults();
  }, [profile_name]);

  return (
    <div className={styl.Home}>
      <div className={styl.cont}>
        <div className={styl.head}>
          <h2>HOME</h2>
        </div>
        <div className={styl.first}>
          <div className={styl.result}>
            <div className={styl.card}>
              <p>
                WINS
                <FaMedal />
              </p>
              <p id={styl.sm}>{userData?.data[0]?.wins ?? -5}</p>
            </div>
            <div className={styl.card}>
              <p>
                LOSE
                <GiCrossMark />
              </p>
              <p id={styl.sm}>{userData?.data[0]?.losses ?? -5}</p>
            </div>
            <div className={styl.card}>
              <p>
                GAMES
                <PiGameControllerFill />
              </p>
              <p id={styl.sm}>
                {userData?.data[0]?.losses + userData?.data[0]?.wins ?? -5}
              </p>
            </div>
          </div>
          <div className={styl.top3}>
            <div className={styl.cardRank}>
              <div className={styl.extImg}>
                <div className={styl.intImg}>
                  <img
                    src={filteredPingData?.[1]?.avatar}
                    alt={filteredPingData?.[1]?.profile_name}
                  />
                </div>
              </div>
              <p>
                {filteredPingData?.[1]?.profile_name.length > 8
                  ? filteredPingData?.[1]?.profile_name.substring(0, 8) + "."
                  : filteredPingData?.[1]?.profile_name.toUpperCase()}
              </p>
              <div
                className={styl.nbRank}
                style={{ border: "silver 4px solid" }}
              >
                <p>2</p>
              </div>
            </div>

            <div className={styl.cardRankMd}>
              <div className={styl.extImg}>
                <div className={styl.intImg}>
                  <img
                    src={filteredPingData?.[0]?.avatar}
                    alt={filteredPingData?.[0]?.profile_name}
                  />
                </div>
              </div>
              <p>
                {filteredPingData?.[0]?.profile_name.length > 8
                  ? filteredPingData?.[0]?.profile_name.substring(0, 8) + "."
                  : filteredPingData?.[0]?.profile_name.toUpperCase()}
              </p>
              <div className={styl.nbRank} style={{ border: "gold 4px solid" }}>
                <p>1</p>
              </div>
            </div>

            <div className={styl.cardRank}>
              <div className={styl.extImg}>
                <div className={styl.intImg}>
                  <img
                    src={filteredPingData?.[2]?.avatar}
                    alt={filteredPingData?.[2]?.profile_name}
                  />
                </div>
              </div>
              <p>
                {filteredPingData?.[2]?.profile_name.length > 8
                  ? filteredPingData?.[2]?.profile_name.substring(0, 8) + "."
                  : filteredPingData?.[2]?.profile_name.toUpperCase()}
              </p>
              <div
                className={styl.nbRank}
                style={{ border: "silver 4px solid" }}
              >
                <p>3</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styl.last}>
          <p className={styl.dachHead}>
            <FaChartArea
              style={{ width: "30px", height: "30px", color: "gold" }}
            />{" "}
            Dashboard
          </p>
          <Statistic />
        </div>
      </div>
    </div>
  );
};

export default Home;
