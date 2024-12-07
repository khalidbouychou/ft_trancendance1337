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

const Profile = () => {
  const { username } = useParams();
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [ismyprofil, setIsMyProfil] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("Leaderboard");

  const handelClick = (section) => {
    setActiveSection(section);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;

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

        if (data.profile_name === user?.user?.profile_name) {
          setIsMyProfil(0);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [username, user]);

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
                    <p>Level 29</p>
                    <div className={styl.gameName}>Ping Pong</div>
                    <p>
                      2999 /{" "}
                      <p
                        style={{
                          color: "rgba(255, 255, 255, 0.4)",
                          left: "2px",
                        }}
                      >
                        3000
                      </p>
                    </p>
                  </div>
                  <div className={styl.extLvl}>
                    <div className={styl.intLvl} style={{ width: "80%" }}></div>
                  </div>
                  <div className={styl.tmp} style={{ alignItems: "start" }}>
                    <p
                      style={{ color: "rgba(255, 255, 255, 0.4)", left: "2px" }}
                    >
                      Next Level
                    </p>
                    <p>Level 30</p>
                  </div>
                </div>
                <div className={styl.level}>
                  <div className={styl.tmp}>
                    <p>Level 29</p>
                    <div className={styl.gameName}>Tic Tac Toe</div>
                    <p>
                      2999 /{" "}
                      <p
                        style={{
                          color: "rgba(255, 255, 255, 0.4)",
                          left: "2px",
                        }}
                      >
                        3000
                      </p>
                    </p>
                  </div>
                  <div className={styl.extLvl}>
                    <div className={styl.intLvl} style={{ width: "80%" }}></div>
                  </div>
                  <div className={styl.tmp} style={{ alignItems: "start" }}>
                    <p
                      style={{ color: "rgba(255, 255, 255, 0.4)", left: "2px" }}
                    >
                      Next Level
                    </p>
                    <p>Level 30</p>
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
