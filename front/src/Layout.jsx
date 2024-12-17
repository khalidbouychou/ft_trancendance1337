import Sidebar from "./components/SideBar/Sidebar";
import style from "./App.module.css";
import { Outlet } from "react-router-dom";
import {useLocation} from 'react-router-dom';
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "./UserContext/Context";

import { GridLoader } from "react-spinners";
import { useState } from "react";
import Notification from "./notification/notification.jsx";

const Layout = () => {
  const location = useLocation();
 const {user,get_auth_user} = useContext(AuthContext);
 const [loading, setLoading] = useState(true);

 useEffect(() => { 
   get_auth_user()
 }
 , [location.pathname])

 useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false);
  }, 1200);
  return () => clearTimeout(timer); 
}, [location.pathname]);

  return (
    
    loading ?   <div 
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}
  >
    <GridLoader color="#fff" loading={loading} size={20} />
  </div> :
    <div className={style.EntirePage}>
      {user && <Notification />}
          {( location.pathname !== "/login" && location.pathname !== "/otp") &&  <Sidebar /> } 
           <Outlet />
    </div>
  );
};

export default Layout;
