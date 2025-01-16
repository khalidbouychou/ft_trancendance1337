import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styl from './ChatOptionsMenu.module.css';
import { faUser, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { RiPingPongFill } from "react-icons/ri";
import { TbLockOpenOff, TbLock } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotificationWS } from "../../../../../../contexts/NotifWSContext";

function ChatOptionsMenu({ onBlockUser, onPlayPong, otherUser, currentUser, viewProfile, t }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [amiBlocked, setAmIBlocked] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [menuList, setMenuList] = useState('none');
  const navigate = useNavigate();
  const { notif , setNotif} = useNotificationWS();

  useEffect(() => {
    if (notif && notif.status === 'BLOCK'){
      if (notif.user_id === otherUser.id){
        setAmIBlocked(true);
        setNotif(null);
      }
    }
    else if (notif && notif.status === 'UNBLOCK'){
      if (notif.user_id === otherUser.id){
        setAmIBlocked(false);
        setNotif(null);
      }
    }
  }, [notif])

  const check_blocked = async () => {
        const response1 = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/api/getuser/${currentUser.profile_name}/` , {
          withCredentials: true,
        });
        const response2 = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/api/getuser/${otherUser.profile_name}/` , {
          withCredentials: true,
        });
        const didIBlockHim = response1.data.blocked_users.find(e => {return e.profile_name === otherUser.profile_name}) != undefined ? true : false;
        const didHeBlockMe = response2.data.blocked_users.find(e => {return e.profile_name === currentUser.profile_name}) != undefined ? true : false;
        setIsBlocked(didIBlockHim);
        setAmIBlocked(didHeBlockMe);
      }
  useEffect(() => {
    check_blocked();
  }, [otherUser, currentUser]);

  const handleMenuListOpen = () => {
    if (menuList === 'none' && showConfirmation === true)
      setShowConfirmation(false);
    setMenuList(menuList === 'none' ? 'flex' : 'none');
  };

  const handleBlockClick = () => {
    if (isBlocked) {
      setIsBlocked(false);
      onBlockUser(false);
    } else {
      setShowConfirmation(true);
    }
  };

  const handleConfirmBlock = () => {
    setIsBlocked(true);
    setShowConfirmation(false);
    onBlockUser(true);
  };

  const handleCancelBlock = () => {
    setShowConfirmation(false);
  };

  return (
    <div className={styl.chatOptionsMenu}>
      { !amiBlocked ? (
      <button className={styl.menuToggle} onClick={handleMenuListOpen}>
        <p>⋮</p>
        <div className={styl.menuList} style={{ display: menuList }}>
          {
            !isBlocked ? (<div className={styl.cards} onClick={onPlayPong}>
              <RiPingPongFill className={styl.icon} />
              <p>{t("Invite in Game")}</p>
            </div>) : null
          }
          <div className={styl.cards} onClick={handleBlockClick}>
            {isBlocked ? (
              <TbLockOpenOff className={styl.icon} />
            ) : (
              <TbLock className={styl.icon} />
            )}
            <p>{isBlocked ? t("Unblock User") : t("Block User")}</p>
          </div>
          <div className={styl.cards} onClick={viewProfile}>
            <FaRegUserCircle className={styl.icon} />
            <p>{t("View Profile")}</p>
          </div>
        </div>
        {showConfirmation && (
          <div className={styl.confirmationDialog}>
            <p>{t(`Are you sure you want to block ${otherUser.username}?`)}</p>
            <button onClick={handleConfirmBlock} style={{ backgroundColor: 'red' }}>
              {t("Confirm")}
            </button>
            <button onClick={handleCancelBlock} style={{ backgroundColor: 'blue' }}>
              {t("Cancel")}
            </button>
          </div>
        )}
      </button>) : (
        <button className={styl.menuToggle} onClick={handleMenuListOpen}></button>
        )
      }
    </div>
  );
}

export default ChatOptionsMenu;
