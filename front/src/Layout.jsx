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
import { useNavigate } from "react-router-dom";


const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
 const {user ,get_auth_user} = useContext(AuthContext);

  useEffect(() => {
    console.log("layout user", user)
    user ? get_auth_user(): navigate("/login")
  }
  , [location.pathname])
  return (
    <div className={style.EntirePage}>
          {( location.pathname !== "/login" && location.pathname !== "/twofa" ) &&  <Sidebar /> }
          <Outlet />
    </div>
  );
};

export default Layout;
