


import { Navigate, Outlet } from "react-router-dom";
// import { AuthContext } from "../UserContext/Context";
// import { useContext, useEffect } from "react";

function PrivateRoutes() {
      // const {islogged , user} = useContext(AuthContext)
      const logged = localStorage.getItem("logged");
      return (logged) ? <Outlet /> : <Navigate to="/login" />;
}
export default PrivateRoutes;