import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import styles from './notification.module.css';
import { ToastContainer, toast } from "react-toastify";


const Notification = () => {
    useEffect(() => {
        // Create a socket instance
        const socket = new WebSocket(`ws://localhost:8000/ws/notif/`);

        socket.onopen = () => {
            console.log('Notification socket connected');
            // toast.success("notification socket is opened", {
            //     position: "top-left",
            //     autoClose: 1000,
            //     closeOnClick: true
            //   });
        };
    
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Notification socket recieved:", data);
            toast.success("notification socket recieved something", {
                position: "top-left",
                autoClose: 1000,
                closeOnClick: true
              });
        };
    
        socket.onclose = () => {
            console.log('Notification socket closed');
            toast.success("notification socket closed", {
                position: "top-left",
                autoClose: 1000,
                closeOnClick: true
              });
        };
    
        socket.onerror = () => {
            console.log('Notification socket error');
        };

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, []);

    return (
        <div className={styles.notification}>
            <ToastContainer />
        </div>
    );
};

export default Notification;