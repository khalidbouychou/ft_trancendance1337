import "./App.css";
import {  Route, Routes } from "react-router-dom";
import Otp from "./component/Otp/Otp.jsx";

import ContextProvider from "./component/Context/Context.jsx";
import Login from "./component/Login/Login.jsx";
import NotPageFound from "./component/Layout/NoPageFound/NoPageFound.jsx";
import PrivateRoute from "./component/PrivateRoutes/PrivateRoute.jsx";
import Sidebar from "./component/Sidebar/Sidebar.jsx";

function App() {

  return (
  
      <ContextProvider>
          {location.pathname !== "/login" && <Sidebar />}
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotPageFound />} />

          <Route path="/" element={<PrivateRoute />}>
            <Route path="home" element={<div>home</div>} />
            <Route path="otp" element={<Otp />} />
            <Route path="chat" element={<div>chat</div>} />
            <Route path="game" element={<div>game</div>} />
            <Route path="profil" element={<div>profil</div>} />
            <Route path="setting" element={<div>setting</div>} />
            <Route path="notification" element={<div>notification</div>} />
          </Route>
        </Routes>
      </ContextProvider>
  );
}
export default App;
