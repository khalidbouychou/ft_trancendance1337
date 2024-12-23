import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserSlash, faUserCheck, faTableTennis, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { useNotificationWS } from '../../contexts/NotifWSContext.jsx';

function ChatOptionsMenu({ onBlockUser, onPlayPong, otherUser, currentUser, viewProfile, onFriendRequest }) {
  const { notif } = useNotificationWS();

  const [isOpen, setIsOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isFriend, setIsFriend] = useState('None');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const checkBlockStatus = () => {
      if (currentUser && otherUser) {
        for (let i = 0; i < currentUser.blocked_users.length; i++) {
          if (currentUser.blocked_users[i]['profile_name'] === otherUser.profile_name) {
            console.log("we find it in blocked list");
            setIsBlocked(true);
            return;
          }
        }
        setIsBlocked(false);
      }
    };
    checkBlockStatus();
    if (isFriend){
      for (let i = 0; i < currentUser.friends.length; i++) {
        if (currentUser.friends[i]['profile_name'] === otherUser.profile_name) {
          setIsFriend('friends');
          return;
        }
      }
    }
    console.log("friend will become none");
    setIsFriend('None');
  }, [otherUser, currentUser, isBlocked])

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

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

  const handleFriendClick = () => {
    console.log("u clicked friend:", isFriend);
    if (isFriend && isFriend == 'friends') {
      setIsFriend('None');
      onFriendRequest(false);
    }else {
      onFriendRequest(true);
    }
  }
  
  return (
    <div className="chat-options-menu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="menu-toggle">⋮</button>
      {isOpen && (
        <ul className="menu-list">
          {(!isBlocked) && (
            <li onClick={handleFriendClick}>
              <FontAwesomeIcon icon={faUserCheck} />
              {isFriend === 'friends'? "Unfriend" : "Add Friend"}
            </li>
          )}
          <li onClick={handleBlockClick}>
            <FontAwesomeIcon icon={isBlocked ? faUserSlash : faUserCheck} />
            {isBlocked ? "Unblock User" : "Block User"}
          </li>
          <li onClick={onPlayPong}>
            <FontAwesomeIcon icon={faTableTennis} />
            Play Pong
          </li>
          <li onClick={viewProfile}>
            <FontAwesomeIcon icon={faUser} />
            View Profile
          </li>
        </ul>
      )}
      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to block this {otherUser.username}?</p>
          <button onClick={handleConfirmBlock}>Confirm</button>
          <button onClick={handleCancelBlock}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default ChatOptionsMenu;