import { color } from "chart.js/helpers";
import Sidebar from "./components/SideBar/Sidebar";
import style from './App.module.css';
import { Outlet } from "react-router-dom";
const Layout = ({ children }) => {
    return (
        <div className={style.EntirePage}>
            <Sidebar />
            <Outlet />
            {/* {Array.isArray(children) ? children : [children]} */}
        </div>
    );
};

export default Layout;
