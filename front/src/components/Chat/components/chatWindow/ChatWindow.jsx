import React, { useState, useEffect } from "react";
import MessageItem from "./components/messageItem/MessageItem.jsx";
import ChatOptionsMenu from "./components/chatOptionsMenu/ChatOptionsMenu.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import styl from "./ChatWindow.module.css";
import { useNotificationWS } from "../../../../contexts/NotifWSContext.jsx";

export default function ChatWindow({
  currentContact,
  chat,
  message,
  sendMessage,
  handleTyping,
  data,
  chatMessagesRef,
  sockets,
  typingUser,
  t,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { sendMessage: sendNotifMessage, isConnected } = useNotificationWS();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentContact) {
      setOtherUser(
        currentContact.user1.id === data.user.id
          ? currentContact.user2
          : currentContact.user1
      );
    } else {
      setOtherUser(null);
    }
  }, [currentContact]);

  useEffect(() => {
    if (typingUser && otherUser) {
      if (typingUser.sender === otherUser.id) {
        setIsTyping(true);
      }
    }
  }, [typingUser]);

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  useEffect(() => {
    if (data.user) {
      setCurrentUser(data.user);
    }
  }, [data.user]);

  const handleBlockUser = (e) => {
      if (!otherUser) {}
      if (sockets[currentContact.id] && sockets[currentContact.id].readyState === WebSocket.OPEN) {
          sockets[currentContact.id].send(JSON.stringify({
              type: 'BLOCK_USER',
              event: e ? 'BLOCK' : 'UNBLOCK',
              user_id: otherUser.id 
          }));
      }
  };

  const handlePlayPong = () => {
    if (isConnected) {
      sendNotifMessage({
        type: "SEND_GR",
        game_type: "PG",
        to_user_id: otherUser.id,
      });
      const pong_socket = new WebSocket(`wss://${import.meta.env.VITE_WSS_IP}/ws/play-friend/`);
      pong_socket.onopen = () => {
        const data2 = {
          action: "friend_game",
          player1: currentUser.username,
          avatar1: currentUser.avatar,
          player2: otherUser.username,
          avatar2: otherUser.avatar,
          game_id: `${currentUser.username + "vs" + otherUser.username}`,
        };
        pong_socket.send(JSON.stringify(data2));
        const game_key = `${currentUser.username}vs${otherUser.username}`;
        navigate("/friendgame", { state: { game_key } });
      };
    }
  };

  const viewProfile = () => {
    navigate(`/profile/${otherUser.profile_name}`);
  };

  return (
    <div className={styl.chatContainer}>
      {otherUser ? (
        <>
          <div className={styl.chatHeader}>
            <div className={styl.currentContact}>
              <div className={styl.intImg}>
                <div className={styl.intImg} style={{width: '42px', height: '47px'}}>
                  <img
                    src={otherUser.avatar}
                    alt={otherUser.profile_name}
                  />
                </div>
              </div>
              <span className={styl.contactName}>{otherUser.profile_name.toUpperCase()}</span>
              {isTyping && (
                <div className={styl.typingIndicator}>
                  <p>Typing...</p>
                </div>
              )}
            </div>
            {(otherUser.username !== "ke3ki3a") &&
            <ChatOptionsMenu
              onBlockUser={handleBlockUser}
              onPlayPong={handlePlayPong}
              otherUser={otherUser}
              currentUser={currentUser}
              viewProfile={viewProfile}
              t={t}
            />}
          </div>
          <div className={styl.chatMessages} ref={chatMessagesRef}>
            {chat.map((msg, index) => (
              <MessageItem
                key={index}
                message={msg}
                currentUser={currentUser}
              />
            ))}
          </div>
          {(otherUser.username !== "ke3ki3a") &&
          <div className={styl.chatFormContainer} onClick={sendMessage}>
            <form className={styl.chatForm} onSubmit={sendMessage}>
              <input
                type="text"
                className={styl.chatMessage}
                value={message}
                onChange={handleTyping}
                placeholder={t("Type a message")}
                maxLength={1000}
              />
            </form>
          </div>
          }
        </>
      ) : (
        <div className={styl.noContactSelected}>
          <p>{t("Select a contact to start chatting")}</p>
        </div>
      )}
    </div>
  );
}
