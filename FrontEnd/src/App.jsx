import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Otp from "./component/Otp/Otp.jsx";
import AuthProvider, { AuthContext } from "./component/UserContext/Context.jsx";
import Login from "./component/Login/Login.jsx";
// import NotPageFound from "./component/Layout/NoPageFound/NoPageFound.jsx";
import Sidebar from "./component/Sidebar/Sidebar.jsx";
import HomePage from "./component/HomePage/HomePage.jsx";
import { useContext } from "react";
import RequireAuth from "./component/RequireAuth/RequireAuth.jsx";

const Profil = () => {
  return <h1>Profile</h1>;
};

const Chat = () => {
  return <h1>Chat</h1>;
};

const Game = () => {
  return <h1>Game</h1>;
};

const Setting = () => {
  return <h1>Setting</h1>;
};

const Notification = () => {
  return <h1>Notification</h1>;
};

const NotPageFound = () => {
  return <h1>NotPageFound</h1>;
};

function App() {
  return (
    
     
      
        <Routes>
          {/* private routes */}
           <Route element={<RequireAuth />}>
              <Route path="/home" element={<HomePage />}>
                  <Route path="profil" element={<Profil />} />
                  <Route path="chat" element={<Chat />} />
                  <Route path="game" element={<Game />} />
                  <Route path="setting" element={<Setting />} />
                  <Route path="notifications" element={<Notification />} />
                  <Route path="otp" element={<Otp />} />
              </Route>
           </Route>
          {/* public routes  */}
          <Route path="*" element={<NotPageFound />} />
          <Route path="/login" element={<Login />} />
        </Routes>
  );
}
export default App;
