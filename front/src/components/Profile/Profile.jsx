import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styl from "./Profile.module.css";
import { AuthContext } from "../../UserContext/Context";
import MatchHistory from "./components/matchHistory/MatchHistory";
import Leaderboard from "./components/leaderboard/Leaderboard";
import CardFriend from "./components/History/components/CardFriend/CardFriend";
import { FaMedal } from "react-icons/fa";
import { PiGameControllerFill } from "react-icons/pi";
import { GiCrossMark } from "react-icons/gi";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { IoIosPersonAdd } from "react-icons/io";
import axios from "axios";
import CardBlocked from "./components/cardBlocked/CardBlocked";
import { useNotificationWS } from "../../contexts/NotifWSContext";

const Profile = ({ me }) => {
  const { profilesocket, sendMessage, isConnected } = useNotificationWS();

  let { profile_name } = useParams();
  const { user, t } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
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
  const [wins, setWins] = useState("");
  const [lose, setLose] = useState("");
  const [setting, setSetting] = useState("none");
  const [displayBt, setDisplayBt] = useState('flex');
  const [showUserBlocked, setShowUserBlocked] = useState(false);
  const [status, setStatus] = useState("Friends");
  const [isfriended, setIsfriended] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [blockedList, setBlockedList] = useState([]);
  const [shooseList, setShooseList] = useState('none');
  const [displayShooseButton, setDisplayShooseButton] = useState('none');

  const handleBlockClick = () => {
    setShowUserBlocked((prev) => !prev);
    setStatus((prev) => (prev === "Friends" ? "User Blocked" : "Friends"));
  };

  const handelClick = (section) => {
    setActiveSection(section);
  };

  const handleShooseList = () => {
    setShooseList(shooseList == "none"? "flex" : "none");
  }

  const openSettings = () => {
    setSetting(setting == "none" ? "flex" : "none");
  };

  useEffect(() => {
    console.log('++++++++++++++++++++ userData == ', user)
  },[])

  useEffect(() => {
    const fetchPingData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/pingdata/${profile_name}/`);
        const pingData = response.data;
        console.log("ping data", pingData);
  
        if (pingData.length > 0) {
          const { exp_game, wins, losses } = pingData[0];
          const calculatedLevel = Math.floor(exp_game / 100);
          const maxExperience = (calculatedLevel + 1) * 100;
  
          setPingExp(exp_game);
          setMaxPingExp(maxExperience);
          setPingLevel(calculatedLevel);
          setNextPingLevel(calculatedLevel + 1);
          setPingPercentage(exp_game % 100);
          setWins(wins);
          setLose(losses);
        }
      } catch (error) {
        console.error("Failed to fetch ping data", error);
      }
    };
  
    fetchPingData();
  }, [profile_name]);

  useEffect(() => {
    console.log('--------------------------------', friendList);
    const friendsArray = friendList['friend list'] || [];
    const isFriend = friendsArray.some(
      (friend) => friend.profile_name === user?.user?.profile_name
    );
    setIsfriended(isFriend);
  
    if (userData.profile_name === user?.user?.profile_name) {
      setIsMyProfil(1);
      setDisplayBt("none");
      setDisplayShooseButton('flex')
    } else {
      setIsMyProfil(0);
      setDisplayBt("flex");
      setDisplayShooseButton('none')
    }
  }, [friendList, user?.user?.profile_name, userData.profile_name]);

  useEffect(() => {
    const fetchFriends = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/friends/${profile_name}/`,
        { withCredentials: true }
      );
      setFriendList(response.data);
    };
    fetchFriends();
    const fromUserId = profilesocket?.notification?.from_user.id;
    const toUserId = profilesocket?.notification?.to_user.id;

    if (
      (fromUserId === user?.user?.id && toUserId === userData?.id) ||
      (fromUserId === userData?.id && toUserId === user?.user?.id)
    ) {
      console.log('fiend list == ', friendList)
      const isFriend = friendList?.["friend list"]?.some(
        (friend) => friend.profile_name === user?.user?.profile_name
      );
      setIsfriended(isFriend);
    }
    console.log("friend list", friendList);
  }, [profileName, isfriended], profilesocket);

  useEffect(() => {
    const fetchBlocked = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/blocked/${profile_name}/`,
        { withCredentials: true }
      );
      setBlockedList(response.data);
    };
    fetchBlocked();
    console.log("blocked list", blockedList);
  }, [profileName, isfriended, ismyprofil]);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile_name) return;
  
      setIsLoading(true);
      setError(null);
  
      try {
        const response = await fetch(
          `http://localhost:8000/api/getuser/${profile_name}/`
        );
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "User not found"
              : "Failed to fetch user data"
          );
        }
  
        const data = await response.json();
        setUserData(data);
  
      } catch (error) {
        setError(error.message);
        setUserData({});
      } finally {
        setIsLoading(false);
      }
    };
    setShowUserBlocked(false);
    setActiveSection("Leaderboard");
    fetchData();
  }, [profile_name]);


  const handleAddFriend = () => {
    if (!isfriended) {
      sendMessage({
        type: "SEND_FR",
        to_user_id: userData?.id,
      });
    } else {
      sendMessage({
        type: "UN_FRIEND",
        to_user_id: userData?.id,
      });
    }
  };

  if (isLoading) {
    return <div className={styl.loading}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styl.error}>
        <p>{error}</p>
        <Link to="/"> back to home</Link>
      </div>
    );
  }

  return (
    <div className={styl.profile}>
      <div className={styl.content}>
        <div className={styl.userPrf}>
          <div className={styl.side1}>
            <div className={styl.userInfo}>
              <button
                className={styl.settingsBt}
                onClick={openSettings}
                style={{ display: displayBt }}
              >
                <MdOutlineFormatListBulleted />
                <div className={styl.settings} style={{ display: setting }}>
                  <button className={styl.Button} onClick={handleAddFriend}>
                    <IoIosPersonAdd className={styl.icons} />
                    {isfriended ? <p>{t("Unfriend")}</p> : <p>{t("Add Friend")}</p>}
                  </button>
                </div>
              </button>
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
                          backgroundColor:
                            userData.status_network === "online"
                              ? "green"
                              : "red",
                        }}
                      ></div>
                    </div>
                    {t(user?.status_network)}
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
                    <div className={styl.Side}>{wins}</div>
                  </div>
                  <hr />
                  <div className={styl.rs}>
                    <div className={styl.Side}>
                      <GiCrossMark className={styl.icon} />
                    </div>
                    <div className={styl.resName}>Lose</div>
                    <div className={styl.Side}>{lose}</div>
                  </div>
                  <hr />
                  <div className={styl.rs}>
                    <div className={styl.Side}>
                      <PiGameControllerFill className={styl.icon} />
                    </div>
                    <div className={styl.resName}>Games</div>
                    <div className={styl.Side}>{wins + lose}</div>
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
                        {maxPingExp} xp
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
              </div>
            </div>
            <div className={styl.userData}>
              {activeSection === "Leaderboard" && <Leaderboard />}
              {activeSection === "MatchHistory" && (
                <MatchHistory profileName={profileName} />
              )}
            </div>
          </div>
          {/* side2 */}
          <div className={styl.side2}>
            <div className={styl.headFr}>
              <p>{status}</p>
              <button onClick={handleShooseList} style={{display: displayShooseButton}}>
                <p>...</p>
                <div
                  className={styl.userBlocked}
                  style={{ display: shooseList}}
                >
                  <button onClick={handleBlockClick}>
                    {showUserBlocked ? "Friends" : "Blocked"}
                  </button>
                </div>
              </button>
            </div>
            <div className={styl.displayUser}>
              {showUserBlocked
                ? blockedList?.["blocked list"]?.map((user, index) => (
                    <CardBlocked key={index} user={user} />
                  ))
                : friendList?.["friend list"]?.map((user, index) => (
                    <CardFriend key={index} friend={user} />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
