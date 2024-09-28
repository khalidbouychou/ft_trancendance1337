import "./App.css";
import { Route, Routes } from "react-router-dom";
import Otp from "./component/Otp/Otp.jsx";
// import AuthProvider, { AuthContext } from "./component/UserContext/Context.jsx";
import Login from "./component/Login/Login.jsx";
// import NotPageFound from "./component/Layout/NoPageFound/NoPageFound.jsx";
// import Sidebar from "./component/Sidebar/Sidebar.jsx";
import HomePage from "./component/HomePage/HomePage.jsx";
// import { useContext } from "react";
import RequireAuth from "./component/RequireAuth/RequireAuth.jsx";
import Chat from "./component/Chat/Chat.jsx";
import Profile from "./component/Profile/Profile.jsx";

// import Notification from "./component/Notification/Notification.jsx";

// const Profil = () => {
//   return <h1>Profile</h1>;
// };

// const Chat = () => {
//   return <h1>Chat</h1>;
// };

import { Link } from "react-router-dom";
import AuthProvider from "./component/UserContext/Context.jsx";

const Game = () => {
  return (
    <>
      <h1>Game</h1>
      <Link to="/chat">chat</Link>
      <br />
      <Link to="/game">game</Link>
      <br />
      <Link to="/profil">profil</Link>
      <br />
      <Link to="/setting">setting</Link>
      <br />
      <Link to="/otp">otp</Link>
    </>
  );
};

const Setting = () => {
  return <h1>Setting</h1>;
};

const Notification = () => {
  return <h1>Notification</h1>;
};

// const NotPageFound = () => {
//   return <h1>NotPageFound</h1>;
// };

function App() {
  return (
    <AuthProvider>

    <Routes>
      {/* Protected Routes */}
      <Route element={<RequireAuth />}>
        <Route path="/" element={<HomePage />}>
          <Route path="profil" element={<Profile />} />
          <Route path="chat" element={<Chat />} />
          <Route path="game" element={<Game />} />
          <Route path="setting" element={<Setting />} />
          <Route path="notifications" element={<Notification />} />
          <Route path="otp" element={<Otp />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />

      {/* Public Routes */}
      {/* <Route path="*" element={<NotPageFound />} /> */}
    </Routes>
    </AuthProvider>
  );
}
export default App;
