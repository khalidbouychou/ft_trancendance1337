
import List from "./list/list";
import MiniChat from "./miniChat/MiniChat";
import Info from "./info/info";
import  style from  "./Chat.module.css"
import { useEffect } from "react";



const Chat = () => {

  useEffect(() => {
     document.title = "Chat"
  })

    return(

        <div className={style.container}>
        <h1>CHAT</h1>
    
          <div className={style.helloo}>
            
            <List />
            <MiniChat />
            <Info />
          </div>
    
        </div>

    )

}

export default Chat