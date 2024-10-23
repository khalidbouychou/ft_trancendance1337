import styl from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { FaSearchengin } from "react-icons/fa6";
import "react-circular-progressbar/dist/styles.css";
import Tmp1 from "./components/Tmp1/Tmp1";
import { useState, useEffect, useContext } from "react";
import Tmp2 from "./components/Tmp2/Tmp2";
import SearchCard from "./components/SearchCard/Searchcard";
import { AuthContext } from "../../UserContext/Context";
import Cookies from "js-cookie";

const Home = () => {
  const { user } = useContext(AuthContext);
  const username = user?.user?.username;
  console.log("Logged-in username:", username);
  console.log("hhhh-->", user);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const [filteredPingData, setFilteredPingData] = useState(null);
  const [filteredTicData, setFilteredTicData] = useState(null);
  const [pingRes, setPingRes] = useState(null);
  const [error, setError] = useState(null);
  const [pingData, setPingData] = useState([]);
  const [ticData, setTicData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClick = () => {
    navigate("/game");
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
          `http://10.13.7.1:8000/api/search/?q=${searchQuery}`
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
        const response = await fetch(`http://10.13.7.1:8000/api/pingdata/`);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("ppppll+++>>>", data);
        setPingData(data);
        const userData = data.find((item) => item.username === username);
        // console.log('username***>', item)
        setFilteredPingData(userData);
        const ticData = await fetch(`http://10.13.7.1:8000/api/ticdata/`);
        const ticDataJson = await ticData.json();
        setTicData(ticDataJson);
        const ticUserData = ticDataJson.find((item) => item.username === username);
        setFilteredTicData(ticUserData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataResults();
  }, [username]);
  console.log("piiiing+++>>>", ticData);
  console.log("filteredPingData", filteredTicData);

  return (
    <div className={styl.Home}>
      <div className={styl.cont}>
        <div className={styl.head}>
          <h1>HOME</h1>
        </div>
        <div className={styl.search}>
          <div className={styl.extFrame}>
            <div className={styl.innerFrame}>
              <input
                type="text"
                placeholder="search..."
                name="search"
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button className={styl.searchBut} onClick={handleSearch}>
              <FaSearchengin style={{ width: "70%", height: "70%" }} />
            </button>
          </div>
          <div className={styl.searchResult}>
            {searchResults.length > 0 && (
              <div className={styl.searchResult}>
                {searchResults.map((user) => (
                  <SearchCard key={user.id} user={user} />
                ))}
              </div>
            )}
            {searchResults.length === 0 && searchQuery.trim() !== "" && (
              <div className={styl.noResult}>
                <p>No results found</p>
              </div>
            )}
          </div>
        </div>
        <div className={styl.first}>
          <div className={styl.intro}>
            <p className={styl.str}>
              Gear up for epic battles as you challenge your friends to
              thrilling matches in Ping Pong Legends and Tic Tac Toe ! Who will
              rise to the top and prove their dominance on the table?
            </p>
          </div>
          <div className={styl.play}>
            <button onClick={handleClick}>
              <p>Play Now</p>
            </button>
          </div>
        </div>
        <div className={styl.last}>
          {pingData.length > 0 && filteredPingData ? (
            isMobile ? (
              <Tmp2 Data={{ ping: pingData, tic: ticData }} myData={filteredPingData} />
            ) : (
              <Tmp1 Data={{ ping: pingData, tic: ticData }} myData={filteredPingData} />
            )
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
