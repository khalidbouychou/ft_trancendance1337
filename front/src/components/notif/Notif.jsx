import styl from "./Notif.module.css";
// import NotiCard from './component/NotiCard/NotiCard'
// import NotiCardSent from './component/NotiCard/NotiCardSent'
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNotificationWS } from "../../contexts/NotifWSContext";
import { AuthContext } from "../../UserContext/Context";
import InvitationCard from "./components/invitationCard/InvitationCard";
import { GiCrossMark } from "react-icons/gi";
import { GiCheckMark } from "react-icons/gi";
import InvitGameCard from "./components/invitGameCard/InvitGameCard";
import NotiCardSent from "./components/notiCardSent/NotiCardSent";
const XNotif = ({open}) => {
  const { t } = useContext(AuthContext);
  const [FR_notif_received, setFR_notif_received] = useState([]);
  const [GR_notif_received, setGR_notif_received] = useState([]);
  const [FR_notif_sent, setFR_notif_sent] = useState([]);
  const [GR_notif_sent, setGR_notif_sent] = useState([]);

  const { notif } = useNotificationWS();

  useEffect(() => {
    if (notif && notif.status === "pending") {
      if (notif.notif_type === "FR") {
        setFR_notif_received([...FR_notif_received, notif]);
      } else if (notif.notif_type === "GR") {
        setGR_notif_received([...GR_notif_received, notif]);
      }
    }
  }, [notif]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/notif/", {
          withCredentials: true,
        });
        const notifications = response.data;
        setFR_notif_received(notifications.FR_notif_received);
        setGR_notif_received(notifications.GR_notif_received);
        setFR_notif_sent(notifications.FR_notif_sent);
        setGR_notif_sent(notifications.GR_notif_sent);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);
  console.log("GR_notif_receivedd", FR_notif_received);
  return (
    <div className={styl.notif} style={{display: open}}>
      {FR_notif_received.map((notif) => (
        // <div className={styl.invit}>
        //   <div className={styl.userImage}>
        //     <div className={styl.intImg}>
        //       <div className={styl.intImg}></div>
        //     </div>
        //   </div>
        //   <div className={styl.leftSide}>
        //     <p style={{fontSize: '13px', color: 'white'}}>NOUAHIDI </p>
        //     <p >sent you an invitation</p>
        //     <div className={styl.shoose}>
        //       <button style={{backgroundColor: 'green'}}>Accept</button>
        //       <button >Decline</button>
        //     </div>
        //   </div>
        // </div>
        <InvitationCard key={notif.id} request={notif} />
      ))}
      {GR_notif_received.map((notif) => (
        <InvitGameCard key={notif.id} request={notif}/>
      ))}
      {/* <div className={styl.notiCardSent}>
        <div className={styl.userImage}>
          <div className={styl.intImg}>
            <div className={styl.intImg}></div>
          </div>
        </div>
        <div className={styl.leftSide}>
          <p >Friend request sent to</p>
          <p style={{fontSize: '13px', color: 'white'}}>NOUAHIDI </p>
          <button ><p >Cancel friend request</p></button>
        </div>
      </div> */}
      {/* {FR_notif_sent.map((notif) => (
        <NotiCardSent key={notif.id} request={notif}/>
      ))} */}
    </div>
  );
};

export default XNotif;
