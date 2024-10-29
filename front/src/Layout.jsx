import Sidebar from "./components/SideBar/Sidebar";
import style from "./App.module.css";
import { Outlet } from "react-router-dom";
// import { NotificationWebSocketProvider } from "./contexts/NotifWSContext.jsx";
// import { LocationProvider } from "./contexts/LocationContext.jsx";
// import AuthProvider from "./UserContext/Context.jsx";

import {useLocation} from 'react-router-dom';
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "./UserContext/Context";


const Layout = () => {
  const location = useLocation();
 const {user ,get_auth_user} = useContext(AuthContext);

  useEffect(() => {
    !user && get_auth_user()
  }
  , [])
  return (
    <div className={style.EntirePage}>
          {( location.pathname !== "/login" || location.pathname !== "/Logout") &&  <Sidebar /> }
          <Outlet />
    </div>
  );
};

export default Layout;
