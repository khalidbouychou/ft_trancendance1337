import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotifWSContext = createContext();

export function NotificationWebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notif, setNotif] = useState(null);
  let Interval = null;
  let ws = null;

  useEffect(() => {

    const connect = () => {
      try {
        ws = new WebSocket(`ws://localhost:8000/ws/notif/`);
      } catch (error) {
        console.log("Failed to connect to WebSocket:", error);
        return;
      }

      ws.onopen = () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'CONNECTED' }));
          console.log("Connected to notif WebSocket");
        }
        setSocket(ws);
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setNotif(data.notification);
      };

      ws.onclose = () => {
        setIsConnected(false);
      }

      ws.onerror = () => {
        console.log("WebSocket error. Attempting to reconnect...");
        setIsConnected(false);
      };
    };

    Interval = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'CONNECTED' }));
      }
      else
        console.log("socket is closed or not ready of notif WebSocket");
      console.log("Reconnecting to notif WebSocket...");
      setIsConnected(true);
    }, 1000);

    connect();

    return () => {
      if (Interval) {
        clearInterval(Interval);
        Interval = null;
      }
      if (ws) {
        ws.close();
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
