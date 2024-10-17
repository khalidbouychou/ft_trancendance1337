import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserSlash, faUserCheck, faTableTennis, faGamepad } from '@fortawesome/free-solid-svg-icons';

function ChatOptionsMenu({ onPlayPong, onPlayTicTacToe, otherUser, currentUser, viewProfile, onFriendRequest }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isFriend, setIsFriend] = useState('None');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const checkBlockStatus = () => {
      if (currentUser && otherUser) {
        const isOtherUserBlocked = currentUser.blocked_users.includes(otherUser.id);
        const areFriends = currentUser.friends.some(friend => (
          (friend.user1.username === otherUser.username && friend.user2.username === otherUser.username)
        ));
        console.log('areFriends:', areFriends ? 'friends' : 'None');
        setIsBlocked(isOtherUserBlocked);
        setIsFriend(areFriends ? 'friends' : 'None');
      }
    };
    checkBlockStatus();
  }, [otherUser, currentUser])

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
    if (isFriend) {
      setIsFriend(false);
      onFriendRequest(false);
    }
  }
  
  return (
    <div className="chat-options-menu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="menu-toggle">⋮</button>
      {isOpen && (
        <ul className="menu-list">
          {isFriend === 'None' && (
            <li onClick={handleFriendClick}>
              <FontAwesomeIcon icon={faUserCheck} />
              Send Friend Request
            </li>
          )}
          {isFriend === 'invited' && (
            <li onClick={handleFriendClick}>
              <FontAwesomeIcon icon={faUserCheck} />
              Accept Friend Request
            </li>
          )}
          {/* <li onClick={handleBlockClick}>
            <FontAwesomeIcon icon={isBlocked ? faUserSlash : faUserCheck} />
            {isBlocked ? "Unblock User" : "Block User"}
          </li> */}
          <li onClick={onPlayPong}>
            <FontAwesomeIcon icon={faTableTennis} />
            Play Pong
          </li>
          <li onClick={onPlayTicTacToe}>
            <FontAwesomeIcon icon={faGamepad} />
            Play Tic-Tac-Toe
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