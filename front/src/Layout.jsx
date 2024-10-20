import Sidebar from "./components/SideBar/Sidebar";
import style from "./App.module.css";
import { Outlet } from "react-router-dom";
import { NotificationWebSocketProvider } from "./contexts/NotifWSContext.jsx";
import { LocationProvider } from "./contexts/LocationContext.jsx";
import AuthProvider from "./UserContext/Context.jsx";

const Layout = () => {
  return (
    // <AuthProvider>

    <div className={style.EntirePage}>
      <NotificationWebSocketProvider>
        <LocationProvider>
          <Sidebar />
          <Outlet />
        </LocationProvider>
      </NotificationWebSocketProvider>
    </div>
    // </AuthProvider>
  );
};

export default Layout;
