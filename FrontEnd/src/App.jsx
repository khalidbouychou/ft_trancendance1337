import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Otp from "./component/Otp/Otp";

import ContextProvider from "../src/component/Context/Context";
// import Layout from "./component/Layout/Layout";
import Login from "./component/Login/Login";
import {  useState } from "react";
import NotPageFound from "../src/component/Layout/NoPageFound/NoPageFound.jsx";
// import Twofa from "/goinfre/khbouych/ft_trancendance1337-2/FrontEnd/src/component/Twofa/Towfa";
function App() {
  function PrivateRoute() {
    const [token,setToken] = useState("document.cookie.split('=')[1]");
    console.log("********************* > ",token)
    if (!token) return <Navigate to="/login" />;
    return (
      <>
        <Outlet />
      </>
    );
  }

  return (
      <BrowserRouter>
    <ContextProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotPageFound />} />
  
          <Route path="/" element={<PrivateRoute />}>
            <Route path="home" element={<div>home</div>} />
            <Route path="/otp" element={<Otp />} />
            {/* <Route path="/twofa" element={<Twofa />} /> */}
            <Route path="/chat" element={<div>chat</div>} />
            <Route path="/game" element={<div>game</div>} />
            <Route path="/profil" element={<div>profil</div>} />
            <Route path="/setting" element={<div>setting</div>} />
            <Route path="/notification" element={<div>notification</div>} />
          </Route>
        </Routes>
    </ContextProvider>
      </BrowserRouter>
  );
}
export default App;
