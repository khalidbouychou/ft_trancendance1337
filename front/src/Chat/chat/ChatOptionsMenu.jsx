import React, { useState, useEffect } from 'react';

function ChatOptionsMenu({ onBlockUser, onPlayPong, onPlayTicTacToe, otherUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

    // useEffect(() => {
    //     if (otherUser) {
    //         setIsBlocked(otherUser);
    //     }
    // }, [otherUser])

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);


  const handleBlockClick = () => {
    if (isBlocked) {
      // If already blocked, unblock immediately
      setIsBlocked(false);
      onBlockUser(false);
    } else {
      // If not blocked, show confirmation
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
    <div className="chat-options-menu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {console.log('otherUser: ', otherUser)}
      <button className="menu-toggle">⋮</button>
      {isOpen && (
        <ul className="menu-list">
          <li onClick={handleBlockClick}>
            {isBlocked ? "Unblock User" : "Block User"}
          </li>
          <li onClick={onPlayPong}>Play Pong</li>
          <li onClick={onPlayTicTacToe}>Play Tic-Tac-Toe</li>
          <li onClick={() => { /* Add more options here */ }}>Other Option</li>
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