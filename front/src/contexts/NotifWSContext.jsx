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
      let ws;
      try {
        ws = new WebSocket(`ws://localhost:8000/ws/notif/`);
      } catch (error) {
        handleReconnect();
        return;
      }

      ws.onopen = () => {
        // console.log('Notification WebSocket connected');
        setSocket(ws);
        setIsConnected(true);
        setReconnectAttempts(0);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // console.log(data.type, ':', data.notification);
        setNotif(data.notification);
      };

      ws.onclose = handleReconnect;

      ws.onerror = (error) => {
        handleReconnect();
      };
    };

    const handleReconnect = () => {
      // console.log('Notification WebSocket disconnected or encountered an error');
      setSocket(null);
      setIsConnected(false);
      clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(() => {
        // console.log('Attempting to reconnect...');
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
