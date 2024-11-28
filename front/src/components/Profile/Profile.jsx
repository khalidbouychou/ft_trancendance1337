import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styl from "./Profile.module.css";
import UserData from "./components/UserData/UserData";
import History from "./components/History/History";
import { AuthContext } from "../../UserContext/Context";
import { FiPlus } from "react-icons/fi";
import { RiListSettingsFill } from "react-icons/ri";
import CurveChart from "../Home/components/CurveChart/CurveChart";
import CurveLevel from "../Home/components/CurveLevel/CurveLevel";
import MatchHistory from "./components/matchHistory/MatchHistory";



const Profile = () => {
  const { username } = useParams();
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [ismyprofil, setIsMyProfil] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [mhistory, setMhistory] = useState('white')
  const [statistic, setStatistic] = useState('white')
  const [leaderboard, setLeaderboard] = useState('red')

  const data = [
    { time: 'Jan', wins: 5, losses: 3 },
    { time: 'Feb', wins: 8, losses: 2 },
    { time: 'Mar', wins: 4, losses: 5 },
  ]

  const levelData = [
    { level: 1, time: 5 },
    { level: 2, time: 12 },
    { level: 3, time: 20 },
    { level: 4, time: 25 },
  ];

  const handelColor_Mh = () => {
    setMhistory('red')
    setLeaderboard('white')
    setStatistic('white')
  }

  const handelColor_St = () => {
    setMhistory('white')
    setLeaderboard('white')
    setStatistic('red')
  }

  const handelColor_Ld = () => {
    setMhistory('white')
    setLeaderboard('red')
    setStatistic('white')
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;

      setIsLoading(true);
      setIsMyProfil(1);

      try {
        const response = await fetch(`http://localhost:8000/api/getuser/${username}/`);
        
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

  return (
    <div className={styl.profile}>
      {/* <div className={styl.content}>
        <div className={styl.head}>
          <h1>PROFILE</h1>
        </div>
        <UserData userData={userData} ismyprofil={ismyprofil} />
        <History username={username} ismyprofil={ismyprofil} />
      </div> */}
      <div className={styl.content}>
        <div className={styl.head}>
          <h2 >PROFILE</h2>
        </div>
        <div className={styl.userPrf}>
          <div className={styl.side1}>
            <div className={styl.userInfo}>
              <div className={styl.userDis}>
                <div className={styl.extImg}>
                  <div className={styl.intImg}>
                    <img src={userData.avatar}></img>
                  </div>
                </div>
                <p className={styl.userName}>
                  {userData.profile_name.toUpperCase()}
                  <p style={{color: 'rgba(255, 255, 255, 0.4)'}}>
                    <div className={styl.ongline}>
                      <div className={styl.ongline} style={{width: '11px', height: '11px', backgroundColor: 'rgb(7, 118, 174)'}}></div>
                    </div>
                    ongline
                  </p>
                </p>
              </div>
              <div className={styl.levels}>
                <div className={styl.level}>
                  <div className={styl.tmp}>
                    <p >Level 29</p>
                    <div className={styl.gameName}>Ping Pong</div>
                    <p >2999 / <p style={{color: 'rgba(255, 255, 255, 0.4)', left: '2px'}}>3000</p></p>
                  </div>
                  <div className={styl.extLvl}>
                    <div className={styl.intLvl} style={{width: '80%'}}></div>
                  </div>
                  <div className={styl.tmp} style={{alignItems: 'start'}}>
                    <p style={{color: 'rgba(255, 255, 255, 0.4)', left: '2px'}}>Next Level</p>
                    <p >Level 30</p>
                  </div>
                </div>
                <div className={styl.level}>
                  <div className={styl.tmp}>
                    <p >Level 29</p>
                    <div className={styl.gameName}>Tic Tac Toe</div>
                    <p >2999 / <p style={{color: 'rgba(255, 255, 255, 0.4)', left: '2px'}}>3000</p></p>
                  </div>
                  <div className={styl.extLvl}>
                    <div className={styl.intLvl} style={{width: '80%'}}></div>
                  </div>
                  <div className={styl.tmp} style={{alignItems: 'start'}}>
                    <p style={{color: 'rgba(255, 255, 255, 0.4)', left: '2px'}}>Next Level</p>
                    <p >Level 30</p>
                  </div>
                </div>
              </div>
              <div className={styl.chooseData}>
                  <button onClick={handelColor_Mh}><p style={{textDecorationColor: mhistory}}>Match History</p></button>
                  <button onClick={handelColor_Ld}><p style={{textDecorationColor: leaderboard}}>Leaderboard</p></button>
                  <button onClick={handelColor_St}><p style={{textDecorationColor: statistic}}>Statistic</p></button>
              </div>
            </div>
            <div className={styl.userData}>
              <MatchHistory userData={{userData}}/>
            </div>
          </div>
          <div className={styl.side2}></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
