import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotifWSContext = createContext();

export function NotificationWebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notif, setNotif] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    let reconnectTimeout;

    const connect = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        handleReconnect();
        return;
      }

      let ws;
      try {
        ws = new WebSocket(`ws://${import.meta.env.VITE_IP_HOST}:8000/ws/notif/?token=${token}`);
      } catch (error) {
        handleReconnect();
        return;
      }

      ws.onopen = () => {

        setSocket(ws);
        setIsConnected(true);
        setReconnectAttempts(0);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
       
        setNotif(data.notification);
      };

      ws.onclose = handleReconnect;

      ws.onerror = (error) => {
        handleReconnect();
      };
    };

    const handleReconnect = () => {
  
      setSocket(null);
      setIsConnected(false);
      clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(() => {
 
        setReconnectAttempts((attempts) => attempts + 1);
        connect();
      }, 1000);
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      // console.error('WebSocket is not connected');
    }
  }, [socket]);

  return (
    <NotifWSContext.Provider value={{ sendMessage, isConnected, notif }}>
      {children}
    </NotifWSContext.Provider>
  );
}

export function useNotificationWS() {
  return useContext(NotifWSContext);
}
