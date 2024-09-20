import {  Navigate, Outlet } from "react-router-dom";

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