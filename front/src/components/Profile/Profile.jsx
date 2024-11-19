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



const Profile = () => {
  const { username } = useParams();
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [ismyprofil, setIsMyProfil] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

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
        <div className={styl.prf}>
          <div className={styl.character}>
            <div className={styl.avatar}>
              <div className={styl.image}>
                <div className={styl.dupeImage}></div>
              </div>
              <div className={styl.namesett}>
                <div className={styl.name}>
                  <p >{username.toUpperCase()}</p>
                </div>
                <div className={styl.sett}>
                  <button className={styl.change}>
                    <FiPlus className={styl.plusIcon}/>
                  </button>
                </div>
              </div>
            </div>
            <hr style={{width: '0%', height: '40%', border: '1px solid #7667D9', bottom: '15%', position: 'relative'}}/>
            <div className={styl.level}>
              <div className={styl.lvl}>
                <div className={styl.tmp}>
                  <p >Level 29</p>
                  <p >Ping Pong</p>
                  <p style={{display: 'flex'}}>
                    1000 /
                    <p style={{color: 'rgba(255, 255, 255, 0.4)', marginLeft: '5px'}}>3000</p>
                  </p>
                </div>
                <div className={styl.ext}>
                  <div className={styl.int} style={{width: '50%'}}></div>
                </div>
                <div className={styl.tmp}>
                <p style={{color: 'rgba(255, 255, 255, 0.4)'}}>Next Level</p>
                  <p >Level 30</p>
                </div>
              </div>
              <div className={styl.lvl}>
                <div className={styl.tmp}>
                  <p >Level 29</p>
                  <p >Tic Tac Toe</p>
                  <p style={{display: 'flex'}}>
                    1000 /
                    <p style={{color: 'rgba(255, 255, 255, 0.4)', marginLeft: '5px'}}>3000</p>
                  </p>
                </div>
                <div className={styl.ext}>
                  <div className={styl.int} style={{width: '50%'}}></div>
                </div>
                <div className={styl.tmp}>
                  <p style={{color: 'rgba(255, 255, 255, 0.4)'}}>Next Level</p>
                  <p >Level 30</p>
                </div>
              </div>
              <div className={styl.option}>
                <button className={styl.settChange}>
                  <button className={styl.changeGame}>
                    <RiListSettingsFill id={styl.iconeCh}/>
                    <div className={styl.menu} style={{display: 'none'}}>
                      <button >Ping Pong</button>
                      <button >Tic Tac Toe</button>
                    </div>
                  </button>
                  <p >Match History</p>
                </button>
                <button className={styl.settChange}><p >Friends</p></button>
                <button className={styl.settChange}><p >Statistic</p></button>
              </div>
            </div>
          </div>
          <div className={styl.info}>
            {/* <div className={styl.matchHistory}>
              <div className={styl.head}>
                <p style={{width: '30%'}}>Opponent</p>
                <p style={{width: '20%'}}>Score</p>
                <p style={{width: '25%'}}>Date & Time</p>
                <p style={{width: '25%'}}>Status</p>
              </div>
              <div className={styl.matches}>
                <div className={styl.cardMatch}>
                  <div className={styl.player}>
                    <div className={styl.image} style={{width: '60px', height: '80px', bottom: '0'}}>
                      <div className={styl.dupeImage} style={{width: '55px', height: '75px'}}></div>
                    </div>
                    <div className={styl.Name}>
                      <p >NOUREDDINE</p>
                    </div>
                  </div>
                  <p className={styl.Line}  style={{width: '20%'}}>3 - 2</p>
                  <p className={styl.Line}>2024 - 11 - 09</p>
                  <p className={styl.Line}>you win</p>
                </div>
              </div>
            </div> */}
            {/* <div className={styl.friends}>
              <div className={styl.cardFriend}>
                <div className={styl.side}style={{height: '40%', backgroundColor: 'white'}}></div>
                <div className={styl.side}style={{height: '60%'}}>
                  <p >NOUAHIDI</p>
                  <p style={{left: '50%'}}>Level : 1 - 50%</p>
                </div>
                <div className={styl.Image}>
                  <div className={styl.imgCont}></div>
                </div>
              </div>
              <div className={styl.cardFriend}></div>
              <div className={styl.cardFriend}></div>
              <div className={styl.cardFriend}></div>
              <div className={styl.cardFriend}></div>
              <div className={styl.cardFriend}></div>
              <div className={styl.cardFriend}></div>
              <div className={styl.cardFriend}></div>
              <div className={styl.cardFriend}></div>
            </div> */}
            <div className={styl.statistic}>
                <div className={styl.chart1}>
                    <div className={styl.circ}>
                        <div className={styl.chartCir} style={{
                            background: `conic-gradient(
                            #25233C 3%,  
                            #7667D9 0 5%
                            )`,
                        }}>
                        </div>
                        <div className={styl.chartText}>
                            <p>Wins: 3</p>
                            <p>Losses: 5</p>
                        </div>
                    </div>
                    <div className={styl.CurveChart}>
                        <CurveChart data={data} />
                    </div>
                </div>
                <div className={styl.chart2}>
                    <CurveLevel data={levelData}/>
                </div>
            </div>
          </div>
        </div>
        <div className={styl.users}>
            <div className={styl.Head}>
                <button style={{borderRadius: '25px 5px 25px 0'}}><p >Friends</p></button>
                <button style={{borderRadius: '5px 25px 0 25px', background: 'none'}}><p >Blocked</p></button>
            </div>
            <div className={styl.Friends}>
              <div className={styl.cardFriend}>
                <div className={styl.side}style={{height: '30%', backgroundColor: 'rgba(255, 255, 255, 0.05)'}}>
                  <p style={{color: "green", letterSpacing: '1px', left: '80%', position: 'relative'}}>Friend</p>
                </div>
                <div className={styl.side}style={{height: '70%'}}>
                  <p className={styl.CName}>NOUAHIDI</p>
                  <p className={styl.CName}>Level : 1 - 50%</p>
                </div>
                <div className={styl.Image} style={{width: '75px', height: '85px', left: '7%', top: '15%', backgroundColor: 'rgba(255, 255, 255, 0.05)'}} >
                  <div className={styl.Image}>
                    <div className={styl.imgCont}></div>
                  </div>
                </div>
                <div className={styl.lvll}>
                    <div className={styl.ext} style={{width: '100%', height: '20px'}}>
                      <div className={styl.int} style={{width: '50%'}}></div>
                    </div>
                </div>
              </div>
              <div className={styl.cardFriend}></div>
            </div>
            <div className={styl.searchF}>
              <input type="text" placeholder="Search Friend ..." />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
