import Sidebar from "./components/SideBar/Sidebar";
import style from './App.module.css';
import { Outlet } from "react-router-dom";
const Layout = () => {
    return (
        <div className={style.EntirePage}>
            <Sidebar />
            <Outlet />
        </div>
    );
};

export default Layout;
