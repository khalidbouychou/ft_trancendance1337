import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styl from "./Profile.module.css";
import UserData from "./components/UserData/UserData";
import History from "./components/History/History";
import { AuthContext } from "../../UserContext/Context";
import MatchHistory from "./components/matchHistory/MatchHistory";
import Leaderboard from "./components/leaderboard/Leaderboard";
import Statistic from "./components/statistc/Statistic";
import CardFriend from "./components/History/components/CardFriend/CardFriend";

const Profile = ({me}) => {
  let { username } = useParams();
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [ismyprofil, setIsMyProfil] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("Leaderboard");
  const [pingLevel, setPingLevel] = useState('1')
  const [nextpingLevel, setNextPingLevel] = useState('1')
  const [pingExp, setPingExp] = useState('0')
  const [maxPingExp, setMaxPingExp] = useState('0')
  const [pingPercentage, setPingPercentage] = useState('')
  const [ticLevel, setTicLevel] = useState('1')
  const [nextticLevel, setNextTicLevel] = useState('1')
  const [ticExp, setTicExp] = useState('0')
  const [maxticExp, setMaxTicExp] = useState('0')
  const [ticPercentage, setTicPercentage] = useState('')

  const handelClick = (section) => {
    setActiveSection(section);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;
      username = user?.user?.username;
      setIsLoading(true);
      setIsMyProfil(1);
      try {
        const response = await fetch(
          `http://localhost:8000/api/getuser/${username}/`
        );
  
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("User not found");
          } else {
            throw new Error("Failed to fetch user data");
          }
        }
  
        const data = await response.json();
        setUserData(data);
  
        if (data.username === user?.user?.username) {
          setIsMyProfil(0);
        }
  
        const pingResponse = await fetch(
          `http://localhost:8000/api/pingdata/${username}/`
        );
  
        if (!pingResponse.ok) {
          throw new Error("Failed to fetch ping data");
        }
  
        const pingData = await pingResponse.json();
  
        if (pingData && pingData.length > 0) {
          const { exp_game } = pingData[0];
          const calculatedLevel = Math.floor(exp_game / 100);
          const calculatedNextLevel = calculatedLevel + 1;
          const maxExperience = calculatedNextLevel * 100;
  
          setPingExp(exp_game);
          setMaxPingExp(maxExperience);
          setPingLevel(calculatedLevel);
          setNextPingLevel(calculatedNextLevel);
          setPingPercentage(Math.floor(exp_game / 100) * 10)
        } else {
          throw new Error("Ping data is invalid or empty");
        }

        const ticResponse = await fetch(`http://localhost:8000/api/ticdata/${username}/`);
        if (!ticResponse.ok) {
          throw new Error("Failed to fetch Tic Tac Toe data");
        }
        const ticData = await ticResponse.json();
        console.log("Tic Tac Toe data:", ticData);
        if (ticData && ticData.length > 0) {
          const { exp_game } = ticData[0];
          const calculatedLevel = Math.floor(exp_game / 100);
          const calculatedNextLevel = calculatedLevel + 1;
          const maxExperience = calculatedNextLevel * 100;
  
          setTicExp(exp_game);
          setMaxTicExp(maxExperience);
          setTicLevel(calculatedLevel);
          setNextTicLevel(calculatedNextLevel);
          setTicPercentage(Math.floor(exp_game / 100) * 10)
        } else {
          throw new Error("Ping data is invalid or empty");
        }
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
    };
  
    fetchData();
  }, [username, user]);

  console.log('expsstic', ticPercentage)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log('===>>',userData)

  return (
    <div className={styl.profile}>
      <div className={styl.content}>
        <div className={styl.head}>
          <h2>PROFILE</h2>
        </div>
        <div className={styl.userPrf}>
          <div className={styl.side1}>
            <div className={styl.userInfo}>
              <div className={styl.userDis}>
                <div className={styl.extImg}>
                  <div className={styl.intImg}>
                    <img src={userData.avatar} alt="Avatar" />
                  </div>
                </div>
                <p className={styl.userName}>
                  {userData.profile_name.toUpperCase()}
                  <p style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                    <div className={styl.ongline}>
                      <div
                        className={styl.ongline}
                        style={{
                          width: "11px",
                          height: "11px",
                          backgroundColor: "rgb(7, 118, 174)",
                        }}
                      ></div>
                    </div>
                    online
                  </p>
                </p>
              </div>
              <div className={styl.levels}>
                <div className={styl.level}>
                  <div className={styl.tmp}>
                    <p>Level {pingLevel}</p>
                    <div className={styl.gameName}>Ping Pong</div>
                    <p>
                      {pingExp} /{" "}
                      <p
                        style={{
                          color: "rgba(255, 255, 255, 0.4)",
                          left: "2px",
                        }}
                      >
                        {maxPingExp}
                      </p>
                    </p>
                  </div>
                  <div className={styl.extLvl}>
                    <div className={styl.intLvl} style={{ width: `${pingPercentage}%` }}></div>
                  </div>
                  <div className={styl.tmp} style={{ alignItems: "start" }}>
                    <p
                      style={{ color: "rgba(255, 255, 255, 0.4)", left: "2px" }}
                    >
                      Next Level
                    </p>
                    <p>Level {nextpingLevel}</p>
                  </div>
                </div>
                <div className={styl.level}>
                  <div className={styl.tmp}>
                    <p>Level {ticLevel}</p>
                    <div className={styl.gameName}>Tic Tac Toe</div>
                    <p>
                      {ticExp} /{" "}
                      <p
                        style={{
                          color: "rgba(255, 255, 255, 0.4)",
                          left: "2px",
                        }}
                      >
                        {maxticExp}
                      </p>
                    </p>
                  </div>
                  <div className={styl.extLvl}>
                    <div className={styl.intLvl} style={{ width: `${ticPercentage}%` }}></div>
                  </div>
                  <div className={styl.tmp} style={{ alignItems: "start" }}>
                    <p
                      style={{ color: "rgba(255, 255, 255, 0.4)", left: "2px" }}
                    >
                      Next Level
                    </p>
                    <p>Level {nextpingLevel}</p>
                  </div>
                </div>
              </div>
              <div className={styl.chooseData}>
                <button onClick={() => handelClick("Leaderboard")}>
                  <p
                    style={{
                      textDecorationColor:
                        activeSection === "Leaderboard" ? "red" : "white",
                    }}
                  >
                    Leaderboard
                  </p>
                </button>
                <button onClick={() => handelClick("MatchHistory")}>
                  <p
                    style={{
                      textDecorationColor:
                        activeSection === "MatchHistory" ? "red" : "white",
                    }}
                  >
                    Match History
                  </p>
                </button>
                <button onClick={() => handelClick("Statistic")}>
                  <p
                    style={{
                      textDecorationColor:
                        activeSection === "Statistic" ? "red" : "white",
                    }}
                  >
                    Statistic
                  </p>
                </button>
              </div>
            </div>
            <div className={styl.userData}>
              {activeSection === "Statistic" && <Statistic />}
              {activeSection === "Leaderboard" && <Leaderboard />}
              {activeSection === "MatchHistory" && <MatchHistory />}
            </div>
          </div>
          <div className={styl.side2}>
            <div className={styl.headBut}>
              <button>My Friends</button>
              <button style={{display: 'none'}}>Blocked Friends</button>
            </div>
            <div className={styl.displayFr}>
              <CardFriend />
              <CardFriend />hb
            </div>
            <div className={styl.searchFr}>
              <input type="text" placeholder="Search" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
