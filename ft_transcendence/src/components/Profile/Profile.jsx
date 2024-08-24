import styl from "./Profile.module.css"
import UserData from "./components/userData/userData"
import userImage from "./assets/nouahidi.jpeg"
// import History from "./components/History/History";
import { useState } from "react";

const Profile = () => {
  const [activeSection, setActiveSection] = useState("matchhistory");
  return (
    <div className={styl.profile}>
      <div className={styl.content}>
        {/* head */}

        <div className={styl.head}>PROFILE</div>

        <UserData />

        {/* last */}

      <div className={styl.last}>

        <div className={styl.big}>
          <div className={styl.cont}>
            <div className={styl.title}>Match History</div>
            <div className={styl.card}>
              <div className={styl.cardMatch}>
                <div className={styl.player}>
                  <img src={userImage}></img>
                  <p >NOUREDDINE</p>
                </div>
                <div className={styl.scoreDate}>
                  <p >2024-08-23</p>
                  <p >3 - 2</p>
                </div>
                <div className={styl.player}>
                  <img src={userImage}></img>
                  <p >NOUREDDINE</p>
                </div>
              </div>
              <div className={styl.cardMatch}></div>
            </div>
          </div>
          <div className={styl.cont}>
            <div className={styl.title}>Friends</div>
            <div className={styl.card}>
              <div className={styl.cardFriend}>
                <div className={styl.Img}>
                  <img src={userImage}></img>
                </div>
                <div className={styl.Name}>
                  <p >NOUREDDINE</p>
                </div>
              </div>
              <div className={styl.cardFriend}></div>
            </div>
          </div>
          <div className={styl.cont}>
            <div className={styl.title}>Blocked</div>
            <div className={styl.card}>
              <div className={styl.cardFriend} style={{width: '400px'}}>
                <div className={styl.Img} style={{width: '30%'}}>
                  <img src={userImage} ></img>
                </div>
                <div className={styl.Name} style={{width: '40%'}}>
                  <p >NOUREDDINE</p>
                </div>
                <div className={styl.unblock}>
                  <button ><p >UNBLOCK</p></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styl.small}>
          <div className={styl.Head}>
            <button
              onClick={() => setActiveSection("matchhistory")}
              className={styl.Button}
            >
              MATCH HISTORY
            </button>
            <button
              onClick={() => setActiveSection("friends")}
              className={styl.Button}
            >
              FRIENDS
            </button>
            <button
              onClick={() => setActiveSection("blocked")}
              className={styl.Button}
            >
              BLOCKED
            </button>
          </div>
          <div className={styl.cont}>
            {activeSection === "matchhistory" && (
              <div className={styl.mHistory}>
                <div className={styl.CardMatch}>
                    <div className={styl.Player}>
                      <img src={userImage}></img>
                      <p >NOUREDDINE</p>
                    </div>
                    <div className={styl.ScoreDate}>
                      <p >2024-08-24</p>
                      <p >3 - 2</p>
                    </div>
                    <div className={styl.Player}>
                      <img src={userImage}></img>
                      <p >NOUREDDINE</p>
                    </div>
                </div>
              </div>
            )}
            {activeSection === "friends" && (
              <div className={styl.Friends}>
                <div className={styl.CardFriend}>
                  <div className={styl.image}>
                    <img src={userImage}></img>
                  </div>
                  <div className={styl.Name}>
                    <p>NOUREDDINE</p>
                  </div>
                </div>
                <div className={styl.CardFriend}>
                  <div className={styl.image}>
                    <img src={userImage}></img>
                  </div>
                  <div className={styl.Name}>
                    <p>NOUREDDINE</p>
                  </div>
                </div>
                <div className={styl.CardFriend}>
                  <div className={styl.image}>
                    <img src={userImage}></img>
                  </div>
                  <div className={styl.Name}>
                    <p>NOUREDDINE</p>
                  </div>
                </div>
              </div>
            )}
            {activeSection === "blocked" && (
              <div className={styl.Blocked}>
                <div className={styl.CardFriend}>
                  <div className={styl.image} style={{width: '30%'}}>
                    <img src={userImage}></img>
                  </div>
                  <div className={styl.Name} style={{width: '40%'}}>
                    <p>NOUREDDINE</p>
                  </div>
                  <div className={styl.unblock}>
                    <button >
                      Unblock
                    </button>
                  </div>
                </div>
                <div className={styl.CardFriend}>
                  <div className={styl.image} style={{width: '30%'}}>
                    <img src={userImage}></img>
                  </div>
                  <div className={styl.Name} style={{width: '40%'}}>
                    <p>NOUREDDINE</p>
                  </div>
                  <div className={styl.unblock}>
                    <button >
                      Unblock
                    </button>
                  </div>
                </div>
                <div className={styl.CardFriend}>
                  <div className={styl.image} style={{width: '30%'}}>
                    <img src={userImage}></img>
                  </div>
                  <div className={styl.Name} style={{width: '40%'}}>
                    <p>NOUREDDINE</p>
                  </div>
                  <div className={styl.unblock}>
                    <button >
                      Unblock
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* <div className={styl.small}></div> */}

      </div>

       {/* <History/> */}
      </div>
    </div>
  );
};

export default Profile;
