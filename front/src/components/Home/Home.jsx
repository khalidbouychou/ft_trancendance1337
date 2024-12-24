import styl from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../UserContext/Context";
import Statistic from "../Profile/components/statistc/Statistic";
import { FaChartArea } from "react-icons/fa";
import { FaMedal } from "react-icons/fa6";
import { GiCrossMark } from "react-icons/gi";
import { PiGameControllerFill } from "react-icons/pi";
import Chart from "./components/test/Chart";

const Home = () => {
  const { user } = useContext(AuthContext);
  const profile_name = user?.user?.profile_name;
  const [filteredPingData, setFilteredPingData] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleClick = (name) => {
    navigate(`/profile/${name}`);
  };

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
        console.log("ppppll+++>>>", data);
        setPingData(data);
        const userData = data.find((item) => item.username === username);
        // console.log('username***>', item)
        setFilteredPingData(userData);
        // const ticData = await fetch(`http://localhost:8000/api/ticdata/`);
        // const ticDataJson = await ticData.json();
        // setTicData(ticDataJson);
        // const ticUserData = ticDataJson.find((item) => item.username === username);
        // setFilteredTicData(ticUserData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchDataResults();
  }, [profile_name]);
  console.log('----->>>', filteredPingData)
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
              {/* <p id={styl.sm}>{userData?.data[0]?.wins ?? -5}</p> */}
            </div>
            <div className={styl.card}>
              <p>
                LOSE
                <GiCrossMark />
              </p>
              {/* <p id={styl.sm}>{userData?.data[0]?.losses ?? -5}</p> */}
            </div>
            <div className={styl.card}>
              <p>
                GAMES
                <PiGameControllerFill />
              </p>
              <p id={styl.sm}>
                {/* {(userData?.data[0]?.losses + userData?.data[0]?.wins) ?? -5} */}
              </p>
            </div>
          </div>
          <div className={styl.top3}>
            <button
              className={styl.cardRank}
              onClick={() => handleClick(filteredPingData?.[1]?.profile_name)}
            >
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
            </button>

            <button
              className={styl.cardRankMd}
              onClick={() => handleClick(filteredPingData?.[0]?.profile_name)}
            >
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
            </button>

            <button
              className={styl.cardRank}
              onClick={() => handleClick(filteredPingData?.[2]?.profile_name)}
            >
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
            </button>
          </div>
        </div>
        <div className={styl.last}>
          <p className={styl.dachHead}>
            <FaChartArea
              style={{ width: "30px", height: "30px", color: "gold" }}
            />{" "}
            Dashboard
          </p>
          <Statistic userData={userData} profileName={profile_name}/>
        </div>
      </div>
    </div>
  );
};

export default Home;
