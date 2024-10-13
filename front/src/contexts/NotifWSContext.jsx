import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotifWSContext = createContext();

export function NotificationWebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ws = new WebSocket(`ws://10.11.9.12:8000/ws/notif/?token=${token}`);

    ws.onopen = () => {
      console.log('Notification WebSocket connected');
      setSocket(ws);
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      console.log('Notification WebSocket message:', event.data);
    };

    ws.onclose = () => {
      console.log('Notification WebSocket disconnected');
      setSocket(null);
      setIsConnected(false);
      // setTimeout(() => {
      //   console.log('Attempting to reconnect...');
      //   connect();
      // }, 3000);
    };

    ws.onerror = (error) => {
      console.error('Notification WebSocket error:', error);
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }, [socket]);

  return (
    <NotifWSContext.Provider value={{ sendMessage, isConnected }}>
      {children}
    </NotifWSContext.Provider>
  );
}

export function useNotificationWS() {
  return useContext(NotifWSContext);
}
