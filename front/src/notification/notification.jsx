import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import styles from './notification.module.css';

const [message, setMessage] = useState(null);

const Notification = () => {
    useEffect(() => {
        // Create a socket instance
        const socket = new WebSocket(`ws://localhost:8000/ws/notif/`);

        socket.onopen = () => {
            console.log('Notification socket connected');
        };
    
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Notification socket recieved:", data);
        };
    
        socket.onclose = () => {
            console.log('Notification socket closed');
        };
    
        socket.onerror = () => {
            console.log('Notification socket error');
        };
    }, []);

    return (
        <div className={styles.notification}>
            <h1>{message}</h1>
        </div>
    );
};

export default Notification;