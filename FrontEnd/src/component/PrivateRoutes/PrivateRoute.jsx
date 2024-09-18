

import { useContext, useEffect } from "react";
import {  Outlet } from "react-router-dom";
import { authContext } from "../Context/Context";



function PrivateRoute() {
const {verifytoken} = useContext(authContext);
useEffect(() => {
  verifytoken();
}
, [window.location.pathname]);
  return (
    <>
      <Outlet />
    </>
  );
}
export default PrivateRoute;
