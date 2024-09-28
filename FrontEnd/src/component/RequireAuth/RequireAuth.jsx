import { useContext, useEffect} from "react";
import { AuthContext } from "../UserContext/Context";
import { Navigate, Outlet } from "react-router-dom";



const RequireAuth = () => {
    const { user , auth } = useContext(AuthContext);

    useEffect(() => {
        auth();
    }
    ,[user , auth]);

    return user && user.is_logged && user.access ? <Outlet /> : <Navigate to="/login" />;
}

export default RequireAuth
