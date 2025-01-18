import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {toast } from "react-toastify";
import { AuthContext } from '../UserContext/Context';

const NotifWSContext = createContext();

export function NotificationWebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notif, setNotif] = useState(null);
  const [chatMesageNotif, setChatMesageNotif] = useState(false);
  const {t} = useContext(AuthContext);


  useEffect(() => {
    let ws;
    ws = new WebSocket(`wss://${import.meta.env.VITE_WSS_IP}/ws/notif/`);

    ws.onopen = () => {
      setSocket(ws);
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotif(data.notification);
      if (data.notification ) {
        if (data.notification.notif_type === "GR" && data.notification.status === "pending") {
            toast.success(t("you have been invited to a pong game"), {
            position: "top-left"
          })
        }
        else if (data.notification.status == "chat_message"){
          setChatMesageNotif(true);
        }
      }
    };

    ws.close = (close_code) => {
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } 
  }, [socket]);

  return (
    <NotifWSContext.Provider value={{ sendMessage, isConnected, notif ,setNotif, chatMesageNotif, setChatMesageNotif}}>
      {children}
    </NotifWSContext.Provider>
  );
}

export function useNotificationWS() {
  return useContext(NotifWSContext);
}
