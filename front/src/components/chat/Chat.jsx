import React from "react";
import styl from "./Chat.module.css";
const Chat = () => {
  return (
    <div className={styl.Chat}>
      <div className={styl.cont}>
        <div className={styl.head}>
          <h2>CHAT</h2>
        </div>
        <div className={styl.chatBody}>
          <div className={styl.left}>
            <div className={styl.search}>
              <input
                type="text"
                placeholder="Search..."
              ></input>
            </div>
            <div className={styl.chatBox}>
                <div className={styl.cardMsg}>
                    <div className={styl.extImg}>
                        <div className={styl.intImg}></div>
                    </div>
                    <div className={styl.user}>
                        <p id={styl.userName}>NOUAHIDI</p>
                        {/* <p >slm cv hani mertah ...</p> */}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
