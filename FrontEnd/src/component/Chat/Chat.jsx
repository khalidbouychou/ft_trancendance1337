
import List from "./list/list";
import MiniChat from "./miniChat/MiniChat";
import Info from "./info/info";
import  style from  "./Chat.module.css"
import { useEffect } from "react";

import { Link } from "react-router-dom";


const Chat = () => {

  // useEffect(() => {
  //    document.title = "Chat"
  // })

  return (
    <>
      <h1>chat</h1>
      <Link to="/chat">chat</Link>
      <br />
      <Link to="/game">game</Link>
      <br />
      <Link to="/profil">profil</Link>
      <br />
      <Link to="/setting">setting</Link>
      <br />
      <Link to="/otp">otp</Link>
    </>
  );

    // return(

    //     <div className={style.container}>
    //     <h1>CHAT</h1>
    
    //       <div className={style.helloo}>
            
    //         <List />
    //         <MiniChat />
    //         <Info />
    //       </div>
    
    //     </div>

    // )

}

export default Chat