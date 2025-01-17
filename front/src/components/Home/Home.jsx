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
import { use } from "react";

const Home = () => {
  const { user, t } = useContext(AuthContext);
  const profile_name = user?.user?.profile_name;
  const [filteredPingData, setFilteredPingData] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleClick = (name) => {
    navigate(`/profile/${name}`);
  };

  // useEffect(() => {

  // }, [userData]);

  useEffect(() => {
    const fetchDataResults = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_IP}/api/pingdata/`);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const sortedData = data
          .filter((data) => data.username !== "ke3ki3a")
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
        console.error("home:", error);
      }
    };

    fetchDataResults();
  }, [profile_name]);
  return (
    <div className={styl.Home}>
      <div className={styl.cont}>
        <div className={styl.first}>
          <div className={styl.result}>
            <div className={styl.card}>
              <p>
                {t("WINS")}
                <FaMedal />
              </p>
              <p id={styl.sm}>{String(userData?.data[0]?.wins)}</p>
            </div>
            <div className={styl.card}>
              <p>
                {t("LOSS")}
                <GiCrossMark />
              </p>
              <p id={styl.sm}>{userData?.data[0]?.losses}</p>
            </div>
            <div className={styl.card}>
              <p>
                {t("GAMES")}
                <PiGameControllerFill />
              </p>
              <p id={styl.sm}>
                {userData?.data[0]?.losses + userData?.data[0]?.wins || 0}
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
              <p >
                {filteredPingData?.[1]?.profile_name
                  ? filteredPingData?.[1]?.profile_name.length > 8
                    ? filteredPingData?.[1]?.profile_name.substring(0, 8) + "."
                    : filteredPingData?.[1]?.profile_name.toUpperCase()
                  : "."}
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
              <p >
                {filteredPingData?.[0]?.profile_name
                  ? filteredPingData?.[0]?.profile_name.length > 8
                    ? filteredPingData?.[0]?.profile_name.substring(0, 8) + "."
                    : filteredPingData?.[0]?.profile_name.toUpperCase()
                  : "."}
              </p>
              <div className={styl.nbRank} style={{ border: "gold 4px solid", top: '30%' }}>
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
              <p >
                {filteredPingData?.[2]?.profile_name
                  ? filteredPingData?.[2]?.profile_name.length > 8
                    ? filteredPingData?.[2]?.profile_name.substring(0, 8) + "."
                    : filteredPingData?.[2]?.profile_name.toUpperCase()
                  : "."}
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
          <Statistic userData={userData} profileName={profile_name} t={t} />
        </div>
      </div>
    </div>
  );
};

export default Home;
