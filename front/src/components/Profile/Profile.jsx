import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styl from "./Profile.module.css";
import { AuthContext } from "../../UserContext/Context";
import MatchHistory from "./components/matchHistory/MatchHistory";
import Leaderboard from "./components/leaderboard/Leaderboard";
import CardFriend from "./components/CardFriend/CardFriend";
import { toast } from "react-toastify"
import { FaMedal } from "react-icons/fa";
import { PiGameControllerFill } from "react-icons/pi";
import { GiCrossMark } from "react-icons/gi";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { IoIosPersonAdd } from "react-icons/io";
import axios from "axios";
import CardBlocked from "./components/cardBlocked/CardBlocked";
import { useNotificationWS } from "../../contexts/NotifWSContext";
import Anonymize  from "./Anonimize/Anonymize";

const Profile = ({ me }) => {
  const { sendMessage, notif , setNotif} = useNotificationWS();

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
  const [isblocked, setIsblocked] = useState(false);
  const [isblockedy, setIsblockedy] = useState(false);
  const [isAnonymize, setIanonymize] = useState(userData?.is_anonimized);


  
  useEffect (()=>{
    console.log("------ user",userData); 
  } , [])
  
  
  
  useEffect(() => {
    
   setProfileName(profile_name);
  }, [profileName]);

  
  useEffect(() => {
    if (notif && notif.status === 'friends'){
      if (notif.user_id === userData.id){
        setIsfriended(true);
        setNotif(null);
      }
    }
    else if (notif && notif.status === 'unfriend'){
      if (notif.user_id === userData.id){
        setIsfriended(false);
        setNotif(null);
      }
    }
    else if (notif && notif.message === 'status'){
      if (notif.offline && notif.offline === userData.id){
        setUserData({...userData, status_network: 'offline'});
        setNotif(null);
      }
      else if (notif.online && notif.online === userData.id){
        setUserData({...userData, status_network: 'online'});
        setNotif(null);
      }
    }
    if (notif && notif.status === 'BLOCK'){
      if (notif.user_id === userData.id){
        setIsblocked(true);
        setNotif(null);
      }
    }
    else if (notif && notif.status === 'UNBLOCK'){
      if (notif.user_id === userData.id){
        setIsblocked(false);
        setNotif(null);
      }
    }
  }, [notif])

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
    const fetchPingData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/api/pingdata/${profileName}/` , {
          withCredentials: true,
      });
        const pingData = response.data;
  
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
      }
    };
    
    fetchPingData();
  }, [profile_name, notif, isblocked]);

  useEffect(() => {
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
  }, [friendList, user?.user?.profile_name, userData.profile_name, notif, isblocked]);

  useEffect(() => {
    const fetchFriends = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_IP}/api/friends/${profile_name}/` , {
          withCredentials: true,
      });
      setFriendList(response.data);
    };
    fetchFriends();
  }, [isfriended, profile_name, notif, isblocked]);

  useEffect(() => {
    const fetchBlocked = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_IP}/api/blocked/${profile_name}/`,
          { withCredentials: true }
        );
        setBlockedList(response.data);
        setIsblocked(false)
        if (profile_name !== user.user.profile_name) {
          const isBlocked = response.data["blocked list"].some(
            (blockedUser) => blockedUser.profile_name === user.user.profile_name
          );
          if (isBlocked)
            setIsblocked(true);
        }
      } catch (error) {
      }
    };
  
    fetchBlocked();
  }, [isfriended, profile_name, isblocked]);
  

  useEffect(() => {
    const fetchBlocked = async () => {
      if (!ismyprofil)
        return ;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_IP}/api/blocked/${user.user.profile_name}/`,
          { withCredentials: true }
        );
        console.log('Blocked list:', response.data);
        const isBlockedUser = response.data['blocked list']?.some(
          (blockedUser) => blockedUser.profile_name === profile_name
        );
        console.log('status:', isBlockedUser);
        setIsblockedy(isBlockedUser);
      } catch (error) {
        console.error('Error fetching blocked list:', error);
      }
    };

    fetchBlocked();
  }, [user, profile_name]);

  console.log("--->>>>>> === ", isblockedy)

  useEffect(() => {
    const fetchData = async () => {
      if (!profile_name){
        toast.error(t("profile_name not valid"),
        {
          style: {
            backgroundColor: 'rgb(255, 0, 0)',
            color: 'white'
          }
        })
      }
  
      setIsLoading(true);
      setError(null);
  
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_IP}/api/getuser/${profile_name}/`
        );
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? t("User not found")

              : "Failed to fetch user data"
          );
        }
        if (profile_name === 'ke3ki3a') {
          throw new Error(
            "User not found"
          );
        }
  
        const data = await response.json();
        setUserData(data);
        setIanonymize(data?.is_anonimized);
        
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
  }, [profile_name, notif, isblocked]);
  
  
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
        <Link to="/"> {t("Go back to home")}</Link>
      </div>
    );
  }

  // if (isblocked) {
  //   return <div className={styl.error} style={{color: 'white'}}>{t("This user has blocked you.")}</div>
  // }
  
  if (isblocked || isblockedy){
    if (!isAnonymize)
      return (<Anonymize user={userData} option={isblockedy ? "blockedy" : "blocked"} t={t}/>)
  }

  if (isAnonymize){
    return (<Anonymize user={userData} option={"anonymize"} t={t}/>)
  }
  return (
    <div className={styl.profile}>
      <div className={styl.content}>
        <div className={styl.userPrf}>
          <div className={styl.side1}>
            <div className={styl.userInfo}>
              <div className={styl.settingsBt} onClick={openSettings} style={{ display: displayBt }}>
                <MdOutlineFormatListBulleted />
                <div className={styl.settings} style={{ display: setting }}>
                  <button className={styl.Button} onClick={handleAddFriend}>
                    <IoIosPersonAdd className={styl.icons} />
                    {isfriended ? <p>{t("Unfriend")}</p> : <p>{t("Add Friend")}</p>}
                  </button>
                </div>
              </div>
              <div className={styl.userDis}>
                <div className={styl.extImg}>
                  <div className={styl.intImg}>
                    <img src={userData.avatar} alt="Avatar" />
                  </div>
                </div>
                <div className={styl.userName}>
                  {userData.profile_name.toUpperCase()}
                  <div style={{ color: "rgba(255, 255, 255, 0.4)" }}>
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
                    {t(userData?.status_network)}
                  </div>
                </div>
              </div>
              <div className={styl.Res}>
                <div className={styl.stt}>
                  <div className={styl.rs}>
                    <div className={styl.Side}>
                      <FaMedal className={styl.icon} />
                    </div>
                    <div className={styl.resName}>{t("Wins")}</div>
                    <div className={styl.Side}>{wins}</div>
                  </div>
                  <hr />
                  <div className={styl.rs}>
                    <div className={styl.Side}>
                      <GiCrossMark className={styl.icon} />
                    </div>
                    <div className={styl.resName}>{t("Lose")}</div>
                    <div className={styl.Side}>{lose}</div>
                  </div>
                  <hr />
                  <div className={styl.rs}>
                    <div className={styl.Side}>
                      <PiGameControllerFill className={styl.icon} />
                    </div>
                    <div className={styl.resName}>{t("Games")}</div>
                    <div className={styl.Side}>{wins + lose}</div>
                  </div>
                </div>

                <div className={styl.level}>
                  <div className={styl.tmp}>
                    <p>{t("Level")} {pingLevel}</p>
                    <div>
                      {pingExp} /{" "}
                      <p
                        style={{
                          color: "rgba(255, 255, 255, 0.4)",
                          left: "2px",
                        }}
                      >
                        {maxPingExp} xp
                      </p>
                    </div>
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
                      }}>
                      {t("Next Level")}
                    </p>
                    <p>{t("Level")} {nextpingLevel}</p>
                  </div>
                </div>
              </div>
              <div className={styl.chooseData}>
                <button onClick={() => handelClick("Leaderboard")}>
                  <p style={{ textDecorationColor: activeSection === "Leaderboard" ? "red" : "white",}}> {t("Leaderboard")} </p>
                </button>
                <button onClick={() => handelClick("MatchHistory")}>
                  <p
                    style={{
                      textDecorationColor:
                        activeSection === "MatchHistory" ? "red" : "white",
                    }}
                  >
                    {t("Match History")}
                  </p>
                </button>
              </div>
            </div>
            <div className={styl.userData}>
              {activeSection === "Leaderboard" && <Leaderboard setProfileName={setProfileName} t={t}/>}
              {activeSection === "MatchHistory" && (
                <MatchHistory profileName={profileName} t={t}/>
              )}
            </div>
          </div>
          <div className={styl.side2}>
            <div className={styl.headFr}>
              <p>{t(status)}</p>
              <div onClick={handleShooseList} style={{display: displayShooseButton}}>
                <p>...</p>
                <div
                  className={styl.userBlocked}
                  style={{ display: shooseList}}
                >
                  <button onClick={handleBlockClick}>
                    {showUserBlocked ? "Friends" : "Blocked"}
                  </button>
                </div>
              </div>
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
