import styl from "./UserData.module.css";
import { CiMedal } from "react-icons/ci";
import { IoGameControllerOutline } from "react-icons/io5";
import { VscChromeClose } from "react-icons/vsc";
import { FaSearchengin } from "react-icons/fa6";
import React, {useEffect, useState} from "react";

const UserData = ({userData}) => {
  const baseXP = 100;
  const incrementXP = userData.xp;
  const level = userData.level;
  const [searchResults, setSearchResults] = useState([]);

  const xpForCurrentLevel = baseXP + (level - 1) * incrementXP;
  const xpForNextLevel = baseXP + level * incrementXP;
  const percentageProgress = (xpForCurrentLevel / xpForNextLevel) * 100;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const response = await fetch(`http://localhost:8000/api/users/search/?q=${searchQuery}`);
      const data = await response.json();
      setSearchResults(data);
    }
  };

  return (
    <div className={styl.first}>
      {/* search */}

      <div className={styl.search}>
        <div className={styl.ss}>
          <form>
            <input
              type="text"
              name=""
              placeholder="search..."
              className={styl.input}
            />
            <button type="submit" className={styl.button}>
              <FaSearchengin className={styl.icon} />
            </button>
          </form>
        </div>
      </div>

            {/* Display search results */}
      {searchResults.length > 0 && (
        <div className={styl.searchResults}>
          {searchResults.map((user) => (
            <div key={user.id} className={styl.userResult}>
              <img src={user.image} alt={user.name} />
              <p>{user.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* existing userData display */}

      <div className={styl.userData}>
        <div className={styl.sett}></div>
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
