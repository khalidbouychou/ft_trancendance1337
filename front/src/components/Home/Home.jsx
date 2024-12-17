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
  // const [filteredTicData, setFilteredTicData] = useState(null);
  const [pingRes, setPingRes] = useState(null);
  const [error, setError] = useState(null);
  const [pingData, setPingData] = useState([]);
  // const [ticData, setTicData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClick = () => {
    navigate("/games");
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [selectedTab, setSelectedTab] = useState("leaderBoard");

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim()) {
        const response = await fetch(
          `http://localhost:8000/api/search/?q=${searchQuery}`
        );
        const data = await response.json();
        console.log(data);
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
        const userSpecificData = data.find(item => item.profile_name === profile_name);
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
                {(userData?.data[0]?.losses + userData?.data[0]?.wins) ?? -5}
              </p>
            </div>
          </div>

          <div className={styl.top3}>
            {filteredPingData?.map((user, index) => (
              <div
                key={user.profile_name}
                className={index === 1 ? styl.cardRankMd : styl.cardRank}
              >
                <div className={styl.extImg}>
                  <div className={styl.intImg}>
                    <img src={user.avatar} alt={user.profile_name} />
                  </div>
                </div>
                <p>
                  {user.profile_name.length > 8
                    ? user.profile_name.substring(0, 8) + "."
                    : user.profile_name.toUpperCase()}
                </p>

                <div
                  className={styl.nbRank}
                  style={{
                    border: index === 1 ? "gold 4px solid" : "silver 4px solid",
                  }}
                >
                  <p>{index + 1}</p>
                </div>
              </div>
            ))}
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
