

import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../UserContext/Context";
import { useContext } from "react";

function PrivateRoutes() {
      const {islogged , user} = useContext(AuthContext)
      return (islogged && user) ? <Outlet /> : <Navigate to="/login" />;
}
export default PrivateRoutes;