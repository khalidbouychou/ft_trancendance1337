import React from 'react';
import styl from './ChatPage.module.css';

function MessageItem({ message, currentUser }) {
    if (!currentUser) {
        return null;
    }
    const isCurrentUser = message.sender.username === currentUser.username;

    return (
        <div className={`${styl.message} ${isCurrentUser ? 'sent' : 'received'}`}>
            <div className={styl.messageContent}>
                <span className={styl.messageText}>{message.content}</span>
                <span className={styl.messageTime}>
                    {new Date(message.created_at).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    })}
                </span>
            </div>
        </div>
    );
}

export default MessageItem;