import styl from "./History.module.css";
import userImage from "../../assets/nouahidi.jpeg";



const History = () => {
  return (
      <div className={styl.last}>

        {/* <div className={styl.big}>
         <div className={styl.history}>
           <div className={styl.cardName}>MATCH HISTORY</div>
           <div style={{backgroundColor: 'green'}}>
             ehllo
             
           </div>
          </div>
          <div className={styl.friends}>
            <div className={styl.cardName}>FRIENDS</div>
            <div className={styl.cardFriend}>
             <div className={styl.friendImage}>
               <img src={userImage}></img>
             </div>
             <div className={styl.friendName}>
               <p>NOUREDDINE</p>
             </div>
            </div>
          </div>
         <div className={styl.blocked}>
           <div className={styl.cardName}>BLOCKED</div>
           <div className={styl.cardFriend} style={{ width: "350px" }}>
             <div className={styl.friendImage} style={{ width: "30%" }}>
               <img src={userImage}></img>
             </div>
             <div className={styl.friendName} style={{ width: "40%" }}>
               <p>NOUREDDINE</p>
             </div>
             <div className={styl.unblock}>
               <button>UNBLOCK</button>
             </div>
           </div>
         </div>
       </div> */}

      {/* //       small */}

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
                <div className={styl.cardMatch}>
                  <div className={styl.player}>
                    <img src={userImage}></img>
                    <p>NOUREDDINE</p>
                  </div>
                  <div className={styl.scoreDate}>
                    <p>2024-08-21</p>
                    <p style={{ fontSize: "25px" }}>3 - 2</p>
                  </div>
                  <div className={styl.player}>
                    <img src={userImage}></img>
                    <p>NOUREDDINE</p>
                  </div>
                </div>
              </div>
            )}
            {activeSection === "friends" && (
              <div className={styl.Friends}>
                <div className={styl.cardFriend}>
                  <div className={styl.friendImage}>
                    <img src={userImage}></img>
                  </div>
                  <div className={styl.friendName}>
                    <p>NOUREDDINE</p>
                  </div>
                </div>
              </div>
            )}
            {activeSection === "blocked" && (
              <div className={styl.Blocked}>
                <div className={styl.cardFriend} style={{ width: "400px" }}>
                  <div className={styl.friendImage} style={{ width: "30%" }}>
                    <img src={userImage}></img>
                  </div>
                  <div className={styl.friendName} style={{ width: "40%" }}>
                    <p>NOUREDDINE</p>
                  </div>
                  <div className={styl.unblock}>
                    <button>UNBLOCK</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};


export default History;