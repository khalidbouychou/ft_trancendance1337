import Sidebar from "./components/SideBar/Sidebar";
import style from "./App.module.css";
import { Outlet } from "react-router-dom";
import { NotificationWebSocketProvider } from "./contexts/NotifWSContext.jsx";
import { LocationProvider } from "./contexts/LocationContext.jsx";
import AuthProvider from "./UserContext/Context.jsx";

import {useLocation} from 'react-router-dom';
import { useEffect } from "react";

const Layout = () => {
  const location = useLocation();
  useEffect(() => {
    
    console.log(location.pathname);
  }, [location.pathname]);
  return (
    // <AuthProvider>

    <div className={style.EntirePage}>
      {/* <NotificationWebSocketProvider>
        <LocationProvider> */}
          {( location.pathname !== "/login" || location.pathname !== "/Logout") &&  <Sidebar /> }
          <Outlet />
        {/* </LocationProvider>
      </NotificationWebSocketProvider> */}
    </div>
    // </AuthProvider>
  );
};

export default Layout;
