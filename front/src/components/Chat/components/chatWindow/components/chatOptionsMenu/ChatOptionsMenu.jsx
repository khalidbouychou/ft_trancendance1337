import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styl from './ChatOptionsMenu.module.css';
import { faUser, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { RiPingPongFill } from "react-icons/ri";
import { TbLockOpenOff, TbLock } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ChatOptionsMenu({ onBlockUser, onPlayPong, otherUser, currentUser, viewProfile, t }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  // const [isFriend, setIsFriend] = useState('None');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [menuList, setMenuList] = useState('none');
  const navigate = useNavigate();

  const check_blocked = async () => {
        const response = await axios.get(`http://10.11.10.12:8000/api/getuser/${currentUser.profile_name}/` , {
          withCredentials: true,
        });
        console.log('response:', response.data)
        console.log('blocked_users:', response.data.blocked_users)
        const isOtherUserBlocked = response.data.blocked_users.find(e => {return e.profile_name === otherUser.profile_name}) != undefined ? true : false;
        setIsBlocked(isOtherUserBlocked);
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

  // const handleNavigate = () => {
  //   setShowConfirmation(false);
  //   navigate(`/profile/${otherUser.username}`);
  // };

  return (
    <div className={styl.chatOptionsMenu}>
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
      </button>
    </div>
  );
}

export default ChatOptionsMenu;
