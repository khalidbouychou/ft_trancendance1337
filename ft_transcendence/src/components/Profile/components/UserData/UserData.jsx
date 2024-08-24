import styl from "./UserData.module.css";
import userImage from "../../assets/nouahidi.jpeg";
import { CiMedal } from "react-icons/ci";
import { IoGameControllerOutline } from "react-icons/io5";
import { VscChromeClose } from "react-icons/vsc";
import { FaSearchengin } from "react-icons/fa6";

const UserData = () => {
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
      <div className={styl.userData}>
        <div className={styl.user}>
          {/*userImage*/}

          <div className={styl.Image}>
            <img src={userImage}></img>
          </div>

          {/* userName */}

          <div className={styl.Name}>
            <p>NOUREDDINE</p>
            <div className={styl.onlign}>
              <div className={styl.rnd}></div>
              <p id={styl.online}>online</p>
            </div>
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
                <p>10</p>
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
                <p>10</p>
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
                <p>10</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styl.level}>
        <div className={styl.externFrame}>
          <div className={styl.percentage} style={{ width: "80%" }}></div>
        </div>
        <p>1 - 50%</p>
      </div>
    </div>
  );
};

export default UserData;
