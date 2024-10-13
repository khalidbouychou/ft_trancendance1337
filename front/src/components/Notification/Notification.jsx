import styl from './Notification.module.css'
import NotiCard from './component/NotiCard/NotiCard'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Notification = () => {
    const [FR_notif_received, setFR_notif_received] = useState([])
    const [GR_notif_received, setGR_notif_received] = useState([])
    const [FR_notif_sent, setFR_notif_sent] = useState([])
    const [GR_notif_sent, setGR_notif_sent] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/notif/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const notifications = response.data;
        setFR_notif_received(notifications.FR_notif_received);
        setGR_notif_received(notifications.GR_notif_received);
        setFR_notif_sent(notifications.FR_notif_sent);
        setGR_notif_sent(notifications.GR_notif_sent);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);
  return (
    <div className={styl.Notification}>
        <div className={styl.content}>
            <div className={styl.head}><h1>NOTIFICATION</h1></div>
            <div className={styl.cont}>
                <hr className={styl.line}/>
                <div className={styl.noti}>
                    <div className={styl.Request}>
                        <div className={styl.title}>
                            <h3 >Pending request</h3>
                        </div>
                        <div className={styl.card}>
                            {FR_notif_received.map((notif) => (
                                <NotiCard key={notif.id} request={`${notif.from_user.username} sent you a friend request`}/>
                            ))}
                        </div>
                    </div>
                    <div className={styl.Request}>
                        <div className={styl.title}>
                            <h3 >Game request</h3>
                        </div>
                        <div className={styl.card}>
                            {GR_notif_received.map((notif) => (
                                <NotiCard key={notif.id} request={`${notif.from_user.username} invited you to play ${notif.game_type}`}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Notification
