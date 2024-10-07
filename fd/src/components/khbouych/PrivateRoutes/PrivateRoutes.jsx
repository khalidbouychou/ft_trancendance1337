

import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../UserContext/Context";
import { useContext, useEffect } from "react";

function PrivateRoutes() {
      const {islogged , user} = useContext(AuthContext)
      useEffect(() => {
            console.log(user);
            console.log(islogged);
      }, [user, islogged])
      return (islogged && user) ? <Outlet /> : <Navigate to="/login" />;
}
export default PrivateRoutes;