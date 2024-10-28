import styl from "./UserData.module.css";
import { CiMedal } from "react-icons/ci";
import { IoGameControllerOutline } from "react-icons/io5";
import { VscChromeClose } from "react-icons/vsc";
import { FaAnglesLeft } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { IoIosPersonAdd } from "react-icons/io";
import { TbLock } from "react-icons/tb";
import { BsChatDots } from "react-icons/bs";

const UserData = ({ userData, ismyprofil }) => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [statisticData, setStatisticData] = useState({});
  const [username, setUsername] = useState(userData?.username || '');
  const [chooseGame, setChooseGame] = useState('Ping Pong');

  const fetchUrl = chooseGame === "Ping Pong" ? "pingdata" : "ticdata";

  useEffect(() => {
    setUsername(userData?.username || '');
  }, [userData]);

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;

      try {
        const response = await fetch(`http://localhost:8000/api/${fetchUrl}/${username}`);
        if (response.ok) {
          const data = await response.json();
          setStatisticData(data[0]);
          console.log('Fetched Data:', data);
        } else {
          console.log('Failed to fetch data.');
        }
      } catch (error) {
        console.log('Fetch error:', error);
      }
    };

    fetchData();
  }, [username, fetchUrl]);

  const toggleSettings = () => setSettingsVisible(!settingsVisible);
  
  const handleGameToggle = () => {
    setChooseGame((prevGame) => (prevGame === 'Ping Pong' ? 'Tic Tac Toe' : 'Ping Pong'));
  };

  const level = Math.floor(statisticData.exp_game / 100);
  let percentage = (statisticData.exp_game % 100) / 100 * 100 || 0;

  return (
    <div className={styl.first}>
      <div className={styl.userData}>
        <div className={styl.user}>
          <div className={styl.Image}>
            <div className={styl.imgStl}>
              <img src={userData.avatar} alt="User Avatar" />
              <div className={styl.rndOnli} style={{ backgroundColor: 'red' }}></div>
            </div>
          </div>
          <div className={styl.Name}>
            <p>{userData.profile_name?.toUpperCase()}</p>
          </div>
        </div>
        
        {ismyprofil !== 0 && (
          <div className={styl.sett}>
            <div className={styl.buttonDiv}>
              <button className={styl.setButton} onClick={toggleSettings}>
                <SlOptions style={{ width: '100%', height: '100%', color: 'white' }} />
              </button>
            </div>
            {settingsVisible && (
              <div className={styl.settDisplay}>
                <div className={styl.Tmp}>
                  <button className={styl.setIcon}>
                    <IoIosPersonAdd className={styl.icons} />
                  </button>
                  <div className={styl.setStr}><p>Add</p></div>
                </div>
                <div className={styl.Tmp}>
                  <button className={styl.setIcon}>
                    <TbLock className={styl.icons} />
                  </button>
                  <div className={styl.setStr}><p>Block</p></div>
                </div>
                <div className={styl.Tmp}>
                  <button className={styl.setIcon}>
                    <BsChatDots className={styl.icons} />
                  </button>
                  <div className={styl.setStr}><p>Chat</p></div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className={styl.statistic}>
          <div className={styl.sttcStyl}>
            <div className={styl.choiceGame}>
              <button onClick={handleGameToggle}>
                <FaAnglesLeft id={styl.butChoice} />
              </button>
              <p>{chooseGame}</p>
              <button onClick={handleGameToggle}>
                <FaAnglesLeft id={styl.butChoice} style={{ rotate: '180deg' }} />
              </button>
            </div>
            {statisticData && (
              <>
                <div className={styl.res}>
                  <div className={styl.aspects}>
                    <CiMedal />
                  </div>
                  <div className={styl.Name}>
                    <p>WINS</p>
                  </div>
                  <div className={styl.aspects}>
                    <p>{statisticData.wins}</p>
                  </div>
                </div>
                <div className={styl.res}>
                  <div className={styl.aspects}>
                    <VscChromeClose />
                  </div>
                  <div className={styl.Name}>
                    <p>LOSE</p>
                  </div>
                  <div className={styl.aspects}>
                    <p>{statisticData.losses}</p>
                  </div>
                </div>
                <div className={styl.res}>
                  <div className={styl.aspects}>
                    <IoGameControllerOutline />
                  </div>
                  <div className={styl.Name}>
                    <p>GAMES</p>
                  </div>
                  <div className={styl.aspects}>
                    <p>{statisticData.wins + statisticData.losses}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styl.level}>
        <div className={styl.externFrame}>
          <div className={styl.percentage} style={{ width: "80%" }}></div>
        </div>
        <p>{level} - {percentage.toFixed(0)}%</p>
      </div>
    </div>
  );
};

export default UserData;
