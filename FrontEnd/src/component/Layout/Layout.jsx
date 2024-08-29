import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

import "./Layout.css";


const Layout = () => {

  const location = useLocation();
  const hideSidebar = location.pathname === '/otp' || location.pathname === '/login' 
  return (
    <div className="layout">
      {!hideSidebar && <Sidebar />} 
      <div className="content">
        <Outlet /> 
      </div>
    </div>
  )
}

export default Layout
