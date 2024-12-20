import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styl from "./Profile.module.css";
import { AuthContext } from "../../UserContext/Context";
import MatchHistory from "./components/matchHistory/MatchHistory";
import Leaderboard from "./components/leaderboard/Leaderboard";
import Statistic from "./components/statistc/Statistic";
import CardFriend from "./components/History/components/CardFriend/CardFriend";
import { FaMedal } from "react-icons/fa";
import { PiGameControllerFill } from "react-icons/pi";
import { GiCrossMark } from "react-icons/gi";

const Profile = ({ me }) => {
  let { profile_name } = useParams();
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [ismyprofil, setIsMyProfil] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("Leaderboard");
  const [pingLevel, setPingLevel] = useState("1");
  const [nextpingLevel, setNextPingLevel] = useState("1");
  const [pingExp, setPingExp] = useState("0");
  const [maxPingExp, setMaxPingExp] = useState("0");
  const [pingPercentage, setPingPercentage] = useState("");
  const [profileName, setProfileName] = useState(profile_name);

  const handelClick = (section) => {
    setActiveSection(section);
  };


  // if (!profile_name)
  //     profile_name = user.user.profile_name
  console.log('check prf == ', profileName)
  useEffect(() => {
    const fetchData = async () => {
      if (!profile_name) return;
      setIsLoading(true);
      setError(null);
      
      console.log("=====>>> ppppppPPPPP", profile_name)
      try {
        const response = await fetch(`http://localhost:8000/api/getuser/${profile_name}/`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("User not found");
          } else {
            console.log("checkkk")
            throw new Error("Failed to fetch user data");
          }
        }

        const data = await response.json();
        setUserData(data);
        
        if (data.profile_name === user?.user?.profile_name) {
          setIsMyProfil(1);
        } else {
          setIsMyProfil(0);
        }
        
        const pingResponse = await fetch(`http://localhost:8000/api/pingdata/${profile_name}/`);
        if (!pingResponse.ok) {
          console.log('Failed to')
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
          setPingPercentage(Math.floor((exp_game / maxExperience) * 100));
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
  }, [profile_name, user]);
  console.log("userDDDDDaata", userData)
  
  if (isLoading) {
    return <div className={styl.loading}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styl.error}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

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
                  {userData.profile_name.length > 8 
                      ? userData.profile_name.toUpperCase().slice(0, 8) + '.' 
                      : userData.profile_name.toUpperCase()}
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
                    {userData.status_network}
                  </p>
                </p>
              </div>
              <div className={styl.Res}>
                <div className={styl.stt}>
                  <div className={styl.rs}>
                    <div className={styl.Side}>
                      <FaMedal className={styl.icon} />
                    </div>
                    <div className={styl.resName}>Wins</div>
                    <div className={styl.Side}>4</div>
                  </div>
                  <hr />
                  <div className={styl.rs}>
                    <div className={styl.Side}>
                      <GiCrossMark className={styl.icon} />
                    </div>
                    <div className={styl.resName}>Lose</div>
                    <div className={styl.Side}>2</div>
                  </div>
                  <hr />
                  <div className={styl.rs}>
                    <div className={styl.Side}>
                      <PiGameControllerFill className={styl.icon} />
                    </div>
                    <div className={styl.resName}>Games</div>
                    <div className={styl.Side}>4</div>
                  </div>
                </div>
                <div className={styl.level}>
                  <div className={styl.tmp}>
                    <p>Level {pingLevel}</p>
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
                    <div
                      className={styl.intLvl}
                      style={{ width: `${pingPercentage}%` }}
                    ></div>
                  </div>
                  <div className={styl.tmp} style={{ alignItems: "start" }}>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.4)",
                        left: "2px",
                      }}
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
              {activeSection === "Statistic" && <Statistic/>}
              {activeSection === "Leaderboard" && <Leaderboard />}
              {activeSection === "MatchHistory" && <MatchHistory profileName={profileName}/>}
            </div>
          </div>
          <div className={styl.side2}>
            <div className={styl.headBut}>
              <button>My Friends</button>
              <button style={{ display: "none" }}>Blocked Friends</button>
            </div>
            <div className={styl.displayFr}>
              <CardFriend />
              <CardFriend />
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
