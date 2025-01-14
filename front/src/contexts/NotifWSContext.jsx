import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from "react-toastify";

const NotifWSContext = createContext();

export function NotificationWebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    let ws;
    ws = new WebSocket(`ws://10.13.6.7:8000/ws/notif/`);

    ws.onopen = () => {
      console.log("notif socket opened");
      setSocket(ws);
      setIsConnected(true);
      // toast.success("socket ta3 notif te7elat", {
      //   position: "top-left"
      // });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>notif data:", data);
      setNotif(data.notification);
      if (data.notification ) {
        console.log("we received a notification:", data.notification);
        if (data.notification.notif_type === "GR" && data.notification.status === "pending") {
          console.log("it was an invite to a pong game");
            toast.success("u been invited to a pong game", {
            position: "top-left"
          })
        }
      }
    };

    ws.onerror = (error) => {
      console.error("socket error:", error);
      // toast.error("socket error", {
      //   position: "top-left"
      // });
    }

    ws.close = (close_code) => {
      console.log("socket tedat", close_code);
      // toast.success("socket tesedat", {
      //   position: "top-left"
      // });
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const sendMessage = useCallback((message) => {
    console.log("the socket:", socket, "socket state:", socket.readyState);
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log('Sending message:', message);
      socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }, [socket]);

  return (
    <NotifWSContext.Provider value={{ sendMessage, isConnected, notif ,setNotif}}>
      {children}
      <ToastContainer />
    </NotifWSContext.Provider>
  );
}

export function useNotificationWS() {
  return useContext(NotifWSContext);
}
