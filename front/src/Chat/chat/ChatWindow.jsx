import React, { useState, useEffect } from 'react';
import MessageItem from './MessageItem';
import ChatOptionsMenu from './ChatOptionsMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
    
function ChatWindow({ currentContact, chat, message, sendMessage, handleTyping, currentUser, chatMessagesRef, sockets }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [otherUser, setOtherUser] = useState(null);

    useEffect(() => {
        if (currentContact) {
            setOtherUser(currentContact.user1.id === currentUser.id ? currentContact.user2 : currentContact.user1);
        } else {
            setOtherUser(null);
        }
    }, [currentContact])

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleBlockUser = (e) => {
        if (!otherUser) {
            return;
        }
        if (sockets[currentContact.id] && sockets[currentContact.id].readyState === WebSocket.OPEN) {
            sockets[currentContact.id].send(JSON.stringify({
                type: 'BLOCK_USER',
                event: e ? 'BLOCK' : 'UNBLOCK',
                user_id: otherUser.id
            }));
        }
    };

    const handlePlayPong = () => {
        console.log('Play Pong');
    };

    const handlePlayTicTacToe = () => {
        console.log('Play Tic-Tac-Toe');
    };
    return (
        <div className="chat-container">
            {otherUser ? (
                <>
                    <div className="chat-header">
                        <div className="current-contact">
                            {otherUser.avatar ? (
                                <img src={otherUser.avatar} alt={otherUser.username} className="contact-avatar" />
                            ) : (
                                <div className="contact-avatar default-avatar">
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                            )}
                            <span className="contact-name">
                                {otherUser.username}
                            </span>
                        </div>
                        <ChatOptionsMenu
                            onBlockUser={handleBlockUser}
                            onPlayPong={handlePlayPong}
                            onPlayTicTacToe={handlePlayTicTacToe}
                            otherUser={otherUser}
                        />
                    </div>
                    <div className="chat-messages" ref={chatMessagesRef}>
                        {chat.map((msg, index) => (
                            <MessageItem key={index} message={msg} currentUser={currentUser} />
                        ))}
                    </div>
                    <div className="chat-form-container">
                        <form className="chat-form" onSubmit={sendMessage}>
                            <input
                                type="text"
                                className="chat-message"
                                value={message}
                                onChange={handleTyping}
                                placeholder="Type a message"
                            />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                </>
            ) : (
                <div className="no-contact-selected">
                    <p>Select a contact to start chatting</p>
                </div>
            )}
        </div>
    );
}

export default ChatWindow;