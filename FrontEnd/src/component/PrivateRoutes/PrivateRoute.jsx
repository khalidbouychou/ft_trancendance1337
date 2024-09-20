

// import { Children, useContext, useEffect } from "react";
import {  Navigate, Outlet } from "react-router-dom";
// import { authContext } from "../Context/Context";



function PrivateRoutes() {
let auth = {'token':false}
return (

      !auth.token ?
      <Navigate to='/login'/>
      :
      <Outlet/>
)
}
export default PrivateRoutes;
