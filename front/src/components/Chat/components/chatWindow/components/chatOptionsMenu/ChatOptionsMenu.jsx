import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styl from './ChatOptionsMenu.module.css';
import { faUser, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { RiPingPongFill } from "react-icons/ri";
import { TbLockOpenOff, TbLock } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function ChatOptionsMenu({ onBlockUser, onPlayPong, otherUser, currentUser, viewProfile, t }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  // const [isFriend, setIsFriend] = useState('None');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [menuList, setMenuList] = useState('none');
  const navigate = useNavigate();

  useEffect(() => {
    // const areFriends = currentUser?.friends.find(friend =>
    //   friend.user1 === otherUser.username || friend.user2 === otherUser.username
    // );
    // if (areFriends) {
    //   setIsFriend(areFriends.status);
    // } else {
    //   setIsFriend('None');
    // }

    const isOtherUserBlocked = currentUser?.blocked_users.includes(otherUser.id);
    setIsBlocked(isOtherUserBlocked);
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

  const handleNavigate = () => {
    setShowConfirmation(false);
    navigate(`/profile/${otherUser.username}`);
  };

  return (
    <div className={styl.chatOptionsMenu}>
      <button className={styl.menuToggle} onClick={handleMenuListOpen}>
        <p>⋮</p>
        <div className={styl.menuList} style={{ display: menuList }}>
          <div className={styl.cards} onClick={onPlayPong}>
            <RiPingPongFill className={styl.icon} />
            <p>{t("Invite in Game")}</p>
          </div>
          <div className={styl.cards} onClick={handleBlockClick}>
            {isBlocked ? (
              <TbLockOpenOff className={styl.icon} />
            ) : (
              <TbLock className={styl.icon} />
            )}
            <p>{isBlocked ? t("Unblock User") : t("Block User")}</p>
          </div>
          <div className={styl.cards} onClick={handleNavigate}>
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
