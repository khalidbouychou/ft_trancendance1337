import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styl from './ChatPage.module.css';

function ContactItem({ contact, currentUser, onClick, unreadMessages }) {
    const otherUser = contact.user1.id === currentUser.id ? contact.user2 : contact.user1;
    const unreadCount = unreadMessages[otherUser.id] || 0;

    return (
        <div className={styl.contact} onClick={onClick}>
            <div className={styl.contactInfo}>
            <div className={styl.contactAvatarContainer}>
                    {otherUser.avatar ? (
                        <img src={otherUser.avatar} alt={otherUser.username} className={styl.contactAvatar} />
                    ) : (
                        <div className={`${styl.contactAvatar} ${styl.defaultAvatar}`}>
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                    )}
                </div>
                <div className={styl.contactDetails}>
                    <span className={styl.contactName}>{otherUser.username}</span>
                    <div className={styl.contactMetadata}>
                        <span className={styl.contactLastMessage}>
                            {new Date(contact.modified_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </span>
                        {unreadCount > 0 && (
                            <span className={styl.contactUnread}>{unreadCount}</span>
                        )}
                        <span className={`${styl.contactLastMessage} ${otherUser.status_network}`}></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactItem;