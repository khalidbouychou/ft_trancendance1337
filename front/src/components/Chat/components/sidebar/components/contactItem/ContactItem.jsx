import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styl from "./ContactItem.module.css";

function ContactItem({ contact, currentUser, onClick, unreadMessages }) {
  const otherUser =
    contact.user1.id === currentUser.id ? contact.user2 : contact.user1;
  const unreadCount = unreadMessages[otherUser.id] || 0;

  console.log("otherUser.status_network",unreadCount)

  return (
    <div className={styl.contactCard} onClick={onClick}>
      <div className={styl.intImg} >
        <div className={styl.intImg} style={{width: '42px', height: '47px'}}>
            <img
                src={otherUser.avatar}
                alt={otherUser.profile_name}
            />
        </div>
      </div>
      <div className={styl.contactDetails}>
        <span className={styl.contactName}>
          {otherUser.profile_name.toUpperCase()}
          <div className={styl.status} style={{backgroundColor: otherUser.status_network === 'online' ? 'green' : 'red'}}></div>
        </span>
        <div className={styl.contactMetadata}>
          <span className={styl.contactLastMessage}>
            {new Date(contact.modified_at).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
          {unreadCount > 0 && (
            <div className={styl.status} style={{width: '15px', height: '15px'}}>{unreadCount}</div>
          )}
          {/* <span
            className={styl.contactLastMessage}
          ></span> */}
        </div>
      </div>
    </div>
  );
}

export default ContactItem;
