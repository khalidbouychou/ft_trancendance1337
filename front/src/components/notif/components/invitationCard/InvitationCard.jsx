import React from "react";
import styl from "./InvitationCard.module.css";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { useNotificationWS } from '../../../../contexts/NotifWSContext.jsx'

const InvitationCard = ({request, t}) => {
  const [isVisible, setIsVisible] = useState(true)
	const [showPopup, setShowPopup] = useState(false);
	const { sendMessage: sendNotifMessage, isConnected, notif } = useNotificationWS();
	const navigate = useNavigate();

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

	const handleAccept = () => {
		if (isConnected) {
			sendNotifMessage({
				type: request.notif_type === 'FR' ? 'ACCEPT_FR' : 'ACCEPT_GR',
				from_user_id: request.from_user.id,
				game_type: request.game_type
			});
			if (request.notif_type === 'GR') {
				if (request.game_type == "PG"){
					const game_key = `${request.from_user.username}vs${request.to_user.username}`;
					navigate('/friendgame', { state: { game_key } });
				}
			}
		} 
		setIsVisible(false);
	};

	const handleDecline = () => {
		if (isConnected) {
			sendNotifMessage({
				type: request.notif_type === 'FR' ? 'DECLINE_FR' : 'DECLINE_GR',
				from_user_id: request.from_user.id,
				game_type: request.game_type
			});
		}
		setIsVisible(false);
	};

	if (!isVisible) {
		return null;
	}
  return (
    <div className={styl.invit}>
      <div className={styl.userImage}>
        <div className={styl.intImg}>
          <div className={styl.intImg}>
			<img src={request?.from_user?.avatar}/>
		  </div>
        </div>
      </div>
      <div className={styl.leftSide}>
        <p style={{ fontSize: "13px", color: "white" }}>{request?.from_user?.profile_name.toUpperCase()}</p>
        <p>{t("sent you an invitation")}</p>
        <div className={styl.shoose}>
          <button style={{ backgroundColor: "green" }} onClick={handleAccept}>{t("Accept")}</button>
          <button onClick={handleDecline} >{t("Decline")}</button>
        </div>
      </div>
    </div>
  )
};

export default InvitationCard;
