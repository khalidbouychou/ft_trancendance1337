
import { AuthContext } from "../../UserContext/Context.jsx";
import React, { useState, useEffect, useRef, useContext } from "react";
import styl from "./Chat.module.css";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import ChatWindow from "./components/chatWindow/ChatWindow.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotificationWS } from "../../contexts/NotifWSContext";

const Chat = () => {
  const {notif , setNotif, setChatMesageNotif, chatMesageNotif} = useNotificationWS();
  const { t } = useContext(AuthContext);
  const [sockets, setSockets] = useState({});
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [currentContact, setCurrentContact] = useState("");
  const [unreadMessages, setUnreadMessages] = useState({});
  const [roomId, setRoomId] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [typingUser, setTypingUser] = useState([]);
  const [receivedMessage, setReceivedMessage] = useState({});
  const [notificationSocket, setNotificationSocket] = useState(null);
  const [data, setData] = useState({
    chat_rooms: [],
    user: {},
  });
  const chatMessagesRef = useRef(null);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chat]);


  useEffect(() => {
      if (notif && notif.message === 'status') {
        setData((prevData) => {
          const updatedChatRooms = prevData.chat_rooms.map((room) => {
            if (notif.offline && room.user1.id === notif.offline) {
              return {
                ...room,
                user1: { ...room.user1, status_network: 'offline' },
              };
            } else if (notif.offline && room.user2.id === notif.offline) {
              return {
                ...room,
                user2: { ...room.user2, status_network: 'offline' },
              };
            } else if (notif.online && room.user1.id === notif.online) {
              return {
                ...room,
                user1: { ...room.user1, status_network: 'online' },
              };
            } else if (notif.online && room.user2.id === notif.online) {
              return {
                ...room,
                user2: { ...room.user2, status_network: 'online' },
              };
            }
            return room;
          });
    
          return {
            ...prevData,
            chat_rooms: updatedChatRooms,
          };
        });
        setNotif(null);
      }

    }, [notif])

    useEffect(() => {
      if (chatMesageNotif) {
        setChatMesageNotif(false);
      }
    }, [chatMesageNotif])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(`${import.meta.env.VITE_BACKEND_IP}/api/chat/`, {
          withCredentials: true,
        });
        setData(response.data);
        setupSocket(1);
        initUnreadMessages(response.data);
      } catch (error) {
        console.error("chat", error);

      }
    };

    if (!hasFetchedData.current) {
      fetchData();
      hasFetchedData.current = true;
    }

    return () => {
      if (notificationSocket) {
        notificationSocket.close();
      }
    };
  }, []);

  const initUnreadMessages = (data) => {
    const urmsg = {};
    data.chat_rooms.forEach((room) => {
      const otherUserId =
        room.user1.id === data.user.id ? room.user2.id : room.user1.id;
      let unreadCount = 0;
      for (let i = room.messages.length - 1; i >= 0; i--) {
        const message = room.messages[i];
        if (message.sender.id === data.user.id) {
          break;
        }
        if (!message.is_read && message.receiver.id === data.user.id) {
          unreadCount++;
        }
      }
      urmsg[otherUserId] = unreadCount;
    });
    setUnreadMessages(urmsg);
  };

  useEffect(() => {
    if (currentContact) {
      const contactId =
        currentContact.user1.id === data.user.id
          ? currentContact.user2.id
          : currentContact.user1.id;
      setUnreadMessages({
        ...unreadMessages,
        [contactId]: 0,
      });
      if (
        sockets[currentContact.id] &&
        sockets[currentContact.id].readyState === WebSocket.OPEN
      ) {
        sockets[currentContact.id].send(
          JSON.stringify({
            type: "MARK_AS_READ",
            room_id: currentContact.id,
            user: data.user.id,
          })
        );
      }
    }
  }, [currentContact]);

  useEffect(() => {
    Object.entries(unreadMessages).forEach(([userId, count]) => {
      const user = data.chat_rooms
        .flatMap((room) => [room.user1, room.user2])
        .find((user) => user.id === parseInt(userId));
  
    });
  }, [unreadMessages]);

  useEffect(() => {
    if (!receivedMessage) {}
    if (receivedMessage.chat_room === roomId) {
      setChat((prevChat) => [...prevChat, receivedMessage]);
    } else if (receivedMessage && receivedMessage.sender) {
      setUnreadMessages({
        ...unreadMessages,
        [receivedMessage.sender.id]:
          (unreadMessages[receivedMessage.sender.id] || 0) + 1,
      });
    }
  }, [receivedMessage]);


  

  const updateChatRooms = (prevData, newMessage) => {
    const updatedChatRooms = prevData.chat_rooms.map((room) => {
      if (room.id === newMessage.chat_room) {
        const messageExists = room.messages.some(
          (msg) => msg.id === newMessage.id
        );
        if (!messageExists) {
          return {
            ...room,
            messages: [...room.messages, newMessage],
            modified_at: new Date().toISOString(),
          };
        }
      }
      return room;
    });

    if (!updatedChatRooms.some((room) => room.id === newMessage.chat_room)) {
      updatedChatRooms.push({
        id: newMessage.chat_room,
        user1: newMessage.sender,
        user2: newMessage.receiver,
        messages: [newMessage],
        created_at: new Date().toISOString(),
        modified_at: new Date().toISOString(),
      });
    }

    return {
      ...prevData,
      chat_rooms: updatedChatRooms,
    };
  }; 


  const setupSocket = (room_id) => {
    return new Promise((resolve, reject) => {
      if (!room_id) {
        return reject(new Error("No room ID provided"));
      }
      if (sockets[room_id]) {
        resolve(sockets[room_id]);
      }

      const newSocket = new WebSocket(
        `wss://${import.meta.env.VITE_WSS_IP}/ws/chat/${room_id}/`);

      newSocket.onopen = () => {
        setSockets((prev) => ({
          ...prev,
          [room_id]: newSocket,
        }));
        resolve(newSocket);
      };

      newSocket.onerror = (error) => {
        reject(error);
      };
      newSocket.onmessage = (event) => {
        const data_re = JSON.parse(event.data);
        switch (data_re.type) {
          case "USERS_LIST":
            setAllUsers(data_re.users);
            break;
          case "MESSAGE":
            if (!data_re.message || !data_re.message.sender) {
              break;
            }
            setData((prevData) => updateChatRooms(prevData, data_re.message));

            setReceivedMessage(data_re.message);
            break;
          case 'NEW_ROOM':
          {
            let exist = false;
            for (let i = 0; i < data.chat_rooms.length; i++) {
              if (data.chat_rooms[i].id === data_re.room_data.id) {
                exist = true;
                break;
              }
            }
            if (exist) {
              setData(prevData => ({
                ...prevData,
                chat_rooms: [...prevData.chat_rooms, data_re.room_data]
              }));
            }
          }
          case "TYPING":
            setTypingUser(data_re);
            break;
          case "USER_SELECTED":
            if (data_re.status === "OK") {
              if (!data.chat_rooms.some(room => room.id === data_re.chat_room.id)) {
                setupChatRoom(data_re.chat_room);
              }
              resolve(newSocket);
            }
            break;
          case "BLOCK_USER":
            if (data_re.event === "BLOCK") {
              setData((prevData) => ({
                ...prevData,
                user: {
                  ...prevData.user,
                  blocked_users: Array.from(
                    new Set([...prevData.user.blocked_users, data_re.user_id])
                  ),
                },
              }));
            }
          else if (data_re.event === "UNBLOCK") {
              setData((prevData) => ({
                ...prevData,
                user: {
                  ...prevData.user,
                  blocked_users: prevData.user.blocked_users.filter(
                    (id) => id !== data_re.user_id
                  ),
                },
              }));
            }
            break;
          default:
            break;
        }
      };

      newSocket.onclose = (event) => {
        setSockets((prev) => {
          const { [room_id]: _, ...newSockets } = prev;
          return newSockets;
        });
      };

      setSockets((prev) => ({
        ...prev,
        [room_id]: newSocket,
      }));

      return () => newSocket.close();
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      if (sockets[roomId] && sockets[roomId].readyState === WebSocket.OPEN) {
        sockets[roomId].send(
          JSON.stringify({
            type: "MESSAGE",
            room_id: roomId,
            sender: data.user.id,
            content: message,
          })
        );
        setMessage("");
      }
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (sockets[roomId] && sockets[roomId].readyState === WebSocket.OPEN) {
      sockets[roomId].send(
        JSON.stringify({
          type: "TYPING",
          room_id: roomId,
          sender: data.user.id,
        })
      );
    }
  };

  const setupChatRoom = async (contact) => {
    setCurrentContact(contact);
    setRoomId(contact.id);
    setChat(contact.messages);
    await setupSocket(contact.id);
  };
  
  return (
    <div className={styl.chatApp}>
      <div className={styl.content}>
        <div className={styl.chatLayout}>
          <Sidebar
            setupChatRoom={setupChatRoom}
            setupSocket={setupSocket}
            data={data}
            allUsers={allUsers}
            unreadMessages={unreadMessages}
            t={t}
          />
          <ChatWindow
            currentContact={currentContact}
            chat={chat}
            message={message}
            sendMessage={sendMessage}
            handleTyping={handleTyping}
            data={data}
            chatMessagesRef={chatMessagesRef}
            sockets={sockets}
            typingUser={typingUser}
            t={t}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
