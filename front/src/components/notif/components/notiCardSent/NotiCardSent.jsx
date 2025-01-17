import React from "react";
import styl from './NotiCardSent.module.css'
import { useState,useEffect} from 'react';
import { useNotificationWS } from "../../../../contexts/NotifWSContext.jsx"
const NotiCardSent = ({request, type , t}) => {

  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const { sendMessage: sendNotifMessage, isConnected, notif} = useNotificationWS();

  useEffect(() => {
    if (request.notif_type === 'GR') {
        const createdAt = new Date(request.created_at).getTime();
        const now = new Date().getTime();
        const initialTimeLeft = Math.max(0, 30 - Math.floor((now - createdAt) / 1000));
        setTimeLeft(initialTimeLeft);
    
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(timer);
              setIsVisible(false);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
    
        return () => clearInterval(timer);
    }
  }, []);

  useEffect(() => {
    if (notif && notif.id === request.id && notif.status !== 'pending') {
      setPopupMessage(`Request ${notif.status}`);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setIsVisible(false);
      }, 1000);
    }
  }, [notif]);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleCancel = () => {
    if (isConnected) {
      sendNotifMessage({
        type: request.notif_type === 'FR' ? 'CANCEL_FR' : 'CANCEL_GR',
        to_user_id: request.to_user.id,
        game_type: request.game_type
      });
    }
    setIsVisible(false);
  };
  
  if (!isVisible) {
    return null;
  }
  return (
    <div className={styl.notiCardSent}>
      <div className={styl.userImage}>
        <div className={styl.intImg}>
          <div className={styl.intImg}>
            <img src={request?.to_user?.avatar}/>
          </div>
        </div>
      </div>
      <div className={styl.leftSide}>
        <p>{type === 'FR' ? t('Friend request sent to') : t('Game invitation to') }</p>
        <p style={{ fontSize: "13px", color: "white" }}>{request?.to_user?.profile_name.toUpperCase()}</p>
        <button onClick={handleCancel}>
          <p>{type === 'FR' ? t('Cancel friend request') : t('Cancel invitation Game') }</p>
        </button>
      </div>
    </div>
  );
};

export default NotiCardSent;
