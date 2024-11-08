import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styl from "./Profile.module.css";
import UserData from "./components/UserData/UserData";
import History from "./components/History/History";
import { AuthContext } from "../../UserContext/Context";
import { FaPlus } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";



const Profile = () => {
  const { username } = useParams();
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [ismyprofil, setIsMyProfil] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

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
                  <p >NOUREDDINE</p>
                </div>
                <div className={styl.sett}>
                  <button className={styl.change}>
                    <FiPlus className={styl.plusIcon}/>
                  </button>
                </div>
              </div>
            </div>
            <hr style={{width: '0%', height: '40%', border: '1px solid yellow', bottom: '15%', position: 'relative'}}/>
            <div className={styl.level}>
              <div className={styl.lvl}>
                <div className={styl.tmp}>
                  <p >Level 29</p>
                  <p style={{fontSize: '18px'}}>Ping Pong</p>
                  <p >1000 / 3000</p>
                </div>
                <div className={styl.ext}>
                  <div className={styl.int} style={{width: '50%'}}></div>
                </div>
                <div className={styl.tmp}>
                  <p >Next Level</p>
                  <p >Level 30</p>
                </div>
              </div>
              <div className={styl.lvl}>
                <div className={styl.tmp}>
                  <p >Level 29</p>
                  <p style={{fontSize: '18px'}}>Ping Pong</p>
                  <p >1000 / 3000</p>
                </div>
                <div className={styl.ext}>
                  <div className={styl.int} style={{width: '50%'}}></div>
                </div>
                <div className={styl.tmp}>
                  <p >Next Level</p>
                  <p >Level 30</p>
                </div>
              </div>
              <div className={styl.option}>
                <p >Match History</p>
                <p >Friends</p>
                <p >Statistic</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styl.users}></div>
      </div>
    </div>
  );
};

export default Profile;
