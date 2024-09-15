import styl from "./UserData.module.css";
import { CiMedal } from "react-icons/ci";
import { IoGameControllerOutline } from "react-icons/io5";
import { VscChromeClose } from "react-icons/vsc";
import { FaSearchengin } from "react-icons/fa6";
import React, {useEffect, useState} from "react";
import { SlOptions } from "react-icons/sl";
import { IoIosPersonAdd } from "react-icons/io";
import { TbLock } from "react-icons/tb";
import { BsChatDots } from "react-icons/bs";
import UserImage from '../../assets/nouahidi.jpeg'
import SearchRes from "./components/SearchRes/SearchRes";

const UserData = ({userData}) => {
  const baseXP = 100;
  const incrementXP = userData.xp;
  const level = userData.level;
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const ismyprofil = 0

  const xpForCurrentLevel = baseXP + (level - 1) * incrementXP;
  const xpForNextLevel = baseXP + level * incrementXP;
  const percentageProgress = (xpForCurrentLevel / xpForNextLevel) * 100;
  const [Settings, setSettings] = useState('none')


  const handleClick = () => {
    setSettings(prevOpen => (prevOpen === 'none' ? 'flex' : 'none'))
  }

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim()) {
        const response = await fetch(
          `http://localhost:8000/api/users/search/?q=${searchQuery}`
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

  return (
    <div className={styl.first}>
      {/* search */}

      <div className={styl.search}>
        <div className={styl.ss}>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              name="search"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="search..."
              className={styl.input}
            />
            <button type="submit" className={styl.button}>
              <FaSearchengin className={styl.icon} />
            </button>
          </form>
        </div>
        {searchResults.length > 0 && (
          <div className={styl.searchRes} >
            {searchResults.map((user) => (
              <SearchRes key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>



      <div className={styl.userData}>
        <div className={styl.user}>
          {/*userImage*/}

          <div className={styl.Image}>
            <div className={styl.imgStl}>
              <img src={userData.image}></img>
              <div className={styl.rndOnli} style={{ backgroundColor: userData?.online ? 'green' : 'red' }}></div>
            </div>
          </div>

          {/* userName */}

          <div className={styl.Name}>
            <p>{userData.name.toUpperCase()}</p>
          </div>
        </div>
        {ismyprofil !== 0 ? (
        <div className={styl.sett}>
          <div className={styl.buttonDiv}>
            <button className={styl.setButton}>
              <SlOptions style={{width: '100%', height: '100%', color: 'white'}} onClick={handleClick}/>
            </button>
          </div>
          <div className={styl.settDisplay} style={{display: Settings}}>
            <div className={styl.Tmp}>
              <button className={styl.setIcon}>
                <IoIosPersonAdd className={styl.icons}/>
              </button>
              <div className={styl.setStr}><p >Add</p></div>
            </div>
            <div className={styl.Tmp}>
              <button className={styl.setIcon}>
                <TbLock className={styl.icons}/>
              </button>
              <div className={styl.setStr}><p >Block</p></div>
            </div>
            <div className={styl.Tmp}>
              <button className={styl.setIcon}>
                <BsChatDots className={styl.icons}/>
              </button>
              <div className={styl.setStr}><p >Chat</p></div>
            </div>
          </div>
        </div>
        ) : (null)}

        {/* statistic */}

        <div className={styl.statistic}>
          <div className={styl.sttcStyl}>
            <div className={styl.res}>
              <div className={styl.aspects}>
                <CiMedal />
              </div>
              <div className={styl.Name}>
                <p>WINS</p>
              </div>
              <div className={styl.aspects}>
                <p>{userData.wins}</p>
              </div>
            </div>
            <div className={styl.res}>
              <div className={styl.aspects}>
                <IoGameControllerOutline />
              </div>
              <div className={styl.Name}>
                <p>LOSE</p>
              </div>
              <div className={styl.aspects}>
                <p>{userData.losses}</p>
              </div>
            </div>
            <div className={styl.res}>
              <div className={styl.aspects}>
                <VscChromeClose />
              </div>
              <div className={styl.Name}>
                <p>GAMES</p>
              </div>
              <div className={styl.aspects}>
                <p>{userData.match_total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styl.level}>
        <div className={styl.externFrame}>
          <div className={styl.percentage} style={{ width: "80%" }}></div>
        </div>
        <p>{userData.level} - {Math.round(percentageProgress)}%</p>
      </div>
    </div>
  );
};

export default UserData;
