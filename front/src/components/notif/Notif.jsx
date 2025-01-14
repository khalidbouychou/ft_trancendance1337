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
const Notif = ({ open, notifReceived, setNotifReceived }) => {
  const { t } = useContext(AuthContext);
  const [FR_notif_received, setFR_notif_received] = useState([]);
  const [GR_notif_received, setGR_notif_received] = useState([]);
  const [FR_notif_sent, setFR_notif_sent] = useState([]);
  const [GR_notif_sent, setGR_notif_sent] = useState([]);

  const { notif, setNotif} = useNotificationWS();

  // WebSocket notification handler
  useEffect(() => {
    if (notif && notif.status === "pending") {
      if (notif.notif_type === "FR") {
        setFR_notif_received([...FR_notif_received, notif]);
        setNotifReceived(true)
        setNotif(null)
      } else if (notif.notif_type === "GR") {
        setGR_notif_received([...GR_notif_received, notif]);
        setNotifReceived(true)
        setNotif(null)
      }
    }
    console.log('notif1', notif);
  }, [notif]);

  // Fetch notifications on initial load
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://10.13.6.7:8000/api/notif/", {
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
  }, [open]);

  return (
    <div className={styl.notif} style={{ display: open }}>
      {FR_notif_received.map((notif) => (
        <InvitationCard key={notif.id} request={notif} />
      ))}
      {GR_notif_received.map((notif) => (
        <InvitGameCard key={notif.id} request={notif} />
      ))}
      {FR_notif_sent.map((notif) => (
        <NotiCardSent key={notif.id} request={notif} type={"FR"} />
      ))}
      {GR_notif_sent.map((notif) => (
        <NotiCardSent key={notif.id} request={notif} type={"GR"} />
      ))}
    </div>
  );
};

export default Notif;
