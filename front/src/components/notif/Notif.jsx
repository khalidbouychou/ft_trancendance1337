import styl from "./Notif.module.css";
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
  }, [notif]);


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/api/notif/`, {
          withCredentials: true,
        });
        const notifications = response.data;
        setFR_notif_received(notifications.FR_notif_received);
        setGR_notif_received(notifications.GR_notif_received);
        setFR_notif_sent(notifications.FR_notif_sent);
        setGR_notif_sent(notifications.GR_notif_sent);
      } catch (error) {
        console.error("notif", error);

      }
    };

    fetchNotifications();
  }, [open]);

  return (
    <div className={styl.notif} style={{ display: open }}>
      {FR_notif_received.map((notif) => (
        <InvitationCard key={notif.id} request={notif} t={t}/>
      ))}
      {GR_notif_received.map((notif) => (
        <InvitGameCard key={notif.id} request={notif} t={t}/>
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
