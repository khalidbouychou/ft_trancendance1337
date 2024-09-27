import { useContext } from "react";
import { AuthContext } from "../UserContext/Context";
import { Navigate, Outlet } from "react-router-dom";
import Login from "../Login/Login";

const RequireAuth = () => {
    const {user} = useContext(AuthContext);
    return (user.token ? <Outlet/>  : <Navigate to={<Login/>}/>);
}

export default RequireAuth
