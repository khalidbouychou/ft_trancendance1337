import { useNavigate } from 'react-router-dom';
import Sidebar from "./components/SideBar/Sidebar";
import style from "./App.module.css";
import { Navigate, Outlet } from "react-router-dom";
import { NotificationWebSocketProvider } from "./contexts/NotifWSContext.jsx";
import { LocationProvider } from "./contexts/LocationContext.jsx";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./UserContext/Context.jsx";

import Cookies from 'js-cookie';
const Layout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate()
  const token = localStorage.getItem('token');

  useEffect(() => {
    // console.log("user ------ >", user);
    !user && navigate("/login");
  }, [location.pathname]);

  return (
    <div className={style.EntirePage}>
      <NotificationWebSocketProvider>
        <LocationProvider>
          <Sidebar />
          <Outlet />
        </LocationProvider>
      </NotificationWebSocketProvider>
    </div>
  );
};

export default Layout;
