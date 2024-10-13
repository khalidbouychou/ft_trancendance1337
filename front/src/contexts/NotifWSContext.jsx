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
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_NOTIFICATION') {
        if (data.notif_type === 'FR') {
          console.log('New friend request:', data.FR_notification);
        } else if (data.notif_type === 'GR') {
          console.log('New game request:', data.GR_notification);
        } else {
          console.error('Unknown notification type:', data.notif_type);
        }
      }
      else if (data.type === 'NOTIFICATION_ACCEPTED') {
        console.log('Game request accepted:', data.GR_accepted_notification);
      } else if (data.type === 'NOTIFICATION_EXPIRED') {
        console.log('Game request expired:', data.GR_expired_notification);
      } else if (data.type === 'FAILED_OPERATION') {
        console.warn('Failed operation:', data.operation, data.error);
      } else {
        console.error('Unknown message type:', data.type);
      }
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
